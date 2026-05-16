import { useState, useMemo } from 'react'
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
  ChevronDown
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/widgets/button'

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

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', date: '2026-05-16', time: '08:00', patientName: 'Lucía Méndez', patientAge: '24', doctorName: 'Dra. Ana García', reason: 'Control Prenatal', type: 'Control', status: 'Agendada' },
  { id: '2', date: '2026-05-16', time: '09:00', patientName: 'María López', patientAge: '32', doctorName: 'Dra. Ana García', reason: 'Ecografía Genética', type: 'Ecografía', status: 'Sala de espera' },
  { id: '3', date: '2026-05-16', time: '08:30', patientName: 'Elena Ramos', patientAge: '28', doctorName: 'Dr. Wilson Mora', reason: 'Ginecología General', type: 'Ginecología', status: 'En consultorio' },
  { id: '4', date: '2026-05-16', time: '10:00', patientName: 'Carla Ortiz', patientAge: '35', doctorName: 'Dra. Sofía Ruiz', reason: 'Planificación Familiar', type: 'Consulta', status: 'Agendada' },
]

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
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [contactingApp, setContactingApp] = useState<Appointment | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS)
  const [searchQuery, setSearchQuery] = useState('')

  const activeAppointments = useMemo(() => {
    return appointments.filter(app => 
      app.status !== 'Finalizada' && 
      app.status !== 'Cancelada' &&
      (app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
       app.doctorName.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [appointments, searchQuery])

  const handleStatusChange = (id: string, newStatus: AppointmentStatus) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ))
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
            <p className="text-sm text-clinical-800/60 max-w-md">Administre las consultas programadas para el <span className="font-semibold text-primary-700">16 Mayo, 2026</span>.</p>
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
              <input type="text" placeholder="Buscar por paciente, doctor o motivo..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-11 rounded-2xl border-0 bg-white pl-11 pr-4 text-sm shadow-premium ring-1 ring-inset ring-primary-100/50 focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium" />
           </div>
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 h-11 rounded-2xl bg-white shadow-premium ring-1 ring-inset ring-primary-100/50">
                 <Filter className="h-4 w-4 text-primary-400" />
                 <select className="bg-transparent text-xs font-bold text-clinical-800 outline-none cursor-pointer">
                    <option>Todos los Doctores</option>
                    {DOCTORS.map(d => <option key={d}>{d}</option>)}
                 </select>
              </div>
           </div>
        </motion.div>

        <AnimatePresence mode="wait">
           {view === 'list' ? (
             <motion.div key="list" initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }} variants={containerVariants} className="space-y-4">
                <div className="flex items-center gap-2 px-1 mb-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-[0.15em] text-clinical-400">Agendas del día de hoy</span>
                </div>
                {activeAppointments.map(app => (
                  <AppointmentRow key={app.id} appointment={app} onStatusChange={handleStatusChange} onContact={() => setContactingApp(app)} />
                ))}
             </motion.div>
           ) : (
             <motion.div key="calendar" initial="hidden" animate="visible" exit={{ opacity: 0, scale: 0.98 }} variants={containerVariants}>
                <SchedulerView appointments={appointments} onNewAppointment={() => setIsModalOpen(true)} />
             </motion.div>
           )}
        </AnimatePresence>
      </motion.div>

      <NewAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ContactModal appointment={contactingApp} onClose={() => setContactingApp(null)} />
    </div>
  )
}

