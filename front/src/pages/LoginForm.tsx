import { useForm, type SubmitHandler } from "react-hook-form";
import { Input } from "../components/Input";
import { FormField } from "../components/FormField";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useNavigate } from "react-router";
import { URLS } from "../navigation/CONTANTS";
import { AuthService } from "../services/AuthService";
import { Container } from "../components/Container";
import type { LoginRequest } from "../models/dto/LoginRequest";
import { Menu } from "../components/Menu";

type Inputs = {
  username: string;
  password: string;
};

export const LoginForm = () => {
  const navigate = useNavigate();
  const authService = new AuthService();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const login: LoginRequest = {
        username: data.username,
        password: data.password,
      };

      const response = await authService.login(login.username, login.password);
      localStorage.setItem("access_token", response.access);
      localStorage.setItem("refresh_token", response.refresh);

      const user = await authService.getCurrentUser();
      localStorage.setItem("user", JSON.stringify(user));

      switch (user.role) {
        case "SuperAdmin":
          navigate(URLS.HOME); 
          break;
        case "AdminElectoral":
          navigate(URLS.RECINTOS.LIST);
          break;
        case "Jurado":
          navigate("/jurado/dashboard");
          break;
        case "AdminPadron":
          navigate("/admin-padron/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error("Error en login o al obtener usuario:", error);
      alert("Credenciales incorrectas o error de conexión.");
    }
  };

  return (
    <>
      <Menu />
      <Container>
        <Card title="Iniciar sesión" className="mx-5 my-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField>
              <label htmlFor="username">Usuario:</label>
              <Input
                type="text"
                id="username"
                {...register("username", { required: true })}
              />
              {errors.username && <span>Este campo es requerido</span>}
            </FormField>
            <FormField>
              <label htmlFor="password">Contraseña:</label>
              <Input
                type="password"
                id="password"
                {...register("password", { required: true })}
              />
              {errors.password && <span>Este campo es requerido</span>}
            </FormField>
            <Button type="submit" title="Ingresar" />
          </form>
        </Card>
      </Container>
    </>
  );
};
