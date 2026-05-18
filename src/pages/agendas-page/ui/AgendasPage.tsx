import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Calendar as CalendarIcon, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Stethoscope, 
  User, 
  Clock,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  FileText,
  Download,
  Pencil,
  Send,
  MessageCircle,
  Phone,
  ChevronDown,
  Loader2
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/widgets/button'
import { useToast } from '@/shared/ui/ToastContext'
import axios from 'axios'

/* ==================================================
   TYPES & CONSTANTS
   ================================================== */

type AppointmentStatus = 'Agendada' | 'Confirmada' | 'Sala de espera' | 'En consultorio' | 'En atención' | 'Finalizada' | 'Cancelada' | 'No asistió'

interface Appointment {
  id: string
  date: string
  time: string
  patientName: string
  patientAge: string
  doctorName: string
  reason: string
  type: string
  status: AppointmentStatus
}

const DOCTORS = ['Dra. Ana García', 'Dr. Wilson Mora', 'Dra. Sofía Ruiz']

const STATUS_CONFIG: Record<AppointmentStatus, { color: string, icon: any }> = {
  'Agendada': { color: 'text-primary-600', icon: Clock },
  'Confirmada': { color: 'text-emerald-600', icon: CheckCircle2 },
  'Sala de espera': { color: 'text-amber-600', icon: AlertCircle },
  'En consultorio': { color: 'text-purple-600', icon: User },
  'En atención': { color: 'text-indigo-600', icon: Stethoscope },
  'Finalizada': { color: 'text-clinical-400', icon: CheckCircle2 },
  'Cancelada': { color: 'text-rose-600', icon: XCircle },
  'No asistió': { color: 'text-clinical-400', icon: XCircle },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

/* ==================================================
   MAIN PAGE COMPONENT
   ================================================== */

export function AgendasPage() {
  const { showToast } = useToast()
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [contactingApp, setContactingApp] = useState<Appointment | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState('Todos los Doctores')
  const [realDoctors, setRealDoctors] = useState<string[]>([])
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null)
  const [deletingLoading, setDeletingLoading] = useState(false)

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  })

  const handleNavigateDate = (days: number) => {
    const parts = selectedDate.split('-')
    if (parts.length === 3) {
      const current = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
      current.setDate(current.getDate() + days)
      const year = current.getFullYear()
      const month = String(current.getMonth() + 1).padStart(2, '0')
      const day = String(current.getDate()).padStart(2, '0')
      setSelectedDate(`${year}-${month}-${day}`)
    }
  }

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:3001/api/users')
      const activeUsers = res.data.filter((u: any) => u.status === 'Activo')
      if (activeUsers.length > 0) {
        const names = activeUsers.map((u: any) => {
          if (u.nombres) {
            const lowerName = u.nombres.toLowerCase()
            const lowerUser = u.username.toLowerCase()
            const isFemale = lowerName.startsWith('dra') || lowerName.includes('ana') || lowerName.includes('garcia') || lowerName.includes('sofia') || lowerName.includes('lucy') || lowerUser.includes('dra')
            const prefix = isFemale ? 'Dra. ' : 'Dr. '
            if (lowerName.startsWith('dr.') || lowerName.startsWith('dra.')) {
              return `${u.nombres} ${u.apellidos || ''}`.trim()
            }
            return `${prefix}${u.nombres} ${u.apellidos || ''}`.trim()
          }
          return `@${u.username}`
        })
        setRealDoctors(names)
      } else {
        setRealDoctors(['Dra. Ana García', 'Dr. Wilson Mora', 'Dra. Sofía Ruiz'])
      }
    } catch (err) {
      console.error('Error fetching doctors:', err)
      setRealDoctors(['Dra. Ana García', 'Dr. Wilson Mora', 'Dra. Sofía Ruiz'])
    }
  }

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const res = await axios.get('http://127.0.0.1:3001/api/appointments')
      setAppointments(res.data)
    } catch (err) {
      console.error('Error fetching appointments:', err)
      showToast('Error al cargar la agenda médica', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
    fetchDoctors()
  }, [])

  const activeAppointments = useMemo(() => {
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const todayStr = `${year}-${month}-${day}`

    return appointments.filter(app => {
      const matchesSearch = app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            app.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.reason.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesDoctor = selectedDoctor === 'Todos los Doctores' || app.doctorName === selectedDoctor
      const matchesToday = app.date === todayStr
      
      return app.status !== 'Finalizada' && app.status !== 'Cancelada' && matchesSearch && matchesDoctor && matchesToday
    })
  }, [appointments, searchQuery, selectedDoctor])

  const handleStatusChange = async (id: string, newStatus: AppointmentStatus) => {
    try {
      // Optimistic update
      setAppointments(prev => prev.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ))
      
      await axios.patch(`http://127.0.0.1:3001/api/appointments/${id}`, {
        status: newStatus
      })
      showToast('Estado de la cita actualizado', 'success')
    } catch (err: any) {
      console.error('Error updating status:', err)
      const errorMsg = err.response?.data?.message || 'Error al actualizar el estado de la cita'
      showToast(errorMsg, 'error')
      fetchAppointments() // Rollback on error
    }
  }

  const handleDeleteTrigger = (id: string) => {
    setAppointmentToDelete(id)
  }

  const handleDeleteConfirm = async () => {
    if (!appointmentToDelete) return
    try {
      setDeletingLoading(true)
      await axios.delete(`http://127.0.0.1:3001/api/appointments/${appointmentToDelete}`)
      setAppointments(prev => prev.filter(app => app.id !== appointmentToDelete))
      showToast('Cita eliminada correctamente', 'success')
      setAppointmentToDelete(null)
    } catch (err) {
      console.error('Error deleting appointment:', err)
      showToast('Error al eliminar la cita', 'error')
    } finally {
      setDeletingLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-clinical-50/50">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="mx-auto max-w-7xl px-6 py-10">
        <motion.header variants={itemVariants} className="flex flex-col gap-6 mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-12 bg-primary-500 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600/70">Gestión de Citas</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-clinical-900 mb-2">Agenda <span className="text-primary-700">Médica</span></h1>
            <p className="text-sm text-clinical-800/60 max-w-md">
              Administre las consultas programadas de forma centralizada y en tiempo real.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-white p-1 rounded-2xl flex gap-1 border border-primary-100/50 shadow-sm mr-2">
                <ViewToggle active={view === 'list'} onClick={() => setView('list')} icon={<List className="h-4 w-4" />} label="Lista" />
                <ViewToggle active={view === 'calendar'} onClick={() => setView('calendar')} icon={<CalendarIcon className="h-4 w-4" />} label="Calendario" />
             </div>
             <Button variant="primary" className="shadow-lg shadow-primary-200" onClick={() => setIsModalOpen(true)}>
               <Plus className="h-4 w-4 mr-2" /> Nueva Cita
             </Button>
          </div>
        </motion.header>

        <motion.div variants={itemVariants} className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center">
           <div className="relative flex-1 max-w-md group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-300 group-focus-within:text-primary-500 transition-colors"><Search className="h-4 w-4" /></span>
              <input 
                type="text" 
                placeholder="Buscar por paciente, doctor o motivo..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full h-11 rounded-2xl border-0 bg-white pl-11 pr-4 text-sm shadow-premium ring-1 ring-inset ring-primary-100/50 focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium" 
              />
           </div>
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 h-11 rounded-2xl bg-white shadow-premium ring-1 ring-inset ring-primary-100/50">
                 <Filter className="h-4 w-4 text-primary-400" />
                 <select 
                   value={selectedDoctor}
                   onChange={(e) => setSelectedDoctor(e.target.value)}
                   className="bg-transparent text-xs font-bold text-clinical-800 outline-none cursor-pointer border-none"
                 >
                    <option value="Todos los Doctores">Todos los Doctores</option>
                    {realDoctors.map(d => <option key={d} value={d}>{d}</option>)}
                 </select>
              </div>

              {view === 'calendar' && (
                 <div className="flex items-center gap-2 bg-white px-2 py-1 h-11 rounded-2xl border border-primary-100/50 shadow-premium">
                    <button 
                      onClick={() => handleNavigateDate(-1)} 
                      className="h-8 w-8 rounded-xl flex items-center justify-center text-primary-450 hover:text-primary-600 hover:bg-primary-50 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    <div className="flex items-center gap-1.5 px-1">
                      <CalendarIcon className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                      <input 
                        type="date" 
                        value={selectedDate} 
                        onChange={(e) => setSelectedDate(e.target.value)} 
                        className="text-xs font-bold text-clinical-800 bg-transparent outline-none border-none cursor-pointer p-0 w-[110px]"
                      />
                    </div>
                    
                    <button 
                      onClick={() => handleNavigateDate(1)} 
                      className="h-8 w-8 rounded-xl flex items-center justify-center text-primary-450 hover:text-primary-600 hover:bg-primary-50 transition-all cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                 </div>
              )}
           </div>
        </motion.div>

        <AnimatePresence mode="wait">
           {loading ? (
             <div className="flex items-center justify-center py-20 text-primary-600 gap-3">
               <Loader2 className="h-8 w-8 animate-spin" />
               <p className="text-sm font-medium">Cargando agenda médica...</p>
             </div>
           ) : view === 'list' ? (
             <motion.div key="list" initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }} variants={containerVariants} className="space-y-4">
                <div className="flex items-center gap-2 px-1 mb-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-[0.15em] text-clinical-400">Citas programadas activas</span>
                </div>
                {activeAppointments.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl border border-primary-100/30 text-center shadow-premium">
                    <CalendarIcon className="h-12 w-12 text-clinical-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-clinical-800">No hay citas activas para mostrar.</p>
                    <p className="text-xs text-clinical-450 mt-1">Cree una nueva cita para comenzar.</p>
                  </div>
                ) : (
                  activeAppointments.map(app => (
                    <AppointmentRow 
                      key={app.id} 
                      appointment={app} 
                      onStatusChange={handleStatusChange} 
                      onContact={() => setContactingApp(app)} 
                      onDelete={handleDeleteTrigger}
                    />
                  ))
                )}
             </motion.div>
           ) : (
             <motion.div key="calendar" initial="hidden" animate="visible" exit={{ opacity: 0, scale: 0.98 }} variants={containerVariants}>
                <SchedulerView 
                  doctors={realDoctors} 
                  appointments={appointments} 
                  selectedDate={selectedDate} 
                  onNewAppointment={() => setIsModalOpen(true)} 
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTrigger}
                />
             </motion.div>
           )}
        </AnimatePresence>
      </motion.div>

      <NewAppointmentModal 
        doctors={realDoctors}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchAppointments}
      />
      <ContactModal appointment={contactingApp} onClose={() => setContactingApp(null)} />
      <ConfirmDeleteModal 
        isOpen={appointmentToDelete !== null}
        onClose={() => setAppointmentToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deletingLoading}
      />
    </div>
  )
}

