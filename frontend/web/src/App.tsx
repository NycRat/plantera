import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";
import PlantsPage from "./pages/plants/PlantsPage";

const App = () => {
  return (
    <>
      <nav className="navbar">
        <a href="/">Plantera</a>
        <a href="/login">Login</a>
        <a href="/plants">Plants</a>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/plants" element={<PlantsPage />} />
        <Route path="*" element={<h1>404 Page not Found</h1>} />
      </Routes>
    </>
  );
};

export default App;
