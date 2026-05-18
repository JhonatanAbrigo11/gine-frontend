import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  User, 
  FileText, 
  Clock, 
  Pill, 
  Activity, 
  Image as ImageIcon, 
  FileUp, 
  Download,
  Eye,
  Calendar,
  AlertCircle,
  Stethoscope,
  Baby,
  FlaskConical,
  Phone,
  Mail,
  MapPin,
  MoreHorizontal,
  Plus,
  ChevronRight,
  Hash,
  Trash2,
  ChevronDown,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/widgets/button'
import { API_URL } from '@/shared/api/base'
import axios from 'axios'
import { jsPDF } from 'jspdf'
import { useBusinessSettings } from '@/features/site-config/model/use-business-settings'
import { pregnancyService } from '@/entities/pregnancy/api/pregnancy.service'
import { PdfPreviewModal } from '@/shared/ui/PdfPreviewModal'

/* ==================================================
   MOCK DATA
   ================================================== */

const PATIENT_DATA = {
  id: '1',
  name: 'Ana García López',
  cedula: '1723456789',
  hc: '2026-001',
  age: 28,
  birthDate: '15/05/1998',
  email: 'ana.garcia@email.com',
  phone: '+593 987 654 321',
  address: 'Av. Gran Colombia y 12 de Octubre, Quito',
  blood: 'O+',
  risk: 'Bajo',
  gpac: 'G1 P0 A0 C0',
  fum: '12 Abr 2026',
  fpp: '17 Ene 2027',
  alergias: 'Penicilina, AINES',
  antecedentes: 'Hipotiroidismo controlado',
}

const CONSULTATIONS_TIMELINE = [
  { date: '10 May 2026', type: 'Control Prenatal', doctor: 'Dra. Ana García', diagnosis: 'Embarazo 4 semanas, normoevolutivo.', weight: '64.5kg', bp: '120/80' },
  { date: '15 Abr 2026', type: 'Consulta Ginecología', doctor: 'Dra. Ana García', diagnosis: 'Confirmación de embarazo vía test HCG.', weight: '63.8kg', bp: '115/75' },
]

const PRESCRIPTIONS = [
  { id: 'REC-001', date: '10 May 2026', medicines: ['Ácido Fólico 5mg', 'Hierro Plus'], status: 'Activa' },
  { id: 'REC-002', date: '15 Abr 2026', medicines: ['Progesterona 200mg'], status: 'Finalizada' },
]

const DOCUMENTS = [
  { id: 'DOC-001', name: 'Ecografía Primer Trimestre.pdf', category: 'Ecografía', date: '10 May 2026', size: '2.4 MB' },
  { id: 'DOC-002', name: 'Hemograma Completo.pdf', category: 'Laboratorio', date: '12 May 2026', size: '1.1 MB' },
  { id: 'IMG-001', name: 'Captura Doppler.jpg', category: 'Imagenología', date: '10 May 2026', size: '4.5 MB' },
]

import { pacienteService } from '@/entities/paciente/api/paciente.service'
import type { Patient } from '@/entities/paciente/model/types'
import { useToast } from '@/shared/ui/ToastContext'
import { Loader2 } from 'lucide-react'

