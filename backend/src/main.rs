#[macro_use]
extern crate rocket;

use mysql::prelude::*;
use mysql::*;
use rocket::futures::lock::Mutex;

#[derive(Debug, PartialEq, Eq)]
struct Account {
    id: i32,
    username: String,
    plants: Vec<i32>,
}

#[derive(Debug, PartialEq, Eq)]
struct Plant {
    id: i32,
    name: String,
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
        .mount("/api", routes![])
}
