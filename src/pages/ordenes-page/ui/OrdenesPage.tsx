import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  ClipboardList, 
  Beaker, 
  Activity, 
  Image as ImageIcon, 
  MoreHorizontal,
  Download,
  Printer,
  Eye,
  Trash2,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Stethoscope,
  X,
  FileUp,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/widgets/button'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { PatientSearchModal } from '@/pages/consultas-page/ui/organisms/PatientSearchModal'
import { useBusinessSettings } from '@/features/site-config/model/use-business-settings'

/* ==================================================
   TYPES & MOCK DATA
   ================================================== */

type OrderStatus = 'Pendiente' | 'En proceso' | 'Resultado subido' | 'Revisado' | 'Cancelado'
type OrderType = 'Laboratorio' | 'Ecografía' | 'Imagenología' | 'Perfil hormonal' | 'Monitoreo fetal' | 'Otros'

interface MedicalOrder {
  id: string
  date: string
  patientId: string
  patientName: string
  doctorName: string
  type: OrderType
  exams: string[]
  status: OrderStatus
  priority: 'Baja' | 'Media' | 'Alta'
  results?: string[] // URLs or filenames
}

const MOCK_ORDERS: MedicalOrder[] = [
  {
    id: 'ORD-2026-001',
    date: '15/05/2026',
    patientId: '1723456789',
    patientName: 'Ana García López',
    doctorName: 'Dra. Ana García',
    type: 'Laboratorio',
    exams: ['Hemograma completo', 'Glucosa', 'Toxoplasma'],
    status: 'Pendiente',
    priority: 'Media'
  },
  {
    id: 'ORD-2026-002',
    date: '14/05/2026',
    patientId: '1798765432',
    patientName: 'María Rodríguez',
    doctorName: 'Dra. Ana García',
    type: 'Ecografía',
    exams: ['Ecografía morfológica'],
    status: 'Resultado subido',
    priority: 'Alta',
    results: ['morfologica_result.pdf']
  },
  {
    id: 'ORD-2026-003',
    date: '12/05/2026',
    patientId: '1755544433',
    patientName: 'Carla Jiménez',
    doctorName: 'Dra. Ana García',
    type: 'Perfil hormonal',
    exams: ['Progesterona', 'Prolactina'],
    status: 'Revisado',
    priority: 'Media',
    results: ['perfil_hormonal.pdf']
  }
]