export const PacienteDetallePage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  
  const activeTab = location.state?.activeTab || 'historial'
  const setActiveTab = (tabId: string) => {
    navigate(location.pathname, { replace: true, state: { ...location.state, activeTab: tabId } })
  }
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchPatient = async () => {
    if (!id) return
    try {
      setLoading(true)
      const data = await pacienteService.getById(id)
      setPatient(data)
    } catch (error) {
      showToast('Error al cargar la información de la paciente', 'error')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatient()
  }, [id])

  const tabs = [
    { id: 'datos', label: 'Datos Personales', icon: <User className="h-4 w-4" /> },
    { id: 'historial', label: 'Ficha Clínica', icon: <FileText className="h-4 w-4" /> },
    { id: 'citas', label: 'Citas', icon: <Calendar className="h-4 w-4" /> },
    { id: 'recetas', label: 'Recetas', icon: <Pill className="h-4 w-4" /> },
    { id: 'prenatal', label: 'Control Prenatal', icon: <Baby className="h-4 w-4" /> },
    { id: 'documentos', label: 'Documentos', icon: <FlaskConical className="h-4 w-4" /> },
  ]

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-clinical-50">
        <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-clinical-50 gap-4">
        <AlertCircle className="h-12 w-12 text-rose-500" />
        <h2 className="text-xl font-bold text-clinical-900">Paciente no encontrada</h2>
        <Button onClick={() => navigate('/pacientes')}>Volver al listado</Button>
      </div>
    )
  }

  const patientInitials = `${patient.nombres.charAt(0)}${patient.apellidos.charAt(0)}`

  return (
    <div className="min-h-dvh bg-clinical-50/50 pb-20">
      {/* Banner de Paciente */}
      <div className="bg-white border-b border-clinical-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-50/30 skew-x-[-20deg] translate-x-20 pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 py-8 relative z-10">
           <button 
             onClick={() => navigate('/pacientes')}
             className="mb-6 flex items-center gap-2 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-widest"
           >
              <ChevronLeft className="h-4 w-4" /> Volver a Listado
           </button>

           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                 <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-[1.5rem] sm:rounded-[2rem] bg-primary-600 text-white flex items-center justify-center text-3xl sm:text-4xl font-bold shadow-2xl shadow-primary-200 ring-4 ring-white">
                    {patientInitials}
                 </div>
                 <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                       <h1 className="text-2xl sm:text-3xl font-black text-clinical-900 tracking-tight">{patient.nombres} {patient.apellidos}</h1>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] sm:text-[11px] font-bold text-clinical-500 uppercase tracking-widest">
                       <span className="flex items-center gap-1.5"><Hash className="h-3.5 w-3.5" /> ID: {patient.numeroDocumento}</span>
                       <span className="flex items-center gap-1.5 border-clinical-200 sm:border-l sm:pl-4"><Clock className="h-3.5 w-3.5" /> {patient.fechaNacimiento ? new Date().getFullYear() - new Date(patient.fechaNacimiento).getFullYear() : '—'} años</span>
                       <span className="flex items-center gap-1.5 border-clinical-200 sm:border-l sm:pl-4"><FileText className="h-3.5 w-3.5" /> HC: 2026-{patient.id.substring(0,3).toUpperCase()}</span>
                    </div>
                 </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                 {/* Botones de acción removidos */}
              </div>
           </div>
        </div>
      </div>


      <main className="mx-auto max-w-7xl px-6 mt-10">
        {/* Navegación por Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-white rounded-[2rem] shadow-premium border border-white mb-10 overflow-x-auto no-scrollbar">
           {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all",
                  activeTab === tab.id 
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-100" 
                    : "text-clinical-400 hover:text-primary-600 hover:bg-primary-50"
                )}
              >
                 {tab.icon} {tab.label}
              </button>
           ))}
        </div>

        {/* Contenido de Tabs */}
        <AnimatePresence mode="wait">
           <motion.div
             key={activeTab}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             transition={{ duration: 0.2 }}
           >
              {activeTab === 'datos' && <DatosPersonalesTab patient={patient} />}
              {activeTab === 'historial' && <HistorialClinicoTab patient={patient} />}
              {activeTab === 'citas' && <CitasTab patient={patient} />}
              {activeTab === 'recetas' && <RecetasTab patient={patient} />}
              {activeTab === 'prenatal' && <ControlPrenatalTab patient={patient} />}
              {activeTab === 'documentos' && <DocumentosTab patient={patient} />}
           </motion.div>
        </AnimatePresence>
      </main>

      {/* Modal removido */}
    </div>
  )
}

/* ==================================================
   TAB COMPONENTS
   ================================================== */

function DatosPersonalesTab({ patient }: { patient: Patient }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       {/* Columna Izquierda: Información de Perfil */}
       <div className="glass-card rounded-[2.5rem] p-8 border-white flex flex-col justify-between">
          <div>
             <h3 className="text-sm font-bold text-clinical-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                <User className="h-4 w-4 text-primary-600" /> Información de Perfil
             </h3>
             <div className="space-y-6">
                <DataField label="Nombre Completo" value={`${patient.nombres} ${patient.apellidos}`} />
                <DataField label="Fecha de Nacimiento" value={patient.fechaNacimiento ? new Date(patient.fechaNacimiento).toLocaleDateString() : '—'} />
                <DataField label="Correo Electrónico" value={patient.email || '—'} icon={<Mail className="h-3.5 w-3.5" />} />
                <DataField label="Teléfono / WhatsApp" value={patient.telefono || '—'} icon={<Phone className="h-3.5 w-3.5" />} />
                <DataField label="Dirección Residencial" value={patient.direccion || '—'} icon={<MapPin className="h-3.5 w-3.5" />} />
             </div>
          </div>
       </div>

       {/* Columna Derecha: Información Clínica Base + Estado Obstétrico */}
       <div className="space-y-8 flex flex-col justify-between">
          <div className="glass-card rounded-[2.5rem] p-8 border-white flex-1">
             <h3 className="text-sm font-bold text-clinical-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-600" /> Información Clínica Base
             </h3>
             <div className="space-y-6">
                <DataField label="Tipo de Sangre" value={patient.tipoSanguineo || '—'} />
                <DataField label="Antecedentes Médicos" value={patient.antecedentes || '—'} />
                <DataField label="Alergias Conocidas" value={patient.alergias || '—'} danger />
             </div>
          </div>

          <div className="glass-card rounded-[2.5rem] p-8 border-white shadow-premium">
             <h3 className="text-sm font-bold text-clinical-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Baby className="h-4 w-4 text-primary-600" /> Estado Obstétrico
             </h3>
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black text-clinical-400 uppercase tracking-widest">Paridad (G/P/A/C)</span>
                   <span className="text-sm font-black text-clinical-900">G{patient.gestas} P{patient.partos} A{patient.abortos} C{patient.cesareas}</span>
                </div>
                <div className="h-px bg-clinical-100/50" />
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black text-clinical-400 uppercase tracking-widest">F.U.M.</span>
                   <span className="text-sm font-black text-primary-600">
                     {patient.consultations?.[0]?.gynecology?.fum ? new Date(patient.consultations[0].gynecology.fum).toLocaleDateString('es-ES') : 'No reg.'}
                   </span>
                </div>
                <div className="h-px bg-clinical-100/50" />
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black text-clinical-400 uppercase tracking-widest">F.P.P. (Estimada)</span>
                   <span className="text-sm font-black text-emerald-600">
                     {patient.consultations?.[0]?.gynecology?.fpp ? new Date(patient.consultations[0].gynecology.fpp).toLocaleDateString('es-ES') : 'No reg.'}
                   </span>
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}

