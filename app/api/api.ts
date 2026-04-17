import axios from "axios";

export const api = axios.create({
  // Використовуємо локальну адресу з .env
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});
