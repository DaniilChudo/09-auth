import axios from "axios";

const api = axios.create({
  // Залишаємо тільки корінь, бо "/api" вже є у твоїх запитах у коді
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export default api;
