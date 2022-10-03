use mysql::prelude::*;
use mysql::*;
use rocket::data::ToByteUnit;
use rocket::futures::lock::Mutex;
use rocket::{Data, State};

use crate::models::user::{LoginInfo, User};
use crate::utils::string_to_array;

#[get("/users/list")]
pub async fn get_users_list(conn_mutex: &State<Mutex<PooledConn>>) -> String {
    let mut conn = conn_mutex.lock().await;
    let res = conn.query_map(
        "SELECT username, plants from users",
        |(username, plants)| {
            let plants = match string_to_array::<i32>(plants) {
                Ok(arr) => arr,
                Err(_) => vec![],
            };
            let password = "".to_owned();

            User {
                username,
                password,
                plants,
            }
        },
    );

    return format!("{:?}", res.ok().unwrap());
}

#[post("/user/new", data = "<data>")]
pub async fn post_user_new(data: Data<'_>, conn_mutex: &State<Mutex<PooledConn>>) -> &'static str {
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
                    println!("{:?}", err);
                    // if err ==  {
                    // }
                    // TODO - actually confirm not other error
                    return "User already exists";
                }
            }
            println!("{:?}", login_info);
            return "User created successfully";
        }
        Err(err) => {
            println!("{:?}", err);
        }
    }

    return "Error creating User";
}
