use rocket::serde::{Deserialize, Serialize};

#[derive(Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Plant {
    pub name: String,
    pub last_watered: u64,
    pub watering_interval: u64,
}