function StatusDropdown({ currentStatus, onChange }: { currentStatus: AppointmentStatus, onChange: (s: AppointmentStatus) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const status = STATUS_CONFIG[currentStatus] || STATUS_CONFIG['Agendada']
  const Icon = status.icon

  return (
    <div className="relative">
       <button 
         onClick={() => setIsOpen(!isOpen)}
         className={cn(
           "flex items-center gap-2 pl-3 pr-2 h-9 rounded-xl text-[10px] font-black uppercase tracking-tighter ring-1 ring-clinical-100 bg-white hover:ring-primary-300 transition-all min-w-[145px]",
           status.color
         )}
       >
          <Icon className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">{currentStatus}</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")} />
       </button>

       <AnimatePresence>
          {isOpen && (
            <>
               <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
               <motion.div 
                 initial={{ opacity: 0, y: 4, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: 4, scale: 0.95 }}
                 className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[180px] bg-white rounded-2xl shadow-2xl border border-clinical-100 p-2 overflow-hidden"
               >
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                    const ItemIcon = config.icon
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          onChange(key as AppointmentStatus)
                          setIsOpen(false)
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-clinical-50",
                          key === currentStatus ? config.color : "text-clinical-400"
                        )}
                      >
                         <ItemIcon className={cn("h-4 w-4", key === currentStatus ? config.color : "text-clinical-200")} />
                         {key}
                      </button>
                    )
                  })}
               </motion.div>
            </>
          )}
       </AnimatePresence>
    </div>
  )
}

