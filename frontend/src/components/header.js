import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { debounce } from "lodash"; // Імпорт функції debounce
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import api from "../api/axios";
import "../styles/index.css";
import "../styles/header.css";

import { useDispatch } from 'react-redux';
import { clearUser } from '../redux/slices/userSlice';

const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};

function Header() {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [message, setMessage] = useState(""); // Стан для повідомлення
  const [query, setQuery] = useState(""); // Стан для тексту пошуку
  const [searchResults, setSearchResults] = useState([]); // Стан для результатів пошуку
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const handleLogout = () => {
    // Видаляємо токен з localStorage
    localStorage.removeItem("accessToken");
    // Додатково, якщо є refreshToken, також видаляємо його
    localStorage.removeItem("refreshToken");
    dispatch(clearUser());
    // Перенаправляємо користувача на сторінку входу
    navigate("/");
  };
  // Завантаження повідомлення з бекенду
  useEffect(() => {
    api
      .get("/", { headers: { skipAuth: true } }) // Пропускаємо токен
      .then((response) => setMessage(response.data.message))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }
    api
      .get("/tool/favorite_length") // Токен додається автоматично
      .then((response) => setFavoriteCount(response.data))
      .catch((error) =>
        console.error("Error fetching favorite length:", error)
      );
  }, [isAuthenticated()]);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }
    api
      .get("/cart/length") // Токен додається автоматично
      .then((response) => setCartCount(response.data))
      .catch((error) => console.error("Error fetching cart length:", error));
  }, [isAuthenticated()]);
  // Виконання пошуку із затримкою
  const performSearch = useCallback(
    debounce((query) => {
      api
        .get(`/goods/search`, {
          params: { query }, // Передаємо параметри запиту
          headers: { skipAuth: true }, // Пропускаємо токен
        })
        .then((response) => setSearchResults(response.data))
        .catch((error) =>
          console.error("Error fetching search results:", error)
        );
    }, 1000),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    performSearch(value);
  };
  const handleInputFocus = () => setIsInputFocused(true);
  const handleInputBlur = () => setIsInputFocused(false);
  return (
    <header className="w-full bg-transparent fixed top-0">
      <div className="container header_1200 flex items-center justify-between rounded-b-xl">
        {message ? (
          <Link to="/">
            <h1 className="text-accent-purple font-bold text-3xl">{message}</h1>
          </Link>
        ) : (
          <p>Loading...</p>
        )}
        <div className="relative flex border-solid border-2 border-accent-purple rounded-lg my-4 mx-10 grow">
          <input
            className="flex-grow rounded-lg px-2 py-1"
            type="text"
            placeholder="Search..."
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          {isInputFocused &&
            query.trim() !== "" &&
            searchResults.length > 0 && (
              <div className="search-results rounded-b-lg border-2 border-primary-lavender shadow-[0px_2px_5px_1px] shadow-primary-lavender">
                {searchResults.map((item, index) => (
                  (console.log(searchResults.length), searchResults.length),
                  <Link
                    to={`/goods/${item.id}`}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <div
                      key={index}
                      className="search-result-item flex gap-5 px-3 py-2 items-center"
                    >
                      <img
                        className="h-[30px]"
                        src={item.images_path[0]}
                        alt={item.name}
                      />
                      <p
                        className="grow overflow-hidden whitespace-nowrap text-ellipsis"
                        title={item.name}
                      >
                        {item.name}
                      </p>
                      <p className="whitespace-nowrap ml-10">
                        {item.price} грн.
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
        </div>
        <div className="flex gap-5">
          <Link
            to="/favorite"
            className="bg-gray-100 w-[40px] h-[40px] flex justify-center items-center rounded-lg shadow-[0px_0px_5px_1px] shadow-primary-lavender a_hover relative"
          >
            <FavoriteBorderIcon />
            {isAuthenticated() && favoriteCount > 0 && (
              <div className="absolute top-[-8px] right-[-8px] bg-accent-purple text-white w-[20px] h-[20px] flex justify-center items-center rounded-full text-xs">
                {favoriteCount}
              </div>
            )}
          </Link>
          <Link
            to="/cart"
            className="bg-gray-100 w-[40px] h-[40px] flex justify-center items-center rounded-lg shadow-[0px_0px_5px_1px] shadow-primary-lavender a_hover relative"
          >
            <ShoppingCartIcon />
            {isAuthenticated() && cartCount > 0 && (
              <div className="absolute top-[-8px] right-[-8px] bg-accent-purple text-white w-[20px] h-[20px] flex justify-center items-center rounded-full text-xs">
                {cartCount}
              </div>
            )}
          </Link>
          <div className="relative">
            <Link
              to="/profile"
              className="bg-gray-100 w-[40px] h-[40px] flex justify-center items-center rounded-lg shadow-[0px_0px_5px_1px] shadow-primary-lavender a_hover peer"
            >
              <PersonIcon />
            </Link>
            <div
              className="hidden absolute peer-hover:flex hover:flex flex-col top-[40px] right-0 z-10
         w-[200px] bg-white shadow-[0px_0px_5px_1px] shadow-primary-lavender py-3 gap-2 rounded-lg"
            >
              {isAuthenticated() ? (
                <div className="flex flex-col gap-1 text-lg font-normal text-center">
                  <ul>
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-primary-lavender hover:text-gray-500 hover:font-medium"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 hover:bg-primary-lavender hover:text-gray-500 hover:font-medium"
                      >
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/payment"
                        className="block px-4 py-2 hover:bg-primary-lavender hover:text-gray-500 hover:font-medium"
                      >
                        Payment
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 hover:bg-primary-lavender hover:text-gray-500 hover:font-medium"
                      >
                        Settings
                      </Link>
                    </li>
                  </ul>
                  <hr></hr>
                  <div className="flex justify-center items-center">
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 hover:bg-primary-lavender hover:text-gray-500 hover:font-medium w-full"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-2">
                  <p className="text-center pb-2">Please sing in or sing up</p>
                  <div className="flex items-center justify-around gap-2 font-semibold pb-1">
                    <Link
                      to="/login"
                      className="border py-2 px-4 rounded-lg border-accent-purple bg-gray-100 text-green-400 link_hover"
                    >
                      Sing in
                    </Link>
                    <Link
                      to="/register"
                      className="border py-2 px-4 rounded-lg border-accent-purple bg-gray-100 text-red-400 link_hover"
                    >
                      Sing up
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
