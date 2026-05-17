import { useEffect, useState } from 'react'
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
  ClipboardList,
  Loader2,
  Trash2
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/widgets/button'
import { PatientSearchModal } from './organisms/PatientSearchModal'
import { consultationService } from '@/modules/consultations/services/consultation.service'
import { useNavigate } from 'react-router-dom'
import { ConfirmModal } from '@/shared/ui/ConfirmModal'
import { toast } from 'sonner'

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
  const navigate = useNavigate()
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [consultas, setConsultas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Delete state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [consultationToDelete, setConsultationToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        setLoading(true)
        const data = await consultationService.getAll()
        setConsultas(data)
      } catch (error) {
        console.error('Error fetching consultations:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchConsultas()
  }, [isSearchModalOpen]) // Refetch after modal might have created one

  const handleDelete = async () => {
    if (!consultationToDelete) return
    
    try {
      setIsDeleting(true)
      await consultationService.delete(consultationToDelete)
      toast.success('Consulta eliminada exitosamente')
      setConsultas(consultas.filter(c => c.id !== consultationToDelete))
    } catch (error) {
      console.error('Error deleting consultation:', error)
      toast.error('No se pudo eliminar la consulta')
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
      setConsultationToDelete(null)
    }
  }

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
              <Plus className="mr-2 h-5 w-5" />
              Nueva Consulta
            </Button>
          </div>
        </motion.header>

        {/* Filters/Search */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
           <div className="md:col-span-8 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-clinical-400 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar por paciente, motivo o diagnóstico..." 
                className="w-full h-14 pl-12 pr-6 rounded-2xl bg-white border border-clinical-100 shadow-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium text-clinical-900"
              />
           </div>
           <div className="md:col-span-2">
              <button className="w-full h-14 bg-white border border-clinical-100 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-clinical-700 hover:bg-clinical-50 transition-all shadow-sm">
                 <Filter className="h-4 w-4" />
                 Filtros
              </button>
           </div>
           <div className="md:col-span-2">
              <button className="w-full h-14 bg-white border border-clinical-100 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-clinical-700 hover:bg-clinical-50 transition-all shadow-sm">
                 <Calendar className="h-4 w-4" />
                 Hoy
              </button>
           </div>
        </motion.div>

        {/* Consultations List */}
        <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] border border-clinical-100 shadow-premium overflow-hidden">
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
            </div>
          ) : consultas.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center text-clinical-400">
               <ClipboardList className="h-12 w-12 mb-4 opacity-20" />
               <p className="text-sm font-bold uppercase tracking-widest">No se encontraron consultas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-clinical-50 bg-clinical-50/30">
                    <th className="px-6 py-5 text-[10px] font-black text-clinical-400 uppercase tracking-widest">Paciente</th>
                    <th className="px-6 py-5 text-[10px] font-black text-clinical-400 uppercase tracking-widest">Tipo / Motivo</th>
                    <th className="px-6 py-5 text-[10px] font-black text-clinical-400 uppercase tracking-widest">Fecha</th>
                    <th className="px-6 py-5 text-[10px] font-black text-clinical-400 uppercase tracking-widest">Estado</th>
                    <th className="px-6 py-5 text-[10px] font-black text-clinical-400 uppercase tracking-widest text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-clinical-50">
                  {consultas.map((consulta) => (
                    <tr key={consulta.id} className="group hover:bg-clinical-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm">
                            {consulta.paciente.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-clinical-900 leading-none mb-1.5">{consulta.paciente}</p>
                            <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">{consulta.edad} años</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-clinical-900 leading-none mb-1.5">{consulta.tipo}</p>
                        <p className="text-[10px] font-medium text-clinical-500 truncate max-w-[200px]">{consulta.motivo}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-clinical-600">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="text-xs font-bold">{consulta.fecha}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border",
                          consulta.estado === 'Finalizada' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                        )}>
                          {consulta.estado}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 transition-all">
                          <button 
                            onClick={() => navigate(`/consultas/activa/${consulta.patientId}`, { state: { consultationId: consulta.id } })}
                            className="h-9 w-9 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-clinical-100 flex items-center justify-center text-clinical-400 hover:text-primary-600 transition-all"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="h-9 w-9 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-clinical-100 flex items-center justify-center text-clinical-400 hover:text-primary-600 transition-all">
                            <Printer className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setConsultationToDelete(consulta.id)
                              setIsDeleteModalOpen(true)
                            }}
                            className="h-9 w-9 rounded-xl hover:bg-rose-50 hover:shadow-sm border border-transparent hover:border-rose-100 flex items-center justify-center text-clinical-400 hover:text-rose-600 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>

      <PatientSearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setConsultationToDelete(null)
        }}
        onConfirm={handleDelete}
        title="Eliminar Consulta"
        message="¿Está seguro que desea eliminar este registro clínico? Esta acción no se puede deshacer y eliminará las órdenes vinculadas. El sistema recalculará automáticamente la fecha de última menstruación (F.U.M.) basada en el historial previo."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
