import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { EleccionService } from "../../services/AdminElectoralService/EleccionService";
import { SeccionService } from "../../services/AdminElectoralService/SeccionService";
import type { Eleccion } from "../../models/adminElectoral/Eleccion";
import type { Seccion } from "../../models/adminElectoral/Seccion";
import { Container } from "../../components/Container";
import { Card } from "../../components/Card";
import { FormField } from "../../components/FormField";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { MenuElectoral } from "../../components/MenuElectoral";
import { URLS } from "../../navigation/CONTANTS";

type Inputs = {
  tipo: string;
  fecha: string;
  secciones: number[];
};

export const EleccionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [seccionesOptions, setSeccionesOptions] = useState<Seccion[]>([]);

  const service = new EleccionService();
  const seccionService = new SeccionService();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      secciones: [],
    },
  });

  useEffect(() => {
    seccionService.getSecciones().then(setSeccionesOptions).catch(console.error);
  }, []);

  useEffect(() => {
    if (id) {
      service
        .getEleccionById(Number(id))
        .then((eleccion) => {
          setValue("tipo", eleccion.tipo);
          setValue("fecha", new Date(eleccion.fecha).toISOString().slice(0, 10));

          setValue("secciones", eleccion.secciones);
        })
        .catch(console.error);
    }
  }, [id]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
  const eleccionPayload: Omit<Eleccion, "id"> = {
    tipo: data.tipo,
    fecha: data.fecha,  
    secciones: data.secciones.map(Number),
  };
  console.log("Payload a enviar:", eleccionPayload);
  if (id) {
    service
      .updateEleccion(Number(id), eleccionPayload)
      .then(() => navigate(URLS.ELECCIONES.LIST))
      .catch(console.error);
  } else {
    service
      .createEleccion(eleccionPayload)
      .then(() => navigate(URLS.ELECCIONES.LIST))
      .catch(console.error);
  }
};


  const selectedSecciones = watch("secciones") || [];

  return (
    <>
      <MenuElectoral />
      <Container>
        <Card title={id ? "Editar Elección" : "Crear Elección"} className="mx-5 my-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField>
              <label htmlFor="tipo">Tipo:</label>
              <select id="tipo" {...register("tipo", { required: true })} className="w-full border rounded p-2">
                <option value="">-- Selecciona un tipo --</option>
                <option value="Presidencial">Presidencial</option>
                <option value="Municipal">Municipal</option>
                <option value="Universitaria">Universitaria</option>
              </select>
              {errors.tipo && <span>Este campo es requerido</span>}
            </FormField>


            <FormField>
              <label htmlFor="fecha">Fecha:</label>
              <Input id="fecha" {...register("fecha", { required: true })} type="date" />
              {errors.fecha && <span>Este campo es requerido</span>}
            </FormField>

            <FormField>
              <label>Secciones:</label>
              <div className="flex flex-col max-h-60 overflow-auto border rounded p-2">
                {seccionesOptions.map((s) => {
                  const checked = selectedSecciones.includes(s.id);
                  return (
                    <label key={s.id} className="inline-flex items-center mb-1 cursor-pointer">
                      <input
                        type="checkbox"
                        value={s.id}
                        checked={checked}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          let newSecciones: number[];
                          if (e.target.checked) {
                            newSecciones = [...selectedSecciones, value];
                          } else {
                            newSecciones = selectedSecciones.filter((id) => id !== value);
                          }
                          setValue("secciones", newSecciones, { shouldValidate: true });
                        }}
                        className="mr-2"
                      />
                      {s.nombre}
                    </label>
                  );
                })}
              </div>
              {errors.secciones && <span>Selecciona al menos una sección</span>}
            </FormField>

            <Button type="submit" title={id ? "Actualizar" : "Crear"} />
          </form>
        </Card>
      </Container>
    </>
  );
};
