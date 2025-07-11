import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Container } from "../components/Container";
import { Card } from "../components/Card";
import { Menu } from "../components/Menu";
import { UsuarioService } from "../services/UsuarioService";
import { URLS } from "../navigation/CONTANTS";
import { Table } from "../components/Table";
import { Button } from "../components/Button";
import type { Usuario } from "../models/dto/Usuario";

const usuarioService = new UsuarioService();

export const HomePage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUsuarios = () => {
    setLoading(true);
    usuarioService
      .getUsuarios()
      .then(setUsuarios)
      .catch((err) => {
        setError(err.message || "Error al cargar usuarios");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDelete = (id: number) => {
    if (window.confirm("¿Deseas eliminar este usuario?")) {
      usuarioService
        .deleteUsuario(id)
        .then(fetchUsuarios)
        .catch((err) => alert("Error al eliminar: " + err.message));
    }
  };

  return (
    <>
      <Menu />
      <Container>
        <Card title="Lista de Usuarios">
          <div className="text-right mb-4">
            <Button
              title="Añadir Usuario"
              onClick={() => navigate(URLS.USUARIOS.CREATE)}
              className="w-full"
            />
          </div>

          {loading && <p>Cargando usuarios...</p>}
          {error && <p className="text-red-600">{error}</p>}

          <Table>
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-center border-b">ID</th>
                <th className="px-4 py-2 text-center border-b">Usuario</th>
                <th className="px-4 py-2 text-center border-b">Rol</th>
                <th className="px-4 py-2 text-center border-b"></th>
                <th className="px-4 py-2 text-center border-b"></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 border">
                    No hay usuarios disponibles
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                    <td className="text-center px-4 py-2 border-b">{usuario.id}</td>
                    <td className="text-center px-4 py-2 border-b">{usuario.username}</td>
                    <td className="text-center px-4 py-2 border-b">{usuario.role}</td>
                    <td className="text-center px-4 py-2 border-b">
                      <Button
                        title="Editar"
                        onClick={() => navigate(URLS.USUARIOS.UPDATE(usuario.id))}
                        variant="primary"
                        className="px-2"
                      />
                    </td>
                    <td className="text-center px-4 py-2 border-b">
                      <Button
                        title="Eliminar"
                        onClick={() => handleDelete(usuario.id)}
                        variant="danger"
                        className="px-2"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>
      </Container>
    </>
  );
};
