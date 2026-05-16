import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
   ArrowLeft,
   Baby,
   Calendar,
   Clock,
   TrendingUp,
   AlertTriangle,
   Heart,
   Stethoscope,
   Activity,
   FileText,
   ClipboardList,
   History,
   Droplet,
   ChevronRight,
   ChevronLeft,
   Plus,
   Save,
   Printer,
   XCircle,
   CheckCircle2,
   AlertCircle,
   Eye,
   Microscope,
   Pill,
   PieChart
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/widgets/button'

/* ==================================================
   TYPES & CONSTANTS
   ================================================== */

const TABS = [
   { id: 'resumen', label: 'Resumen', icon: History },
   { id: 'controles', label: 'Controles', icon: ClipboardList },
   { id: 'ecografias', label: 'Ecografías', icon: Baby },
   { id: 'examenes', label: 'Exámenes', icon: Microscope },
   { id: 'curvas', label: 'Curvas', icon: TrendingUp },
   { id: 'documentos', label: 'Documentos', icon: FileText },
   { id: 'alertas', label: 'Alertas', icon: AlertTriangle },
]

/* ==================================================
   MAIN COMPONENT
   ================================================== */

export function ObstetriciaDetallePage() {
   const { id } = useParams()
   const navigate = useNavigate()
   const [activeTab, setActiveTab] = useState('resumen')

   const patient = {
      name: 'Ana García López',
      age: '28',
      eg: '24.2',
      fpp: '12 Sep 2026',
      trimestre: 'Segundo',
      risk: 'Normal',
      bloodType: 'O RH+',
      allergies: 'Penicilina',
      doctor: 'Dra. Ana García',
      lastWeight: '68.5 kg',
      lastPressure: '110/70',
      hc: '2026-001'
   }

   return (
      <div className="min-h-dvh bg-clinical-50/50 flex flex-col">
         {/* Premium Header */}
         <header className="bg-white border-b border-clinical-100 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <button
                     onClick={() => navigate('/control-obstetrico')}
                     className="h-12 w-12 rounded-2xl bg-clinical-50 flex items-center justify-center text-clinical-400 hover:text-primary-600 transition-all border border-clinical-100 shadow-sm"
                  >
                     <ArrowLeft className="h-6 w-6" />
                  </button>
                  <div className="flex items-center gap-4">
                     <div className="h-14 w-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-primary-100">
                        {patient.name.charAt(0)}
                     </div>
                     <div>
                        <h2 className="text-2xl font-black text-clinical-900 leading-tight">{patient.name}</h2>
                        <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest mt-1">
                           Control Obstétrico • HC: {patient.hc} • {patient.age} Años
                        </p>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-2xl bg-clinical-50 border border-clinical-100 flex flex-col items-center">
                     <span className="text-[9px] font-black text-clinical-400 uppercase tracking-tighter">Estado Gestacional</span>
                     <span className="text-sm font-black text-primary-600 uppercase tracking-widest">Embarazo Activo</span>
                  </div>
                  <Button variant="primary" className="h-12 px-6 rounded-2xl shadow-xl shadow-primary-100 font-bold">
                     <Plus className="h-4 w-4 mr-2" /> Nuevo Control
                  </Button>
               </div>
            </div>

            {/* Rapid Stats Bar */}
            <div className="bg-clinical-50/30 border-t border-clinical-100">
               <div className="max-w-7xl mx-auto px-10 py-3 flex items-center gap-12">
                  <HeaderStat label="Edad Gestacional" value={patient.eg} subValue="Semanas" icon={<TrendingUp className="h-4 w-4 text-primary-500" />} />
                  <div className="w-px h-8 bg-clinical-200" />
                  <HeaderStat label="F.P.P. Estimada" value={patient.fpp} subValue="128 días faltantes" icon={<Calendar className="h-4 w-4 text-indigo-500" />} />
                  <div className="w-px h-8 bg-clinical-200" />
                  <HeaderStat label="Trimestre" value={patient.trimestre} subValue="Evolución normal" icon={<Baby className="h-4 w-4 text-purple-500" />} />
                  <div className="w-px h-8 bg-clinical-200" />
                  <HeaderStat label="Riesgo Obstétrico" value={patient.risk} subValue="Bajo Riesgo" icon={<AlertTriangle className="h-4 w-4 text-emerald-500" />} />

                  <div className="ml-auto flex gap-2">
                     <Badge label={patient.bloodType} color="rose" />
                     <Badge label={`Alergias: ${patient.allergies}`} color="amber" />
                  </div>
               </div>
            </div>
         </header>

         {/* Tabs Navigation */}
         <nav className="bg-white border-b border-clinical-100 sticky top-[125px] z-40">
            <div className="max-w-7xl mx-auto px-6 flex gap-1">
               {TABS.map(tab => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                           "flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all relative",
                           isActive ? "text-primary-600" : "text-clinical-400 hover:text-clinical-900 hover:bg-clinical-50/50"
                        )}
                     >
                        <Icon className={cn("h-4 w-4", isActive ? "text-primary-600" : "text-clinical-300")} />
                        {tab.label}
                        {isActive && <motion.div layoutId="activeTabObs" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-t-full shadow-lg" />}
                     </button>
                  )
               })}
            </div>
         </nav>

         {/* Main Content Area */}
         <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
            <AnimatePresence mode="wait">
               <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
               >
                  {activeTab === 'resumen' && <ResumenTab />}
                  {activeTab === 'controles' && <ControlesTab />}
                  {activeTab === 'alertas' && <AlertasTab />}
                  {/* Other tabs will be added or summarized */}
               </motion.div>
            </AnimatePresence>
         </main>
      </div>
   )
}

