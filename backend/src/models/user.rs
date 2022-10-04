use rocket::serde::Serialize;

#[derive(Debug, PartialEq, Eq, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct User {
    pub username: String,
    pub plants: Vec<i32>,
}
