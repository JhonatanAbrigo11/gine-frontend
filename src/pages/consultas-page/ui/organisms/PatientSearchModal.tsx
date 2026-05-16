import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Search,
  User,
  Phone,
  CreditCard,
  History,
  ArrowRight,
  Activity,
  Calendar,
  AlertCircle,
  FileText,
  Stethoscope,
  Droplet,
  Weight,
  UserCheck,
  SearchX,
  MousePointer2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/widgets/button'
import { ROUTES } from '@/shared/config/routes'

type PatientSearchModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  actionLabel?: string
  onAction?: (patientId: string) => void
}



import { pacienteService } from '@/entities/paciente/api/paciente.service'
import type { Patient } from '@/entities/paciente/model/types'

export function PatientSearchModal({ 
  isOpen, 
  onClose, 
  title = "Nueva Consulta", 
  actionLabel = "Ir a Consulta",
  onAction 
}: PatientSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Cargar pacientes al abrir el modal
  React.useEffect(() => {
    const fetchPatients = async () => {
      if (!isOpen) return
      try {
        setLoading(true)
        const data = await pacienteService.getAll()
        setPatients(data)
      } catch (error) {
        console.error('Error fetching patients:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [isOpen])

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    return patients.filter(p =>
      `${p.nombres} ${p.apellidos}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.numeroDocumento.includes(searchQuery)
    )
  }, [searchQuery, patients])

  const selectedPatient = useMemo(() =>
    patients.find(p => p.id === selectedId)
    , [selectedId, patients])

  // Extraer datos de la última consulta para el resumen
  const lastConsultation = useMemo(() => {
    if (!selectedPatient?.consultations || selectedPatient.consultations.length === 0) return null
    return selectedPatient.consultations[0] // Ya vienen ordenadas por desc en el backend
  }, [selectedPatient])

  const handleAction = () => {
    if (selectedPatient) {
      const targetId = selectedPatient.numeroDocumento || selectedPatient.id
      const consecutive = (selectedPatient.consultations?.length || 0) + 1
      navigate(ROUTES.nuevaConsulta.replace(':id', targetId).replace(':num?', consecutive.toString()))
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-clinical-900/40 backdrop-blur-[2px]"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[640px]"
        >
          {/* Header Compact */}
          <header className="flex items-center justify-between px-8 py-5 border-b border-clinical-100 bg-clinical-50/20">
            <div>
              <h2 className="text-xl font-bold text-clinical-900 tracking-tight">
                {title}: <span className="text-primary-600">Seleccionar Paciente</span>
              </h2>
            </div>
            <button onClick={onClose} className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-clinical-200 text-clinical-400 hover:text-rose-600 transition-all">
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="flex-1 overflow-hidden flex">
            {/* Left Column: Search & Results */}
            <div className="w-[340px] border-r border-clinical-100 flex flex-col bg-clinical-50/10">
              <div className="p-5">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-400" />
                  <input
                    type="text"
                    placeholder="Nombre, Cédula o HC..."
                    className="w-full h-11 pl-11 pr-4 bg-white rounded-xl border-none shadow-sm ring-1 ring-clinical-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm transition-all"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setSelectedId(null) // Reset selection on new search
                    }}
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4 space-y-2">
                {searchQuery.trim() === '' ? (
                  <div className="h-full flex flex-col items-center justify-center py-10 opacity-60">
                    <Search className="h-8 w-8 text-clinical-200 mb-3" />
                    <p className="text-[11px] font-bold text-clinical-400 uppercase tracking-widest text-center px-4">
                      Realiza una búsqueda para comenzar
                    </p>
                  </div>
                ) : filteredResults.length > 0 ? (
                  <>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-clinical-400 mb-2 px-2">Resultados ({filteredResults.length})</h3>
                    {filteredResults.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedId(p.id)}
                        className={cn(
                          "w-full text-left flex items-center justify-between p-3.5 rounded-2xl transition-all border",
                          selectedId === p.id
                            ? "bg-primary-600 border-primary-700 shadow-lg shadow-primary-200 text-white"
                            : "bg-white border-clinical-100 hover:border-primary-200 hover:bg-primary-50/30 text-clinical-900"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-9 w-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0",
                            selectedId === p.id ? "bg-white/20 text-white" : "bg-primary-100 text-primary-600"
                          )}>
                            {p.nombres.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate">{p.nombres} {p.apellidos}</p>
                            <p className={cn(
                              "text-[9px] font-medium opacity-70",
                              selectedId === p.id ? "text-white" : "text-clinical-500"
                            )}>Doc: {p.numeroDocumento}</p>
                          </div>
                        </div>
                        {selectedId === p.id && <UserCheck className="h-4 w-4 shrink-0" />}
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-10 opacity-60">
                    <SearchX className="h-8 w-8 text-clinical-200 mb-3" />
                    <p className="text-[11px] font-bold text-clinical-400 uppercase tracking-widest text-center px-4">
                      No se encontraron pacientes
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Integrated Summary */}
            <div className="flex-1 bg-white flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <AnimatePresence mode="wait">
                  {selectedPatient ? (
                    <motion.div
                      key={selectedPatient.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      {/* Header Compact */}
                      <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-[1.5rem] bg-primary-50 border-2 border-white shadow-lg flex items-center justify-center text-primary-600 text-3xl font-bold ring-1 ring-primary-100 shrink-0">
                          {selectedPatient.nombres.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-2xl font-bold text-clinical-900 truncate mb-1">{selectedPatient.nombres} {selectedPatient.apellidos}</h3>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-0.5 rounded-lg bg-clinical-100 text-clinical-700 text-[10px] font-bold uppercase tracking-wider">
                              HC: 2026-{selectedPatient.id.substring(0,3).toUpperCase()}
                            </span>
                            <span className={cn(
                              "px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700"
                            )}>
                              Activa
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Grid Compact */}
                      <div className="grid grid-cols-2 gap-3">
                        <SummaryCard icon={<AlertCircle className="h-4 w-4 text-rose-500" />} label="Alergias" value={selectedPatient.alergias || 'Ninguna'} danger={!!selectedPatient.alergias} />
                        <SummaryCard icon={<Stethoscope className="h-4 w-4 text-primary-500" />} label="Último Diag." value={lastConsultation?.diagnosis || 'Sin historial'} />
                        <SummaryCard icon={<Calendar className="h-4 w-4 text-amber-500" />} label="Última Consulta" value={lastConsultation?.date ? new Date(lastConsultation.date).toLocaleDateString() : 'Nunca'} />
                        <SummaryCard icon={<Activity className="h-4 w-4 text-emerald-500" />} label="Presión Art." value={lastConsultation?.pressure || '—'} />
                        <SummaryCard icon={<Weight className="h-4 w-4 text-primary-500" />} label="Último Peso" value={lastConsultation?.weight ? `${lastConsultation.weight} kg` : '—'} />
                        <SummaryCard icon={<FileText className="h-4 w-4 text-indigo-500" />} label="Tipo Sangre" value={selectedPatient.tipoSanguineo || '—'} />
                      </div>

                      {/* Additional Quick Info */}
                      <div className="flex gap-4 p-4 rounded-2xl bg-clinical-50/50 border border-clinical-100/50">
                        <div className="flex items-center gap-2">
                          <Droplet className="h-4 w-4 text-rose-500" />
                          <span className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">Tipo Sangre:</span>
                          <span className="text-xs font-bold text-clinical-900">{selectedPatient.tipoSanguineo || '—'}</span>
                        </div>
                        <div className="flex items-center gap-2 border-l border-clinical-200 pl-4">
                          <User className="h-4 w-4 text-primary-500" />
                          <span className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">Estado:</span>
                          <span className="text-xs font-bold text-emerald-600">Activa</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20">
                      <div className="h-20 w-20 rounded-3xl bg-clinical-50 flex items-center justify-center mb-6 border border-clinical-100">
                        <MousePointer2 className="h-10 w-10 text-clinical-200" />
                      </div>
                      <h3 className="text-lg font-bold text-clinical-400">Seleccionar una paciente</h3>
                      <p className="text-xs text-clinical-300 max-w-[240px] mx-auto mt-2 leading-relaxed">
                        Busque en el panel izquierdo y seleccione para ver el resumen clínico.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Footer Actions Compact */}
          <footer className="px-8 py-5 border-t border-clinical-100 bg-clinical-50/30 flex items-center justify-between">
            <button
              onClick={() => setSelectedId(null)}
              className={cn(
                "text-[11px] font-bold uppercase tracking-widest transition-all",
                selectedId ? "text-primary-600 hover:text-primary-700" : "text-clinical-200 pointer-events-none"
              )}
            >
              Limpiar Selección
            </button>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={onClose}
                className="rounded-xl px-6 h-10 text-xs"
              >
                Cancelar
              </Button>
              <Button
                variant="secondary"
                disabled={!selectedId}
                onClick={() => {
                  if (selectedPatient) {
                    const targetId = selectedPatient.numeroDocumento || selectedPatient.id
                    if (targetId) {
                      navigate(ROUTES.pacienteFicha.replace(':id', targetId))
                      onClose()
                    }
                  }
                }}
                className="rounded-xl px-6 h-10 text-xs border-clinical-200"
              >
                Ver Ficha
              </Button>
              <Button
                variant="primary"
                disabled={!selectedId}
                onClick={handleAction}
                className="rounded-xl px-8 h-10 text-xs shadow-lg shadow-primary-200"
              >
                {actionLabel} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

function SummaryCard({ icon, label, value, danger }: any) {
  return (
    <div className={cn(
      "p-3 rounded-xl flex items-center gap-3 transition-all border",
      danger ? "bg-rose-50 border-rose-100" : "bg-clinical-50/50 border-clinical-100/50 hover:bg-white hover:shadow-sm"
    )}>
      <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-bold text-clinical-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className={cn(
          "text-xs font-bold truncate",
          danger ? "text-rose-700" : "text-clinical-900"
        )}>{value}</p>
      </div>
    </div>
  )
}
