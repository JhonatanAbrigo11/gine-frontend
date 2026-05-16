import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Save, 
  Printer, 
  History, 
  Stethoscope, 
  Activity, 
  Heart, 
  ClipboardList, 
  FileText,
  AlertCircle,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  Droplet,
  Clock,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Pill,
  FileBadge,
  Download,
  Eye,
  Microscope,
  Baby,
  Search,
  CheckCircle2,
  PlusCircle,
  X
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/widgets/button'

/* ==================================================
   TYPES & CONSTANTS
   ================================================== */

const TABS = [
  { id: 'evolucion', label: 'Evolución', icon: History },
  { id: 'signos', label: 'Signos Vitales', icon: Activity },
  { id: 'ginecologia', label: 'Ginecología', icon: Heart },
  { id: 'diagnostico', label: 'Diagnóstico', icon: Stethoscope },
  { id: 'plan', label: 'Plan & Tratamiento', icon: ClipboardList },
  { id: 'documentos', label: 'Documentos', icon: FileText },
]

/* ==================================================
   MAIN COMPONENT
   ================================================== */

import { pacienteService } from '@/entities/paciente/api/paciente.service'
import { consultationService } from '@/entities/consulta/model/consultation.service'
import type { Patient } from '@/entities/paciente/model/types'
import { Loader2 } from 'lucide-react'

