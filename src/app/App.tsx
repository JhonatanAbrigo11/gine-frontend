import { BrowserRouter } from 'react-router-dom'

import { SiteConfigProvider } from '@/features/site-config'
import { AuthProvider } from '@/features/login/model/auth-context'

import { AppRoutes } from './providers/AppRoutes'
import { ToastProvider } from '@/shared/ui/ToastContext'

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <SiteConfigProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </SiteConfigProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
