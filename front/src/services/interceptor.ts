import axios from "axios";
import { URLS } from "../navigation/CONTANTS";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/gestion/",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Error en la solicitud a la API Electoral: ", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.replace(URLS.LOGIN);
    }
    return Promise.reject(error);
  }
);

export default apiClient;