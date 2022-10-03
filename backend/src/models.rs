#[derive(Debug, PartialEq, Eq)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub plants: Vec<i32>,
}

#[derive(Debug, PartialEq, Eq)]
pub struct Plant {
    pub id: i32,
    pub name: String,
}