/* ==================================================
   TAB COMPONENTS
   ================================================== */

function ResumenTab() {
   return (
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
         <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-6">
               <InfoCard title="Semana Gestacional" value="24.2" sub="Semanas" icon={<TrendingUp />} />
               <InfoCard title="Peso Actual" value="68.5" sub="Kilogramos" icon={<Activity />} />
               <InfoCard title="Presión Arterial" value="110/70" sub="mmHg" icon={<Heart />} />
            </div>

            {/* Timeline Prenatal */}
            <section className="bg-white rounded-[2.5rem] p-10 border border-clinical-100 shadow-premium">
               <div className="flex items-center gap-3 mb-8">
                  <div className="h-10 w-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center"><History className="h-5 w-5" /></div>
                  <h3 className="text-xl font-black text-clinical-900 tracking-tight">Timeline Obstétrico</h3>
               </div>

               <div className="relative space-y-12 before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-primary-100">
                  <TimelineItem
                     week="12"
                     title="Control Primer Trimestre"
                     date="15 Feb 2026"
                     events={["Ecografía de tamizaje realizada", "Vitaminas prenatales prescritas", "Laboratorios normales"]}
                     status="completed"
                  />
                  <TimelineItem
                     week="20"
                     title="Control Morfológico"
                     date="10 Abr 2026"
                     events={["Ecografía morfológica realizada", "Anatomía fetal normal", "Presión arterial estable"]}
                     status="completed"
                  />
                  <TimelineItem
                     week="24"
                     title="Control de Seguimiento"
                     date="Hoy"
                     events={["Peso: +2.5kg acumulado", "Frecuencia Cardíaca Fetal: 145 lpm"]}
                     status="current"
                  />
                  <TimelineItem
                     week="28"
                     title="Próximo Hito: Curva Glucosa"
                     date="Próximamente"
                     events={["Test de O'Sullivan pendiente"]}
                     status="upcoming"
                  />
               </div>
            </section>
         </div>

         {/* Sidebar: Obstetric Calendar */}
         <aside className="space-y-8">
            <section className="bg-white rounded-[2.5rem] p-8 border border-clinical-100 shadow-premium flex flex-col items-center">
               <h3 className="text-sm font-black text-clinical-900 uppercase tracking-widest mb-6">Calendario Obstétrico</h3>
               <ObstetricCalendar />
            </section>

            <section className="bg-primary-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-primary-100">
               <div className="absolute top-0 right-0 p-8 opacity-10"><Baby className="h-24 w-24" /></div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-primary-100">Próximo Hito Importante</p>
               <h4 className="text-2xl font-black tracking-tight leading-tight mb-2">Ecografía Morfológica</h4>
               <p className="text-xs text-primary-100/70 mb-6">Programada para la semana 24 de gestación.</p>
               <button className="px-6 py-3 rounded-2xl bg-white text-primary-700 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary-50 transition-all">
                  Ver Detalles <ChevronRight className="h-4 w-4" />
               </button>
            </section>
         </aside>
      </div>
   )
}

