import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001/api';
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
  BarChart3,
  Receipt
} from 'lucide-react'

import { useAuth } from '@/features/login/model/auth-context'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Save, Trash2 } from 'lucide-react'
import { useConsultationStore } from '@/modules/consultations/store/useConsultationStore'
import { useBusinessSettings } from '@/features/site-config'
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
  const { settings } = useBusinessSettings()
  const [isHovered, setIsHovered] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const [showSidebarExitModal, setShowSidebarExitModal] = useState(false)
  const [pendingPath, setPendingPath] = useState(null)

  const [pendingAppointmentsCount, setPendingAppointmentsCount] = useState(0)
  const [pendingExamsCount, setPendingExamsCount] = useState(0)

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const todayStr = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD local format
        
        // Fetch appointments and medical orders concurrently in parallel
        const [appRes, orderRes] = await Promise.all([
          axios.get(`${API_URL}/appointments`),
          axios.get(`${API_URL}/medical-orders`)
        ])

        const todayPendingApps = appRes.data.filter((app: any) => {
          return app.date === todayStr && app.status === 'Agendada'
        })
        setPendingAppointmentsCount(todayPendingApps.length)

        const pendingExams = orderRes.data.filter((order: any) => {
          return !order.results || order.results.length === 0
        })
        setPendingExamsCount(pendingExams.length)
      } catch (err) {
        console.error('Error fetching sidebar alert counts:', err)
      }
    }

    fetchCounts()
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchCounts, 10000)
    
    return () => clearInterval(interval)
  }, [location.pathname])

  const { consultation, originalConsultation, saveHandler } = useConsultationStore()
  const isDirty = !!(consultation && originalConsultation && JSON.stringify(consultation) !== originalConsultation)

  const handleSaveAndExit = async () => {
    if (!pendingPath) return
    if (saveHandler) {
      const success = await saveHandler(pendingPath)
      if (success) {
        setShowSidebarExitModal(false)
        setPendingPath(null)
      }
    } else {
      useConsultationStore.getState().reset()
      navigate(pendingPath)
      setShowSidebarExitModal(false)
      setPendingPath(null)
    }
  }

  const handleDiscardAndExit = () => {
    setShowSidebarExitModal(false)
    useConsultationStore.getState().reset()
    if (pendingPath) {
      navigate(pendingPath)
      setPendingPath(null)
    }
  }

  const handleCancelExit = () => {
    setShowSidebarExitModal(false)
    setPendingPath(null)
  }

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
    {
      label: 'Recetas',
      to: ROUTES.configuracionRecetas,
      icon: <ClipboardList className="h-4 w-4" />,
      isSubItem: true,
    },
    {
      label: 'Medicamentos',
      to: ROUTES.configuracionMedicamentos,
      icon: <Pill className="h-4 w-4" />,
      isSubItem: true,
    },
    {
      label: 'Usuarios',
      to: ROUTES.configuracionUsuarios,
      icon: <Users className="h-4 w-4" />,
      isSubItem: true,
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
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt="" className="h-full w-full object-cover rounded-2xl" />
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
                {settings?.clinicName || 'GineCare'}
              </p>
              <p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-clinical-800/40">
                {settings?.recipeDoctorSpecialty || 'Ginecología'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex flex-1 flex-col gap-1.5 overflow-y-auto overflow-x-hidden py-2 no-scrollbar">
          <div className={cn("px-4 mb-2 transition-opacity duration-200", (expanded || mobileOpen) ? "opacity-100" : "opacity-0 h-0 overflow-hidden")}>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-clinical-800/30">Menú de Gestión</span>
          </div>
          {navItems.map((item) => {
            // Hide sub-items if collapsed
            if (item.isSubItem && !expanded && !mobileOpen) return null

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={(e) => {
                  onMobileClose?.()
                  if (isDirty) {
                    e.preventDefault()
                    setPendingPath(item.to)
                    setShowSidebarExitModal(true)
                  }
                }}
                className={({ isActive }) => {
                  const isItemActive = isActive || (item.to === '/control-obstetrico' && location.pathname.startsWith('/control-obstetrico'))
                  return cn(
                    'group flex items-center gap-4 transition-all duration-200',
                    item.isSubItem
                      ? cn(
                          'ml-8 p-2 rounded-xl text-xs font-bold',
                          isItemActive
                            ? 'bg-primary-50 text-primary-700 border border-primary-100/50 shadow-sm'
                            : 'text-clinical-800/50 hover:bg-white hover:text-primary-600 hover:shadow-xs'
                        )
                      : cn(
                          'rounded-2xl p-3.5 text-sm font-bold',
                          isItemActive
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                            : 'text-clinical-800/60 hover:bg-white hover:text-primary-700 hover:shadow-sm'
                        )
                  )
                }}
              >
                <span className="shrink-0 relative">
                  {item.icon}
                  {!expanded && !mobileOpen && (
                    (item.label === 'Agenda / Citas' && pendingAppointmentsCount > 0) ||
                    (item.label === 'Órdenes / Exámenes' && pendingExamsCount > 0)
                  ) && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-450 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                  )}
                </span>
                <div className="flex flex-1 items-center justify-between overflow-hidden">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={cn(
                        'whitespace-nowrap transition-all duration-300',
                        (expanded || mobileOpen) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none w-0',
                      )}
                    >
                      {item.label}
                    </span>
                    {(expanded || mobileOpen) && item.label === 'Agenda / Citas' && pendingAppointmentsCount > 0 && (
                      <span className="shrink-0 flex items-center justify-center h-4.5 px-1.5 rounded-full text-[9px] font-black bg-rose-500 text-white shadow-sm ring-1 ring-white/10 animate-pulse">
                        {pendingAppointmentsCount}
                      </span>
                    )}
                    {(expanded || mobileOpen) && item.label === 'Órdenes / Exámenes' && pendingExamsCount > 0 && (
                      <span className="shrink-0 flex items-center justify-center h-4.5 px-1.5 rounded-full text-[9px] font-black bg-amber-500 text-white shadow-sm ring-1 ring-white/10 animate-pulse">
                        {pendingExamsCount}
                      </span>
                    )}
                  </div>
                  {(expanded || mobileOpen) && !item.isSubItem && (
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  )}
                </div>
              </NavLink>
            )
          })}
        </nav>

        {/* Footer / User */}
        <div className="mt-auto border-t border-clinical-100 py-6">
          <div className="flex items-center gap-3 overflow-hidden rounded-2xl p-2 transition-colors hover:bg-clinical-50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700 font-bold border border-white">
              {(user?.nombres?.[0] || user?.username?.[0] || 'U').toUpperCase()}
            </div>
            <div
              className={cn(
                'min-w-0 flex-1 transition-all duration-300',
                (expanded || mobileOpen) ? 'opacity-100' : 'opacity-0 pointer-events-none w-0',
              )}
            >
              <p className="truncate text-sm font-bold text-clinical-900 leading-none mb-1">
                {user?.nombres ? `${user.nombres} ${user.apellidos || ''}`.trim() : `@${user?.username || 'Usuario'}`}
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

      {/* Global Exit Confirmation Modal inside Sidebar */}
      <AnimatePresence>
         {showSidebarExitModal && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCancelExit} className="absolute inset-0 bg-clinical-900/60 backdrop-blur-md" />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center border border-clinical-100"
              >
                 <div className="h-16 w-16 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <AlertCircle className="h-8 w-8" />
                 </div>
                 <h3 className="text-xl font-black text-clinical-900 mb-2">¿Cambios sin Guardar?</h3>
                 <p className="text-sm font-medium text-clinical-500 mb-8">Hay modificaciones en la consulta clínica que no se han guardado aún. ¿Qué desea hacer antes de salir?</p>
                 
                 <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleSaveAndExit} 
                      className="h-13 w-full rounded-2xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2"
                    >
                       <Save className="h-4 w-4" />
                       Guardar Cambios y Salir
                    </button>
                    
                    <button 
                      onClick={handleDiscardAndExit} 
                      className="h-13 w-full rounded-2xl border border-rose-200 text-rose-600 hover:bg-rose-50/50 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                       <Trash2 className="h-4 w-4" />
                       Salir de todos modos (Sin guardar)
                    </button>
                    
                    <button 
                      onClick={handleCancelExit} 
                      className="h-11 w-full rounded-2xl bg-clinical-50 text-clinical-450 hover:bg-clinical-100/50 text-xs font-bold uppercase tracking-widest transition-all"
                    >
                       Cancelar y Seguir Editando
                    </button>
                 </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </>
  )
}

