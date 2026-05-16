import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { useAuth } from '@/features/login/model/auth-context'
import { LoginForm } from '@/features/login/ui/organisms/LoginForm'
import { ROUTES } from '@/shared/config/routes'
import { composeButtonClassName } from '@/widgets/button'
import { PageHeader } from '@/widgets/header'
import { cn } from '@/shared/lib/cn'
import { ArrowLeft } from 'lucide-react'

export function LoginPage() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-clinical-900">
      <div className="absolute inset-0 z-0">
        <img
          src="/gynecology_login_bg_1778891592661.png"
          alt="Clinic Background"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-clinical-900/60" />
      </div>

      <PageHeader
        loginTo={ROUTES.login}
        loginLabel="Acceso"
        showAuthActions={false}
        className="relative z-10 border-transparent bg-transparent shadow-none backdrop-blur-none"
      />

      <main
        id="contenido-principal"
        className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-12"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <LoginForm />
        </motion.div>
      </main>

      {/* Fuera del formulario y de motion: navegación SPA fiable hacia la landing */}
      <nav
        className="relative z-[100] -mt-2 flex justify-center px-6 pb-8"
        aria-label="Volver a la página principal"
      >
        <Link
          to={ROUTES.home}
          className={cn(
            composeButtonClassName(
              'ghost',
              'inline-flex px-6 py-3 text-sm font-semibold text-white/80 no-underline hover:text-white hover:bg-white/10',
            ),
            'rounded-2xl border border-white/10 bg-transparent backdrop-blur-sm',
          )}
        >
          <ArrowLeft className="mr-2 h-4 w-4 shrink-0" aria-hidden />
          Volver al inicio
        </Link>
      </nav>

      <div className="relative z-10 p-8 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
          Sistema de Gestión Clínica de Alta Especialidad
        </p>
      </div>
    </div>
  )
}
