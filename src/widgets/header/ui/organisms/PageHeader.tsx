import { Link } from 'react-router-dom'

import { useSiteConfig } from '@/features/site-config/model/site-config-context'
import { ROUTES } from '@/shared/config/routes'
import { cn } from '@/shared/lib/cn'
import { LogoGlyphSvg } from '@/shared/ui/LogoGlyphSvg'

type PageHeaderProps = {
  className?: string
  logoHref?: string
  showAuthActions?: boolean
  loginTo?: string
  loginLabel?: string
}

function UserAccountIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM6 21v-1.6c0-2.24 3.08-4 6.5-4s6.5 1.76 6.5 4V21"
      />
    </svg>
  )
}

export function PageHeader({
  className,
  logoHref = ROUTES.home,
  showAuthActions = true,
  loginTo = ROUTES.login,
  loginLabel = 'Iniciar sesión',
}: PageHeaderProps) {
  const { config } = useSiteConfig()

  return (
    <header
      className={cn(
        'flex items-center justify-between gap-4 border-b border-rose-dawn-200/60 bg-white/70 px-4 py-4 backdrop-blur-md sm:px-8',
        className,
      )}
    >
      <Link
        to={logoHref}
        className="group/logo flex items-center gap-3 rounded-lg focus-visible:outline-none"
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-rose-dawn-200 to-teal-sage-200 text-teal-sage-900 shadow-sm"
          aria-hidden
        >
          {config.logoUrl ? (
            <img
              src={config.logoUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <LogoGlyphSvg className="h-6 w-6" />
          )}
        </span>
        <div className="leading-tight">
          <p className="font-display text-base font-semibold text-slate-care-900">{config.brandName}</p>
          <p className="text-xs text-slate-care-600">{config.brandTagline}</p>
        </div>
      </Link>

      {showAuthActions ? (
        <div className="relative inline-block text-left">
          {/* Grupo: el panel sigue visible al mover el cursor del botón al enlace */}
          <div className="group relative">
            <button
              type="button"
              className={cn(
                'inline-flex h-11 w-11 items-center justify-center rounded-full border border-teal-sage-200 bg-white text-teal-sage-900 shadow-sm transition',
                'hover:border-teal-sage-400 hover:bg-teal-sage-100/60',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-sage-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
              )}
              aria-haspopup="menu"
              aria-label="Acceso: al pasar el cursor o usar el teclado, elige iniciar sesión"
            >
              <UserAccountIcon className="h-5 w-5" />
            </button>

            {/* Cerrado: max-w-0 recorta el texto para que no asome a la izquierda del ícono */}
            <div
              className={cn(
                'pointer-events-none absolute right-0 top-full z-50 flex justify-end pt-2',
                'max-w-0 overflow-hidden opacity-0 transition-[max-width,opacity,transform] duration-300 ease-out',
                'translate-x-2',
                'group-hover:pointer-events-auto group-hover:max-w-[15rem] group-hover:translate-x-0 group-hover:opacity-100',
                'group-focus-within:pointer-events-auto group-focus-within:max-w-[15rem] group-focus-within:translate-x-0 group-focus-within:opacity-100',
              )}
            >
              <div
                className="min-w-[13.5rem] shrink-0 overflow-hidden rounded-2xl border border-teal-sage-200/80 bg-white shadow-soft ring-1 ring-rose-dawn-200/50"
                role="menu"
                aria-label="Opciones de acceso"
              >
                <Link
                  role="menuitem"
                  to={loginTo}
                  className={cn(
                    'block w-full px-4 py-3.5 text-sm font-semibold text-teal-sage-900 no-underline transition',
                    'hover:bg-teal-sage-100/80 focus-visible:bg-teal-sage-100/80 focus-visible:outline-none',
                  )}
                >
                  {loginLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