export function NuevaConsultaPage() {
  const { id, num } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('evolucion')
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    reason: '',
    evolution: '',
    physicalExam: '',
    diagnosis: '',
    treatmentPlan: '',
    followUp: '',
    pressure: '',
    weight: '',
    height: '',
    heartRate: '',
    temp: '',
    saturacion: '',
    notes: ''
  })
  
  useEffect(() => {
    const initData = async () => {
      if (!id) return
      try {
        setLoading(true)
        const data = await consultationService.initConsultation(id)
        setPatient(data.patient)
        // Pre-llenar campos que vienen de la historia
        setFormData(prev => ({
          ...prev,
          evolution: data.lastFollowUp ? `SEGUIMIENTO PREVIO: ${data.lastFollowUp}\n\n` : ''
        }))
      } catch (error) {
        console.error('Error initializing consultation:', error)
      } finally {
        setLoading(false)
      }
    }
    initData()
  }, [id])

  const handleSave = async () => {
    if (!patient) return
    try {
      setLoading(true)
      const payload = {
        ...formData,
        patientId: patient.id,
        doctor: "Dr. Andres Morquecho",
        date: new Date().toISOString()
      }
      await consultationService.save(payload)
      navigate('/consultas')
    } catch (error) {
      console.error('Error saving consultation:', error)
      alert('Error al guardar la consulta')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-clinical-50">
        <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
      </div>
    )
  }

  if (!patient) return null

  const isPregnant = true // Se podría derivar de los datos o selección
  const patientAge = patient.fechaNacimiento ? new Date().getFullYear() - new Date(patient.fechaNacimiento).getFullYear() : '—'

  return (
    <div className="min-h-dvh bg-clinical-50/50 flex flex-col">
      {/* Premium Header */}
      <header className="bg-white border-b border-clinical-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="px-6 py-4 flex items-center justify-between border-b border-clinical-50">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setShowExitConfirm(true)} 
                className="h-10 w-10 rounded-2xl bg-clinical-50 flex items-center justify-center text-clinical-400 hover:text-primary-600 transition-all border border-clinical-100 shadow-sm"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-primary-200">
                  {patient.nombres.charAt(0)}
                </div>
                <div>
                   <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-clinical-900 leading-none">{patient.nombres} {patient.apellidos}</h2>
                      {patient.alergias && (
                        <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-600 text-[10px] font-black uppercase border border-rose-100">Alergias: {patient.alergias}</span>
                      )}
                   </div>
                   <p className="text-xs font-bold text-clinical-500 mt-1.5 uppercase tracking-widest">{patientAge} Años • HC: {patient.numeroDocumento} • <span className="text-primary-600 font-black">Consulta #{num || 'Nueva'}</span></p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
               <button className="h-11 w-11 rounded-2xl bg-white border border-clinical-200 flex items-center justify-center text-clinical-400 hover:text-primary-600 transition-all shadow-sm hover:border-primary-300">
                  <Printer className="h-5 w-5" />
               </button>
                <Button 
                  variant="primary" 
                  className="rounded-2xl h-11 px-8 shadow-xl shadow-primary-200 font-bold tracking-tight group"
                  onClick={handleSave}
                >
                   <Save className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                   Finalizar Consulta
                </Button>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="px-6 py-3 bg-clinical-50/30 flex items-center gap-10">
             <BannerStat label="E.G." value="24.2 Sem" icon={<Baby className="h-3.5 w-3.5 text-primary-500" />} />
             <BannerStat label="F.P.P." value="12 Sep 2026" icon={<CalendarIcon className="h-3.5 w-3.5 text-indigo-500" />} />
             <BannerStat label="Peso" value="68.5 kg" icon={<Activity className="h-3.5 w-3.5 text-emerald-500" />} />
             <BannerStat label="Presión" value="110/70" icon={<Heart className="h-3.5 w-3.5 text-rose-500" />} />
             
             <div className="ml-auto flex gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-tighter border border-emerald-200">Embarazada</span>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-tighter border border-amber-200">Control Prenatal</span>
             </div>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="bg-white border-b border-clinical-100 sticky top-[138px] z-40">
         <div className="max-w-7xl mx-auto px-6 flex gap-1">
            {TABS.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative", isActive ? "text-primary-600" : "text-clinical-400 hover:text-clinical-900 hover:bg-clinical-50/50")}>
                  <Icon className={cn("h-4 w-4", isActive ? "text-primary-600" : "text-clinical-300")} />
                  {tab.label}
                  {isActive && <motion.div layoutId="activeTabConsult" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 shadow-[0_-2px_8px_rgba(2,111,199,0.3)]" />}
                </button>
              )
            })}
         </div>
      </nav>

      {/* Main Form Content */}
      <main className="flex-1 overflow-y-auto">
         <div className="max-w-7xl mx-auto px-6 py-8">
            <AnimatePresence mode="wait">
               <motion.div 
                 key={activeTab} 
                 initial={{ opacity: 0, y: 10 }} 
                 animate={{ opacity: 1, y: 0 }} 
                 exit={{ opacity: 0, y: -10 }} 
                 className="bg-white rounded-[2.5rem] p-10 border border-clinical-100 shadow-premium min-h-[600px]"
               >
                  {activeTab === 'evolucion' && <EvolucionTab formData={formData} setFormData={setFormData} />}
                  {activeTab === 'signos' && <SignosVitalesTab formData={formData} setFormData={setFormData} isPregnant={isPregnant} />}
                  {activeTab === 'ginecologia' && <GinecologiaTab formData={formData} setFormData={setFormData} isPregnant={isPregnant} />}
                  {activeTab === 'diagnostico' && <DiagnosticoTab formData={formData} setFormData={setFormData} />}
                  {activeTab === 'plan' && <PlanTab formData={formData} setFormData={setFormData} />}
                  {activeTab === 'documentos' && <DocumentosTab formData={formData} setFormData={setFormData} />}
               </motion.div>
            </AnimatePresence>
         </div>
      </main>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
         {showExitConfirm && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowExitConfirm(false)} className="absolute inset-0 bg-clinical-900/60 backdrop-blur-md" />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center"
              >
                 <div className="h-16 w-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><AlertCircle className="h-8 w-8" /></div>
                 <h3 className="text-xl font-bold text-clinical-900 mb-2">¿Salir de la Consulta?</h3>
                 <p className="text-sm text-clinical-500 mb-8">Los cambios no guardados se perderán. ¿Desea continuar?</p>
                 <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setShowExitConfirm(false)} className="h-12 rounded-xl border border-clinical-100 text-xs font-bold uppercase tracking-widest text-clinical-400">Cancelar</button>
                    <button onClick={() => navigate('/consultas')} className="h-12 rounded-xl bg-primary-600 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary-100">Sí, Salir</button>
                 </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  )
}

