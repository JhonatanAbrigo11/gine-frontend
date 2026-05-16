import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  User, 
  Phone, 
  Stethoscope, 
  Heart, 
  Settings,
  Plus,
  Camera,
  Calendar,
  AlertCircle,
  Activity,
  MapPin,
  Save,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/widgets/button'

type NewPatientModalProps = {
  isOpen: boolean
  onClose: () => void
}

const SECTIONS = [
  { id: 'personales', title: 'Datos Personales', icon: User },
  { id: 'contacto', title: 'Contacto', icon: Phone },
  { id: 'medicos', title: 'Médicos Básicos', icon: Stethoscope },
  { id: 'ginecologicos', title: 'Ginecología', icon: Heart },
  { id: 'sistema', title: 'Sistema', icon: Settings },
]

export function NewPatientModal({ isOpen, onClose }: NewPatientModalProps) {
  const [activeSection, setActiveSection] = useState(0)
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    fechaNacimiento: '',
    edad: '',
    estadoCivil: 'Soltera',
    ocupacion: '',
    foto: null,
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    contactoEmergencia: '',
    telefonoEmergencia: '',
    tipoSanguineo: '',
    alergias: '',
    antecedentes: '',
    seguroMedico: '',
    menarquia: '',
    metodoAnticonceptivo: '',
    vidaSexualActiva: 'No',
    gestas: '0',
    partos: '0',
    cesareas: '0',
    abortos: '0',
    fechaRegistro: new Date().toISOString().split('T')[0],
    observaciones: '',
  })

  // Calcular edad automáticamente
  useEffect(() => {
    if (formData.fechaNacimiento) {
      const birthDate = new Date(formData.fechaNacimiento)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      setFormData(prev => ({ ...prev, edad: age.toString() }))
    }
  }, [formData.fechaNacimiento])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextSection = () => {
    if (activeSection < SECTIONS.length - 1) setActiveSection(prev => prev + 1)
  }

  const prevSection = () => {
    if (activeSection > 0) setActiveSection(prev => prev - 1)
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
          className="relative w-full max-w-5xl h-[90vh] flex flex-col bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <header className="flex items-center justify-between px-8 py-6 border-b border-clinical-100 bg-clinical-50/50">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-2 w-8 bg-primary-600 rounded-full" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-700/70">Registro Clínico</span>
              </div>
              <h2 className="text-2xl font-bold text-clinical-900 tracking-tight">
                Nueva <span className="text-primary-700">Paciente</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-clinical-200 text-clinical-400 hover:text-rose-600 transition-all hover:shadow-md"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-clinical-100 bg-clinical-50/30 p-6 flex flex-col gap-2">
              {SECTIONS.map((section, index) => {
                const Icon = section.icon
                const isActive = activeSection === index
                const isCompleted = activeSection > index

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(index)}
                    className={cn(
                      "group flex items-center gap-3 p-3 rounded-2xl text-sm font-bold transition-all duration-200",
                      isActive 
                        ? "bg-white text-primary-700 shadow-md ring-1 ring-primary-100" 
                        : isCompleted
                          ? "text-clinical-800/40 hover:bg-white hover:text-primary-600"
                          : "text-clinical-800/40 hover:bg-white hover:text-clinical-800"
                    )}
                  >
                    <div className={cn(
                      "h-8 w-8 rounded-xl flex items-center justify-center transition-all",
                      isActive ? "bg-primary-600 text-white shadow-lg shadow-primary-200" : "bg-clinical-100 text-clinical-400"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="truncate">{section.title}</span>
                  </button>
                )
              })}
              
              <div className="mt-auto p-4 rounded-2xl bg-primary-50 border border-primary-100/50">
                 <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-primary-600" />
                    <span className="text-[10px] font-bold uppercase text-primary-900">Progreso</span>
                 </div>
                 <div className="h-1.5 w-full bg-primary-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${((activeSection + 1) / SECTIONS.length) * 100}%` }}
                    />
                 </div>
              </div>
            </aside>

            {/* Form Content */}
            <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  {activeSection === 0 && (
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2 flex items-center gap-6 mb-4">
                        <div className="relative group">
                          <div className="h-24 w-24 rounded-3xl bg-clinical-100 flex items-center justify-center border-2 border-dashed border-clinical-300 text-clinical-400 group-hover:border-primary-400 transition-all cursor-pointer">
                            <Camera className="h-8 w-8" />
                          </div>
                          <button className="absolute -bottom-2 -right-2 h-8 w-8 bg-primary-600 text-white rounded-xl shadow-lg flex items-center justify-center border-2 border-white">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-clinical-900">Foto de Perfil</h3>
                          <p className="text-xs text-clinical-800/50">Opcional. Formatos aceptados: JPG, PNG.</p>
                        </div>
                      </div>
                      
                      <InputField label="Nombres" value={formData.nombres} onChange={v => handleInputChange('nombres', v)} placeholder="Ej. Ana María" />
                      <InputField label="Apellidos" value={formData.apellidos} onChange={v => handleInputChange('apellidos', v)} placeholder="Ej. García López" />
                      
                      <SelectField 
                        label="Tipo de Documento" 
                        value={formData.tipoDocumento} 
                        onChange={v => handleInputChange('tipoDocumento', v)}
                        options={['DNI', 'Cédula', 'Pasaporte', 'Carnet Extr.']}
                      />
                      <InputField label="Número de Documento" value={formData.numeroDocumento} onChange={v => handleInputChange('numeroDocumento', v)} placeholder="00000000" />
                      
                      <InputField label="Fecha de Nacimiento" type="date" value={formData.fechaNacimiento} onChange={v => handleInputChange('fechaNacimiento', v)} />
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-clinical-900/60 px-1">Edad</label>
                        <div className="h-12 flex items-center px-5 rounded-2xl bg-clinical-50 border border-clinical-200 text-sm font-bold text-primary-700">
                          {formData.edad || '—'} años
                        </div>
                      </div>

                      <SelectField 
                        label="Estado Civil" 
                        value={formData.estadoCivil} 
                        onChange={v => handleInputChange('estadoCivil', v)}
                        options={['Soltera', 'Casada', 'Divorciada', 'Viuda', 'Unión Libre']}
                      />
                      <InputField label="Ocupación" value={formData.ocupacion} onChange={v => handleInputChange('ocupacion', v)} placeholder="Ej. Contadora" />
                    </div>
                  )}

                  {activeSection === 1 && (
                    <div className="grid grid-cols-2 gap-6">
                      <InputField label="Teléfono" value={formData.telefono} onChange={v => handleInputChange('telefono', v)} placeholder="+00 000 000 000" icon={<Phone className="h-4 w-4" />} />
                      <InputField label="Correo Electrónico" value={formData.email} onChange={v => handleInputChange('email', v)} placeholder="paciente@ejemplo.com" />
                      <InputField label="Dirección" className="col-span-2" value={formData.direccion} onChange={v => handleInputChange('direccion', v)} placeholder="Av. Siempre Viva 123" icon={<MapPin className="h-4 w-4" />} />
                      <InputField label="Ciudad" value={formData.ciudad} onChange={v => handleInputChange('ciudad', v)} placeholder="Ej. Madrid" />
                      
                      <div className="col-span-2 py-4 border-t border-clinical-100 mt-4">
                        <h3 className="text-sm font-bold text-clinical-900 uppercase tracking-widest mb-4">Contacto de Emergencia</h3>
                        <div className="grid grid-cols-2 gap-6">
                          <InputField label="Nombre de Contacto" value={formData.contactoEmergencia} onChange={v => handleInputChange('contactoEmergencia', v)} placeholder="Ej. Juan Pérez" />
                          <InputField label="Teléfono de Emergencia" value={formData.telefonoEmergencia} onChange={v => handleInputChange('telefonoEmergencia', v)} placeholder="+00 000 000 000" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 2 && (
                    <div className="grid grid-cols-2 gap-6">
                      <SelectField 
                        label="Tipo Sanguíneo" 
                        value={formData.tipoSanguineo} 
                        onChange={v => handleInputChange('tipoSanguineo', v)}
                        options={['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']}
                      />
                      <InputField label="Seguro Médico" value={formData.seguroMedico} onChange={v => handleInputChange('seguroMedico', v)} placeholder="Nombre de aseguradora" />
                      <TextAreaField label="Alergias" className="col-span-2" value={formData.alergias} onChange={v => handleInputChange('alergias', v)} placeholder="Describa alergias conocidas..." />
                      <TextAreaField label="Antecedentes Importantes" className="col-span-2" value={formData.antecedentes} onChange={v => handleInputChange('antecedentes', v)} placeholder="Antecedentes familiares, cirugías, etc." />
                    </div>
                  )}

                  {activeSection === 3 && (
                    <div className="grid grid-cols-2 gap-6">
                      <InputField label="Menarquia (Edad)" value={formData.menarquia} onChange={v => handleInputChange('menarquia', v)} placeholder="Ej. 12" />
                      <InputField label="Método Anticonceptivo" value={formData.metodoAnticonceptivo} onChange={v => handleInputChange('metodoAnticonceptivo', v)} placeholder="Ej. DIU, Pastillas..." />
                      <SelectField 
                        label="Vida Sexual Activa" 
                        value={formData.vidaSexualActiva} 
                        onChange={v => handleInputChange('vidaSexualActiva', v)}
                        options={['Sí', 'No']}
                      />
                      <div className="grid grid-cols-4 gap-4 col-span-2 py-4 bg-clinical-50 rounded-3xl p-6 border border-clinical-100">
                        <CounterField label="Gestas" value={formData.gestas} onChange={v => handleInputChange('gestas', v)} />
                        <CounterField label="Partos" value={formData.partos} onChange={v => handleInputChange('partos', v)} />
                        <CounterField label="Cesáreas" value={formData.cesareas} onChange={v => handleInputChange('cesareas', v)} />
                        <CounterField label="Abortos" value={formData.abortos} onChange={v => handleInputChange('abortos', v)} />
                      </div>
                    </div>
                  )}

                  {activeSection === 4 && (
                    <div className="grid grid-cols-2 gap-6">
                      <InputField label="Fecha de Registro" type="date" value={formData.fechaRegistro} onChange={v => handleInputChange('fechaRegistro', v)} />
                      <TextAreaField label="Observaciones Generales" className="col-span-2" value={formData.observaciones} onChange={v => handleInputChange('observaciones', v)} placeholder="Notas adicionales del sistema..." />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>

          {/* Footer Controls */}
          <footer className="px-8 py-6 border-t border-clinical-100 bg-clinical-50/50 flex items-center justify-between">
            <Button 
              variant="secondary" 
              onClick={prevSection} 
              disabled={activeSection === 0}
              className="px-6 rounded-2xl"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            
            <div className="flex gap-3">
              <Button variant="ghost" onClick={onClose} className="px-6 rounded-2xl text-clinical-400">
                Cancelar
              </Button>
              {activeSection === SECTIONS.length - 1 ? (
                <Button variant="primary" className="px-8 rounded-2xl shadow-xl shadow-primary-200" onClick={onClose}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Paciente
                </Button>
              ) : (
                <Button variant="primary" className="px-8 rounded-2xl shadow-xl shadow-primary-200" onClick={nextSection}>
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

/* Helper Components */

function InputField({ label, value, onChange, placeholder, type = 'text', className, icon }: any) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-xs font-bold uppercase tracking-widest text-clinical-900/60 px-1">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-clinical-400">
            {icon}
          </div>
        )}
        <input 
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full h-12 rounded-2xl border border-clinical-200 bg-white px-5 text-sm font-medium text-clinical-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10",
            icon && "pl-11"
          )}
        />
      </div>
    </div>
  )
}