function StatusDropdown({ currentStatus, onChange }: { currentStatus: AppointmentStatus, onChange: (s: AppointmentStatus) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const status = STATUS_CONFIG[currentStatus]
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

function AppointmentRow({ appointment, onStatusChange, onContact }: any) {
  const status = STATUS_CONFIG[appointment.status as AppointmentStatus]
  const StatusIcon = status.icon

  return (
    <motion.div variants={itemVariants} className="bg-white p-4 rounded-2xl border border-primary-100/30 shadow-premium hover:shadow-lg transition-all group flex items-center justify-between gap-6">
       <div className="flex items-center gap-6 flex-1">
          <div className="text-center min-w-[70px] py-2 border-r border-primary-50">
             <p className="text-lg font-black text-clinical-900 leading-none tracking-tighter">{appointment.time}</p>
             <p className="text-[10px] font-black text-primary-400 mt-1 uppercase tracking-widest">AM</p>
          </div>
          <div className="flex items-center gap-4 min-w-[220px]">
             <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-2xl bg-primary-100 text-primary-700 text-xs font-bold border border-white shadow-sm transition-transform group-hover:scale-110">{appointment.patientName.charAt(0)}</div>
             <div className="min-w-0">
                <h4 className="font-bold text-clinical-900 text-sm truncate group-hover:text-primary-700 transition-colors leading-tight">{appointment.patientName}</h4>
                <p className="text-[11px] text-clinical-800/50 flex items-center gap-1 mt-1"><span className="h-1 w-1 rounded-full bg-primary-300" />{appointment.patientAge} Años • HC-2026</p>
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
             <button className="h-9 w-9 flex items-center justify-center rounded-xl text-clinical-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100 shadow-sm" title="Eliminar">
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

function SchedulerView({ appointments }: any) {
  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
  return (
    <motion.div variants={itemVariants} className="glass-card rounded-2xl overflow-hidden border border-white">
       <div className="grid grid-cols-[80px_repeat(3,1fr)] bg-primary-50/30 border-b border-primary-100/30">
          <div className="p-4 border-r border-primary-100/30 flex items-center justify-center"><Clock className="h-4 w-4 text-primary-300" /></div>
          {DOCTORS.map(doc => (<div key={doc} className="p-4 border-r border-primary-100/30 last:border-none text-center"><p className="text-[11px] font-bold text-primary-900/60 uppercase tracking-widest">{doc}</p></div>))}
       </div>
       <div className="divide-y divide-primary-100/30 bg-white/40">
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-[80px_repeat(3,1fr)]">
               <div className="p-4 border-r border-primary-100/30 flex items-center justify-center bg-primary-50/10"><span className="text-[11px] font-bold text-primary-900/40 tracking-tighter">{hour}</span></div>
               {DOCTORS.map(doc => {
                 const app = appointments.find((a: any) => a.time === hour && a.doctorName === doc)
                 return (
                   <div key={doc} className="p-2 border-r border-primary-100/30 last:border-none relative group/cell min-h-[90px]">
                      {app ? (
                        <div className={cn("h-full rounded-xl p-3 border shadow-sm transition-all hover:shadow-premium cursor-pointer group/card", STATUS_CONFIG[app.status as AppointmentStatus].color.replace('text', 'bg').replace('600', '50') + ' border-' + STATUS_CONFIG[app.status as AppointmentStatus].color.split('-')[1] + '-100')}>
                           <div className="flex items-start justify-between gap-2">
                              <h5 className={cn("font-bold text-[11px] leading-tight truncate", STATUS_CONFIG[app.status as AppointmentStatus].color)}>{app.patientName}</h5>
                           </div>
                           <p className="text-[8px] font-black uppercase tracking-tighter opacity-60 mt-1 truncate">{app.reason}</p>
                        </div>
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

function NewAppointmentModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
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
                 <ModalInput label="Nombre del Paciente" placeholder="Buscar por nombre o cédula..." colSpan={2} />
                 <ModalInput label="Fecha Programada" type="date" />
                 <ModalInput label="Especialista" placeholder="Seleccionar doctor..." type="select" />
                 <ModalInput label="Tipo de Consulta" placeholder="Seleccionar tipo..." type="select" />
                 <div className="grid grid-cols-2 gap-2"><ModalInput label="Hora Inicio" type="time" /><ModalInput label="Hora Fin" type="time" /></div>
                 <ModalInput label="Motivo de Consulta" placeholder="Ej: Control rutinario, Ecografía..." colSpan={3} />
                 <ModalInput label="Observaciones Internas" placeholder="Notas adicionales..." colSpan={3} textarea />
              </div>
              <div className="px-6 py-4 bg-primary-50/10 border-t border-primary-50 flex justify-end gap-3">
                 <button onClick={onClose} className="px-6 text-[9px] font-black text-clinical-400 uppercase tracking-widest hover:text-rose-500 transition-all">Cancelar</button>
                 <Button variant="primary" className="rounded-xl h-10 px-8 shadow-lg shadow-primary-200 text-xs">Agendar Cita</Button>
              </div>
           </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function ModalInput({ label, placeholder, colSpan = 1, type = 'text', textarea = false }: any) {
  return (
    <div className={cn("space-y-1.5", colSpan === 2 && "col-span-2", colSpan === 3 && "col-span-3")}>
       <label className="text-[10px] font-bold text-primary-900/40 uppercase tracking-widest ml-1">{label}</label>
       {type === 'select' ? (
         <select className="w-full h-11 px-4 bg-white border border-primary-100/50 rounded-xl text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm">
            <option>Seleccionar...</option>
            {label === 'Tipo de Consulta' && ['Ginecología', 'Control prenatal', 'Planificación familiar'].map(opt => <option key={opt}>{opt}</option>)}
            {label === 'Especialista' && DOCTORS.map(opt => <option key={opt}>{opt}</option>)}
         </select>
       ) : textarea ? (
         <textarea className="w-full h-24 p-4 bg-white border border-primary-100/50 rounded-xl text-sm font-medium text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm" placeholder={placeholder} />
       ) : (
         <input type={type} className="w-full h-11 px-4 bg-white border border-primary-100/50 rounded-xl text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm" placeholder={placeholder} />
       )}
    </div>
  )
}

function ActionIcon({ icon, title, primary = false, danger = false }: { icon: any, title: string, primary?: boolean, danger?: boolean }) {
  return (
    <button className={cn("h-9 w-9 flex items-center justify-center transition-all rounded-xl", primary ? "bg-primary-600 text-white shadow-lg shadow-primary-200 hover:bg-primary-700" : danger ? "text-clinical-800/30 hover:text-rose-600 hover:bg-rose-50" : "text-clinical-800/30 hover:text-primary-700 hover:bg-white hover:shadow-premium border border-transparent hover:border-primary-50")} title={title}>{icon}</button>
  )
}

function ViewToggle({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all", active ? "bg-primary-600 text-white shadow-md" : "text-primary-400 hover:bg-primary-50")}>{icon}{label}</button>
  )
}