/* ==================================================
   TAB COMPONENTS
   ================================================== */

interface TabProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

function EvolucionTab({ formData, setFormData }: TabProps) {
  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
       <div className="col-span-full grid grid-cols-3 gap-6 mb-4">
          <div className="col-span-1">
             <label className="text-[10px] font-black uppercase tracking-[0.15em] text-clinical-400 mb-2 block ml-2">Tipo de Atención</label>
             <select 
               value={formData.type}
               onChange={(e) => handleChange('type', e.target.value)}
               className="w-full h-12 px-4 rounded-2xl bg-clinical-50 border-none ring-1 ring-clinical-100 text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none"
             >
                <option value="Consulta Ginecología">Consulta Ginecología</option>
                <option value="Control Prenatal">Control Prenatal</option>
                <option value="Planificación">Planificación</option>
                <option value="Procedimiento">Procedimiento</option>
             </select>
          </div>
          <div className="col-span-2">
             <label className="text-[10px] font-black uppercase tracking-[0.15em] text-clinical-400 mb-2 block ml-2">Motivo de Consulta</label>
             <input 
               type="text" 
               value={formData.reason}
               onChange={(e) => handleChange('reason', e.target.value)}
               className="w-full h-12 px-5 rounded-2xl bg-clinical-50 border-none ring-1 ring-clinical-100 text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none" 
               placeholder="Ej: Control prenatal rutinario de segundo trimestre" 
             />
          </div>
       </div>

       <FormSection title="Enfermedad Actual / Evolución" icon={<History className="h-4 w-4" />}>
          <textarea 
            value={formData.evolution}
            onChange={(e) => handleChange('evolution', e.target.value)}
            className="w-full h-48 rounded-[2rem] bg-clinical-50/50 border-none ring-1 ring-clinical-100 p-6 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none" 
            placeholder="Describa la evolución del paciente..." 
          />
       </FormSection>

       <FormSection title="Antecedentes Relevantes" icon={<ClipboardList className="h-4 w-4" />}>
          <textarea 
            defaultValue={formData.antecedentes || ''}
            className="w-full h-48 rounded-[2rem] bg-clinical-50/10 border-none ring-1 ring-clinical-100 p-6 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none opacity-80" 
            placeholder="Datos de la ficha de la paciente..." 
            readOnly
          />
       </FormSection>

       <FormSection title="Exploración Física" icon={<Activity className="h-4 w-4" />}>
          <textarea 
            value={formData.physicalExam}
            onChange={(e) => handleChange('physicalExam', e.target.value)}
            className="w-full h-48 rounded-[2rem] bg-clinical-50/50 border-none ring-1 ring-clinical-100 p-6 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none" 
            placeholder="Resultados del examen físico general..." 
          />
       </FormSection>

       <FormSection title="Notas Internas" icon={<FileText className="h-4 w-4" />}>
          <textarea 
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="w-full h-48 rounded-[2rem] bg-clinical-50/50 border-none ring-1 ring-clinical-100 p-6 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none" 
            placeholder="Notas internas o recordatorios..." 
          />
       </FormSection>
    </div>
  )
}