function HistorialClinicoTab({ patient }: { patient: Patient }) {
  const navigate = useNavigate()
  const [consultations, setConsultations] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/patients/${patient.numeroDocumento || patient.id}/consultations?page=${page}&limit=5`)
        const data = await response.json()
        setConsultations(data.data)
        setTotalPages(data.meta.totalPages)
      } catch (error) {
        console.error('Error fetching consultations:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchConsultations()
  }, [patient, page])

  return (
    <div className="space-y-8 w-full">
       <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-clinical-900 tracking-tight">Línea de Tiempo de Consultas</h3>
       </div>
       
       {consultations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-clinical-200">
             <Stethoscope className="h-12 w-12 text-clinical-200 mb-4" />
             <p className="text-clinical-400 font-bold uppercase tracking-widest text-xs">No hay consultas registradas aún</p>
          </div>
       ) : (
          <div className="space-y-0 relative before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-[3px] before:bg-clinical-100 before:rounded-full">
             {consultations.map((item: any, i: number) => (
                <div key={item.id} className="relative pl-16 pb-12 last:pb-0">
                   <div className="absolute left-0 h-12 w-12 rounded-2xl bg-white border-4 border-clinical-50 flex items-center justify-center text-primary-600 shadow-sm z-10">
                      <Stethoscope className="h-5 w-5" />
                   </div>
                   <div className="glass-card rounded-[2.5rem] p-8 border-white hover:shadow-xl transition-all group">
                      <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-xl bg-primary-50 text-primary-700 text-[10px] font-black uppercase tracking-widest border border-primary-100">
                              {new Date(item.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <h4 className="text-lg font-black text-clinical-900">{item.type}</h4>
                         </div>
                         <button 
                            onClick={() => navigate(`/consultas/activa/${patient.numeroDocumento || patient.id}`, { state: { consultationId: item.id } })}
                            className="h-9 w-9 rounded-xl flex items-center justify-center text-clinical-400 hover:bg-primary-50 hover:text-primary-600 border border-transparent hover:border-primary-100 transition-all shadow-sm bg-white"
                         >
                            <Eye className="h-5 w-5" />
                         </button>
                      </div>
                      <div className="bg-clinical-50/50 rounded-2xl p-6 border border-clinical-100 mb-6">
                         <p className="text-sm font-medium text-clinical-800 leading-relaxed italic">"{item.evolution || item.reason || 'Sin diagnóstico registrado'}"</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-8">
                         <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-emerald-500" />
                            <span className="text-[11px] font-bold text-clinical-400 uppercase tracking-widest">Presión:</span>
                            <span className="text-xs font-black text-clinical-900">{item.vitalSigns?.pressure || '—'}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-amber-500" />
                            <span className="text-[11px] font-bold text-clinical-400 uppercase tracking-widest">Peso:</span>
                            <span className="text-xs font-black text-clinical-900">{item.vitalSigns?.weight || '—'}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary-500" />
                            <span className="text-[11px] font-bold text-clinical-400 uppercase tracking-widest">Doctor:</span>
                            <span className="text-xs font-black text-clinical-900">{item.doctorId || '—'}</span>
                         </div>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       )}

       {totalPages > 1 && (
         <div className="flex justify-center items-center gap-4 mt-8">
           <Button 
             variant="ghost" 
             disabled={page === 1} 
             onClick={() => setPage(p => p - 1)}
             className="text-sm rounded-xl h-10 px-4"
           >
             Anterior
           </Button>
           <span className="text-sm font-bold text-clinical-500">Página {page} de {totalPages}</span>
           <Button 
             variant="secondary" 
             disabled={page === totalPages} 
             onClick={() => setPage(p => p + 1)}
             className="text-sm rounded-xl h-10 px-4 bg-white"
           >
             Siguiente
           </Button>
         </div>
       )}
    </div>
  )
}

const generateDefaultLogoBase64 = (color: string = '#026fc7'): string => {
  if (typeof document === 'undefined') return ''
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
  if (typeof document === 'undefined') return ''
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

function RecetasTab({ patient }: { patient: Patient }) {
  const { settings } = useBusinessSettings()
  const [dbPrescriptions, setDbPrescriptions] = useState<any[]>([])

  // PDF Preview Modal state
  const [showPdfModal, setShowPdfModal] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfModalTitle, setPdfModalTitle] = useState('')
  const [pdfModalSubtitle, setPdfModalSubtitle] = useState('')

  useEffect(() => {
    if (!patient?.id) return

    // Fetch by UUID AND by cedula (legacy records may have either as patientId)
    const fetchByUUID = axios.get(`${API_URL}/prescriptions`, {
      params: { patientId: patient.id, limit: 100 }
    })
    const fetchByCedula = patient.numeroDocumento
      ? axios.get(`${API_URL}/prescriptions`, {
          params: { patientId: patient.numeroDocumento, limit: 100 }
        })
      : Promise.resolve({ data: { data: [] } })

    Promise.all([fetchByUUID, fetchByCedula])
      .then(([resUUID, resCedula]) => {
        const byUUID: any[] = resUUID.data?.data || []
        const byCedula: any[] = resCedula.data?.data || []
        // Merge and deduplicate by id
        const seen = new Set<string>()
        const merged = [...byUUID, ...byCedula].filter(r => {
          if (seen.has(r.id)) return false
          seen.add(r.id)
          return true
        })
        // Sort by createdAt desc
        merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setDbPrescriptions(merged)
      })
      .catch(err => {
        console.error('Error fetching patient prescriptions from API:', err)
      })
  }, [patient])

  const generatePDFForPrescription = (receta: any, shouldDownload: boolean = true) => {
    try {
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
        const watermarkToUse = defaultWatermarkPng // Fallback watermark

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
        doc.text(settings?.clinicName || receta.doctor?.clinic || 'GineCentro Premium', x + 16, 21)
        
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
        doc.text(`RECETA MÉDICA Nro: ${receta.id}`, x + 5, 49)
        
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100)
        doc.text(`Fecha: ${receta.date}`, x + 5, 55)
        doc.text(`Vence: ${receta.vigencia || '3 días'}`, x + colWidth - 5, 55, { align: 'right' })
        
        doc.setTextColor(60)
        doc.setFont('helvetica', 'bold')
        doc.text(`Paciente: ${patient.nombres} ${patient.apellidos}`, x + 5, 61)
        doc.setFont('helvetica', 'normal')
        const age = patient.fechaNacimiento ? new Date().getFullYear() - new Date(patient.fechaNacimiento).getFullYear() : '—'
        const hc = `2026-${patient.id.substring(0,3).toUpperCase()}`
        doc.text(`CI: ${patient.numeroDocumento || patient.id} • Edad: ${age} Años • HC: ${hc}`, x + 5, 64.5)

        // Section Title
        doc.setFillColor(245, 247, 250)
        doc.rect(x, 72, colWidth, 8, 'F')
        doc.setFontSize(9)
        doc.setTextColor(2, 111, 199)
        doc.setFont('helvetica', 'bold')
        doc.text(type === 'rp' ? 'PRODUCTO / MEDICAMENTO (RP)' : 'INDICACIONES DE USO', x + 5, 77.5)

        // List Medicines
        let currentY = 88
        const medicinesList = receta.medicines || []
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
             doc.text(`Cantidad: ${med.quantity} (${med.quantityLetters || '—'})${brandStr}`, x + 6, currentY + 5)
             doc.text(`Presentación: ${med.form} • Vía: ${med.route || 'Oral'}`, x + 6, currentY + 9)
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
        doc.text(`DIAGNÓSTICO: ${receta.diagnostico || 'Control prenatal de rutina'} (${receta.cie10 || 'Z34.0'})`, x, 165)

        // Footer Firma
        const footerY = 180
        doc.setDrawColor(2, 111, 199)
        doc.setLineWidth(0.6)
        doc.line(x + (colWidth/4), footerY, x + (colWidth*3/4), footerY)
        
        doc.setFontSize(10)
        doc.setTextColor(40)
        doc.setFont('helvetica', 'bold')
        const docName = receta.doctor?.name || 'Dra. Ana García'
        doc.text(docName.toUpperCase(), x + (colWidth/2), footerY + 6, { align: 'center' })
        
        doc.setFontSize(8)
        doc.setTextColor(100)
        doc.setFont('helvetica', 'normal')
        doc.text(receta.doctor?.specialty || 'Ginecología y Obstetricia', x + (colWidth/2), footerY + 10, { align: 'center' })
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(2, 111, 199)
        doc.text(`REG. ACESS: ${receta.doctor?.acess || '7456-2026'}`, x + (colWidth/2), footerY + 14, { align: 'center' })
      }

      drawColumnContent(20, 'rp')
      
      // Vertical Divider
      doc.setDrawColor(230)
      doc.setLineWidth(0.3)
      ;(doc as any).setLineDash([2, 2])
      doc.line(midPoint, 10, midPoint, 200)
      ;(doc as any).setLineDash([])

      drawColumnContent(midPoint + 10, 'indications')

      if (shouldDownload) {
        doc.save(`Receta_${receta.id}_${patient.apellidos}.pdf`)
      } else {
        // Open inline PDF preview modal
        const blob = doc.output('blob')
        const blobUrl = URL.createObjectURL(blob)
        setPdfUrl(blobUrl)
        setPdfModalTitle(`Previsualización de Receta Profesional — ${receta.secuencial || receta.id}`)
        setPdfModalSubtitle(`${patient.nombres} ${patient.apellidos} • ${receta.date}`)
        setShowPdfModal(true)
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error al generar la receta profesional.')
    }
  }

  const allPrescriptions = dbPrescriptions

  return (
    <div>
      {allPrescriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-clinical-200">
           <Pill className="h-12 w-12 text-clinical-200 mb-4" />
           <p className="text-clinical-400 font-bold uppercase tracking-widest text-xs">No hay recetas registradas aún</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {allPrescriptions.map((receta, i) => (
              <div key={i} className="glass-card rounded-[2.5rem] p-8 border-white hover:shadow-xl transition-all">
                 <div className="flex items-center justify-between mb-6">
                    <div>
                       <span className="text-[10px] font-black text-clinical-300 uppercase tracking-widest">{receta.id} • {receta.date}</span>
                       <h4 className="text-lg font-black text-clinical-900 mt-0.5">Receta Médica</h4>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                      receta.status === 'Activa' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-clinical-50 text-clinical-400 border-clinical-100"
                    )}>
                       {receta.status}
                    </span>
                 </div>
                 <div className="space-y-3">
                    {(receta.medicines || []).map((med: any, j: number) => {
                       const medStr = med.generic + (med.concentration ? ` (${med.concentration})` : '') + (med.brandName ? ` [Comercial: ${med.brandName}]` : '')
                       return (
                          <div key={j} className="flex items-center gap-3 p-4 rounded-2xl bg-clinical-50/50 border border-clinical-100">
                             <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-primary-600 shadow-sm"><Pill className="h-4 w-4" /></div>
                             <div className="flex-1">
                                <span className="text-xs font-black text-clinical-900 block">{medStr}</span>
                                <span className="text-[10px] font-bold text-clinical-400 block uppercase tracking-wider">{med.dose} • {med.frequency} • {med.duration}</span>
                             </div>
                          </div>
                       )
                    })}
                 </div>
                 <div className="flex items-center gap-3 mt-8 pt-6 border-t border-clinical-100">
                    <Button 
                      variant="secondary" 
                      onClick={() => generatePDFForPrescription(receta, true)}
                      className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest border-clinical-200"
                    >
                       <Download className="h-4 w-4 mr-2" /> Descargar PDF
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => generatePDFForPrescription(receta, false)}
                      className="h-10 w-10 p-0 rounded-xl border-clinical-200 text-clinical-400 flex items-center justify-center"
                    >
                       <Eye className="h-5 w-5" />
                    </Button>
                 </div>
               </div>
           ))}
        </div>
      )}

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
    </div>
  )
}

function ControlPrenatalTab({ patient }: { patient: Patient }) {
  const [activePregnancy, setActivePregnancy] = useState<any | null>(null)
  const [controls, setControls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const calculateGestationalAge = (fumDateStr: string) => {
    const fum = new Date(fumDateStr)
    const diffTime = Math.abs(new Date().getTime() - fum.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(diffDays / 7)
    const days = diffDays % 7
    return { weeks, days }
  }

  useEffect(() => {
    if (!patient?.id) return
    setLoading(true)
    pregnancyService.getActive(patient.id)
      .then(pregnancy => {
        setActivePregnancy(pregnancy)
        if (pregnancy) {
          return pregnancyService.getControls(pregnancy.id)
        }
        return []
      })
      .then(controlsList => {
        setControls(controlsList || [])
      })
      .catch(err => {
        console.error('Error fetching prenatal controls:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [patient])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-clinical-100 shadow-premium">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
         <p className="text-clinical-400 font-bold uppercase tracking-widest text-xs">Cargando monitoreo gestacional...</p>
      </div>
    )
  }

  if (!activePregnancy) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-clinical-200">
         <Baby className="h-12 w-12 text-clinical-200 mb-4 opacity-40" />
         <p className="text-clinical-800 font-black uppercase tracking-widest text-sm mb-2">Sin Embarazo Activo</p>
         <p className="text-clinical-400 font-bold text-xs max-w-sm text-center px-4 leading-relaxed">No se encuentra ningún embarazo activo registrado para esta paciente en el sistema de obstetricia.</p>
      </div>
    )
  }

  const gestAge = calculateGestationalAge(activePregnancy.fum)

  return (
    <div className="space-y-8">
       <div className="bg-white rounded-[3rem] p-10 border border-clinical-100 shadow-premium relative overflow-hidden mb-10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-50/20 skew-x-[-15deg] translate-x-20" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="h-12 w-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600"><Baby className="h-8 w-8" /></div>
                   <h3 className="text-3xl font-black text-clinical-900 tracking-tight">Monitoreo Gestacional</h3>
                </div>
                <p className="text-clinical-500 max-w-md font-medium text-lg leading-relaxed">
                   Actualmente en la semana <span className="text-primary-600 font-black">{gestAge.weeks} de gestación</span> (y {gestAge.days} días). 
                   FPP calculada: <span className="font-bold text-clinical-850">{new Date(activePregnancy.fpp).toLocaleDateString('es-EC')}</span>.
                </p>
             </div>
             <div className="flex gap-4">
                <div className="px-8 py-5 bg-clinical-50 rounded-[2rem] border border-clinical-100 text-center min-w-[140px] shadow-inner">
                   <p className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-2">Semana</p>
                   <p className="text-3xl font-black text-clinical-900">{String(gestAge.weeks).padStart(2, '0')}</p>
                </div>
                <div className="px-8 py-5 bg-clinical-50 rounded-[2rem] border border-clinical-100 text-center min-w-[140px] shadow-inner">
                   <p className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-2">Días</p>
                   <p className="text-3xl font-black text-primary-600">{gestAge.days}</p>
                </div>
             </div>
          </div>
       </div>

       <div className="w-full">
          <h3 className="text-lg font-bold text-clinical-900 mb-8 tracking-tight">Timeline de Evolución Prenatal</h3>
          {controls.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-16 bg-white rounded-[2.5rem] border border-dashed border-clinical-200">
                <Baby className="h-10 w-10 text-clinical-200 mb-3 opacity-20" />
                <p className="text-clinical-400 font-bold uppercase tracking-widest text-[10px]">No hay controles registrados para este embarazo aún</p>
             </div>
          ) : (
             <div className="space-y-0 relative before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-[3px] before:bg-clinical-100 before:rounded-full">
                {controls.map((control, i) => {
                   const weeks = Math.floor(control.gestationalAge)
                   const days = Math.round((control.gestationalAge - weeks) * 10)
                   const controlDateStr = new Date(control.controlDate).toLocaleDateString('es-EC', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                   })

                   return (
                      <div key={control.id || i} className="relative pl-16 pb-12 last:pb-0">
                         <div className="absolute left-0 h-12 w-12 rounded-2xl bg-accent-50 border-4 border-white flex items-center justify-center text-accent-600 shadow-sm z-10">
                            <Baby className="h-5 w-5" />
                         </div>
                         <div className="glass-card rounded-[2.5rem] p-8 border-white">
                            <div className="flex items-center justify-between mb-4">
                               <h4 className="text-lg font-black text-clinical-900">Semana {weeks} de Gestación {days > 0 ? `+ ${days}d` : ''}</h4>
                               <span className="text-[10px] font-black text-clinical-300 uppercase tracking-widest">{controlDateStr}</span>
                            </div>
                            
                            {control.observations && (
                               <p className="text-sm font-medium text-clinical-600 mb-6 leading-relaxed bg-clinical-50/30 p-4 rounded-xl border border-clinical-100/50 italic">
                                  "{control.observations}"
                               </p>
                            )}

                            {/* Plan de indicación obstétrica */}
                            {control.plan && (
                               <div className="mb-6 p-4 rounded-xl bg-primary-50/20 border border-primary-100/30">
                                  <p className="text-[9px] font-black text-primary-600 uppercase tracking-widest mb-1">Plan de Indicación Obstétrica</p>
                                  <p className="text-xs font-bold text-clinical-850">{control.plan}</p>
                               </div>
                            )}

                            {/* Parámetros clínicos del control */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-clinical-100/50">
                               {control.maternalWeight && (
                                  <div className="bg-clinical-50/50 p-3 rounded-xl border border-clinical-100/50 text-center">
                                     <span className="text-[8px] font-black text-clinical-300 uppercase tracking-widest block mb-1">Peso Materno</span>
                                     <span className="text-xs font-black text-clinical-850">{control.maternalWeight} kg</span>
                                  </div>
                               )}
                               {control.bloodPressure && (
                                  <div className="bg-clinical-50/50 p-3 rounded-xl border border-clinical-100/50 text-center">
                                     <span className="text-[8px] font-black text-clinical-300 uppercase tracking-widest block mb-1">P. Arterial</span>
                                     <span className="text-xs font-black text-clinical-850">{control.bloodPressure}</span>
                                  </div>
                               )}
                               {control.fetalHeartRate && (
                                  <div className="bg-clinical-50/50 p-3 rounded-xl border border-clinical-100/50 text-center">
                                     <span className="text-[8px] font-black text-clinical-300 uppercase tracking-widest block mb-1">FC Fetal</span>
                                     <span className="text-xs font-black text-primary-600">{control.fetalHeartRate} lpm</span>
                                  </div>
                               )}
                               {control.uterineHeight && (
                                  <div className="bg-clinical-50/50 p-3 rounded-xl border border-clinical-100/50 text-center">
                                     <span className="text-[8px] font-black text-clinical-300 uppercase tracking-widest block mb-1">Alt. Uterina</span>
                                     <span className="text-xs font-black text-clinical-850">{control.uterineHeight} cm</span>
                                  </div>
                               )}
                            </div>
                         </div>
                      </div>
                   )
                })}
             </div>
          )}
       </div>
    </div>
  )
}

function DocumentosTab({ patient }: { patient: Patient }) {
  const [documents, setDocuments] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/patients/${patient.numeroDocumento || patient.id}/documents?page=${page}&limit=9`)
        const data = await response.json()
        setDocuments(data.data || [])
        setTotalPages(data.meta?.totalPages || 1)
      } catch (error) {
        console.error('Error fetching documents:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDocuments()
  }, [patient, page])

  return (
    <div className="space-y-10">
       <section>
          <div className="flex items-center gap-4 mb-6">
             <div className="h-10 w-10 rounded-xl bg-white border border-clinical-100 shadow-sm flex items-center justify-center text-primary-600">
                <FileText className="h-5 w-5" />
             </div>
             <h3 className="text-lg font-bold text-clinical-900 tracking-tight">Archivos Clínicos</h3>
             <div className="h-px flex-1 bg-clinical-100" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {documents.map(doc => (
                <div key={doc.id} className="glass-card rounded-[2.5rem] p-6 border-white hover:border-primary-100 hover:shadow-xl transition-all group">
                   <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-2xl bg-clinical-50 text-clinical-300 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                         <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex gap-1">
                         <button 
                            onClick={() => window.open(doc.url.startsWith('http') ? doc.url : `${API_URL.replace('/api', '')}${doc.url}`, '_blank')}
                            className="h-9 w-9 rounded-xl bg-white border border-clinical-100 text-clinical-400 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-all"
                         >
                            <Eye className="h-4 w-4" />
                         </button>
                         <button 
                            onClick={() => window.open(doc.url.startsWith('http') ? doc.url : `${API_URL.replace('/api', '')}${doc.url}`, '_blank')}
                            className="h-9 w-9 rounded-xl bg-white border border-clinical-100 text-clinical-400 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                         >
                            <Download className="h-4 w-4" />
                         </button>
                      </div>
                   </div>
                   <h4 className="text-sm font-bold text-clinical-900 mb-1 truncate" title={doc.name}>{doc.name}</h4>
                   <p className="text-[10px] font-semibold text-clinical-400 truncate">{doc.reference}</p>
                   <div className="flex items-center justify-between text-[10px] font-bold text-clinical-400 uppercase tracking-widest mt-4">
                      <span>{new Date(doc.createdAt).toLocaleDateString('es-ES')}</span>
                      <span className="px-2 py-0.5 rounded-lg bg-primary-50 text-primary-700 text-[9px] tracking-normal font-black">{doc.source}</span>
                   </div>
                </div>
             ))}
             
             {/* Empty State / Add Placeholder */}
                <button className="rounded-[2.5rem] border-2 border-dashed border-clinical-100 p-6 flex flex-col items-center justify-center text-clinical-300 hover:border-primary-300 hover:text-primary-600 transition-all bg-white/10 group">
                   <div className="h-10 w-10 rounded-full border-2 border-dashed border-clinical-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Plus className="h-5 w-5" /></div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Añadir Documento</span>
                </button>
             </div>
          </section>
    </div>
  )
}

