import type { Candidatura } from "../../models/adminElectoral/Candidatura";
import adminElectoralClient from "../interceptorAdminElectoral";

export class CandidaturaService {
  getCandidaturas(): Promise<Candidatura[]> {
    return adminElectoralClient
      .get("candidaturas/")
      .then(res => res.data)
      .catch(err => { throw new Error(err.message); });
  }

  getCandidaturaById(id: number): Promise<Candidatura> {
    return adminElectoralClient
      .get(`candidaturas/${id}/`)
      .then(res => res.data)
      .catch(err => { throw new Error(err.message); });
  }

  createCandidatura(candidatura: Omit<Candidatura, "id">): Promise<Candidatura> {
    return adminElectoralClient
      .post("candidaturas/", candidatura)
      .then(res => res.data)
      .catch(err => { throw new Error(err.message); });
  }

  updateCandidatura(id: number, candidatura: Partial<Candidatura>): Promise<Candidatura> {
    return adminElectoralClient
      .put(`candidaturas/${id}/`, candidatura)
      .then(res => res.data)
      .catch(err => { throw new Error(err.message); });
  }

  deleteCandidatura(id: number): Promise<void> {
    return adminElectoralClient
      .delete(`candidaturas/${id}/`)
      .then(res => {
        if (res.status === 204) return;
        throw new Error(`Error: ${res.status}`);
      })
      .catch(err => { throw new Error(err.message); });
  }
}
