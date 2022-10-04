use rocket::serde::{Serialize, Deserialize};

// idk why this is here im not even using
#[derive(Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Plant {
    pub name: String,
    pub watering_interval: u64,
}
