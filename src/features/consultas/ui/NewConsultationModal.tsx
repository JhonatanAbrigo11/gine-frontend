import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Save, 
  Stethoscope, 
  Calendar, 
  Activity, 
  User,
  FileText,
  Loader2
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/widgets/button'
import { consultaService } from '@/entities/consulta/api/consulta.service'
import { useToast } from '@/shared/ui/ToastContext'
import axios from 'axios'

interface NewConsultationModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: string
  onSuccess: () => void
}

export function NewConsultationModal({ isOpen, onClose, patientId, onSuccess }: NewConsultationModalProps) {
  const { showToast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    type: 'Consulta Ginecología',
    date: new Date().toISOString().split('T')[0],
    reason: '',
    diagnosis: '',
    pressure: '',
    weight: '',
    doctor: '', 
    notes: ''
  })
  
  const [doctors, setDoctors] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      axios.get('http://127.0.0.1:3001/api/users')
        .then(res => {
          const activeUsers = res.data.filter((u: any) => u.status === 'Activo')
          if (activeUsers.length > 0) {
            const names = activeUsers.map((u: any) => {
              if (u.nombres) {
                const lowerName = u.nombres.toLowerCase()
                const lowerUser = u.username.toLowerCase()
                const isFemale = lowerName.startsWith('dra') || lowerName.includes('ana') || lowerName.includes('garcia') || lowerName.includes('sofia') || lowerName.includes('lucy') || lowerUser.includes('dra')
                const prefix = isFemale ? 'Dra. ' : 'Dr. '
                if (lowerName.startsWith('dr.') || lowerName.startsWith('dra.')) {
                  return `${u.nombres} ${u.apellidos || ''}`.trim()
                }
                return `${prefix}${u.nombres} ${u.apellidos || ''}`.trim()
              }
              return `@${u.username}`
            })
            setDoctors(names)
            setFormData(prev => ({ ...prev, doctor: names[0] }))
          } else {
            const defaults = ['Dra. Ana García', 'Dr. Wilson Mora', 'Dra. Sofía Ruiz']
            setDoctors(defaults)
            setFormData(prev => ({ ...prev, doctor: defaults[0] }))
          }
        })
        .catch(err => {
          console.error('Error fetching doctors:', err)
          const defaults = ['Dra. Ana García', 'Dr. Wilson Mora', 'Dra. Sofía Ruiz']
          setDoctors(defaults)
          setFormData(prev => ({ ...prev, doctor: defaults[0] }))
        })
    }
  }, [isOpen])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      if (!formData.type || !formData.diagnosis) {
        showToast('Por favor complete el diagnóstico de la consulta', 'warning')
        return
      }

      setIsSaving(true)
      await consultaService.create({
        ...formData,
        patientId
      })
      
      showToast('Consulta registrada correctamente', 'success')
      onSuccess()
      onClose()
    } catch (error) {
      showToast('Error al registrar la consulta', 'error')
      console.error(error)
    } finally {
      setIsSaving(false)
    }
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

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <header className="flex items-center justify-between px-8 py-6 border-b border-clinical-100 bg-clinical-50/50">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-200">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-clinical-900">Nueva Consulta</h2>
                <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">Registro de Historia Clínica</p>
              </div>
            </div>
            <button onClick={onClose} className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-clinical-200 text-clinical-400 hover:text-rose-600 transition-all">
              <X className="h-5 w-5" />
            </button>
          </header>

          {/* Form Body */}
          <main className="p-8 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
            <div className="grid grid-cols-2 gap-6">
              <SelectField 
                label="Tipo de Consulta" 
                value={formData.type} 
                onChange={v => handleInputChange('type', v)}
                options={['Consulta Ginecología', 'Control Prenatal', 'Emergencia', 'Seguimiento', 'Post-Operatorio']}
              />
              <InputField 
                label="Fecha de Consulta" 
                type="date" 
                value={formData.date} 
                onChange={v => handleInputChange('date', v)} 
                icon={<Calendar className="h-4 w-4" />}
              />
            </div>

            <div className="grid grid-cols-2 gap-6 p-6 bg-clinical-50/50 rounded-3xl border border-clinical-100">
              <InputField 
                label="Presión Arterial" 
                value={formData.pressure} 
                onChange={v => handleInputChange('pressure', v)} 
                placeholder="Ej. 120/80"
                icon={<Activity className="h-4 w-4 text-emerald-500" />}
              />
              <InputField 
                label="Peso (kg)" 
                value={formData.weight} 
                onChange={v => handleInputChange('weight', v)} 
                placeholder="Ej. 65"
                icon={<Calendar className="h-4 w-4 text-amber-500" />}
              />
            </div>

            <TextAreaField 
              label="Motivo de Consulta" 
              value={formData.reason} 
              onChange={v => handleInputChange('reason', v)} 
              placeholder="Describa el motivo de la visita..."
            />

            <TextAreaField 
              label="Diagnóstico / Evolución" 
              value={formData.diagnosis} 
              onChange={v => handleInputChange('diagnosis', v)} 
              placeholder="Resultados del examen físico y diagnóstico..."
              rows={5}
              required
            />

            <SelectField 
              label="Médico Tratante" 
              value={formData.doctor} 
              onChange={v => handleInputChange('doctor', v)} 
              options={doctors}
            />
          </main>

          {/* Footer */}
          <footer className="px-8 py-6 border-t border-clinical-100 bg-clinical-50/50 flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={onClose} disabled={isSaving} className="px-6 rounded-2xl">
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              className="px-8 rounded-2xl shadow-xl shadow-primary-200 min-w-[140px]" 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Registrar Consulta
            </Button>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

/* Internal Helpers */

function InputField({ label, value, onChange, placeholder, type = 'text', icon, required }: any) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black uppercase tracking-widest text-clinical-500 px-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-clinical-300">{icon}</div>}
        <input 
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full h-12 rounded-2xl border border-clinical-200 bg-white px-5 text-sm font-bold text-clinical-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10",
            icon && "pl-11"
          )}
        />
      </div>
    </div>
  )
}

function TextAreaField({ label, value, onChange, placeholder, rows = 3, required }: any) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black uppercase tracking-widest text-clinical-500 px-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <textarea 
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-2xl border border-clinical-200 bg-white p-5 text-sm font-bold text-clinical-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 resize-none"
      />
    </div>
  )
}

function SelectField({ label, value, onChange, options }: any) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black uppercase tracking-widest text-clinical-500 px-1">{label}</label>
      <select 
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-12 rounded-2xl border border-clinical-200 bg-white px-5 text-sm font-black text-clinical-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 appearance-none"
      >
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  )
}
