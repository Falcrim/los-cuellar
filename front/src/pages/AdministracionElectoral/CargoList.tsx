import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { CargoService } from "../../services/AdminElectoralService/CargoService";
import { SeccionService } from "../../services/AdminElectoralService/SeccionService";
import type { Cargo } from "../../models/adminElectoral/Cargo";
import type { Seccion } from "../../models/adminElectoral/Seccion";
import { Container } from "../../components/Container";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Table } from "../../components/Table";
import { MenuElectoral } from "../../components/MenuElectoral";
import { URLS } from "../../navigation/CONTANTS";

export const CargoList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [loading, setLoading] = useState(true);

  const cargoService = new CargoService();
  const seccionService = new SeccionService();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cargosData, seccionesData] = await Promise.all([
        cargoService.getCargos(),
        seccionService.getSecciones(),
      ]);
      setCargos(cargosData);
      setSecciones(seccionesData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteCargo = (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este cargo?")) return;
    cargoService
      .deleteCargo(id)
      .then(() => fetchData())
      .catch((e) => console.error("Error al eliminar cargo:", e));
  };

  const seccionesMap: Record<number, string> = {};
  secciones.forEach((s) => {
    seccionesMap[s.id] = s.nombre;
  });

  const searchParams = new URLSearchParams(location.search);
  const seccionIdParam = searchParams.get("seccionId");
  const seccionId = seccionIdParam ? Number(seccionIdParam) : null;

  const cargosFiltrados = seccionId
    ? cargos.filter((cargo) => cargo.secciones.includes(seccionId))
    : cargos;

  return (
    <>
      <MenuElectoral />
      <Container>
        <Card title="Lista de Cargos">
          <div className="text-right mb-4">
            <Button
              onClick={() => navigate(URLS.CARGOS.CREATE)}
              title="Añadir Cargo"
              className="w-full md:w-auto"
            />
          </div>

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <Table>
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 border-b text-center">ID</th>
                  <th className="px-6 py-3 border-b text-center">Nombre</th>
                  <th className="px-6 py-3 border-b text-center">Secciones</th>
                  <th className="px-6 py-3 border-b text-center">Candidatos</th>

                  <th className="px-6 py-3 border-b text-center" colSpan={2}></th>
                </tr>
              </thead>
              <tbody>
                {cargosFiltrados.map((cargo) => (
                  <tr key={cargo.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-center border-b">{cargo.id}</td>
                    <td className="px-6 py-3 text-center border-b">{cargo.nombre}</td>
                    <td className="px-6 py-3 text-center border-b">
                      {cargo.secciones
                        .map((id) => seccionesMap[id] ?? `#${id}`)
                        .join(", ")}
                    </td>
                    <td className="text-center border-b">
                      <Button
                        variant ="primary"
                        title="Ver Candidatos"
                        onClick={() =>
                          navigate(`${URLS.CANDIDATURAS.LIST}?cargoId=${cargo.id}`)
                        }
                      />
                    </td>

                    <td className="text-center border-b">
                      <Button
                        variant="primary"
                        title="Editar"
                        onClick={() => navigate(URLS.CARGOS.EDIT.replace(":id", cargo.id.toString()))}
                      />
                    
                    </td>
                    <td className="text-center border-b">
                      <Button
                        variant="danger"
                        title="Eliminar"
                        onClick={() => deleteCargo(cargo.id)}
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
