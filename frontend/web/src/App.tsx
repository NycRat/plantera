import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PlantListPage from "./pages/PlantListPage";
import PlantPage from "./pages/PlantPage";
import SettingsPage from "./pages/SettingsPage";
import {
  selectFirstLoad,
  selectPlantList,
  updatePlantImageAsync,
  updatePlantListAsync,
} from "./slices/plantListSlice";

const App = (): JSX.Element => {
  const [cookies] = useCookies(["token", "username"]);
  const dispatch = useAppDispatch();
  const plantList = useAppSelector(selectPlantList);
  const firstLoad = useAppSelector(selectFirstLoad);

  const navigate = useNavigate();

  // first time we just get the plant list
  useEffect(() => {
    dispatch(updatePlantListAsync(cookies.username));
  }, [cookies.token, cookies.username, dispatch]);

  // after plant list, get images
  useEffect(() => {
    // TODO - FIND A WAY TO NOT USE FIRSTLOAD
    if (firstLoad) {
      const fetchAllPlantImages = async () => {
        for (let i = 0; i < plantList.length; i++) {
          await dispatch(updatePlantImageAsync(i));
        }
      };
      fetchAllPlantImages();
    } else {
    }
  }, [dispatch, plantList.length, firstLoad]);

  useEffect(() => {
    const updatePlantWaterTime = () => {
      const now = new Date().valueOf() / 1000;
      for (let i = 0; i < plantList.length; i++) {
        const plant = plantList[i];
        if (plant.last_watered === now) {
          alert("WAtER OPLANT");
        }
      }
    };
    updatePlantWaterTime();
    const interval = setInterval(updatePlantWaterTime, 10000);
    return () => clearInterval(interval);
  }, [dispatch, plantList]);

  return (
    <>
      <nav className="p-[5px] bg-color-dark-1">
        <span
          onClick={() => navigate("/")}
          className="ml-5 text-3xl cursor-pointer"
        >
          Plantera
        </span>
        {cookies.username && cookies.token ? (
          <>
            <span
              onClick={() => navigate("/settings")}
              className="ml-5 text-3xl cursor-pointer"
            >
              Settings
            </span>
            <span
              onClick={() => navigate("/plant_list")}
              className="ml-5 text-3xl cursor-pointer"
            >
              Plants
            </span>
          </>
        ) : (
          <span
            onClick={() => navigate("/login")}
            className="ml-5 text-3xl cursor-pointer"
          >
            Login
          </span>
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
