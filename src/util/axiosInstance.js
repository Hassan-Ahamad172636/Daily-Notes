// src/utils/axiosInstance.js
import axios from "axios";

// Axios instance create
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL, // Customize baseURL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
