#[macro_use]
extern crate rocket;

use std::{
    thread,
    time::{Duration, SystemTime, UNIX_EPOCH},
};

use models::plant::Plant;
use mysql::{prelude::Queryable, *};
use rocket::futures::lock::Mutex;

pub mod authentication;
pub mod models;
pub mod routes;
pub mod utils;

async fn update_loop(mut mysql_conn: PooledConn) {
    loop {
        let now = (SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs_f64()
            / 60.0) as u64;
        println!("{:?}", now);
        let plants = mysql_conn
            .query::<(String, String, String, u64, u64), &str>(
                "SELECT id, name, note, last_watered, watering_interval FROM plants",
            )
            .unwrap_or(vec![]);

        for (id, name, note, last_watered, watering_interval) in plants {
            let plant = Plant {
                name,
                note,
                last_watered,
                watering_interval,
            };
            if now > plant.last_watered + plant.watering_interval {
                // TODO -> send notification to water plant
                let query_string = format!(
                    "UPDATE plants SET last_watered = {} WHERE id = '{}'",
                    now, id
                );
                println!("{}", query_string);
                match mysql_conn.query_drop(query_string) {
                    Ok(_) => {}
                    Err(err) => println!("{:?}", err),
                }
            }
        }
        thread::sleep(Duration::from_secs(60));
    }
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

    tokio::spawn(update_loop(pool.get_conn().unwrap()));

    rocket::build()
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
        )
}
