import { createRef, useState } from "react";
import { apiSignUp } from "./loginPageApi";
import styles from "./loginPage.module.scss";

const LoginPage = (): JSX.Element => {
  const usernameRef = createRef<HTMLInputElement>();
  const passwordRef = createRef<HTMLInputElement>();

  const [isNewAccount, setIsNewAccount] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!usernameRef.current || !passwordRef.current) {
      return;
    }

    apiSignUp(usernameRef.current.value, passwordRef.current.value);
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
