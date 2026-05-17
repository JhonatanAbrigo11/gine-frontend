import { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  History, 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Trash2, 
  Pill, 
  Heart, 
  Stethoscope, 
  FileText, 
  Activity, 
  Calendar as CalendarIcon,
  FileBadge,
  Microscope,
  Baby,
  Printer,
  Eye,
  Download,
  AlertCircle,
  Clock,
  CheckCircle2,
  ExternalLink,
  Loader2,
  ClipboardList,
  Droplet,
  TrendingUp
} from 'lucide-react'
import { ResultsManagerModal } from '../../ordenes-page/ui/organisms/ResultsManagerModal'
import { orderService } from '@/modules/orders/services/order.service'
import type { MedicalOrder } from '@/modules/orders/types/order.types'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/widgets/button'
import { useConsultationStore } from '@/modules/consultations/store/useConsultationStore'
import { consultationService } from '@/modules/consultations/services/consultation.service'
import { useToast } from '@/shared/ui/ToastContext'
import axios from 'axios'

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

export function NuevaConsultaPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('evolucion')
  const [selectedOrder, setSelectedOrder] = useState<MedicalOrder | null>(null)
  const [showResultsModal, setShowResultsModal] = useState(false)
  
  // Refrescar datos de la consulta para ver cambios en órdenes
  const refreshData = async () => {
    if (consultationId) {
      const data = await axios.get(`http://127.0.0.1:3001/api/consultations/${consultationId}`).then(res => res.data)
      loadConsultation(data)
    }
  }
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const { showToast } = useToast()
  
  const { patientId } = useParams()
  const location = useLocation()
  const consultationId = location.state?.consultationId
  const isObstetricRoute = location.pathname.startsWith('/control-obstetrico')

  const { 
    consultation, 
    patient, 
    inheritance,
    loading: storeLoading, 
    initConsultation,
    loadConsultation,
    originalConsultation,
    reset 
  } = useConsultationStore()

  const isPregnant = isObstetricRoute || consultation?.type === 'Control Prenatal'

  const dynamicTabs = useMemo(() => {
    return TABS.map(tab => {
      if (tab.id === 'ginecologia' && isPregnant) {
        return { ...tab, label: 'Obstetricia', icon: Baby }
      }
      return tab
    })
  }, [isPregnant])

  const isDirty = useMemo(() => {
    if (!consultation || !originalConsultation) return false;
    return JSON.stringify(consultation) !== originalConsultation;
  }, [consultation, originalConsultation]);

  // Interceptar recarga / cierre de pestaña del navegador
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Tiene cambios sin guardar en la consulta. ¿Está seguro que desea salir?';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  const handleCancelExit = () => {
    setShowExitConfirm(false);
  };

  const handleDiscardAndExit = () => {
    setShowExitConfirm(false);
    navigate(isObstetricRoute ? '/control-obstetrico' : '/consultas');
  };

  const [localLoading, setLocalLoading] = useState(false)
  const isEditMode = !!consultationId



  useEffect(() => {
    if (consultationId) {
      const fetchEditData = async () => {
        try {
          setLocalLoading(true)
          const data = await consultationService.getById(consultationId)
          loadConsultation(data)
        } catch (error) {
          console.error('Error loading for edit:', error)
          showToast('Error al cargar la consulta para edición', 'error')
        } finally {
          setLocalLoading(false)
        }
      }
      fetchEditData()
    } else if (patientId) {
      consultationService.init(patientId).then((data) => {
        initConsultation(data)
        const initialType = location.state?.initialType || (isObstetricRoute ? 'Control Prenatal' : null)
        if (initialType) {
          useConsultationStore.getState().updateConsultation({ type: initialType })
          const current = useConsultationStore.getState().consultation
          if (current) {
            useConsultationStore.setState({ originalConsultation: JSON.stringify(current) })
          }
        }
      })
    }
    return () => reset()
  }, [patientId, consultationId, location.state])

  // Limpieza de URL en caliente: Si el usuario recarga una URL antigua con UUID, lo redirigimos silenciosamente a la cédula
  useEffect(() => {
    if (patient && patient.numeroDocumento && patientId && patientId !== patient.numeroDocumento) {
      navigate(location.pathname.replace(patientId, patient.numeroDocumento), { 
        replace: true, 
        state: location.state 
      })
    }
  }, [patient, patientId, location.pathname, location.state, navigate])

  const handleSave = async (redirectPath?: string) => {
    if (!consultation) return
    try {
      setLocalLoading(true)

      // Guardar antecedentes del paciente si fueron modificados
      if (patient && patient.id) {
        await axios.patch(`http://127.0.0.1:3001/api/patients/${patient.id}`, {
          antecedentes: patient.antecedentes
        })
      }

      if (isEditMode && consultationId) {
        await consultationService.update(consultationId, consultation)
        showToast('Consulta clínica actualizada con éxito', 'success')
      } else {
        await consultationService.save(consultation)
        showToast('Consulta clínica guardada con éxito', 'success')
      }
      
      // Actualizar originalConsultation para limpiar estado dirty
      useConsultationStore.setState({ originalConsultation: JSON.stringify(consultation) })
      
      setShowExitConfirm(false)
      navigate(redirectPath || (isObstetricRoute ? '/control-obstetrico' : '/consultas'))
      return true
    } catch (error: any) {
      console.error('Error saving:', error)
      const errorMsg = error?.response?.data?.error || 'Error al guardar la consulta clínica'
      showToast(errorMsg, 'error', 10000)
      return false
    } finally {
      setLocalLoading(false)
    }
  }

  // Patrón de Sincronización de Refs para evitar bucles infinitos de renderizado
  const handleSaveRef = useRef(handleSave);
  
  useEffect(() => {
    handleSaveRef.current = handleSave;
  }, [handleSave]);

  useEffect(() => {
    useConsultationStore.setState({
      saveHandler: async (redirectPath?: string) => {
        return await handleSaveRef.current(redirectPath);
      }
    });
    return () => {
      useConsultationStore.setState({ saveHandler: null });
    };
  }, []); // Mount/Unmount solo una vez!

  if (localLoading || !consultation || !patient) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-clinical-50">
        <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
      </div>
    )
  }

  // const isPregnant = consultation.type === 'Control Prenatal'
  const patientAge = patient.edad || '—'

  return (
    <div className="min-h-dvh bg-clinical-50/50 flex flex-col">
      {/* Premium Header */}
      <header className="bg-white border-b border-clinical-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="px-6 py-4 flex items-center justify-between border-b border-clinical-50">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => {
                  if (isDirty) {
                    setShowExitConfirm(true)
                  } else {
                    navigate(isObstetricRoute ? '/control-obstetrico' : '/consultas')
                  }
                }} 
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
                   <p className="text-xs font-bold text-clinical-500 mt-1.5 uppercase tracking-widest">{patientAge} Años • HC: {patient.numeroDocumento} • <span className="text-primary-600 font-black">Consulta {isEditMode ? 'Activa' : 'Nueva'}</span></p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
             <Button 
               variant="ghost" 
               className="h-11 px-6 rounded-2xl font-bold text-clinical-500 hover:text-clinical-900"
               onClick={() => {
                 if (isDirty) {
                   setShowExitConfirm(true)
                 } else {
                   navigate(isObstetricRoute ? '/control-obstetrico' : '/consultas')
                 }
               }}
             >
               {isEditMode ? 'Cancelar Edición' : 'Descartar'}
             </Button>
             <Button 
               variant="primary" 
               className="rounded-2xl h-11 px-8 shadow-xl shadow-primary-200 font-bold tracking-tight group"
               onClick={() => handleSave()}
               disabled={localLoading}
             >
               {localLoading ? (
                 <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               ) : (
                 <>
                   <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
                   {isEditMode ? 'Finalizar Edición' : 'Finalizar Consulta'}
                 </>
               )}
             </Button>
            </div>
          </div>

          {/* Status Indicators only */}
          {isPregnant && (
             <div className="px-6 py-3 bg-clinical-50/30 flex items-center justify-end">
                <div className="flex gap-2">
                   <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-tighter border border-emerald-200">Embarazada</span>
                   <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-tighter border border-amber-200">Control Prenatal</span>
                </div>
             </div>
          )}
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="bg-white border-b border-clinical-100 sticky top-[138px] z-40">
         <div className="max-w-7xl mx-auto px-6 flex gap-1">
            {dynamicTabs.map(tab => {
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
                  {activeTab === 'evolucion' && <EvolucionTab />}
                  {activeTab === 'signos' && <SignosVitalesTab isPregnant={isPregnant} />}
                  {activeTab === 'ginecologia' && <GinecologiaTab isPregnant={isPregnant} />}
                  {activeTab === 'diagnostico' && <DiagnosticoTab />}
                  {activeTab === 'plan' && <PlanTab onSave={async () => { await handleSave(); }} />}
                  {activeTab === 'documentos' && <DocumentosTab onOpenResults={(order) => {
                setSelectedOrder(order)
                setShowResultsModal(true)
              }} />}
               </motion.div>
            </AnimatePresence>
            {selectedOrder && (
              <ResultsManagerModal 
                isOpen={showResultsModal}
                onClose={() => setShowResultsModal(false)}
                order={selectedOrder}
                onUpdate={refreshData}
              />
            )}
         </div>
      </main>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
         {showExitConfirm && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCancelExit} className="absolute inset-0 bg-clinical-900/60 backdrop-blur-md" />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center border border-clinical-100"
              >
                 <div className="h-16 w-16 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm"><AlertCircle className="h-8 w-8" /></div>
                 <h3 className="text-xl font-black text-clinical-900 mb-2">¿Cambios sin Guardar?</h3>
                 <p className="text-sm font-medium text-clinical-500 mb-8">Hay modificaciones en la consulta de <span className="font-bold text-clinical-850">{patient.nombres} {patient.apellidos}</span> que no se han guardado aún.</p>
                 
                 <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => handleSave()}
                      className="h-13 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2"
                    >
                       <Save className="h-4 w-4" />
                       Guardar Cambios y Salir
                    </button>
                    
                    <button 
                      onClick={handleDiscardAndExit} 
                      className="h-13 rounded-2xl border border-rose-200 text-rose-600 hover:bg-rose-50/50 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                       <Trash2 className="h-4 w-4" />
                       Salir de todos modos (Sin guardar)
                    </button>
                    
                    <button 
                      onClick={handleCancelExit} 
                      className="h-11 rounded-2xl bg-clinical-50 text-clinical-450 hover:bg-clinical-100/50 text-xs font-bold uppercase tracking-widest transition-all"
                    >
                       Cancelar y Seguir Editando
                    </button>
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

function EvolucionTab() {
  const { consultation, updateConsultation, patient } = useConsultationStore()
  if (!consultation) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
       <div className="col-span-full grid grid-cols-3 gap-6 mb-4">
          <div className="col-span-1">
             <label className="text-[10px] font-black uppercase tracking-[0.15em] text-clinical-400 mb-2 block ml-2">Tipo de Atención</label>
             <select 
               value={consultation.type}
               onChange={(e) => updateConsultation({ type: e.target.value })}
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
               value={consultation.reason}
               onChange={(e) => updateConsultation({ reason: e.target.value })}
               className="w-full h-12 px-5 rounded-2xl bg-clinical-50 border-none ring-1 ring-clinical-100 text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none" 
               placeholder="Ej: Control prenatal rutinario de segundo trimestre" 
             />
          </div>
       </div>

       <FormSection title="Enfermedad Actual / Evolución" icon={<History className="h-4 w-4" />}>
          <textarea 
            value={consultation.evolution}
            onChange={(e) => updateConsultation({ evolution: e.target.value })}
            className="w-full h-48 rounded-[2rem] bg-clinical-50/50 border-none ring-1 ring-clinical-100 p-6 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none" 
            placeholder="Describa la evolución del paciente..." 
          />
       </FormSection>

       <FormSection title="Antecedentes Relevantes (Referencia)" icon={<ClipboardList className="h-4 w-4" />}>
          <textarea 
            value={patient?.antecedentes || ''}
            onChange={(e) => {
              if (patient) {
                useConsultationStore.setState({
                  patient: { ...patient, antecedentes: e.target.value }
                })
              }
            }}
            className="w-full h-48 rounded-[2rem] bg-clinical-50/50 border-none ring-1 ring-clinical-100 p-6 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none" 
            placeholder="Escriba los antecedentes médicos de la paciente aquí..." 
          />
       </FormSection>
    </div>
  )
}

function SignosVitalesTab({ isPregnant }: { isPregnant: boolean }) {
  const { consultation, updateVitalSigns, inheritance } = useConsultationStore()
  if (!consultation) return null

  return (
    <div className="space-y-12">
       <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <SignoInput 
            label="Peso" unit="kg" 
            value={consultation.vitalSigns.weight} 
            onChange={(v) => updateVitalSigns({ weight: v })} 
            reference={inheritance?.lastWeight}
          />
          <SignoInput 
            label="Presión Arterial" unit="mmHg" 
            value={consultation.vitalSigns.pressure} 
            onChange={(v) => updateVitalSigns({ pressure: v })} 
            reference={inheritance?.lastPressure}
          />
          <div className="p-5 rounded-2xl bg-primary-50 border border-primary-100 flex flex-col justify-center">
             <p className="text-[9px] font-black text-primary-400 uppercase tracking-widest mb-1">I.M.C.</p>
             <p className="text-2xl font-black text-primary-700">
               {consultation.vitalSigns.weight && consultation.vitalSigns.height ? (Number(consultation.vitalSigns.weight) / Math.pow(Number(consultation.vitalSigns.height)/100, 2)).toFixed(1) : '—'}
             </p>
          </div>
          <SignoInput label="Talla" unit="cm" value={consultation.vitalSigns.height} onChange={(v) => updateVitalSigns({ height: v })} />
          <SignoInput label="Frecuencia Cardíaca" unit="bpm" value={consultation.vitalSigns.heartRate} onChange={(v) => updateVitalSigns({ heartRate: v })} />
          <SignoInput label="Frec. Respiratoria" unit="rpm" value={consultation.vitalSigns.respRate} onChange={(v) => updateVitalSigns({ respRate: v })} />
          <SignoInput label="Temperatura" unit="°C" value={consultation.vitalSigns.temp} onChange={(v) => updateVitalSigns({ temp: v })} />
          <SignoInput label="Saturación O2" unit="%" value={consultation.vitalSigns.saturacion} onChange={(v) => updateVitalSigns({ saturacion: v })} />
       </div>

       {isPregnant && (
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-10 rounded-[3rem] bg-clinical-50 border border-primary-100 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Baby className="h-32 w-32" /></div>
            <div className="flex items-center gap-3 mb-8">
               <div className="h-9 w-9 rounded-xl bg-primary-600 text-white flex items-center justify-center"><Baby className="h-5 w-5" /></div>
               <h3 className="text-xl font-bold text-clinical-900 tracking-tight">Parámetros Obstétricos</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
               <SignoInput label="Altura Uterina" unit="cm" value={consultation.vitalSigns.alturaUterina} onChange={(v) => updateVitalSigns({ alturaUterina: v })} reference={inheritance?.lastAlturaUterina} />
               <SignoInput label="F.C.F." unit="lpm" value={consultation.vitalSigns.fcf} onChange={(v) => updateVitalSigns({ fcf: v })} reference={inheritance?.lastFcf} />
               <SignoInput label="Mov. Fetales" unit="" value={consultation.vitalSigns.movFetales} onChange={(v) => updateVitalSigns({ movFetales: v })} />
               <SignoInput label="Edema" unit="" value={consultation.vitalSigns.edema} onChange={(v) => updateVitalSigns({ edema: v })} />
               <SignoInput label="Contracciones" unit="" value={consultation.vitalSigns.contracciones} onChange={(v) => updateVitalSigns({ contracciones: v })} />
            </div>
         </motion.div>
       )}
    </div>
  )
}

function GinecologiaTab({ isPregnant }: { isPregnant: boolean }) {
  const { consultation, updateGynecology } = useConsultationStore()
  const [viewDate, setViewDate] = useState<Date>(new Date())
  
  if (!consultation) return null

  const g = consultation.gynecology

  // Lógica de cálculo obstétrico automático
  const obstetricCalc = useMemo(() => {
    if (!g.fum) return null
    try {
      const fumDate = new Date(g.fum)
      const today = new Date()
      
      const fppDate = new Date(fumDate.getTime() + 280 * 24 * 60 * 60 * 1000)
      
      const diffTime = today.getTime() - fumDate.getTime()
      const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
      const weeks = Math.floor(diffDays / 7)
      const remainingDays = diffDays % 7
      const egString = `${weeks}.${remainingDays} Semanas`

      let trimester = 'Primer Trimestre'
      if (weeks >= 13 && weeks < 28) {
        trimester = 'Segundo Trimestre'
      } else if (weeks >= 28) {
        trimester = 'Tercer Trimestre'
      }
      
      return {
        fpp: fppDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
        eg: egString,
        weeks,
        trimester
      }
    } catch (e) {
      return null
    }
  }, [g.fum])

  useEffect(() => {
    if (obstetricCalc) {
      updateGynecology({
        fpp: obstetricCalc.fpp,
        eg: obstetricCalc.eg
      })
    }
  }, [obstetricCalc, updateGynecology])

  // Lógica de cálculo de ciclo para el calendario (Ginecología estándar)
  const cycleInfo = useMemo(() => {
    if (!g.fum) return null
    const fumDate = new Date(g.fum)
    const cycle = g.ciclo || 28
    const duration = g.duracion || 5
    
    return { fumDate, cycle, mensesDuration: duration }
  }, [g.fum, g.ciclo, g.duracion])

  // ----------------------------------------------------
  // VISTA 1: OBSTETRICIA PREMIUM (CONTROL PRENATAL)
  // ----------------------------------------------------
  if (isPregnant) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
        <div className="space-y-10">
          {/* Seguimiento Gestacional */}
          <FormSection title="Seguimiento Gestacional" icon={<Baby className="h-4 w-4" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-clinical-400 mb-2 block ml-1">F.U.M. (Fecha Última Menstruación)</label>
                <input 
                  type="date" 
                  value={g.fum ? g.fum.split('T')[0] : ''}
                  onChange={(e) => updateGynecology({ fum: e.target.value })}
                  className="w-full h-12 px-5 rounded-2xl bg-clinical-50 border-none ring-1 ring-clinical-100 text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none" 
                />
              </div>

              {obstetricCalc ? (
                <div className="p-6 rounded-[2rem] bg-primary-50 border border-primary-100 flex flex-col justify-between shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                    <Baby className="h-20 w-20 text-primary-600 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-primary-400 uppercase tracking-widest block mb-1">Cálculo Gestacional</span>
                    <p className="text-xl font-black text-primary-700 leading-tight">{obstetricCalc.eg}</p>
                    <p className="text-xs font-semibold text-clinical-500 mt-1">{obstetricCalc.trimester}</p>
                  </div>
                  <div className="mt-4 border-t border-primary-200/50 pt-3">
                    <span className="text-[9px] font-bold text-clinical-400 uppercase tracking-widest block mb-1">F.P.P. (Fecha Probable de Parto)</span>
                    <p className="text-xs font-black text-clinical-800">{obstetricCalc.fpp}</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-[2rem] bg-clinical-50 border border-clinical-100 flex flex-col items-center justify-center text-center opacity-65">
                  <AlertCircle className="h-6 w-6 text-clinical-400 mb-2" />
                  <p className="text-xs font-bold text-clinical-500 uppercase tracking-widest">Ingrese la F.U.M.</p>
                  <p className="text-[10px] text-clinical-400 mt-1">Para calcular automáticamente semanas y FPP</p>
                </div>
              )}
            </div>
          </FormSection>

          {/* Fórmula Obstétrica */}
          <FormSection title="Fórmula Obstétrica" icon={<TrendingUp className="h-4 w-4" />}>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
              <SignoInput label="Gestas (G)" value={g.gestas || 0} onChange={(v) => updateGynecology({ gestas: parseInt(v) || 0 })} />
              <SignoInput label="Partos (P)" value={g.partos || 0} onChange={(v) => updateGynecology({ partos: parseInt(v) || 0 })} />
              <SignoInput label="Cesáreas (C)" value={g.cesareas || 0} onChange={(v) => updateGynecology({ cesareas: parseInt(v) || 0 })} />
              <SignoInput label="Abortos (A)" value={g.abortos || 0} onChange={(v) => updateGynecology({ abortos: parseInt(v) || 0 })} />
              <SignoInput label="Hijos Vivos (HV)" value={g.hijosVivos || 0} onChange={(v) => updateGynecology({ hijosVivos: parseInt(v) || 0 })} />
              <SignoInput label="Ectópicos (E)" value={g.ectopicos || 0} onChange={(v) => updateGynecology({ ectopicos: parseInt(v) || 0 })} />
            </div>
          </FormSection>

          {/* Observaciones Obstétricas */}
          <FormSection title="Observaciones Obstétricas" icon={<Stethoscope className="h-4 w-4" />}>
            <textarea 
              value={g.observaciones || ''}
              onChange={(e) => updateGynecology({ observaciones: e.target.value })}
              className="w-full h-32 rounded-[2rem] bg-clinical-50/50 border-none ring-1 ring-clinical-100 p-6 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none" 
              placeholder="Notas adicionales del control prenatal..." 
            />
          </FormSection>
        </div>

        {/* Barra Lateral Obstétrica */}
        <div className="flex flex-col items-center w-full">
          <div className="w-full bg-primary-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-primary-200 flex flex-col justify-between min-h-[340px]">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Baby className="h-28 w-28" /></div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] mb-4 text-primary-100 block">Monitoreo Obstétrico</span>
              <h4 className="text-3xl font-black tracking-tight leading-tight mb-2">Control Prenatal</h4>
              <p className="text-xs text-primary-100/70 leading-relaxed mb-6">Registre las mediciones en cada consulta para construir el historial prenatal y realizar el seguimiento evolutivo de la gestación.</p>
            </div>
            
            {obstetricCalc && (
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                <span className="text-[9px] font-black text-primary-200 uppercase tracking-widest block mb-1">Edad Gestacional</span>
                <p className="text-lg font-black text-white">{obstetricCalc.eg}</p>
                <div className="w-full bg-white/20 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="bg-white h-full rounded-full transition-all duration-550" 
                    style={{ width: `${Math.min((obstetricCalc.weeks / 40) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[8px] font-black text-primary-200 uppercase mt-1.5">
                  <span>Sem 0</span>
                  <span>Sem 40</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ----------------------------------------------------
  // VISTA 2: GINECOLOGÍA ESTÁNDAR
  // ----------------------------------------------------
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
       <div className="space-y-10">
          <FormSection title="Antecedentes Gineco-Obstétricos" icon={<Heart className="h-4 w-4" />}>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="col-span-full">
                   <label className="text-[10px] font-black uppercase tracking-widest text-clinical-400 mb-2 block ml-1">F.U.M. (Fecha Última Menstruación)</label>
                   <input 
                     type="date" 
                     value={g.fum ? g.fum.split('T')[0] : ''}
                     onChange={(e) => updateGynecology({ fum: e.target.value })}
                     className="w-full h-12 px-5 rounded-2xl bg-clinical-50 border-none ring-1 ring-clinical-100 text-sm font-bold text-clinical-900 focus:ring-2 focus:ring-primary-500 outline-none" 
                   />
                </div>
                <SignoInput label="Ciclo Menstrual" unit="Días" value={g.ciclo} onChange={(v) => updateGynecology({ ciclo: parseInt(v) || 28 })} />
                <SignoInput label="Duración Sang." unit="Días" value={g.duracion} onChange={(v) => updateGynecology({ duracion: parseInt(v) || 5 })} />
                <SignoInput label="Método" value={g.metodo} onChange={(v) => updateGynecology({ metodo: v })} />
             </div>
          </FormSection>

          <FormSection title="Observaciones Ginecológicas" icon={<Stethoscope className="h-4 w-4" />}>
             <textarea 
               value={g.observaciones || ''}
               onChange={(e) => updateGynecology({ observaciones: e.target.value })}
               className="w-full h-32 rounded-2xl bg-clinical-50/50 border-none ring-1 ring-clinical-100 p-6 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none" 
               placeholder="Notas adicionales..." 
             />
          </FormSection>
       </div>

       <div className="flex flex-col items-center">
          <h4 className="text-xs font-black text-clinical-400 uppercase tracking-widest mb-6">Calendario Menstrual</h4>
          <ClinicalCalendar 
            selectedDate={viewDate} 
            onSelect={setViewDate} 
            cycleInfo={cycleInfo}
            mensesDuration={g.duracion}
          />
          
          <div className="mt-8 w-full max-w-[280px] grid grid-cols-2 gap-x-4 gap-y-2">
             <LegendItem color="bg-pink-400" label="Menstruación" />
             <LegendItem color="bg-green-400" label="Ovulación" />
             <LegendItem color="bg-amber-300" label="Días Fértiles" />
          </div>
       </div>
    </div>
  )
}


function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-3">
       <div className={cn("h-2.5 w-2.5 rounded-full", color)} />
       <span className="text-[9px] font-black text-clinical-400 uppercase tracking-widest">{label}</span>
    </div>
  )
}

function DiagnosticoTab() {
  const { consultation, updateConsultation } = useConsultationStore()
  if (!consultation) return null

  return (
    <div className="space-y-10">
       <div className="max-w-full space-y-4">
          <label className="text-xs font-black text-clinical-400 uppercase tracking-widest ml-2">Diagnóstico / Resumen Clínico</label>
          <textarea 
            value={consultation.evolution} // Reutilizando evolution o mapear a diagnósticos
            onChange={(e) => updateConsultation({ evolution: e.target.value })}
            className="w-full h-80 rounded-[2.5rem] bg-clinical-50/50 border-none ring-1 ring-clinical-100 p-8 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none" 
            placeholder="Escriba el diagnóstico definitivo y resumen de la consulta..." 
          />
       </div>
    </div>
  )
}

function PlanTab({ onSave }: { onSave: () => Promise<void> }) {
  const { consultation, patient, updateTreatment } = useConsultationStore()
  const navigate = useNavigate()
  if (!consultation) return null

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-12">
       <div className="space-y-10">
          <FormSection title="Plan de Tratamiento & Indicaciones" icon={<Pill className="h-4 w-4" />}>
             <textarea 
               value={consultation.treatment.plan}
               onChange={(e) => updateTreatment({ plan: e.target.value })}
               className="w-full h-64 rounded-[2.5rem] bg-clinical-50/50 border-none ring-1 ring-clinical-100 p-8 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none" 
               placeholder="Indique el tratamiento a seguir..." 
             />
          </FormSection>

          <FormSection title="Notas de Seguimiento (Para próxima cita)" icon={<CalendarIcon className="h-4 w-4" />}>
             <textarea 
               value={consultation.treatment.followUp}
               onChange={(e) => updateTreatment({ followUp: e.target.value })}
               className="w-full h-32 rounded-[2rem] bg-clinical-50/50 border-none ring-1 ring-clinical-100 p-6 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none" 
               placeholder="Indique qué se debe revisar en la próxima cita..." 
             />
          </FormSection>
</div>

       <aside className="space-y-6">
          <div className="p-8 rounded-[3rem] bg-clinical-50/50 border border-clinical-100 flex flex-col gap-4">
             <h4 className="text-[10px] font-black text-clinical-400 uppercase tracking-[0.2em] mb-2 px-2">Acciones Rápidas</h4>
             <QuickPlanAction 
                icon={<FileBadge className="h-5 w-5" />} 
                label="Generar Receta" 
                color="primary" 
                onClick={() => navigate(`/recetas/nueva/${patient?.numeroDocumento || patient?.id}`)} 
             />
             <QuickPlanAction 
                icon={<Microscope className="h-5 w-5" />} 
                label="Orden de Laboratorio" 
                color="indigo" 
                onClick={async () => {
                  await onSave()
                  navigate(`/ordenes/nueva/${patient?.numeroDocumento || patient?.id}`, { state: { consultationId: consultation.id, type: 'laboratorio' } })
                }}
             />
             <QuickPlanAction 
                icon={<Baby className="h-5 w-5" />} 
                label="Orden de Ecografía" 
                color="purple" 
                onClick={async () => {
                  await onSave()
                  navigate(`/ordenes/nueva/${patient?.numeroDocumento || patient?.id}`, { state: { consultationId: consultation.id, type: 'ecografia' } })
                }}
             />
             <QuickPlanAction 
                icon={<Printer className="h-5 w-5" />} 
                label="Certificado Médico" 
                color="clinical" 
             />
          </div>
       </aside>
    </div>
  )
}

function DocumentosTab({ onOpenResults }: { onOpenResults: (order: MedicalOrder) => void }) {
  const { consultation } = useConsultationStore()
  if (!consultation) return null

  const orders = consultation.medicalOrders || []

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-black text-clinical-900 tracking-tight">Órdenes Médicas & Resultados</h4>
          <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">{orders.length} documentos encontrados</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order: MedicalOrder) => (
            <div key={order.id} className="p-6 rounded-[2.5rem] bg-white border border-clinical-100 shadow-sm flex items-center justify-between group hover:border-primary-300 transition-all">
               <div className="flex items-center gap-4">
                  <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-all",
                    order.status === 'Completado' || (order.status as string) === 'Resultado subido' 
                      ? "bg-emerald-50 text-emerald-600" 
                      : "bg-clinical-50 text-clinical-300 group-hover:bg-primary-50 group-hover:text-primary-600"
                  )}>
                    {order.orderType?.slug === 'ecografia' ? <Baby className="h-6 w-6" /> : <Microscope className="h-6 w-6" />}
                  </div>
                  <div>
                     <p className="text-sm font-bold text-clinical-900 leading-none mb-1.5">
                       {order.orderType?.name} - {order.secuencial}
                     </p>
                     <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg",
                          order.status === 'Completado' || (order.status as string) === 'Resultado subido'
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        )}>
                          {order.status}
                        </span>
                        <span className="text-[9px] font-bold text-clinical-400 uppercase tracking-widest">
                          {new Date(order.date).toLocaleDateString()}
                        </span>
                     </div>
                  </div>
               </div>
               <div className="flex gap-1">
                  <DocAction 
                    icon={<Eye className="h-4 w-4" />} 
                    title="Ver" 
                    onClick={() => onOpenResults(order)}
                  />
                  {(order.results?.length || 0) > 0 && (
                    <DocAction icon={<Download className="h-4 w-4" />} title="Bajar" />
                  )}
               </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center opacity-40">
               <div className="h-16 w-16 rounded-full bg-clinical-50 flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-clinical-200" />
               </div>
               <p className="text-sm font-black text-clinical-900 uppercase tracking-widest">No hay órdenes generadas en esta consulta</p>
               <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest mt-1">Usa la pestaña de 'Plan & Tratamiento' para generar una</p>
            </div>
          )}
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

function SignoInput({ label, unit, value, onChange, readOnly, reference }: any) {
  return (
    <div className="space-y-2">
       <div className="flex items-center justify-between ml-1">
          <label className="text-[10px] font-black text-clinical-400 uppercase tracking-widest">{label} {unit && <span className="lowercase font-medium opacity-60">({unit})</span>}</label>
          {reference && <span className="text-[9px] font-bold text-primary-400 bg-primary-50 px-2 py-0.5 rounded-lg">Ant: {reference}</span>}
       </div>
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

function DocAction({ icon, title, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="h-10 w-10 flex flex-col items-center justify-center rounded-xl text-clinical-300 hover:text-primary-600 hover:bg-primary-50 transition-all" 
      title={title}
    >
       {icon}
       <span className="text-[8px] font-bold mt-0.5">{title}</span>
    </button>
  )
}

function ClinicalCalendar({ selectedDate, onSelect, cycleInfo, mensesDuration }: any) {
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  const days = Array.from({ length: daysInMonth })
  const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(selectedDate);

  const getDayStatus = (day: number) => {
    if (!cycleInfo) return null;
    const date = new Date(currentYear, currentMonth, day);
    const fumDate = new Date(cycleInfo.fumDate);
    
    const diffDays = Math.floor((date.getTime() - fumDate.getTime()) / (1000 * 60 * 60 * 24));
    const cycle = cycleInfo.cycle || 28;
    const menses = mensesDuration || 5;
    
    const cycleDay = ((diffDays % cycle) + cycle) % cycle;
    
    if (cycleDay < menses) return 'menses';
    const ovulationDay = Math.floor(cycle / 2);
    if (cycleDay === ovulationDay) return 'ovulation';
    if (cycleDay >= ovulationDay - 3 && cycleDay <= ovulationDay + 3) return 'fertile';
    
    return null;
  }

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentYear, currentMonth + offset, 1);
    onSelect(newDate);
  }

  return (
    <div className="w-full max-w-[280px]">
       <div className="flex justify-between items-center mb-6 px-2">
          <button onClick={() => changeMonth(-1)} className="h-8 w-8 rounded-lg hover:bg-clinical-100 flex items-center justify-center transition-all"><ChevronLeft className="h-4 w-4" /></button>
          <span className="text-sm font-black uppercase tracking-widest">{monthName}</span>
          <button onClick={() => changeMonth(1)} className="h-8 w-8 rounded-lg hover:bg-clinical-100 flex items-center justify-center transition-all"><ChevronRight className="h-4 w-4" /></button>
       </div>
       <div className="grid grid-cols-7 gap-1">
          {['L','M','X','J','V','S','D'].map((d, idx) => <div key={`${d}-${idx}`} className="text-[9px] font-black text-clinical-300 text-center py-2">{d}</div>)}
          
          {Array.from({ length: adjustedFirstDay }).map((_, i) => <div key={`empty-${i}`} />)}
          
          {days.map((_, i) => {
            const day = i + 1;
            const status = getDayStatus(day);
            const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth;
            
            return (
              <button 
                key={day} 
                onClick={() => onSelect(new Date(currentYear, currentMonth, day))}
                className={cn(
                  "h-8 w-8 rounded-lg text-[11px] font-bold flex items-center justify-center transition-all relative",
                  status === 'menses' && "bg-pink-400 text-white shadow-sm",
                  status === 'ovulation' && "bg-green-400 text-white shadow-sm",
                  status === 'fertile' && "bg-amber-300 text-amber-900",
                  !status && "hover:bg-clinical-100 text-clinical-700",
                  isSelected && !status && "bg-primary-600 text-white shadow-lg"
                )}
              >
                 {day}
              </button>
            )
          })}
       </div>
    </div>
  )
}
