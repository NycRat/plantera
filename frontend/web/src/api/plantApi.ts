import axios from "axios";
import SERVER_URL from "../apiUrl";
import Plant from "../models/plant";

export const apiGetPlantList = async (username: string) => {
  const res = await axios.get(
    `${SERVER_URL}/plant/list?username="${username}"`
  );
  if (res.data === undefined) {
    return [];
  }
  return res.data;
};

export const apiPostNewPlant = async (plant: Plant) => {
  await axios.post(`${SERVER_URL}/plant/new`, plant, {
    withCredentials: true,
  });
};

export const apiUpdatePlant = async (plant: Plant, index: number) => {
  await axios.post(`${SERVER_URL}/plant/update?index=${index}`, plant, {
    withCredentials: true,
  });
};

export const apiDeletePlant = async (index: number) => {
  await axios.delete(`${SERVER_URL}/plant?index=${index}`, {
    withCredentials: true,
  });
};
