import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight,
  CalendarDays,
  Stethoscope,
  Baby,
  Pill,
  ClipboardList,
  FileText,
  Activity,
  BarChart3
} from 'lucide-react'

import { useAuth } from '@/features/login/model/auth-context'
import { useSiteConfig } from '@/features/site-config'
import { ROUTES } from '@/shared/config/routes'
import { cn } from '@/shared/lib/cn'
import { LogoGlyphSvg } from '@/shared/ui/LogoGlyphSvg'

const EXPANDED_W = 'min(16rem, 84vw)'
export const SIDEBAR_COLLAPSED_WIDTH = '5rem'

type AppSidebarProps = {
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function AppSidebar({ 
  expanded: expandedProp, 
  onExpandedChange,
  mobileOpen,
  onMobileClose
}: AppSidebarProps = {}) {
  const { user, logout } = useAuth()
  const { config } = useSiteConfig()
  const [isHovered, setIsHovered] = useState(false)

  const isControlled = expandedProp !== undefined
  const expanded = isControlled ? expandedProp : isHovered

  const handleMouseEnter = () => {
    if (!isControlled) setIsHovered(true)
    onExpandedChange?.(true)
  }

  const handleMouseLeave = () => {
    if (!isControlled) setIsHovered(false)
    onExpandedChange?.(false)
  }

  // ... (navItems array stays same)
  const navItems = [
    {
      label: 'Dashboard',
      to: ROUTES.dashboard,
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: 'Pacientes',
      to: ROUTES.pacientes,
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: 'Agenda / Citas',
      to: ROUTES.agenda,
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      label: 'Consultas',
      to: ROUTES.consultas,
      icon: <Stethoscope className="h-5 w-5" />,
    },
    {
      label: 'Control Obstétrico',
      to: ROUTES.controlObstetrico,
      icon: <Baby className="h-5 w-5" />,
    },
    {
      label: 'Recetas',
      to: ROUTES.recetas,
      icon: <Pill className="h-5 w-5" />,
    },
    {
      label: 'Órdenes / Exámenes',
      to: ROUTES.ordenes,
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      label: 'Configuración',
      to: ROUTES.configuracion,
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-clinical-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onMobileClose}
      />

      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ 
          width: expanded ? EXPANDED_W : SIDEBAR_COLLAPSED_WIDTH 
        } as any}
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 flex h-dvh flex-col border-r border-clinical-200 bg-clinical-50 transition-all duration-300 ease-in-out',
          // Desktop behavior
          'hidden lg:flex',
          // Mobile behavior
          mobileOpen ? 'flex translate-x-0 w-[min(16rem,84vw)] px-4' : '-translate-x-full lg:translate-x-0 px-3',
          expanded ? 'px-4' : 'px-3',
        )}
        aria-label="Navegación principal"
      >
        {/* Header / Logo */}
        <div className="flex h-20 items-center overflow-hidden py-4">
          <div className="flex shrink-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-200">
              {config.logoUrl ? (
                <img src={config.logoUrl} alt="" className="h-full w-full object-cover rounded-2xl" />
              ) : (
                <LogoGlyphSvg className="h-7 w-7" />
              )}
            </div>
            <div
              className={cn(
                'min-w-0 transition-opacity duration-300',
                (expanded || mobileOpen) ? 'opacity-100' : 'pointer-events-none opacity-0',
              )}
            >
              <p className="whitespace-nowrap font-display text-lg font-bold text-clinical-900 tracking-tight">
                {config.brandName || 'GineCare'}
              </p>
              <p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-clinical-800/40">
                {config.brandTagline || 'V 1.0'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex flex-1 flex-col gap-1.5 overflow-y-auto overflow-x-hidden py-2 no-scrollbar">
          <div className={cn("px-4 mb-2 transition-opacity duration-200", (expanded || mobileOpen) ? "opacity-100" : "opacity-0 h-0 overflow-hidden")}>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-clinical-800/30">Menú de Gestión</span>
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onMobileClose}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-4 rounded-2xl p-3.5 text-sm font-bold transition-all duration-200',
                  isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                    : 'text-clinical-800/60 hover:bg-white hover:text-primary-700 hover:shadow-sm',
                )
              }
            >
              <span className="shrink-0">{item.icon}</span>
              <div className="flex flex-1 items-center justify-between overflow-hidden">
                <span
                  className={cn(
                    'whitespace-nowrap transition-all duration-300',
                    (expanded || mobileOpen) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none w-0',
                  )}
                >
                  {item.label}
                </span>
                {(expanded || mobileOpen) && (
                  <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                )}
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Footer / User */}
        <div className="mt-auto border-t border-clinical-100 py-6">
          <div className="flex items-center gap-3 overflow-hidden rounded-2xl p-2 transition-colors hover:bg-clinical-50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700 font-bold border border-white">
              {user?.email?.[0].toUpperCase() || 'U'}
            </div>
            <div
              className={cn(
                'min-w-0 flex-1 transition-all duration-300',
                (expanded || mobileOpen) ? 'opacity-100' : 'opacity-0 pointer-events-none w-0',
              )}
            >
              <p className="truncate text-sm font-bold text-clinical-900 leading-none mb-1">
                {user?.email?.split('@')[0] || 'Usuario'}
              </p>
              <p className="truncate text-[11px] font-medium text-clinical-800/40">{user?.email || 'email@example.com'}</p>
            </div>
            {(expanded || mobileOpen) && (
              <button
                onClick={() => logout()}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-clinical-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

