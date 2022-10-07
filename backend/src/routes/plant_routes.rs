use crate::models::plant::Plant;
use crate::utils::get_authorized_username;
use mysql::prelude::*;
use mysql::*;
use rocket::data::ToByteUnit;
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
            where_str += "id = \"";
            where_str += &plant.to_string();
            where_str += "\" OR ";
        }

        let where_str = &where_str[0..where_str.len() - 4];

        let plant_str_arr: Vec<(String, u64, u64)> = conn
            .query(format!(
                "SELECT name, last_watered, watering_interval FROM plants WHERE {}",
                where_str
            ))
            .unwrap();

        let plant_arr: Vec<Plant> = plant_str_arr
            .iter()
            .map(|(name, last_watered, watering_interval)| Plant {
                name: name.to_string(),
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

#[post("/plant/new", data = "<data>")]
pub async fn post_plant_new(
    data: Data<'_>,
    conn_mutex: &State<Mutex<PooledConn>>,
    token_auth: TokenAuthentication,
) -> Status {
    let req = data.open(1.kilobytes()).into_string().await.unwrap();
    let plant_info: Plant;
    match rocket::serde::json::from_str::<Plant>(&req) {
        Ok(req) => {
            plant_info = req;
            if plant_info.name.len() == 0 {
                return Status::BadRequest;
            }
        }
        Err(err) => {
            println!("{:?}", err);
            return Status::BadRequest;
        }
    }

    let mut conn = conn_mutex.lock().await;

    let username = get_authorized_username(&mut conn, token_auth.0);
    if let Some(username) = username {
        let get_user_id = format!(
            "(SELECT username from users WHERE username = \"{}\")",
            username
        );

        let plant_id = uuid::Uuid::new_v4().to_string();
        let insert_plant_table_str = format!("INSERT INTO plants (id, name, user, watering_interval) VALUES (\"{}\", \"{}\", {}, {})", 
                                         &plant_id,
                                         &plant_info.name,
                                         &get_user_id,
                                         &plant_info.watering_interval
                                         );
        conn.query_drop(insert_plant_table_str).unwrap();

        let insert_user_plants_str = format!(
        "UPDATE users SET plants = JSON_ARRAY_APPEND(plants, \"$\", \"{}\") WHERE username = \"{}\"",
        plant_id,
        username
    );
        conn.query_drop(insert_user_plants_str).unwrap();
        return Status::Created;
    } else {
        return Status::Unauthorized;
    }
}
