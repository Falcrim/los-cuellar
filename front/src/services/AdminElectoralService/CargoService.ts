import type { Cargo } from "../../models/adminElectoral/Cargo";
import adminElectoralClient from "../interceptorAdminElectoral";

export class CargoService {
  getCargos(): Promise<Cargo[]> {
    return adminElectoralClient
      .get("cargos/")
      .then(res => res.data)
      .catch(err => { throw new Error(err.message); });
  }

  getCargoById(id: number): Promise<Cargo> {
    return adminElectoralClient
      .get(`cargos/${id}/`)
      .then(res => res.data)
      .catch(err => { throw new Error(err.message); });
  }

  createCargo(cargo: Omit<Cargo, "id">): Promise<Cargo> {
    return adminElectoralClient
      .post("cargos/", cargo)
      .then(res => res.data)
      .catch(err => { throw new Error(err.message); });
  }

  updateCargo(id: number, cargo: Partial<Cargo>): Promise<Cargo> {
    return adminElectoralClient
      .put(`cargos/${id}/`, cargo)
      .then(res => res.data)
      .catch(err => { throw new Error(err.message); });
  }

  deleteCargo(id: number): Promise<void> {
    return adminElectoralClient
      .delete(`cargos/${id}/`)
      .then(res => {
        if (res.status === 204) return;
        throw new Error(`Error: ${res.status}`);
      })
      .catch(err => { throw new Error(err.message); });
  }
}
