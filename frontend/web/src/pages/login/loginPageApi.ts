import axios, { AxiosError } from "axios";
import { Cookies } from "react-cookie";
import SERVER_URL from "../../apiUrl";

export const apiSignUp = async (username: string, password: string) => {
  await axios
    .post(
      `${SERVER_URL}/user/new`,
      {},
      {
        auth: { username, password },
      }
    )
    .then((res) => {
      const cookies = new Cookies();

      alert("User created");
      cookies.set("username", username);
      cookies.set("token", res.data);
    })
    .catch((err: AxiosError) => {
      if (!err.response) {
        return;
      }

      if (err.response.status === 409) {
        alert("User already exists");
        return;
      }

      if (err.request.status !== 500) {
        alert("Error: " + err.response.data);
      }
    });
};

export const apiLogin = async (username: string, password: string) => {
  await axios
    .get(
      `${SERVER_URL}/user/login`,
      {
        auth: { username, password },
      }
    )
    .then((res) => {
      const cookies = new Cookies();

      alert("Logged in to " + username);
      cookies.set("username", username);
      cookies.set("token", res.data);
    })
    .catch((err: AxiosError) => {
      if (!err.response) {
        return;
      }

      if (err.response.status === 409) {
        alert("User already exists");
        return;
      }

      if (err.request.status !== 500) {
        console.log(err.response.data);
        alert("Error: " + err.response.data);
      }
    });
};
