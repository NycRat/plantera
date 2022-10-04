use crate::utils::is_authorized;
use mysql::prelude::*;
use mysql::*;
use rocket::data::ToByteUnit;
use rocket::futures::lock::Mutex;
use rocket::http::Status;
use rocket::{Data, State};

use crate::authentication::{Authentication, AuthenticationStatus};

#[get("/plant/list?<username>")]
pub async fn get_plant_list(
    username: &str,
    conn_mutex: &State<Mutex<PooledConn>>,
) -> (Status, String) {
    let mut conn = conn_mutex.lock().await;
    let query_string = format!("SELECT plants from users where username = {}", username);

    let plant_ids = conn.query_first::<String, &String>(&query_string).unwrap();
    if let Some(some_plant_ids) = plant_ids {
        let plant_id_arr = rocket::serde::json::from_str::<Vec<u32>>(&some_plant_ids).unwrap();
        if plant_id_arr.len() == 0 {
            return (Status::Ok, "[]".into());
        }

        let mut where_str = "".to_owned();
        for plant in plant_id_arr {
            where_str += "ID = ";
            where_str += &plant.to_string();
            where_str += " OR ";
        }

        let where_str = &where_str[0..where_str.len() - 4];

        let plant_name_arr = conn
            .query::<String, String>(format!("SELECT name FROM plants WHERE {}", where_str))
            .unwrap();

        return (
            Status::Ok,
            rocket::serde::json::to_string(&plant_name_arr).unwrap(),
        );
    } else {
        return (Status::NotFound, "".into());
    }
}

#[post("/plant/new", data = "<data>")]
pub async fn post_plant_new(
    data: Data<'_>,
    conn_mutex: &State<Mutex<PooledConn>>,
    auth: Authentication,
) -> Status {
    let name = data.open(1.kilobytes()).into_string().await.unwrap();
    let trimmed_name = name.trim();
    if trimmed_name.len() == 0 {
        return Status::BadRequest;
    }

    let mut conn = conn_mutex.lock().await;

    match auth.0 {
        AuthenticationStatus::Valid => {
            let login_info = auth.1.unwrap();

            if !is_authorized(&mut conn, &login_info) {
                return Status::Unauthorized;
            }

            // TODO - actually do the plant ID
            let query_string = format!(
                "UPDATE users SET plants = JSON_ARRAY_APPEND(plants, \"$\", JSON_LENGTH(plants)) WHERE username = \"{}\"",
                login_info.user_id
            );

            conn.query_drop(query_string).unwrap();
            let two = format!("INSERT INTO plants (name) VALUES (\"{}\")", &trimmed_name);
            conn.query_drop(two).unwrap();
            return Status::Created;
        }
        _ => {
            return Status::Unauthorized;
        }
    }
}
