import { useCookies } from "react-cookie";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";
import PlantsPage from "./pages/plants/PlantsPage";
import SettingsPage from "./pages/settings/SettingsPage";

const App = (): JSX.Element => {
  const [cookies] = useCookies(["token", "username"]);

  /* useEffect(() => { */
  /* }, []); */

  return (
    <>
      <nav className="navbar">
        <a href="/">Plantera</a>
        {cookies.username && cookies.token ? (
          <>
            <a href="/settings">Settings</a>
            <a href="/plants">Plants</a>
          </>
        ) : (
          <a href="/login">Login</a>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        {cookies.username && cookies.token && (
          <Route path="/plants" element={<PlantsPage />} />
        )}
        <Route path="*" element={<h1>404 Page not Found</h1>} />
      </Routes>
    </>
  );
};

export default App;
