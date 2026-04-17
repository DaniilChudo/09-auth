import axios from "axios";

// For internal Next.js API routes (app/api/*)
export const internalApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  withCredentials: true,
});

// For external GoIT API calls
export const externalApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Default export for backward compatibility
export default internalApi;
