import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Baby, Calendar, AlertTriangle, Heart,
  Activity, Users, Search, X, Loader2, ChevronRight,
  ClipboardList, Stethoscope, Eye
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/widgets/button'
import { useToast } from '@/shared/ui/ToastContext'
import { API_URL } from '@/shared/api/base'
import { PatientSearchModal } from '@/pages/consultas-page/ui/organisms/PatientSearchModal'
import {
  useActivePregnanciesList,
  useCreatePregnancy,
} from '@/entities/pregnancy'
import type { RiskLevel } from '@/entities/pregnancy'

const RISK_CONFIG: Record<RiskLevel, { label: string; color: string }> = {
  sin_riesgo: { label: 'Sin Riesgo',   color: 'bg-emerald-50 text-emerald-700 border-emerald-250' },
  bajo:       { label: 'Riesgo Bajo',  color: 'bg-blue-50 text-blue-700 border-blue-250' },
  alto:       { label: 'Riesgo Alto',  color: 'bg-amber-50 text-amber-700 border-amber-250' },
  muy_alto:   { label: 'Riesgo Muy Alto', color: 'bg-rose-50 text-rose-700 border-rose-250' },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

function calcularEGActual(fum: string): string {
  const fumDate = new Date(fum)
  const hoy = new Date()
  const diffDays = Math.floor((hoy.getTime() - fumDate.getTime()) / (1000 * 60 * 60 * 24))
  return (diffDays / 7).toFixed(1)
}

function calcularTrimestre(eg: number): string {
  if (eg < 13) return '1er Trimestre'
  if (eg < 27) return '2do Trimestre'
  return '3er Trimestre'
}

// ─── Modal: Configurar Gestación (Iniciar Embarazo) ───────────────────

interface StartPregnancyModalProps {
  isOpen: boolean
  onClose: () => void
  patient: any
  onSubmit: (fum: string, weight: string, height: string) => Promise<void>
  loading: boolean
}

function StartPregnancyModal({ isOpen, onClose, patient, onSubmit, loading }: StartPregnancyModalProps) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-clinical-900/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl z-10 overflow-hidden"
      >
        <header className="flex items-center justify-between px-8 py-6 border-b border-clinical-100 bg-clinical-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg">
              <Baby className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-clinical-900">Iniciar Control Prenatal</h2>
              <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">Configurar gestación actual</p>
            </div>
          </div>
          <button onClick={onClose} className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-clinical-200 text-clinical-400 hover:text-rose-600">
            <X className="h-4 w-4" />
          </button>
        </header>

        <StartPregnancyForm
          patient={patient}
          onSubmit={onSubmit}
          onCancel={onClose}
          loading={loading}
        />
      </motion.div>
    </div>
  )
}

// ─── Subformulario: Iniciar Embarazo ────────────────────────────────────────

function StartPregnancyForm({ patient, onSubmit, onCancel, loading }: any) {
  const latestConsultation = patient?.consultations?.[0]
  const lastWeight = latestConsultation?.vitalSigns?.weight || ''
  const lastHeight = latestConsultation?.vitalSigns?.height || ''
  const lastFum = latestConsultation?.gynecology?.fum
    ? latestConsultation.gynecology.fum.substring(0, 10)
    : ''

  const [fum, setFum] = useState(lastFum)
  const [weight, setWeight] = useState(lastWeight)
  const [height, setHeight] = useState(lastHeight)

  return (
    <div className="p-8 space-y-6">
      <div className="p-4 rounded-2xl bg-primary-50 border border-primary-100">
        <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Iniciar Embarazo para:</p>
        <p className="text-base font-black text-primary-900 mt-1">{patient?.nombres} {patient?.apellidos}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-clinical-500">F.U.M. (Fecha Última Menstruación) *</label>
          <input type="date" value={fum} onChange={e => setFum(e.target.value)} required
            className="w-full h-12 rounded-2xl border border-clinical-200 px-5 text-sm font-bold outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-clinical-500">Peso inicial (kg)</label>
            <input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Ej: 62.5"
              className="w-full h-12 rounded-2xl border border-clinical-200 px-5 text-sm font-bold outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10" />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-clinical-500">Talla (cm)</label>
            <input type="number" step="0.1" value={height} onChange={e => setHeight(e.target.value)} placeholder="Ej: 162"
              className="w-full h-12 rounded-2xl border border-clinical-200 px-5 text-sm font-bold outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10" />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={onCancel} className="flex-1 rounded-2xl">Volver</Button>
        <Button variant="primary" onClick={() => onSubmit(fum, weight, height)} disabled={!fum || loading} className="flex-1 rounded-2xl shadow-lg">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Baby className="h-4 w-4 mr-2" />}
          Iniciar Embarazo
        </Button>
      </div>
    </div>
  )
}

// ─── Componente Principal ────────────────────────────────────────────────────

