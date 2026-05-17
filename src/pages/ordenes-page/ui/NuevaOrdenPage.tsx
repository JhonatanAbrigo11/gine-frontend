import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Trash2, 
  Search, 
  Eye, 
  ArrowLeft,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  Clock,
  Printer,
  Upload,
  FileUp,
  Beaker, 
  User, 
  Stethoscope,
  X,
  Activity,
  Calendar,
  Layers,
  FlaskConical,
  Zap,
  Info
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/widgets/button'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { orderService } from '@/modules/orders/services/order.service'
import type { OrderType, MedicalExam, ExamCategory } from '@/modules/orders/types/order.types'
import axios from 'axios'
import { toast } from 'sonner'
import { API_URL } from '@/shared/api/base'

export const NuevaOrdenPage: React.FC = () => {
  const { patientId, orderId } = useParams<{ patientId?: string, orderId?: string }>()
  const location = useLocation()
  const consultationId = location.state?.consultationId
  const initialType = location.state?.type
  const navigate = useNavigate()
  
  // State
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([])
  const [selectedType, setSelectedType] = useState<OrderType | null>(null)
  const [selectedExams, setSelectedExams] = useState<MedicalExam[]>([])
  const [patient, setPatient] = useState<any>(null)
  
  const [observations, setObservations] = useState('')
  const [diagnosis, setDiagnosis] = useState('Control prenatal / Rutina')
  const [priority, setPriority] = useState('Normal')
  
  const [showPreview, setShowPreview] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const typesData = await orderService.getOrderTypes()
        setOrderTypes(typesData)

        // Selección automática por tipo si viene de consulta
        if (initialType && !orderId) {
            const found = typesData.find(t => t.name.toLowerCase().includes(initialType.toLowerCase()))
            if (found) setSelectedType(found)
        }

        if (orderId) {
          // Edit mode: fetch order details
          const orderData = await orderService.getOrderDetails(orderId)
          setPatient(orderData.patient)
          
          // Buscar el tipo completo en el catálogo cargado para tener las categorías
          const fullType = typesData.find(t => t.id === orderData.orderTypeId)
          setSelectedType(fullType || (orderData.orderType as any))
          setObservations(orderData.observations || '')
          setDiagnosis(orderData.diagnosis || '')
          setPriority(orderData.priority || 'Normal')
          
          // Map items to selected exams
          const exams = orderData.items?.map(item => item.exam) || []
          setSelectedExams(exams)
        } else if (patientId) {
          // New mode: fetch patient details
          const patientData = await axios.get(`${API_URL}/patients/${patientId}`).then(res => res.data)
          setPatient(patientData)
          if (typesData.length > 0 && !initialType) {
            setSelectedType(typesData[0])
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Error al cargar la información')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [patientId, orderId, initialType])

  // Limpieza de URL en caliente: Si el usuario recarga una URL antigua con UUID, lo redirigimos silenciosamente a la cédula
  useEffect(() => {
    if (patient && patient.numeroDocumento && patientId && patientId !== patient.numeroDocumento) {
      navigate(location.pathname.replace(patientId, patient.numeroDocumento), { 
        replace: true, 
        state: location.state 
      })
    }
  }, [patient, patientId, location.pathname, location.state, navigate])

  // Handlers
  const toggleExam = (exam: MedicalExam) => {
    const isSelected = selectedExams.find(e => e.id === exam.id)
    if (isSelected) {
      setSelectedExams(selectedExams.filter(e => e.id !== exam.id))
    } else {
      setSelectedExams([...selectedExams, exam])
    }
  }

  const handleSave = async () => {
    if (selectedExams.length === 0) {
      toast.warning('Debe seleccionar al menos un examen')
      return
    }

    if (!selectedType) return

    try {
      setSaving(true)
      const examIds = selectedExams.map(e => e.id)
      
      const orderPayload = {
        patientId: patient?.id || patientId!,
        orderTypeId: selectedType.id,
        priority,
        observations,
        diagnosis,
        examIds,
        consultationId: consultationId || undefined
      }

      if (orderId) {
        await orderService.updateOrder(orderId, orderPayload)
        toast.success('Orden actualizada correctamente')
        navigate('/ordenes')
      } else {
        await orderService.createOrder(orderPayload)
        if (consultationId) {
          setShowSuccessModal(true)
        } else {
          toast.success('Orden médica generada exitosamente')
          navigate('/ordenes')
        }
      }
    } catch (error) {
      console.error('Error saving order:', error)
      toast.error(orderId ? 'Error al actualizar la orden' : 'Error al guardar la orden')
    } finally {
      setSaving(false)
    }
  }

  const generatePDF = () => {
    if (!patient || !selectedType || selectedExams.length === 0) return

    try {
      const doc = new jsPDF()
      const doctor = {
        name: 'Dr. Andrés Morquecho',
        specialty: 'Ginecología y Obstetricia',
        acess: '7456-2026',
        clinic: 'JAIMS Ginecología Premium'
      }

      // Header
      doc.setFillColor(2, 111, 199)
      doc.roundedRect(20, 15, 12, 12, 3, 3, 'F')
      doc.setTextColor(255)
      doc.setFontSize(10)
      doc.text('G', 26, 23, { align: 'center' })
      
      doc.setFontSize(16)
      doc.setTextColor(2, 111, 199)
      doc.setFont('helvetica', 'bold')
      doc.text(doctor.clinic, 35, 22)
      
      doc.setFontSize(8)
      doc.setTextColor(100)
      doc.setFont('helvetica', 'normal')
      doc.text('Ginecología y Obstetricia de Alta Especialidad', 35, 26)
      doc.text(`Quito, Ecuador • Tel: (02) 2555-000`, 20, 35)
      
      doc.setDrawColor(2, 111, 199)
      doc.setLineWidth(0.5)
      doc.line(20, 38, 190, 38)
      
      // Order Info
      doc.setFontSize(12)
      doc.setTextColor(0)
      doc.setFont('helvetica', 'bold')
      doc.text(`ORDEN DE ${selectedType.name.toUpperCase()}`, 20, 48)
      doc.setFontSize(10)
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 190, 48, { align: 'right' })
      
      // Patient Box
      doc.setFillColor(245, 248, 252)
      doc.rect(20, 60, 170, 25, 'F')
      doc.setFont('helvetica', 'bold')
      doc.text('DATOS DEL PACIENTE', 25, 67)
      doc.setFont('helvetica', 'normal')
      doc.text(`Nombre: ${patient.nombres} ${patient.apellidos}`, 25, 73)
      doc.text(`ID/CI: ${patient.numeroDocumento} • Sexo: Femenino`, 25, 79)
      doc.text(`Diagnóstico: ${diagnosis}`, 110, 73)
      
      // Exams Table
      const tableData = selectedExams.map(e => [
        e.code || '-',
        e.name,
        e.sampleType?.name || 'N/A',
        e.preparations?.map(p => p.title).join(', ') || 'Sin preparación especial'
      ])
      
      autoTable(doc, {
        startY: 95,
        head: [['Cód.', 'Examen / Estudio', 'Muestra', 'Preparación']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [2, 111, 199], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 4 }
      })
      
      // Recommendations / Observations
      const finalY = (doc as any).lastAutoTable.finalY || 150
      if (observations) {
        doc.setFont('helvetica', 'bold')
        doc.text('OBSERVACIONES / RECOMENDACIONES:', 20, finalY + 15)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.text(observations, 20, finalY + 22, { maxWidth: 170 })
      }

      // Footer
      const footerY = 250
      doc.line(70, footerY, 140, footerY)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text(doctor.name.toUpperCase(), 105, footerY + 6, { align: 'center' })
      doc.setFont('helvetica', 'normal')
      doc.text(doctor.specialty, 105, footerY + 11, { align: 'center' })
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(2, 111, 199)
      doc.text(`REG. ACESS: ${doctor.acess}`, 105, footerY + 16, { align: 'center' })

      const pdfString = doc.output('datauristring')
      setPdfUrl(pdfString)
      setShowPreview(true)
    } catch (e) {
      console.error(e)
      toast.error('Error al generar la orden.')
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-clinical-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-black text-clinical-900 uppercase tracking-widest">Cargando Catálogo Clínico...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-clinical-50 flex flex-col font-sans">
      {/* Header */}
      <header className="h-20 bg-white border-b border-clinical-100 flex items-center justify-between px-10 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-2xl bg-clinical-50 text-clinical-400 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-all"
          >
             <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-clinical-900 tracking-tight">
              {orderId ? 'Editar' : 'Nueva'} Orden Médica
            </h1>
            <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">Diagnóstico por {selectedType?.name || '...'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <Button onClick={generatePDF} variant="secondary" className="h-11 px-6 rounded-xl border-clinical-200 text-clinical-600 font-black text-xs uppercase tracking-widest">
              <Eye className="h-4 w-4 mr-2" /> Previsualizar
           </Button>
           <Button 
            onClick={handleSave} 
            loading={saving}
            variant="primary" 
            className="h-11 px-8 rounded-xl shadow-lg shadow-primary-100 font-black text-xs uppercase tracking-widest"
           >
              {orderId ? 'Guardar Cambios' : 'Finalizar Orden'}
           </Button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
         
         {/* Datos del Paciente y Selección de Tipo */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-clinical-100 shadow-premium">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  {/* Paciente */}
                  <div className="space-y-4">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="h-7 w-7 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center"><User className="h-4 w-4" /></div>
                        <h4 className="text-[10px] font-black text-clinical-900 uppercase tracking-widest">Paciente Seleccionado</h4>
                     </div>
                     <div className="p-4 rounded-2xl bg-clinical-50/50 border border-clinical-100 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-primary-600 font-black text-lg shadow-sm">
                          {patient?.nombres?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                           <p className="text-xs font-black text-clinical-900 truncate">{patient?.nombres} {patient?.apellidos}</p>
                           <p className="text-[9px] font-bold text-clinical-400 uppercase tracking-widest">CI: {patient?.numeroDocumento}</p>
                        </div>
                     </div>
                  </div>

                  {/* Diagnóstico */}
                  <div className="space-y-4">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="h-7 w-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><FileText className="h-4 w-4" /></div>
                        <h4 className="text-[10px] font-black text-clinical-900 uppercase tracking-widest">Motivo de la Orden</h4>
                     </div>
                     <input 
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl bg-clinical-50 border border-clinical-100 text-xs font-bold text-clinical-900 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        placeholder="Ej: Control prenatal, Sospecha de SOP..."
                     />
                  </div>
               </div>
            </section>

            <section className="bg-white rounded-[2.5rem] p-8 border border-clinical-100 shadow-premium">
               <div className="flex items-center gap-3 mb-4">
                  <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Layers className="h-4 w-4" /></div>
                  <h4 className="text-[10px] font-black text-clinical-900 uppercase tracking-widest">Tipo de Estudio</h4>
               </div>
               <div className="flex gap-2">
                  {orderTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedType(type)
                        setSelectedExams([])
                      }}
                      className={cn(
                        "flex-1 h-12 rounded-xl flex items-center justify-center gap-2 border transition-all text-[10px] font-black uppercase tracking-widest",
                        selectedType?.id === type.id 
                          ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm" 
                          : "bg-white border-clinical-100 text-clinical-400 hover:bg-clinical-50"
                      )}
                    >
                      <Beaker className="h-4 w-4" />
                      {type.name}
                    </button>
                  ))}
               </div>
            </section>
         </div>

         {/* Catálogo Dinámico de Exámenes */}
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-8">
               {selectedType?.categories?.map((category: ExamCategory) => (
                  <section key={category.id} className="bg-white rounded-[2.5rem] p-8 border border-clinical-100 shadow-premium overflow-hidden">
                     <div className="flex items-center gap-4 mb-8">
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center shadow-sm",
                          category.color === 'rose' ? "bg-rose-50 text-rose-500" :
                          category.color === 'amber' ? "bg-amber-50 text-amber-500" :
                          category.color === 'emerald' ? "bg-emerald-50 text-emerald-500" :
                          "bg-indigo-50 text-indigo-500"
                        )}>
                           <Activity className="h-5 w-5" />
                        </div>
                        <div>
                           <h3 className="text-lg font-black text-clinical-900 tracking-tight">{category.name}</h3>
                           <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">Seleccione los estudios necesarios</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {category.exams.map(exam => {
                           const isSelected = selectedExams.find(e => e.id === exam.id)
                           return (
                              <button
                                 key={exam.id}
                                 onClick={() => toggleExam(exam)}
                                 className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl border transition-all text-left group",
                                    isSelected 
                                       ? "bg-primary-50 border-primary-200 shadow-sm" 
                                       : "bg-clinical-50/50 border-clinical-100 hover:bg-white hover:border-primary-100 hover:shadow-md"
                                 )}
                              >
                                 <div className="flex items-center gap-3">
                                    <div className={cn(
                                       "h-6 w-6 rounded-lg flex items-center justify-center transition-all",
                                       isSelected ? "bg-primary-600 text-white" : "bg-white border border-clinical-200 text-clinical-300 group-hover:border-primary-300"
                                    )}>
                                       {isSelected ? <CheckCircle2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                    </div>
                                    <span className={cn(
                                       "text-xs font-bold",
                                       isSelected ? "text-primary-900" : "text-clinical-600 group-hover:text-clinical-900"
                                    )}>{exam.name}</span>
                                 </div>
                                 {exam.code && <span className="text-[9px] font-black text-clinical-300 uppercase tracking-widest">{exam.code}</span>}
                              </button>
                           )
                        })}
                     </div>
                  </section>
               ))}
            </div>

            {/* Panel de Resumen y Preparación */}
            <aside className="space-y-8">
               <section className="bg-white rounded-[2.5rem] p-8 border border-clinical-100 shadow-premium sticky top-28">
                  <div className="flex items-center justify-between mb-8">
                     <h4 className="text-[10px] font-black text-clinical-900 uppercase tracking-widest">Resumen de Selección</h4>
                     <span className="h-6 w-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-[10px] font-black">{selectedExams.length}</span>
                  </div>

                  <div className="space-y-3 mb-8 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                     {selectedExams.map(exam => (
                        <div key={exam.id} className="flex items-center justify-between group">
                           <span className="text-xs font-bold text-clinical-600 truncate mr-2">{exam.name}</span>
                           <button onClick={() => toggleExam(exam)} className="text-rose-400 opacity-0 group-hover:opacity-100 transition-all"><X className="h-4 w-4" /></button>
                        </div>
                     ))}
                     {selectedExams.length === 0 && (
                        <div className="py-8 flex flex-col items-center justify-center text-center">
                           <FlaskConical className="h-10 w-10 text-clinical-100 mb-4" />
                           <p className="text-[10px] font-bold text-clinical-300 uppercase tracking-widest">No hay exámenes seleccionados</p>
                        </div>
                     )}
                  </div>

                  {selectedExams.length > 0 && (
                     <div className="space-y-6 pt-6 border-t border-clinical-100">
                        <div>
                           <div className="flex items-center gap-2 mb-3">
                              <Info className="h-3.5 w-3.5 text-primary-600" />
                              <h5 className="text-[9px] font-black text-clinical-900 uppercase tracking-widest">Preparación Requerida</h5>
                           </div>
                           <div className="space-y-2">
                              {Array.from(new Map(selectedExams.flatMap(e => e.preparations || []).map(p => [p.id, p])).values()).map(prep => (
                                 <div key={prep.id} className="p-3 rounded-xl bg-clinical-50 border border-clinical-100">
                                    <p className="text-[9px] font-black text-clinical-900 uppercase mb-1">{prep.title}</p>
                                    <p className="text-[9px] text-clinical-500 leading-tight">{prep.content}</p>
                                 </div>
                              ))}
                              {selectedExams.every(e => !e.preparations?.length) && (
                                 <p className="text-[9px] font-bold text-clinical-400 italic">No requiere preparación especial.</p>
                              )}
                           </div>
                        </div>

                        <div>
                           <div className="flex items-center gap-2 mb-3">
                              <Stethoscope className="h-3.5 w-3.5 text-clinical-600" />
                              <h5 className="text-[9px] font-black text-clinical-900 uppercase tracking-widest">Observaciones Adicionales</h5>
                           </div>
                           <textarea 
                              value={observations}
                              onChange={(e) => setObservations(e.target.value)}
                              rows={3}
                              className="w-full p-4 rounded-2xl bg-clinical-50 border border-clinical-100 text-[11px] font-medium text-clinical-700 outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                              placeholder="Indicaciones específicas para el laboratorio o clínica..."
                           />
                        </div>
                     </div>
                  )}
               </section>
            </aside>
         </div>
      </main>

      {/* Preview Modal */}
      <AnimatePresence>
         {showPreview && pdfUrl && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPreview(false)} className="absolute inset-0 bg-clinical-900/40 backdrop-blur-sm" />
               <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-6xl h-full max-h-[95vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
                  <div className="h-20 border-b border-clinical-100 flex items-center justify-between px-8 bg-clinical-50/50">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary-600 text-white flex items-center justify-center"><FileText className="h-5 w-5" /></div>
                        <div><h3 className="text-lg font-black text-clinical-900">Previsualización de Orden</h3><p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">Verifique los estudios antes de imprimir</p></div>
                     </div>
                     <div className="flex items-center gap-3">
                        <Button variant="primary" className="h-11 px-6 rounded-xl shadow-lg shadow-primary-100 font-black text-xs uppercase tracking-widest">
                           <Printer className="h-4 w-4 mr-2" /> Imprimir Ahora
                        </Button>
                        <button onClick={() => setShowPreview(false)} className="h-11 w-11 rounded-xl bg-white border border-clinical-100 text-clinical-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all"><X className="h-5 w-5" /></button>
                     </div>
                  </div>
                  <div className="flex-1 bg-clinical-100/50 p-8 overflow-hidden"><iframe src={pdfUrl} className="w-full h-full rounded-2xl shadow-inner border border-clinical-200 bg-white" title="PDF Preview" /></div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-clinical-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
            >
              <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                 <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-clinical-900 mb-2">¡Orden Generada!</h3>
              <p className="text-sm font-medium text-clinical-600 mb-8">
                La orden médica se ha guardado y vinculado a la consulta exitosamente.
              </p>
              
              <div className="flex flex-col gap-3 w-full">
                <Button 
                  onClick={() => navigate(`/consultas/activa/${patient?.numeroDocumento || patientId}`, { state: { consultationId } })}
                  className="w-full h-12 rounded-xl text-sm font-bold bg-primary-600 text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Regresar a la Consulta
                </Button>
                <Button 
                  onClick={() => navigate('/ordenes')}
                  variant="secondary"
                  className="w-full h-12 rounded-xl text-sm font-bold border-clinical-200 text-clinical-600"
                >
                  Ir al Listado de Órdenes
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
