import type { Seccion } from "../../models/adminElectoral/Seccion";
import adminElectoralClient from "../interceptorAdminElectoral";

export class SeccionService {
  getSecciones(): Promise<Seccion[]> {
    return adminElectoralClient
      .get("secciones/")
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  getSeccionById(id: number): Promise<Seccion> {
    return adminElectoralClient
      .get(`secciones/${id}/`)
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  createSeccion(seccion: Omit<Seccion, "id">): Promise<Seccion> {
    return adminElectoralClient
      .post("secciones/", seccion)
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  updateSeccion(id: number, seccion: Partial<Seccion>): Promise<Seccion> {
    return adminElectoralClient
      .put(`secciones/${id}/`, seccion)
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  deleteSeccion(id: number): Promise<void> {
    return adminElectoralClient
      .delete(`secciones/${id}/`)
      .then((res) => {
        if (res.status === 204) return;
        else throw new Error(`Error: ${res.status}`);
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }
}
