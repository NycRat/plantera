import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import styles from "./settingsPage.module.scss";

const SettingsPage = (): JSX.Element => {
  const [cookies, setCookies, removeCookie] = useCookies(["token", "username"]);

  const navigate = useNavigate();

  const handleLogout = () => {
    removeCookie("token");
    removeCookie("username");
    navigate("/");
  };

  return (
    <div className="page">
      <h1 className={styles.userTitle}>{cookies.username}</h1>
      <button onClick={handleLogout}>Logout</button>
      {/* {cookies.username === query.get("user") && <button>Logout</button>} */}
    </div>
  );
};

// AVERY: 98.25 * 3
// 10.05 * 30

// D
// A
//
//
export default SettingsPage;