function TextAreaField({ label, value, onChange, placeholder, className }: any) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-xs font-bold uppercase tracking-widest text-clinical-900/60 px-1">{label}</label>
      <textarea 
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-2xl border border-clinical-200 bg-white p-5 text-sm font-medium text-clinical-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 resize-none"
      />
    </div>
  )
}

function SelectField({ label, value, onChange, options, className }: any) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-xs font-bold uppercase tracking-widest text-clinical-900/60 px-1">{label}</label>
      <select 
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-12 rounded-2xl border border-clinical-200 bg-white px-5 text-sm font-bold text-clinical-900 outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 appearance-none"
      >
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  )
}

function CounterField({ label, value, onChange }: any) {
  const increment = () => onChange((parseInt(value) + 1).toString())
  const decrement = () => onChange(Math.max(0, parseInt(value) - 1).toString())

  return (
    <div className="space-y-2 flex flex-col items-center">
      <label className="block text-[10px] font-bold uppercase tracking-widest text-clinical-900/40">{label}</label>
      <div className="flex items-center gap-3">
        <button onClick={decrement} className="h-8 w-8 rounded-lg bg-white border border-clinical-200 flex items-center justify-center text-clinical-400 hover:text-primary-600 hover:border-primary-200 transition-all shadow-sm">-</button>
        <span className="text-lg font-bold text-clinical-900 w-6 text-center">{value}</span>
        <button onClick={increment} className="h-8 w-8 rounded-lg bg-white border border-clinical-200 flex items-center justify-center text-clinical-400 hover:text-primary-600 hover:border-primary-200 transition-all shadow-sm">+</button>
      </div>
    </div>
  )
}
