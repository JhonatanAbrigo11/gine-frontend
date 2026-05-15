import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/features/login/model/auth-context'
import { EmailField } from '@/features/login/ui/molecules/EmailField'
import { ROUTES } from '@/shared/config/routes'
import { isProbablyEmail } from '@/shared/lib/validate-email'
import { Button } from '@/widgets/button'

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!isProbablyEmail(email)) {
      setError('Introduce un correo electrónico válido.')
      return
    }

    login(email.trim())
    navigate(ROUTES.dashboard, { replace: true })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-rose-dawn-200/80 bg-white/90 p-8 shadow-soft backdrop-blur-md"
      noValidate
    >
      <header className="space-y-2">
        <p className="font-display text-2xl font-semibold text-slate-care-900">Bienvenida de nuevo</p>
        <p className="text-sm text-slate-care-600">
          Usa cualquier correo para acceder al panel. Esta es una demo sin backend.
        </p>
      </header>

      <EmailField
        id="login-email"
        label="Correo electrónico"
        value={email}
        onChange={setEmail}
        error={error ?? undefined}
      />

      <Button type="submit" className="w-full" variant="primary">
        Iniciar sesión
      </Button>
    </form>
  )
}
