#[macro_use]
extern crate rocket;

use mysql::*;
use rocket::futures::lock::Mutex;

pub mod models;
pub mod routes;
pub mod utils;

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
        .mount(
            "/api",
            routes![
                routes::user_routes::get_users_list,
                routes::user_routes::post_user_new,
                routes::plant_routes::get_plant_list,
                routes::plant_routes::post_plant_new,
            ],
        )
}
