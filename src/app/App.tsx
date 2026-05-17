import { BrowserRouter } from 'react-router-dom'
import { Toaster } from "sonner"

import { BusinessSettingsProvider, SiteConfigProvider } from '@/features/site-config'
import { AuthProvider } from '@/features/login/model/auth-context'

import { AppRoutes } from './providers/AppRoutes'
import { ToastProvider } from '@/shared/ui/ToastContext'
import { QueryProvider } from './providers/QueryProvider'

export function App() {
  return (
    <QueryProvider>
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
    </QueryProvider>
  )
}
