use rocket::data::ToByteUnit;
use rocket::Data;

use mysql::{prelude::Queryable, PooledConn};

use crate::models::plant::Plant;

pub fn get_authorized_username(conn: &mut PooledConn, token: Option<String>) -> Option<String> {
    if let Some(token) = token {
        let user: Option<String> = conn
            .query_first(format!(
                "SELECT username from users WHERE token = '{}'",
                &token
            ))
            .unwrap();

        if user.is_some() {
            return user;
        } else {
            return None;
        }
    } else {
        return None;
    }
}

pub async fn get_plant_from_request_data(data: Data<'_>) -> Option<Plant> {
    let data_str = data.open(3.megabytes()).into_string().await.unwrap();
    match rocket::serde::json::from_str::<Plant>(&data_str) {
        Ok(mut plant) => {
            plant.name = plant.name.trim().into();
            if plant.name.len() == 0 {
                return None;
            }
            return Some(plant);
        }
        Err(err) => println!("{:?}", err)
    }
    return None;
}

// pub async fn get_image_from_request_data(data: Data<'_>) -> Option<Vec<u8>> {
pub async fn get_image_from_request_data(data: Data<'_>) -> Option<String> {
    // match data.open(15.megabytes()).into_bytes().await {
    match data.open(3.megabytes()).into_string().await {
        Ok(bytes) => {
            // return Some(bytes.to_vec());
            return Some(bytes.value);
        }
        Err(err) => println!("{:?}", err)
    }
    return None;
}

pub fn get_plant_id(
    conn: &mut PooledConn,
    username: &String,
    plant_index: usize,
) -> Option<String> {
    let query_string = format!("SELECT plants from users where username = '{}'", username);
    let plant_ids = conn.query_first::<String, &String>(&query_string).unwrap();
    if let Some(some_plant_ids) = plant_ids {
        let plant_id_arr = rocket::serde::json::from_str::<Vec<String>>(&some_plant_ids).unwrap();

        let plant_id = plant_id_arr.get(plant_index);
        if let Some(plant_id) = plant_id {
            return Some(plant_id.into());
        }
    }
    return None;
}