function SignosVitalesTab({ formData, setFormData, isPregnant }: TabProps & { isPregnant: boolean }) {
  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-12">
       <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <SignoInput label="Peso" unit="kg" value={formData.weight} onChange={(v) => handleChange('weight', v)} />
          <SignoInput label="Talla" unit="cm" value={formData.height} onChange={(v) => handleChange('height', v)} />
          <div className="p-5 rounded-2xl bg-primary-50 border border-primary-100 flex flex-col justify-center">
             <p className="text-[9px] font-black text-primary-400 uppercase tracking-widest mb-1">I.M.C.</p>
             <p className="text-2xl font-black text-primary-700">
               {formData.weight && formData.height ? (Number(formData.weight) / Math.pow(Number(formData.height)/100, 2)).toFixed(1) : '—'}
             </p>
          </div>
          <SignoInput label="Presión Arterial" unit="mmHg" value={formData.pressure} onChange={(v) => handleChange('pressure', v)} />
          <SignoInput label="Frecuencia Cardíaca" unit="bpm" value={formData.heartRate} onChange={(v) => handleChange('heartRate', v)} />
          <SignoInput label="Frec. Respiratoria" unit="rpm" value={formData.respRate} onChange={(v) => handleChange('respRate', v)} />
          <SignoInput label="Temperatura" unit="°C" value={formData.temp} onChange={(v) => handleChange('temp', v)} />
          <SignoInput label="Saturación O2" unit="%" value={formData.saturacion} onChange={(v) => handleChange('saturacion', v)} />
       </div>

       {isPregnant && (
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-10 rounded-[3rem] bg-clinical-50 border border-primary-100 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Baby className="h-32 w-32" /></div>
            <div className="flex items-center gap-3 mb-8">
               <div className="h-9 w-9 rounded-xl bg-primary-600 text-white flex items-center justify-center"><Baby className="h-5 w-5" /></div>
               <h3 className="text-xl font-bold text-clinical-900 tracking-tight">Parámetros Obstétricos</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
               <SignoInput label="Altura Uterina" unit="cm" value={formData.alturaUterina || ''} onChange={(v) => handleChange('alturaUterina', v)} />
               <SignoInput label="F.C.F." unit="lpm" value={formData.fcf || ''} onChange={(v) => handleChange('fcf', v)} />
               <SignoInput label="Mov. Fetales" unit="" value={formData.movFetales || ''} onChange={(v) => handleChange('movFetales', v)} />
               <SignoInput label="Edema" unit="" value={formData.edema || ''} onChange={(v) => handleChange('edema', v)} />
               <SignoInput label="Contracciones" unit="" value={formData.contracciones || ''} onChange={(v) => handleChange('contracciones', v)} />
            </div>
         </motion.div>
       )}
    </div>
  )
}

function GinecologiaTab({ formData, setFormData, isPregnant }: TabProps & { isPregnant: boolean }) {
  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
       <div className="space-y-10">
          <FormSection title="Antecedentes Gineco-Obstétricos (Referencia)" icon={<Heart className="h-4 w-4" />}>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <SignoInput label="Gestas" unit="" value={formData.gestas || '0'} readOnly />
                <SignoInput label="Partos" unit="" value={formData.partos || '0'} readOnly />
                <SignoInput label="Cesáreas" unit="" value={formData.cesareas || '0'} readOnly />
                <SignoInput label="Abortos" unit="" value={formData.abortos || '0'} readOnly />
                <SignoInput label="Ciclo Menstrual" unit="Días" value={formData.ciclo || ''} onChange={(v) => handleChange('ciclo', v)} />
                <SignoInput label="Duración Sang." unit="Días" value={formData.duracion || ''} onChange={(v) => handleChange('duracion', v)} />
             </div>
          </FormSection>

          {isPregnant && (
            <FormSection title="Detalles del Embarazo Actual" icon={<Droplet className="h-4 w-4" />}>
               <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                     <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">F.U.M. (Ultima Menstruación)</p>
                     <p className="text-lg font-black text-indigo-700">12 de Abril, 2026</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100">
                     <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">F.P.P. (Probable Parto)</p>
                     <p className="text-lg font-black text-purple-700">12 de Septiembre, 2026</p>
                  </div>
               </div>
            </FormSection>
          )}
       </div>

       <div className="flex flex-col items-center">
          <h4 className="text-xs font-black text-clinical-400 uppercase tracking-widest mb-6">Calendario Clínico</h4>
          <ClinicalCalendar selectedDate={selectedDate} onSelect={setSelectedDate} />
       </div>
    </div>
  )
}

