use mysql::prelude::*;
use mysql::*;
use rocket::futures::lock::Mutex;
use rocket::http::Status;
use rocket::State;

use crate::authentication::{Authentication, AuthenticationStatus};

#[get("/users/list")]
pub async fn get_users_list(conn_mutex: &State<Mutex<PooledConn>>) -> (Status, String) {
    let mut conn = conn_mutex.lock().await;
    let res = conn.query_map("SELECT username from users", |username: String| username);

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

#[post("/user/new")]
pub async fn post_user_new(
    auth: Authentication,
    conn_mutex: &State<Mutex<PooledConn>>,
) -> (Status, String) {
    let mut conn = conn_mutex.lock().await;

    match auth.0 {
        AuthenticationStatus::Valid => {
            if let Some(login_info) = auth.1 {
                let query_string = format!(
                    "INSERT INTO users (username, password, plants) 
                    VALUES (\"{}\", MD5(\"{}\"), JSON_ARRAY())",
                    &login_info.user_id,
                    format!("{}{}", &login_info.user_id, &login_info.password)
                );
                // println!("{}", query_string);
                match conn.query_drop(query_string) {
                    Ok(_) => {}
                    Err(err) => {
                        match err {
                            mysql::Error::MySqlError(err) => {
                                // DUPLICATE ENTRY ERROR CODE = 1062
                                if err.code == 1062 {
                                    return (Status::Conflict, "".into());
                                }
                            }
                            _ => {
                                println!("{:?}", err)
                            }
                        }
                    }
                }
                println!("{:?}", login_info);
                return (Status::Created, "".into());
            }
        }
        _ => {
            return (Status::BadRequest, format!("{:?}", auth.0));
        }
    }

    return (Status::InternalServerError, "".into());
}
