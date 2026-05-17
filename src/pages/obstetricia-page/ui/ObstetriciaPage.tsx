import { useState, useMemo, cloneElement } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Users, 
  Calendar, 
  AlertTriangle, 
  Baby, 
  Search, 
  Filter,
  ChevronRight,
  Stethoscope,
  Heart,
  Activity,
  FileText,
  Clock,
  History,
  TrendingUp,
  ClipboardList
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/widgets/button'
import { useNavigate } from 'react-router-dom'

/* ==================================================
   TYPES & CONSTANTS
   ================================================== */

type ObstetricRisk = 'Normal' | 'Riesgo moderado' | 'Alto riesgo' | 'Próximo parto'

interface PregnantPatient {
  id: string
  name: string
  age: string
  eg: string // Edad Gestacional (Semanas)
  fpp: string // Fecha Probable Parto
  lastControl: string
  nextControl: string
  risk: ObstetricRisk
  status: string
  doctor: string
}

const MOCK_PREGNANT: PregnantPatient[] = [
  { id: '1', name: 'Ana García López', age: '28', eg: '24.2', fpp: '12 Sep 2026', lastControl: '10 May', nextControl: '16 May', risk: 'Normal', status: 'Activo', doctor: 'Dra. Ana García' },
  { id: '2', name: 'María Rodríguez', age: '32', eg: '12.5', fpp: '05 Dic 2026', lastControl: '02 May', nextControl: '30 May', risk: 'Riesgo moderado', status: 'Activo', doctor: 'Dra. Ana García' },
  { id: '3', name: 'Carla Méndez', age: '25', eg: '36.1', fpp: '20 Jun 2026', lastControl: '12 May', nextControl: '19 May', risk: 'Próximo parto', status: 'Activo', doctor: 'Dr. Wilson Mora' },
  { id: '4', name: 'Lucía Fernández', age: '30', eg: '18.4', fpp: '22 Oct 2026', lastControl: '05 May', nextControl: '03 Jun', risk: 'Alto riesgo', status: 'Crítico', doctor: 'Dra. Sofía Ruiz' },
]

const RISK_COLORS: Record<ObstetricRisk, { bg: string, text: string, border: string }> = {
  'Normal': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
  'Riesgo moderado': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
  'Alto riesgo': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100' },
  'Próximo parto': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

/* ==================================================
   MAIN COMPONENT
   ================================================== */

export function ObstetriciaPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-dvh bg-clinical-50/50">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="mx-auto max-w-7xl px-6 py-10">
        
        {/* Header Section */}
        <motion.header variants={itemVariants} className="flex flex-col gap-6 mb-10 sm:flex-row sm:items-end sm:justify-between">
           <div>
              <div className="flex items-center gap-2 mb-2">
                 <div className="h-2 w-12 bg-primary-500 rounded-full" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600/70">Módulo de Seguimiento</span>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-clinical-900 mb-2">Control <span className="text-primary-700">Obstétrico</span></h1>
              <p className="text-sm text-clinical-800/60 max-w-md">Monitoreo prenatal y evolución gestacional de pacientes activas.</p>
           </div>
           <div className="flex items-center gap-3">
              <Button variant="primary" className="shadow-lg shadow-primary-200 h-12 rounded-2xl px-6">
                 <Plus className="h-5 w-5 mr-2" /> Nuevo Control
              </Button>
           </div>
        </motion.header>

        {/* Quick Actions / Dashboard Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
           <QuickStatCard icon={<Baby className="h-6 w-6" />} label="Pacientes Embarazadas" value="24" color="primary" />
           <QuickStatCard icon={<ClipboardList className="h-6 w-6" />} label="Controles de Hoy" value="8" color="indigo" />
           <QuickStatCard icon={<AlertTriangle className="h-6 w-6" />} label="Alertas de Riesgo" value="3" color="rose" />
           <QuickStatCard icon={<Calendar className="h-6 w-6" />} label="Calendario Prenatal" value="Ver" color="clinical" isAction />
        </motion.div>

        {/* Filters Bar */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center">
           <div className="relative flex-1 max-w-md group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-300 group-focus-within:text-primary-500 transition-colors">
                 <Search className="h-4 w-4" />
              </span>
              <input 
                type="text" 
                placeholder="Buscar paciente embarazada..." 
                className="w-full h-12 rounded-2xl border-0 bg-white pl-11 pr-4 text-sm shadow-premium ring-1 ring-inset ring-primary-100/50 focus:ring-2 focus:ring-primary-500 outline-none font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           <div className="flex gap-3">
              <FilterButton icon={<Filter className="h-4 w-4" />} label="Filtrar por Riesgo" />
              <FilterButton icon={<Users className="h-4 w-4" />} label="Especialista" />
           </div>
        </motion.div>

        {/* Patients List */}
        <div className="space-y-4">
           {MOCK_PREGNANT.map((patient) => (
             <PregnantPatientRow 
               key={patient.id} 
               patient={patient} 
               onClick={() => navigate(`/control-obstetrico/${patient.id}`)}
             />
           ))}
        </div>

      </motion.div>
    </div>
  )
}