type AppointmentStatus = 'Agendada' | 'Confirmada' | 'Sala de espera' | 'En consultorio' | 'En atención' | 'Finalizada' | 'Cancelada' | 'No asistió'

const STATUS_CONFIG: Record<AppointmentStatus, { color: string, icon: any }> = {
  'Agendada': { color: 'text-primary-600', icon: Clock },
  'Confirmada': { color: 'text-emerald-600', icon: CheckCircle2 },
  'Sala de espera': { color: 'text-amber-600', icon: AlertCircle },
  'En consultorio': { color: 'text-purple-600', icon: User },
  'En atención': { color: 'text-indigo-600', icon: Stethoscope },
  'Finalizada': { color: 'text-clinical-400', icon: CheckCircle2 },
  'Cancelada': { color: 'text-rose-600', icon: XCircle },
  'No asistió': { color: 'text-clinical-400', icon: XCircle },
}

function StatusDropdown({ currentStatus, onChange }: { currentStatus: AppointmentStatus, onChange: (s: AppointmentStatus) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const status = STATUS_CONFIG[currentStatus] || STATUS_CONFIG['Agendada']
  const Icon = status.icon

  return (
    <div className="relative">
       <button 
         onClick={() => setIsOpen(!isOpen)}
         className={cn(
           "flex items-center gap-2 pl-3 pr-2 h-9 rounded-xl text-[10px] font-black uppercase tracking-tighter ring-1 ring-clinical-100 bg-white hover:ring-primary-300 transition-all min-w-[145px]",
           status.color
         )}
       >
          <Icon className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">{currentStatus}</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")} />
       </button>

       <AnimatePresence>
          {isOpen && (
            <>
               <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
               <motion.div 
                 initial={{ opacity: 0, y: 4, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: 4, scale: 0.95 }}
                 className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[180px] bg-white rounded-2xl shadow-2xl border border-clinical-100 p-2 overflow-hidden"
               >
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                    const ItemIcon = config.icon
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          onChange(key as AppointmentStatus)
                          setIsOpen(false)
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-clinical-50",
                          key === currentStatus ? config.color : "text-clinical-400"
                        )}
                      >
                         <ItemIcon className={cn("h-4 w-4", key === currentStatus ? config.color : "text-clinical-200")} />
                         {key}
                      </button>
                    )
                  })}
               </motion.div>
            </>
          )}
       </AnimatePresence>
    </div>
  )
}