function CompactStatusDropdown({ currentStatus, onChange }: { currentStatus: AppointmentStatus, onChange: (s: AppointmentStatus) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const status = STATUS_CONFIG[currentStatus] || STATUS_CONFIG['Agendada']
  const Icon = status.icon

  return (
    <div className="relative">
       <button 
         onClick={(e) => {
           e.stopPropagation()
           setIsOpen(!isOpen)
         }}
         className={cn(
           "flex items-center gap-1 px-2 h-7 rounded-lg text-[8px] font-black uppercase tracking-tighter ring-1 ring-black/5 bg-white/80 hover:bg-white transition-all w-full justify-between",
           status.color
         )}
       >
          <div className="flex items-center gap-1 min-w-0">
             <Icon className="h-2.5 w-2.5 shrink-0" />
             <span className="truncate">{currentStatus}</span>
          </div>
          <ChevronDown className="h-2.5 w-2.5 shrink-0 opacity-50" />
       </button>

       <AnimatePresence>
          {isOpen && (
            <>
               <div className="fixed inset-0 z-40" onClick={(e) => {
                 e.stopPropagation()
                 setIsOpen(false)
               }} />
                <motion.div 
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-[calc(100%+4px)] z-[100] min-w-[140px] bg-white rounded-xl shadow-xl border border-clinical-100 p-1 overflow-hidden"
               >
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                    const ItemIcon = config.icon
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          onChange(key as AppointmentStatus)
                          setIsOpen(false)
                        }}
                        className={cn(
                          "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[8px] font-bold uppercase tracking-wider transition-all hover:bg-clinical-50 text-left",
                          key === currentStatus ? config.color : "text-clinical-400"
                        )}
                      >
                         <ItemIcon className={cn("h-3 w-3 shrink-0", key === currentStatus ? config.color : "text-clinical-200")} />
                         <span className="truncate">{key}</span>
                      </button>
                    )
                  })}
               </motion.div>
            </>
          )}
       </AnimatePresence>
    </div>
  )
}

