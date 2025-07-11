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
import { EleccionForm } from "../pages/AdministracionElectoral/EleccionForm";
import { EleccionList } from "../pages/AdministracionElectoral/EleccionList";
import { CargoForm } from "../pages/AdministracionElectoral/CargoForm";
import { CargoList } from "../pages/AdministracionElectoral/CargoList";
import { CandidaturaList } from "../pages/AdministracionElectoral/CandidaturaList";
import { CandidaturaForm } from "../pages/AdministracionElectoral/CandidaturaForm";
import { VotanteForm } from "../pages/PadronElectoral/VotanteForm";
import { VotanteList } from "../pages/PadronElectoral/VotanteList";

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
      <Route
        path={URLS.ELECCIONES.LIST}
        element={
          <ProtectedRoute>
            <EleccionList />
          </ProtectedRoute>
        }
      />
      <Route
        path={URLS.ELECCIONES.CREATE}
        element={
          <ProtectedRoute>
            <EleccionForm />
          </ProtectedRoute>
        }
      />
      <Route
        path={URLS.ELECCIONES.EDIT}
        element={
          <ProtectedRoute>
            <EleccionForm />
          </ProtectedRoute>
        }
      />

      <Route
        path={URLS.CARGOS.LIST}
        element={
          <ProtectedRoute>
            <CargoList />
          </ProtectedRoute>
        }
      />
      <Route
        path={URLS.CARGOS.CREATE}
        element={
          <ProtectedRoute>
            <CargoForm />
          </ProtectedRoute>
        }
      />
      <Route
        path={URLS.CARGOS.EDIT}
        element={
          <ProtectedRoute>
            <CargoForm />
          </ProtectedRoute>
        }
      />
    <Route
      path={URLS.CANDIDATURAS.LIST}
      element={
        <ProtectedRoute>
          <CandidaturaList />
        </ProtectedRoute>
      }
    />
    <Route
      path={URLS.CANDIDATURAS.CREATE}
      element={
        <ProtectedRoute>
          <CandidaturaForm />
        </ProtectedRoute>
      }
    />
    <Route
      path={URLS.CANDIDATURAS.EDIT}
      element={
        <ProtectedRoute>
          <CandidaturaForm />
        </ProtectedRoute>
      }
    />
    <Route
        path={URLS.VOTANTES.LIST}
        element={
          <ProtectedRoute>
            <VotanteList />
          </ProtectedRoute>
        }
      />
      <Route
        path={URLS.VOTANTES.CREATE}
        element={
          <ProtectedRoute>
            <VotanteForm />
          </ProtectedRoute>
        }
      />
      <Route
        path={URLS.VOTANTES.EDIT}
        element={
          <ProtectedRoute>
            <VotanteForm />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default RouterConfig;