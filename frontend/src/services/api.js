import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("vv_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("vv_access_token", token);
  } else {
    localStorage.removeItem("vv_access_token");
  }
};

export default api;
