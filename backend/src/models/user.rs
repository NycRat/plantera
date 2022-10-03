use rocket::serde::{Deserialize, Serialize};

#[derive(Debug, PartialEq, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct LoginInfo {
    pub username: String,
    pub password: String,
}

#[derive(Debug, PartialEq, Eq, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct User {
    pub username: String,
    pub plants: Vec<i32>,
}
