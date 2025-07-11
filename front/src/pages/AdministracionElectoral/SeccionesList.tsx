import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { SeccionService } from "../../services/AdminElectoralService/SeccionService";
import type { Seccion } from "../../models/adminElectoral/Seccion";

import { Menu } from "../../components/Menu";
import { Container } from "../../components/Container";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Table } from "../../components/Table";
import { URLS } from "../../navigation/CONTANTS";
import { MapaSelector } from "../../components/MapaSelector";

export const SeccionesList = () => {
  const navigate = useNavigate();
  useAuth();

  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [loading, setLoading] = useState(true);

  const seccionService = new SeccionService();

  const fetchSecciones = () => {
    setLoading(true);
    seccionService
      .getSecciones()
      .then((data) => setSecciones(data))
      .catch((e) => console.error("Error al cargar secciones:", e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSecciones();
  }, []);

  const deleteSeccion = (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta sección?")) return;
    seccionService
      .deleteSeccion(id)
      .then(() => fetchSecciones())
      .catch((e) => console.error("Error al eliminar sección:", e));
  };

  return (
    <>
      <Menu />
      <Container>
        <Card title="Lista de Secciones" className="text-center">
          <div className="text-right mb-4">
            <Button
              onClick={() => navigate(URLS.SECCIONES.CREATE)}
              title="Añadir Sección"
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
                  <th className="px-6 py-3 border-b text-center">Descripción</th>
                  <th className="px-6 py-3 border-b text-center">Área Geográfica</th>
                  <th className="px-6 py-3 border-b text-center"></th>
                  <th className="px-6 py-3 border-b text-center"></th>
                </tr>
              </thead>
              <tbody>
                {secciones.map((seccion) => (
                  <tr key={seccion.id} className="hover:bg-gray-50 align-top">
                    <td className="px-6 py-3 text-center border-b">{seccion.id}</td>
                    <td className="px-6 py-3 text-center border-b">{seccion.nombre}</td>
                    <td className="px-6 py-3 text-center border-b">{seccion.descripcion}</td>
                    <td className="px-6 py-3 border-b" style={{ width: 200, height: 150 }}>
                      <MapaSelector
                        value={seccion.area_geografica as [number, number][]}
                        readOnly={true}
                      />
                    </td>
                    <td className="text-center border-b space-x-2">
                      <Button
                        variant="primary"
                        title="Editar"
                        onClick={() =>
                          navigate(URLS.SECCIONES.EDIT.replace(":id", seccion.id.toString()))
                        }
                      />
                      <Button
                        title="Ver Recintos"
                        onClick={() =>
                          navigate(`${URLS.RECINTOS.LIST}?seccionId=${seccion.id}`)
                        }
                      />
                    </td>
                    <td className="text-center border-b">
                      <Button
                        variant="danger"
                        title="Eliminar"
                        onClick={() => deleteSeccion(seccion.id)}
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
