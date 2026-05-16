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
    <div className="relative min-h-dvh flex flex-col overflow-hidden bg-clinical-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/gynecology_login_bg_1778891592661.png" 
          alt="Clinic Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-clinical-900/60" />
      </div>

      <PageHeader 
        loginTo={ROUTES.login} 
        loginLabel="Acceso" 
        showAuthActions={false} 
        className="relative z-10 border-transparent bg-transparent backdrop-blur-none shadow-none"
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
          
          <div className="mt-8 text-center">
            <Link
              to={ROUTES.home}
              className={cn(
                composeButtonClassName('ghost', 'px-6 py-3 text-sm no-underline text-white/60 hover:text-white hover:bg-white/10'),
                "rounded-2xl border border-white/10 backdrop-blur-sm"
              )}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Link>
          </div>
        </motion.div>
      </main>
      
      <div className="relative z-10 p-8 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
          Sistema de Gestión Clínica de Alta Especialidad
        </p>
      </div>
    </div>
  )
}
