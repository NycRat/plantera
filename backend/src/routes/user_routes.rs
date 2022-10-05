use mysql::prelude::*;
use mysql::*;
use rocket::futures::lock::Mutex;
use rocket::http::Status;
use rocket::State;

use crate::authentication::{Authentication, AuthenticationStatus};

#[get("/user/list")]
pub async fn get_user_list(conn_mutex: &State<Mutex<PooledConn>>) -> (Status, String) {
    let mut conn = conn_mutex.lock().await;
    let user_list = conn
        .query_map("SELECT username from users", |username: String| username)
        .unwrap();
    let user_list_string = rocket::serde::json::to_string(&user_list).unwrap();

    return (Status::Ok, user_list_string);
}

#[post("/user/new")]
pub async fn post_user_new(
    auth: Authentication,
    conn_mutex: &State<Mutex<PooledConn>>,
) -> (Status, String) {
    // TODO - Add email
    let mut conn = conn_mutex.lock().await;

    match auth.0 {
        AuthenticationStatus::Valid => {
            let login_info = auth.1.unwrap();

            let query_string = format!(
                "INSERT INTO users (username, password, plants) 
                VALUES (\"{}\", MD5(\"{}\"), JSON_ARRAY())",
                &login_info.user_id,
                format!("{}{}", &login_info.user_id, &login_info.password)
            );
            match conn.query_drop(&query_string) {
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
                            println!("{:?}", err);
                            return (Status::InternalServerError, "".into());
                        }
                    }
                }
            }
            // println!("{:?}", login_info);
            return (Status::Created, "".into());
        }
        _ => {
            return (Status::BadRequest, format!("{:?}", auth.0));
        }
    }
}
