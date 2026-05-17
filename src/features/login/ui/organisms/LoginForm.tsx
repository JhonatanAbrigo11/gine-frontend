import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

import { useAuth } from '@/features/login/model/auth-context'
import { ROUTES } from '@/shared/config/routes'
import { isProbablyEmail } from '@/shared/lib/validate-email'
import { Button } from '@/widgets/button'

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('dummypwd123') // Prefilled default mock password
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!isProbablyEmail(email)) {
      setError('Introduce un correo electrónico institucional válido.')
      return
    }

    login(email.trim())
    navigate(ROUTES.dashboard, { replace: true })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white/70 backdrop-blur-lg rounded-[2.5rem] p-10 border border-clinical-100/50 shadow-premium"
      noValidate
    >
      <header className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 border border-primary-100">
           <span className="h-1.5 w-1.5 rounded-full bg-primary-600 animate-pulse" />
           <span className="text-[9px] font-black uppercase tracking-widest text-primary-600">Acceso Seguro</span>
        </div>
        <h2 className="font-display text-3xl font-black text-clinical-900 tracking-tight">
          Bienvenida <span className="text-primary-600">de nuevo</span>
        </h2>
        <p className="text-xs font-semibold text-clinical-500 leading-relaxed">
          Acceda a su panel de gestión clínica personalizada.
        </p>
      </header>

      <div className="space-y-5">
        {/* CORREO INSTITUCIONAL */}
        <div className="space-y-2">
          <label htmlFor="login-email" className="block text-[10px] font-black uppercase tracking-widest text-clinical-450 px-1">
            Correo Institucional
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-clinical-300">
              <Mail className="h-4.5 w-4.5" />
            </div>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@gineclinic.com"
              className="w-full h-13 rounded-2xl border border-clinical-150 bg-white/50 pl-11 pr-5 text-sm font-bold text-clinical-900 shadow-sm outline-none transition placeholder:text-clinical-300 focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
              required
            />
          </div>
          {error && (
            <p className="text-[10px] font-bold text-rose-500 px-1 mt-1" role="alert">
              {error}
            </p>
          )}
        </div>

        {/* CONTRASEÑA */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label htmlFor="login-password" className="block text-[10px] font-black uppercase tracking-widest text-clinical-450">
              Contraseña
            </label>
            <button
              type="button"
              className="text-[9px] font-black uppercase tracking-wider text-primary-600 hover:text-primary-700 transition"
              onClick={() => alert("Entorno demo: Ingrese cualquier correo electrónico para acceder sin contraseña.")}
            >
              ¿Olvidó su contraseña?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-clinical-300">
              <Lock className="h-4.5 w-4.5" />
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-13 rounded-2xl border border-clinical-150 bg-white/50 pl-11 pr-11 text-sm font-bold text-clinical-900 shadow-sm outline-none transition placeholder:text-clinical-300 focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-clinical-350 hover:text-clinical-900 transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        <p className="text-[10px] text-clinical-400/80 font-bold italic px-1">
          * Demo: ingrese cualquier correo electrónico para continuar.
        </p>
      </div>

      <Button type="submit" className="w-full h-13 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary-200 mt-2" variant="primary">
        Entrar al Sistema
      </Button>
    </form>
  )
}
