import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import MainPage from "./pages/MainPage";
import GoodsPage from "./pages/GoodsPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage"
import VerificationPage from "./pages/VerificationPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify" element={<VerificationPage />} />
          <Route path="/goods/:id" element={<GoodsPage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
