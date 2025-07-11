import type { Mesa } from "../../models/adminElectoral/Mesa";
import adminElectoralClient from "../interceptorAdminElectoral";

export class MesaService {
  getMesasByRecinto(recintoId: number): Promise<Mesa[]> {
    return adminElectoralClient
      .get(`recintos/${recintoId}/mesas/`)
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  getMesaById(id: number): Promise<Mesa> {
    return adminElectoralClient
      .get(`mesas/${id}/`)
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.message);
      });
  }
  getMesas(): Promise<Mesa[]> {
  return adminElectoralClient
    .get("mesas/")
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.message);
    });
}


  createMesa(mesa: {
    numero: number;
    recinto: number;
    jurado_ids?: string[];
  }): Promise<Mesa> {
    return adminElectoralClient
      .post("mesas/", mesa)
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  updateMesa(id: number, mesa: Partial<Mesa>): Promise<Mesa> {
    return adminElectoralClient
      .put(`mesas/${id}/`, mesa)
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  deleteMesa(id: number): Promise<void> {
    return adminElectoralClient
      .delete(`mesas/${id}/`)
      .then((res) => {
        if (res.status === 204) return;
        else throw new Error(`Error: ${res.status}`);
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }
}
