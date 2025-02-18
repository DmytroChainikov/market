import axios from "axios";

const API_URL = "http://localhost:8000"; // Заміни на свій бекенд

// Створюємо екземпляр Axios
const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Функція для оновлення токена
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("Refresh token is missing");

    const response = await axios.post(`${API_URL}/refresh-token`, null, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const newAccessToken = response.data.access_token;
    localStorage.setItem("accessToken", newAccessToken); // Оновлюємо токен
    return newAccessToken;
  } catch (error) {
    console.error("Помилка оновлення токена:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login"; // Перенаправлення на сторінку входу
    return null;
  }
};

// Інтерсептор для запитів
instance.interceptors.request.use(
  (config) => {
    if (!config.headers.skipAuth) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Інтерсептор для відповідей
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Уникаємо зациклення
      const newToken = await refreshAccessToken();

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest); // Повторюємо запит з новим токеном
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
