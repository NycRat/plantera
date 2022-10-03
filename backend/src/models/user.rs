use rocket::serde::Deserialize;

#[derive(Debug, PartialEq, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct LoginInfo {
    pub username: String,
    pub password: String,
}

#[derive(Debug, PartialEq, Eq)]
pub struct User {
    pub username: String,
    pub password: String,
    pub plants: Vec<i32>,
}
