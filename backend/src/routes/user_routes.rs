use mysql::prelude::*;
use mysql::*;
use rocket::data::ToByteUnit;
use rocket::futures::lock::Mutex;
use rocket::http::Status;
use rocket::{Data, State};

use crate::models::user::{LoginInfo, User};

#[get("/users/list")]
pub async fn get_users_list(conn_mutex: &State<Mutex<PooledConn>>) -> (Status, String) {
    let mut conn = conn_mutex.lock().await;
    let mut is_err = false;
    let res = conn.query_map(
        "SELECT username, plants from users",
        |(username, plants): (String, String)| {
            let plants = match rocket::serde::json::from_str(&plants) {
                Ok(arr) => arr,
                Err(err) => {
                    is_err = true;
                    println!("{:?}", err);
                    vec![]
                }
            };

            User { username, plants }
        },
    );

    if is_err {
        return (Status::InternalServerError, "".into());
    }

    match res {
        Ok(res) => match rocket::serde::json::to_string(&res) {
            Ok(serialized_res) => {
                return (Status::Ok, serialized_res);
            }
            Err(err) => println!("{:?}", err),
        },
        Err(err) => println!("{:?}", err),
    }
    return (Status::InternalServerError, "".into());
}

#[post("/user/new", data = "<data>")]
pub async fn post_user_new(data: Data<'_>, conn_mutex: &State<Mutex<PooledConn>>) -> Status {
    let mut conn = conn_mutex.lock().await;

    match data.open(1.kilobytes()).into_string().await {
        Ok(data_str) => {
            let login_info: LoginInfo = rocket::serde::json::from_str(&data_str.value).unwrap();
            let query_string = format!(
                "INSERT INTO users (username, password, plants) 
                    VALUES (\"{}\", MD5(\"{}\"), JSON_ARRAY())",
                &login_info.username,
                format!("{}{}", &login_info.username, &login_info.password)
            );
            // println!("{}", query_string);
            match conn.query_drop(query_string) {
                Ok(_) => {}
                Err(err) => {
                    match err {
                        mysql::Error::MySqlError(err) => {
                            // DUPLICATE ENTRY ERROR CODE = 1062
                            if err.code == 1062 {
                                return Status::Conflict;
                            }
                        }
                        _ => {
                            println!("{:?}", err)
                        }
                    }
                }
            }
            println!("{:?}", login_info);
            return Status::Created;
        }
        Err(err) => println!("{:?}", err),
    }

    return Status::InternalServerError;
}
