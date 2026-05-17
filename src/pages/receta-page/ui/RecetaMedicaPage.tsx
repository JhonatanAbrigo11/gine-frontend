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
  Download,
  Save
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/widgets/button'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useBusinessSettings } from '@/features/site-config/model/use-business-settings'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL } from '@/shared/api/base'
import { useToast } from '@/shared/ui/ToastContext'

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
  brandName?: string
}

const MOCK_MEDICINES = [
  { id: '1', generic: 'Paracetamol', concentration: '500 mg', form: 'Tableta' },
  { id: '2', generic: 'Ibuprofeno', concentration: '400 mg', form: 'Cápsula' },
  { id: '3', generic: 'Amoxicilina', concentration: '875 mg', form: 'Tableta' },
  { id: '4', generic: 'Diclofenaco', concentration: '75 mg', form: 'Ampolla' },
]

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

const numberToSpanishLetters = (num: number): string => {
  const units = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE']
  const tens = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA']
  const teens = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISÉTE', 'DIECIOCHO', 'DIECINUEVE']
  
  if (num === 0) return 'CERO'
  if (num < 10) return units[num]
  if (num >= 10 && num < 20) return teens[num - 10]
  if (num >= 20 && num < 100) {
    const u = num % 10
    const d = Math.floor(num / 10)
    return d === 2 && u > 0 ? `VEINTI${units[u]}` : `${tens[d]}${u > 0 ? ` Y ${units[u]}` : ''}`
  }
  return String(num)
}

