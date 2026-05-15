import { Link, Navigate } from 'react-router-dom'

import { useAuth } from '@/features/login/model/auth-context'
import { LoginForm } from '@/features/login/ui/organisms/LoginForm'
import { ROUTES } from '@/shared/config/routes'
import { composeButtonClassName } from '@/widgets/button'
import { PageHeader } from '@/widgets/header'

export function LoginPage() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-b from-rose-dawn-50 via-white to-teal-sage-100">
      <PageHeader loginTo={ROUTES.login} loginLabel="Acceso" showAuthActions={false} />

      <main
        id="contenido-principal"
        className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-12 sm:px-6"
      >
        <LoginForm />
        <p className="mt-6 text-center text-sm text-slate-care-600">
          <Link
            to={ROUTES.home}
            className={composeButtonClassName('ghost', 'px-3 py-2 text-sm no-underline')}
          >
            Volver al inicio
          </Link>
        </p>
      </main>
    </div>
  )
}
