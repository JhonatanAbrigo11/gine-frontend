import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Plus, 
  Filter, 
  Calendar, 
  User, 
  FileText, 
  Printer, 
  Eye, 
  Pencil,
  ChevronRight,
  MoreVertical,
  Activity,
  ClipboardList
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button, composeButtonClassName } from '@/widgets/button'
import { PatientSearchModal } from './organisms/PatientSearchModal'

const MOCK_CONSULTAS = [
  {
    id: '1',
    fecha: '15 May 2026',
    paciente: 'Ana García López',
    edad: 28,
    tipo: 'Control Prenatal',
    motivo: 'Control rutinario 24 sem',
    diagnostico: 'Embarazo normoevolutivo',
    proximaCita: '12 Jun 2026',
    estado: 'Finalizada'
  },
  {
    id: '2',
    fecha: '14 May 2026',
    paciente: 'María Rodriguez Solís',
    edad: 35,
    tipo: 'Ginecología',
    motivo: 'Dolor pélvico',
    diagnostico: 'SOP en estudio',
    proximaCita: '20 May 2026',
    estado: 'Pendiente'
  },
  {
    id: '3',
    fecha: '14 May 2026',
    paciente: 'Lucía Méndez Ruiz',
    edad: 42,
    tipo: 'Obstetricia',
    motivo: 'Seguimiento post-parto',
    diagnostico: 'Recuperación favorable',
    proximaCita: '14 Jun 2026',
    estado: 'Finalizada'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function ConsultasPage() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  return (
    <div className="min-h-dvh bg-clinical-50/50">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mx-auto max-w-7xl px-6 py-10"
      >
        {/* Header */}
        <motion.header variants={itemVariants} className="flex flex-col gap-6 mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-12 bg-primary-500 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600/70">Módulo Clínico</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-clinical-900 mb-2">
              Gestión de <span className="text-primary-700">Consultas</span>
            </h1>
            <p className="text-sm text-clinical-800/60 max-w-md">
              Registro histórico y seguimiento de atenciones médicas especializadas.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="primary" 
              className="shadow-lg shadow-primary-200 h-12 px-6 rounded-2xl"
              onClick={() => setIsSearchModalOpen(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Nueva Consulta
            </Button>
          </div>
        </motion.header>

        {/* Filters & Search */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-clinical-400" />
            <input 
              type="text" 
              placeholder="Buscar paciente o motivo..."
              className="w-full h-12 pl-11 pr-4 bg-white rounded-2xl border-none shadow-sm ring-1 ring-clinical-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm transition-all"
            />
          </div>
          <select className="h-12 px-4 bg-white rounded-2xl border-none shadow-sm ring-1 ring-clinical-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm font-medium text-clinical-700 appearance-none">
            <option>Todos los tipos</option>
            <option>Ginecología</option>
            <option>Obstetricia</option>
            <option>Control Prenatal</option>
          </select>
          <select className="h-12 px-4 bg-white rounded-2xl border-none shadow-sm ring-1 ring-clinical-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm font-medium text-clinical-700 appearance-none">
            <option>Estado: Todos</option>
            <option>Finalizada</option>
            <option>Pendiente</option>
            <option>En Curso</option>
          </select>
          <div className="relative">
             <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-clinical-400" />
             <input type="date" className="w-full h-12 pl-11 pr-4 bg-white rounded-2xl border-none shadow-sm ring-1 ring-clinical-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
          </div>
        </motion.div>

        {/* Table Content */}
        <motion.div variants={itemVariants} className="bg-white rounded-[2rem] border border-clinical-100 shadow-xl shadow-clinical-900/5 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-clinical-50 text-[11px] font-bold uppercase tracking-wider text-clinical-500 border-b border-clinical-100">
                  <th className="px-6 py-5 font-display">Fecha</th>
                  <th className="px-6 py-5 font-display">Paciente</th>
                  <th className="px-4 py-5 font-display text-center">Edad</th>
                  <th className="px-6 py-5 font-display">Tipo</th>
                  <th className="px-6 py-5 font-display">Motivo</th>
                  <th className="px-6 py-5 font-display">Diagnóstico</th>
                  <th className="px-6 py-5 font-display text-center">Próxima Cita</th>
                  <th className="px-6 py-5 font-display text-center">Estado</th>
                  <th className="px-6 py-5 font-display text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clinical-50">
                {MOCK_CONSULTAS.map((consulta) => (
                  <tr key={consulta.id} className="hover:bg-primary-50/30 transition-all duration-200 group">
                    <td className="px-6 py-5 text-sm font-bold text-clinical-900">{consulta.fecha}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                           {consulta.paciente.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-clinical-900">{consulta.paciente}</span>
                      </div>
                    </td>
                    <td className="px-4 py-5 text-center text-sm font-medium text-clinical-600">{consulta.edad}</td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg">
                        {consulta.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-clinical-600 line-clamp-1 max-w-[150px]">{consulta.motivo}</td>
                    <td className="px-6 py-5 text-sm font-medium text-clinical-800">{consulta.diagnostico}</td>
                    <td className="px-6 py-5 text-center text-sm font-bold text-clinical-400">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {consulta.proximaCita}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        consulta.estado === 'Finalizada' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      )}>
                        <div className={cn("h-1.5 w-1.5 rounded-full", consulta.estado === 'Finalizada' ? "bg-emerald-500" : "bg-amber-500 animate-pulse")} />
                        {consulta.estado}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-1">
                        <ActionButton icon={<Eye className="h-4 w-4" />} title="Ver Consulta" />
                        <ActionButton icon={<Pencil className="h-4 w-4" />} title="Editar" />
                        <ActionButton icon={<ClipboardList className="h-4 w-4" />} title="Ficha Médica" />
                        <ActionButton icon={<Printer className="h-4 w-4" />} title="Imprimir" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      <PatientSearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />
    </div>
  )
}

function ActionButton({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <button className="h-9 w-9 flex items-center justify-center text-clinical-400 hover:text-primary-600 hover:bg-primary-50 transition-all rounded-xl" title={title}>
      {icon}
    </button>
  )
}
