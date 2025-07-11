import type { Votante } from "../../models/PadronElectoral/Votante";
import padronClient from "../interceptorPadron";

export type Recinto = {
  id: number;
  nombre: string;
  direccion: string;
  latitud: string;
  longitud: string;
  seccion: number;
};

export class VotanteService {
  getVotantes(): Promise<Votante[]> {
    return padronClient
      .get("votantes/")
      .then(res => res.data)
      .catch(err => {
        throw new Error(err.message);
      });
  }

  getVotanteById(id: number): Promise<Votante> {
    return padronClient
      .get(`votantes/${id}/`)
      .then(res => res.data)
      .catch(err => {
        throw new Error(err.message);
      });
  }

  createVotante(data: FormData): Promise<Votante> {
    return padronClient
      .post("votantes/", data)
      .then(res => res.data)
      .catch(err => {
        throw new Error(err.message);
      });
  }

  updateVotante(id: number, data: FormData): Promise<Votante> {
    return padronClient
      .put(`votantes/${id}/`, data)
      .then(res => res.data)
      .catch(err => {
        throw new Error(err.message);
      });
  }

  deleteVotante(id: number): Promise<void> {
    return padronClient
      .delete(`votantes/${id}/`)
      .then(res => {
        if (res.status === 204) return;
        throw new Error(`Error: ${res.status}`);
      })
      .catch(err => {
        throw new Error(err.message);
      });
  }

  getRecintos(): Promise<Recinto[]> {
    return padronClient
      .get("recintos/")
      .then(res => res.data)
      .catch(err => {
        throw new Error(err.message);
      });
  }
  verificarRecintoPorCI(ci: string): Promise<{ nombre_completo: string; recinto: string; recinto_id: number }> {
    return padronClient
      .get(`verificar/`, { params: { ci } })
      .then(res => res.data)
      .catch(err => {
        throw new Error(err.message);
      });
  }
}