export const RecetaMedicaPage: React.FC = () => {
  const { settings } = useBusinessSettings()
  const { id: patientId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()

  // States
  const [medicines, setMedicines] = useState<PrescribedMedicine[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  
  const [fadedWatermark, setFadedWatermark] = useState<string | null>(null)
  const [showBrandName, setShowBrandName] = useState(true)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  
  const [patient, setPatient] = useState({
    name: 'Ana García López',
    id: '1723456789',
    age: '28 Años',
    hc: '2026-001'
  })

  React.useEffect(() => {
    if (!patientId) return
    axios.get(`${API_URL}/patients/${patientId}`)
      .then(res => {
        const data = res.data
        const birthYear = data.fechaNacimiento ? new Date(data.fechaNacimiento).getFullYear() : 1998
        const currentYear = new Date().getFullYear()
        setPatient({
          name: `${data.nombres} ${data.apellidos}`,
          id: data.numeroDocumento || data.id,
          age: `${currentYear - birthYear} Años`,
          hc: `2026-${data.id.substring(0, 3).toUpperCase()}`
        })
      })
      .catch(err => {
        console.error("Error loading patient details:", err)
      })
  }, [patientId])

  const [doctor, setDoctor] = useState({
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

  // Sync settings from backend
  React.useEffect(() => {
    if (settings) {
      const rawLogo = settings.recipeLogoUrl
      const hasCustomLogo = rawLogo && rawLogo !== 'null' && rawLogo !== ''

      setDoctor(prev => ({
        ...prev,
        name: settings.recipeDoctorName || 'Dra. Ana García',
        specialty: settings.recipeDoctorSpecialty || 'Ginecología y Obstetricia',
        acess: settings.recipeDoctorAcess || '7456-2026',
        clinic: settings.clinicName || 'GineCentro Premium'
      }))
      setRecipeData(prev => ({
        ...prev,
        ciudad: settings.recipeDefaultCity || 'Quito',
        alergias: settings.recipeDefaultAllergies || 'Ninguna conocida',
        vigencia: settings.recipeDefaultValidityDays 
          ? `${settings.recipeDefaultValidityDays} días` 
          : '3 días'
      }))

      if (hasCustomLogo) {
        fadeBase64Image(rawLogo, 0.05)
          .then(faded => setFadedWatermark(faded))
          .catch(() => setFadedWatermark(null))
      } else {
        setFadedWatermark(null)
      }
    }
  }, [settings])

  // Composing form state
  const [newMed, setNewMed] = useState({
    generic: '',
    form: 'Tableta',
    concentration: '',
    route: 'Oral',
    quantity: '',
    quantityLetters: '',
    dose: '',
    frequency: '',
    duration: '',
    indications: '',
    brandName: ''
  })

  const [dbMedicines, setDbMedicines] = React.useState<any[]>([])

  React.useEffect(() => {
    fetch('http://localhost:3001/api/medicines')
      .then(res => res.json())
      .then(data => setDbMedicines(data))
      .catch(err => console.error("Error loading medicines:", err))
  }, [])

  const handleFormChange = (field: string, value: string) => {
    if (field === 'generic') {
      const val = value
      const matched = dbMedicines.find(m => m.genericName.toLowerCase() === val.trim().toLowerCase())
      if (matched) {
        setNewMed({
          generic: matched.genericName,
          form: matched.presentations[0] || 'Tableta',
          concentration: matched.concentrations[0] || '',
          route: matched.defaultRoute || 'Oral',
          quantity: '',
          quantityLetters: '',
          dose: matched.defaultDose || '',
          frequency: matched.defaultFrequency || '',
          duration: matched.defaultDuration || '',
          indications: '',
          brandName: matched.brandNames[0] || ''
        })
        return
      }
    }
    setNewMed(prev => ({ ...prev, [field]: value }))
  }

  const handleAddMedicineClick = () => {
    if (!newMed.generic.trim()) {
      showToast('Por favor ingrese el nombre del medicamento.', 'warning')
      return
    }
    if (!newMed.quantity) {
      showToast('Por favor ingrese la cantidad.', 'warning')
      return
    }
    if (!newMed.dose.trim()) {
      showToast('Por favor ingrese la dosis / posología.', 'warning')
      return
    }
    if (!newMed.frequency.trim()) {
      showToast('Por favor ingrese la frecuencia.', 'warning')
      return
    }
    if (!newMed.duration.trim()) {
      showToast('Por favor ingrese la duración.', 'warning')
      return
    }

    // Try to extract generic name and concentration if user selected from datalist
    let genericName = newMed.generic
    let concentration = newMed.concentration

    const matched = MOCK_MEDICINES.find(m => `${m.generic} ${m.concentration}` === newMed.generic)
    if (matched) {
      genericName = matched.generic
      concentration = matched.concentration
    }

    const prescription: PrescribedMedicine = {
      id: Math.random().toString(36).substr(2, 9),
      generic: genericName,
      form: newMed.form,
      concentration: concentration || '500 mg', // default or custom
      route: newMed.route,
      quantity: newMed.quantity,
      quantityLetters: newMed.quantityLetters || numberToSpanishLetters(parseInt(newMed.quantity) || 0),
      dose: newMed.dose,
      frequency: newMed.frequency,
      duration: newMed.duration,
      indications: newMed.indications,
      brandName: newMed.brandName.toUpperCase()
    }

    setMedicines([...medicines, prescription])

    // Reset composing state
    setNewMed({
      generic: '',
      form: 'Tableta',
      concentration: '',
      route: 'Oral',
      quantity: '',
      quantityLetters: '',
      dose: '',
      frequency: '',
      duration: '',
      indications: '',
      brandName: ''
    })
  }

  const removeMedicine = (id: string) => {
    setMedicines(medicines.filter(m => m.id !== id))
  }

  const updateMedicine = (id: string, field: keyof PrescribedMedicine, value: string) => {
    setMedicines(medicines.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const handleSaveRecipe = async () => {
    if (medicines.length === 0) {
      showToast('Por favor añada al menos un medicamento a la receta.', 'warning')
      return
    }

    try {
      // 1. Save to backend real database via API
      await axios.post(`${API_URL}/prescriptions`, {
        secuencial: recipeData.secuencial,
        date: recipeData.fecha,
        patientId: patient.id || patientId,
        patientName: patient.name,
        medicinesCount: medicines.length,
        status: 'Emitida',
        medicines: medicines,
        vigencia: recipeData.vigencia,
        vigenciaTipo: recipeData.vigenciaTipo,
        diagnostico: recipeData.diagnostico,
        cie10: recipeData.cie10,
        alergias: recipeData.alergias,
        doctor: doctor
      })

      // 2. Also save to localStorage as a fallback backup for offline/speed
      const storedKey = `prescriptions_${patient.id || patientId}`
      const existing = localStorage.getItem(storedKey)
      const existingList = existing ? JSON.parse(existing) : []

      const newRecipe = {
        id: recipeData.secuencial,
        date: recipeData.fecha,
        medicines: medicines,
        status: 'Activa',
        vigencia: recipeData.vigencia,
        vigenciaTipo: recipeData.vigenciaTipo,
        diagnostico: recipeData.diagnostico,
        cie10: recipeData.cie10,
        alergias: recipeData.alergias,
        doctor: doctor
      }

      existingList.unshift(newRecipe)
      localStorage.setItem(storedKey, JSON.stringify(existingList))

      showToast('¡Receta guardada exitosamente!', 'success')
      
      // 3. Navigate directly to the recipes list page as requested
      navigate('/recetas')
    } catch (e) {
      console.error(e)
      showToast('Error al guardar la receta.', 'error')
    }
  }

  const generatePDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })
      
      const pageWidth = doc.internal.pageSize.getWidth()
      const colWidth = (pageWidth - 60) / 2
      const midPoint = pageWidth / 2

      // Generate Native PNG Default Images using Canvas (avoids all SVG compatibility issues in jsPDF)
      const defaultLogoPng = generateDefaultLogoBase64('#026fc7')
      const defaultWatermarkPng = generateDefaultWatermarkBase64('#026fc7', 0.04)

      const drawColumnContent = (x: number, type: 'rp' | 'indications') => {
        const rawLogo = settings?.recipeLogoUrl
        const hasCustomLogo = rawLogo && rawLogo !== 'null' && rawLogo !== ''
        
        const logoToUse = hasCustomLogo ? rawLogo : defaultLogoPng
        const watermarkToUse = (hasCustomLogo && fadedWatermark) ? fadedWatermark : defaultWatermarkPng

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
        doc.text(settings?.clinicName || doctor.clinic, x + 16, 21)
        
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
             const brandStr = (showBrandName && med.brandName) ? ` [Comercial: ${med.brandName}]` : ''
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
      ;(doc as any).setLineDash([2, 2])
      doc.line(midPoint, 10, midPoint, 200)
      ;(doc as any).setLineDash([])

      // Draw Right Column (Indications)
      drawColumnContent(midPoint + 10, 'indications')

      // Use a Blob URL instead of datauristring (datauristrings are frequently blocked by Chrome iframe sandboxing!)
      const blob = doc.output('blob')
      const blobUrl = URL.createObjectURL(blob)
      setPdfUrl(blobUrl)
      setShowPreview(true)
    } catch (error) {
      console.error('Error generating PDF:', error)
      showToast('Error al generar la receta profesional.', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-clinical-50 flex flex-col font-sans">
      {/* Header */}
      <header className="h-20 bg-white border-b border-clinical-100 flex items-center justify-between px-10 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
             onClick={() => navigate(`/pacientes/ficha/${patientId}`)}
             className="h-10 w-10 rounded-2xl bg-clinical-50 text-clinical-400 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-all"
          >
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
           
           <Button 
             variant="primary" 
             onClick={handleSaveRecipe}
             disabled={medicines.length === 0}
             className="h-10 px-4 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all disabled:opacity-30 flex items-center gap-2"
           >
              <Save className="h-4 w-4" /> Guardar Receta
           </Button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-4 space-y-6">
         {/* Banner de Información Horizontal Ultra-Compacto */}
         <section className="bg-white rounded-2xl py-3 px-6 border border-clinical-100 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-clinical-600">
            <div className="flex items-center gap-3">
               <div className="h-8 w-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-black text-xs shadow-sm">{patient.name.charAt(0)}</div>
               <div>
                  <span className="text-[9px] font-bold text-clinical-400 block uppercase tracking-wider leading-none mb-0.5">Paciente</span>
                  <span className="text-xs font-black text-clinical-900">{patient.name} <span className="font-bold text-clinical-400">({patient.age})</span> • HC: {patient.hc}</span>
               </div>
            </div>
            
            <div className="flex items-center gap-6">
               <div>
                  <span className="text-[9px] font-bold text-clinical-400 block uppercase tracking-wider leading-none mb-0.5">Secuencial</span>
                  <span className="text-xs font-black text-clinical-900">{recipeData.secuencial}</span>
               </div>
               
               <div>
                  <span className="text-[9px] font-bold text-clinical-400 block uppercase tracking-wider leading-none mb-0.5">Tipo Emisión</span>
                  <select 
                    value={recipeData.vigenciaTipo}
                    className="h-7 px-2 rounded-lg bg-clinical-50 border border-clinical-100 text-[10px] font-bold text-clinical-900 outline-none"
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

            <div className="flex items-center gap-2">
               <div className="h-7 w-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><AlertCircle className="h-4 w-4" /></div>
               <span className="text-xs font-bold text-rose-700 bg-rose-50/50 px-2 py-0.5 rounded-lg border border-rose-100">Alergias: <strong className="font-black">{recipeData.alergias}</strong></span>
            </div>

            <div className="text-[9px] font-black text-clinical-500 uppercase tracking-widest text-right leading-tight">
               <span className="block text-clinical-900">{doctor.name}</span>
               <span className="text-primary-600">ACESS: {doctor.acess}</span>
            </div>
         </section>

         {/* Área de Receta - Ancho Completo */}
         <section className="bg-white rounded-2xl p-6 border border-clinical-100 shadow-premium">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner"><Pill className="h-5 w-5" /></div>
                  <div>
                     <h3 className="text-lg font-black text-clinical-900 tracking-tight">Prescripción Médica</h3>
                     <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest mt-0.5">CIE-10: {recipeData.cie10} • {recipeData.diagnostico}</p>
                  </div>
               </div>
               <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                     <input 
                        type="checkbox"
                        id="toggle-brand-names"
                        checked={showBrandName}
                        onChange={(e) => setShowBrandName(e.target.checked)}
                        className="h-4 w-4 rounded border-clinical-200 text-primary-600 focus:ring-primary-500/20 transition-all cursor-pointer"
                     />
                     <div className="text-left">
                        <span className="text-[10px] font-black text-clinical-800 uppercase tracking-wider block">Mostrar Nombre Comercial</span>
                        <span className="text-[8px] font-bold text-clinical-400 block">Se incluye en tabla e impresos</span>
                     </div>
                  </label>

                  <Button 
                    variant="secondary" 
                    onClick={generatePDF}
                    disabled={medicines.length === 0}
                    className="h-10 px-4 rounded-xl border-clinical-200 text-clinical-600 text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-clinical-50 transition-all disabled:opacity-30"
                  >
                     <Eye className="h-3.5 w-3.5 mr-2" /> Previsualizar
                  </Button>

                  <Button 
                    variant="primary" 
                    onClick={handleSaveRecipe}
                    disabled={medicines.length === 0}
                    className="h-10 px-4 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all disabled:opacity-30 flex items-center gap-2"
                  >
                     <Save className="h-4 w-4" /> Guardar Receta
                  </Button>
               </div>
            </div>

            {/* Panel de Composición Compacto */}
            <div className="p-5 rounded-2xl bg-clinical-50/30 border border-clinical-100 mb-6 space-y-4">
               <div className="flex items-center gap-2 mb-1">
                  <div className="h-6 w-6 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm"><Pill className="h-3.5 w-3.5" /></div>
                  <h4 className="text-[9px] font-black text-clinical-900 uppercase tracking-widest">Componer Nuevo Medicamento</h4>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-3">
                  {/* Row 1 */}
                  {/* 1. Medicamento Genérico */}
                  <div className="md:col-span-4">
                     <label className="text-[9px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                        Medicamento (DCI) <span className="text-rose-500">*</span>
                     </label>
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-clinical-300" />
                        <input 
                           value={newMed.generic}
                           onChange={(e) => {
                              handleFormChange('generic', e.target.value)
                              setActiveDropdown('generic')
                           }}
                           onFocus={() => setActiveDropdown('generic')}
                           onBlur={() => {
                              setTimeout(() => setActiveDropdown(null), 200)
                           }}
                           placeholder="Buscar o escribir genérico..."
                           className="w-full h-10 pl-9 pr-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                        />
                        
                        {activeDropdown === 'generic' && (
                           <div className="absolute left-0 right-0 top-11 z-50 max-h-60 overflow-y-auto rounded-xl border border-clinical-150 bg-white/95 p-1.5 shadow-premium backdrop-blur-md">
                              {dbMedicines.filter(m => 
                                 m.genericName.toLowerCase().includes(newMed.generic.toLowerCase())
                              ).length === 0 ? (
                                 <div className="px-3 py-2.5 text-center text-[10px] font-bold text-clinical-400 uppercase tracking-wider">
                                    Medicamento no catalogado (se guardará libre)
                                 </div>
                              ) : (
                                 dbMedicines
                                    .filter(m => m.genericName.toLowerCase().includes(newMed.generic.toLowerCase()))
                                    .map(m => (
                                       <div
                                          key={m.id}
                                          onMouseDown={(e) => {
                                             e.preventDefault()
                                             setNewMed({
                                                generic: m.genericName,
                                                form: m.presentations[0] || 'Tableta',
                                                concentration: m.concentrations[0] || '',
                                                route: m.defaultRoute || 'Oral',
                                                quantity: '',
                                                quantityLetters: '',
                                                dose: m.defaultDose || '',
                                                frequency: m.defaultFrequency || '',
                                                duration: m.defaultDuration || '',
                                                indications: '',
                                                brandName: m.brandNames[0] || ''
                                             })
                                             setActiveDropdown(null)
                                          }}
                                          className="flex flex-col gap-0.5 rounded-lg px-3 py-2 text-left cursor-pointer hover:bg-primary-50 transition-colors"
                                       >
                                          <span className="text-xs font-black text-clinical-900">{m.genericName}</span>
                                          <div className="flex items-center gap-2 text-[9px] font-bold text-clinical-400 uppercase tracking-wider">
                                             <span>{m.presentations.join(', ') || 'Sin presentación'}</span>
                                             {m.brandNames.length > 0 && (
                                                <>
                                                   <span>•</span>
                                                   <span className="text-primary-600 font-extrabold">{m.brandNames.join(', ')}</span>
                                                 </>
                                              )}
                                          </div>
                                       </div>
                                    ))
                              )}
                           </div>
                        )}
                     </div>
                  </div>

                  {/* 2. Nombre Comercial */}
                  <div className="md:col-span-3">
                     <label className="text-[9px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                        Nombre Comercial
                     </label>
                     <div className="relative">
                        <input 
                           type="text"
                           value={newMed.brandName}
                           onChange={(e) => {
                              handleFormChange('brandName', e.target.value)
                              setActiveDropdown('brand')
                           }}
                           onFocus={() => setActiveDropdown('brand')}
                           onBlur={() => {
                              setTimeout(() => setActiveDropdown(null), 200)
                           }}
                           placeholder="Ej: TINIROL"
                           className="w-full h-10 px-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                        />
                        {activeDropdown === 'brand' && (
                           (() => {
                              const currentSelectedMed = dbMedicines.find(m => m.genericName.toLowerCase() === newMed.generic.trim().toLowerCase())
                              const brandOptions = currentSelectedMed && currentSelectedMed.brandNames.length > 0
                                 ? currentSelectedMed.brandNames
                                 : Array.from(new Set(dbMedicines.flatMap(m => m.brandNames)))
                                 
                              const filteredBrands = brandOptions.filter(b => b.toLowerCase().includes(newMed.brandName.toLowerCase()))
                              
                              return (
                                 <div className="absolute left-0 right-0 top-11 z-50 max-h-60 overflow-y-auto rounded-xl border border-clinical-150 bg-white/95 p-1.5 shadow-premium backdrop-blur-md">
                                    {filteredBrands.length === 0 ? (
                                       <div className="px-3 py-2.5 text-center text-[10px] font-bold text-clinical-400 uppercase tracking-wider">
                                          Sin coincidencias
                                       </div>
                                    ) : (
                                       filteredBrands.map((b, idx) => (
                                          <div
                                             key={idx}
                                             onMouseDown={(e) => {
                                                e.preventDefault()
                                                handleFormChange('brandName', b)
                                                setActiveDropdown(null)
                                             }}
                                             className="rounded-lg px-3 py-2 text-left cursor-pointer hover:bg-primary-50 transition-colors text-xs font-black text-clinical-900"
                                          >
                                             {b}
                                          </div>
                                       ))
                                    )}
                                 </div>
                              )
                           })()
                        )}
                     </div>
                  </div>

                  {/* 3. Presentación */}
                  <div className="md:col-span-3">
                     <label className="text-[9px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                        Presentación <span className="text-rose-500">*</span>
                     </label>
                     <div className="relative">
                        <input 
                           type="text"
                           value={newMed.form}
                           onChange={(e) => {
                              handleFormChange('form', e.target.value)
                              setActiveDropdown('form')
                           }}
                           onFocus={() => setActiveDropdown('form')}
                           onBlur={() => {
                              setTimeout(() => setActiveDropdown(null), 200)
                           }}
                           placeholder="Ej: Tableta, Óvulo"
                           className="w-full h-10 px-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                        />
                        {activeDropdown === 'form' && (
                           (() => {
                              const currentSelectedMed = dbMedicines.find(m => m.genericName.toLowerCase() === newMed.generic.trim().toLowerCase())
                              const presentationOptions = currentSelectedMed && currentSelectedMed.presentations.length > 0
                                 ? currentSelectedMed.presentations
                                 : Array.from(new Set(dbMedicines.flatMap(m => m.presentations))).length > 0
                                    ? Array.from(new Set(dbMedicines.flatMap(m => m.presentations)))
                                    : ['Tableta', 'Cápsula', 'Óvulo', 'Jarabe', 'Ampolla', 'Crema vaginal', 'Gotas']
                                    
                              const filteredPresentations = presentationOptions.filter(p => p.toLowerCase().includes(newMed.form.toLowerCase()))
                              
                              return (
                                 <div className="absolute left-0 right-0 top-11 z-50 max-h-60 overflow-y-auto rounded-xl border border-clinical-150 bg-white/95 p-1.5 shadow-premium backdrop-blur-md">
                                    {filteredPresentations.length === 0 ? (
                                       <div className="px-3 py-2.5 text-center text-[10px] font-bold text-clinical-400 uppercase tracking-wider">
                                          Sin coincidencias
                                       </div>
                                    ) : (
                                       filteredPresentations.map((p, idx) => (
                                          <div
                                             key={idx}
                                             onMouseDown={(e) => {
                                                e.preventDefault()
                                                handleFormChange('form', p)
                                                setActiveDropdown(null)
                                             }}
                                             className="rounded-lg px-3 py-2 text-left cursor-pointer hover:bg-primary-50 transition-colors text-xs font-black text-clinical-900"
                                          >
                                             {p}
                                          </div>
                                       ))
                                    )}
                                 </div>
                              )
                           })()
                        )}
                     </div>
                  </div>

                  {/* 4. Cantidad */}
                  <div className="md:col-span-2">
                     <label className="text-[9px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                        Cantidad <span className="text-rose-500">*</span>
                     </label>
                     <input 
                        type="number"
                        min="1"
                        value={newMed.quantity}
                        onChange={(e) => {
                           const val = e.target.value
                           const num = parseInt(val) || 0
                           setNewMed(prev => ({
                              ...prev,
                              quantity: val,
                              quantityLetters: num > 0 ? numberToSpanishLetters(num) : ''
                           }))
                        }}
                        placeholder="Ej: 4"
                        className="w-full h-10 px-3 rounded-lg bg-white border border-clinical-150 text-xs font-black text-center text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                     />
                  </div>

                  {/* Row 2 */}
                  {/* 5. Dosis Posología */}
                  <div className="md:col-span-3">
                     <label className="text-[9px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                        Dosis / Posología <span className="text-rose-500">*</span>
                     </label>
                     <div className="relative">
                        <input 
                           type="text"
                           value={newMed.dose}
                           onChange={(e) => {
                              handleFormChange('dose', e.target.value)
                              setActiveDropdown('dose')
                           }}
                           onFocus={() => setActiveDropdown('dose')}
                           onBlur={() => {
                              setTimeout(() => setActiveDropdown(null), 200)
                           }}
                           placeholder="Ej: 250 mg o 1 tableta"
                           className="w-full h-10 px-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                        />
                        {activeDropdown === 'dose' && (
                           (() => {
                              const doseSuggestions = ['1 tableta', '1 cápsula', '1 óvulo', '1 cucharadita', '5 mL', '1 ampolla']
                              const filteredDoses = doseSuggestions.filter(d => d.toLowerCase().includes(newMed.dose.toLowerCase()))
                              
                              if (filteredDoses.length === 0) return null
                              
                              return (
                                 <div className="absolute left-0 right-0 top-11 z-50 max-h-60 overflow-y-auto rounded-xl border border-clinical-150 bg-white/95 p-1.5 shadow-premium backdrop-blur-md">
                                    {filteredDoses.map((d, idx) => (
                                       <div
                                          key={idx}
                                          onMouseDown={(e) => {
                                             e.preventDefault()
                                             handleFormChange('dose', d)
                                             setActiveDropdown(null)
                                          }}
                                          className="rounded-lg px-3 py-2 text-left cursor-pointer hover:bg-primary-50 transition-colors text-xs font-black text-clinical-900"
                                       >
                                          {d}
                                       </div>
                                    ))}
                                 </div>
                              )
                           })()
                        )}
                     </div>
                  </div>

                  {/* 6. Frecuencia */}
                  <div className="md:col-span-3">
                     <label className="text-[9px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                        Frecuencia <span className="text-rose-500">*</span>
                     </label>
                     <div className="relative">
                        <input 
                           type="text"
                           value={newMed.frequency}
                           onChange={(e) => {
                              handleFormChange('frequency', e.target.value)
                              setActiveDropdown('frequency')
                           }}
                           onFocus={() => setActiveDropdown('frequency')}
                           onBlur={() => {
                              setTimeout(() => setActiveDropdown(null), 200)
                           }}
                           placeholder="Ej: Cuatro veces al día"
                           className="w-full h-10 px-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                        />
                        {activeDropdown === 'frequency' && (
                           (() => {
                              const frequencySuggestions = ['Cada 8 horas', 'Cada 12 horas', 'Cada 24 horas', 'Cada 6 horas', 'Cada 24 horas (noche)', 'Dosis única']
                              const filteredFrequencies = frequencySuggestions.filter(f => f.toLowerCase().includes(newMed.frequency.toLowerCase()))
                              
                              if (filteredFrequencies.length === 0) return null
                              
                              return (
                                 <div className="absolute left-0 right-0 top-11 z-50 max-h-60 overflow-y-auto rounded-xl border border-clinical-150 bg-white/95 p-1.5 shadow-premium backdrop-blur-md">
                                    {filteredFrequencies.map((f, idx) => (
                                       <div
                                          key={idx}
                                          onMouseDown={(e) => {
                                             e.preventDefault()
                                             handleFormChange('frequency', f)
                                             setActiveDropdown(null)
                                          }}
                                          className="rounded-lg px-3 py-2 text-left cursor-pointer hover:bg-primary-50 transition-colors text-xs font-black text-clinical-900"
                                       >
                                          {f}
                                       </div>
                                    ))}
                                 </div>
                              )
                           })()
                        )}
                     </div>
                  </div>

                  {/* 7. Vía de Administración */}
                  <div className="md:col-span-3">
                     <label className="text-[9px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                        Vía de Administración
                     </label>
                     <select
                        value={newMed.route}
                        onChange={(e) => handleFormChange('route', e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 outline-none shadow-sm cursor-pointer transition-colors"
                     >
                        <option value="Oral">Oral</option>
                        <option value="Intravenosa (IV)">Intravenosa (IV)</option>
                        <option value="Intramuscular (IM)">Intramuscular (IM)</option>
                        <option value="Tópica">Tópica</option>
                        <option value="Vaginal">Vaginal</option>
                        <option value="Oftálmica">Oftálmica</option>
                        <option value="Sublingual">Sublingual</option>
                     </select>
                  </div>

                  {/* 8. Duración del Tratamiento */}
                  <div className="md:col-span-3">
                     <label className="text-[9px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                        Duración del Tratamiento <span className="text-rose-500">*</span>
                     </label>
                     <div className="relative">
                        <input 
                           type="text"
                           value={newMed.duration}
                           onChange={(e) => {
                              handleFormChange('duration', e.target.value)
                              setActiveDropdown('duration')
                           }}
                           onFocus={() => setActiveDropdown('duration')}
                           onBlur={() => {
                              setTimeout(() => setActiveDropdown(null), 200)
                           }}
                           placeholder="Ej: 3 (TRES) Días"
                           className="w-full h-10 px-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                        />
                        {activeDropdown === 'duration' && (
                           (() => {
                              const durationSuggestions = ['3 días', '5 días', '7 días', '10 días', '14 días', '30 días']
                              const filteredDurations = durationSuggestions.filter(d => d.toLowerCase().includes(newMed.duration.toLowerCase()))
                              
                              if (filteredDurations.length === 0) return null
                              
                              return (
                                 <div className="absolute left-0 right-0 top-11 z-50 max-h-60 overflow-y-auto rounded-xl border border-clinical-150 bg-white/95 p-1.5 shadow-premium backdrop-blur-md">
                                    {filteredDurations.map((d, idx) => (
                                       <div
                                          key={idx}
                                          onMouseDown={(e) => {
                                             e.preventDefault()
                                             handleFormChange('duration', d)
                                             setActiveDropdown(null)
                                          }}
                                          className="rounded-lg px-3 py-2 text-left cursor-pointer hover:bg-primary-50 transition-colors text-xs font-black text-clinical-900"
                                       >
                                          {d}
                                       </div>
                                    ))}
                                 </div>
                              )
                           })()
                        )}
                     </div>
                  </div>

                  {/* Row 3 */}
                  {/* 9. Indicaciones Especiales */}
                  <div className="md:col-span-9">
                     <label className="text-[9px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                        Indicaciones Especiales (Observaciones)
                     </label>
                     <input 
                        type="text"
                        value={newMed.indications}
                        onChange={(e) => handleFormChange('indications', e.target.value)}
                        placeholder="Ej: Tomar con abundantes líquidos"
                        className="w-full h-10 px-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                     />
                  </div>

                  {/* 10. Botón de Agregar */}
                  <div className="md:col-span-3 md:flex md:items-end">
                     <Button 
                        onClick={handleAddMedicineClick}
                        variant="primary" 
                        className="w-full h-10 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-md shadow-primary-200"
                     >
                        <Plus className="h-3.5 w-3.5 mr-1.5" /> Añadir a la Receta
                     </Button>
                  </div>
               </div>
            </div>

            {/* Sección de Tablas de Receta (Lef/Right Parallel Tables) */}
            {medicines.length > 0 ? (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Columna Izquierda: MEDICACIÓN (Farmacia / Copia Ficha) */}
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 border-b border-clinical-100 pb-2">
                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">Parte A</span>
                        <h4 className="text-xs font-black text-clinical-900 uppercase tracking-wider">
                           MEDICACIÓN (DCI, Concentración y Cantidad)
                        </h4>
                     </div>
                     <div className="overflow-hidden rounded-2xl border border-clinical-100 shadow-sm bg-white">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="bg-clinical-50/50 border-b border-clinical-100">
                                 <th className="p-4 text-[9px] font-black text-clinical-450 uppercase tracking-wider">Medicamento (DCI, Presentación)</th>
                                 {showBrandName && <th className="p-4 text-[9px] font-black text-clinical-450 uppercase tracking-wider">Nombre Comercial</th>}
                                 <th className="p-4 text-[9px] font-black text-clinical-450 uppercase tracking-wider text-center">Cantidad</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-clinical-50">
                              {medicines.map((med) => (
                                 <tr key={med.id} className="hover:bg-clinical-50/30 transition-colors">
                                    <td className="p-4">
                                       <div className="font-bold text-xs text-clinical-900">{med.generic} {med.concentration ? `(${med.concentration})` : ''}</div>
                                       <div className="text-[9px] font-bold text-clinical-400 uppercase tracking-widest mt-0.5">{med.form}</div>
                                    </td>
                                    {showBrandName && (
                                       <td className="p-4 font-black text-xs text-indigo-600">
                                          {med.brandName || 'GENÉRICO'}
                                       </td>
                                    )}
                                    <td className="p-4 font-black text-xs text-clinical-900 text-center">
                                       {med.quantity} <span className="text-[9px] font-bold text-clinical-400 block mt-0.5">({med.quantityLetters})</span>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>

                  {/* Columna Derecha: INDICACIONES (Paciente) */}
                  <div className="space-y-4">
                     <div className="flex items-center justify-between border-b border-clinical-100 pb-2">
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">Parte B</span>
                           <h4 className="text-xs font-black text-clinical-900 uppercase tracking-wider">
                              INDICACIONES (Instrucciones al Paciente)
                           </h4>
                        </div>
                     </div>
                     <div className="overflow-hidden rounded-2xl border border-clinical-100 shadow-sm bg-white">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="bg-clinical-50/50 border-b border-clinical-100">
                                 <th className="p-4 text-[9px] font-black text-clinical-450 uppercase tracking-wider">Medicamento</th>
                                 <th className="p-4 text-[9px] font-black text-clinical-450 uppercase tracking-wider">Dosis & Frecuencia</th>
                                 <th className="p-4 text-[9px] font-black text-clinical-450 uppercase tracking-wider">Vía & Duración</th>
                                 <th className="p-4 text-[9px] font-black text-clinical-450 uppercase tracking-wider text-center">Acciones</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-clinical-50">
                              {medicines.map((med) => (
                                 <tr key={med.id} className="hover:bg-clinical-50/30 transition-colors">
                                    <td className="p-4 font-bold text-xs text-clinical-900">
                                       {med.generic}
                                    </td>
                                    <td className="p-4">
                                       <div className="font-bold text-xs text-clinical-800">{med.dose}</div>
                                       <div className="text-[9px] font-bold text-clinical-500 uppercase mt-0.5">{med.frequency}</div>
                                    </td>
                                    <td className="p-4">
                                       <div className="font-bold text-xs text-clinical-800">{med.route}</div>
                                       <div className="text-[9px] font-bold text-clinical-500 uppercase mt-0.5">{med.duration}</div>
                                    </td>
                                    <td className="p-4 text-center">
                                       <button 
                                          onClick={() => removeMedicine(med.id)}
                                          className="h-8 w-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition-all mx-auto"
                                          title="Eliminar de la receta"
                                       >
                                          <Trash2 className="h-4 w-4" />
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="h-64 flex flex-col items-center justify-center border-4 border-dashed border-clinical-50 rounded-[3rem] bg-clinical-50/10 text-clinical-200">
                  <Pill className="h-16 w-16 mb-6 opacity-10" />
                  <p className="text-lg font-black uppercase tracking-widest text-center px-4">No hay medicamentos en la receta. Comience a prescribir arriba.</p>
               </div>
            )}
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
