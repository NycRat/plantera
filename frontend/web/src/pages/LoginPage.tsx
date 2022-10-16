import { createRef, useState } from "react";
import { apiGetLoginToken, apiGetSignupToken } from "../api/loginApi";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const LoginPage = (): JSX.Element => {
  const usernameRef = createRef<HTMLInputElement>();
  const passwordRef = createRef<HTMLInputElement>();

  const [isNewAccount, setIsNewAccount] = useState<boolean>(false);
  const [cookies, setCookies] = useCookies(["token", "username"]);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!usernameRef.current || !passwordRef.current) {
      return;
    }

    let token;
    if (isNewAccount) {
      token = await apiGetSignupToken(
        usernameRef.current.value,
        passwordRef.current.value
      );
    } else {
      token = await apiGetLoginToken(
        usernameRef.current.value,
        passwordRef.current.value
      );
    }

    if (token) {
      setCookies("token", token);
      setCookies("username", usernameRef.current.value);
      navigate("/");
    }
  };

  return (
    <div className="page">
      {/* <form className={styles.loginForm} onSubmit={handleSubmit}> */}
      <form
        onSubmit={handleSubmit}
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
        bg-color-dark-2 rounded-3xl p-7"
      >
        <h1 className="text-5xl mb-3">Plantera Login</h1>
        <label className="p-1 text-2xl">Username: </label>
        <input
          type={"text"}
          ref={usernameRef}
          className="border-none text-[1.2em] text-black"
        />
        <br />
        <label className="p-1 text-2xl">Password: </label>
        <input
          type={"password"}
          ref={passwordRef}
          className="border-none text-[1.2em] text-black"
        />
        <br />
        <input
          type={"submit"}
          value={isNewAccount ? "Signup" : "Login"}
          className="text-[1.2em] px-3 py-1 m-2 rounded-full bg-color-light-1
          duration-100 hover:bg-color-light-2 cursor-pointer"
        />
        <br />
        {isNewAccount ? "Already have an account? " : "Don't have an account? "}
        <span
          onClick={() => setIsNewAccount(!isNewAccount)}
          className="text-[#f3e0ff] underline cursor-pointer"
        >
          {isNewAccount ? "Login" : "Signup"}
        </span>
      </form>
    </div>
  );
};

export default LoginPage;
