import { Routes, Route } from "react-router";
import { URLS } from "./CONTANTS";
import { ProtectedRoute } from "../components/ProtectedRoute";

// Páginas
import { LoginForm } from "../pages/LoginForm";
import { RegisterForm } from "../pages/RegisterForm";
import { HomePage } from "../pages/HomePage";
import { RecintoList } from "../pages/AdministracionElectoral/RecintoList";
import { RecintoForm } from "../pages/AdministracionElectoral/RecintoForm";
import { MesaForm } from "../pages/AdministracionElectoral/MesaForm";
import { SeccionesList } from "../pages/AdministracionElectoral/SeccionesList";
import { SeccionForm } from "../pages/AdministracionElectoral/SeccionesForm";

export const RouterConfig = () => {
  return (
    <Routes>
      <Route path={URLS.LOGIN} element={<LoginForm />} />

      <Route
        path={URLS.HOME}
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path={URLS.USUARIOS.CREATE}
        element={
          <ProtectedRoute>
            <RegisterForm />
          </ProtectedRoute>
        }
      />
      <Route
        path={URLS.USUARIOS.EDIT}
        element={
          <ProtectedRoute>
            <RegisterForm />
          </ProtectedRoute>
        }
      />

      <Route
        path={URLS.RECINTOS.LIST}
        element={
          <ProtectedRoute>
            <RecintoList />
          </ProtectedRoute>
        }
      />
      <Route
        path={URLS.RECINTOS.CREATE}
        element={
          <ProtectedRoute>
            <RecintoForm />
          </ProtectedRoute>
        }
      />
      <Route
        path={URLS.RECINTOS.EDIT}
        element={
          <ProtectedRoute>
            <RecintoForm />
          </ProtectedRoute>
        }
      />

      <Route
        path={URLS.MESAS.CREATE_PARAM}
        element={
          <ProtectedRoute>
            <MesaForm />
          </ProtectedRoute>
        }
      />
      <Route
        path={URLS.MESAS.EDIT}
        element={
          <ProtectedRoute>
            <MesaForm />
          </ProtectedRoute>
        }
      />
      <Route
        path={URLS.SECCIONES.LIST}
        element={
          <ProtectedRoute>
            <SeccionesList />
          </ProtectedRoute>
        }
      />
      <Route
        path={URLS.SECCIONES.CREATE}
        element={
          <ProtectedRoute>
            <SeccionForm />
          </ProtectedRoute>
        }
      />
      <Route
        path={URLS.SECCIONES.EDIT}
        element={
          <ProtectedRoute>
            <SeccionForm />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default RouterConfig;