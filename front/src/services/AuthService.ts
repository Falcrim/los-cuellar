import axios from "axios";
import type { LoginResponse } from "../models/dto/LoginResponse";
import type { RefreshTokenResponse } from "../models/dto/RefreshTokenResponse";
import type { Usuario } from "../models/dto/Usuario";
import apiClient from "./interceptor";

export class AuthService {
  login(username: string, password: string): Promise<LoginResponse> {
    return axios
      .post("http://localhost:8000/api/token/", {
        username,
        password,
      })
      .then((res) => res.data);
  }

  refreshToken(refresh: string): Promise<RefreshTokenResponse> {
    return axios
      .post("http://localhost:8000/api/token/refresh/", { refresh })
      .then((res) => res.data);
  }

  register(
    username: string,
    role: "SuperAdmin" | "AdminElectoral" | "Jurado" | "AdminPadron"
  ): Promise<{ id: number; username: string; role: string }> {
    return axios
      .post("http://localhost:8000/api/users/", { username, role })
      .then((res) => res.data);
  }

  getCurrentUser(): Promise<Usuario> {
    return apiClient.get("account/me/").then((res) => res.data);
  }
}
