import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import styles from "./settingsPage.module.scss";

const SettingsPage = (): JSX.Element => {
  const [cookies, setCookies, removeCookie] = useCookies(["token", "username"]);

  const navigate = useNavigate();

  const handleLogout = () => {
    removeCookie("token");
    removeCookie("username");
    navigate("/login");
  };

  return (
    <div className="page">
      <h1 className={styles.userTitle}>{cookies.username}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default SettingsPage;
