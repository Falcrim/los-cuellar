import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { CandidaturaService } from "../../services/AdminElectoralService/CandidaturaService";
import { CargoService } from "../../services/AdminElectoralService/CargoService";
import type { Candidatura } from "../../models/adminElectoral/Candidatura";
import type { Cargo } from "../../models/adminElectoral/Cargo";
import { Container } from "../../components/Container";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Table } from "../../components/Table";
import { MenuElectoral } from "../../components/MenuElectoral";
import { URLS } from "../../navigation/CONTANTS";

export const CandidaturaList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(true);

  const candidaturaService = new CandidaturaService();
  const cargoService = new CargoService();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [candData, cargoData] = await Promise.all([
        candidaturaService.getCandidaturas(),
        cargoService.getCargos(),
      ]);
      setCandidaturas(candData);
      setCargos(cargoData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteCandidatura = (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta candidatura?")) return;
    candidaturaService.deleteCandidatura(id)
      .then(() => fetchData())
      .catch(e => console.error("Error al eliminar candidatura:", e));
  };

  const cargoMap: Record<number, string> = {};
  cargos.forEach(c => { cargoMap[c.id] = c.nombre; });

  const searchParams = new URLSearchParams(location.search);
  const cargoIdParam = searchParams.get("cargoId");
  const cargoId = cargoIdParam ? Number(cargoIdParam) : null;

  const candidaturasFiltradas = cargoId
    ? candidaturas.filter(c => c.cargo === cargoId)
    : candidaturas;

  return (
    <>
      <MenuElectoral />
      <Container>
        <Card title="Lista de Candidaturas">
          <div className="flex justify-between items-center mb-4">
            <Button
              onClick={() => navigate(URLS.CANDIDATURAS.CREATE)}
              title="Añadir Candidatura"
              className="w-full md:w-auto"
            />
            {cargoId && (
              <Button
                variant="primary"
                title="Limpiar Filtro"
                onClick={() => navigate(URLS.CANDIDATURAS.LIST)}
              />
            )}
          </div>

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <Table>
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 border-b text-center">ID</th>
                  <th className="px-6 py-3 border-b text-center">Sigla</th>
                  <th className="px-6 py-3 border-b text-center">Partido</th>
                  <th className="px-6 py-3 border-b text-center">Color</th>
                  <th className="px-6 py-3 border-b text-center">Candidato</th>
                  <th className="px-6 py-3 border-b text-center">Cargo</th>
                  <th className="px-6 py-3 border-b text-center"></th>
                  <th className="px-6 py-3 border-b text-center" colSpan={2}></th>
                </tr>
              </thead>
              <tbody>
                {candidaturasFiltradas.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-center border-b">{c.id}</td>
                    <td className="px-6 py-3 text-center border-b">{c.sigla}</td>
                    <td className="px-6 py-3 text-center border-b">{c.partido}</td>
                    <td className="px-6 py-3 text-center border-b">
                      <div
                        title={c.color}
                        className="mx-auto w-6 h-6 rounded-full border"
                        style={{ backgroundColor: c.color }}
                      ></div>
                    </td>
                    <td className="px-6 py-3 text-center border-b">{c.candidato}</td>
                    <td className="px-6 py-3 text-center border-b">{cargoMap[c.cargo] ?? `#${c.cargo}`}</td>
                    <td className="text-center border-b">
                      <Button
                        variant="primary"
                        title="Editar"
                        onClick={() =>
                          navigate(URLS.CANDIDATURAS.EDIT.replace(":id", c.id.toString()))
                        }
                      />
                    </td>
                    <td className="text-center border-b">
                      <Button
                        variant="danger"
                        title="Eliminar"
                        onClick={() => deleteCandidatura(c.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Container>
    </>
  );
};
