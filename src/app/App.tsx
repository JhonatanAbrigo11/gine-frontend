import { BrowserRouter } from 'react-router-dom'
import { Toaster } from "sonner"

import { BusinessSettingsProvider, SiteConfigProvider } from '@/features/site-config'
import { AuthProvider } from '@/features/login/model/auth-context'

import { AppRoutes } from './providers/AppRoutes'
import { ToastProvider } from '@/shared/ui/ToastContext'

export function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
      <ToastProvider>
        <BusinessSettingsProvider>
          <SiteConfigProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </SiteConfigProvider>
        </BusinessSettingsProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