function DiagnosticoTab({ formData, setFormData }: TabProps) {
  const handleChange = (value: string) => {
    setFormData((prev: any) => ({ ...prev, diagnosis: value }))
  }

  return (
    <div className="space-y-10">
       <div className="max-w-full space-y-4">
          <label className="text-xs font-black text-clinical-400 uppercase tracking-widest ml-2">Diagnóstico / Resumen Clínico</label>
          <textarea 
            value={formData.diagnosis}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full h-80 rounded-[2.5rem] bg-clinical-50/50 border-none ring-1 ring-clinical-100 p-8 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none" 
            placeholder="Escriba el diagnóstico definitivo y resumen de la consulta..." 
          />
       </div>
    </div>
  )
}

function PlanTab({ formData, setFormData }: TabProps) {
  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-12">
       <div className="space-y-10">
          <FormSection title="Plan de Tratamiento & Indicaciones" icon={<Pill className="h-4 w-4" />}>
             <textarea 
               value={formData.treatmentPlan}
               onChange={(e) => handleChange('treatmentPlan', e.target.value)}
               className="w-full h-64 rounded-[2.5rem] bg-clinical-50/50 border-none ring-1 ring-clinical-100 p-8 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none" 
               placeholder="Indique el tratamiento a seguir..." 
             />
          </FormSection>

          <FormSection title="Notas de Seguimiento" icon={<CalendarIcon className="h-4 w-4" />}>
             <textarea 
               value={formData.followUp}
               onChange={(e) => handleChange('followUp', e.target.value)}
               className="w-full h-32 rounded-[2rem] bg-clinical-50/50 border-none ring-1 ring-clinical-100 p-6 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none" 
               placeholder="Indique qué se debe revisar en la próxima cita..." 
             />
          </FormSection>
       </div>

       <aside className="space-y-6">
          <div className="p-8 rounded-[3rem] bg-clinical-50/50 border border-clinical-100 flex flex-col gap-4">
             <h4 className="text-[10px] font-black text-clinical-400 uppercase tracking-[0.2em] mb-2 px-2">Acciones Rápidas</h4>
             <QuickPlanAction icon={<FileBadge className="h-5 w-5" />} label="Generar Receta" color="primary" onClick={() => navigate(`/recetas/nueva/${id}`)} />
             <QuickPlanAction icon={<Microscope className="h-5 w-5" />} label="Orden de Laboratorio" color="indigo" />
             <QuickPlanAction icon={<Baby className="h-5 w-5" />} label="Orden de Ecografía" color="purple" />
             <QuickPlanAction icon={<Printer className="h-5 w-5" />} label="Certificado Médico" color="clinical" />
          </div>
       </aside>
    </div>
  )
}

function DocumentosTab() {
  const documents = [
    { id: 1, name: 'Receta Médica - Ana García', type: 'PDF', date: '16 May, 2026', size: '124 KB' },
    { id: 2, name: 'Orden Laboratorio - Perfil Obstétrico', type: 'PDF', date: '16 May, 2026', size: '210 KB' },
  ]
  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-black text-clinical-900 tracking-tight">Documentos Generados</h4>
          <Button variant="secondary" className="rounded-xl h-9 text-[10px] uppercase font-bold tracking-widest">Descargar Todo</Button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map(doc => (
            <div key={doc.id} className="p-6 rounded-[2.5rem] bg-white border border-clinical-100 shadow-sm flex items-center justify-between group hover:border-primary-300 transition-all">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-clinical-50 flex items-center justify-center text-clinical-300 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all"><FileText className="h-6 w-6" /></div>
                  <div>
                     <p className="text-sm font-bold text-clinical-900 leading-none mb-1.5">{doc.name}</p>
                     <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">{doc.date} • {doc.size}</p>
                  </div>
               </div>
               <div className="flex gap-1">
                  <DocAction icon={<Eye className="h-4 w-4" />} title="Ver" />
                  <DocAction icon={<Download className="h-4 w-4" />} title="Descargar" />
               </div>
            </div>
          ))}
       </div>
    </div>
  )
}

/* ==================================================
   HELPERS & SUB-COMPONENTS
   ================================================== */

