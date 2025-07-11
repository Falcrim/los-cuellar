import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { RecintoService } from "../../services/AdminElectoralService/RecintoService";
import { URLS } from "../../navigation/CONTANTS";
import { Menu } from "../../components/Menu";
import { Container } from "../../components/Container";
import { Card } from "../../components/Card";
import { FormField } from "../../components/FormField";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

interface IconDefaultWithGetIconUrl extends L.Icon.Default {
  _getIconUrl?: () => void;
}

delete (L.Icon.Default.prototype as IconDefaultWithGetIconUrl)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

type Inputs = {
  nombre: string;
  direccion: string;
  latitud: string;
  longitud: string;
  seccion: number;
};

const defaultPosition: [number, number] = [-17.7833, -63.1821];

function LocationMarker({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export const RecintoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      latitud: "",
      longitud: "",
    },
  });

  const latitud = watch("latitud");
  const longitud = watch("longitud");

  useEffect(() => {
    if (id) {
      new RecintoService()
        .getRecintoById(Number(id))
        .then((recinto) => {
          setValue("nombre", recinto.nombre);
          setValue("direccion", recinto.direccion);
          setValue("latitud", recinto.latitud);
          setValue("longitud", recinto.longitud);
          setValue("seccion", recinto.seccion);
        })
        .catch((error) => {
          console.error("Error al cargar recinto:", error);
        });
    }
  }, [id, setValue]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (!data.latitud || !data.longitud) {
      alert("Por favor selecciona una ubicación en el mapa.");
      return;
    }

    const service = new RecintoService();

    if (id) {
      service
        .updateRecinto(Number(id), data)
        .then(() => navigate(URLS.RECINTOS.LIST))
        .catch((error) => {
          console.error("Error al actualizar recinto:", error);
        });
    } else {
      service
        .createRecinto(data)
        .then(() => navigate(URLS.RECINTOS.LIST))
        .catch((error) => {
          console.error("Error al crear recinto:", error);
        });
    }
  };

  return (
    <>
      <Menu />
      <Container>
        <Card title={id ? "Editar Recinto" : "Crear Recinto"} className="mx-5 my-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField>
              <label htmlFor="nombre">Nombre:</label>
              <Input id="nombre" {...register("nombre", { required: true })} type="text" />
              {errors.nombre && <span>Este campo es requerido</span>}
            </FormField>

            <FormField>
              <label htmlFor="direccion">Dirección:</label>
              <Input id="direccion" {...register("direccion", { required: true })} type="text" />
              {errors.direccion && <span>Este campo es requerido</span>}
            </FormField>

            <FormField>
              <label>Ubicación (clic en el mapa para seleccionar):</label>
              <div style={{ height: "300px", marginBottom: "1rem" }}>
                <MapContainer
                  center={
                    latitud && longitud ? [parseFloat(latitud), parseFloat(longitud)] : defaultPosition
                  }
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker
                    onChange={(lat, lng) => {
                      setValue("latitud", lat.toString(), { shouldValidate: true });
                      setValue("longitud", lng.toString(), { shouldValidate: true });
                    }}
                  />
                  {latitud && longitud && (
                    <Marker position={[parseFloat(latitud), parseFloat(longitud)]} />
                  )}
                </MapContainer>
              </div>
            </FormField>

            <FormField>
              <label htmlFor="latitud">Latitud:</label>
              <Input id="latitud" {...register("latitud", { required: true })} type="text" disabled />
              {errors.latitud && <span>Latitud es requerida</span>}
            </FormField>

            <FormField>
              <label htmlFor="longitud">Longitud:</label>
              <Input id="longitud" {...register("longitud", { required: true })} type="text" disabled />
              {errors.longitud && <span>Longitud es requerida</span>}
            </FormField>

            <FormField>
              <label htmlFor="seccion">Sección:</label>
              <Input
                id="seccion"
                {...register("seccion", { required: true, valueAsNumber: true })}
                type="number"
              />
              {errors.seccion && <span>Este campo es requerido</span>}
            </FormField>

            <Button type="submit" title={id ? "Actualizar" : "Crear"} />
          </form>
        </Card>
      </Container>
    </>
  );
};