export const OrdenesPage: React.FC = () => {
  const { settings } = useBusinessSettings()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>('Todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [showPatientSearch, setShowPatientSearch] = useState(false)
  const [orders, setOrders] = useState<MedicalOrder[]>(MOCK_ORDERS)
  const [showPreview, setShowPreview] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const tabs = ['Todos', 'Pendientes', 'Completados', 'Laboratorios', 'Ecografías', 'Imágenes']

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pendiente': return 'bg-amber-50 text-amber-600 border-amber-100'
      case 'En proceso': return 'bg-primary-50 text-primary-600 border-primary-100'
      case 'Resultado subido': return 'bg-indigo-50 text-indigo-600 border-indigo-100'
      case 'Revisado': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      case 'Cancelado': return 'bg-rose-50 text-rose-600 border-rose-100'
      default: return 'bg-clinical-50 text-clinical-400 border-clinical-100'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.type.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === 'Todos') return matchesSearch
    if (activeTab === 'Pendientes') return matchesSearch && order.status === 'Pendiente'
    if (activeTab === 'Completados') return matchesSearch && (order.status === 'Resultado subido' || order.status === 'Revisado')
    if (activeTab === 'Laboratorios') return matchesSearch && order.type === 'Laboratorio'
    if (activeTab === 'Ecografías') return matchesSearch && order.type === 'Ecografía'
    if (activeTab === 'Imágenes') return matchesSearch && order.type === 'Imagenología'
    
    return matchesSearch
  })

  const generatePDF = (order: MedicalOrder) => {
    try {
      const doc = new jsPDF()
      
      // Header
      doc.setFillColor(2, 111, 199)
      doc.roundedRect(20, 15, 12, 12, 3, 3, 'F')
      doc.setTextColor(255)
      doc.setFontSize(10)
      doc.text('G', 26, 23, { align: 'center' })
      doc.setFontSize(16)
      doc.setTextColor(2, 111, 199)
      doc.setFont('helvetica', 'bold')
      doc.text(settings?.clinicName || 'GineCentro Premium', 35, 22)
      
      doc.setFontSize(8)
      doc.setTextColor(100)
      doc.setFont('helvetica', 'normal')
      doc.text(settings?.reportHeader || 'Ginecología y Obstetricia de Alta Especialidad', 35, 26)
      doc.text(settings?.address || 'Quito, Ecuador • Tel: (02) 2555-000', 20, 35)
      
      doc.setDrawColor(2, 111, 199)
      doc.setLineWidth(0.5)
      doc.line(20, 38, 190, 38)
      
      // Order Info
      doc.setFontSize(12)
      doc.setTextColor(0)
      doc.setFont('helvetica', 'bold')
      doc.text(`ORDEN DE ${order.type.toUpperCase()}`, 20, 48)
      doc.setFontSize(10)
      doc.text(`Nro: ${order.id}`, 190, 48, { align: 'right' })
      doc.setFont('helvetica', 'normal')
      doc.text(`Fecha: ${order.date}`, 20, 54)
      
      // Patient Box
      doc.setFillColor(245, 248, 252)
      doc.rect(20, 60, 170, 25, 'F')
      doc.setFont('helvetica', 'bold')
      doc.text('DATOS DEL PACIENTE', 25, 67)
      doc.setFont('helvetica', 'normal')
      doc.text(`Nombre: ${order.patientName}`, 25, 73)
      doc.text(`CI: 17XXXXXXX • HC: 2026-001`, 25, 79)
      
      // Exams Table
      const tableData = order.exams.map(e => [e, order.priority, 'Según protocolo'])
      
      autoTable(doc, {
        startY: 95,
        head: [['Examen Solicitado', 'Prioridad', 'Indicaciones']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [2, 111, 199], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 5 }
      })
      
      // Footer
      const finalY = (doc as any).lastAutoTable.finalY || 150
      doc.line(70, finalY + 40, 140, finalY + 40)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text(order.doctorName.toUpperCase(), 105, finalY + 46, { align: 'center' })

      const pdfString = doc.output('datauristring')
      setPdfUrl(pdfString)
      setShowPreview(true)
    } catch (e) {
      console.error(e)
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
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600/70">Centro de Gestión Médica</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-clinical-900 mb-2">
              Órdenes y <span className="text-primary-700">Exámenes</span>
            </h1>
            <p className="text-sm text-clinical-800/60 max-w-md">
              Administre laboratorios, ecografías y estudios clínicos. Seguimiento de <span className="font-semibold text-primary-700">{orders.length}</span> órdenes activas.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <Button 
               onClick={() => setShowPatientSearch(true)}
               variant="primary" 
               className="shadow-lg shadow-primary-200 h-12 px-8 rounded-2xl font-bold text-xs uppercase tracking-widest"
             >
                <Plus className="h-4 w-4 mr-2" /> Nueva Orden
             </Button>
          </div>
        </motion.header>

        {/* Filtros & Buscador integrated */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="space-y-6 mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-5 py-2.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all border shadow-sm",
                  activeTab === tab 
                    ? "bg-primary-600 border-primary-700 text-white shadow-lg shadow-primary-100" 
                    : "bg-white border-clinical-100 text-clinical-400 hover:border-primary-200 hover:text-primary-600"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
             <div className="relative flex-1 max-w-md">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-300">
                   <Search className="h-4 w-4" />
                </span>
                <input 
                  type="text" 
                  placeholder="Buscar por paciente, nro de orden o tipo..." 
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
                      <option>Pendientes</option>
                      <option>Completados</option>
                   </select>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Listado de Órdenes */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="grid grid-cols-1 gap-4"
        >
           {filteredOrders.map((order, index) => (
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.05 }}
               key={order.id}
               className="bg-white rounded-[2rem] p-6 border border-clinical-100 shadow-premium hover:shadow-xl transition-all group"
             >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div className="flex items-center gap-5 flex-1 min-w-0">
                      <div className="h-14 w-14 rounded-2xl bg-clinical-50 text-clinical-400 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-all border border-clinical-100">
                         {order.type === 'Laboratorio' ? <Beaker className="h-6 w-6" /> : 
                          order.type === 'Ecografía' ? <Activity className="h-6 w-6" /> : 
                          <ImageIcon className="h-6 w-6" />}
                      </div>
                      <div className="min-w-0">
                         <div className="flex items-center gap-3 mb-1">
                            <span className="text-[10px] font-black text-clinical-300 uppercase tracking-widest">{order.id} • {order.date}</span>
                            <span className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border", getStatusColor(order.status))}>
                               {order.status}
                            </span>
                            {order.priority === 'Alta' && (
                              <span className="px-2 py-1 rounded-lg bg-rose-50 text-rose-600 text-[9px] font-black uppercase tracking-widest border border-rose-100">Urgente</span>
                            )}
                         </div>
                         <h3 className="text-lg font-black text-clinical-900 truncate mb-1">{order.patientName}</h3>
                         <p className="text-xs font-bold text-clinical-400">
                            {order.type}: <span className="text-clinical-600">{order.exams.join(', ')}</span>
                         </p>
                      </div>
                   </div>

                   {/* Acciones */}
                    <div className="flex items-center gap-3">
                       <Button 
                         onClick={() => generatePDF(order)}
                         variant="secondary" 
                         className="h-10 w-10 p-0 rounded-xl border-clinical-100 text-clinical-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
                       >
                          <Eye className="h-5 w-5" />
                       </Button>
                      <Button variant="secondary" className="h-10 w-10 p-0 rounded-xl border-clinical-100 text-clinical-400 hover:text-indigo-600 hover:bg-indigo-50">
                         <Download className="h-5 w-5" />
                      </Button>
                      {order.status === 'Pendiente' ? (
                        <Button variant="primary" className="h-10 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md shadow-primary-100">
                           <Upload className="h-4 w-4 mr-2" /> Resultados
                        </Button>
                      ) : (
                        <Button variant="secondary" className="h-10 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest border-emerald-100 text-emerald-600 bg-emerald-50">
                           <CheckCircle2 className="h-4 w-4 mr-2" /> Completado
                        </Button>
                      )}
                      <button className="h-10 w-10 rounded-xl flex items-center justify-center text-clinical-300 hover:bg-clinical-50 hover:text-clinical-900 transition-all">
                         <MoreHorizontal className="h-5 w-5" />
                      </button>
                   </div>
                </div>
             </motion.div>
           ))}
        </motion.div>

        {filteredOrders.length === 0 && (
           <div className="h-64 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-clinical-100 text-clinical-200">
              <ClipboardList className="h-16 w-16 mb-4 opacity-10" />
              <p className="text-lg font-black uppercase tracking-widest">No hay órdenes registradas</p>
           </div>
        )}

      </motion.div>

      {/* Preview Modal */}
      <AnimatePresence>
         {showPreview && pdfUrl && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPreview(false)} className="absolute inset-0 bg-clinical-900/40 backdrop-blur-sm" />
               <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-6xl h-full max-h-[95vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
                  <div className="h-20 border-b border-clinical-100 flex items-center justify-between px-8 bg-clinical-50/50">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary-600 text-white flex items-center justify-center"><FileText className="h-5 w-5" /></div>
                        <div><h3 className="text-lg font-black text-clinical-900">Previsualización de Orden</h3><p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">Documento Clínico de Exámenes</p></div>
                     </div>
                     <button onClick={() => setShowPreview(false)} className="h-11 w-11 rounded-xl bg-white border border-clinical-100 text-clinical-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all"><X className="h-5 w-5" /></button>
                  </div>
                  <div className="flex-1 bg-clinical-100/50 p-8 overflow-hidden"><iframe src={pdfUrl} title="Vista Previa de Orden" className="w-full h-full rounded-2xl shadow-inner border border-clinical-200 bg-white" /></div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* Modal de Búsqueda de Paciente */}
      <PatientSearchModal 
        isOpen={showPatientSearch}
        onClose={() => setShowPatientSearch(false)}
        title="Nueva Orden Médica"
        actionLabel="Generar Orden"
        onAction={(patientId) => {
          setShowPatientSearch(false)
          navigate(`/ordenes/nueva/${patientId}`)
        }}
      />

    </div>
  )
}
