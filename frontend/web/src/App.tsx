import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";
import PlantPage from "./pages/plant/PlantPage";
import PlantListPage from "./pages/plantlist/PlantListPage";
import {
  selectPlantList,
  updatePlantListAsync,
} from "./pages/plantlist/plantListSlice";
import SettingsPage from "./pages/settings/SettingsPage";

const App = (): JSX.Element => {
  const [cookies] = useCookies(["token", "username"]);
  const dispatch = useAppDispatch();
  const plantList = useAppSelector(selectPlantList);

  useEffect(() => {
    dispatch(updatePlantListAsync());
    console.log("APP.TSX: " + plantList);
  }, []);

  return (
    <>
      <nav className="navbar">
        <a href="/">Plantera</a>
        {cookies.username && cookies.token ? (
          <>
            <a href="/settings">Settings</a>
            <a href="/plant/list">Plants</a>
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
          <>
            <Route path="/plant/list" element={<PlantListPage />} />
            <Route path="/plant" element={<PlantPage />} />
          </>
        )}
        <Route path="*" element={<h1>404 Page not Found</h1>} />
      </Routes>
    </>
  );
};

export default App;
