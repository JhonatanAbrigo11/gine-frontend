import { BrowserRouter } from 'react-router-dom'

import { SiteConfigProvider } from '@/features/site-config'
import { AuthProvider } from '@/features/login/model/auth-context'

import { AppRoutes } from './providers/AppRoutes'

export function App() {
  return (
    <BrowserRouter>
      <SiteConfigProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </SiteConfigProvider>
    </BrowserRouter>
  )
}
