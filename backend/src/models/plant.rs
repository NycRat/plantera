use rocket::serde::Deserialize;

// idk why this is here im not even using
#[derive(Debug, PartialEq, Eq)]
pub struct Plant {
    pub id: String,
    pub user: String,
    pub name: String,
    pub watering_interval: u64,
}

#[derive(Debug, PartialEq, Eq, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct NewPlantRequest {
    pub name: String,
    pub watering_interval: u64,
}
