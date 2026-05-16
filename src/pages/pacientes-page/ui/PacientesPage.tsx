import { useState } from 'react'
import { useAuth } from '@/features/login/model/auth-context'
import { Button } from '@/widgets/button'
import { cn } from '@/shared/lib/cn'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { NewPatientModal } from '@/features/pacientes/ui/NewPatientModal'
import { 
  Search, 
  UserPlus,
  Plus,
  Download,
  Filter, 
  Calendar, 
  Activity, 
  Clock, 
  FileText, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  ClipboardList
} from 'lucide-react'

const MOCK_PATIENTS = [
  {
    id: '1',
    name: 'Ana García López',
    email: 'ana.garcia@email.com',
    age: 28,
    fum: '12 Abr 2026',
    gpac: 'G1 P0 A0 C0',
    lastVisit: '10 May 2026',
    status: 'Control Prenatal',
    risk: 'Bajo',
  },
  {
    id: '2',
    name: 'María Rodriguez Solís',
    email: 'm.rodriguez@email.com',
    age: 35,
    fum: '01 May 2026',
    gpac: 'G3 P2 A0 C0',
    lastVisit: '14 May 2026',
    status: 'Post-parto',
    risk: 'Bajo',
  },
  {
    id: '3',
    name: 'Lucía Méndez Ruiz',
    email: 'lucia.m@email.com',
    age: 42,
    fum: 'N/A',
    gpac: 'G0 P0 A0 C0',
    lastVisit: '05 May 2026',
    status: 'Ginecología General',
    risk: 'Medio',
  },
  {
    id: '4',
    name: 'Elena Vázquez',
    email: 'elena.v@email.com',
    age: 31,
    fum: '20 Mar 2026',
    gpac: 'G2 P0 A1 C1',
    lastVisit: '12 May 2026',
    status: 'Embarazo Alto Riesgo',
    risk: 'Alto',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function PacientesPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false)

  return (
    <div className="min-h-dvh bg-clinical-50/50">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mx-auto max-w-7xl px-6 py-10"
      >
        <motion.header variants={itemVariants} className="flex flex-col gap-6 mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-12 bg-primary-500 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600/70">Panel de Gestión</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-clinical-900 mb-2">
              Pacientes <span className="text-primary-700">Registradas</span>
            </h1>
            <p className="text-sm text-clinical-800/60 max-w-md">
              Administre el historial clínico y seguimiento de sus <span className="font-semibold text-primary-700">{MOCK_PATIENTS.length}</span> pacientes activas.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="group" onClick={() => logout()}>
              <Download className="h-4 w-4 mr-2 text-primary-600 transition-transform group-hover:-translate-y-0.5" />
              Exportar
            </Button>
            <Button 
              variant="primary" 
              className="shadow-lg shadow-primary-200"
              onClick={() => setIsNewPatientModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Paciente
            </Button>
          </div>
        </motion.header>

        <NewPatientModal 
          isOpen={isNewPatientModalOpen} 
          onClose={() => setIsNewPatientModalOpen(false)} 
        />

        <motion.div variants={itemVariants} className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-300">
                <Search className="h-4 w-4" />
             </span>
             <input 
               type="text" 
               placeholder="Buscar por nombre, correo o ID..." 
               className="w-full h-11 rounded-2xl border-0 bg-white pl-11 pr-4 text-sm shadow-premium ring-1 ring-inset ring-primary-100/50 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
             />
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-4 h-11 rounded-2xl bg-white shadow-premium ring-1 ring-inset ring-primary-100/50">
                <Filter className="h-4 w-4 text-primary-400" />
                <select className="bg-transparent text-xs font-semibold text-clinical-800 outline-none cursor-pointer">
                   <option>Todos los Estados</option>
                   <option>Control Prenatal</option>
                   <option>Ginecología</option>
                </select>
             </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card rounded-[2rem] overflow-hidden border border-white">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px] lg:min-w-0">
              <thead>
                <tr className="bg-primary-50/30 text-[11px] font-bold uppercase tracking-wider text-primary-900/60">
                  <th className="px-6 py-5 font-display">Información de la Paciente</th>
                  <th className="px-4 py-5 font-display">Edad</th>
                  <th className="px-4 py-5 font-display">F.U.M.</th>
                  <th className="px-4 py-5 font-display">Protocolo G/P/A/C</th>
                  <th className="px-4 py-5 font-display">Última Visita</th>
                  <th className="px-6 py-5 font-display">Estatus & Riesgo</th>
                  <th className="px-6 py-5 text-center font-display">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100/30 bg-white/40">
                {MOCK_PATIENTS.map((patient, index) => (
                  <motion.tr 
                    key={patient.id} 
                    variants={itemVariants}
                    className="hover:bg-primary-50/40 transition-all duration-300 group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 text-xs font-bold border border-white shadow-sm transition-transform group-hover:scale-110">
                          {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-clinical-900 truncate group-hover:text-primary-700 transition-colors">
                            {patient.name}
                          </p>
                          <p className="text-[11px] text-clinical-800/50 flex items-center gap-1 mt-0.5">
                            <span className="h-1 w-1 rounded-full bg-primary-300" />
                            {patient.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5 text-sm font-medium text-clinical-800">{patient.age}</td>
                    <td className="px-4 py-5 text-sm text-clinical-800/70">
                      {patient.fum === 'N/A' ? (
                        <span className="text-clinical-800/30">—</span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-primary-400" />
                          {patient.fum}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-5">
                      <span className="inline-flex px-2 py-1 text-[10px] font-bold bg-clinical-100 text-clinical-800 rounded-lg border border-clinical-200/50">
                        {patient.gpac}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                       <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-clinical-800/60">
                         <Clock className="h-3 w-3" />
                         {patient.lastVisit}
                       </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-bold text-primary-900/80">
                          {patient.status}
                        </span>
                        <div className={cn(
                          "inline-flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-tighter",
                          patient.risk === 'Alto' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                          patient.risk === 'Medio' ? 'bg-amber-50 border-amber-100 text-amber-600' : 
                          'bg-emerald-50 border-emerald-100 text-emerald-600'
                        )}>
                          <Activity className="h-2.5 w-2.5" />
                          Riesgo {patient.risk}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex justify-center gap-1">
                         <button 
                           onClick={() => navigate(`/pacientes/${patient.id}`)}
                           className="h-9 w-9 flex items-center justify-center text-clinical-800/40 hover:text-primary-700 transition-all rounded-xl hover:bg-white hover:shadow-premium" 
                           title="Previsualizar"
                         >
                            <Eye className="h-4 w-4" />
                         </button>
                         <button className="h-9 w-9 flex items-center justify-center text-clinical-800/40 hover:text-primary-700 transition-all rounded-xl hover:bg-white hover:shadow-premium" title="Expediente Completo">
                            <ClipboardList className="h-4 w-4" />
                         </button>
                         <button className="h-9 w-9 flex items-center justify-center text-clinical-800/40 hover:text-primary-700 transition-all rounded-xl hover:bg-white hover:shadow-premium" title="Editar Paciente">
                            <Pencil className="h-4 w-4" />
                         </button>
                         <button className="h-9 w-9 flex items-center justify-center text-clinical-800/40 hover:text-rose-600 transition-all rounded-xl hover:bg-rose-50" title="Eliminar Registro">
                            <Trash2 className="h-4 w-4" />
                         </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-primary-50/20 border-t border-primary-100/30 flex items-center justify-between">
             <p className="text-[10px] font-medium text-primary-900/40 italic">
               * Los datos mostrados son confidenciales y sujetos a normativas de salud.
             </p>
             <div className="flex gap-1">
                {[1, 2, 3].map(p => (
                  <button key={p} className={cn(
                    "h-6 w-6 rounded-md text-[10px] font-bold transition-all",
                    p === 1 ? "bg-primary-600 text-white shadow-sm" : "text-primary-400 hover:bg-primary-100"
                  )}>
                    {p}
                  </button>
                ))}
             </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
