import axios from "axios";

// Створюємо екземпляр Axios
const instance = axios.create({
  baseURL: "http://localhost:8000", // Заміни на URL свого бекенду
  headers: {
    "Content-Type": "application/json",
  },
});

// Інтерсептор для запитів
instance.interceptors.request.use(
  (config) => {
    // Перевіряємо, чи потрібно пропускати токен
    if (!config.headers.skipAuth) {
      const token = localStorage.getItem("accessToken"); // Отримуємо токен із LocalStorage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Додаємо токен до заголовків
      }
    }
    return config;
  },
  (error) => Promise.reject(error) // Обробляємо помилки запиту
);

// Інтерсептор для відповідей
instance.interceptors.response.use(
  (response) => response, // Успішна відповідь
  (error) => {
    // Якщо токен недійсний або закінчився
    if (error.response?.status === 401) {
      console.error("Помилка авторизації: токен недійсний або закінчився.");
      // Додатково: можна додати перенаправлення на сторінку входу
      // window.location.href = "/login";
    }
    return Promise.reject(error); // Повертаємо помилку
  }
);

export default instance;
