import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
   ArrowLeft,
   Baby,
   Calendar,
   TrendingUp,
   AlertTriangle,
   Heart,
   Activity,
   FileText,
   ClipboardList,
   History,
   ChevronRight,
   Plus,
   Save,
   Printer,
   CheckCircle2,
   AlertCircle,
   Eye,
   Microscope,
   X,
   Loader2,
   Download,
   Upload
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/widgets/button'
import { useToast } from '@/shared/ui/ToastContext'
import {
   usePregnancy,
   usePrenatalControls,
   usePregnancyRisks,
   usePregnancyEchographies,
   useAddPrenatalControl,
   useAddEchography,
   useUpdatePregnancy,
} from '@/entities/pregnancy'
import type { PrenatalControl, PregnancyRisk, PregnancyEchography } from '@/entities/pregnancy'
import { orderService } from '@/modules/orders/services/order.service'
import type { MedicalOrder } from '@/modules/orders/types/order.types'
import { ResultsManagerModal } from '../../ordenes-page/ui/organisms/ResultsManagerModal'
import { API_URL } from '@/shared/api/base'

function calcularEGActual(fum: string): string {
   const fumDate = new Date(fum)
   const hoy = new Date()
   const diffDays = Math.floor((hoy.getTime() - fumDate.getTime()) / (1000 * 60 * 60 * 24))
   return (diffDays / 7).toFixed(1)
}

/* ==================================================
   TYPES & CONSTANTS
   ================================================== */

const TABS = [
   { id: 'resumen', label: 'Resumen', icon: History },
   { id: 'ingreso', label: 'Historia Prenatal', icon: ClipboardList },
   { id: 'controles', label: 'Controles', icon: Activity },
   { id: 'estudios', label: 'Exámenes y Resultados', icon: Microscope },
   { id: 'curvas', label: 'Curvas', icon: TrendingUp },
   { id: 'alertas', label: 'Alertas', icon: AlertTriangle },
]

/* ==================================================
   MAIN COMPONENT
   ================================================== */

export function ObstetriciaDetallePage() {
   const { id: pregnancyId } = useParams<{ id: string }>()
   const navigate = useNavigate()
   const { showToast } = useToast()
   const [activeTab, setActiveTab] = useState('resumen')
   const [isModalOpen, setIsModalOpen] = useState(false)
   const [isSavingHistoria, setIsSavingHistoria] = useState(false)

   useEffect(() => {
      const handleStart = () => setIsSavingHistoria(true)
      const handleEnd = () => setIsSavingHistoria(false)
      window.addEventListener('historia-prenatal-saving-start', handleStart)
      window.addEventListener('historia-prenatal-saving-end', handleEnd)
      return () => {
         window.removeEventListener('historia-prenatal-saving-start', handleStart)
         window.removeEventListener('historia-prenatal-saving-end', handleEnd)
      }
   }, [])

   // Real data from backend
   const { data: pregnancy, isLoading, isError } = usePregnancy(pregnancyId)
   const { data: controles = [] } = usePrenatalControls(pregnancyId)
   const { data: risks = [] } = usePregnancyRisks(pregnancyId)
   const { data: echographies = [] } = usePregnancyEchographies(pregnancyId)
   const addControl = useAddPrenatalControl(pregnancyId!)

   if (isLoading) return (
      <div className="flex items-center justify-center min-h-dvh">
         <Loader2 className="h-12 w-12 animate-spin text-primary-400" />
      </div>
   )
   if (isError || !pregnancy) return (
      <div className="flex items-center justify-center min-h-dvh text-clinical-400 font-bold">
         Embarazo no encontrado.
      </div>
   )

   // Derive display values from real pregnancy data
   const fumDate = new Date(pregnancy.fum)
   const hoy = new Date()
   const egSemanas = ((hoy.getTime() - fumDate.getTime()) / (1000 * 60 * 60 * 24 * 7)).toFixed(1)
   const latestControl = controles[0]
   const trimestre = parseFloat(egSemanas) >= 27 ? 'Tercero' : parseFloat(egSemanas) >= 13 ? 'Segundo' : 'Primer'
   const fppStr = new Date(pregnancy.fpp).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
   const pat = pregnancy.patient as any
   const patName = pat ? `${pat.nombres} ${pat.apellidos}` : 'Paciente'

   const handleAddControl = async (data: any) => {
      try {
         await addControl.mutateAsync(data)
         showToast('Control prenatal registrado con éxito', 'success')
         setIsModalOpen(false)
      } catch (e: any) {
         showToast(e.message || 'Error al guardar control', 'error')
      }
   }

   return (
      <div className="min-h-dvh bg-clinical-50/50 flex flex-col">
         {/* Premium Header */}
         <header className="bg-white border-b border-clinical-100 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <button
                     onClick={() => navigate('/control-obstetrico')}
                     className="h-12 w-12 rounded-2xl bg-clinical-50 flex items-center justify-center text-clinical-400 hover:text-primary-600 transition-all border border-clinical-100 shadow-sm"
                  >
                     <ArrowLeft className="h-6 w-6" />
                  </button>
                  <div className="flex items-center gap-4">
                     <div className="h-14 w-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-primary-100">
                        {patName.charAt(0)}
                     </div>
                     <div>
                        <h2 className="text-2xl font-black text-clinical-900 leading-tight">{patName}</h2>
                        <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest mt-1">
                           Control Obstétrico • EG: {egSemanas} sem.
                        </p>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-2xl bg-clinical-50 border border-clinical-100 flex flex-col items-center">
                     <span className="text-[9px] font-black text-clinical-400 uppercase tracking-tighter">Estado Gestacional</span>
                     <span className="text-sm font-black text-primary-600 uppercase tracking-widest">Embarazo Activo</span>
                  </div>
                  {activeTab === 'ingreso' && (
                     <Button 
                        onClick={() => window.dispatchEvent(new CustomEvent('save-historia-prenatal'))} 
                        variant="primary" 
                        className="h-12 px-6 rounded-2xl shadow-xl shadow-primary-100 font-bold flex items-center gap-2"
                        disabled={isSavingHistoria}
                     >
                        {isSavingHistoria ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Guardar Historia
                     </Button>
                  )}




               </div>
            </div>

            {/* Rapid Stats Bar */}
            <div className="bg-clinical-50/30 border-t border-clinical-100">
               <div className="max-w-7xl mx-auto px-10 py-3 flex items-center gap-12">
                  <HeaderStat label="Edad Gestacional" value={egSemanas} subValue="Semanas" icon={<TrendingUp className="h-4 w-4 text-primary-500" />} />
                  <div className="w-px h-8 bg-clinical-200" />
                  <HeaderStat label="F.P.P. Estimada" value={fppStr} subValue="" icon={<Calendar className="h-4 w-4 text-indigo-500" />} />
                  <div className="w-px h-8 bg-clinical-200" />
                  <HeaderStat label="Trimestre" value={trimestre} subValue="" icon={<Baby className="h-4 w-4 text-purple-500" />} />
                  <div className="w-px h-8 bg-clinical-200" />
                  <HeaderStat label="Riesgo Obstétrico" value={pregnancy.riskLevel.replace(/_/g, ' ')} subValue={`Score: ${pregnancy.riskScore}`} icon={<AlertTriangle className="h-4 w-4 text-emerald-500" />} />

                  <div className="ml-auto flex gap-2">
                     <Badge label={pat?.tipoSanguineo || ''} color="rose" />
                     <Badge label={pat?.alergias ? `Alergias: ${pat.alergias}` : ''} color="amber" />
                  </div>
               </div>
            </div>
         </header>

         {/* Tabs Navigation */}
         <nav className="bg-white border-b border-clinical-100 sticky top-[125px] z-40">
            <div className="max-w-7xl mx-auto px-6 flex gap-1">
               {TABS.map(tab => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                           "flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all relative",
                           isActive ? "text-primary-600" : "text-clinical-400 hover:text-clinical-900 hover:bg-clinical-50/50"
                        )}
                     >
                        <Icon className={cn("h-4 w-4", isActive ? "text-primary-600" : "text-clinical-300")} />
                        {tab.label}
                        {isActive && <motion.div layoutId="activeTabObs" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-t-full shadow-lg" />}
                     </button>
                  )
               })}
            </div>
         </nav>

         {/* Main Content Area */}
         <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
            <AnimatePresence mode="wait">
               <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
               >
                  {activeTab === 'resumen' && <ResumenTab controles={controles} egSemanas={egSemanas} latestControl={latestControl} />}
                  {activeTab === 'ingreso' && <HistoriaPrenatalTab pregnancy={pregnancy} />}
                  {activeTab === 'controles' && <ControlesTab controles={controles} onOpenModal={() => setIsModalOpen(true)} />}
                  {activeTab === 'estudios' && <EstudiosTab pregnancyId={pregnancy.id} patName={patName} egSemanas={egSemanas} patientId={pregnancy.patientId} />}
                  {activeTab === 'curvas' && <CurvasTab controles={controles} patientName={patName} />}
                  {activeTab === 'alertas' && <AlertasTab pregnancy={pregnancy} controles={controles} />}
               </motion.div>
            </AnimatePresence>
         </main>

         <NewControlModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleAddControl}
            currentEg={egSemanas}
            loading={addControl.isPending}
         />
      </div>
   )
}

/* ==================================================
   TAB COMPONENTS
   ================================================== */

