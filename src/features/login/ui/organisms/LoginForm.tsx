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
      className="space-y-8 glass-card rounded-[2.5rem] p-10 border-white/20 shadow-2xl"
      noValidate
    >
      <header className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
           <div className="h-1 w-12 bg-accent-400 rounded-full" />
           <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-400">Acceso Seguro</span>
        </div>
        <h2 className="font-display text-4xl font-bold text-clinical-900 tracking-tight">
          Bienvenida <span className="text-primary-700">de nuevo</span>
        </h2>
        <p className="text-sm font-medium text-clinical-800/50 leading-relaxed">
          Acceda a su panel de gestión clínica personalizada.
        </p>
      </header>

      <div className="space-y-2">
        <EmailField
          id="login-email"
          label="Correo Institucional"
          value={email}
          onChange={setEmail}
          error={error ?? undefined}
        />
        <p className="text-[10px] text-clinical-800/40 italic px-1">
          * Demo: ingrese cualquier correo electrónico para continuar.
        </p>
      </div>

      <Button type="submit" className="w-full h-14 text-base shadow-xl shadow-primary-200" variant="primary">
        Entrar al Sistema
      </Button>
    </form>
  )
}
