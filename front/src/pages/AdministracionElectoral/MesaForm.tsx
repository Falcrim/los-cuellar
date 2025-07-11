import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { Usuario } from "../../models/dto/Usuario";
import { useForm, type SubmitHandler } from "react-hook-form";
import { UsuarioService } from "../../services/UsuarioService";
import { MesaService } from "../../services/AdminElectoralService/MesaService";
import { URLS } from "../../navigation/CONTANTS";
import { Container } from "../../components/Container";
import { Card } from "../../components/Card";
import { FormField } from "../../components/FormField";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { MenuElectoral } from "../../components/MenuElectoral";

type Inputs = {
  numero: number;
  recinto: number;
  jurado_ids: string[];
};


export const MesaForm = () => {
  const navigate = useNavigate();
  const { id, recintoId } = useParams<{ id?: string; recintoId?: string }>();

  const [jurados, setJurados] = useState<Usuario[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    new UsuarioService()
      .getUsuarios()
      .then((usuarios) => {
        setJurados(usuarios.filter((u) => u.role === "Jurado"));
      })
      .catch((error) => {
        console.error("Error al cargar jurados:", error);
      });
  }, []);

  useEffect(() => {
  if (id) {
    new MesaService()
      .getMesaById(Number(id))
      .then((mesa) => {
        setValue("numero", mesa.numero);
        setValue("recinto", mesa.recinto);
        setValue(
          "jurado_ids",
          mesa.jurado_ids ? mesa.jurado_ids.map((idStr) => idStr.toString()) : []
        );
      })
      .catch((error) => {
        console.error("Error al cargar mesa:", error);
      });
  } else if (recintoId) {
    setValue("recinto", Number(recintoId));
  }
}, [id, recintoId, setValue]);


  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const service = new MesaService();

    if (id) {
      service
        .updateMesa(Number(id), data)
        .then(() => navigate(URLS.RECINTOS.LIST))
        .catch((error) => {
          console.error("Error al actualizar mesa:", error);
        });
    } else {
      service
        .createMesa(data)
        .then(() => navigate(URLS.RECINTOS.LIST))
        .catch((error) => {
          console.error("Error al crear mesa:", error);
        });
    }
  };

  return (
    <>
      <MenuElectoral />
      <Container>
        <Card title={id ? "Editar Mesa" : "Crear Mesa"} className="mx-5 my-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField>
              <label htmlFor="numero">Número de Mesa:</label>
              <Input
                id="numero"
                {...register("numero", { required: true, valueAsNumber: true })}
                type="number"
              />
              {errors.numero && <span>Este campo es requerido</span>}
            </FormField>

            <FormField>
  <label>Jurados electorales:</label>
  <div className="flex flex-col max-h-40 overflow-y-auto border rounded p-2">
    {jurados.map((jurado) => (
      <label key={jurado.id} className="inline-flex items-center mb-1">
        <input
          type="checkbox"
          value={jurado.id}
          {...register("jurado_ids", { required: true })}
          className="mr-2"
        />
        {jurado.username}
      </label>
    ))}
  </div>
  {errors.jurado_ids && (
    <span>Seleccione al menos un jurado</span>
  )}
</FormField>


            <Button type="submit" title={id ? "Actualizar" : "Crear"} />
          </form>
        </Card>
      </Container>
    </>
  );
};