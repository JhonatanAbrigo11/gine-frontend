import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus, Baby, TrendingUp, Calendar, AlertTriangle, Heart,
  Activity, Users, Search, X, Loader2, ChevronRight
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/widgets/button'
import { useToast } from '@/shared/ui/ToastContext'
import { API_URL } from '@/shared/api/base'
import { PatientSearchModal } from '@/pages/consultas-page/ui/organisms/PatientSearchModal'
import {
  useActivePregnanciesList,
  useActivePregnancy,
  useCreatePregnancy,
} from '@/entities/pregnancy'
import type { RiskLevel } from '@/entities/pregnancy'

const RISK_CONFIG: Record<RiskLevel, { label: string; color: string }> = {
  sin_riesgo: { label: 'Sin Riesgo',   color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  bajo:       { label: 'Riesgo Bajo',  color: 'bg-blue-50 text-blue-700 border-blue-200' },
  alto:       { label: 'Riesgo Alto',  color: 'bg-amber-50 text-amber-700 border-amber-200' },
  muy_alto:   { label: 'Riesgo Muy Alto', color: 'bg-rose-50 text-rose-700 border-rose-200' },
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
  const [fum, setFum] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')

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

  const { data: pregnancies = [], isLoading } = useActivePregnanciesList()
  const createPregnancy = useCreatePregnancy()

  const totalActive = pregnancies.length
  const highRisk = pregnancies.filter(p => p.riskLevel === 'alto' || p.riskLevel === 'muy_alto').length
  const thirdTrimestre = pregnancies.filter(p => parseFloat(calcularEGActual(p.fum)) >= 27).length

  const handleSelectPatient = async (targetId: string) => {
    try {
      // 1. Verificar embarazo activo
      const res = await fetch(`${API_URL}/patients/${targetId}/pregnancies/active`)
      if (res.status === 404) {
        // Sin embarazo activo → obtener detalles de la paciente para el subformulario de inicio
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
        // Ya tiene embarazo activo → ir directo al control obstétrico
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

  return (
    <div className="min-h-dvh bg-clinical-50/50">
      {/* Header */}
      <div className="bg-white border-b border-clinical-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg">
              <Baby className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-clinical-900">Control Obstétrico</h1>
              <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest mt-0.5">
                Monitoreo Prenatal Activo
              </p>
            </div>
          </div>
          <Button onClick={() => setIsSearchOpen(true)} variant="primary" className="h-12 px-6 rounded-2xl shadow-xl shadow-primary-200 font-bold">
            <Plus className="h-4 w-4 mr-2" /> Nuevo Control
          </Button>
        </div>

        {/* Stats */}
        <div className="bg-clinical-50/30 border-t border-clinical-100 px-10 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-12">
            <QuickStat icon={<Users className="h-4 w-4 text-primary-500" />} label="Embarazos Activos" value={totalActive} />
            <div className="w-px h-8 bg-clinical-200" />
            <QuickStat icon={<AlertTriangle className="h-4 w-4 text-amber-500" />} label="Alto Riesgo" value={highRisk} />
            <div className="w-px h-8 bg-clinical-200" />
            <QuickStat icon={<Baby className="h-4 w-4 text-rose-400" />} label="3er Trimestre" value={thirdTrimestre} />
          </div>
        </div>
      </div>

      {/* Body */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-10 w-10 animate-spin text-primary-400" />
          </div>
        ) : pregnancies.length === 0 ? (
          <div className="text-center py-32 space-y-4">
            <div className="h-20 w-20 rounded-3xl bg-primary-50 text-primary-300 flex items-center justify-center mx-auto">
              <Baby className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-black text-clinical-400">Sin embarazos activos</h3>
            <p className="text-sm text-clinical-400 font-medium max-w-xs mx-auto">
              Haga clic en "Nuevo Control" para iniciar el seguimiento prenatal de una paciente.
            </p>
            <Button onClick={() => setIsSearchOpen(true)} variant="primary" className="mx-auto h-11 px-8 rounded-2xl shadow-lg mt-4">
              <Plus className="h-4 w-4 mr-2" /> Iniciar primer control
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {pregnancies.map(pregnancy => {
              const eg = parseFloat(calcularEGActual(pregnancy.fum))
              const lastControl = pregnancy.controls?.[0]
              const risk = RISK_CONFIG[pregnancy.riskLevel as RiskLevel] || RISK_CONFIG.sin_riesgo
              const fppDate = new Date(pregnancy.fpp)
              const fppStr = fppDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })

              return (
                <motion.div
                  key={pregnancy.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => navigate(`/control-obstetrico/${pregnancy.id}`)}
                  className="bg-white rounded-3xl border border-clinical-100 p-6 flex items-center justify-between cursor-pointer hover:shadow-xl hover:border-primary-200 transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center text-lg font-black shadow-lg shrink-0">
                      {pregnancy.patient.nombres.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-clinical-900 group-hover:text-primary-700 transition-colors">
                        {pregnancy.patient.nombres} {pregnancy.patient.apellidos}
                      </h3>
                      <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest mt-0.5">
                        Doc: {pregnancy.patient.numeroDocumento} • FPP: {fppStr}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <DataPoint label="E.G. Actual" value={`${eg} sem`} />
                    <DataPoint label="Trimestre" value={calcularTrimestre(eg)} />
                    <DataPoint label="Último Control" value={lastControl
                      ? new Date(lastControl.controlDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
                      : 'Sin controles'} />
                    <DataPoint label="Controles" value={pregnancy._count?.controls ?? 0} />
                    <span className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0", risk.color)}>
                      {risk.label}
                    </span>
                    <ChevronRight className="h-5 w-5 text-clinical-300 group-hover:text-primary-500 transition-colors" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </main>

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

function QuickStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-xl bg-white border border-clinical-100 flex items-center justify-center shadow-sm">{icon}</div>
      <div>
        <p className="text-[9px] font-black text-clinical-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-black text-clinical-900">{value}</p>
      </div>
    </div>
  )
}

function DataPoint({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <p className="text-[9px] font-black text-clinical-400 uppercase tracking-widest">{label}</p>
      <p className="text-xs font-black text-clinical-800 mt-0.5">{value}</p>
    </div>
  )
}
