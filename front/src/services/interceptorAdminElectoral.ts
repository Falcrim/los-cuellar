
import axios from "axios";
import { URLS } from "../navigation/CONTANTS";

const adminElectoralClient = axios.create({
  baseURL: "http://localhost:8001/api/admin-electoral/",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true,
});

adminElectoralClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Error en la solicitud a la API AdminElectoral: ", error);
    return Promise.reject(error);
  }
);

adminElectoralClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.replace(URLS.LOGIN);
    }
    return Promise.reject(error);
  }
);

export default adminElectoralClient;