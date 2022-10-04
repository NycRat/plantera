use mysql::prelude::*;
use mysql::*;
use rocket::data::ToByteUnit;
use rocket::futures::lock::Mutex;
use rocket::http::Status;
use rocket::{Data, State};

#[get("/plant/list?<username>")]
pub async fn get_plant_list(
    username: &str,
    conn_mutex: &State<Mutex<PooledConn>>,
) -> (Status, String) {
    let mut conn = conn_mutex.lock().await;
    let query_string = format!("SELECT plants from users where username = {}", username);
    // let test: vec<string> = conn.query(&query_string).unwrap();

    match conn.query_first::<String, &String>(&query_string) {
        Ok(plant_ids) => {
            if let Some(some_plant_ids) = plant_ids {
                match rocket::serde::json::from_str::<Vec<u32>>(&some_plant_ids) {
                    Ok(plant_id_arr) => {
                        let mut where_str = "".to_owned();
                        for plant in plant_id_arr {
                            where_str += "ID = ";
                            where_str += &plant.to_string();
                            where_str += " OR ";
                        }
                        let where_str = &where_str[0..where_str.len()-4];

                        match conn.query::<String, String>(format!("SELECT name FROM plants WHERE {}", where_str)) {
                            Ok(plant_name_arr) => {
                                return (Status::Ok, rocket::serde::json::to_string(&plant_name_arr).unwrap());
                            }
                            Err(err) => println!("{:?}", err)
                        }
                    }
                    Err(err) => println!("{:?}", err)
                }
            }
            return (Status::NotFound, "".into());
        }
        Err(err) => println!("{:?}", err),
    };
    return (Status::InternalServerError, "".into());
}

#[post("/plant/new?<username>", data = "<data>")]
pub async fn post_plant_new(
    username: &str,
    data: Data<'_>,
    conn_mutex: &State<Mutex<PooledConn>>,
) -> Status {
    // TODO - add authentication
    match data.open(1.kilobytes()).into_string().await {
        Ok(name) => {
            let trimmed_name = name.trim();
            if trimmed_name.len() == 0 {
                return Status::BadRequest;
            }

            let mut conn = conn_mutex.lock().await;

            // TODO - actually do the plant ID
            let query_string = format!(
                "UPDATE users SET plants = JSON_ARRAY_APPEND(plants, \"$\", JSON_LENGTH(plants)) WHERE username = {}",
                username
                );
            match conn.query_drop(query_string) {
                Ok(_) => {
                    let two = format!("INSERT INTO plants (name) VALUES (\"{}\")", &trimmed_name);
                    match conn.query_drop(two) {
                        Ok(_) => {
                            return Status::Created;
                        }
                        Err(err) => println!("{:?}", err),
                    }
                }
                Err(err) => println!("{:?}", err),
            }
        }
        Err(err) => println!("{:?}", err)
    }

    return Status::InternalServerError;
}
