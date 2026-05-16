import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  User, 
  Stethoscope,
  Phone,
  ArrowRight,
  ShieldCheck,
  Navigation,
  Share2,
  AlertCircle,
  Check
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export function ConfirmacionCitaPage() {
  const [actionType, setActionType] = useState<'confirm' | 'reschedule' | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const appointment = {
    patientName: 'Ana García López',
    doctorName: 'Dra. Ana García',
    date: 'Lunes, 16 de Mayo',
    year: '2026',
    time: '08:00 AM',
    reason: 'Control Prenatal',
    address: 'Av. Juan Tanca Marengo, Edificio Medical Center, Consultorio 402',
    city: 'Guayaquil, Ecuador'
  }

  const handleAction = () => {
    setActionType(null)
    setConfirmed(true)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 4000)
  }

  return (
    <div className="h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 font-display overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-primary-100/40 rounded-full blur-[100px]" />
         <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[1400px] h-full max-h-[850px] bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white relative z-10 overflow-hidden flex flex-col"
      >
        {/* Horizontal Top Header */}
        <div className="bg-gradient-to-r from-primary-700 to-indigo-800 px-10 py-5 text-white flex items-center justify-between shrink-0">
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                 <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                 <h1 className="text-lg font-black tracking-tight leading-none">Confirmación de Cita</h1>
                 <p className="text-primary-100/70 text-[9px] font-bold uppercase tracking-[0.2em] mt-1">Ginecología & Obstetricia • Digital Check-in</p>
              </div>
           </div>
           
           <div className="hidden sm:flex items-center gap-6">
              <div className="text-right">
                 <p className="text-[9px] font-bold text-primary-200 uppercase tracking-widest mb-1">Centro Médico</p>
                 <p className="text-xs font-bold text-white">Guayaquil, Ecuador</p>
              </div>
              <div className="h-8 w-[1px] bg-white/20" />
              <button className="h-9 w-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                 <Share2 className="h-4 w-4" />
              </button>
           </div>
        </div>

        {/* Main Content Area: 2 Columns */}
        <div className="flex-1 flex overflow-hidden">
           
           {/* Left Column: Details (400px) */}
           <div className="w-[400px] shrink-0 border-r border-clinical-100 bg-clinical-50/20 p-8 flex flex-col justify-between overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                 {/* Patient Welcome */}
                 <div className="flex items-start gap-4 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-clinical-100 flex items-center justify-center shrink-0">
                       <User className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                       <p className="text-[10px] text-clinical-400 font-bold uppercase tracking-widest mb-1">Paciente</p>
                       <h2 className="text-xl font-black text-clinical-900 leading-tight">{appointment.patientName}</h2>
                    </div>
                 </div>

                 {/* Appointment Core Stats */}
                 <div className="space-y-3">
                    <HorizontalStat icon={<Calendar className="h-4 w-4" />} label="Fecha de Cita" value={appointment.date} subValue={appointment.year} />
                    <HorizontalStat icon={<Clock className="h-4 w-4" />} label="Hora Programada" value={appointment.time} subValue="Ser puntual" variant="indigo" />
                    <HorizontalStat icon={<Stethoscope className="h-4 w-4" />} label="Especialista" value={appointment.doctorName} subValue="Presencial" variant="primary" />
                 </div>

                 {/* Address Small */}
                 <div className="p-4 rounded-xl bg-white border border-clinical-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-1.5">
                       <Navigation className="h-3 w-3 text-primary-500" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-clinical-400">Dirección de Atención</span>
                    </div>
                    <p className="text-[11px] font-bold text-clinical-800 leading-snug">{appointment.address}</p>
                 </div>
              </div>

              {/* Action Buttons: Prominent at bottom */}
              {!confirmed ? (
                <div className="pt-6 space-y-3">
                   <button 
                     onClick={() => setActionType('confirm')}
                     className="w-full h-14 rounded-2xl bg-primary-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-100 hover:bg-primary-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
                   >
                      <CheckCircle2 className="h-5 w-5 group-hover:scale-110 transition-transform" /> Confirmar Asistencia
                   </button>
                   <button 
                     onClick={() => setActionType('reschedule')}
                     className="w-full h-12 rounded-2xl bg-white border-2 border-clinical-100 text-clinical-400 font-black text-[10px] uppercase tracking-widest hover:border-rose-200 hover:text-rose-500 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                   >
                      <XCircle className="h-4 w-4 opacity-40" /> Reprogramar Cita
                   </button>
                </div>
              ) : (
                <div className="pt-6">
                   <div className="w-full p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col items-center text-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center"><Check className="h-5 w-5" /></div>
                      <p className="text-xs font-black text-emerald-800 uppercase tracking-widest">Asistencia Confirmada</p>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">¡Le esperamos en el consultorio!</p>
                   </div>
                </div>
              )}
           </div>

           {/* Right Column: Map (Remaining space) */}
           <div className="flex-1 bg-clinical-50 p-6 flex flex-col gap-6">
              <div className="flex-1 rounded-[2.5rem] bg-white shadow-premium border border-clinical-100 overflow-hidden relative group">
                 <iframe 
                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.054366627685!2d-79.914972!3d-2.13327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x902d13463870605d%3A0x66f68c37494578b8!2sMedical%20Center!5e0!3m2!1ses!2sec!4v1715830000000!5m2!1ses!2sec" 
                   className="w-full h-full border-none" 
                   allowFullScreen 
                   loading="lazy" 
                 />
                 
                 {/* Floating Overlay Info */}
                 <div className="absolute top-6 left-6 right-6 translate-y-0 opacity-100 group-hover:translate-y-[-4px] transition-all">
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white shadow-xl flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-lg">
                             <MapPin className="h-5 w-5" />
                          </div>
                          <div>
                             <p className="text-xs font-bold text-clinical-900 leading-none">Ubicación del Consultorio</p>
                             <p className="text-[10px] text-clinical-500 font-medium mt-1">Av. Juan Tanca Marengo</p>
                       </div>
                       </div>
                       <a href="https://maps.app.goo.gl/YourLink" target="_blank" rel="noreferrer" className="px-4 py-2 bg-primary-50 text-primary-700 text-[9px] font-black uppercase tracking-widest rounded-lg border border-primary-100 hover:bg-primary-600 hover:text-white transition-all">Abrir GPS</a>
                    </div>
                 </div>
              </div>

              {/* Bottom Support Info */}
              <div className="h-16 bg-white rounded-2xl border border-clinical-100 flex items-center justify-between px-8 shadow-sm shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                       <Phone className="h-4 w-4" />
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-clinical-400 uppercase tracking-widest">¿Necesita asistencia?</p>
                       <p className="text-xs font-bold text-clinical-900">+593 968 982 380</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Soporte Médico Activo</span>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>

      {/* Confirmation Modals */}
      <AnimatePresence>
        {actionType && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActionType(null)} className="absolute inset-0 bg-clinical-900/60 backdrop-blur-md" />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-white p-8 flex flex-col items-center text-center"
             >
                <div className={cn("h-16 w-16 rounded-3xl flex items-center justify-center mb-6 shadow-xl", actionType === 'confirm' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600")}>
                   {actionType === 'confirm' ? <CheckCircle2 className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
                </div>
                <h3 className="text-xl font-black text-clinical-900 tracking-tight mb-2">
                   {actionType === 'confirm' ? '¿Confirmar Asistencia?' : '¿Desea Reprogramar?'}
                </h3>
                <p className="text-sm text-clinical-500 font-medium mb-8">
                   {actionType === 'confirm' 
                     ? 'Se notificará al centro médico que usted asistirá a su cita programada.' 
                     : 'Se le redirigirá a nuestro chat para coordinar una nueva fecha y horario.'}
                </p>
                <div className="grid grid-cols-2 gap-3 w-full">
                   <button onClick={() => setActionType(null)} className="h-12 rounded-xl border border-clinical-200 text-xs font-black text-clinical-400 uppercase tracking-widest hover:bg-clinical-50 transition-all">No, Cancelar</button>
                   <button 
                     onClick={handleAction}
                     className={cn("h-12 rounded-xl text-white text-xs font-black uppercase tracking-widest shadow-lg transition-all active:scale-95", actionType === 'confirm' ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100" : "bg-primary-600 hover:bg-primary-700 shadow-primary-100")}
                   >
                      Sí, Continuar
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-10 z-[200] bg-clinical-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10"
          >
             <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
                <Check className="h-5 w-5" />
             </div>
             <div>
                <p className="text-xs font-black uppercase tracking-widest">Respuesta Guardada</p>
                <p className="text-[10px] text-white/60 font-medium">Su confirmación ha sido enviada con éxito.</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="fixed bottom-4 opacity-10">
         <p className="text-[9px] font-black text-clinical-900 uppercase tracking-[0.4em]">Medical Center 2026</p>
      </div>
    </div>
  )
}

function HorizontalStat({ icon, label, value, subValue, variant = 'primary' }: any) {
  const styles = {
    primary: 'bg-primary-50/30 border-primary-100 text-primary-700',
    indigo: 'bg-indigo-50/30 border-indigo-100 text-indigo-700'
  }
  return (
    <div className={cn("p-3 rounded-xl border flex items-center gap-3 transition-all hover:bg-white hover:shadow-sm", styles[variant as keyof typeof styles])}>
       <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm", variant === 'primary' ? 'bg-primary-600 text-white' : 'bg-indigo-600 text-white')}>
          {icon}
       </div>
       <div className="flex-1">
          <p className="text-[8px] font-black uppercase tracking-[0.1em] opacity-60 mb-0.5">{label}</p>
          <p className="text-xs font-black tracking-tight">{value}</p>
       </div>
       <div className="text-right">
          <p className="text-[9px] font-bold opacity-30 uppercase">{subValue}</p>
       </div>
    </div>
  )
}
