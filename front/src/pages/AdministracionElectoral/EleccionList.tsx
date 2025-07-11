import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { EleccionService } from "../../services/AdminElectoralService/EleccionService";
import { SeccionService } from "../../services/AdminElectoralService/SeccionService";
import type { Eleccion } from "../../models/adminElectoral/Eleccion";
import type { Seccion } from "../../models/adminElectoral/Seccion";
import { Container } from "../../components/Container";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Table } from "../../components/Table";
import { MenuElectoral } from "../../components/MenuElectoral";
import { URLS } from "../../navigation/CONTANTS";

export const EleccionList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [elecciones, setElecciones] = useState<Eleccion[]>([]);
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [loading, setLoading] = useState(true);

  const eleccionService = new EleccionService();
  const seccionService = new SeccionService();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eleccionesData, seccionesData] = await Promise.all([
        eleccionService.getElecciones(),
        seccionService.getSecciones(),
      ]);
      setElecciones(eleccionesData);
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

  const deleteEleccion = (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta elección?")) return;
    eleccionService
      .deleteEleccion(id)
      .then(() => fetchData())
      .catch((e) => console.error("Error al eliminar elección:", e));
  };

  const seccionesMap: Record<number, string> = {};
  secciones.forEach((s) => {
    seccionesMap[s.id] = s.nombre;
  });

  const searchParams = new URLSearchParams(location.search);
  const seccionIdParam = searchParams.get("seccionId");
  const seccionId = seccionIdParam ? Number(seccionIdParam) : null;

  const eleccionesFiltradas = seccionId
    ? elecciones.filter((eleccion) => eleccion.secciones.includes(seccionId))
    : elecciones;

  return (
    <>
      <MenuElectoral />
      <Container>
        <Card title="Lista de Elecciones" className="text-center">
          <div className="text-right mb-4">
            <Button
              onClick={() => navigate(URLS.ELECCIONES.CREATE)}
              title="Añadir Elección"
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
                  <th className="px-6 py-3 border-b text-center">Tipo</th>
                  <th className="px-6 py-3 border-b text-center">Fecha</th>
                  <th className="px-6 py-3 border-b text-center">Secciones</th>
                  <th className="px-6 py-3 border-b text-center"></th>
                  <th className="px-6 py-3 border-b text-center"></th>
                </tr>
              </thead>
              <tbody>
                {eleccionesFiltradas.map((eleccion) => (
                  <tr key={eleccion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-center border-b">{eleccion.id}</td>
                    <td className="px-6 py-3 text-center border-b">{eleccion.tipo}</td>
                    <td className="px-6 py-3 text-center border-b">
                      {new Date(eleccion.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-center border-b">
                      {eleccion.secciones
                        .map((id) => seccionesMap[id] ?? `#${id}`)
                        .join(", ")}
                    </td>
                    <td className="text-center border-b">
                      <Button
                        variant="primary"
                        title="Editar"
                        onClick={() =>
                          navigate(URLS.ELECCIONES.EDIT.replace(":id", eleccion.id.toString()))
                        }
                      />
                    </td>
                    <td className="text-center border-b">
                      <Button
                        variant="danger"
                        title="Eliminar"
                        onClick={() => deleteEleccion(eleccion.id)}
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
