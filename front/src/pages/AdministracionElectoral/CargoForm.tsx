import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { CargoService } from "../../services/AdminElectoralService/CargoService";
import { SeccionService } from "../../services/AdminElectoralService/SeccionService";
import type { Cargo } from "../../models/adminElectoral/Cargo";
import type { Seccion } from "../../models/adminElectoral/Seccion";
import { Container } from "../../components/Container";
import { Card } from "../../components/Card";
import { FormField } from "../../components/FormField";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { MenuElectoral } from "../../components/MenuElectoral";

type Inputs = {
  nombre: string;
  secciones: number[];
};

export const CargoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [seccionesOptions, setSeccionesOptions] = useState<Seccion[]>([]);
  const service = new CargoService();
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
      service.getCargoById(Number(id)).then((cargo) => {
        setValue("nombre", cargo.nombre);
        setValue("secciones", cargo.secciones);
      });
    }
  }, [id]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const payload: Omit<Cargo, "id"> = {
      nombre: data.nombre,
      secciones: data.secciones,
    };

    const action = id
      ? service.updateCargo(Number(id), payload)
      : service.createCargo(payload);

    action
      .then(() => navigate("/cargos"))
      .catch(console.error);
  };

  const selectedSecciones = watch("secciones") || [];

  return (
    <>
      <MenuElectoral />
      <Container>
        <Card title={id ? "Editar Cargo" : "Crear Cargo"} className="mx-5 my-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField>
              <label htmlFor="nombre">Nombre:</label>
              <Input id="nombre" {...register("nombre", { required: true })} />
              {errors.nombre && <span>Este campo es requerido</span>}
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
                          const newSecciones = e.target.checked
                            ? [...selectedSecciones, value]
                            : selectedSecciones.filter((id) => id !== value);
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