/* ==================================================
   SUB-COMPONENTS
   ================================================== */

function QuickStatCard({ icon, label, value, color, isAction = false }: any) {
  const colorMap = {
    primary: { icon: 'bg-primary-50 text-primary-600', accent: 'border-l-primary-500' },
    indigo: { icon: 'bg-indigo-50 text-indigo-600', accent: 'border-l-indigo-500' },
    rose: { icon: 'bg-rose-50 text-rose-600', accent: 'border-l-rose-500' },
    clinical: { icon: 'bg-clinical-50 text-clinical-400', accent: 'border-l-clinical-200' }
  }
  
  const theme = colorMap[color as keyof typeof colorMap]

  return (
    <motion.div 
      whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
      className={cn(
        "p-5 rounded-2xl flex items-center gap-4 cursor-pointer bg-white border border-clinical-100 shadow-sm transition-all h-20 border-l-4",
        theme.accent
      )}
    >
       <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm", theme.icon)}>
          {icon}
       </div>
       <div className="text-left min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.1em] mb-0.5 truncate text-clinical-400">{label}</p>
          <p className="text-lg font-black tracking-tight text-clinical-900">{value}</p>
       </div>
    </motion.div>
  )
}

function FilterButton({ icon, label }: any) {
  return (
    <button className="flex items-center gap-2 px-5 h-12 rounded-2xl bg-white shadow-premium border border-primary-100/50 text-[10px] font-black uppercase tracking-widest text-clinical-600 hover:border-primary-500 hover:text-primary-600 transition-all">
       {icon} {label}
    </button>
  )
}

function PregnantPatientRow({ patient, onClick }: { patient: PregnantPatient, onClick: () => void }) {
  const risk = RISK_COLORS[patient.risk]
  
  return (
    <motion.div 
      variants={itemVariants}
      onClick={onClick}
      className="bg-white p-5 rounded-[2rem] border border-primary-100/30 shadow-premium hover:shadow-xl transition-all cursor-pointer group flex items-center gap-8"
    >
       {/* Identity */}
       <div className="flex items-center gap-5 min-w-[300px]">
          <div className="h-14 w-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-black border border-white shadow-sm transition-transform group-hover:scale-105">
             {patient.name.charAt(0)}
          </div>
          <div>
             <h4 className="text-lg font-black text-clinical-900 leading-tight group-hover:text-primary-700 transition-colors">{patient.name}</h4>
             <p className="text-xs font-bold text-clinical-400 mt-1 uppercase tracking-widest">{patient.age} Años • HC-2026-0{patient.id}</p>
          </div>
       </div>

       {/* Obstetric Stats */}
       <div className="flex-1 grid grid-cols-4 gap-8">
          <StatBox label="Semana Gestacional" value={patient.eg} subValue="Semanas" icon={<TrendingUp className="h-3.5 w-3.5" />} />
          <StatBox label="Fecha Probable Parto" value={patient.fpp} subValue="Estimado" icon={<Calendar className="h-3.5 w-3.5" />} />
          <StatBox label="Siguiente Control" value={patient.nextControl} subValue="Confirmado" icon={<Clock className="h-3.5 w-3.5" />} />
          
          <div className="flex flex-col justify-center gap-1.5">
             <p className="text-[9px] font-black text-clinical-400 uppercase tracking-widest">Riesgo Obstétrico</p>
             <div className={cn("px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest w-fit", risk.bg, risk.text, risk.border)}>
                {patient.risk}
             </div>
          </div>
       </div>

       {/* Actions Indicator */}
       <div className="h-12 w-12 rounded-2xl bg-clinical-50 flex items-center justify-center text-clinical-300 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
          <ChevronRight className="h-6 w-6" />
       </div>
    </motion.div>
  )
}

function StatBox({ label, value, subValue, icon }: any) {
  return (
    <div className="flex flex-col justify-center">
       <p className="text-[9px] font-black text-clinical-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
          {icon} {label}
       </p>
       <p className="text-sm font-black text-clinical-900 leading-none">{value} <span className="text-[10px] text-clinical-400 ml-0.5">{subValue}</span></p>
    </div>
  )
}
