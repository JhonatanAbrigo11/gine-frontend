import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { useAuth } from '@/features/login/model/auth-context'
import { useSiteConfig } from '@/features/site-config'
import { SidebarFigureRow } from '@/features/sidebar/ui/molecules/SidebarFigureRow'
import { ROUTES } from '@/shared/config/routes'
import { cn } from '@/shared/lib/cn'
import { LogoGlyphSvg } from '@/shared/ui/LogoGlyphSvg'

const EXPANDED_W = 'min(18rem, 84vw)'
export const SIDEBAR_COLLAPSED_WIDTH = '4rem'

type AppSidebarProps = {
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
}

export function AppSidebar({ expanded: expandedProp, onExpandedChange }: AppSidebarProps = {}) {
  const { user } = useAuth()
  const { config } = useSiteConfig()
  const [internalExpanded, setInternalExpanded] = useState(false)

  const isControlled = expandedProp !== undefined
  const expanded = isControlled ? expandedProp : internalExpanded

  const setExpanded = (next: boolean) => {
    if (!isControlled) {
      setInternalExpanded(next)
    }
    onExpandedChange?.(next)
  }

  const toggle = () => setExpanded(!expanded)

  return (
    <aside
      style={expanded ? { width: EXPANDED_W } : { width: SIDEBAR_COLLAPSED_WIDTH }}
      className={cn(
        'fixed left-0 top-0 z-40 flex h-dvh flex-col border-r border-rose-dawn-200/70 bg-gradient-to-b from-rose-dawn-100 via-white to-teal-sage-100 shadow-soft transition-[width] duration-300 ease-out',
        expanded ? 'overflow-hidden px-5 py-8' : 'overflow-hidden px-1.5 py-6',
      )}
      aria-label="Navegación principal"
    >
      {expanded ? (
        <>
          <button
            type="button"
            onClick={toggle}
            className="flex w-full shrink-0 items-center gap-3 rounded-xl p-1 text-left transition hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-sage-400"
            aria-expanded={true}
            aria-controls="sidebar-panel"
            title="Ocultar panel y mostrar solo el título"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white text-teal-sage-800 shadow-md ring-1 ring-rose-dawn-200/80">
              {config.logoUrl ? (
                <img src={config.logoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <LogoGlyphSvg className="h-6 w-6" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg font-semibold text-slate-care-900">{config.brandName}</p>
              <p className="text-xs text-slate-care-600">{config.brandTagline}</p>
            </div>
            <span className="sr-only">Contraer barra lateral</span>
            <svg
              className="h-5 w-5 shrink-0 text-teal-sage-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden
            >
              <path strokeWidth="2" strokeLinecap="round" d="M15 6l-6 6 6 6" />
            </svg>
          </button>

          <div id="sidebar-panel" className="flex min-h-0 flex-1 flex-col">
            <div className="mt-6 shrink-0 rounded-2xl bg-white/80 p-4 ring-1 ring-teal-sage-200/60">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-sage-800">
                Sesión activa
              </p>
              <p className="mt-2 truncate text-sm font-medium text-slate-care-900">
                {user?.email ?? 'Invitada'}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-care-600">
                Personaliza marca, textos e imágenes de la landing en Configuración.
              </p>
            </div>

            <nav className="mt-4 shrink-0" aria-label="Secciones de la aplicación">
              <NavLink
                to={ROUTES.configuracion}
                className={({ isActive }) =>
                  cn(
                    'block rounded-xl px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-sage-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
                    isActive
                      ? 'bg-teal-sage-200/90 text-teal-sage-950 shadow-sm'
                      : 'text-teal-sage-900 hover:bg-white/70',
                  )
                }
              >
                Configuración
              </NavLink>
            </nav>

            <div className="mt-auto shrink-0 pt-4">
              <SidebarFigureRow />
            </div>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={toggle}
          className="flex h-full min-h-0 w-full flex-col items-center gap-3 rounded-xl py-4 text-center transition hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-sage-400"
          aria-expanded={false}
          aria-controls="sidebar-panel"
          title="Abrir panel lateral"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white text-teal-sage-800 shadow ring-1 ring-rose-dawn-200/80">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <LogoGlyphSvg className="h-5 w-5" />
            )}
          </span>
          <span className="font-display max-h-[60vh] text-xs font-semibold leading-snug tracking-wide text-slate-care-900 [overflow-wrap:anywhere] [writing-mode:vertical-rl] rotate-180">
            {config.brandName}
          </span>
          <span className="sr-only">Expandir barra lateral</span>
        </button>
      )}
    </aside>
  )
}
