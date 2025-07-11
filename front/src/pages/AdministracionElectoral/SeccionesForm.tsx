import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { SeccionService } from "../../services/AdminElectoralService/SeccionService";
import type { Seccion } from "../../models/adminElectoral/Seccion";
import { URLS } from "../../navigation/CONTANTS";
import { Menu } from "../../components/Menu";
import { Container } from "../../components/Container";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { MapaSelector } from "../../components/MapaSelector"; // verifica que esta ruta es correcta

const seccionService = new SeccionService();

type SeccionFormData = {
  nombre: string;
  descripcion: string;
  area_geografica: string; // JSON string de [number, number][]
};

export const SeccionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<SeccionFormData>({
    defaultValues: {
      nombre: "",
      descripcion: "",
      area_geografica: "[]",
    },
  });

  useEffect(() => {
    if (id) {
      seccionService
        .getSeccionById(Number(id))
        .then((data) => {
          setValue("nombre", data.nombre);
          setValue("descripcion", data.descripcion);
          setValue("area_geografica", JSON.stringify(data.area_geografica));
        })
        .catch((e) => {
          console.error("Error al cargar sección", e);
        });
    }
  }, [id, setValue]);

  const onSubmit = (data: SeccionFormData) => {
    let areaGeoParsed: [number, number][];
    try {
      areaGeoParsed = JSON.parse(data.area_geografica);
      if (!Array.isArray(areaGeoParsed) || areaGeoParsed.length === 0) {
        alert("Debes seleccionar al menos un punto en el mapa.");
        return;
      }
    } catch {
      alert("Área geográfica inválida. Debe ser un arreglo JSON válido.");
      return;
    }

    const seccionToSend: Omit<Seccion, "id"> = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      area_geografica: areaGeoParsed,
    };

    const callback = () => navigate(URLS.SECCIONES.LIST);

    if (id) {
      seccionService
        .updateSeccion(Number(id), seccionToSend)
        .then(() => {
          alert("Sección actualizada");
          callback();
        })
        .catch((e) => {
          alert("Error al actualizar sección");
          console.error(e);
        });
    } else {
      seccionService
        .createSeccion(seccionToSend)
        .then(() => {
          alert("Sección creada");
          callback();
        })
        .catch((e) => {
          alert("Error al crear sección");
          console.error(e);
        });
    }
  };

  return (
    <>
      <Menu />
      <Container>
        <Card title={id ? "Editar Sección" : "Crear Sección"}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg mx-auto">
            <div>
              <label className="block font-medium mb-1" htmlFor="nombre">
                Nombre
              </label>
              <Input
                id="nombre"
                {...register("nombre", { required: "Nombre es requerido" })}
              />
              {errors.nombre && (
                <p className="text-red-600 text-sm">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1" htmlFor="descripcion">
                Descripción
              </label>
              <Input id="descripcion" {...register("descripcion")} />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Área Geográfica (clic en el mapa para seleccionar puntos)
              </label>

              {/* Mantenemos el textarea oculto solo para registro en el form */}
              <textarea
                id="area_geografica"
                {...register("area_geografica", {
                  required: "El área geográfica es requerida",
                })}
                rows={6}
                className="w-full border rounded p-2"
                placeholder='Ejemplo: [[-17.783295, -63.181211], [-17.78397, -63.180054], ...]'
                style={{ display: "none" }}
              />

              <MapaSelector
                value={JSON.parse(getValues("area_geografica")) as [number, number][]}
                onChange={(coords: [number, number][]) =>
                  setValue("area_geografica", JSON.stringify(coords))
                }
              />

              {errors.area_geografica && (
                <p className="text-red-600 text-sm">{errors.area_geografica.message}</p>
              )}
            </div>

            <div className="flex justify-between">
              <Button type="submit" title={id ? "Actualizar" : "Crear"} />
              <Button
                type="button"
                variant="danger"
                onClick={() => navigate(URLS.SECCIONES.LIST)}
                title="Cancelar"
              />
            </div>
          </form>
        </Card>
      </Container>
    </>
  );
};