function ControlesTab() {
   return (
      <div className="bg-white rounded-[2.5rem] p-10 border border-clinical-100 shadow-premium">
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><ClipboardList className="h-5 w-5" /></div>
               <h3 className="text-xl font-black text-clinical-900 tracking-tight">Historial de Controles</h3>
            </div>
            <Button variant="primary" className="h-10 px-6 rounded-xl shadow-lg">
               <Plus className="h-4 w-4 mr-2" /> Agregar Control
            </Button>
         </div>

         <div className="space-y-4">
            <ControlRecordRow date="10 May 2026" eg="24.2" weight="68.5" tension="110/70" fcf="145" au="24" />
            <ControlRecordRow date="12 Abr 2026" eg="20.1" weight="66.0" tension="115/75" fcf="142" au="20" />
            <ControlRecordRow date="15 Mar 2026" eg="16.3" weight="64.5" tension="120/80" fcf="150" au="16" />
         </div>
      </div>
   )
}

function AlertasTab() {
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <AlertCard title="Exámenes Pendientes" message="Curva de glucosa (Semana 24-28)" status="warning" />
         <AlertCard title="Riesgo Preeclampsia" message="Normal (Última TA estable)" status="success" />
         <AlertCard title="Vitaminas" message="Suplemento de Hierro - En curso" status="info" />
         <AlertCard title="Control Atrasado" message="Ninguno - Al día" status="success" />
      </div>
   )
}

/* ==================================================
   HELPERS & SUB-COMPONENTS
   ================================================== */

function HeaderStat({ label, value, subValue, icon }: any) {
   return (
      <div className="flex items-center gap-3">
         <div className="h-10 w-10 rounded-xl bg-white border border-clinical-100 flex items-center justify-center shadow-sm shrink-0">
            {icon}
         </div>
         <div className="flex flex-col">
            <span className="text-[9px] font-black text-clinical-400 uppercase tracking-widest leading-none mb-1.5">{label}</span>
            <span className="text-sm font-black text-clinical-900 leading-none">{value} <span className="text-[10px] text-clinical-400 font-bold ml-0.5 tracking-tight">{subValue}</span></span>
         </div>
      </div>
   )
}

function Badge({ label, color }: any) {
   const colors = {
      rose: 'bg-rose-50 text-rose-600 border-rose-100',
      amber: 'bg-amber-50 text-amber-600 border-amber-100',
      primary: 'bg-primary-50 text-primary-600 border-primary-100',
   }
   return (
      <span className={cn("px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest", colors[color as keyof typeof colors])}>
         {label}
      </span>
   )
}

function InfoCard({ title, value, sub, icon }: any) {
   return (
      <div className="bg-white p-6 rounded-[2rem] border border-clinical-100 shadow-premium group hover:border-primary-200 transition-all">
         <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
            {icon}
         </div>
         <p className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-1">{title}</p>
         <p className="text-2xl font-black text-clinical-900">{value} <span className="text-xs text-clinical-400 font-bold">{sub}</span></p>
      </div>
   )
}

function TimelineItem({ week, title, date, events, status }: any) {
   const colors = {
      completed: 'bg-emerald-500 shadow-emerald-100',
      current: 'bg-primary-600 shadow-primary-200 animate-pulse',
      upcoming: 'bg-clinical-200 shadow-none'
   }
   return (
      <div className="flex gap-8 group">
         <div className="relative">
            <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center text-white font-black text-xs z-10 relative shadow-lg", colors[status as keyof typeof colors])}>
               {week}
            </div>
         </div>
         <div className="flex-1 pb-4">
            <div className="flex items-center justify-between mb-2">
               <h4 className={cn("font-black text-sm tracking-tight", status === 'upcoming' ? 'text-clinical-400' : 'text-clinical-900')}>{title}</h4>
               <span className="text-[10px] font-bold text-clinical-400 uppercase">{date}</span>
            </div>
            <ul className="space-y-1.5">
               {events.map((e: any, i: any) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-medium text-clinical-500">
                     <div className={cn("h-1 w-1 rounded-full", status === 'upcoming' ? 'bg-clinical-200' : 'bg-primary-400')} />
                     {e}
                  </li>
               ))}
            </ul>
         </div>
      </div>
   )
}

