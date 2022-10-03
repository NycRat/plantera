use mysql::prelude::*;
use mysql::*;
use rocket::futures::lock::Mutex;
use rocket::State;

#[get("/plant/list?<username>")]
pub async fn get_plant_list(username: &str, conn_mutex: &State<Mutex<PooledConn>>) -> String {
    let mut conn = conn_mutex.lock().await;
    let query_string = format!("SELECT plants from users where username = {}", username);
    // let test: vec<string> = conn.query(&query_string).unwrap();
    return match conn.query_first::<String, &String>(&query_string) {
        Ok(a) => {
            if let Some(x) = a {
                return x;
            }
            "[]".into()
        }
        Err(_err) => "[]".into(),
    };
}

#[post("/plant/new?<username>")]
pub async fn post_plant_new(username: &str, conn_mutex: &State<Mutex<PooledConn>>) -> &'static str {
    let plant_id = 5;

    let mut conn = conn_mutex.lock().await;
    let query_string = format!(
        "UPDATE users SET plants = JSON_ARRAY_APPEND(plants, \"$\", {}) WHERE username = {}",
        plant_id, username
    );
    match conn.query_drop(query_string) {
        Ok(_) => {
            return "Successfully created plant";
        }
        Err(err) => {
            println!("{:?}", err);
        }
    }
    return "Error creating new plant";
}