function AppointmentRow({ appointment, onStatusChange, onContact, onDelete }: any) {
  const status = STATUS_CONFIG[appointment.status as AppointmentStatus] || STATUS_CONFIG['Agendada']
  const StatusIcon = status.icon

  return (
    <motion.div variants={itemVariants} className="bg-white p-4 rounded-2xl border border-primary-100/30 shadow-premium hover:shadow-lg transition-all group flex items-center justify-between gap-6">
       <div className="flex items-center gap-6 flex-1">
          <div className="text-center min-w-[70px] py-2 border-r border-primary-50">
             <p className="text-lg font-black text-clinical-900 leading-none tracking-tighter">{appointment.time}</p>
             <p className="text-[10px] font-black text-primary-400 mt-1 uppercase tracking-widest">HORA</p>
          </div>
          <div className="flex items-center gap-4 min-w-[220px]">
             <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-2xl bg-primary-100 text-primary-700 text-xs font-bold border border-white shadow-sm transition-transform group-hover:scale-110">
               {appointment.patientName.charAt(0)}
             </div>
             <div className="min-w-0">
                <h4 className="font-bold text-clinical-900 text-sm truncate group-hover:text-primary-700 transition-colors leading-tight">{appointment.patientName}</h4>
                <p className="text-[11px] text-clinical-800/50 flex items-center gap-1 mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-300" />
                  {appointment.patientAge || '30'} Años • {(() => {
                    const parts = appointment.date.split('-');
                    if (parts.length === 3) {
                      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
                    }
                    return appointment.date;
                  })()}
                </p>
             </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-8">
             <div>
                <p className="text-[9px] font-black text-primary-900/40 uppercase tracking-widest mb-1.5">Especialista</p>
                <p className="text-xs font-bold text-clinical-700 flex items-center gap-2"><User className="h-3 w-3 text-primary-400" />{appointment.doctorName}</p>
             </div>
             <div>
                <p className="text-[9px] font-black text-primary-900/40 uppercase tracking-widest mb-1.5">Motivo</p>
                <div className="flex items-center gap-2">
                   <p className="text-xs font-bold text-clinical-900 truncate">{appointment.reason}</p>
                   <span className="px-1.5 py-0.5 rounded-md bg-primary-50 text-primary-600 text-[8px] font-black uppercase border border-primary-100">{appointment.type}</span>
                </div>
             </div>
          </div>
       </div>

       <div className="flex items-center gap-4">
          <StatusDropdown 
            currentStatus={appointment.status} 
            onChange={(newStatus) => onStatusChange(appointment.id, newStatus)} 
          />

          <div className="flex items-center gap-2">
             <button onClick={onContact} className="h-9 w-9 flex items-center justify-center rounded-xl text-primary-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-100 shadow-sm" title="Contactar Paciente">
                <MessageCircle className="h-4 w-4" />
             </button>
             <button onClick={() => onDelete(appointment.id)} className="h-9 w-9 flex items-center justify-center rounded-xl text-clinical-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100 shadow-sm" title="Eliminar Cita">
                <Trash2 className="h-4 w-4" />
             </button>
          </div>
       </div>
    </motion.div>
  )
}

