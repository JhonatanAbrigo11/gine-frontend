import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Trash2, 
  Beaker, 
  User, 
  Clock, 
  AlertCircle, 
  Printer, 
  Search,
  Eye,
  Stethoscope,
  ChevronLeft,
  X,
  FileText,
  Activity,
  Calendar,
  Layers,
  FlaskConical,
  Zap
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/widgets/button'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

/* ==================================================
   TYPES & MOCK DATA
   ================================================== */

interface ExamRequest {
  id: string
  name: string
  priority: 'Baja' | 'Media' | 'Alta'
  indications: string
  observations: string
}

const EXAM_CATALOG = {
  'Laboratorio': ['Hemograma completo', 'Glucosa', 'Orina', 'Toxoplasma', 'VIH', 'VDRL', 'TSH', 'Progesterona', 'Prolactina', 'Perfil hormonal'],
  'Ecografía': ['Ecografía transvaginal', 'Ecografía obstétrica', 'Ecografía morfológica', 'Doppler fetal', 'Perfil biofísico'],
  'Imagenología': ['Rayos X de Tórax', 'Mastografía', 'Densitometría ósea'],
  'Perfil hormonal': ['FSH', 'LH', 'Estradiol', 'Progesterona', 'Testosterona'],
  'Monitoreo fetal': ['Monitoreo No Estresante (NST)', 'Prueba de Tolerancia a la Oxitocina'],
  'Otros': ['Biopsia', 'Papanicolaou', 'Cultivo vaginal']
}

