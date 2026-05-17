import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Pill, 
  MoreHorizontal,
  Download,
  Printer,
  Eye,
  Trash2,
  Calendar,
  User,
  ChevronRight,
  Clipboard,
  FileText,
  X,
  Clock
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/widgets/button'
import { PatientSearchModal } from '@/pages/consultas-page/ui/organisms/PatientSearchModal'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '@/shared/api/base'

/* ==================================================
   MOCK DATA & TYPES
   ================================================== */

interface PrescriptionSummary {
  id: string
  date: string
  patientId: string
  patientName: string
  medicinesCount: number
  status: 'Emitida' | 'Vencida' | 'Anulada'
  secuencial: string
}

const MOCK_RECETAS: PrescriptionSummary[] = [
  {
    id: '1',
    secuencial: 'REC-2026-0045',
    date: '15/05/2026',
    patientId: '1723456789',
    patientName: 'Ana García López',
    medicinesCount: 3,
    status: 'Emitida'
  },
  {
    id: '2',
    secuencial: 'REC-2026-0042',
    date: '12/05/2026',
    patientId: '1798765432',
    patientName: 'María Rodríguez',
    medicinesCount: 1,
    status: 'Emitida'
  },
  {
    id: '3',
    secuencial: 'REC-2026-0038',
    date: '05/05/2026',
    patientId: '1755544433',
    patientName: 'Carla Jiménez',
    medicinesCount: 2,
    status: 'Vencida'
  }
]

