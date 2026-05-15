import { Link } from 'react-router-dom'

import { useAuth } from '@/features/login/model/auth-context'
import { ROUTES } from '@/shared/config/routes'
import { Button } from '@/widgets/button'

export function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
      <header className="flex flex-col gap-4 border-b border-rose-dawn-200/80 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-teal-sage-800">Panel principal</p>
          <h1 className="font-display text-3xl font-semibold text-slate-care-900">
            Hola{user?.email ? `, ${user.email.split('@')[0]}` : ''}
          </h1>
          <p className="mt-2 max-w-2xl text-slate-care-600">
            Aquí aparecerá tu tablero clínico cuando conectes un backend. Por ahora solo confirmamos que
            iniciaste sesión correctamente.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={() => logout()} className="shrink-0">
          Cerrar sesión
        </Button>
      </header>

      <section className="mt-8 grid gap-6 md:grid-cols-2" aria-label="Resumen">
        <article className="rounded-3xl border border-rose-dawn-200/80 bg-white/90 p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-slate-care-900">Estado de acceso</h2>
          <p className="mt-2 text-sm text-slate-care-600">Sesión iniciada como</p>
          <p className="mt-1 break-all font-medium text-teal-sage-900">{user?.email}</p>
        </article>
        <article className="rounded-3xl border border-dashed border-teal-sage-300/70 bg-teal-sage-100/40 p-6">
          <h2 className="font-display text-lg font-semibold text-teal-sage-900">Siguiente paso</h2>
          <p className="mt-2 text-sm leading-relaxed text-teal-sage-900/90">
            Cuando integres API real, este bloque puede mostrar citas, resultados o recordatorios.
          </p>
          <p className="mt-4">
            <Link
              to={ROUTES.home}
              className="text-sm font-semibold text-teal-sage-800 underline-offset-4 hover:underline"
            >
              Volver a la landing
            </Link>
          </p>
        </article>
      </section>
    </div>
  )
}
