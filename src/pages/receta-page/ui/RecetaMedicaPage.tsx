import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Trash2, 
  Pill, 
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
  Download
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/widgets/button'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

/* ==================================================
   MOCK DATA & TYPES
   ================================================== */

interface PrescribedMedicine {
  id: string
  generic: string
  form: string
  concentration: string
  route: string
  quantity: string
  quantityLetters: string
  dose: string
  frequency: string
  duration: string
  indications: string
}

const MOCK_MEDICINES = [
  { id: '1', generic: 'Paracetamol', concentration: '500 mg', form: 'Tableta' },
  { id: '2', generic: 'Ibuprofeno', concentration: '400 mg', form: 'Cápsula' },
  { id: '3', generic: 'Amoxicilina', concentration: '875 mg', form: 'Tableta' },
  { id: '4', generic: 'Diclofenaco', concentration: '75 mg', form: 'Ampolla' },
]

export const RecetaMedicaPage: React.FC = () => {
  // States
  const [medicines, setMedicines] = useState<PrescribedMedicine[]>([])
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

  const [recipeData, setRecipeData] = useState({
    secuencial: 'REC-2026-0045',
    fecha: '15/5/2026',
    ciudad: 'Quito',
    diagnostico: 'Control prenatal de rutina',
    cie10: 'Z34.0',
    vigencia: '3 días',
    vigenciaTipo: 'Consulta externa',
    alergias: 'Ninguna conocida'
  })

  // Handlers
  const addMedicine = (med?: any) => {
    const newMed: PrescribedMedicine = {
      id: Math.random().toString(36).substr(2, 9),
      generic: med?.generic || '',
      form: med?.form || '',
      concentration: med?.concentration || '',
      route: med?.route || '',
      quantity: '',
      quantityLetters: '',
      dose: '',
      frequency: '',
      duration: '',
      indications: ''
    }
    setMedicines([...medicines, newMed])
  }

  const removeMedicine = (id: string) => {
    setMedicines(medicines.filter(m => m.id !== id))
  }

  const updateMedicine = (id: string, field: keyof PrescribedMedicine, value: string) => {
    setMedicines(medicines.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const generatePDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })
      
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const colWidth = (pageWidth - 60) / 2
      const midPoint = pageWidth / 2

      // Logo Base64 (Stylized Medical Logo)
      const logoBase64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0OCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDI2ZmM3IiBzdHJva2Utd2lkdGg9IjQiLz48cGF0aCBkPSJNNTAgMjAgTDUwIDgwIE0yMCA1MCBMODAgNTAiIHN0cm9rZT0iIzAyNmZjNyIgc3Ryb2tlLXdpZHRoPSI4IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4="
      // Pre-faded logo for watermark (5% opacity)
      const logoFadedBase64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBvcGFjaXR5PSIwLjA1Ij48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0OCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDI2ZmM3IiBzdHJva2Utd2lkdGg9IjQiLz48cGF0aCBkPSJNNTAgMjAgTDUwIDgwIE0yMCA1MCBMODAgNTAiIHN0cm9rZT0iIzAyNmZjNyIgc3Ryb2tlLXdpZHRoPSI4IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4="

      const drawColumnContent = (x: number, type: 'rp' | 'indications') => {
        // Subtle Logo Watermark (Using pre-faded SVG to avoid GState issues)
        try {
          doc.addImage(logoFadedBase64, 'SVG', x + colWidth/2 - 25, 80, 50, 50)
        } catch (e) {}

        // Header with Logo
        try {
          doc.addImage(logoBase64, 'SVG', x, 15, 12, 12)
        } catch (e) { /* fallback if SVG fail */ }
        
        doc.setFontSize(16)
        doc.setTextColor(2, 111, 199)
        doc.setFont('helvetica', 'bold')
        doc.text(doctor.clinic, x + 15, 21)
        
        doc.setFontSize(7)
        doc.setTextColor(140)
        doc.setFont('helvetica', 'normal')
        doc.text('Ginecología y Obstetricia de Alta Especialidad', x + 15, 25)
        doc.text('Quito, Ecuador • Av. Amazonas N34-45 • Tel: (02) 2555-000', x, 34)

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
        doc.text(`RECETA MÉDICA Nro: ${recipeData.secuencial}`, x + 5, 49)
        
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100)
        doc.text(`Fecha: ${recipeData.fecha}`, x + 5, 55)
        doc.text(`Vence: ${recipeData.vigencia}`, x + colWidth - 5, 55, { align: 'right' })
        
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
        medicines.forEach((med, i) => {
          doc.setFontSize(10)
          doc.setTextColor(30)
          doc.setFont('helvetica', 'bold')
          doc.text(`${i + 1}. ${med.generic} ${med.concentration ? `(${med.concentration})` : ''}`, x + 2, currentY)
          
          doc.setFontSize(8.5)
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(80)
          if (type === 'rp') {
             doc.text(`Cantidad: ${med.quantity} (${med.quantityLetters})`, x + 6, currentY + 5)
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
        doc.text(`DIAGNÓSTICO: ${recipeData.diagnostico} (${recipeData.cie10})`, x, 165)

        // Footer Firma
        const footerY = 180
        doc.setDrawColor(2, 111, 199)
        doc.setLineWidth(0.6)
        doc.line(x + (colWidth/4), footerY, x + (colWidth*3/4), footerY)
        
        doc.setFontSize(10)
        doc.setTextColor(40)
        doc.setFont('helvetica', 'bold')
        doc.text(doctor.name.toUpperCase(), x + (colWidth/2), footerY + 6, { align: 'center' })
        
        doc.setFontSize(8)
        doc.setTextColor(100)
        doc.setFont('helvetica', 'normal')
        doc.text(doctor.specialty, x + (colWidth/2), footerY + 10, { align: 'center' })
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(2, 111, 199)
        doc.text(`REG. ACESS: ${doctor.acess}`, x + (colWidth/2), footerY + 14, { align: 'center' })
      }

      // Draw Left Column (RP)
      drawColumnContent(20, 'rp')
      
      // Vertical Divider
      doc.setDrawColor(230)
      doc.setLineWidth(0.3)
      doc.setLineDash([2, 2])
      doc.line(midPoint, 10, midPoint, 200)
      doc.setLineDash([])

      // Draw Right Column (Indications)
      drawColumnContent(midPoint + 10, 'indications')

      const pdfString = doc.output('datauristring')
      setPdfUrl(pdfString)
      setShowPreview(true)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error al generar la receta profesional.')
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
            <h1 className="text-xl font-black text-clinical-900 tracking-tight">Módulo de Recetas Médicas</h1>
            <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">Normativa ACESS Ecuador 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="text-right hidden md:block">
              <p className="text-[10px] font-black text-clinical-900 uppercase tracking-widest">{recipeData.ciudad}, {recipeData.fecha}</p>
              <p className="text-[9px] font-bold text-primary-600 uppercase tracking-widest">Estado: Borrador en edición</p>
           </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
         {/* Banner de Información Horizontal */}
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

               {/* Emisión */}
               <div className="lg:col-span-1 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Clock className="h-4 w-4" /></div>
                     <h4 className="text-[10px] font-black text-clinical-900 uppercase tracking-widest">Emisión</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                     <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-black text-clinical-400 uppercase tracking-widest ml-1">Secuencial</span>
                        <input readOnly value={recipeData.secuencial} className="h-8 px-3 rounded-lg bg-clinical-50 border border-clinical-100 text-[10px] font-bold text-clinical-900" />
                     </div>
                     <select 
                       className="w-full h-9 px-3 rounded-lg bg-clinical-50 border border-clinical-100 text-[10px] font-bold text-clinical-900 outline-none"
                       onChange={(e) => {
                         const val = e.target.value
                         let days = '3 días'
                         if (val === 'Emergencia' || val === 'Hospitalización') days = '1 día'
                         setRecipeData({ ...recipeData, vigenciaTipo: val, vigencia: days })
                       }}
                     >
                        <option>Consulta externa</option>
                        <option>Antimicrobianos</option>
                        <option>Emergencia</option>
                        <option>Hospitalización</option>
                     </select>
                  </div>
               </div>

               {/* Profesional */}
               <div className="lg:col-span-1 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="h-7 w-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><Stethoscope className="h-4 w-4" /></div>
                     <h4 className="text-[10px] font-black text-clinical-900 uppercase tracking-widest">Profesional</h4>
                  </div>
                  <div className="space-y-1 px-1">
                     <p className="text-xs font-black text-clinical-900">{doctor.name}</p>
                     <p className="text-[9px] font-bold text-clinical-400 uppercase tracking-widest">{doctor.specialty}</p>
                     <p className="text-[8px] font-bold text-primary-600">REG. ACESS: {doctor.acess}</p>
                  </div>
               </div>

               {/* Alergias / Alerta */}
               <div className="lg:col-span-1 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="h-7 w-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><AlertCircle className="h-4 w-4" /></div>
                     <h4 className="text-[10px] font-black text-clinical-900 uppercase tracking-widest">Advertencias</h4>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                     <p className="text-[9px] font-bold text-amber-700 leading-tight">Alergia reportada a: <span className="font-black underline">{recipeData.alergias}</span></p>
                  </div>
               </div>

               {/* Acciones de Impresión (Eliminado de aquí) */}
               <div className="lg:col-span-1 hidden">
               </div>

            </div>
         </section>

         {/* Área de Receta - Ancho Completo */}
         <section className="bg-white rounded-[3rem] p-10 border border-clinical-100 shadow-premium">
            <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner"><Pill className="h-6 w-6" /></div>
                  <div>
                     <h3 className="text-2xl font-black text-clinical-900 tracking-tight">Prescripción Médica</h3>
                     <p className="text-xs font-bold text-clinical-400 uppercase tracking-widest mt-1">CIE-10: {recipeData.cie10} • {recipeData.diagnostico}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <Button 
                    variant="secondary" 
                    onClick={generatePDF}
                    disabled={medicines.length === 0}
                    className="h-12 px-6 rounded-2xl border-clinical-200 text-clinical-600 text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-clinical-50 transition-all disabled:opacity-30"
                  >
                     <Eye className="h-4 w-4 mr-2" /> Previsualizar
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => addMedicine()} 
                    className="h-12 px-8 rounded-2xl shadow-lg shadow-primary-100 font-black text-xs uppercase tracking-widest"
                  >
                     <Plus className="h-4 w-4 mr-2" /> Agregar Medicamento
                  </Button>
               </div>
            </div>

            <div className="space-y-6">
               {medicines.map((med, index) => (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }} 
                   animate={{ opacity: 1, y: 0 }} 
                   key={med.id} 
                   className="p-8 rounded-[2.5rem] bg-clinical-50/30 border border-clinical-100 relative group hover:bg-white hover:shadow-xl transition-all"
                 >
                    <button 
                      onClick={() => removeMedicine(med.id)} 
                      className="absolute top-4 right-4 h-10 w-10 rounded-2xl bg-white border border-rose-100 text-rose-500 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 hover:scale-110"
                    >
                       <Trash2 className="h-5 w-5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                       <div className="md:col-span-5">
                          <label className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-2.5 block">Nombre Genérico (DCI)</label>
                          <div className="relative">
                             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-clinical-300" />
                             <input 
                               list="medicine-list"
                               value={med.generic}
                               onChange={(e) => updateMedicine(med.id, 'generic', e.target.value)}
                               placeholder="Buscar medicamento..."
                               className="w-full h-12 pl-12 pr-4 rounded-xl bg-white border-none ring-1 ring-clinical-100 text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none shadow-sm transition-all"
                             />
                             <datalist id="medicine-list">
                                {MOCK_MEDICINES.map(m => <option key={m.id} value={m.generic} />)}
                             </datalist>
                          </div>
                       </div>
                       <div className="md:col-span-3">
                          <label className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-2.5 block">Concentración</label>
                          <input 
                            value={med.concentration}
                            onChange={(e) => updateMedicine(med.id, 'concentration', e.target.value)}
                            placeholder="Ej: 500 mg"
                            className="w-full h-12 px-4 rounded-xl bg-white border-none ring-1 ring-clinical-100 text-sm font-bold text-clinical-900 shadow-sm"
                          />
                       </div>
                       <div className="md:col-span-2">
                          <label className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-2.5 block">Vía</label>
                          <select 
                            value={med.route}
                            onChange={(e) => updateMedicine(med.id, 'route', e.target.value)}
                            className="w-full h-12 px-4 rounded-xl bg-white border-none ring-1 ring-clinical-100 text-xs font-bold text-clinical-900 shadow-sm outline-none"
                          >
                             <option>Oral</option>
                             <option>Intravenosa</option>
                             <option>Intramuscular</option>
                             <option>Tópica</option>
                             <option>Vaginal</option>
                          </select>
                       </div>
                       <div className="md:col-span-2">
                          <label className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-2.5 block">Cant. (Núm.)</label>
                          <input 
                            type="number"
                            value={med.quantity}
                            onChange={(e) => updateMedicine(med.id, 'quantity', e.target.value)}
                            placeholder="14"
                            className="w-full h-12 px-4 rounded-xl bg-white border-none ring-1 ring-clinical-100 text-sm font-black text-center text-clinical-900 shadow-sm"
                          />
                       </div>
                       <div className="md:col-span-3">
                          <label className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-2.5 block">Cant. (Letras)</label>
                          <input 
                            value={med.quantityLetters}
                            onChange={(e) => updateMedicine(med.id, 'quantityLetters', e.target.value)}
                            placeholder="Catorce"
                            className="w-full h-12 px-4 rounded-xl bg-white border-none ring-1 ring-clinical-100 text-sm font-bold text-clinical-900 shadow-sm"
                          />
                       </div>
                       
                       <div className="md:col-span-3">
                          <label className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-2.5 block">Dosis y Frecuencia</label>
                          <input 
                            value={med.dose}
                            onChange={(e) => updateMedicine(med.id, 'dose', e.target.value)}
                            placeholder="Ej: 1 tableta cada 8 horas"
                            className="w-full h-12 px-5 rounded-xl bg-white border border-clinical-100 text-sm font-medium text-clinical-700 shadow-sm outline-none focus:border-primary-300"
                          />
                       </div>
                       <div className="md:col-span-2">
                          <label className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-2.5 block">Duración</label>
                          <input 
                            value={med.duration}
                            onChange={(e) => updateMedicine(med.id, 'duration', e.target.value)}
                            placeholder="5 días"
                            className="w-full h-12 px-5 rounded-xl bg-white border border-clinical-100 text-sm font-medium text-clinical-700 shadow-sm outline-none focus:border-primary-300"
                          />
                       </div>
                       <div className="md:col-span-6">
                          <label className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-2.5 block">Indicaciones Especiales</label>
                          <input 
                            value={med.indications}
                            onChange={(e) => updateMedicine(med.id, 'indications', e.target.value)}
                            placeholder="Ej: Tomar con abundantes líquidos después de comer"
                            className="w-full h-12 px-5 rounded-xl bg-white border border-clinical-100 text-sm font-medium text-clinical-700 shadow-sm outline-none focus:border-primary-300"
                          />
                       </div>
                    </div>
                 </motion.div>
               ))}

               {medicines.length === 0 && (
                 <div className="h-64 flex flex-col items-center justify-center border-4 border-dashed border-clinical-50 rounded-[3rem] bg-clinical-50/10 text-clinical-200">
                    <Pill className="h-16 w-16 mb-6 opacity-10" />
                    <p className="text-lg font-black uppercase tracking-widest">No hay medicamentos en la receta</p>
                    <button onClick={() => addMedicine()} className="mt-6 h-12 px-10 rounded-2xl bg-white border border-clinical-200 text-primary-600 font-black text-xs uppercase tracking-widest hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all shadow-sm">
                       Comenzar a prescribir
                    </button>
                 </div>
               )}
            </div>
         </section>
      </main>

      {/* PDF Preview Modal */}
      <AnimatePresence>
         {showPreview && pdfUrl && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 exit={{ opacity: 0 }}
                 onClick={() => setShowPreview(false)}
                 className="absolute inset-0 bg-clinical-900/40 backdrop-blur-sm"
               />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95, y: 20 }}
                 className="relative w-full max-w-6xl h-full max-h-[95vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
               >
                  <div className="h-20 border-b border-clinical-100 flex items-center justify-between px-8 bg-clinical-50/50">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary-600 text-white flex items-center justify-center"><FileText className="h-5 w-5" /></div>
                        <div>
                           <h3 className="text-lg font-black text-clinical-900">Previsualización de Receta Profesional</h3>
                           <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">Verifique los datos antes de imprimir</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <Button onClick={() => window.print()} variant="secondary" className="h-11 px-6 rounded-xl border-clinical-200 text-clinical-600 font-black text-xs uppercase tracking-widest shadow-sm">
                           <Printer className="h-4 w-4 mr-2" /> Imprimir
                        </Button>
                        <button 
                          onClick={() => setShowPreview(false)}
                          className="h-11 w-11 rounded-xl bg-white border border-clinical-100 text-clinical-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm"
                        >
                           <X className="h-5 w-5" />
                        </button>
                     </div>
                  </div>
                  
                  <div className="flex-1 bg-clinical-100/50 p-8 overflow-hidden">
                     <iframe src={pdfUrl} className="w-full h-full rounded-2xl shadow-inner border border-clinical-200 bg-white" />
                  </div>

                  <div className="h-20 border-t border-clinical-100 flex items-center justify-center px-8 bg-white">
                     <p className="text-[11px] font-bold text-clinical-400 text-center">
                        Esta receta cumple con el Reglamento de Emisión de Recetas Médicas de la ACESS (Ecuador). 
                        Válida únicamente con firma y sello del profesional.
                     </p>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  )
}