export function ObstetriciaPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isStartPregnancyOpen, setIsStartPregnancyOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: pregnancies = [], isLoading } = useActivePregnanciesList()
  const createPregnancy = useCreatePregnancy()

  const totalActive = pregnancies.length
  const highRisk = pregnancies.filter(p => p.riskLevel === 'alto' || p.riskLevel === 'muy_alto').length

  const handleSelectPatient = async (targetId: string) => {
    try {
      const res = await fetch(`${API_URL}/patients/${targetId}/pregnancies/active`)
      if (res.status === 404) {
        const patRes = await fetch(`${API_URL}/patients/${targetId}`)
        if (patRes.ok) {
          const patientData = await patRes.json()
          setSelectedPatient(patientData)
          setIsStartPregnancyOpen(true)
        } else {
          showToast('Error al obtener información de la paciente', 'error')
        }
      } else if (res.ok) {
        const pregnancy = await res.json()
        navigate(`/control-obstetrico/${pregnancy.id}`)
      }
    } catch {
      showToast('Error al procesar la selección', 'error')
    }
  }

  const handleStartPregnancy = async (fum: string, initialWeight: string, initialHeight: string) => {
    if (!selectedPatient) return
    try {
      const pregnancy = await createPregnancy.mutateAsync({
        patientId: selectedPatient.id,
        fum,
        initialWeight: initialWeight ? parseFloat(initialWeight) : undefined,
        initialHeight: initialHeight ? parseFloat(initialHeight) : undefined,
      })
      showToast('Embarazo iniciado correctamente', 'success')
      setIsStartPregnancyOpen(false)
      navigate(`/control-obstetrico/${pregnancy.id}`)
    } catch (err: any) {
      showToast(err.message || 'Error al iniciar embarazo', 'error')
    }
  }

  const filteredPregnancies = pregnancies.filter(p =>
    `${p.patient.nombres} ${p.patient.apellidos}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.patient.numeroDocumento.includes(searchQuery)
  )

  return (
    <div className="min-h-dvh bg-clinical-50/50">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mx-auto max-w-7xl px-6 py-10"
      >
        {/* Header - Aligned with PacientesPage header style */}
        <motion.header variants={itemVariants} className="flex flex-col gap-6 mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-12 bg-primary-500 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600/70">Monitoreo Prenatal</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-clinical-900 mb-2">
              Control <span className="text-primary-700">Obstétrico</span>
            </h1>
            <p className="text-sm text-clinical-800/60 max-w-md">
              Supervise la evolución gestacional, controles prenatales y niveles de riesgo de <span className="font-semibold text-primary-700">{pregnancies.length}</span> embarazos activos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick stats inline badges */}
            <div className="hidden md:flex items-center gap-4 mr-2 bg-white/60 backdrop-blur px-5 py-2.5 rounded-2xl border border-clinical-100/60 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-bold text-clinical-700">
                <Users className="h-4 w-4 text-primary-500" />
                <span>{totalActive} Embarazos</span>
              </div>
              <div className="w-px h-4 bg-clinical-200" />
              <div className="flex items-center gap-1.5 text-xs font-bold text-clinical-700">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>{highRisk} Alto Riesgo</span>
              </div>
            </div>

            <Button
              variant="primary"
              className="shadow-lg shadow-primary-200"
              onClick={() => setIsSearchOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Control
            </Button>
          </div>
        </motion.header>

        {/* Search Bar - Aligned with PacientesPage search style */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-300">
                <Search className="h-4 w-4" />
             </span>
             <input
               type="text"
               placeholder="Buscar por paciente o documento..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full h-11 rounded-2xl border-0 bg-white pl-11 pr-4 text-sm shadow-premium ring-1 ring-inset ring-primary-100/50 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
             />
          </div>
        </motion.div>

        {/* Table/List Container - Aligned with PacientesPage grid style */}
        <motion.div variants={itemVariants} className="glass-card rounded-[2rem] overflow-hidden border border-white min-h-[400px] flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-primary-600 gap-3">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm font-medium">Cargando monitoreos activos...</p>
            </div>
          ) : filteredPregnancies.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-clinical-400 gap-4 py-20 text-center">
              <ClipboardList className="h-12 w-12 opacity-20 mx-auto" />
              <div>
                <p className="text-sm font-bold text-clinical-800">No se encontraron controles activos.</p>
                <p className="text-xs text-clinical-400 mt-1 max-w-xs mx-auto">Haga clic en "Nuevo Control" para iniciar el seguimiento de una paciente.</p>
              </div>
              <Button onClick={() => setIsSearchOpen(true)} variant="primary" className="mx-auto h-11 px-8 rounded-2xl shadow-lg mt-2">
                <Plus className="h-4 w-4 mr-2" /> Iniciar Control
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse min-w-[1000px] lg:min-w-0">
                <thead>
                  <tr className="bg-primary-50/30 text-[11px] font-bold uppercase tracking-wider text-primary-900/60">
                    <th className="px-6 py-5 font-display">Paciente en Control</th>
                    <th className="px-4 py-5 font-display text-center">E.G. Actual</th>
                    <th className="px-4 py-5 font-display">Trimestre</th>
                    <th className="px-4 py-5 font-display">Fecha Probable Parto (FPP)</th>
                    <th className="px-4 py-5 font-display">Último Control</th>
                    <th className="px-4 py-5 font-display">Controles</th>
                    <th className="px-6 py-5 font-display">Riesgo</th>
                    <th className="px-6 py-5 text-center font-display">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-100/30 bg-white/40">
                  {filteredPregnancies.map((pregnancy) => {
                    const eg = parseFloat(calcularEGActual(pregnancy.fum))
                    const lastControl = pregnancy.controls?.[0]
                    const risk = RISK_CONFIG[pregnancy.riskLevel as RiskLevel] || RISK_CONFIG.sin_riesgo
                    const fppDate = new Date(pregnancy.fpp)
                    const fppStr = fppDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })

                    return (
                      <motion.tr
                        key={pregnancy.id}
                        variants={itemVariants}
                        className="hover:bg-primary-50/40 transition-all duration-300 group cursor-pointer"
                        onClick={() => navigate(`/control-obstetrico/${pregnancy.id}`)}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 flex shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 text-xs font-bold border border-white shadow-sm transition-transform group-hover:scale-110">
                              {pregnancy.patient.nombres[0]}{pregnancy.patient.apellidos[0]}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-clinical-900 truncate group-hover:text-primary-700 transition-colors">
                                {pregnancy.patient.nombres} {pregnancy.patient.apellidos}
                              </p>
                              <p className="text-[11px] text-clinical-800/50 flex items-center gap-1 mt-0.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
                                Doc: {pregnancy.patient.numeroDocumento}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <span className="inline-flex px-2.5 py-1 text-xs font-black bg-primary-50 text-primary-700 rounded-lg border border-primary-100">
                            {eg} sem
                          </span>
                        </td>
                        <td className="px-4 py-5 text-sm font-semibold text-clinical-800">
                          {calcularTrimestre(eg)}
                        </td>
                        <td className="px-4 py-5">
                          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-clinical-800/70">
                            <Calendar className="h-3.5 w-3.5 text-primary-450" />
                            {fppStr}
                          </div>
                        </td>
                        <td className="px-4 py-5 text-sm text-clinical-800/70">
                          {lastControl
                            ? new Date(lastControl.controlDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
                            : '—'}
                        </td>
                        <td className="px-4 py-5 text-center text-sm font-bold text-clinical-800">
                          {pregnancy._count?.controls ?? 0}
                        </td>
                        <td className="px-6 py-5">
                          <span className={cn("inline-flex px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border rounded-full", risk.color)}>
                            {risk.label}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="flex justify-center gap-2">
                             <button
                               onClick={(e) => {
                                 e.stopPropagation()
                                 navigate(`/control-obstetrico/${pregnancy.id}`)
                               }}
                               className="h-9 w-9 flex items-center justify-center text-clinical-800/40 hover:text-primary-700 transition-all rounded-xl hover:bg-white hover:shadow-premium"
                               title="Ver Detalle Gestación"
                             >
                                <Eye className="h-4 w-4" />
                             </button>
                             <button
                               onClick={(e) => {
                                 e.stopPropagation()
                                 navigate(`/consultas/activa/${pregnancy.patient.numeroDocumento || pregnancy.patient.id}`)
                               }}
                               className="h-9 w-9 flex items-center justify-center text-clinical-800/40 hover:text-emerald-600 transition-all rounded-xl hover:bg-emerald-50"
                               title="Nueva Consulta Prenatal"
                             >
                                <Stethoscope className="h-4 w-4" />
                             </button>
                             <ChevronRight className="h-5 w-5 text-clinical-300 group-hover:text-primary-500 transition-transform group-hover:translate-x-1 duration-300 self-center" />
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-auto px-6 py-4 bg-primary-50/20 border-t border-primary-100/30 flex items-center justify-between">
             <p className="text-[10px] font-medium text-primary-900/40 italic">
               * Monitoreo obstétrico sujeto a valoración clínica continua de alta especialidad.
             </p>
             <div className="flex gap-1">
                {[1].map(p => (
                  <button key={p} className={cn(
                    "h-6 w-6 rounded-md text-[10px] font-bold transition-all",
                    p === 1 ? "bg-primary-600 text-white shadow-sm" : "text-primary-400 hover:bg-primary-100"
                  )}>
                    {p}
                  </button>
                ))}
             </div>
          </div>
        </motion.div>
      </motion.div>

      <PatientSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Control Obstétrico"
        actionLabel="Seleccionar Paciente"
        onAction={handleSelectPatient}
      />

      <StartPregnancyModal
        isOpen={isStartPregnancyOpen}
        onClose={() => setIsStartPregnancyOpen(false)}
        patient={selectedPatient}
        onSubmit={handleStartPregnancy}
        loading={createPregnancy.isPending}
      />
    </div>
  )
}