function ContactModal({ appointment, onClose }: { appointment: Appointment | null, onClose: () => void }) {
  if (!appointment) return null
  
  const phoneNumber = '593968982380'
  const confirmationLink = `${window.location.origin}/confirmacion-cita/${appointment.id}`
  const message = `Hola ${appointment.patientName}, te saludamos del Centro Médico. Tienes una cita programada para el día ${appointment.date} a las ${appointment.time} con el ${appointment.doctorName}. \n\nPor favor, confirma tu asistencia en el siguiente link:\n${confirmationLink}`
  
  const handleSend = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-clinical-900/40 backdrop-blur-[2px]" />
         <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-white">
            <div className="p-6 border-b border-primary-50 flex items-center justify-between bg-primary-50/30">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-100"><MessageCircle className="h-5 w-5" /></div>
                  <div>
                     <h2 className="text-lg font-bold text-clinical-900 tracking-tight">Contactar Paciente</h2>
                     <p className="text-[9px] font-bold text-clinical-800/40 uppercase tracking-widest">Envío de recordatorio vía WhatsApp</p>
                  </div>
               </div>
               <button onClick={onClose} className="h-8 w-8 rounded-xl hover:bg-rose-50 flex items-center justify-center text-clinical-400 hover:text-rose-500 transition-all"><XCircle className="h-5 w-5" /></button>
            </div>
            <div className="p-8 space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary-900/40 uppercase tracking-widest ml-1">Mensaje Predefinido</label>
                  <div className="w-full p-5 bg-clinical-50 rounded-2xl border border-clinical-100 text-sm text-clinical-800 font-medium leading-relaxed whitespace-pre-wrap">{message}</div>
               </div>
               <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <Phone className="h-4 w-4 text-emerald-600" />
                  <p className="text-xs font-bold text-emerald-800 tracking-wide">Destinatario: <span className="text-emerald-600">+{phoneNumber}</span></p>
               </div>
            </div>
            <div className="px-8 py-6 bg-primary-50/10 border-t border-primary-50 flex justify-end gap-3">
               <button onClick={onClose} className="px-6 text-[10px] font-black text-clinical-400 uppercase tracking-widest hover:text-rose-500 transition-all">Cancelar</button>
               <Button variant="primary" onClick={handleSend} className="rounded-xl h-12 px-8 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100 font-bold border-none">
                  <Send className="h-4 w-4 mr-2" /> Enviar WhatsApp
               </Button>
            </div>
         </motion.div>
      </div>
    </AnimatePresence>
  )
}