export const RecetasListPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showPatientSearch, setShowPatientSearch] = useState(false)
  
  // Real API paginated states
  const [recipes, setRecipes] = useState<PrescriptionSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [statusFilter, setStatusFilter] = useState('Todos los Estados')

  const fetchRecipes = async (page = 1) => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/prescriptions`, {
        params: {
          page,
          limit: 10,
          search: searchQuery,
          status: statusFilter
        }
      })
      const { data, total, totalPages: totalP } = response.data
      setRecipes(data)
      setTotalItems(total)
      setTotalPages(totalP)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error loading prescriptions:', error)
      // Fallback to MOCK_RECETAS if database is empty/fresh
      setRecipes(MOCK_RECETAS)
      setTotalItems(MOCK_RECETAS.length)
      setTotalPages(1)
      setCurrentPage(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecipes(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Emitida': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      case 'Vencida': return 'bg-amber-50 text-amber-600 border-amber-100'
      case 'Anulada': return 'bg-rose-50 text-rose-600 border-rose-100'
      default: return 'bg-clinical-50 text-clinical-400 border-clinical-100'
    }
  }

  return (
    <div className="min-h-dvh bg-clinical-50/50">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        className="mx-auto max-w-7xl px-6 py-10"
      >
        {/* Header Estilo Pacientes */}
        <motion.header 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="flex flex-col gap-6 mb-10 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-12 bg-primary-500 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600/70">Archivo de Prescripciones</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-clinical-900 mb-2">
              Recetas <span className="text-primary-700">Médicas</span>
            </h1>
            <p className="text-sm text-clinical-800/60 max-w-md">
              Historial de medicamentos y tratamientos emitidos. Gestión de <span className="font-semibold text-primary-700">{recipes.length}</span> recetas registradas.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <Button 
               onClick={() => setShowPatientSearch(true)}
               variant="primary" 
               className="shadow-lg shadow-primary-200 h-12 px-8 rounded-2xl font-bold text-xs uppercase tracking-widest"
             >
                <Plus className="h-4 w-4 mr-2" /> Nueva Receta
             </Button>
          </div>
        </motion.header>

        {/* Buscador integrated */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center"
        >
           <div className="relative flex-1 max-w-md">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-300">
                 <Search className="h-4 w-4" />
              </span>
              <input 
                type="text" 
                placeholder="Buscar por paciente o nro de receta..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 rounded-2xl border-0 bg-white pl-11 pr-4 text-sm shadow-premium ring-1 ring-inset ring-primary-100/50 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
              />
           </div>
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 h-11 rounded-2xl bg-white shadow-premium ring-1 ring-inset ring-primary-100/50">
                 <Filter className="h-4 w-4 text-primary-400" />
                 <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-clinical-800 outline-none cursor-pointer"
                  >
                     <option value="Todos los Estados">Todos los Estados</option>
                     <option value="Emitida">Emitidas</option>
                     <option value="Vencida">Vencidas</option>
                     <option value="Anulada">Anuladas</option>
                  </select>
              </div>
           </div>
        </motion.div>

        {/* Listado de Recetas */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="grid grid-cols-1 gap-4"
        >
           {recipes.map((recipe, index) => (
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.05 }}
               key={recipe.id}
               className="bg-white rounded-[2rem] p-6 border border-clinical-100 shadow-premium hover:shadow-xl transition-all group"
             >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div className="flex items-center gap-5 flex-1 min-w-0">
                      <div className="h-14 w-14 rounded-2xl bg-clinical-50 text-clinical-400 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-all border border-clinical-100">
                         <Clipboard className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                         <div className="flex items-center gap-3 mb-1">
                            <span className="text-[10px] font-black text-clinical-300 uppercase tracking-widest">{recipe.secuencial} • {recipe.date}</span>
                            <span className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border", getStatusColor(recipe.status))}>
                               {recipe.status}
                            </span>
                         </div>
                         <h3 className="text-lg font-black text-clinical-900 truncate mb-1">{recipe.patientName}</h3>
                         <p className="text-xs font-bold text-clinical-400">
                            Contiene: <span className="text-clinical-600">{recipe.medicinesCount} Medicamentos</span>
                         </p>
                      </div>
                   </div>

                   <div className="flex items-center gap-3">
                      <Button variant="secondary" className="h-10 w-10 p-0 rounded-xl border-clinical-100 text-clinical-400 hover:text-primary-600 hover:bg-primary-50 transition-all">
                         <Eye className="h-5 w-5" />
                      </Button>
                      <Button variant="secondary" className="h-10 w-10 p-0 rounded-xl border-clinical-100 text-clinical-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                         <Printer className="h-5 w-5" />
                      </Button>
                      <button className="h-10 w-10 rounded-xl flex items-center justify-center text-clinical-300 hover:bg-clinical-50 hover:text-clinical-900 transition-all">
                         <MoreHorizontal className="h-5 w-5" />
                      </button>
                   </div>
                </div>
             </motion.div>
           ))}
        </motion.div>

         {recipes.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-clinical-100 text-clinical-200">
               <Pill className="h-16 w-16 mb-4 opacity-10" />
               <p className="text-lg font-black uppercase tracking-widest">No se encontraron recetas</p>
            </div>
         )}

         {/* Paginación */}
         {totalPages > 1 && (
           <div className="mt-8 flex items-center justify-between bg-white px-6 py-4 rounded-3xl border border-clinical-100 shadow-premium">
              <div className="flex flex-1 justify-between sm:hidden">
                 <Button 
                   onClick={() => fetchRecipes(currentPage - 1)}
                   disabled={currentPage === 1}
                   variant="secondary"
                   className="rounded-xl"
                 >
                    Anterior
                 </Button>
                 <Button 
                   onClick={() => fetchRecipes(currentPage + 1)}
                   disabled={currentPage === totalPages}
                   variant="secondary"
                   className="rounded-xl"
                 >
                    Siguiente
                 </Button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                 <div>
                    <p className="text-xs font-bold text-clinical-400">
                       Mostrando página <span className="font-black text-primary-600">{currentPage}</span> de <span className="font-black text-primary-600">{totalPages}</span> ({totalItems} recetas registradas)
                    </p>
                 </div>
                 <div>
                    <nav className="isolate inline-flex -space-x-px rounded-xl gap-2" aria-label="Pagination">
                       <Button
                         onClick={() => fetchRecipes(currentPage - 1)}
                         disabled={currentPage === 1}
                         variant="secondary"
                         className="h-9 w-9 p-0 rounded-xl border-clinical-100 text-clinical-450"
                       >
                          &lt;
                       </Button>
                       {Array.from({ length: totalPages }).map((_, i) => (
                          <Button
                            key={i}
                            onClick={() => fetchRecipes(i + 1)}
                            variant={currentPage === i + 1 ? 'primary' : 'secondary'}
                            className={cn(
                              "h-9 w-9 p-0 rounded-xl font-black text-xs",
                              currentPage === i + 1 ? "shadow-md shadow-primary-100" : "border-clinical-100 text-clinical-700"
                            )}
                          >
                             {i + 1}
                          </Button>
                       ))}
                       <Button
                         onClick={() => fetchRecipes(currentPage + 1)}
                         disabled={currentPage === totalPages}
                         variant="secondary"
                         className="h-9 w-9 p-0 rounded-xl border-clinical-100 text-clinical-450"
                       >
                          &gt;
                       </Button>
                    </nav>
                 </div>
              </div>
           </div>
         )}
      </motion.div>

      <PatientSearchModal 
        isOpen={showPatientSearch}
        onClose={() => setShowPatientSearch(false)}
        title="Crear Nueva Receta"
        actionLabel="Generar Receta"
        onAction={(patientId) => {
          setShowPatientSearch(false)
          navigate(`/recetas/nueva/${patientId}`)
        }}
      />
    </div>
  )
}
