import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { CandidaturaService } from "../../services/AdminElectoralService/CandidaturaService";
import { CargoService } from "../../services/AdminElectoralService/CargoService";
import type { Cargo } from "../../models/adminElectoral/Cargo";
import { Container } from "../../components/Container";
import { Card } from "../../components/Card";
import { FormField } from "../../components/FormField";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { MenuElectoral } from "../../components/MenuElectoral";
import { URLS } from "../../navigation/CONTANTS";

type Inputs = {
  sigla: string;
  partido: string;
  color: string;
  candidato: string;
  cargo: number;
};

export const CandidaturaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [cargos, setCargos] = useState<Cargo[]>([]);

  const service = new CandidaturaService();
  const cargoService = new CargoService();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    cargoService.getCargos().then(setCargos).catch(console.error);
  }, []);

  useEffect(() => {
    if (id) {
      service.getCandidaturaById(Number(id))
        .then((c) => {
          setValue("sigla", c.sigla);
          setValue("partido", c.partido);
          setValue("color", c.color);
          setValue("candidato", c.candidato);
          setValue("cargo", c.cargo);
        })
        .catch(console.error);
    }
  }, [id]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const payload = {
      ...data,
      cargo: Number(data.cargo),
    };

    const op = id
      ? service.updateCandidatura(Number(id), payload)
      : service.createCandidatura(payload);

    op.then(() => navigate(URLS.CANDIDATURAS.LIST)).catch(console.error);
  };

  return (
    <>
      <MenuElectoral />
      <Container>
        <Card title={id ? "Editar Candidatura" : "Crear Candidatura"}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField>
              <label>Sigla:</label>
              <Input {...register("sigla", { required: true })} />
              {errors.sigla && <span>Campo requerido</span>}
            </FormField>

            <FormField>
              <label>Partido:</label>
              <Input {...register("partido", { required: true })} />
              {errors.partido && <span>Campo requerido</span>}
            </FormField>

            <FormField>
              <label>Color:</label>
              <Input {...register("color", { required: true })} type="color" />
              {errors.color && <span>Campo requerido</span>}
            </FormField>

            <FormField>
              <label>Candidato:</label>
              <Input {...register("candidato", { required: true })} />
              {errors.candidato && <span>Campo requerido</span>}
            </FormField>

            <FormField>
              <label>Cargo:</label>
              <select {...register("cargo", { required: true })} className="w-full border rounded p-2">
                <option value="">-- Selecciona un cargo --</option>
                {cargos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
              {errors.cargo && <span>Campo requerido</span>}
            </FormField>

            <Button type="submit" title={id ? "Actualizar" : "Crear"} />
          </form>
        </Card>
      </Container>
    </>
  );
};
