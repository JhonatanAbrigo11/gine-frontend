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
        'sticky top-0 z-[100] flex items-center justify-between gap-4 border-b border-primary-100/30 bg-white/60 px-6 py-4 backdrop-blur-xl sm:px-10',
        className,
      )}
    >
      <Link
        to={logoHref}
        className="group/logo flex items-center gap-4 rounded-xl focus-visible:outline-none"
      >
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-200/50 transition-transform group-hover/logo:scale-110"
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
          <p className="font-display text-lg font-bold text-clinical-900 tracking-tight group-hover/logo:text-primary-700 transition-colors">
            {config.brandName}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-clinical-800/40">
            {config.brandTagline}
          </p>
        </div>
      </Link>

      {showAuthActions ? (
        <div className="relative inline-block text-left">
          <div className="group relative">
            <button
              type="button"
              className={cn(
                'inline-flex h-11 px-4 items-center justify-center gap-2 rounded-2xl border border-primary-100 bg-white text-primary-700 shadow-sm transition-all',
                'hover:border-primary-300 hover:bg-primary-50 hover:shadow-premium',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
              )}
              aria-haspopup="menu"
            >
              <UserAccountIcon className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">{loginLabel}</span>
            </button>

            <div
              className={cn(
                'pointer-events-none absolute right-0 top-full z-50 flex justify-end pt-3',
                'max-w-0 overflow-hidden opacity-0 transition-all duration-300 ease-out',
                'translate-y-2',
                'group-hover:pointer-events-auto group-hover:max-w-[20rem] group-hover:translate-y-0 group-hover:opacity-100',
              )}
            >
              <div
                className="min-w-[14rem] overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-premium ring-1 ring-primary-500/10"
                role="menu"
              >
                <Link
                  role="menuitem"
                  to={loginTo}
                  className={cn(
                    'flex items-center gap-3 w-full px-5 py-4 text-sm font-bold text-clinical-900 no-underline transition',
                    'hover:bg-primary-50 hover:text-primary-700 focus-visible:bg-primary-50 focus-visible:outline-none',
                  )}
                >
                  <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary-100 text-primary-700">
                    <UserAccountIcon className="h-4 w-4" />
                  </div>
                  Acceso Personal
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
