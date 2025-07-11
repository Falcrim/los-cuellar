import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Input } from "../components/Input";
import { FormField } from "../components/FormField";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { Menu } from "../components/Menu";
import { UsuarioService } from "../services/UsuarioService";
import { URLS } from "../navigation/CONTANTS";

type Inputs = {
  username: string;
  password: string;
  role: "SuperAdmin" | "AdminElectoral" | "Jurado" | "AdminPadron";
};

const roles = [
  "SuperAdmin",
  "AdminElectoral",
  "Jurado",
  "AdminPadron",
] as const;

const usuarioService = new UsuarioService();

export const RegisterForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      usuarioService
        .getUsuarioById(Number(id))
        .then((usuario) => {
          setValue("username", usuario.username);
          setValue("role", usuario.role as Inputs["role"]);
        })
        .catch((err) => {
          console.error("Error al cargar usuario:", err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, setValue]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setLoading(true);

    const userData = {
      username: data.username,
      role: data.role,
      ...(data.password && { password: data.password }), // solo incluir si hay contraseña
    };

    const action = isEdit
      ? usuarioService.updateUsuario(Number(id), userData)
      : usuarioService.createUsuario({ ...userData, password: data.password });

    action
      .then(() => {
        navigate(URLS.HOME);
      })
      .catch((error) => {
        console.error("Error al guardar usuario:", error.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Menu />
      <Container>
        <Card title={isEdit ? "Editar Usuario" : "Registrar Usuario"} className="mx-5 my-5">
          <form onSubmit={handleSubmit(onSubmit)}>

            <FormField>
              <label htmlFor="username">Usuario:</label>
              <Input
                type="text"
                id="username"
                {...register("username", { required: "El usuario es requerido" })}
              />
              {errors.username && <span>{errors.username.message}</span>}
            </FormField>

            <FormField>
              <label htmlFor="password">Contraseña:</label>
              <Input
                type="password"
                id="password"
                placeholder={isEdit ? "Dejar vacío para no cambiar" : ""}
                {...register("password", isEdit ? {} : { required: "La contraseña es requerida" })}
              />
              {errors.password && <span>{errors.password.message}</span>}
            </FormField>

            <FormField>
              <label htmlFor="role">Rol:</label>
              <select
                id="role"
                {...register("role", { required: "El rol es requerido" })}
                className="border rounded px-2 py-1"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecciona un rol
                </option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {errors.role && <span>{errors.role.message}</span>}
            </FormField>

            <Button type="submit" title={loading ? "Guardando..." : isEdit ? "Actualizar" : "Registrar"} />
          </form>
        </Card>
      </Container>
    </>
  );
};
