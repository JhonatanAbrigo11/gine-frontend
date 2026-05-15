import { Navigate, Route, Routes } from 'react-router-dom'
import type { ReactElement } from 'react'

import { AuthenticatedShellLayout } from '@/app/layouts/AuthenticatedShellLayout'
import { useAuth } from '@/features/login/model/auth-context'
import { ConfiguracionPage } from '@/pages/configuracion-page'
import { DashboardPage } from '@/pages/dashboard-page'
import { LandingPage } from '@/pages/landing-page'
import { LoginPage } from '@/pages/login-page'
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
      <Route
        element={
          <ProtectedRoute>
            <AuthenticatedShellLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.dashboard} element={<DashboardPage />} />
        <Route path={ROUTES.configuracion} element={<ConfiguracionPage />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
    </Routes>
  )
}
