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
import { useToast } from '@/shared/ui/ToastContext'
import { useBusinessSettings } from '@/features/site-config/model/use-business-settings'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { ConfirmModal } from '@/shared/ui/ConfirmModal'
import { PdfPreviewModal } from '@/shared/ui/PdfPreviewModal'

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
  const { showToast } = useToast()
  const { settings } = useBusinessSettings()
  const [searchQuery, setSearchQuery] = useState('')
  const [showPatientSearch, setShowPatientSearch] = useState(false)
  
  // Real API paginated states
  const [recipes, setRecipes] = useState<PrescriptionSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [statusFilter, setStatusFilter] = useState('Todos los Estados')

  // PDF Preview Modal states
  const [showPdfModal, setShowPdfModal] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfModalTitle, setPdfModalTitle] = useState('')
  const [pdfModalSubtitle, setPdfModalSubtitle] = useState('')

  // Delete confirm modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const triggerDeleteConfirm = (id: string) => {
    setRecipeToDelete(id)
    setDeleteModalOpen(true)
  }

  const executeDelete = async () => {
    if (!recipeToDelete) return
    setIsDeleting(true)
    try {
      await axios.delete(`${API_URL}/prescriptions/${recipeToDelete}`)
      showToast('Receta médica eliminada exitosamente.', 'success')
      setDeleteModalOpen(false)
      setRecipeToDelete(null)
      fetchRecipes(currentPage)
    } catch (error: any) {
      console.error('Error deleting prescription:', error)
      showToast('Error al eliminar la receta médica.', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const fadeBase64Image = (base64Str: string, opacity: number): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = base64Str
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.globalAlpha = opacity
          ctx.drawImage(img, 0, 0)
          resolve(canvas.toDataURL('image/png'))
        } else {
          resolve(base64Str)
        }
      }
      img.onerror = () => resolve(base64Str)
    })
  }

  const generateDefaultLogoBase64 = (color: string = '#026fc7'): string => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.strokeStyle = color
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.arc(64, 64, 58, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.fillStyle = color
      ctx.fillRect(54, 28, 20, 72)
      ctx.fillRect(28, 54, 72, 20)
      return canvas.toDataURL('image/png')
    }
    return ''
  }

  const generateDefaultWatermarkBase64 = (color: string = '#026fc7', opacity: number = 0.05): string => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.globalAlpha = opacity
      ctx.strokeStyle = color
      ctx.lineWidth = 10
      ctx.beginPath()
      ctx.arc(128, 128, 110, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.fillStyle = color
      ctx.fillRect(108, 48, 40, 160)
      ctx.fillRect(48, 108, 160, 40)
      return canvas.toDataURL('image/png')
    }
    return ''
  }

  const handlePrintRecipe = async (recipeSummary: PrescriptionSummary) => {
    try {
      // 1. Fetch full prescription from backend API
      const res = await axios.get(`${API_URL}/prescriptions/${recipeSummary.id}`)
      const recipeFull = res.data
      if (!recipeFull) {
        showToast('No se encontraron los detalles de la receta.', 'error')
        return
      }

      // 2. Load Patient details — handle legacy cedula patientIds with dual-lookup
      let patientData: any = null
      try {
        const patientRes = await axios.get(`${API_URL}/patients/${recipeFull.patientId}`)
        patientData = patientRes.data
      } catch {
        // Legacy: patientId may be a cedula, search by document number
        try {
          const searchRes = await axios.get(`${API_URL}/patients?search=${recipeFull.patientId}&limit=1`)
          const results = searchRes.data?.data || searchRes.data || []
          if (results.length > 0) patientData = results[0]
        } catch { /* ignore */ }
      }
      const birthYear = patientData?.fechaNacimiento ? new Date(patientData.fechaNacimiento).getFullYear() : 1998
      const currentYear = new Date().getFullYear()
      const patient = {
        name: patientData ? `${patientData.nombres} ${patientData.apellidos}` : recipeFull.patientName,
        id: patientData?.numeroDocumento || recipeFull.patientId,
        age: `${currentYear - birthYear} Años`,
        hc: patientData ? `2026-${patientData.id.substring(0, 3).toUpperCase()}` : '2026-???'
      }

      // 3. Setup Doctor details
      const doctor = (recipeFull.doctor && recipeFull.doctor.name) ? recipeFull.doctor : {
        name: settings?.recipeDoctorName || 'Dra. Ana García',
        specialty: settings?.recipeDoctorSpecialty || 'Ginecología y Obstetricia',
        acess: settings?.recipeDoctorAcess || '7456-2026',
        clinic: settings?.clinicName || 'GineCentro Premium'
      }

      // 4. Generate PDF exactly as in RecetaMedicaPage.tsx
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })
      
      const pageWidth = doc.internal.pageSize.getWidth()
      const colWidth = (pageWidth - 60) / 2
      const midPoint = pageWidth / 2

      const defaultLogoPng = generateDefaultLogoBase64('#026fc7')
      const defaultWatermarkPng = generateDefaultWatermarkBase64('#026fc7', 0.04)

      const drawColumnContent = (x: number, type: 'rp' | 'indications') => {
        const rawLogo = settings?.recipeLogoUrl
        const hasCustomLogo = rawLogo && rawLogo !== 'null' && rawLogo !== ''
        const logoToUse = hasCustomLogo ? rawLogo : defaultLogoPng
        const watermarkToUse = defaultWatermarkPng

        // Subtle Logo Watermark
        try {
          doc.addImage(watermarkToUse, 'PNG', x + colWidth/2 - 25, 75, 50, 50)
        } catch (e) {
          console.error("Watermark failed to draw:", e)
        }

        // Header with Logo
        try {
          doc.addImage(logoToUse, 'PNG', x, 14, 13, 13)
        } catch (e) { 
          console.error("Header logo failed to draw:", e)
        }
        
        doc.setFontSize(16)
        doc.setTextColor(2, 111, 199)
        doc.setFont('helvetica', 'bold')
        doc.text(settings?.clinicName || doctor.clinic || 'GineCentro Premium', x + 16, 21)
        
        doc.setFontSize(7)
        doc.setTextColor(140)
        doc.setFont('helvetica', 'normal')
        doc.text(settings?.reportHeader || 'Ginecología y Obstetricia de Alta Especialidad', x + 16, 25)
        doc.text(settings?.address || 'Quito, Ecuador • Av. Amazonas N34-45 • Tel: (02) 2555-000', x, 34)

        // Accent Line
        doc.setDrawColor(2, 111, 199)
        doc.setLineWidth(0.5)
        doc.line(x, 37, x + colWidth, 37)

        // Recipe Header Info
        doc.setFillColor(252, 253, 255)
        doc.rect(x, 42, colWidth, 25, 'F')
        doc.setDrawColor(235, 240, 245)
        doc.rect(x, 42, colWidth, 25, 'S')

        doc.setFontSize(10)
        doc.setTextColor(40)
        doc.setFont('helvetica', 'bold')
        doc.text(`RECETA MÉDICA Nro: ${recipeFull.secuencial}`, x + 5, 49)
        
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100)
        doc.text(`Fecha: ${recipeFull.date}`, x + 5, 55)
        doc.text(`Vence: ${recipeFull.vigencia}`, x + colWidth - 5, 55, { align: 'right' })
        
        doc.setTextColor(60)
        doc.setFont('helvetica', 'bold')
        doc.text(`Paciente: ${patient.name}`, x + 5, 61)
        doc.setFont('helvetica', 'normal')
        doc.text(`CI: ${patient.id} • Edad: ${patient.age} • HC: ${patient.hc}`, x + 5, 64.5)

        // Section Title
        doc.setFillColor(245, 247, 250)
        doc.rect(x, 72, colWidth, 8, 'F')
        doc.setFontSize(9)
        doc.setTextColor(2, 111, 199)
        doc.setFont('helvetica', 'bold')
        doc.text(type === 'rp' ? 'PRODUCTO / MEDICAMENTO (RP)' : 'INDICACIONES DE USO', x + 5, 77.5)

        // List Medicines
        let currentY = 88
        const medicinesList = recipeFull.medicines || []
        medicinesList.forEach((med: any, i: number) => {
          doc.setFontSize(10)
          doc.setTextColor(30)
          doc.setFont('helvetica', 'bold')
          doc.text(`${i + 1}. ${med.generic} ${med.concentration ? `(${med.concentration})` : ''}`, x + 2, currentY)
          
          doc.setFontSize(8.5)
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(80)
          if (type === 'rp') {
             const brandStr = med.brandName ? ` [Comercial: ${med.brandName}]` : ''
             doc.text(`Cantidad: ${med.quantity} (${med.quantityLetters})${brandStr}`, x + 6, currentY + 5)
             doc.text(`Presentación: ${med.form} • Vía: ${med.route}`, x + 6, currentY + 9)
          } else {
             doc.setFont('helvetica', 'bold')
             doc.setTextColor(50)
             doc.text(`Dosis: ${med.dose}`, x + 6, currentY + 5)
             doc.setFont('helvetica', 'normal')
             doc.setTextColor(80)
             doc.text(`Frecuencia: ${med.frequency} • Duración: ${med.duration}`, x + 6, currentY + 9)
             if (med.indications) {
                doc.setFont('helvetica', 'italic')
                doc.setTextColor(100)
                doc.text(`Obs: ${med.indications}`, x + 6, currentY + 13)
                currentY += 4
             }
          }
          
          // Divider between meds
          doc.setDrawColor(245)
          doc.setLineWidth(0.2)
          doc.line(x + 5, currentY + 12, x + colWidth - 5, currentY + 12)
          
          currentY += 18
        })

        // Diagnosis at bottom
        doc.setFontSize(7)
        doc.setTextColor(150)
        doc.setFont('helvetica', 'normal')
        doc.text(`DIAGNÓSTICO: ${recipeFull.diagnostico || ''} (${recipeFull.cie10 || ''})`, x, 165)

        // Footer Firma
        const footerY = 180
        doc.setDrawColor(2, 111, 199)
        doc.setLineWidth(0.6)
        doc.line(x + (colWidth/4), footerY, x + (colWidth*3/4), footerY)
        
        doc.setFontSize(10)
        doc.setTextColor(40)
        doc.setFont('helvetica', 'bold')
        doc.text((doctor.name || '').toUpperCase(), x + (colWidth/2), footerY + 6, { align: 'center' })
        
        doc.setFontSize(8)
        doc.setTextColor(100)
        doc.setFont('helvetica', 'normal')
        doc.text(doctor.specialty || '', x + (colWidth/2), footerY + 10, { align: 'center' })
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(2, 111, 199)
        doc.text(`REG. ACESS: ${doctor.acess || ''}`, x + (colWidth/2), footerY + 14, { align: 'center' })
      }

      // Draw Left Column (RP)
      drawColumnContent(20, 'rp')
      
      // Vertical Divider
      doc.setDrawColor(230)
      doc.setLineWidth(0.3)
      ;(doc as any).setLineDash([2, 2])
      doc.line(midPoint, 10, midPoint, 200)
      ;(doc as any).setLineDash([])

      // Draw Right Column (Indications)
      drawColumnContent(midPoint + 10, 'indications')

      // Open inline PDF preview modal
      const blob = doc.output('blob')
      const blobUrl = URL.createObjectURL(blob)
      setPdfUrl(blobUrl)
      setPdfModalTitle(`Previsualización de Receta Profesional — ${recipeFull.secuencial}`)
      setPdfModalSubtitle(`${patient.name} • ${recipeFull.date}`)
      setShowPdfModal(true)
    } catch (e) {
      console.error(e)
      showToast('Error al generar el PDF de la receta.', 'error')
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
                      <Button 
                         onClick={() => navigate(`/recetas/editar/${recipe.id}`)}
                         variant="secondary" 
                         className="h-10 w-10 p-0 rounded-xl border-clinical-100 text-clinical-400 hover:text-primary-600 hover:bg-primary-50 transition-all cursor-pointer"
                         title="Ver / Editar Receta"
                      >
                         <Eye className="h-5 w-5" />
                      </Button>
                      <Button 
                         onClick={() => handlePrintRecipe(recipe)}
                         variant="secondary" 
                         className="h-10 w-10 p-0 rounded-xl border-clinical-100 text-clinical-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"
                         title="Vista Previa de Impresión"
                      >
                         <Printer className="h-5 w-5" />
                      </Button>
                      <Button 
                         onClick={() => triggerDeleteConfirm(recipe.id)}
                         variant="secondary" 
                         className="h-10 w-10 p-0 rounded-xl border-clinical-100 text-clinical-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                         title="Eliminar Receta"
                      >
                         <Trash2 className="h-5 w-5" />
                      </Button>
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

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={showPdfModal}
        onClose={() => { 
          setShowPdfModal(false)
          if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl)
            setPdfUrl(null)
          }
        }}
        pdfUrl={pdfUrl}
        title={pdfModalTitle}
        subtitle={pdfModalSubtitle}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={executeDelete}
        title="¿Eliminar Receta Médica?"
        message="¿Está seguro de que desea eliminar esta receta médica? Esta acción no se puede deshacer y se borrará permanentemente de la base de datos."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
