import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";
import PlantPage from "./pages/plant/PlantPage";
import PlantListPage from "./pages/plantlist/PlantListPage";
import {
  selectPlantImages,
  selectPlantList,
  updatePlantImageAsync,
  updatePlantListAsync,
  waterPlant,
} from "./pages/plantlist/plantListSlice";
import SettingsPage from "./pages/settings/SettingsPage";

const App = (): JSX.Element => {
  const [cookies] = useCookies(["token", "username"]);
  const dispatch = useAppDispatch();
  const plantList = useAppSelector(selectPlantList);
  const plantImages = useAppSelector(selectPlantImages);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(updatePlantListAsync(cookies.username));
  }, [cookies.token, cookies.username, dispatch]);

  useEffect(() => {
    console.log("Xd");
    for (let i = 0; i < plantList.length; i++) {
      if (plantImages[i] === undefined) {
        dispatch(updatePlantImageAsync(i));
      }
    }
  }, [dispatch, plantList]);

  useEffect(() => {
    const updatePlantWaterTime = () => {
      const now = new Date().valueOf() / 1000;
      for (let i = 0; i < plantList.length; i++) {
        const plant = plantList[i];
        if (now > plant.last_watered + plant.watering_interval) {
          dispatch(waterPlant(i));
        }
      }
    };
    updatePlantWaterTime();
    const interval = setInterval(updatePlantWaterTime, 1000);
    return () => clearInterval(interval);
  }, [dispatch, plantList]);

  return (
    <>
      <nav className="navbar">
        <span onClick={() => navigate("/")}>Plantera</span>
        {cookies.username && cookies.token ? (
          <>
            <span onClick={() => navigate("/settings")}>Settings</span>
            <span onClick={() => navigate("/plant_list")}>Plants</span>
          </>
        ) : (
          <span onClick={() => navigate("/login")}>Login</span>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        {cookies.username && cookies.token && (
          <>
            <Route path="/plant_list" element={<PlantListPage />} />
            <Route path="/plant" element={<PlantPage />} />
          </>
        )}
        <Route path="*" element={<h1>404 Page not Found</h1>} />
      </Routes>
    </>
  );
};

export default App;
