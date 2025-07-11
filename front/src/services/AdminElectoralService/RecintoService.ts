
import type { Recinto } from "../../models/adminElectoral/Recinto";
import adminElectoralClient from "../interceptorAdminElectoral";

export class RecintoService {
  getRecintos(): Promise<Recinto[]> {
    return adminElectoralClient
      .get("recintos/")
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  getRecintoById(id: number): Promise<Recinto> {
    return adminElectoralClient
      .get(`recintos/${id}/`)
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.message);
      });
  }
  createRecinto(recinto: Omit<Recinto, "id">): Promise<Recinto> {
    console.log("Datos:", recinto);
  return adminElectoralClient
    .post("recintos/", recinto)
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.message);
    });
}

  updateRecinto(id: number, recinto: Partial<Recinto>): Promise<Recinto> {
    return adminElectoralClient
      .put(`recintos/${id}/`, recinto)
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  deleteRecinto(id: number): Promise<void> {
    return adminElectoralClient
      .delete(`recintos/${id}/`)
      .then((res) => {
        if (res.status === 204) return;
        else throw new Error(`Error: ${res.status}`);
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }
}
