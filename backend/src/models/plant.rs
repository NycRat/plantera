use rocket::serde::{Serialize, Deserialize};

#[derive(Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Plant {
    pub name: String,
    #[serde(rename = "wateringInterval")]
    pub watering_interval: u64,
}
