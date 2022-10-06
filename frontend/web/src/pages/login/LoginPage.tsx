import { createRef, useState } from "react";
import { apiGetLoginToken, apiGetSignupToken } from "./loginPageApi";
import styles from "./loginPage.module.scss";
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
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h1>Plantera Login</h1>
        <label>Username: </label>
        <input type={"text"} ref={usernameRef} />
        <br />
        <label>Password: </label>
        <input type={"password"} ref={passwordRef} />
        <br />
        <input type={"submit"} value={isNewAccount ? "Signup" : "Login"} />
        <br />
        {isNewAccount ? "Already have an account? " : "Don't have an account? "}
        <span onClick={() => setIsNewAccount(!isNewAccount)}>
          {isNewAccount ? "Login" : "Signup"}
        </span>
      </form>
    </div>
  );
};

export default LoginPage;
