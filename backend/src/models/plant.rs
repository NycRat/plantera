use rocket::serde::{Deserialize, Serialize};

#[derive(Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Plant {
    pub name: String,
    pub watering_interval: u64,
}