function ResumenTab({ controles, egSemanas, latestControl }: { controles: PrenatalControl[], egSemanas: string, latestControl?: PrenatalControl }) {
   return (
      <div className="space-y-8">
         {/* Summary Cards */}
         <div className="grid grid-cols-3 gap-6">
            <InfoCard title="Semana Gestacional" value={egSemanas} sub="Semanas" icon={<TrendingUp />} />
            <InfoCard title="Peso Actual" value={latestControl?.maternalWeight ? `${latestControl.maternalWeight} kg` : 'N/D'} sub="Kilogramos" icon={<Activity />} />
            <InfoCard title="Presión Arterial" value={latestControl?.bloodPressure || 'N/D'} sub="mmHg" icon={<Heart />} />
         </div>

         {/* Timeline Prenatal */}
         <section className="bg-white rounded-[2.5rem] p-10 border border-clinical-100 shadow-premium">
            <div className="flex items-center gap-3 mb-8">
               <div className="h-10 w-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center"><History className="h-5 w-5" /></div>
               <h3 className="text-xl font-black text-clinical-900 tracking-tight">Timeline Obstétrico</h3>
            </div>

            {controles.length === 0 ? (
               <p className="text-sm text-clinical-400 font-medium text-center py-12">Aún no hay controles registrados para este embarazo.</p>
            ) : (
               <div className="relative space-y-12 before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-primary-100">
                  {controles.map((c, idx) => (
                     <TimelineItem
                        key={c.id}
                        week={String(c.gestationalAge)}
                        title={`Control prenatal - EG: ${c.gestationalAge} Sem.`}
                        date={new Date(c.controlDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                        events={[
                           c.maternalWeight ? `Peso: ${c.maternalWeight} kg` : null,
                           c.fetalHeartRate ? `FCF: ${c.fetalHeartRate} lpm` : null,
                           c.bloodPressure ? `T/A: ${c.bloodPressure}` : null,
                           c.uterineHeight ? `AU: ${c.uterineHeight} cm` : null,
                        ].filter(Boolean) as string[]}
                        status={idx === 0 ? 'current' : 'completed'}
                     />
                  ))}
               </div>
            )}
         </section>
      </div>
   )
}

/* ==================================================
   HISTORIA PRENATAL & RIESGO COMPONENT
   ================================================== */
const RISK_FACTORS = [
   // Grupo 1
   { id: 'risk_lt_14', label: 'Gestante igual o menor de 14 años (refereir al segundo nivel a partir de las 20 semanas)', score: 8, group: 'Edad y Paridad' },
   { id: 'risk_15_19', label: 'Gestante de 15 a 19 años', score: 1, group: 'Edad y Paridad' },
   { id: 'risk_gt_35', label: 'Gestante mayor de 35 años', score: 1, group: 'Edad y Paridad' },
   { id: 'risk_multipara', label: 'Gran multípara (≥ 4 gestas)', score: 1, group: 'Edad y Paridad' },
   { id: 'risk_intergenesico_lt_18', label: 'Periodo intergenésico ≤ 18 meses', score: 2, group: 'Edad y Paridad' },
   { id: 'risk_intergenesico_gt_5', label: 'Periodo intergenésico > 5 años', score: 2, group: 'Edad y Paridad' },
   
   // Grupo 2
   { id: 'risk_infertilidad', label: 'Infertilidad', score: 1, group: 'Antecedentes Obstétricos' },
   { id: 'risk_aborto_habitual', label: 'Aborto habitual (≥ 2 pérdidas)', score: 2, group: 'Antecedentes Obstétricos' },
   { id: 'risk_ectopico_molar', label: 'Embarazo ectópico / molar anterior', score: 2, group: 'Antecedentes Obstétricos' },
   { id: 'risk_obito_fetal', label: 'Óbito fetal anterior', score: 2, group: 'Antecedentes Obstétricos' },
   { id: 'risk_violencia_sexual_prev', label: 'Embarazo producto de violencia sexual', score: 1, group: 'Antecedentes Obstétricos' },
   { id: 'risk_preeclampsia_prev', label: 'Antecedente de preeclampsia / eclampsia anterior', score: 4, group: 'Antecedentes Obstétricos' },
   { id: 'risk_fam_preeclampsia', label: 'Antecedentes familiares de preeclampsia', score: 1, group: 'Antecedentes Obstétricos' },
   
   // Grupo 3
   { id: 'risk_no_control', label: 'Ningún control prenatal en embarazo mayor a 20 semanas', score: 1, group: 'Factores Biopsicosociales' },
   { id: 'risk_sin_instruccion', label: 'Sin instrucción (Analfabetismo)', score: 1, group: 'Factores Biopsicosociales' },
   { id: 'risk_alcohol_drogas', label: 'Alcoholismo, tabaco y drogas', score: 1, group: 'Factores Biopsicosociales' },
   { id: 'risk_violencia_domestica', label: 'Violencia doméstica, Disfunción Familiar', score: 1, group: 'Factores Biopsicosociales' },
   { id: 'risk_callejizada', label: 'Gestante callejizada, indigente o vive sola', score: 1, group: 'Factores Biopsicosociales' },
   
   // Grupo 4
   { id: 'risk_desnutricion', label: 'Desnutrición materna (IMC < 18.5)', score: 1, group: 'Nutricional y Metabólico' },
   { id: 'risk_obesidad', label: 'Obesidad (IMC > 30)', score: 2, group: 'Nutricional y Metabólico' },
   { id: 'risk_glicemia_basal_gt_92', label: 'Glicemia basal mayor a 92 mg/dL', score: 4, group: 'Nutricional y Metabólico' },
   { id: 'risk_diabetes', label: 'Diabetes', score: 8, group: 'Nutricional y Metabólico' },
   { id: 'risk_hipotiroidismo', label: 'Hipotiroidismo sin tratamiento', score: 8, group: 'Nutricional y Metabólico' },
   
   // Grupo 5
   { id: 'risk_patologia_cervical', label: 'Patología cervical (LIEAG / NIC II o III, ca in situ)', score: 3, group: 'Patologías de Cérvix e Infecciones' },
   { id: 'risk_condilomatosis', label: 'Condilomatosis vulvovaginal', score: 2, group: 'Patologías de Cérvix e Infecciones' },
   { id: 'risk_malformacion_urogenital', label: 'Malformación urogenital', score: 2, group: 'Patologías de Cérvix e Infecciones' },
   { id: 'risk_inf_vaginales_rep', label: 'Infecciones vaginales a repetición o asintomáticas (≥ 3 episodios) en el embarazo', score: 2, group: 'Patologías de Cérvix e Infecciones' },
   { id: 'risk_itu_recurrente', label: 'Infección del tracto urinario recurrente (2 episodios o más)', score: 2, group: 'Patologías de Cérvix e Infecciones' },
   { id: 'risk_covid19', label: 'Infección por COVID-19', score: 2, group: 'Patologías de Cérvix e Infecciones' },
   { id: 'risk_its_previas', label: 'ITS (Sífilis, Hepatitis B/C)', score: 1, group: 'Patologías de Cérvix e Infecciones' },
   { id: 'risk_vih', label: 'VIH positivo', score: 2, group: 'Patologías de Cérvix e Infecciones' },
   { id: 'risk_toxoplasma_cmv', label: 'Toxoplasma / Citomegalovirus IgM positivo', score: 8, group: 'Patologías de Cérvix e Infecciones' },
   
   // Grupo 6
   { id: 'risk_emb_prolongado', label: 'Embarazo prolongado (≥ 41 semanas)', score: 1, group: 'Complicaciones Gestacionales Actuales' },
   { id: 'risk_emb_diu', label: 'Embarazo con dispositivo intrauterino (DIU)', score: 1, group: 'Complicaciones Gestacionales Actuales' },
   { id: 'risk_rh_neg_no_sens', label: 'Rh negativa no sensibilizada', score: 1, group: 'Complicaciones Gestacionales Actuales' },
   { id: 'risk_rh_neg_sens', label: 'Rh negativa sensibilizada (isoinmunizada)', score: 1, group: 'Complicaciones Gestacionales Actuales' },
   { id: 'risk_anemia_lt_10', label: 'Anemia moderada (Hb < 10 g/dl)', score: 1, group: 'Complicaciones Gestacionales Actuales' },
   { id: 'risk_anemia_lt_7', label: 'Anemia severa (Hb < 7 g/dl)', score: 3, group: 'Complicaciones Gestacionales Actuales' },
   { id: 'risk_colestasia', label: 'Colestasia intrahepática gestacional', score: 3, group: 'Complicaciones Gestacionales Actuales' },
   { id: 'risk_hemorragia_1ra_mitad', label: 'Hemorragia de la primera mitad del embarazo', score: 8, group: 'Complicaciones Gestacionales Actuales' },
   { id: 'risk_hemorragia_2da_mitad', label: 'Hemorragia de la segunda mitad del embarazo', score: 8, group: 'Complicaciones Gestacionales Actuales' },
   { id: 'risk_amenaza_parto_prematuro', label: 'Amenaza de parto prematuro', score: 8, group: 'Complicaciones Gestacionales Actuales' },
   { id: 'risk_gemelar', label: 'Embarazo Gemelar / Múltiple', score: 8, group: 'Complicaciones Gestacionales Actuales' },
   { id: 'risk_presentacion_anomala_gt_36', label: 'Presentación anómala en embarazo mayor a 36 semanas', score: 8, group: 'Complicaciones Gestacionales Actuales' },
   { id: 'risk_liquido_alterado', label: 'Polihidramnios / Oligohidramnios', score: 8, group: 'Complicaciones Gestacionales Actuales' },
   { id: 'risk_malformaciones_fetales', label: 'Gestación con malformaciones fetales mayores', score: 8, group: 'Complicaciones Gestacionales Actuales' },
   { id: 'risk_baja_estatura', label: 'Baja estatura materna (< 1.45 m)', score: 1, group: 'Complicaciones Gestacionales Actuales' },
   
   // Grupo 7
   { id: 'risk_hipertension_cronica', label: 'Hipertensión Crónica', score: 8, group: 'Enfermedades Sistémicas Coexistentes' },
   { id: 'risk_cardiopatias', label: 'Cardiopatías', score: 8, group: 'Enfermedades Sistémicas Coexistentes' },
   { id: 'risk_neuropsiquiatricas', label: 'Enfermedades neuropsiquiátricas', score: 8, group: 'Enfermedades Sistémicas Coexistentes' },
   { id: 'risk_insuf_renal', label: 'Insuficiencia renal crónica', score: 8, group: 'Enfermedades Sistémicas Coexistentes' },
   { id: 'risk_lupus', label: 'Lupus eritematoso sistémico', score: 8, group: 'Enfermedades Sistémicas Coexistentes' },
   { id: 'risk_antifosfolipidico', label: 'Síndrome antifosfolipídico', score: 8, group: 'Enfermedades Sistémicas Coexistentes' },
   { id: 'risk_trombocitopenia', label: 'Trombocitopenia (< 100,000 plaquetas)', score: 8, group: 'Enfermedades Sistémicas Coexistentes' },
   { id: 'risk_tuberculosis', label: 'Tuberculosis materna activa', score: 8, group: 'Enfermedades Sistémicas Coexistentes' },
   { id: 'risk_cancer', label: 'Cáncer activo', score: 8, group: 'Enfermedades Sistémicas Coexistentes' },
   { id: 'risk_discapacidad_fisica_30_50', label: 'Discapacidad Física del 30 al 50 %', score: 1, group: 'Enfermedades Sistémicas Coexistentes' },
   { id: 'risk_discapacidad_fisica_gt_50', label: 'Discapacidad Física mayor a 50 %', score: 1, group: 'Enfermedades Sistémicas Coexistentes' },
   { id: 'risk_discapacidad_intelectual_30_40', label: 'Discapacidad Intelectual del 30 al 40 %', score: 2, group: 'Enfermedades Sistémicas Coexistentes' },
   { id: 'risk_discapacidad_intelectual_gt_40', label: 'Discapacidad Intelectual mayor a 40 %', score: 2, group: 'Enfermedades Sistémicas Coexistentes' },
   { id: 'risk_otras_patologias', label: 'Otras patologías relevantes', score: 3, group: 'Enfermedades Sistémicas Coexistentes' }
]

function Switch({ checked, onChange, label }: { checked: boolean, onChange: (val: boolean) => void, label: string }) {
   return (
      <label className="flex items-center gap-3 cursor-pointer select-none">
         <div className="relative shrink-0">
            <input
               type="checkbox"
               checked={checked}
               onChange={(e) => onChange(e.target.checked)}
               className="sr-only"
            />
            <div className={cn(
               "w-10 h-6 rounded-full transition-all duration-300",
               checked ? "bg-primary-600" : "bg-clinical-200"
            )} />
            <div className={cn(
               "absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300",
               checked ? "translate-x-4" : "translate-x-0"
            )} />
         </div>
         <span className="text-xs font-semibold text-clinical-700 leading-tight">{label}</span>
      </label>
   )
}

function HistoriaPrenatalTab({ pregnancy }: { pregnancy: any }) {
   const updatePregnancy = useUpdatePregnancy(pregnancy.id, pregnancy.patientId)
   const { showToast } = useToast()

   // Parse existing notes JSON if present
   let initialNotes: any = {}
   try {
      if (pregnancy.notes) {
         initialNotes = JSON.parse(pregnancy.notes)
      }
   } catch (e) {
      initialNotes = {}
   }

   // ─── Local State ───────────────────────────────────────────────────────────
   const [fppEco, setFppEco] = useState(initialNotes.fppEco || '')
   const [menarquia, setMenarquia] = useState(initialNotes.menarquia || '')
   const [ivsa, setIvsa] = useState(initialNotes.ivsa || '')
   
   const [initialWeight, setInitialWeight] = useState(pregnancy.initialWeight || '')
   const [initialHeight, setInitialHeight] = useState(pregnancy.initialHeight || '')

   // SI / NO Protocol fields
   const [protocols, setProtocols] = useState<Record<string, boolean>>({
      eco_11_13: initialNotes.eco_11_13 || false,
      fuma_act: initialNotes.fuma_act || false,
      fuma_pas: initialNotes.fuma_pas || false,
      drogas: initialNotes.drogas || false,
      alcohol: initialNotes.alcohol || false,
      violencia: initialNotes.violencia || false,
      antirubeola: initialNotes.antirubeola || false,
      antitetanica: initialNotes.antitetanica || false,
      ex_mamas: initialNotes.ex_mamas || false,
      ex_odont: initialNotes.ex_odont || false,
      toxoplasmosis: initialNotes.toxoplasmosis || false,
      vih_sol_lt_20: initialNotes.vih_sol_lt_20 || false,
      tarv_lt_20: initialNotes.tarv_lt_20 || false,
      vih_sol_gt_20: initialNotes.vih_sol_gt_20 || false,
      tarv_gt_20: initialNotes.tarv_gt_20 || false,
      fe_folatos: initialNotes.fe_folatos || false,
      sifilis_diag: initialNotes.sifilis_diag || false,
      chagas: initialNotes.chagas || false,
      malaria: initialNotes.malaria || false,
      bacteriuria_lt_20: initialNotes.bacteriuria_lt_20 || false,
      bacteriuria_gt_20: initialNotes.bacteriuria_gt_20 || false,
      preeclampsia_prev: initialNotes.preeclampsia_prev || false,
      estreptococo: initialNotes.estreptococo || false,
      plan_parto: initialNotes.plan_parto || false,
      educacion_prenatal: initialNotes.educacion_prenatal || false,
      lactancia: initialNotes.lactancia || false,
   })

   // Text fields for protocols
   const [protocolTexts, setProtocolTexts] = useState<Record<string, string>>({
      vih_res_lt_20: initialNotes.vih_res_lt_20 || '',
      vih_res_gt_20: initialNotes.vih_res_gt_20 || '',
      hb_lt_20: initialNotes.hb_lt_20 || '',
      hb_gt_20: initialNotes.hb_gt_20 || '',
      glucemia_lt_20: initialNotes.glucemia_lt_20 || '',
      glucemia_gt_30: initialNotes.glucemia_gt_30 || '',
   })

   // Checked Risk Factors
   const [checkedRisks, setCheckedRisks] = useState<Record<string, boolean>>(() => {
      const risksMap: Record<string, boolean> = {}
      RISK_FACTORS.forEach(rf => {
         risksMap[rf.id] = initialNotes.checkedRisks?.[rf.id] || false
      })
      return risksMap
   })

   // ─── Calculations ────────────────────────────────────────────────────────
   const handleProtocolChange = (key: string, val: boolean) => {
      setProtocols(prev => ({ ...prev, [key]: val }))
   }

   const handleProtocolTextChange = (key: string, val: string) => {
      setProtocolTexts(prev => ({ ...prev, [key]: val }))
   }

   const handleRiskToggle = (id: string, val: boolean) => {
      setCheckedRisks(prev => ({ ...prev, [id]: val }))
   }

   // Dynamic IMC Calculation
   const weightNum = parseFloat(String(initialWeight))
   const heightNum = parseFloat(String(initialHeight))
   const imc = (weightNum && heightNum) ? parseFloat((weightNum / ((heightNum / 100) ** 2)).toFixed(1)) : 0

   const getImcLabel = (val: number) => {
      if (val < 18.5) return { label: 'Desnutrición', color: 'rose' }
      if (val < 25) return { label: 'Normal', color: 'emerald' }
      if (val < 30) return { label: 'Sobrepeso', color: 'amber' }
      return { label: 'Obesidad', color: 'rose' }
   }

   // Dynamic Risk Score Sum
   const totalRiskScore = RISK_FACTORS.reduce((acc, rf) => {
      return acc + (checkedRisks[rf.id] ? rf.score : 0)
   }, 0)

   const getRiskCategory = (score: number) => {
      if (score === 0) return { level: 'sin_riesgo', label: 'Sin Riesgo', color: 'emerald', professional: 'Obstetra', weeks: 'Curso normal completo' }
      if (score <= 3) return { level: 'bajo', label: 'Riesgo Bajo', color: 'emerald', professional: 'Obstetra', weeks: '34 semanas aproximadamente' }
      if (score <= 7) return { level: 'alto', label: 'Riesgo Alto', color: 'amber', professional: 'Obstetra y Médico General / Médico Familiar', weeks: '32 semanas aproximadamente' }
      return { level: 'muy_alto', label: 'Riesgo Muy Alto', color: 'rose', professional: 'Ginecólogo (con interconsultas)', weeks: 'Inmediato / 28 semanas' }
   }

   const resolvedRisk = getRiskCategory(totalRiskScore)

   // ─── Persistence ─────────────────────────────────────────────────────────
   const handleSave = async () => {
      try {
         window.dispatchEvent(new CustomEvent('historia-prenatal-saving-start'))
         const notesSerialized = JSON.stringify({
            fppEco,
            menarquia,
            ivsa,
            protocols,
            protocolTexts,
            checkedRisks,
         })

         await updatePregnancy.mutateAsync({
            initialWeight: weightNum || null,
            initialHeight: heightNum || null,
            initialImc: imc || null,
            riskScore: totalRiskScore,
            riskLevel: resolvedRisk.level as any,
            notes: notesSerialized,
         })

         showToast('Historia Prenatal guardada y sincronizada correctamente', 'success')
      } catch (err: any) {
         showToast(err.message || 'Error al guardar historia prenatal', 'error')
      } finally {
         window.dispatchEvent(new CustomEvent('historia-prenatal-saving-end'))
      }
   }

   useEffect(() => {
      const listener = () => {
         handleSave()
      }
      window.addEventListener('save-historia-prenatal', listener)
      return () => window.removeEventListener('save-historia-prenatal', listener)
   }, [handleSave])

   // Group risk factors
   const groups = Array.from(new Set(RISK_FACTORS.map(rf => rf.group)))

   return (
      <div className="space-y-8 max-w-7xl mx-auto">
         {/* Sección 0: Categorización del Riesgo Obstétrico (Ancho Completo en la parte superior) */}
         <section className="bg-white rounded-[2.5rem] p-8 border border-clinical-100 shadow-premium flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
               <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-6 w-6" />
               </div>
               <div>
                  <h3 className="text-xl font-black text-clinical-900 tracking-tight">Categorización de Riesgo Obstétrico</h3>
                  <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest mt-0.5">Clasificación según scoring acumulativo de factores de riesgo</p>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8 bg-clinical-50/50 p-6 rounded-[2rem] border border-clinical-100 flex-1 md:max-w-3xl">
               {/* Score badge */}
               <div className="flex items-center gap-4 shrink-0">
                  <div className={cn(
                     "h-16 w-16 rounded-full flex flex-col items-center justify-center border-4 shadow-lg shrink-0",
                     resolvedRisk.color === 'rose' ? 'border-rose-500 bg-rose-50 text-rose-600 shadow-rose-100' :
                     resolvedRisk.color === 'amber' ? 'border-amber-400 bg-amber-50 text-amber-600 shadow-amber-100' : 'border-emerald-500 bg-emerald-50 text-emerald-600 shadow-emerald-100'
                  )}>
                     <span className="text-[7px] font-black uppercase tracking-wider">Score</span>
                     <span className="text-xl font-black mt-0.5 leading-none">{totalRiskScore}</span>
                  </div>
                  <div>
                     <span className="text-[9px] font-black text-clinical-400 uppercase tracking-widest block">Nivel de Riesgo</span>
                     <h4 className={cn(
                        "text-lg font-black tracking-tight uppercase tracking-wider mt-0.5",
                        resolvedRisk.color === 'rose' ? 'text-rose-600' :
                        resolvedRisk.color === 'amber' ? 'text-amber-500' : 'text-emerald-600'
                     )}>
                        {resolvedRisk.label}
                     </h4>
                  </div>
               </div>

               {/* Divider */}
               <div className="h-px sm:h-12 w-full sm:w-px bg-clinical-100" />

               {/* Details */}
               <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                  <div>
                     <span className="text-[9px] font-black text-clinical-400 uppercase tracking-widest block">Profesional Responsable</span>
                     <span className="text-xs font-black text-clinical-850 mt-1 block leading-relaxed">{resolvedRisk.professional}</span>
                  </div>
                  <div>
                     <span className="text-[9px] font-black text-clinical-400 uppercase tracking-widest block">Semanas de Referencia</span>
                     <span className="text-xs font-black text-clinical-850 mt-1 block leading-relaxed">{resolvedRisk.weeks}</span>
                  </div>
               </div>
            </div>
         </section>

         <div className="space-y-8">
            {/* Sección 1: Datos Gineco-Obstétricos & Gestación Actual */}
            <section className="bg-white rounded-[2.5rem] p-10 border border-clinical-100 shadow-premium space-y-8">
               <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
                     <History className="h-5 w-5" />
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-clinical-900 tracking-tight">Historia Gineco-Obstétrica</h3>
                     <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest mt-0.5">Gestación Actual y Antecedentes Reproductivos</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                     <label className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-2 block">F.U.M. (Fecha Última Menst.)</label>
                     <input 
                        type="text" 
                        value={new Date(pregnancy.fum).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                        disabled
                        className="w-full h-12 rounded-2xl border border-clinical-100 bg-clinical-50/50 px-5 text-sm font-bold text-clinical-500 outline-none cursor-not-allowed"
                     />
                  </div>
                  <div>
                     <label className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-2 block">F.P.P. por ECO &lt; 20 Semanas</label>
                     <input 
                        type="text" 
                        value={fppEco}
                        onChange={e => setFppEco(e.target.value)}
                        className="w-full h-12 rounded-2xl border border-clinical-200 bg-white px-5 text-sm font-bold text-clinical-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10"
                        placeholder="Ej: 15 de Octubre 2026"
                     />
                  </div>
                  <div>
                     <label className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-2 block">Menarquia (Edad)</label>
                     <input 
                        type="text" 
                        value={menarquia}
                        onChange={e => setMenarquia(e.target.value)}
                        className="w-full h-12 rounded-2xl border border-clinical-200 bg-white px-5 text-sm font-bold text-clinical-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10"
                        placeholder="Ej: 12 años"
                     />
                  </div>
                  <div>
                     <label className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-2 block">IVSA (Inicio Relac. Sex.)</label>
                     <input 
                        type="text" 
                        value={ivsa}
                        onChange={e => setIvsa(e.target.value)}
                        className="w-full h-12 rounded-2xl border border-clinical-200 bg-white px-5 text-sm font-bold text-clinical-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10"
                        placeholder="Ej: 18 años"
                     />
                  </div>
               </div>

               <div className="pt-6 border-t border-clinical-100">
                  <h4 className="text-xs font-black text-clinical-900 uppercase tracking-wider mb-6">Ficha del Embarazo Actual (De Partida)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                     <div>
                        <label className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-2 block">Peso Inicial (Kg)</label>
                        <input 
                           type="number" 
                           step="0.1"
                           value={initialWeight}
                           onChange={e => setInitialWeight(e.target.value)}
                           className="w-full h-12 rounded-2xl border border-clinical-200 bg-white px-5 text-sm font-bold text-clinical-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10"
                           placeholder="Ej: 60.5"
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-2 block">Talla (Cm)</label>
                        <input 
                           type="number" 
                           value={initialHeight}
                           onChange={e => setInitialHeight(e.target.value)}
                           className="w-full h-12 rounded-2xl border border-clinical-200 bg-white px-5 text-sm font-bold text-clinical-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10"
                           placeholder="Ej: 165"
                        />
                     </div>
                     <div className="bg-clinical-50/50 p-4 rounded-2xl border border-clinical-100 flex flex-col justify-center">
                        <span className="text-[9px] font-black text-clinical-400 uppercase tracking-widest">IMC de Partida</span>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-xl font-black text-clinical-800">{imc || 'N/D'}</span>
                           {imc > 0 && (
                              <span className={cn(
                                 "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border",
                                 getImcLabel(imc).color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                 getImcLabel(imc).color === 'amber' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                              )}>
                                 {getImcLabel(imc).label}
                              </span>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* Sección 2: Protocolos Clínicos (SI / NO) */}
            <section className="bg-white rounded-[2.5rem] p-10 border border-clinical-100 shadow-premium space-y-8">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                     <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-clinical-900 tracking-tight">Protocolos Clínicos Prenatales</h3>
                     <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest mt-0.5">Exámenes, Vacunas y Controles Estándar</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Columna A: Hábitos y Tamizajes */}
                  <div className="space-y-6">
                     <h4 className="text-xs font-black text-clinical-900 uppercase tracking-wider border-b border-clinical-150 pb-2">Hábitos y Tamizajes Básicos</h4>
                     <div className="space-y-4">
                        <Switch checked={protocols.eco_11_13} onChange={val => handleProtocolChange('eco_11_13', val)} label="Ecografía 11-13 semanas realizada" />
                        <Switch checked={protocols.fuma_act} onChange={val => handleProtocolChange('fuma_act', val)} label="Fumadora ACTIVA" />
                        <Switch checked={protocols.fuma_pas} onChange={val => handleProtocolChange('fuma_pas', val)} label="Fumadora PASIVA" />
                        <Switch checked={protocols.drogas} onChange={val => handleProtocolChange('drogas', val)} label="Consumo de Drogas" />
                        <Switch checked={protocols.alcohol} onChange={val => handleProtocolChange('alcohol', val)} label="Consumo de Alcohol" />
                        <Switch checked={protocols.violencia} onChange={val => handleProtocolChange('violencia', val)} label="Situación de Violencia" />
                        <Switch checked={protocols.ex_mamas} onChange={val => handleProtocolChange('ex_mamas', val)} label="Examen Normal de Mamas" />
                        <Switch checked={protocols.ex_odont} onChange={val => handleProtocolChange('ex_odont', val)} label="Examen Normal Odontológico" />
                        <Switch checked={protocols.toxoplasmosis} onChange={val => handleProtocolChange('toxoplasmosis', val)} label="Tamizaje Toxoplasmosis realizado" />
                     </div>
                  </div>

                  {/* Columna B: Vacunas e Inmunizaciones */}
                  <div className="space-y-6">
                     <h4 className="text-xs font-black text-clinical-900 uppercase tracking-wider border-b border-clinical-150 pb-2">Inmunización y Educación</h4>
                     <div className="space-y-4">
                        <Switch checked={protocols.antirubeola} onChange={val => handleProtocolChange('antirubeola', val)} label="Vacuna Antirubeola al día" />
                        <Switch checked={protocols.antitetanica} onChange={val => handleProtocolChange('antitetanica', val)} label="Vacuna Antitetánica colocada" />
                        <Switch checked={protocols.fe_folatos} onChange={val => handleProtocolChange('fe_folatos', val)} label="Fe / FOLATOS Indicados" />
                        <Switch checked={protocols.sifilis_diag} onChange={val => handleProtocolChange('sifilis_diag', val)} label="SÍFILIS - Diagnóstico y Tratamiento" />
                        <Switch checked={protocols.chagas} onChange={val => handleProtocolChange('chagas', val)} label="Descarte de Chagas" />
                        <Switch checked={protocols.malaria} onChange={val => handleProtocolChange('malaria', val)} label="Tamizaje de Paludismo / Malaria" />
                        <Switch checked={protocols.preeclampsia_prev} onChange={val => handleProtocolChange('preeclampsia_prev', val)} label="Prevención de Preeclampsia (ASA)" />
                        <Switch checked={protocols.plan_parto} onChange={val => handleProtocolChange('plan_parto', val)} label="Plan de Parto y Emergencia acordado" />
                        <Switch checked={protocols.educacion_prenatal} onChange={val => handleProtocolChange('educacion_prenatal', val)} label="Educación Prenatal impartida" />
                        <Switch checked={protocols.lactancia} onChange={val => handleProtocolChange('lactancia', val)} label="Consejería de Lactancia Materna" />
                     </div>
                  </div>
               </div>

               {/* Grid de Inputs Especializados de Laboratorio */}
               <div className="pt-6 border-t border-clinical-100">
                  <h4 className="text-xs font-black text-clinical-900 uppercase tracking-wider mb-6">Exámenes de Laboratorio en Semanas Clave</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="space-y-4">
                        <Switch checked={protocols.vih_sol_lt_20} onChange={val => handleProtocolChange('vih_sol_lt_20', val)} label="VIH < 20 sem solicitada" />
                        <input 
                           type="text"
                           value={protocolTexts.vih_res_lt_20}
                           onChange={e => handleProtocolTextChange('vih_res_lt_20', e.target.value)}
                           className="w-full h-10 rounded-xl border border-clinical-200 px-4 text-xs font-bold text-clinical-900 outline-none"
                           placeholder="Resultado de VIH <20"
                        />
                        <Switch checked={protocols.tarv_lt_20} onChange={val => handleProtocolChange('tarv_lt_20', val)} label="TARV en emb. < 20 sem" />
                     </div>
                     <div className="space-y-4">
                        <Switch checked={protocols.vih_sol_gt_20} onChange={val => handleProtocolChange('vih_sol_gt_20', val)} label="VIH > 20 sem solicitada" />
                        <input 
                           type="text"
                           value={protocolTexts.vih_res_gt_20}
                           onChange={e => handleProtocolTextChange('vih_res_gt_20', e.target.value)}
                           className="w-full h-10 rounded-xl border border-clinical-200 px-4 text-xs font-bold text-clinical-900 outline-none"
                           placeholder="Resultado de VIH >20"
                        />
                        <Switch checked={protocols.tarv_gt_20} onChange={val => handleProtocolChange('tarv_gt_20', val)} label="TARV en emb. > 20 sem" />
                     </div>
                     <div className="space-y-4">
                        <div>
                           <label className="text-[9px] font-bold text-clinical-400 uppercase tracking-widest mb-1.5 block">Hemoglobina &lt; 20 sem</label>
                           <input 
                              type="text"
                              value={protocolTexts.hb_lt_20}
                              onChange={e => handleProtocolTextChange('hb_lt_20', e.target.value)}
                              className="w-full h-10 rounded-xl border border-clinical-200 px-4 text-xs font-bold text-clinical-900 outline-none"
                              placeholder="Ej: 12.5 g/dl"
                           />
                        </div>
                        <div>
                           <label className="text-[9px] font-bold text-clinical-400 uppercase tracking-widest mb-1.5 block">Hemoglobina ≥ 20 sem</label>
                           <input 
                              type="text"
                              value={protocolTexts.hb_gt_20}
                              onChange={e => handleProtocolTextChange('hb_gt_20', e.target.value)}
                              className="w-full h-10 rounded-xl border border-clinical-200 px-4 text-xs font-bold text-clinical-900 outline-none"
                              placeholder="Ej: 11.8 g/dl"
                           />
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 mt-6 border-t border-clinical-50">
                     <div className="space-y-4">
                        <Switch checked={protocols.bacteriuria_lt_20} onChange={val => handleProtocolChange('bacteriuria_lt_20', val)} label="Bacteriuria < 20 semanas" />
                        <Switch checked={protocols.bacteriuria_gt_20} onChange={val => handleProtocolChange('bacteriuria_gt_20', val)} label="Bacteriuria ≥ 20 semanas" />
                        <Switch checked={protocols.estreptococo} onChange={val => handleProtocolChange('estreptococo', val)} label="ESTREPTOCOCO B (35-37 sem)" />
                     </div>
                     <div>
                        <label className="text-[9px] font-bold text-clinical-400 uppercase tracking-widest mb-1.5 block">Glucemia en ayunas &lt; 20 sem</label>
                        <input 
                           type="text"
                           value={protocolTexts.glucemia_lt_20}
                           onChange={e => handleProtocolTextChange('glucemia_lt_20', e.target.value)}
                           className="w-full h-10 rounded-xl border border-clinical-200 px-4 text-xs font-bold text-clinical-900 outline-none"
                           placeholder="Ej: 85 mg/dL"
                        />
                     </div>
                     <div>
                        <label className="text-[9px] font-bold text-clinical-400 uppercase tracking-widest mb-1.5 block">Glucemia en ayunas &gt; 30 sem</label>
                        <input 
                           type="text"
                           value={protocolTexts.glucemia_gt_30}
                           onChange={e => handleProtocolTextChange('glucemia_gt_30', e.target.value)}
                           className="w-full h-10 rounded-xl border border-clinical-200 px-4 text-xs font-bold text-clinical-900 outline-none"
                           placeholder="Ej: 95 mg/dL"
                        />
                     </div>
                  </div>
               </div>
            </section>

            {/* Sección 3: Evaluación y Categorización del Riesgo Obstétrico */}
            <section className="bg-white rounded-[2.5rem] p-10 border border-clinical-100 shadow-premium space-y-8">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                     <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-clinical-900 tracking-tight">Evaluación del Riesgo Obstétrico</h3>
                     <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest mt-0.5">Scoring de Riesgos Acumulativos Estándar</p>
                  </div>
               </div>

               <div className="space-y-8">
                  {groups.map(group => (
                     <div key={group} className="space-y-4">
                        <h4 className="text-xs font-black text-clinical-800 uppercase tracking-wider bg-clinical-50 px-4 py-2 rounded-xl border border-clinical-100">{group}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-2">
                           {RISK_FACTORS.filter(rf => rf.group === group).map(rf => (
                              <label key={rf.id} className="flex items-start gap-3 cursor-pointer hover:bg-clinical-50/50 p-2.5 rounded-xl transition-all select-none">
                                 <input 
                                    type="checkbox"
                                    checked={checkedRisks[rf.id] || false}
                                    onChange={e => handleRiskToggle(rf.id, e.target.checked)}
                                    className="h-4 w-4 rounded border-clinical-300 text-primary-600 focus:ring-primary-500/20 shrink-0 mt-0.5"
                                 />
                                 <div className="flex-1 flex justify-between gap-4">
                                    <span className="text-xs font-semibold text-clinical-700 leading-normal">{rf.label}</span>
                                    <span className={cn(
                                       "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase shrink-0 self-start",
                                       rf.score >= 8 ? "bg-rose-50 text-rose-600 border border-rose-100" :
                                       rf.score >= 4 ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-clinical-50 text-clinical-500 border border-clinical-150"
                                    )}>
                                       +{rf.score} pts
                                    </span>
                                 </div>
                              </label>
                           ))}
                        </div>
                     </div>
                  ))}
               </div>
            </section>
         </div>
      </div>
   )
}

function ControlesTab({ controles, onOpenModal }: { controles: PrenatalControl[], onOpenModal: () => void }) {
   return (
      <div className="bg-white rounded-[2.5rem] p-10 border border-clinical-100 shadow-premium">
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><ClipboardList className="h-5 w-5" /></div>
               <h3 className="text-xl font-black text-clinical-900 tracking-tight">Historial de Controles</h3>
            </div>
            <Button onClick={onOpenModal} variant="primary" className="h-10 px-6 rounded-xl shadow-lg">
               <Plus className="h-4 w-4 mr-2" /> Agregar Control
            </Button>
         </div>

         {controles.length === 0 ? (
            <p className="text-sm text-clinical-400 font-medium text-center py-12">Aún no hay controles registrados.</p>
         ) : (
            <div className="space-y-4">
               {controles.map((c) => (
                  <ControlRecordRow
                     key={c.id}
                     date={new Date(c.controlDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                     eg={String(c.gestationalAge)}
                     weight={c.maternalWeight ? String(c.maternalWeight) : 'N/D'}
                     tension={c.bloodPressure || 'N/D'}
                     fcf={c.fetalHeartRate ? String(c.fetalHeartRate) : 'N/D'}
                     au={c.uterineHeight ? String(c.uterineHeight) : 'N/D'}
                  />
               ))}
            </div>
         )}
      </div>
   )
}

function EstudiosTab({ pregnancyId, patName, egSemanas, patientId }: { pregnancyId: string, patName: string, egSemanas: string, patientId: string }) {
   const navigate = useNavigate()
   const { showToast } = useToast()
   
   const [docs, setDocs] = useState<any[]>([])
   const [orders, setOrders] = useState<MedicalOrder[]>([])
   const [loading, setLoading] = useState(true)
   const [selectedOrder, setSelectedOrder] = useState<MedicalOrder | null>(null)
   const [showResultsModal, setShowResultsModal] = useState(false)

   const fetchData = async () => {
      try {
         setLoading(true)
         const [docsRes, ordersRes] = await Promise.all([
            fetch(`${API_URL}/patients/${patientId}/documents?limit=20`),
            orderService.getPatientOrders(patientId)
         ])
         if (docsRes.ok) {
            const data = await docsRes.json()
            setDocs(data.data || [])
         }
         setOrders(ordersRes || [])
      } catch (err) {
         console.error('Error fetching data:', err)
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      fetchData()
   }, [patientId])

   return (
      <div className="space-y-8">
         {/* BOTONES DE ACCIÓN RÁPIDA */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
               onClick={() => navigate(`/ordenes/nueva/${patientId}`, { state: { type: 'laboratorio' } })}
               className="h-24 bg-white rounded-[2.5rem] p-6 border border-clinical-100 shadow-premium flex items-center justify-between group hover:border-indigo-300 transition-all cursor-pointer"
            >
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Microscope className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                     <h3 className="text-lg font-black text-clinical-900 group-hover:text-indigo-600 transition-colors">Solicitar Exámenes</h3>
                     <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest mt-0.5">Orden de Laboratorio</p>
                  </div>
               </div>
               <Plus className="h-6 w-6 text-clinical-300 group-hover:text-indigo-500 transition-colors" />
            </button>
            <button 
               onClick={() => navigate(`/ordenes/nueva/${patientId}`, { state: { type: 'ecografia' } })}
               className="h-24 bg-white rounded-[2.5rem] p-6 border border-clinical-100 shadow-premium flex items-center justify-between group hover:border-purple-300 transition-all cursor-pointer"
            >
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Baby className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                     <h3 className="text-lg font-black text-clinical-900 group-hover:text-purple-600 transition-colors">Solicitar Imagenología</h3>
                     <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest mt-0.5">Orden de Ecografía/Rayos X</p>
                  </div>
               </div>
               <Plus className="h-6 w-6 text-clinical-300 group-hover:text-purple-500 transition-colors" />
            </button>
         </div>

         {/* ORDENES MEDICAS Y RESULTADOS */}
         <div className="bg-white rounded-[2.5rem] p-10 border border-clinical-100 shadow-premium space-y-8">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center"><Microscope className="h-5 w-5" /></div>
                  <div>
                     <h3 className="text-xl font-black text-clinical-900 tracking-tight">Órdenes Médicas y Resultados</h3>
                     <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest mt-0.5">Gestión de laboratorio e imagenología</p>
                  </div>
               </div>
            </div>

            {loading ? (
               <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
               </div>
            ) : orders.length === 0 ? (
               <p className="text-sm text-clinical-400 font-medium text-center py-12">No hay órdenes médicas generadas para esta paciente.</p>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {orders.map((order) => (
                     <div key={order.id} className="p-6 rounded-[2rem] bg-clinical-50/50 border border-clinical-100 flex items-center justify-between group hover:bg-white hover:border-primary-300 transition-all shadow-sm">
                        <div className="flex items-center gap-4">
                           <div className={cn(
                              "h-12 w-12 rounded-2xl flex items-center justify-center transition-all shadow-sm border",
                              order.status === 'Completado' || (order.status as string) === 'Resultado subido' 
                                 ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                 : "bg-white text-clinical-400 border-clinical-100 group-hover:bg-primary-50 group-hover:text-primary-600"
                           )}>
                              {order.orderType?.slug === 'ecografia' ? <Baby className="h-6 w-6" /> : <Microscope className="h-6 w-6" />}
                           </div>
                           <div>
                              <p className="text-sm font-black text-clinical-900 leading-none mb-1.5 line-clamp-1">
                                 {order.orderType?.name} - {order.secuencial}
                              </p>
                              <div className="flex items-center gap-2">
                                 <span className={cn(
                                    "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border",
                                    order.status === 'Completado' || (order.status as string) === 'Resultado subido'
                                       ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                       : "bg-amber-50 text-amber-700 border-amber-200"
                                 )}>
                                    {order.status === 'Pendiente' ? 'Esperando Resultados' : 'Resultados Listos'}
                                 </span>
                              </div>
                           </div>
                        </div>
                        <Button 
                           variant={order.status === 'Completado' || (order.status as string) === 'Resultado subido' ? 'primary' : 'secondary'}
                           className="h-10 px-5 rounded-xl text-xs font-bold shrink-0 shadow-sm"
                           onClick={() => {
                              setSelectedOrder(order)
                              setShowResultsModal(true)
                           }}
                        >
                           Resultados
                        </Button>
                     </div>
                  ))}
               </div>
            )}
         </div>

         {/* DOCUMENTOS PRENATALES */}
         <div className="bg-white rounded-[2.5rem] p-10 border border-clinical-100 shadow-premium space-y-8">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-primary-50 text-primary-500 flex items-center justify-center"><FileText className="h-5 w-5" /></div>
                  <h3 className="text-xl font-black text-clinical-900 tracking-tight">Expediente de Documentos PDF</h3>
               </div>
            </div>

            {loading ? (
               <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
               </div>
            ) : docs.length === 0 ? (
               <p className="text-sm text-clinical-400 font-medium text-center py-12">No hay documentos pdf registrados para esta paciente.</p>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {docs.map((doc) => (
                     <div key={doc.id} className="p-6 rounded-[2rem] bg-clinical-50/50 border border-clinical-100 hover:bg-white hover:shadow-lg transition-all group flex flex-col justify-between h-48">
                        <div className="flex items-start justify-between">
                           <div className="h-12 w-12 rounded-2xl bg-white border border-clinical-100 text-clinical-400 flex items-center justify-center group-hover:text-primary-600 transition-all shadow-sm">
                              <FileText className="h-6 w-6" />
                           </div>
                           <div className="flex gap-2">
                              <button 
                                 onClick={() => window.open(doc.url.startsWith('http') ? doc.url : `${API_URL.replace('/api', '')}${doc.url}`, '_blank')}
                                 className="h-9 w-9 rounded-xl bg-white border border-clinical-100 text-clinical-400 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-all shadow-sm"
                              >
                                 <Eye className="h-4 w-4" />
                              </button>
                              <button 
                                 onClick={() => window.open(doc.url.startsWith('http') ? doc.url : `${API_URL.replace('/api', '')}${doc.url}`, '_blank')}
                                 className="h-9 w-9 rounded-xl bg-white border border-clinical-100 text-clinical-400 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm"
                              >
                                 <Download className="h-4 w-4" />
                              </button>
                           </div>
                        </div>
                        <div>
                           <h4 className="text-sm font-black text-clinical-900 line-clamp-1 group-hover:text-primary-600 transition-colors">{doc.name}</h4>
                           <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest mt-1">Registrado el {new Date(doc.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>

         {selectedOrder && (
            <ResultsManagerModal
               isOpen={showResultsModal}
               onClose={() => {
                  setShowResultsModal(false)
                  setTimeout(() => setSelectedOrder(null), 200)
               }}
               onUpdate={() => {
                  orderService.getPatientOrders(patientId).then(setOrders)
               }}
               order={selectedOrder}
            />
         )}
      </div>
   )
}


/* ==================================================
   CURVAS DE EVOLUCION TAB
   ================================================== */
function CurvasTab({ controles, patientName }: { controles: PrenatalControl[], patientName: string }) {
   const [curveType, setCurveType] = useState<'au' | 'weight'>('au')

   // Extract and reverse controls data to show chronological order left-to-right
   const sortedControles = [...controles].reverse()

   // Dimensions
   const width = 550
   const height = 280
   const padding = 45

   // Map coordinates dynamically from real PrenatalControl fields
   const points = sortedControles.map((c) => {
      const egVal = c.gestationalAge
      const x = padding + ((egVal - 12) / (40 - 12)) * (width - padding * 2)

      let yVal = 0
      let yMin = 0
      let yMax = 0

      if (curveType === 'au') {
         yVal = c.uterineHeight ?? 0
         yMin = 10
         yMax = 40
      } else {
         yVal = c.maternalWeight ?? 0
         yMin = 50
         yMax = 80
      }

      const y = height - padding - ((yVal - yMin) / (yMax - yMin)) * (height - padding * 2)
      return { x, y, week: c.gestationalAge, val: yVal }
   }).filter(p => p.val > 0)

   // Shaded normal percentile range coordinates (static reference curve paths)
   // Representing normal ranges of AU (e.g. week 12 = 12cm, week 40 = 36cm)
   const percentilePath = () => {
      const p12_min = curveType === 'au' ? 10 : 52
      const p12_max = curveType === 'au' ? 14 : 56
      const p40_min = curveType === 'au' ? 32 : 68
      const p40_max = curveType === 'au' ? 38 : 78

      const x1 = padding
      const x2 = width - padding

      const y1_min = height - padding - ((p12_min - (curveType === 'au' ? 10 : 50)) / ((curveType === 'au' ? 40 : 80) - (curveType === 'au' ? 10 : 50))) * (height - padding * 2)
      const y1_max = height - padding - ((p12_max - (curveType === 'au' ? 10 : 50)) / ((curveType === 'au' ? 40 : 80) - (curveType === 'au' ? 10 : 50))) * (height - padding * 2)
      const y2_min = height - padding - ((p40_min - (curveType === 'au' ? 10 : 50)) / ((curveType === 'au' ? 40 : 80) - (curveType === 'au' ? 10 : 50))) * (height - padding * 2)
      const y2_max = height - padding - ((p40_max - (curveType === 'au' ? 10 : 50)) / ((curveType === 'au' ? 40 : 80) - (curveType === 'au' ? 10 : 50))) * (height - padding * 2)

      return `M ${x1} ${y1_max} L ${x2} ${y2_max} L ${x2} ${y2_min} L ${x1} ${y1_min} Z`
   }

   // Render polyline path for patient points
   const patientPath = points.map(p => `${p.x},${p.y}`).join(' ')

   return (
      <div className="bg-white rounded-[2.5rem] p-10 border border-clinical-100 shadow-premium space-y-8">
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center"><TrendingUp className="h-5 w-5" /></div>
               <div>
                  <h3 className="text-xl font-black text-clinical-900 tracking-tight">Curvas de Evolución Gestacional</h3>
                  <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest mt-0.5">Control evolutivo comparado contra percentil normal</p>
               </div>
            </div>

            <div className="flex bg-clinical-50 p-1.5 rounded-2xl border border-clinical-100 self-start">
               <button
                  onClick={() => setCurveType('au')}
                  className={cn(
                     "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                     curveType === 'au' ? "bg-white text-primary-600 shadow-sm" : "text-clinical-450 hover:text-clinical-800"
                  )}
               >
                  Altura Uterina
               </button>
               <button
                  onClick={() => setCurveType('weight')}
                  className={cn(
                     "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                     curveType === 'weight' ? "bg-white text-primary-600 shadow-sm" : "text-clinical-450 hover:text-clinical-800"
                  )}
               >
                  Peso Materno
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 items-center">
            {/* SVG Chart */}
            <div className="w-full bg-clinical-50/30 rounded-3xl p-6 border border-clinical-100 flex justify-center">
               <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible select-none max-w-[550px]">
                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((val, i) => {
                     const y = padding + val * (height - padding * 2)
                     const labelVal = curveType === 'au' 
                        ? Math.round(40 - val * (40 - 10)) 
                        : Math.round(80 - val * (80 - 50))
                     return (
                        <g key={i}>
                           <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#eef0f3" strokeDasharray="4 4" strokeWidth="1" />
                           <text x={padding - 10} y={y + 4} fill="#8e9aa8" fontSize="10" fontWeight="bold" textAnchor="end">{labelVal}</text>
                        </g>
                     )
                  })}

                  {/* Weeks grid */}
                  {[12, 16, 20, 24, 28, 32, 36, 40].map((wk, i) => {
                     const x = padding + ((wk - 12) / (40 - 12)) * (width - padding * 2)
                     return (
                        <g key={i}>
                           <line x1={x} y1={padding} x2={x} y2={height - padding} stroke="#eef0f3" strokeDasharray="4 4" strokeWidth="1" />
                           <text x={x} y={height - padding + 18} fill="#8e9aa8" fontSize="10" fontWeight="bold" textAnchor="middle">{wk}</text>
                        </g>
                     )
                  })}

                  {/* Percentile range shading */}
                  <path d={percentilePath()} fill="#3b82f6" fillOpacity="0.08" stroke="#3b82f6" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="2 2" />

                  {/* Patient curve path line */}
                  {points.length > 1 && (
                     <polyline fill="none" stroke="#2563eb" strokeWidth="3" points={patientPath} strokeLinecap="round" strokeLinejoin="round" />
                  )}

                  {/* Patient dots */}
                  {points.map((p, i) => (
                     <g key={i}>
                        <circle cx={p.x} cy={p.y} r="6" fill="#ffffff" stroke="#2563eb" strokeWidth="3" className="hover:scale-125 transition-transform cursor-pointer" />
                        <circle cx={p.x} cy={p.y} r="2" fill="#2563eb" />
                        {/* Tooltip text */}
                        <text x={p.x} y={p.y - 12} fill="#1e293b" fontSize="9" fontWeight="900" textAnchor="middle" className="bg-white px-1">
                           {p.val}
                        </text>
                     </g>
                  ))}

                  {/* Axes labels */}
                  <text x={width / 2} y={height - 5} fill="#64748b" fontSize="9" fontWeight="950" textAnchor="middle" letterSpacing="0.1em" className="uppercase">Edad Gestacional (Semanas)</text>
                  <text x="10" y={height / 2} fill="#64748b" fontSize="9" fontWeight="950" textAnchor="middle" letterSpacing="0.1em" className="uppercase" transform={`rotate(-90 10 ${height / 2})`}>
                     {curveType === 'au' ? 'Altura Uterina (cm)' : 'Peso Materno (kg)'}
                  </text>
               </svg>
            </div>

            {/* Sidebar info */}
            <div className="space-y-6">
               <div className="p-6 rounded-3xl bg-clinical-50/50 border border-clinical-100">
                  <span className="text-[9px] font-black text-clinical-400 uppercase tracking-widest">Interpretación Clínica</span>
                  <h4 className="text-base font-black text-clinical-950 mt-2 flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Curva Normoevolutiva</h4>
                  <p className="text-xs text-clinical-500 mt-2 leading-relaxed font-medium">Las mediciones de la paciente se encuentran centradas dentro de los percentiles 10 y 90 de la referencia CLAP/OPS. Indica un crecimiento fetal e incremento ponderal materno normal.</p>
               </div>

               <div className="space-y-3">
                  <div className="flex items-center gap-3"><div className="h-3 w-6 rounded-md bg-blue-500/10 border border-dashed border-blue-500/30" /><span className="text-[10px] font-black text-clinical-450 uppercase tracking-widest">Percentil 10 - 90 Normal</span></div>
                  <div className="flex items-center gap-3"><div className="h-1.5 w-6 bg-blue-600 rounded-full" /><span className="text-[10px] font-black text-clinical-450 uppercase tracking-widest">Evolución de {patientName}</span></div>
               </div>
            </div>
         </div>
      </div>
   )
}



function AlertasTab({ pregnancy, controles }: { pregnancy: any, controles: PrenatalControl[] }) {
   const egNum = parseFloat(calcularEGActual(pregnancy.fum)) || 0
   const alerts: { title: string; message: string; status: 'warning' | 'success' | 'info' | 'rose' }[] = []

   // 1. Exam Alerts based on Gestational Age
   if (egNum >= 24 && egNum <= 28) {
      alerts.push({
         title: "Tamizaje Diabetes Gestacional",
         message: `Edad gestacional: ${egNum.toFixed(1)} sem. Se recomienda realizar Curva de Tolerancia a la Glucosa (75g).`,
         status: 'warning'
      })
   } else if (egNum >= 35 && egNum <= 37) {
      alerts.push({
         title: "Tamizaje Estreptococo Grupo B",
         message: `Edad gestacional: ${egNum.toFixed(1)} sem. Indicar cultivo hisopado vaginal y rectal.`,
         status: 'warning'
      })
   } else if (egNum < 20) {
      alerts.push({
         title: "Ecografía Cromosómica y VIH <20 sem",
         message: "Controlar que estén cargados la ecografía de 11-13 semanas y el tamizaje VIH del primer trimestre.",
         status: 'info'
      })
   } else {
      alerts.push({
         title: "Protocolo de Exámenes",
         message: "Exámenes de rutina indicados según el trimestre actual de gestación.",
         status: 'success'
      })
   }

   // 2. Risk Level Alerts
   if (pregnancy.riskScore >= 8) {
      alerts.push({
         title: "Alerta de Riesgo Extremo (Muy Alto)",
         message: `Score: ${pregnancy.riskScore}. Requiere seguimiento conjunto por especialista en Ginecología y derivación oportuna.`,
         status: 'rose'
      })
   } else if (pregnancy.riskScore >= 4) {
      alerts.push({
         title: "Alerta de Riesgo Alto",
         message: `Score: ${pregnancy.riskScore}. Requiere control prenatal estricto y valoración de comorbilidades.`,
         status: 'warning'
      })
   } else {
      alerts.push({
         title: "Riesgo Obstétrico Estable",
         message: `Paciente categorizada en Riesgo Bajo/Sin Riesgo (Score: ${pregnancy.riskScore}). Manejo por Obstetricia.`,
         status: 'success'
      })
   }

   // 3. Vitamin and Treatment Supplementation Alerts
   alerts.push({
      title: "Suplementación Profiláctica",
      message: "Asegurar indicación de Hierro y Ácido Fólico. Prevención de preeclampsia con ASA en pacientes con factores de riesgo.",
      status: 'info'
   })

   // 4. Scheduling / Overdue Controls Alerts
   if (controles.length > 0) {
      const lastControl = controles[0]
      const lastControlDate = new Date(lastControl.controlDate)
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - lastControlDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays > 30) {
         alerts.push({
            title: "Control Prenatal Pendiente",
            message: `Han transcurrido ${diffDays} días desde el último control (Límite sugerido: 28 días).`,
            status: 'warning'
         })
      } else {
         alerts.push({
            title: "Control Prenatal Vigente",
            message: `Último control registrado hace ${diffDays} días. Frecuencia adecuada.`,
            status: 'success'
         })
      }
   } else {
      alerts.push({
         title: "Sin Controles Registrados",
         message: "Aún no se ha registrado ningún control prenatal periódico para esta gestación actual.",
         status: 'warning'
      })
   }

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {alerts.map((alert, i) => (
            <AlertCard key={i} title={alert.title} message={alert.message} status={alert.status} />
         ))}
      </div>
   )
}

/* ==================================================
   NEW CONTROL REGISTRATION MODAL
   ================================================== */

interface NewControlModalProps {
   isOpen: boolean
   onClose: () => void
   onSave: (data: any) => Promise<void>
   currentEg: string
   loading?: boolean
}

function NewControlModal({ isOpen, onClose, onSave, currentEg, loading }: NewControlModalProps) {
   const [formData, setFormData] = useState({
      controlDate: new Date().toISOString().split('T')[0],
      gestationalAge: (parseFloat(currentEg) + 4).toFixed(1),
      maternalWeight: '',
      bloodPressure: '110/70',
      fetalHeartRate: '',
      uterineHeight: '',
      edema: 'Ausente',
      fetalMovements: 'Presentes',
      contractions: 'Ausentes',
      observations: '',
      plan: '',
   })

   const handleInputChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }))
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!formData.gestationalAge) return
      await onSave({
         controlDate: formData.controlDate,
         gestationalAge: parseFloat(formData.gestationalAge),
         maternalWeight: formData.maternalWeight ? parseFloat(formData.maternalWeight) : undefined,
         bloodPressure: formData.bloodPressure || undefined,
         fetalHeartRate: formData.fetalHeartRate ? parseInt(formData.fetalHeartRate) : undefined,
         uterineHeight: formData.uterineHeight ? parseInt(formData.uterineHeight) : undefined,
         edema: formData.edema || undefined,
         fetalMovements: formData.fetalMovements || undefined,
         contractions: formData.contractions || undefined,
         observations: formData.observations || undefined,
         plan: formData.plan || undefined,
      })
   }

   if (!isOpen) return null

   return (
      <AnimatePresence>
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={onClose}
               className="absolute inset-0 bg-clinical-900/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col z-10"
            >
               {/* Header */}
               <header className="flex items-center justify-between px-8 py-6 border-b border-clinical-100 bg-clinical-50/50">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-200">
                        <Baby className="h-6 w-6" />
                     </div>
                     <div>
                        <h2 className="text-xl font-black text-clinical-900">Agregar Control Prenatal</h2>
                        <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">Signos vitales y evolución fetal</p>
                     </div>
                  </div>
                  <button onClick={onClose} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-clinical-200 text-clinical-400 hover:text-rose-600 transition-all">
                     <X className="h-5 w-5" />
                  </button>
               </header>

               {/* Body */}
               <form onSubmit={handleSubmit}>
                  <main className="p-8 space-y-6">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="block text-[10px] font-black uppercase tracking-widest text-clinical-500 px-1">Fecha</label>
                           <input 
                              type="date" 
                              value={formData.controlDate}
                              onChange={e => handleInputChange('controlDate', e.target.value)}
                              className="w-full h-12 rounded-2xl border border-clinical-200 bg-white px-5 text-sm font-bold text-clinical-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10"
                              required
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="block text-[10px] font-black uppercase tracking-widest text-clinical-500 px-1">Edad Gestacional (Sem.)</label>
                           <input 
                              type="number" 
                              step="0.1"
                              value={formData.gestationalAge}
                              onChange={e => handleInputChange('gestationalAge', e.target.value)}
                              className="w-full h-12 rounded-2xl border border-clinical-200 bg-white px-5 text-sm font-bold text-clinical-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10"
                              placeholder="Ej: 28.0"
                              required
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-6 p-6 bg-clinical-50/50 rounded-3xl border border-clinical-100">
                        <div className="space-y-2">
                           <label className="block text-[10px] font-black uppercase tracking-widest text-clinical-500 px-1">Peso (kg)</label>
                           <input 
                              type="number" 
                              step="0.1"
                              value={formData.maternalWeight}
                              onChange={e => handleInputChange('maternalWeight', e.target.value)}
                              className="w-full h-12 rounded-2xl border border-clinical-200 bg-white px-5 text-sm font-bold text-clinical-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10"
                              placeholder="Ej: 69.2"
                              required
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="block text-[10px] font-black uppercase tracking-widest text-clinical-500 px-1">Presión Arterial</label>
                           <input 
                              type="text" 
                              value={formData.bloodPressure}
                              onChange={e => handleInputChange('bloodPressure', e.target.value)}
                              className="w-full h-12 rounded-2xl border border-clinical-200 bg-white px-5 text-sm font-bold text-clinical-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10"
                              placeholder="Ej: 110/70"
                              required
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="block text-[10px] font-black uppercase tracking-widest text-clinical-500 px-1">Frecuencia Fetal (FCF - lpm)</label>
                           <input 
                              type="number" 
                              value={formData.fetalHeartRate}
                              onChange={e => handleInputChange('fetalHeartRate', e.target.value)}
                              className="w-full h-12 rounded-2xl border border-clinical-200 bg-white px-5 text-sm font-bold text-clinical-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10"
                              placeholder="Ej: 140"
                              required
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="block text-[10px] font-black uppercase tracking-widest text-clinical-500 px-1">Altura Uterina (AU - cm)</label>
                           <input 
                              type="number" 
                              value={formData.uterineHeight}
                              onChange={e => handleInputChange('uterineHeight', e.target.value)}
                              className="w-full h-12 rounded-2xl border border-clinical-200 bg-white px-5 text-sm font-bold text-clinical-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10"
                              placeholder="Ej: 26"
                              required
                           />
                        </div>
                     </div>
                  </main>

                  {/* Footer */}
                  <footer className="px-8 py-6 border-t border-clinical-100 bg-clinical-50/50 flex items-center justify-end gap-3">
                     <Button type="button" variant="ghost" onClick={onClose} className="px-6 rounded-2xl">
                        Cancelar
                     </Button>
                     <Button 
                        type="submit" 
                        variant="primary" 
                        className="px-8 rounded-2xl shadow-xl shadow-primary-200 min-w-[140px]" 
                     >
                        {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} Guardar Control
                     </Button>
                  </footer>
               </form>
            </motion.div>
         </div>
      </AnimatePresence>
   )
}

/* ==================================================
   HELPERS & SUB-COMPONENTS
   ================================================== */

function HeaderStat({ label, value, subValue, icon }: any) {
   return (
      <div className="flex items-center gap-3">
         <div className="h-10 w-10 rounded-xl bg-white border border-clinical-100 flex items-center justify-center shadow-sm shrink-0">
            {icon}
         </div>
         <div className="flex flex-col">
            <span className="text-[9px] font-black text-clinical-400 uppercase tracking-widest leading-none mb-1.5">{label}</span>
            <span className="text-sm font-black text-clinical-900 leading-none">{value} <span className="text-[10px] text-clinical-400 font-bold ml-0.5 tracking-tight">{subValue}</span></span>
         </div>
      </div>
   )
}

function Badge({ label, color }: any) {
   const colors = {
      rose: 'bg-rose-50 text-rose-600 border-rose-100',
      amber: 'bg-amber-50 text-amber-600 border-amber-100',
      primary: 'bg-primary-50 text-primary-600 border-primary-100',
   }
   return (
      <span className={cn("px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest", colors[color as keyof typeof colors])}>
         {label}
      </span>
   )
}

function InfoCard({ title, value, sub, icon }: any) {
   return (
      <div className="bg-white p-6 rounded-[2rem] border border-clinical-100 shadow-premium group hover:border-primary-200 transition-all">
         <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
            {icon}
         </div>
         <p className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-1">{title}</p>
         <p className="text-2xl font-black text-clinical-900">{value} <span className="text-xs text-clinical-400 font-bold">{sub}</span></p>
      </div>
   )
}

function TimelineItem({ week, title, date, events, status }: any) {
   const colors = {
      completed: 'bg-emerald-500 shadow-emerald-100',
      current: 'bg-primary-600 shadow-primary-200 animate-pulse',
      upcoming: 'bg-clinical-200 shadow-none'
   }
   return (
      <div className="flex gap-8 group">
         <div className="relative">
            <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center text-white font-black text-xs z-10 relative shadow-lg", colors[status as keyof typeof colors])}>
               {week}
            </div>
         </div>
         <div className="flex-1 pb-4">
            <div className="flex items-center justify-between mb-2">
               <h4 className={cn("font-black text-sm tracking-tight", status === 'upcoming' ? 'text-clinical-400' : 'text-clinical-900')}>{title}</h4>
               <span className="text-[10px] font-bold text-clinical-400 uppercase">{date}</span>
            </div>
            <ul className="space-y-1.5">
               {events.map((e: any, i: any) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-medium text-clinical-500">
                     <div className={cn("h-1 w-1 rounded-full", status === 'upcoming' ? 'bg-clinical-200' : 'bg-primary-400')} />
                     {e}
                  </li>
               ))}
            </ul>
         </div>
      </div>
   )
}


function ControlRecordRow({ date, eg, weight, tension, fcf, au }: any) {
   return (
      <div className="p-6 rounded-2xl bg-clinical-50/50 border border-clinical-100 flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all">
         <div className="flex items-center gap-8">
            <div className="text-center min-w-[80px]">
               <p className="text-sm font-black text-clinical-900">{date}</p>
               <p className="text-[9px] font-bold text-primary-500 uppercase tracking-widest mt-0.5">Sem. {eg}</p>
            </div>
            <div className="grid grid-cols-4 gap-8">
               <SmallStat label="Peso" value={`${weight} kg`} />
               <SmallStat label="Tensión" value={tension} />
               <SmallStat label="FCF" value={`${fcf} lpm`} />
               <SmallStat label="AU" value={`${au} cm`} />
            </div>
         </div>
         <div className="flex gap-2">
            <button className="h-9 w-9 rounded-xl bg-white text-clinical-400 border border-clinical-100 flex items-center justify-center hover:text-primary-600 hover:border-primary-200 shadow-sm"><Eye className="h-4 w-4" /></button>
            <button className="h-9 w-9 rounded-xl bg-white text-clinical-400 border border-clinical-100 flex items-center justify-center hover:text-indigo-600 hover:border-indigo-200 shadow-sm"><Printer className="h-4 w-4" /></button>
         </div>
      </div>
   )
}

function SmallStat({ label, value }: any) {
   return (
      <div className="flex flex-col">
         <span className="text-[8px] font-black text-clinical-400 uppercase tracking-widest mb-1">{label}</span>
         <span className="text-xs font-black text-clinical-700">{value}</span>
      </div>
   )
}

function AlertCard({ title, message, status }: any) {
   const styles = {
      success: 'bg-emerald-50 border-emerald-100 text-emerald-800',
      warning: 'bg-amber-50 border-amber-100 text-amber-800',
      rose: 'bg-rose-50 border-rose-100 text-rose-800',
      info: 'bg-primary-50 border-primary-100 text-primary-800'
   }
   return (
      <div className={cn("p-6 rounded-[2rem] border flex flex-col gap-2", styles[status as keyof typeof styles])}>
         <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-widest">{title}</h4>
            <AlertCircle className="h-4 w-4 opacity-50" />
         </div>
         <p className="text-sm font-medium leading-relaxed">{message}</p>
      </div>
   )
}
