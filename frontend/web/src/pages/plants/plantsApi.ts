import axios from "axios";
import SERVER_URL from "../../apiUrl";

export const apiGetPlantList = async (username: string) => {
  let res = await axios.get(`${SERVER_URL}/plant/list?username="${username}"`);
  return res.data;
};