function ObstetricCalendar() {
   const days = Array.from({ length: 31 })
   return (
      <div className="w-full max-w-[300px]">
         <div className="grid grid-cols-7 gap-1 mb-4">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => <div key={d} className="text-[9px] font-black text-clinical-300 text-center uppercase">{d}</div>)}
         </div>
         <div className="grid grid-cols-7 gap-1">
            {days.map((_, i) => (
               <div key={i} className={cn(
                  "h-9 w-9 flex items-center justify-center rounded-xl text-[11px] font-black border transition-all cursor-pointer",
                  i === 15 ? "bg-primary-600 text-white shadow-lg border-primary-500 scale-110" : "bg-white text-clinical-800 border-clinical-50 hover:border-primary-200"
               )}>
                  {i + 1}
               </div>
            ))}
         </div>
         <div className="mt-8 space-y-3">
            <LegendItem color="bg-primary-500" label="Próximo Control" />
            <LegendItem color="bg-emerald-500" label="Eco Realizada" />
            <LegendItem color="bg-amber-500" label="Laboratorio" />
         </div>
      </div>
   )
}

function LegendItem({ color, label }: any) {
   return <div className="flex items-center gap-2"><div className={cn("h-2 w-2 rounded-full", color)} /><span className="text-[10px] font-black text-clinical-400 uppercase tracking-widest">{label}</span></div>
}

function ControlRecordRow({ date, eg, weight, tension, fcf, au }: any) {
   return (
      <div className="p-6 rounded-2xl bg-clinical-50/50 border border-clinical-100 flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all">
         <div className="flex items-center gap-8">
            <div className="text-center">
               <p className="text-sm font-black text-clinical-900">{date}</p>
               <p className="text-[9px] font-bold text-primary-500 uppercase tracking-widest mt-0.5">S- {eg}</p>
            </div>
            <div className="grid grid-cols-4 gap-8">
               <SmallStat label="Peso" value={`${weight} kg`} />
               <SmallStat label="Tensión" value={tension} />
               <SmallStat label="FCF" value={`${fcf} lpm`} />
               <SmallStat label="AU" value={`${au} cm`} />
            </div>
         </div>
         <div className="flex gap-2">
            <button className="h-9 w-9 rounded-xl bg-white text-clinical-400 border border-clinical-100 flex items-center justify-center hover:text-primary-600 hover:border-primary-200 shadow-sm"><Eye className="h-4 w-4" /></button>
            <button className="h-9 w-9 rounded-xl bg-white text-clinical-400 border border-clinical-100 flex items-center justify-center hover:text-indigo-600 hover:border-indigo-200 shadow-sm"><Printer className="h-4 w-4" /></button>
         </div>
      </div>
   )
}

function SmallStat({ label, value }: any) {
   return (
      <div className="flex flex-col">
         <span className="text-[8px] font-black text-clinical-400 uppercase tracking-widest mb-1">{label}</span>
         <span className="text-xs font-black text-clinical-700">{value}</span>
      </div>
   )
}

function AlertCard({ title, message, status }: any) {
   const styles = {
      success: 'bg-emerald-50 border-emerald-100 text-emerald-800',
      warning: 'bg-amber-50 border-amber-100 text-amber-800',
      rose: 'bg-rose-50 border-rose-100 text-rose-800',
      info: 'bg-primary-50 border-primary-100 text-primary-800'
   }
   return (
      <div className={cn("p-6 rounded-[2rem] border flex flex-col gap-2", styles[status as keyof typeof styles])}>
         <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-widest">{title}</h4>
            <AlertCircle className="h-4 w-4 opacity-50" />
         </div>
         <p className="text-sm font-medium leading-relaxed">{message}</p>
      </div>
   )
}
