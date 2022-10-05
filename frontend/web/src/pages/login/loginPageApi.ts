import axios from "axios";
import SERVER_URL from "../../apiUrl";

export const apiSignUp = async (username: string, password: string) => {
  let res = await axios
    .post(
      `${SERVER_URL}/user/new`,
      {},
      {
        auth: { username, password },
      }
    )
    .catch((err) => {
      // TODO - ACTUALLY PROCESS ERr
      console.log(err);
    });
};