function CitasTab({ patient }: { patient: Patient }) {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null)
  const [deletingLoading, setDeletingLoading] = useState(false)
  const { showToast } = useToast()

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/appointments`)
      const data = await response.json()
      
      // Filter by patient's name matching
      const patientFullName = `${patient.nombres} ${patient.apellidos}`.toLowerCase().trim()
      const filtered = data.filter((cita: any) => {
        const citaName = (cita.patientName || '').toLowerCase().trim()
        return citaName === patientFullName || 
          (citaName.includes(patient.nombres.toLowerCase().trim()) && 
           citaName.includes(patient.apellidos.toLowerCase().trim()))
      })
      
      // Sort descending so the newest/upcoming appointments are at the top
      const sorted = filtered.sort((a: any, b: any) => {
        const dateTimeA = new Date(`${a.date}T${a.time || '00:00'}`)
        const dateTimeB = new Date(`${b.date}T${b.time || '00:00'}`)
        return dateTimeB.getTime() - dateTimeA.getTime()
      })

      setAppointments(sorted)
    } catch (error) {
      console.error('Error fetching appointments for patient:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (patient?.id) {
      fetchAppointments()
    }
  }, [patient])

  const handleStatusChange = async (id: string, newStatus: AppointmentStatus) => {
    try {
      // Optimistic update
      setAppointments(prev => prev.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ))
      
      await axios.patch(`${API_URL}/appointments/${id}`, {
        status: newStatus
      })
      showToast('Estado de la cita actualizado', 'success')
    } catch (err: any) {
      console.error('Error updating status:', err)
      const errorMsg = err.response?.data?.message || 'Error al actualizar el estado de la cita'
      showToast(errorMsg, 'error')
      fetchAppointments() // Rollback on error
    }
  }

  const handleDeleteTrigger = (id: string) => {
    setAppointmentToDelete(id)
  }

  const handleDeleteConfirm = async () => {
    if (!appointmentToDelete) return
    try {
      setDeletingLoading(true)
      await axios.delete(`${API_URL}/appointments/${appointmentToDelete}`)
      setAppointments(prev => prev.filter(app => app.id !== appointmentToDelete))
      showToast('Cita eliminada correctamente', 'success')
      setAppointmentToDelete(null)
    } catch (err) {
      console.error('Error deleting appointment:', err)
      showToast('Error al eliminar la cita', 'error')
    } finally {
      setDeletingLoading(false)
    }
  }

  // Helper to format Spanish month names
  const getMonthAndDay = (dateStr: string) => {
    try {
      const date = new Date(dateStr + 'T12:00:00') // Avoid timezone shifts
      const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
      return {
        day: date.getDate(),
        month: months[date.getMonth()]
      }
    } catch {
      return { day: '??', month: '??' }
    }
  }

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-clinical-900 tracking-tight">Historial de Citas</h2>
       </div>

       {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-clinical-100 shadow-premium">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
             <p className="text-clinical-400 font-bold uppercase tracking-widest text-xs">Cargando historial de citas...</p>
          </div>
       ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-clinical-200">
             <Calendar className="h-12 w-12 text-clinical-200 mb-4 opacity-40" />
             <p className="text-clinical-850 font-black uppercase tracking-widest text-sm mb-2">Sin Citas Agendadas</p>
             <p className="text-clinical-400 font-bold text-xs max-w-sm text-center px-4 leading-relaxed">
               Esta paciente no registra citas en el sistema de agenda médica.
             </p>
          </div>
       ) : (
          <div className="grid gap-4">
             {appointments.map((cita) => {
                const dateInfo = getMonthAndDay(cita.date)
                const isUpcoming = cita.status === 'Agendada' || cita.status === 'Confirmada' || cita.status === 'Sala de espera' || cita.status === 'En consultorio'
                
                return (
                   <div key={cita.id} className="glass-card rounded-[2rem] p-6 border-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-xl transition-all group">
                      <div className="flex items-center gap-6">
                         <div className={cn(
                            "h-16 w-16 rounded-2xl flex flex-col items-center justify-center border transition-transform group-hover:scale-105",
                            isUpcoming ? "bg-primary-50 border-primary-100 text-primary-700" : "bg-clinical-50 border-clinical-100 text-clinical-400"
                         )}>
                            <span className="text-[10px] font-black uppercase tracking-tighter">{dateInfo.month}</span>
                            <span className="text-xl font-black leading-none">{dateInfo.day}</span>
                         </div>
                         <div>
                            <div className="flex items-center gap-2">
                               <h3 className="text-base font-bold text-clinical-900">{cita.reason || cita.type || 'Consulta Médica'}</h3>
                               <span className="px-1.5 py-0.5 rounded bg-primary-50 text-primary-600 text-[8px] font-black uppercase border border-primary-100">{cita.type}</span>
                            </div>
                            <p className="text-[11px] font-bold text-clinical-500 uppercase tracking-widest flex items-center gap-2 mt-1">
                               <Clock className="h-3.5 w-3.5 text-primary-400" /> {cita.time} • {cita.doctorName || 'Dra. Ana García'}
                            </p>
                         </div>
                      </div>

                      <div className="flex items-center gap-4">
                         <StatusDropdown 
                           currentStatus={cita.status || 'Agendada'} 
                           onChange={(newStatus) => handleStatusChange(cita.id, newStatus)} 
                         />
                         
                         <button 
                           onClick={() => handleDeleteTrigger(cita.id)} 
                           className="h-9 w-9 flex items-center justify-center rounded-xl text-clinical-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100 shadow-sm bg-white" 
                           title="Eliminar Cita"
                         >
                            <Trash2 className="h-4 w-4" />
                         </button>
                      </div>
                   </div>
                )
             })}
          </div>
       )}
       <ConfirmDeleteModal 
         isOpen={appointmentToDelete !== null}
         onClose={() => setAppointmentToDelete(null)}
         onConfirm={handleDeleteConfirm}
         loading={deletingLoading}
       />
    </div>
  )
}

function ConfirmDeleteModal({ isOpen, onClose, onConfirm, loading }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, loading?: boolean }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-clinical-900/40 backdrop-blur-[2px]" />
           <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white p-6">
              <div className="flex flex-col items-center text-center space-y-4 py-4">
                 <div className="h-14 w-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 shadow-sm animate-pulse">
                    <Trash2 className="h-6 w-6" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-lg font-black text-clinical-900 leading-tight">¿Eliminar Cita Médica?</h3>
                    <p className="text-xs text-clinical-500 font-bold max-w-[280px] leading-relaxed">
                       ¿Está seguro de que desea eliminar esta cita? Esta acción eliminará el registro de forma permanente de la agenda y de la ficha del paciente.
                    </p>
                 </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                 <button 
                   onClick={onClose} 
                   className="flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-clinical-450 hover:bg-clinical-50 hover:text-clinical-900 transition-all border border-clinical-100"
                 >
                    Cancelar
                 </button>
                 <button 
                   onClick={onConfirm}
                   disabled={loading}
                   className="flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-100 transition-all flex items-center justify-center gap-2"
                 >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Confirmar
                 </button>
              </div>
           </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function DataField({ label, value, icon, className, danger }: any) {
  return (
    <div className={cn("space-y-2", className)}>
       <p className="text-[10px] font-black text-clinical-400 uppercase tracking-widest flex items-center gap-2">
          {icon} {label}
       </p>
       <p className={cn(
         "text-sm font-bold",
         danger ? "text-rose-600" : "text-clinical-900"
       )}>{value}</p>
    </div>
  )
}
