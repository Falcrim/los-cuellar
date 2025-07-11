import type { Usuario } from "../models/dto/Usuario";
import apiClient from "./interceptor";

export class UsuarioService {
  getUsuarios(): Promise<Usuario[]> {
    return apiClient
      .get("users/")
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  getUsuarioById(id: number): Promise<Usuario> {
    return apiClient
      .get(`users/${id}/`)
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  createUsuario(usuario: { username: string; password: string; role: string }): Promise<Usuario> {
    return apiClient
      .post("users/", usuario)
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  updateUsuario(id: number, usuario: { username: string; password?: string; role: string }): Promise<Usuario> {
    return apiClient
      .put(`users/${id}/`, usuario)
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  deleteUsuario(id: number): Promise<void> {
    return apiClient
      .delete(`users/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          return;
        } else {
          throw new Error(`Error: ${res.status}`);
        }
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }
}
