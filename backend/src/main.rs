#[macro_use]
extern crate rocket;

use models::User;
use utils::string_to_array;
use mysql::prelude::*;
use mysql::*;
use rocket::State;
use rocket::futures::lock::Mutex;

pub mod models;
pub mod utils;

#[get("/")]
async fn index(conn_mutex: &State<Mutex<PooledConn>>) -> String {
    let mut conn = conn_mutex.lock().await;
    let res = conn.query_map("SELECT * from users", |(id, username, plants): (i32, String, String)| {
        let plants = match string_to_array::<i32>(plants) {
            Ok(arr) => arr,
            Err(_) => vec![],
        };

        User {
            id,
            username,
            plants,
        }
    });

    return format!("{:?}", res);
}

#[launch]
async fn rocket() -> _ {
    dotenv::dotenv().ok();

    let url = std::env::var("DATABASE_URL").unwrap();
    let pool = Pool::new(&url as &str).unwrap();
    let conn = pool.get_conn().unwrap();

    use rocket::http::Method;
    use rocket_cors::{AllowedOrigins, CorsOptions};

    let cors = CorsOptions::default()
        .allowed_origins(AllowedOrigins::all())
        .allowed_methods(
            vec![Method::Get, Method::Post, Method::Delete]
                .into_iter()
                .map(From::from)
                .collect(),
        )
        .allow_credentials(true);

    rocket::build()
        .attach(cors.to_cors().unwrap())
        .manage(Mutex::new(conn))
        .mount("/api", routes![index])
}
