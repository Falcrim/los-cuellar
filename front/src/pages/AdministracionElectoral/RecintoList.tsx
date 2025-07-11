import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import type { Recinto } from "../../models/adminElectoral/Recinto";
import type { Mesa } from "../../models/adminElectoral/Mesa";
import { useAuth } from "../../hooks/useAuth";
import { RecintoService } from "../../services/AdminElectoralService/RecintoService";
import { MesaService } from "../../services/AdminElectoralService/MesaService";
import { Menu } from "../../components/Menu";
import { Container } from "../../components/Container";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { URLS } from "../../navigation/CONTANTS";
import { Table } from "../../components/Table";
import { MapView } from "../../components/MapView";

export const RecintoList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useAuth();

  const [recintos, setRecintos] = useState<Recinto[]>([]);
  const [mesas, setMesas] = useState<Mesa[]>([]);

  // Leer el id de la sección desde query param
  const seccionIdParam = searchParams.get("seccionId");
  const seccionId = seccionIdParam ? Number(seccionIdParam) : null;

  const getRecintosAndMesas = () => {
    const recintoService = new RecintoService();
    const mesaService = new MesaService();

    Promise.all([recintoService.getRecintos(), mesaService.getMesas()])
      .then(([recintosData, mesasData]) => {
        // Si seccionId está presente, filtrar recintos solo de esa sección
        if (seccionId) {
          setRecintos(recintosData.filter((r) => r.seccion === seccionId));
        } else {
          setRecintos(recintosData);
        }
        setMesas(mesasData);
      })
      .catch((error) => {
        console.error("Error al cargar recintos o mesas:", error);
      });
  };

  useEffect(() => {
    getRecintosAndMesas();
  }, [seccionId]);

  const deleteRecinto = (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este recinto?")) return;

    new RecintoService()
      .deleteRecinto(id)
      .then(() => {
        getRecintosAndMesas();
      })
      .catch((error) => {
        console.error("Error al eliminar recinto:", error);
      });
  };

  const deleteMesa = (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta mesa?")) return;

    new MesaService()
      .deleteMesa(id)
      .then(() => {
        getRecintosAndMesas();
      })
      .catch((error) => {
        console.error("Error al eliminar mesa:", error);
      });
  };

  const mesasPorRecinto = (recintoId: number) =>
    mesas.filter((mesa) => mesa.recinto === recintoId);

  return (
    <>
      <Menu />
      <Container>
        <Card title={`Lista de Recintos${seccionId ? ` - Sección ${seccionId}` : ""}`} className="text-center">
          <div className="text-right mb-4">
            <Button
              onClick={() => navigate(URLS.RECINTOS.CREATE)}
              title="Añadir Recinto"
              className="w-full md:w-auto"
            />
          </div>

          <Table>
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-center border-b">ID</th>
                <th className="px-6 py-3 text-center border-b">Nombre</th>
                <th className="px-6 py-3 text-center border-b">Dirección</th>
                <th className="px-6 py-3 text-center border-b">Mapa</th>
                <th className="px-6 py-3 text-center border-b">Mesas</th>
                <th className="px-6 py-3 text-center border-b"></th>
                <th className="px-6 py-3 text-center border-b"></th>
              </tr>
            </thead>
            <tbody>
              {recintos.map((recinto) => (
                <tr key={recinto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-center border-b">{recinto.id}</td>
                  <td className="px-6 py-3 text-center border-b">{recinto.nombre}</td>
                  <td className="px-6 py-3 text-center border-b">{recinto.direccion}</td>
                  <td
                    className="px-6 py-3 text-center border-b"
                    style={{ minWidth: 200, height: 150 }}
                  >
                    {recinto.latitud && recinto.longitud ? (
                      <MapView
                        lat={Number(recinto.latitud)}
                        lng={Number(recinto.longitud)}
                        zoom={15}
                      />
                    ) : (
                      <span>No disponible</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-left border-b">
                    {mesasPorRecinto(recinto.id).map((mesa) => (
                      <div
                        key={mesa.id}
                        className="flex items-center justify-between border rounded p-1 mb-1"
                      >
                        <span>Mesa #{mesa.numero}</span>
                        <div>
                          <Button
                            variant="primary"
                            className="mr-2"
                            onClick={() =>
                              navigate(URLS.MESAS.EDIT.replace(":id", mesa.id.toString()))
                            }
                            title="Editar Mesa"
                          />
                          <Button
                            variant="danger"
                            onClick={() => deleteMesa(mesa.id)}
                            title="Eliminar Mesa"
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={() => navigate(URLS.MESAS.CREATE(recinto.id))}
                      title="Añadir Mesa"
                      className="mt-2 w-full md:w-auto"
                    />
                  </td>
                  <td className="text-center border-b">
                    <Button
                      onClick={() =>
                        navigate(URLS.RECINTOS.EDIT.replace(":id", recinto.id.toString()))
                      }
                      variant="primary"
                      title="Editar"
                    />
                  </td>
                  <td className="text-center border-b">
                    <Button
                      onClick={() => deleteRecinto(recinto.id)}
                      variant="danger"
                      title="Eliminar"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </Container>
    </>
  );
};
