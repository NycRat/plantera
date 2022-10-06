import axios from "axios";
import SERVER_URL from "../../apiUrl";

export const apiGetPlantList = async (username: string) => {
  const res = await axios.get(
    `${SERVER_URL}/plant/list?username="${username}"`
  );
  return res.data;
};

export const apiPostNewPlant = async (name: string) => {
  const res = await axios.post(
    `${SERVER_URL}/plant/new`,
    {
      name: name,
      watering_interval: 312231,
    },
    {
      withCredentials: true,
    }
  );

  console.log(res);
};
