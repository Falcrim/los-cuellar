import axios from "axios";
import { URLS } from "../navigation/CONTANTS";

const padronClient = axios.create({
  baseURL: "http://localhost:8002/api/gestionP/",
  withCredentials: true,
});


padronClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Error en la solicitud a la API Padron: ", error);
    return Promise.reject(error);
  }
);

padronClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access_token");
      window.location.replace(URLS.LOGIN);
    }
    return Promise.reject(error);
  }
);

export default padronClient;
