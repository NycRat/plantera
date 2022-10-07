import axios, { AxiosError } from "axios";
import SERVER_URL from "../apiUrl";

export const apiGetSignupToken = async (
  username: string,
  password: string
): Promise<string | undefined> => {
  const res = await axios
    .post(
      `${SERVER_URL}/user/new`,
      {},
      {
        auth: { username, password },
      }
    )
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
  if (res !== undefined) {
    return res.data;
  }
};

export const apiGetLoginToken = async (
  username: string,
  password: string
): Promise<string | undefined> => {
  const res = await axios
    .get(`${SERVER_URL}/user/login`, {
      auth: { username, password },
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

  if (res !== undefined) {
    return res.data;
  }
};
