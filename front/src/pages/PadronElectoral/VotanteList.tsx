import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { VotanteService } from "../../services/PadronElectoral/VotanteService";
import type { Votante } from "../../models/PadronElectoral/Votante";
import { Container } from "../../components/Container";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Table } from "../../components/Table";
import { URLS } from "../../navigation/CONTANTS";
import { MenuPadron } from "../../components/MenuPadron";

export const VotanteList = () => {
  const navigate = useNavigate();
  const [votantes, setVotantes] = useState<Votante[]>([]);
  const [loading, setLoading] = useState(true);
  const votanteService = new VotanteService();

  const fetchData = async () => {
    try {
      const data = await votanteService.getVotantes();
      setVotantes(data);
    } catch (err) {
      console.error("Error al cargar votantes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este votante?");
    if (!confirmDelete) return;

    try {
      await votanteService.deleteVotante(id);
      fetchData();
    } catch (err) {
      console.error("Error al eliminar votante:", err);
      alert("No se pudo eliminar el votante.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
    <MenuPadron />
    <Container>
      <Card title="Lista de Votantes">
        <div className="text-right mb-4">
          <Button
            onClick={() => navigate(URLS.VOTANTES.CREATE)}
            title="Añadir Votante"
            className="w-full md:w-auto"
          />
        </div>
        {loading ? (
          <p className="text-center text-gray-500">Cargando votantes...</p>
        ) : votantes.length === 0 ? (
          <p className="text-center text-gray-500">No hay votantes registrados.</p>
        ) : (
          <Table>
            <thead>
              <tr>
                <th className="px-4 py-2">Foto</th>
                <th className="px-4 py-2">CI</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Dirección</th>
                <th className="px-4 py-2">Recinto</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {votantes.map((v) => (
                <tr key={v.id}>
                  <td className="px-4 py-2">
                    {v.foto_votante ? (
                      <img
                        src={v.foto_votante}
                        alt="Foto votante"
                        className="h-16 w-16 object-cover rounded border"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">Sin foto</span>
                    )}
                  </td>
                  <td className="px-4 py-2">{v.ci}</td>
                  <td className="px-4 py-2">{v.nombre_completo}</td>
                  <td className="px-4 py-2">{v.direccion}</td>
                  <td className="px-4 py-2">{v.recinto_nombre}</td>
                  <td className="px-4 py-2 space-x-2">
                    <Button
                      variant="primary"
                      title="Editar"
                      onClick={() => navigate(URLS.VOTANTES.EDIT.replace(":id", v.id.toString()))}
                    />
                    <Button
                      variant="danger"
                      title="Eliminar"
                      onClick={() => handleDelete(v.id)}
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
