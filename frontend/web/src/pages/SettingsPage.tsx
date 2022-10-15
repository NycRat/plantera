import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
/* import styles from "./settingsPage.module.scss"; */

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
      {/* <h1 className={styles.userTitle}>{cookies.username}</h1> */}
      <h1 className="text-center text-6xl font-bold mt-6 mb-2">
        {cookies.username}
      </h1>
      <button
        onClick={handleLogout}
        className="flex m-auto px-2 py-1 rounded-full 
        duration-100 bg-color-dark-2 hover:bg-color-dark-1"
      >
        Logout
      </button>
    </div>
  );
};

export default SettingsPage;
