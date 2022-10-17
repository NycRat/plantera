#[macro_use]
extern crate rocket;

use std::{thread, time};

use mysql::{prelude::Queryable, *};
use rocket::futures::lock::Mutex;

pub mod authentication;
pub mod models;
pub mod routes;
pub mod utils;

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();

    let url = std::env::var("DATABASE_URL").unwrap();
    let pool = Pool::new(&url as &str).unwrap();
    let conn = pool.get_conn().unwrap();
    let mut conn_2 = pool.get_conn().unwrap();

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

    let rocket = rocket::build()
        .attach(cors.to_cors().unwrap())
        .manage(Mutex::new(conn))
        .mount(
            "/api",
            routes![
                routes::user_routes::get_user_list,
                routes::user_routes::post_user_new,
                routes::user_routes::get_user_login,
                routes::plant_routes::get_plant_list,
                routes::plant_routes::get_plant_image,
                routes::plant_routes::post_plant_new,
                routes::plant_routes::post_plant_update,
                routes::plant_routes::post_plant_image,
                routes::plant_routes::delete_plant,
            ],
        );
    // tokio::spawn(ha(rocket));
    tokio::spawn(async {
        let _ = rocket.launch().await.unwrap();
    });
    loop {
        println!(
            "{:?}",
            conn_2.query_first::<String, &str>("SELECT user FROM plants WHERE user = 'BillyCheng'")
        );
        thread::sleep(time::Duration::from_millis(1000));
    }
}
