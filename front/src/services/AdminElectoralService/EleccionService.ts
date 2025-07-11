import type { Eleccion } from "../../models/adminElectoral/Eleccion";
import adminElectoralClient from "../interceptorAdminElectoral";

export class EleccionService {
  getElecciones(): Promise<Eleccion[]> {
    return adminElectoralClient
      .get("elecciones/")
      .then(res => res.data)
      .catch(err => { throw new Error(err.message); });
  }

  getEleccionById(id: number): Promise<Eleccion> {
    return adminElectoralClient
      .get(`elecciones/${id}/`)
      .then(res => res.data)
      .catch(err => { throw new Error(err.message); });
  }

  createEleccion(eleccion: Omit<Eleccion, "id">): Promise<Eleccion> {
    return adminElectoralClient
      .post("elecciones/", eleccion)
      .then(res => res.data)
      .catch(err => { throw new Error(err.message); });
  }

  updateEleccion(id: number, eleccion: Partial<Eleccion>): Promise<Eleccion> {
    return adminElectoralClient
      .put(`elecciones/${id}/`, eleccion)
      .then(res => res.data)
      .catch(err => { throw new Error(err.message); });
  }

  deleteEleccion(id: number): Promise<void> {
    return adminElectoralClient
      .delete(`elecciones/${id}/`)
      .then(res => {
        if (res.status === 204) return;
        throw new Error(`Error: ${res.status}`);
      })
      .catch(err => { throw new Error(err.message); });
  }
}
