use crate::models::plant::Plant;
use crate::utils::{
    get_authorized_username, get_image_from_request_data, get_plant_from_request_data, get_plant_id,
};
use mysql::prelude::*;
use mysql::*;
use rocket::futures::lock::Mutex;
use rocket::http::Status;
use rocket::{Data, State};

use crate::authentication::TokenAuthentication;

#[get("/plant/list?<username>")]
pub async fn get_plant_list(
    username: &str,
    conn_mutex: &State<Mutex<PooledConn>>,
) -> (Status, String) {
    let mut conn = conn_mutex.lock().await;
    let query_string = format!("SELECT plants from users where username = {}", username);

    let plant_ids = conn.query_first::<String, &String>(&query_string).unwrap();
    if let Some(some_plant_ids) = plant_ids {
        let plant_id_arr = rocket::serde::json::from_str::<Vec<String>>(&some_plant_ids).unwrap();
        if plant_id_arr.len() == 0 {
            return (Status::Ok, "[]".into());
        }

        let mut where_str = "".to_owned();
        for plant in plant_id_arr {
            where_str += "id = '";
            where_str += &plant.to_string();
            where_str += "' OR ";
        }

        let where_str = &where_str[0..where_str.len() - 4];

        let plant_str_arr: Vec<(String, String, u64, u64)> = conn
            .query(format!(
                "SELECT name, note, last_watered, watering_interval FROM plants WHERE {}",
                where_str
            ))
            .unwrap();

        let plant_arr: Vec<Plant> = plant_str_arr
            .iter()
            .map(|(name, note, last_watered, watering_interval)| Plant {
                name: name.to_string(),
                note: note.to_string(),
                last_watered: *last_watered,
                watering_interval: *watering_interval,
            })
            .collect();

        return (
            Status::Ok,
            rocket::serde::json::to_string(&plant_arr).unwrap(),
        );
    } else {
        return (Status::NotFound, "".into());
    }
}

#[get("/plant/image?<index>")]
pub async fn get_plant_image(
    index: usize,
    conn_mutex: &State<Mutex<PooledConn>>,
    token_auth: TokenAuthentication,
) -> (Status, Vec<u8>) {
    let mut conn = conn_mutex.lock().await;

    let username = get_authorized_username(&mut conn, token_auth.0);

    if let Some(username) = username {
        let plant_id = get_plant_id(&mut conn, &username, index);
        if let Some(plant_id) = plant_id {
            let query_string = format!("SELECT image FROM plants WHERE id = '{}'", plant_id);

            match conn.query_first::<mysql::Value, String>(query_string) {
                Ok(image) => {
                    if let Some(image) = image {
                        match image {
                            mysql::Value::Bytes(bytes) => {
                                return (Status::Ok, bytes);
                            }
                            mysql::Value::NULL => {
                                return (Status::Ok, "".into());
                            }
                            _ => {
                                return (Status::InternalServerError, "".into());
                            }
                        }
                    }
                }
                Err(_) => {}
            }
        }
        return (Status::NotFound, "".into());
    }

    return (Status::Unauthorized, "".into());
}

#[post("/plant/new", data = "<data>")]
pub async fn post_plant_new(
    data: Data<'_>,
    conn_mutex: &State<Mutex<PooledConn>>,
    token_auth: TokenAuthentication,
) -> Status {
    let plant = get_plant_from_request_data(data).await;
    if plant.is_none() {
        return Status::BadRequest;
    }
    let plant = plant.unwrap();

    let mut conn = conn_mutex.lock().await;

    let username = get_authorized_username(&mut conn, token_auth.0);
    if let Some(username) = username {
        let get_user_id = format!(
            "(SELECT username from users WHERE username = '{}')",
            username
        );

        let plant_id = uuid::Uuid::new_v4().to_string();
        let insert_plant_table_str = format!(
            "INSERT INTO plants (id, name, note, user, watering_interval) VALUES ('{}', '{}', '{}', {}, {})",
            &plant_id, &plant.name, &plant.note, &get_user_id, &plant.watering_interval
        );
        conn.query_drop(insert_plant_table_str).unwrap();

        let insert_user_plants_str = format!(
            // "UPDATE users SET plants = JSON_ARRAY_APPEND(plants, '$', '{}') WHERE username = '{}'",
            "UPDATE users SET plants = JSON_ARRAY_INSERT(plants, '$[0]', '{}') WHERE username = '{}'",
            plant_id, username
        );
        conn.query_drop(insert_user_plants_str).unwrap();
        return Status::Created;
    } else {
        return Status::Unauthorized;
    }
}

#[post("/plant/update?<index>", data = "<data>")]
pub async fn post_plant_update(
    index: usize,
    data: Data<'_>,
    conn_mutex: &State<Mutex<PooledConn>>,
    token_auth: TokenAuthentication,
) -> Status {
    let plant = get_plant_from_request_data(data).await;
    if plant.is_none() {
        return Status::BadRequest;
    }
    let plant = plant.unwrap();

    let mut conn = conn_mutex.lock().await;

    let username = get_authorized_username(&mut conn, token_auth.0);
    if let Some(username) = username {
        let plant_id = get_plant_id(&mut conn, &username, index);
        if let Some(plant_id) = plant_id {
            let query_string = format!("UPDATE plants SET name = '{}', note = '{}', last_watered = {}, watering_interval = {} WHERE id = '{}' AND user = '{}'",
                                       plant.name,
                                       plant.note,
                                       plant.last_watered,
                                       plant.watering_interval,
                                       plant_id,
                                       username
                                       );

            conn.query_drop(query_string).unwrap();
            return Status::Ok;
        }
        return Status::NotFound;
    }

    return Status::Unauthorized;
}

#[post("/plant/image?<index>", data = "<data>")]
pub async fn post_plant_image(
    index: usize,
    conn_mutex: &State<Mutex<PooledConn>>,
    token_auth: TokenAuthentication,
    data: Data<'_>,
) -> Status {
    let image_bytes = get_image_from_request_data(data).await;

    if image_bytes.is_none() {
        return Status::BadRequest;
    }
    let image_bytes = image_bytes.unwrap();

    let mut conn = conn_mutex.lock().await;
    let username = get_authorized_username(&mut conn, token_auth.0);

    if let Some(username) = username {
        let plant_id = get_plant_id(&mut conn, &username, index);
        if let Some(plant_id) = plant_id {
            let stuff = &image_bytes;

            let query_string = format!(
                "UPDATE plants SET image = '{}' WHERE id = '{}'",
                stuff, plant_id
            );

            conn.query_drop(query_string).unwrap();
            return Status::Ok;
        }

        return Status::NotFound;
    }

    return Status::Unauthorized;
}

#[delete("/plant?<index>")]
pub async fn delete_plant(
    index: usize,
    conn_mutex: &State<Mutex<PooledConn>>,
    token_auth: TokenAuthentication,
) -> Status {
    let mut conn = conn_mutex.lock().await;

    let username = get_authorized_username(&mut conn, token_auth.0);
    if let Some(username) = username {
        let plant_id = get_plant_id(&mut conn, &username, index);
        if let Some(plant_id) = plant_id {
            let query_string = format!("DELETE FROM plants WHERE id = '{}'", plant_id);
            let query_string_2 = format!(
                "UPDATE users SET plants = JSON_REMOVE(plants, '$[{}]') WHERE username = '{}'",
                index, username
            );
            conn.query_drop(&query_string).unwrap();
            conn.query_drop(&query_string_2).unwrap();
            return Status::Ok;
        }
        return Status::NotFound;
    }
    return Status::Unauthorized;
}