function SchedulerView({ doctors, appointments, selectedDate, onStatusChange, onDelete }: any) {
  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
  return (
    <motion.div variants={itemVariants} className="glass-card rounded-2xl overflow-hidden border border-white">
       <div className="grid bg-primary-50/30 border-b border-primary-100/30" style={{ gridTemplateColumns: `80px repeat(${doctors.length}, 1fr)` }}>
          <div className="p-4 border-r border-primary-100/30 flex items-center justify-center"><Clock className="h-4 w-4 text-primary-300" /></div>
          {doctors.map(doc => (<div key={doc} className="p-4 border-r border-primary-100/30 last:border-none text-center"><p className="text-[11px] font-bold text-primary-900/60 uppercase tracking-widest">{doc}</p></div>))}
       </div>
       <div className="divide-y divide-primary-100/30 bg-white/40">
          {hours.map(hour => (
            <div key={hour} className="grid" style={{ gridTemplateColumns: `80px repeat(${doctors.length}, 1fr)` }}>
               <div className="p-4 border-r border-primary-100/30 flex items-center justify-center bg-primary-50/10"><span className="text-[11px] font-bold text-primary-900/40 tracking-tighter">{hour}</span></div>
               {doctors.map(doc => {
                 const cellApps = appointments.filter((a: any) => {
                    if (!a.time || a.doctorName !== doc || a.date !== selectedDate) return false
                    const appHour = parseInt(a.time.split(':')[0], 10)
                    const slotHour = parseInt(hour.split(':')[0], 10)
                    return appHour === slotHour
                 }).sort((a: any, b: any) => a.time.localeCompare(b.time))
                 return (
                   <div key={doc} className="p-2 border-r border-primary-100/30 last:border-none relative group/cell min-h-[90px] flex flex-col gap-2 bg-white/10">
                      {cellApps.length > 0 ? (
                        cellApps.map((app: any) => (
                          <div key={app.id} className={cn("rounded-xl p-2.5 border shadow-sm transition-all hover:shadow-premium cursor-pointer group/card flex flex-col justify-between bg-white", STATUS_CONFIG[app.status as AppointmentStatus]?.color?.replace('text', 'bg').replace('600', '50') + ' border-' + STATUS_CONFIG[app.status as AppointmentStatus]?.color?.split('-')[1] + '-100')}>
                             <div>
                                <div className="flex items-start justify-between gap-2">
                                   <h5 className={cn("font-bold text-[11px] leading-tight truncate", STATUS_CONFIG[app.status as AppointmentStatus]?.color)}>{app.patientName}</h5>
                                   <button 
                                     onClick={(e) => {
                                       e.stopPropagation()
                                       onDelete(app.id)
                                     }}
                                     className="h-5 w-5 shrink-0 rounded-md flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 shadow-sm transition-all opacity-0 group-hover/card:opacity-100"
                                     title="Eliminar Cita"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                   </button>
                                </div>
                                <p className="text-[8px] font-black uppercase tracking-tighter opacity-70 mt-1.5 truncate flex items-center gap-1.5">
                                   <span className="text-primary-700 font-extrabold bg-white px-1 py-0.5 rounded border border-primary-100/50 shadow-sm shrink-0">{app.time}</span>
                                   <span className="truncate">{app.reason}</span>
                                </p>
                             </div>
                             <div className="mt-2.5 pt-1.5 border-t border-black/5">
                                <CompactStatusDropdown 
                                  currentStatus={app.status} 
                                  onChange={(newStatus) => onStatusChange(app.id, newStatus)} 
                                />
                             </div>
                          </div>
                        ))
                      ) : (
                        <div className="w-full h-full rounded-xl border border-dashed border-transparent flex items-center justify-center text-primary-200" />
                      )}
                   </div>
                 )
               })}
            </div>
          ))}
       </div>
    </motion.div>
  )
}

