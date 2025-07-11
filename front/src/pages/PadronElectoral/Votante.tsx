import { useState } from "react";
import padronClient from "../../services/interceptorPadron"; 
import { Container } from "../../components/Container";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { MenuPadron } from "../../components/MenuPadron";

type VerificarResponse = {
  nombre_completo: string;
  recinto: string;
  recinto_id: number;
};

export const Votante = () => {
  const [ci, setCi] = useState("");
  const [data, setData] = useState<VerificarResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuscar = async () => {
    if (!ci.trim()) {
      setError("Por favor ingresa un CI válido.");
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await padronClient.get(`/verificar/?ci=${ci}`);
      setData(res.data);
    } catch {
      setError("No se encontró información para el CI ingresado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MenuPadron />
      <Container>
        <Card title="Verificar Recinto por CI">
          <div className="mb-4">
            <label htmlFor="ci" className="block font-semibold mb-2">
              CI:
            </label>
            <input
              id="ci"
              type="text"
              value={ci}
              onChange={(e) => setCi(e.target.value)}
              className="border rounded px-3 py-2 w-full md:w-64"
              placeholder="Ingrese el CI"
            />
          </div>
          <div className="mb-4">
            <Button
              title={loading ? "Buscando..." : "Buscar"}
              onClick={handleBuscar}
              disabled={loading}
              className="w-full md:w-auto"
            />
          </div>

          {error && <p className="text-red-600 font-semibold">{error}</p>}

          {data && (
            <div className="mt-6 border rounded p-4 bg-gray-50">
              <p>
                <strong>Nombre completo:</strong> {data.nombre_completo}
              </p>
              <p>
                <strong>Recinto:</strong> {data.recinto}
              </p>
              <p>
                <strong>ID Recinto:</strong> {data.recinto_id}
              </p>
            </div>
          )}
        </Card>
      </Container>
    </>
  );
};