export const NuevaOrdenPage: React.FC = () => {
  const [exams, setExams] = useState<ExamRequest[]>([])
  const [orderType, setOrderType] = useState<keyof typeof EXAM_CATALOG>('Laboratorio')
  const [showPreview, setShowPreview] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const [patient] = useState({
    name: 'Ana García López',
    id: '1723456789',
    age: '28 Años',
    hc: '2026-001'
  })

  const [doctor] = useState({
    name: 'Dra. Ana García',
    specialty: 'Ginecología y Obstetricia',
    acess: '7456-2026',
    clinic: 'GineCentro Premium'
  })

  const [orderData] = useState({
    secuencial: 'ORD-2026-0452',
    fecha: '15/5/2026',
    ciudad: 'Quito',
    diagnostico: 'Control prenatal de rutina',
    cie10: 'Z34.0',
    prioridad: 'Normal'
  })

  // Handlers
  const addExam = (name: string = '') => {
    const newExam: ExamRequest = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      priority: 'Media',
      indications: '',
      observations: ''
    }
    setExams([...exams, newExam])
  }

  const removeExam = (id: string) => {
    setExams(exams.filter(e => e.id !== id))
  }

  const updateExam = (id: string, field: keyof ExamRequest, value: string) => {
    setExams(exams.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  const generatePDF = () => {
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
      doc.text(`ORDEN DE ${orderType.toUpperCase()}`, 20, 48)
      doc.setFontSize(10)
      doc.text(`Nro: ${orderData.secuencial}`, 190, 48, { align: 'right' })
      doc.setFont('helvetica', 'normal')
      doc.text(`Fecha: ${orderData.fecha}`, 20, 54)
      
      // Patient Box
      doc.setFillColor(245, 248, 252)
      doc.rect(20, 60, 170, 25, 'F')
      doc.setFont('helvetica', 'bold')
      doc.text('DATOS DEL PACIENTE', 25, 67)
      doc.setFont('helvetica', 'normal')
      doc.text(`Nombre: ${patient.name}`, 25, 73)
      doc.text(`CI: ${patient.id} • Edad: ${patient.age} • HC: ${patient.hc}`, 25, 79)
      doc.text(`Diagnóstico: ${orderData.diagnostico} (${orderData.cie10})`, 110, 73)
      
      // Exams Table
      const tableData = exams.map(e => [
        e.name,
        e.priority,
        `${e.indications}${e.observations ? `\nObs: ${e.observations}` : ''}`
      ])
      
      autoTable(doc, {
        startY: 95,
        head: [['Examen Solicitado', 'Prioridad', 'Indicaciones / Observaciones']],
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
      doc.text(doctor.name.toUpperCase(), 105, finalY + 46, { align: 'center' })
      doc.setFont('helvetica', 'normal')
      doc.text(doctor.specialty, 105, finalY + 51, { align: 'center' })
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(2, 111, 199)
      doc.text(`REG. ACESS: ${doctor.acess}`, 105, finalY + 56, { align: 'center' })

      const pdfString = doc.output('datauristring')
      setPdfUrl(pdfString)
      setShowPreview(true)
    } catch (e) {
      console.error(e)
      alert('Error al generar la orden.')
    }
  }

  return (
    <div className="min-h-screen bg-clinical-50 flex flex-col font-sans">
      {/* Header */}
      <header className="h-20 bg-white border-b border-clinical-100 flex items-center justify-between px-10 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <button className="h-10 w-10 rounded-2xl bg-clinical-50 text-clinical-400 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-all">
             <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-clinical-900 tracking-tight">Nueva Orden Médica</h1>
            <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">Solicitud de Exámenes y Estudios</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <Button onClick={generatePDF} variant="secondary" className="h-11 px-6 rounded-xl border-clinical-200 text-clinical-600 font-black text-xs uppercase tracking-widest">
              <Eye className="h-4 w-4 mr-2" /> Previsualizar
           </Button>
           <Button variant="primary" className="h-11 px-8 rounded-xl shadow-lg shadow-primary-100 font-black text-xs uppercase tracking-widest">
              Guardar Orden
           </Button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
         
         {/* Banner Informativo */}
         <section className="bg-white rounded-[2.5rem] p-8 border border-clinical-100 shadow-premium">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 items-start">
               
               {/* Paciente */}
               <div className="lg:col-span-1 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="h-7 w-7 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center"><User className="h-4 w-4" /></div>
                     <h4 className="text-[10px] font-black text-clinical-900 uppercase tracking-widest">Paciente</h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-clinical-50/50 border border-clinical-100 flex items-center gap-3">
                     <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-primary-600 font-black text-lg shadow-sm">{patient.name.charAt(0)}</div>
                     <div className="min-w-0">
                        <p className="text-xs font-black text-clinical-900 truncate">{patient.name}</p>
                        <p className="text-[9px] font-bold text-clinical-400 uppercase tracking-widest">{patient.age} • HC: {patient.hc}</p>
                     </div>
                  </div>
               </div>

               {/* Tipo de Orden */}
               <div className="lg:col-span-1 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Layers className="h-4 w-4" /></div>
                     <h4 className="text-[10px] font-black text-clinical-900 uppercase tracking-widest">Tipo de Orden</h4>
                  </div>
                  <select 
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as any)}
                    className="w-full h-11 px-4 rounded-xl bg-clinical-50 border border-clinical-100 text-xs font-bold text-clinical-900 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  >
                     {Object.keys(EXAM_CATALOG).map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
               </div>

               {/* Diagnóstico */}
               <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="h-7 w-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><FileText className="h-4 w-4" /></div>
                     <h4 className="text-[10px] font-black text-clinical-900 uppercase tracking-widest">Diagnóstico Asociado</h4>
                  </div>
                  <div className="p-4 rounded-2xl bg-clinical-50/50 border border-clinical-100">
                     <p className="text-xs font-black text-clinical-900">{orderData.diagnostico}</p>
                     <p className="text-[9px] font-bold text-clinical-400 uppercase tracking-widest mt-1">CIE10: {orderData.cie10}</p>
                  </div>
               </div>

               {/* Fecha */}
               <div className="lg:col-span-1 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><Calendar className="h-4 w-4" /></div>
                     <h4 className="text-[10px] font-black text-clinical-900 uppercase tracking-widest">Fecha Emisión</h4>
                  </div>
                  <p className="text-xs font-black text-clinical-900 px-1">{orderData.fecha}</p>
                  <p className="text-[10px] font-bold text-emerald-600 px-1">{orderData.ciudad}</p>
               </div>

            </div>
         </section>

         {/* Sección de Exámenes */}
         <section className="bg-white rounded-[3rem] p-10 border border-clinical-100 shadow-premium">
            <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                     {orderType === 'Laboratorio' ? <FlaskConical className="h-6 w-6" /> : <Activity className="h-6 w-6" />}
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-clinical-900 tracking-tight">Estudios Solicitados</h3>
                     <p className="text-xs font-bold text-clinical-400 uppercase tracking-widest mt-1">Categoría: {orderType}</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-3">
                  <select 
                    className="h-12 px-4 rounded-2xl bg-clinical-50 border border-clinical-100 text-[10px] font-black uppercase tracking-widest outline-none"
                    onChange={(e) => {
                      if (e.target.value) addExam(e.target.value)
                      e.target.value = ''
                    }}
                  >
                     <option value="">Seleccionar rápido...</option>
                     {EXAM_CATALOG[orderType].map(exam => <option key={exam} value={exam}>{exam}</option>)}
                  </select>
                  <Button variant="secondary" onClick={() => addExam()} className="h-12 px-8 rounded-2xl border-indigo-200 text-indigo-600 text-xs font-black uppercase tracking-widest shadow-sm hover:bg-indigo-50">
                     <Plus className="h-4 w-4 mr-2" /> Agregar Personalizado
                  </Button>
               </div>
            </div>

            <div className="space-y-6">
               {exams.map((exam, index) => (
                 <motion.div 
                   initial={{ opacity: 0, x: -20 }} 
                   animate={{ opacity: 1, x: 0 }} 
                   key={exam.id} 
                   className="p-8 rounded-[2.5rem] bg-clinical-50/30 border border-clinical-100 relative group hover:bg-white hover:shadow-xl transition-all"
                 >
                    <button 
                      onClick={() => removeExam(exam.id)} 
                      className="absolute top-4 right-4 h-10 w-10 rounded-2xl bg-white border border-rose-100 text-rose-500 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 hover:scale-110"
                    >
                       <Trash2 className="h-5 w-5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                       <div className="md:col-span-5">
                          <label className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-2.5 block">Nombre del Estudio / Examen</label>
                          <div className="relative">
                             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-clinical-300" />
                             <input 
                               value={exam.name}
                               onChange={(e) => updateExam(exam.id, 'name', e.target.value)}
                               placeholder="Ej: Hemograma completo"
                               className="w-full h-12 pl-12 pr-4 rounded-xl bg-white border-none ring-1 ring-clinical-100 text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none shadow-sm transition-all"
                             />
                          </div>
                       </div>
                       
                       <div className="md:col-span-3">
                          <label className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-2.5 block">Prioridad</label>
                          <div className="flex items-center gap-2 h-12">
                             {(['Baja', 'Media', 'Alta'] as const).map(p => (
                               <button
                                 key={p}
                                 onClick={() => updateExam(exam.id, 'priority', p)}
                                 className={cn(
                                   "flex-1 h-full rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                                   exam.priority === p 
                                     ? p === 'Alta' ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm' :
                                       p === 'Media' ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-sm' :
                                       'bg-primary-50 border-primary-200 text-primary-600 shadow-sm'
                                     : 'bg-white border-clinical-100 text-clinical-300 hover:bg-clinical-50'
                                 )}
                               >
                                  {p}
                               </button>
                             ))}
                          </div>
                       </div>

                       <div className="md:col-span-4">
                          <label className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-2.5 block">Indicaciones al Paciente</label>
                          <input 
                            value={exam.indications}
                            onChange={(e) => updateExam(exam.id, 'indications', e.target.value)}
                            placeholder="Ej: Ayuno de 8 horas"
                            className="w-full h-12 px-4 rounded-xl bg-white border-none ring-1 ring-clinical-100 text-sm font-medium text-clinical-700 shadow-sm outline-none focus:ring-2 focus:ring-primary-500"
                          />
                       </div>

                       <div className="md:col-span-12">
                          <label className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-2.5 block">Observaciones Médicas / Justificación</label>
                          <textarea 
                            value={exam.observations}
                            onChange={(e) => updateExam(exam.id, 'observations', e.target.value)}
                            placeholder="Describa el motivo clínico del estudio si es necesario..."
                            rows={2}
                            className="w-full p-4 rounded-2xl bg-white border-none ring-1 ring-clinical-100 text-sm font-medium text-clinical-700 shadow-sm outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-all"
                          />
                       </div>
                    </div>
                 </motion.div>
               ))}

               {exams.length === 0 && (
                 <div className="h-64 flex flex-col items-center justify-center border-4 border-dashed border-clinical-50 rounded-[3rem] bg-clinical-50/10 text-clinical-200">
                    <FlaskConical className="h-16 w-16 mb-6 opacity-10" />
                    <p className="text-lg font-black uppercase tracking-widest">No hay estudios en la orden</p>
                    <div className="flex items-center gap-4 mt-8">
                       <button onClick={() => addExam()} className="h-12 px-10 rounded-2xl bg-white border border-clinical-200 text-primary-600 font-black text-xs uppercase tracking-widest hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all shadow-sm">
                          Comenzar orden
                       </button>
                    </div>
                 </div>
               )}
            </div>
         </section>
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
                     <button onClick={() => setShowPreview(false)} className="h-11 w-11 rounded-xl bg-white border border-clinical-100 text-clinical-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all"><X className="h-5 w-5" /></button>
                  </div>
                  <div className="flex-1 bg-clinical-100/50 p-8 overflow-hidden"><iframe src={pdfUrl} className="w-full h-full rounded-2xl shadow-inner border border-clinical-200 bg-white" /></div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  )
}