function BannerStat({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
       <div className="h-8 w-8 rounded-lg bg-white border border-clinical-100 flex items-center justify-center shadow-sm shrink-0">{icon}</div>
       <div className="flex flex-col">
          <span className="text-[9px] font-bold text-clinical-400 uppercase tracking-widest leading-none mb-1.5">{label}</span>
          <span className="text-xs font-bold text-clinical-900 leading-none">{value}</span>
       </div>
    </div>
  )
}

function FormSection({ title, icon, children }: any) {
  return (
    <div className="space-y-6">
       <div className="flex items-center gap-3 px-2">
          <div className="h-9 w-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shadow-sm border border-primary-100">{icon}</div>
          <h3 className="text-sm font-black text-clinical-900 uppercase tracking-widest leading-none">{title}</h3>
       </div>
       {children}
    </div>
  )
}

function SignoInput({ label, unit, value, onChange, readOnly }: any) {
  return (
    <div className="space-y-2">
       <label className="text-[10px] font-black text-clinical-400 uppercase tracking-widest ml-1">{label} {unit && <span className="lowercase font-medium opacity-60">({unit})</span>}</label>
       <input 
          type="text" 
          value={value || ''}
          onChange={(e) => !readOnly && onChange && onChange(e.target.value)}
          readOnly={readOnly}
          className={cn(
            "w-full h-12 px-5 rounded-2xl border-none ring-1 ring-clinical-100 text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm",
            readOnly ? "bg-clinical-50/50 text-clinical-400 cursor-not-allowed" : "bg-clinical-50 text-clinical-900"
          )}
       />
    </div>
  )
}

function QuickPlanAction({ icon, label, color, onClick }: any) {
  const colors = {
    primary: 'hover:bg-primary-600 hover:text-white text-primary-600 border-primary-100',
    indigo: 'hover:bg-indigo-600 hover:text-white text-indigo-600 border-indigo-100',
    purple: 'hover:bg-purple-600 hover:text-white text-purple-600 border-purple-100',
    clinical: 'hover:bg-clinical-900 hover:text-white text-clinical-900 border-clinical-200'
  }
  return (
    <button 
      onClick={onClick}
      className={cn("w-full h-14 px-6 rounded-2xl bg-white border font-bold text-xs uppercase tracking-widest flex items-center gap-4 shadow-sm transition-all active:scale-[0.98]", colors[color as keyof typeof colors])}
    >
       {icon} {label}
    </button>
  )
}

function DocAction({ icon, title }: any) {
  return (
    <button className="h-10 w-10 flex flex-col items-center justify-center rounded-xl text-clinical-300 hover:text-primary-600 hover:bg-primary-50 transition-all" title={title}>
       {icon}
       <span className="text-[8px] font-bold mt-0.5">{title}</span>
    </button>
  )
}

function ClinicalCalendar({ selectedDate, onSelect }: any) {
  const days = Array.from({ length: 31 })
  return (
    <div className="w-full max-w-[280px]">
       <div className="flex justify-between items-center mb-6 px-2">
          <button className="h-8 w-8 rounded-lg hover:bg-clinical-100 flex items-center justify-center"><ChevronLeft className="h-4 w-4" /></button>
          <span className="text-sm font-black uppercase tracking-widest">Mayo 2026</span>
          <button className="h-8 w-8 rounded-lg hover:bg-clinical-100 flex items-center justify-center"><ChevronRight className="h-4 w-4" /></button>
       </div>
       <div className="grid grid-cols-7 gap-1">
          {['L','M','M','J','V','S','D'].map(d => <div key={d} className="text-[9px] font-black text-clinical-300 text-center py-2">{d}</div>)}
          {days.map((_, i) => (
            <button 
              key={i} 
              onClick={() => onSelect(new Date(2026, 4, i+1))}
              className={cn(
                "h-8 w-8 rounded-lg text-[11px] font-bold flex items-center justify-center transition-all",
                i + 1 === 12 ? "bg-primary-600 text-white shadow-lg shadow-primary-200 scale-110" : "hover:bg-clinical-100 text-clinical-700"
              )}
            >
               {i + 1}
            </button>
          ))}
       </div>
    </div>
  )
}