function NewAppointmentModal({ doctors, isOpen, onClose, onSuccess }: { doctors: string[], isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  const { showToast } = useToast()
  const [patientName, setPatientName] = useState('')
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10))
  const [time, setTime] = useState('08:00')
  const [doctorName, setDoctorName] = useState('')
  const [type, setType] = useState('Consulta')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  // Auto-select first doctor
  useEffect(() => {
    if (isOpen && doctors.length > 0 && !doctorName) {
      setDoctorName(doctors[0])
    }
  }, [isOpen, doctors, doctorName])

  // Autocomplete search states
  const [patients, setPatients] = useState<any[]>([])
  const [filteredPatients, setFilteredPatients] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null)
  const [dropdownRef, setDropdownRef] = useState<HTMLDivElement | null>(null)

  // Fetch patients when modal is opened
  useEffect(() => {
    if (isOpen) {
      axios.get('http://127.0.0.1:3001/api/patients')
        .then(res => {
          setPatients(res.data)
        })
        .catch(err => {
          console.error('Error fetching patients for autocomplete:', err)
        })
    }
  }, [isOpen])

  // Filter patients based on typing input (nombres + apellidos or numeroDocumento)
  useEffect(() => {
    if (!patientName.trim()) {
      setFilteredPatients(patients)
      return
    }
    const query = patientName.toLowerCase()
    const filtered = patients.filter(p => {
      const fullName = `${p.nombres} ${p.apellidos}`.toLowerCase()
      const doc = (p.numeroDocumento || '').toLowerCase()
      return fullName.includes(query) || doc.includes(query)
    })
    setFilteredPatients(filtered)
  }, [patientName, patients])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownRef])

  const handleSubmit = async () => {
    if (!patientName || !date || !time || !doctorName || !reason) {
      showToast('Por favor, complete todos los campos obligatorios', 'error')
      return
    }

    // Determine actual age from selected patient or generate default
    let age = '30'
    if (selectedPatient && selectedPatient.fechaNacimiento) {
      const birthDate = new Date(selectedPatient.fechaNacimiento)
      const today = new Date()
      let computedAge = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        computedAge--
      }
      age = String(computedAge)
    } else {
      age = String(Math.floor(18 + Math.random() * 50))
    }

    try {
      setLoading(true)
      await axios.post('http://127.0.0.1:3001/api/appointments', {
        patientName,
        date,
        time,
        doctorName,
        type,
        reason,
        patientAge: age,
        status: 'Agendada'
      })
      showToast('Cita agendada correctamente', 'success')
      onSuccess()
      onClose()
      
      // Reset form
      setPatientName('')
      setDoctorName('')
      setReason('')
      setSelectedPatient(null)
    } catch (err: any) {
      console.error('Error creating appointment:', err)
      const errorMsg = err.response?.data?.message || 'Error al agendar la cita'
      showToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-clinical-900/40 backdrop-blur-[2px]" />
           <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-white">
              <div className="p-5 border-b border-primary-50 flex items-center justify-between bg-primary-50/30">
                 <div><h2 className="text-lg font-bold text-clinical-900 tracking-tight">Nueva Cita <span className="text-primary-600">Médica</span></h2><p className="text-[9px] font-bold text-clinical-800/40 uppercase tracking-widest">Complete los detalles de la programación</p></div>
                 <button onClick={onClose} className="h-8 w-8 rounded-xl hover:bg-rose-50 flex items-center justify-center text-clinical-400 hover:text-rose-500 transition-all"><XCircle className="h-5 w-5" /></button>
              </div>
              <div className="p-6 grid grid-cols-3 gap-x-6 gap-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
                 <div className="col-span-2 space-y-1.5 relative animate-none" ref={setDropdownRef}>
                    <label className="text-[10px] font-bold text-primary-900/40 uppercase tracking-widest ml-1">Nombre del Paciente *</label>
                    <div className="relative">
                       <input 
                         type="text" 
                         value={patientName} 
                         onChange={e => {
                           setPatientName(e.target.value)
                           setSelectedPatient(null) // clear selection if typed
                           setShowDropdown(true)
                         }} 
                         onFocus={() => setShowDropdown(true)}
                         className="w-full h-11 pl-4 pr-24 bg-white border border-primary-100/50 rounded-xl text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm" 
                         placeholder="Ej: Busque por nombre o DNI..." 
                       />
                       {selectedPatient && (
                         <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase border border-emerald-200">
                           <span className="h-1 w-1 rounded-full bg-emerald-500" />
                           Registrado
                         </span>
                       )}
                    </div>

                    <AnimatePresence>
                       {showDropdown && filteredPatients.length > 0 && (
                         <motion.div 
                           initial={{ opacity: 0, y: 5 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: 5 }}
                           className="absolute left-0 right-0 top-[calc(100%+4px)] z-[110] bg-white rounded-2xl border border-clinical-100 shadow-2xl overflow-hidden py-1 max-h-60 overflow-y-auto custom-scrollbar"
                         >
                            {filteredPatients.map(p => (
                              <div 
                                key={p.id}
                                onClick={() => {
                                  setPatientName(`${p.nombres} ${p.apellidos}`)
                                  setSelectedPatient(p)
                                  setShowDropdown(false)
                                }}
                                className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-primary-50/50 transition-all cursor-pointer border-b border-clinical-50/30 last:border-none"
                              >
                                 <div className="flex items-center gap-2.5">
                                    <div className="h-7 w-7 rounded-lg bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">
                                      {p.nombres.charAt(0)}
                                    </div>
                                    <div>
                                       <p className="font-bold text-clinical-900 text-xs leading-none">{p.nombres} {p.apellidos}</p>
                                       <p className="text-[9px] text-clinical-400 font-semibold mt-1">DNI: {p.numeroDocumento || 'No registrado'}</p>
                                    </div>
                                 </div>
                                 {p.telefono && (
                                   <span className="text-[9px] font-semibold text-clinical-450">{p.telefono}</span>
                                 )}
                              </div>
                            ))}
                         </motion.div>
                       )}
                    </AnimatePresence>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-primary-900/40 uppercase tracking-widest ml-1">Fecha Programada *</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full h-11 px-4 bg-white border border-primary-100/50 rounded-xl text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm" />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-primary-900/40 uppercase tracking-widest ml-1">Especialista *</label>
                    <select value={doctorName} onChange={e => setDoctorName(e.target.value)} className="w-full h-11 px-4 bg-white border border-primary-100/50 rounded-xl text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm">
                       <option value="">Seleccionar...</option>
                       {doctors.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-primary-900/40 uppercase tracking-widest ml-1">Tipo de Consulta *</label>
                    <select value={type} onChange={e => setType(e.target.value)} className="w-full h-11 px-4 bg-white border border-primary-100/50 rounded-xl text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm">
                       <option value="Consulta">Consulta</option>
                       <option value="Control">Control</option>
                       <option value="Ecografía">Ecografía</option>
                       <option value="Procedimiento">Procedimiento</option>
                    </select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-primary-900/40 uppercase tracking-widest ml-1">Hora Inicio *</label>
                    <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full h-11 px-4 bg-white border border-primary-100/50 rounded-xl text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm" />
                 </div>
                 <div className="col-span-3 space-y-1.5">
                    <label className="text-[10px] font-bold text-primary-900/40 uppercase tracking-widest ml-1">Motivo de Consulta *</label>
                    <input type="text" value={reason} onChange={e => setReason(e.target.value)} className="w-full h-11 px-4 bg-white border border-primary-100/50 rounded-xl text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm" placeholder="Ej: Control de rutina, dolor pélvico, citología..." />
                 </div>
              </div>
              <div className="px-6 py-4 bg-primary-50/10 border-t border-primary-50 flex justify-end gap-3">
                 <button onClick={onClose} disabled={loading} className="px-6 text-[9px] font-black text-clinical-400 uppercase tracking-widest hover:text-rose-500 transition-all">Cancelar</button>
                 <Button variant="primary" onClick={handleSubmit} disabled={loading} className="rounded-xl h-10 px-8 shadow-lg shadow-primary-200 text-xs">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Agendar Cita
                 </Button>
              </div>
           </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function ViewToggle({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all", active ? "bg-primary-600 text-white shadow-md" : "text-primary-400 hover:bg-primary-50")}>{icon}{label}</button>
  )
}

function ConfirmDeleteModal({ isOpen, onClose, onConfirm, loading }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, loading?: boolean }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-clinical-900/40 backdrop-blur-[2px]" />
           <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white p-6">
              <div className="flex flex-col items-center text-center space-y-4 py-4">
                 <div className="h-14 w-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 shadow-sm animate-pulse">
                    <Trash2 className="h-6 w-6" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-lg font-black text-clinical-900 leading-tight">¿Eliminar Cita Médica?</h3>
                    <p className="text-xs text-clinical-500 font-bold max-w-[280px] leading-relaxed">
                       ¿Está seguro de que desea eliminar esta cita? Esta acción eliminará el registro de forma permanente de la agenda y de la ficha del paciente.
                    </p>
                 </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                 <button 
                   onClick={onClose} 
                   className="flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-clinical-450 hover:bg-clinical-50 hover:text-clinical-900 transition-all border border-clinical-100"
                 >
                    Cancelar
                 </button>
                 <button 
                   onClick={onConfirm}
                   disabled={loading}
                   className="flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-100 transition-all flex items-center justify-center gap-2"
                 >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Confirmar
                 </button>
              </div>
           </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}


