import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { useTransition, animated } from "@react-spring/web";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import api from "../api/axios";
import "../styles/index.css";
import "../styles/header.css";

import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../redux/slices/userSlice";

const isAuthenticated = () => {
    return !!localStorage.getItem("accessToken");
};

// Компонент для анімації результатів пошуку
const AnimatedSearchResults = ({ results }) => {
    const transitions = useTransition(results, {
        from: { opacity: 0, transform: "translateY(20px)" },
        enter: { opacity: 1, transform: "translateY(0)" },
        keys: (item) => item.id,
    });

    return transitions((style, item) => (
        <animated.div style={style}>
            <Link
                to={`/goods/${item.id}`}
                onMouseDown={(e) => e.preventDefault()}
            >
                <div className="search-result-item flex gap-5 px-3 py-2 items-center">
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
                    <p className="whitespace-nowrap ml-10">{item.price} грн.</p>
                </div>
            </Link>
        </animated.div>
    ));
};
function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const searchResultsRef = useRef(null);

    const [message, setMessage] = useState("");
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [favoriteCount, setFavoriteCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Обробник виходу з акаунту
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(clearUser());
        navigate("/");
    };

    // Завантаження повідомлення з бекенду
    useEffect(() => {
        api.get("/", { headers: { skipAuth: true } })
            .then((response) => setMessage(response.data.message))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    // Завантаження кількості товарів у вибраному
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        api.get("/tool/favorite_length")
            .then((response) => setFavoriteCount(response.data))
            .catch((error) =>
                console.error("Error fetching favorite length:", error)
            );
    }, []);

    // Завантаження кількості товарів у кошику
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        api.get("/cart/length")
            .then((response) => setCartCount(response.data))
            .catch((error) =>
                console.error("Error fetching cart length:", error)
            );
    }, []);

    // Функція для виконання пошуку з пагінацією
    const performSearch = useCallback(
        debounce((query, offset) => {
            setIsLoading(true);
            api.get(`/goods/search`, {
                params: { query, limit: 10, offset },
                headers: { skipAuth: true },
            })
                .then((response) => {
                    if (response.data.length > 0) {
                        setSearchResults((prevResults) => [
                            ...prevResults,
                            ...response.data,
                        ]);
                        setOffset(offset + response.data.length);
                    } else {
                        setHasMore(false);
                    }
                })
                .catch((error) =>
                    console.error("Error fetching search results:", error)
                )
                .finally(() => setIsLoading(false));
        }, 1000),
        []
    );

    // Обробник зміни пошукового запиту
    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        setSearchResults([]);
        setOffset(0);
        setHasMore(true);
        performSearch(value, 0);
    };

    // Обробник фокусу на полі введення
    const handleInputFocus = () => setIsInputFocused(true);

    // Обробник блюру поля введення
    const handleInputBlur = () => setIsInputFocused(false);

    // Обробник скролу для нескінченного скролу
    useEffect(() => {
        const handleScroll = () => {
            if (!searchResultsRef.current) return;

            const { scrollTop, scrollHeight, clientHeight } =
                searchResultsRef.current;

            if (
                scrollTop + clientHeight >= scrollHeight - 10 &&
                hasMore &&
                !isLoading
            ) {
                performSearch(query, offset);
            }
        };

        if (searchResultsRef.current) {
            searchResultsRef.current.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (searchResultsRef.current) {
                searchResultsRef.current.removeEventListener(
                    "scroll",
                    handleScroll
                );
            }
        };
    }, [query, offset, hasMore, isLoading]);
    return (
        <header className="w-full bg-transparent fixed top-0">
            <div className="container header_1200 flex items-center justify-between rounded-b-xl">
                {message ? (
                    <Link to="/">
                        <h1 className="text-accent-purple font-bold text-3xl">
                            {message}
                        </h1>
                    </Link>
                ) : (
                    <p>Loading...</p>
                )}

                {/* Поле пошуку */}
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

                    {isInputFocused && query.trim() !== "" && (
                        <>
                            <div
                                ref={searchResultsRef}
                                className="search-results rounded-b-lg border-2 border-primary-lavender shadow-[0px_2px_5px_1px] shadow-primary-lavender"
                            >
                                <AnimatedSearchResults
                                    results={searchResults}
                                />
                                {isLoading && (
                                    <p className="text-center py-2">
                                        Завантаження...
                                    </p>
                                )}
                                {!hasMore && (
                                    <p className="text-center py-2">
                                        Більше немає результатів
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Іконки кошика, вибраного та профілю */}
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

                        {/* Випадаюче меню профілю */}
                        <div className="hidden absolute peer-hover:flex hover:flex flex-col top-[40px] right-0 z-10 w-[200px] bg-white shadow-[0px_0px_5px_1px] shadow-primary-lavender py-3 gap-2 rounded-lg">
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
                                    <p className="text-center pb-2">
                                        Please sign in or sign up
                                    </p>
                                    <div className="flex items-center justify-around gap-2 font-semibold pb-1">
                                        <Link
                                            to="/login"
                                            className="border py-2 px-4 rounded-lg border-accent-purple bg-gray-100 text-green-400 link_hover"
                                        >
                                            Sign in
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="border py-2 px-4 rounded-lg border-accent-purple bg-gray-100 text-red-400 link_hover"
                                        >
                                            Sign up
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
