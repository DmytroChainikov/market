import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios"; // виправлено
import "../styles/index.css";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};

function LoginPage() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  useEffect(() => {
    // Якщо користувач вже авторизований, переадресовуємо на головну
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);
  const [htmlFormData, sethtmlFormData] = useState({
    username: "",
    password: "", // змінив на password
  });

  const [error, setError] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    sethtmlFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!htmlFormData.username || !htmlFormData.password) {
      // змінив на password
      setError("All fields are required.");
      return;
    }

    // Перетворюємо дані на URL-кодовану строку
    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("username", htmlFormData.username);
    formData.append("password", htmlFormData.password); // змінив на password
    formData.append("scope", ""); // Якщо scope не потрібен, залиште порожнім
    formData.append("client_id", "your_client_id"); // Ваш client_id
    formData.append("client_secret", "your_client_secret"); // Ваш client_secret

    try {
      const token_response = await api.post("/token", formData, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      // Якщо запит успішний, збережемо токен і перенаправимо
      localStorage.setItem("accessToken", token_response.data.access_token);

      const token = localStorage.getItem("accessToken");

      const user_data = await api.get("/user/me");

      dispatch(setUser(user_data.data));

      if (token && user_data.data.is_verified !== 1) {
        navigate("/verify");
      } else if (token && user_data.data.is_verified === 1) {
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      setError("Invalid username or password.");
      console.error("er", error);
    }
  };
  return (
    <div className="h-[100vh] w-full flex items-center justify-center bg-[#F3F4F6]">
      <div className="flex flex-col w-full max-w-[500px] mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff] rounded-2xl shadow-xl">
        <div className="flex flex-row gap-3 pb-4 justify-center">
          <h1 className="text-accent-purple font-bold text-3xl my-auto">
            Marketplace
          </h1>
        </div>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="pb-2">
            <label
              htmlFor="username" // змінив на username
              className="block mb-2 text-sm font-medium text-[#111827]"
            >
              Email
            </label>
            <div className="relative text-gray-400">
              <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-mail"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </span>
              <input
                type="email"
                name="username"
                id="username"
                className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring ring-transparent focus:ring-1 focus:outline-none focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
                placeholder="market@marketplace.com"
                autoComplete="email"
                value={htmlFormData.username}
                onChange={handleChange} // додано
              />
            </div>
          </div>
          <div className="pb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-[#111827]"
            >
              Password
            </label>
            <div className="relative text-gray-400">
              <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-square-asterisk"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <path d="M12 8v8"></path>
                  <path d="m8.5 14 7-4"></path>
                  <path d="m8.5 10 7 4"></path>
                </svg>
              </span>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••••"
                className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring ring-transparent focus:ring-1 focus:outline-none focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
                autoComplete="password"
                aria-autocomplete="list"
                value={htmlFormData.password}
                onChange={handleChange} // додано
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full text-[#FFFFFF] bg-accent-purple focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6"
          >
            {t("Login")}
          </button>
          <div className="text-sm font-light text-[#6B7280] text-center">
            Don't have an account yet?{" "}
            <Link
              to="/register"
              className="font-medium text-accent-purple hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
