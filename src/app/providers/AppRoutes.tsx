import { Navigate, Route, Routes } from 'react-router-dom'
import type { ReactElement } from 'react'

import { AuthenticatedShellLayout } from '@/app/layouts/AuthenticatedShellLayout'
import { useAuth } from '@/features/login/model/auth-context'
import { ConfiguracionPage } from '@/pages/configuracion-page'
import { DashboardPage } from '@/pages/dashboard-page'
import { PacientesPage } from '@/pages/pacientes-page'
import { PacienteDetallePage } from '@/pages/paciente-detalle-page'
import { AgendasPage } from '@/pages/agendas-page'
import { ObstetriciaPage, ObstetriciaDetallePage } from '@/pages/obstetricia-page'
import { ConsultasPage, NuevaConsultaPage } from '@/pages/consultas-page'
import { RecetaMedicaPage } from '@/pages/receta-page'
import { RecetasListPage } from '@/pages/recetas-list-page'
import { OrdenesPage, NuevaOrdenPage } from '@/pages/ordenes-page'
import { LandingPage } from '@/pages/landing-page'
import { LoginPage } from '@/pages/login-page'
import { ConfirmacionCitaPage } from '@/pages/confirmacion-cita'
import { ROUTES } from '@/shared/config/routes'

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to={ROUTES.login} replace />
  }
  return children
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<LandingPage />} />
      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route path={ROUTES.confirmacion} element={<ConfirmacionCitaPage />} />
      
      <Route
        element={
          <ProtectedRoute>
            <AuthenticatedShellLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.dashboard} element={<DashboardPage />} />
        
        {/* Specific Route first */}
        <Route path="/consultas/nueva/:patientId" element={<NuevaConsultaPage />} />
        <Route path="/consultas/activa/:patientId" element={<NuevaConsultaPage />} />
        <Route path="/consultas" element={<ConsultasPage />} />
        
        <Route path="/recetas/nueva/:id" element={<RecetaMedicaPage />} />
        <Route path="/recetas" element={<RecetasListPage />} />
        
        <Route path="/ordenes/nueva/:patientId" element={<NuevaOrdenPage />} />
        <Route path="/ordenes/editar/:orderId" element={<NuevaOrdenPage />} />
        <Route path={ROUTES.ordenes} element={<OrdenesPage />} />
        
        <Route path={ROUTES.pacienteFicha} element={<PacienteDetallePage />} />
        <Route path={ROUTES.pacientes} element={<PacientesPage />} />
        <Route path={ROUTES.agenda} element={<AgendasPage />} />
        
        <Route path={ROUTES.controlObstetrico} element={<ObstetriciaPage />} />
        <Route path={ROUTES.controlObstetricoDetalle} element={<ObstetriciaDetallePage />} />
        
        <Route path={ROUTES.configuracion} element={<ConfiguracionPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
    </Routes>
  )
}
