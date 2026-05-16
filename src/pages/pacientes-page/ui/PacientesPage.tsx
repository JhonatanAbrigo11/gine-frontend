import { useState, useEffect } from 'react'
import { useAuth } from '@/features/login/model/auth-context'
import { Button } from '@/widgets/button'
import { cn } from '@/shared/lib/cn'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { NewPatientModal } from '@/features/pacientes/ui/NewPatientModal'
import { pacienteService } from '@/entities/paciente/api/paciente.service'
import type { Patient } from '@/entities/paciente/model/types'
import { 
  Search, 
  Plus,
  Download,
  Filter, 
  Calendar, 
  Activity, 
  Clock, 
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ClipboardList,
  Stethoscope,
  Loader2
} from 'lucide-react'
import { ConfirmModal } from '@/shared/ui/ConfirmModal'
import { useToast } from '@/shared/ui/ToastContext'
import { ROUTES } from '@/shared/config/routes'

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
  const { showToast } = useToast()
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const data = await pacienteService.getAll()
      setPatients(data)
      setError(null)
    } catch (err) {
      setError('Error al cargar las pacientes. Por favor intente de nuevo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient)
    setIsNewPatientModalOpen(true)
  }

  const handleAddNew = () => {
    setEditingPatient(null)
    setIsNewPatientModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return
    
    try {
      setIsDeleting(true)
      await pacienteService.delete(patientToDelete)
      setPatients(prev => prev.filter(p => p.id !== patientToDelete))
      showToast('Paciente eliminada correctamente', 'success')
    } catch (err) {
      showToast('Error al eliminar la paciente', 'error')
    } finally {
      setIsDeleting(false)
      setPatientToDelete(null)
    }
  }

  const filteredPatients = patients.filter(p => 
    `${p.nombres} ${p.apellidos}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.numeroDocumento.includes(searchQuery) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
              Administre el historial clínico y seguimiento de sus <span className="font-semibold text-primary-700">{patients.length}</span> pacientes activas.
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
              onClick={handleAddNew}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Paciente
            </Button>
          </div>
        </motion.header>

        <NewPatientModal 
          isOpen={isNewPatientModalOpen} 
          patient={editingPatient}
          onClose={() => {
            setIsNewPatientModalOpen(false)
            setEditingPatient(null)
            fetchPatients() // Refresh after add/edit
          }} 
        />

        <ConfirmModal
          isOpen={!!patientToDelete}
          onClose={() => setPatientToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title="Eliminar Paciente"
          message="¿Está segura de que desea eliminar este registro? Esta acción no se puede deshacer y se borrará todo el historial clínico asociado."
          confirmText="Eliminar permanentemente"
          isLoading={isDeleting}
        />

        <motion.div variants={itemVariants} className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-300">
                <Search className="h-4 w-4" />
             </span>
             <input 
               type="text" 
               placeholder="Buscar por nombre, documento o correo..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
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

        <motion.div variants={itemVariants} className="glass-card rounded-[2rem] overflow-hidden border border-white min-h-[400px] flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-primary-600 gap-3">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm font-medium">Cargando pacientes...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center text-rose-500 gap-3">
              <Activity className="h-8 w-8" />
              <p className="text-sm font-medium">{error}</p>
              <Button variant="secondary" onClick={fetchPatients} className="mt-2">Reintentar</Button>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-clinical-400 gap-3">
              <ClipboardList className="h-12 w-12 opacity-20" />
              <p className="text-sm font-medium">No se encontraron pacientes.</p>
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse min-w-[1000px] lg:min-w-0">
                <thead>
                  <tr className="bg-primary-50/30 text-[11px] font-bold uppercase tracking-wider text-primary-900/60">
                    <th className="px-6 py-5 font-display">Información de la Paciente</th>
                    <th className="px-4 py-5 font-display">Documento</th>
                    <th className="px-4 py-5 font-display">Teléfono</th>
                    <th className="px-4 py-5 font-display">G / P / A / C</th>
                    <th className="px-4 py-5 font-display">Registro</th>
                    <th className="px-6 py-5 font-display">Estatus</th>
                    <th className="px-6 py-5 text-center font-display">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-100/30 bg-white/40">
                  {filteredPatients.map((patient) => (
                    <motion.tr 
                      key={patient.id} 
                      variants={itemVariants}
                      className="hover:bg-primary-50/40 transition-all duration-300 group cursor-pointer"
                      onClick={() => {
                        const targetId = patient.numeroDocumento || patient.id
                        navigate(ROUTES.pacienteFicha.replace(':id', targetId))
                      }}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 flex shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 text-xs font-bold border border-white shadow-sm transition-transform group-hover:scale-110">
                            {patient.nombres[0]}{patient.apellidos[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-clinical-900 truncate group-hover:text-primary-700 transition-colors">
                              {patient.nombres} {patient.apellidos}
                            </p>
                            <p className="text-[11px] text-clinical-800/50 flex items-center gap-1 mt-0.5">
                              <span className="h-1 w-1 rounded-full bg-primary-300" />
                              {patient.email || 'Sin correo'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5 text-sm font-medium text-clinical-800">{patient.numeroDocumento}</td>
                      <td className="px-4 py-5 text-sm text-clinical-800/70">
                         <div className="flex items-center gap-1.5">
                            {patient.telefono || '—'}
                         </div>
                      </td>
                      <td className="px-4 py-5">
                        <span className="inline-flex px-2 py-1 text-[10px] font-bold bg-clinical-100 text-clinical-800 rounded-lg border border-clinical-200/50">
                          G{patient.gestas} P{patient.partos} A{patient.abortos} C{patient.cesareas}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                         <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-clinical-800/60">
                           <Calendar className="h-3 w-3" />
                           {new Date(patient.fechaRegistro).toLocaleDateString()}
                         </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[11px] font-bold text-primary-900/80">
                            {patient.vidaSexualActiva === 'Sí' ? 'Activa' : 'Seguimiento'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex justify-center gap-1">
                           <button 
                             onClick={(e) => {
                               e.stopPropagation()
                               const targetId = patient.numeroDocumento || patient.id
                               navigate(ROUTES.nuevaConsulta.replace(':id', targetId))
                             }}
                             className="h-9 w-9 flex items-center justify-center text-clinical-800/40 hover:text-emerald-600 transition-all rounded-xl hover:bg-emerald-50" 
                             title="Nueva Consulta"
                           >
                              <Stethoscope className="h-4 w-4" />
                           </button>
                           <button 
                             onClick={(e) => {
                               e.stopPropagation()
                               const targetId = patient.numeroDocumento || patient.id
                               navigate(ROUTES.pacienteFicha.replace(':id', targetId))
                             }}
                             className="h-9 w-9 flex items-center justify-center text-clinical-800/40 hover:text-primary-700 transition-all rounded-xl hover:bg-white hover:shadow-premium" 
                             title="Expediente Completo"
                           >
                              <ClipboardList className="h-4 w-4" />
                           </button>
                           <button 
                             onClick={(e) => {
                               e.stopPropagation()
                               handleEdit(patient)
                             }}
                             className="h-9 w-9 flex items-center justify-center text-clinical-800/40 hover:text-primary-700 transition-all rounded-xl hover:bg-white hover:shadow-premium" 
                             title="Editar Paciente"
                           >
                              <Pencil className="h-4 w-4" />
                           </button>
                           <button 
                             onClick={(e) => {
                               e.stopPropagation()
                               setPatientToDelete(patient.id)
                             }}
                             className="h-9 w-9 flex items-center justify-center text-clinical-800/40 hover:text-rose-600 transition-all rounded-xl hover:bg-rose-50" 
                             title="Eliminar Registro"
                           >
                              <Trash2 className="h-4 w-4" />
                           </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-auto px-6 py-4 bg-primary-50/20 border-t border-primary-100/30 flex items-center justify-between">
             <p className="text-[10px] font-medium text-primary-900/40 italic">
               * Los datos mostrados son confidenciales y sujetos a normativas de salud.
             </p>
             <div className="flex gap-1">
                {[1].map(p => (
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

