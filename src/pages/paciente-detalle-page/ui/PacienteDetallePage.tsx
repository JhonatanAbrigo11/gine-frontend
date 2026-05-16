import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  User, 
  FileText, 
  Clock, 
  Pill, 
  Activity, 
  Image as ImageIcon, 
  FileUp, 
  Download,
  Eye,
  Calendar,
  AlertCircle,
  Stethoscope,
  Baby,
  FlaskConical,
  Phone,
  Mail,
  MapPin,
  MoreHorizontal,
  Plus,
  ChevronRight,
  Hash
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/widgets/button'

/* ==================================================
   MOCK DATA
   ================================================== */

const PATIENT_DATA = {
  id: '1',
  name: 'Ana García López',
  cedula: '1723456789',
  hc: '2026-001',
  age: 28,
  birthDate: '15/05/1998',
  email: 'ana.garcia@email.com',
  phone: '+593 987 654 321',
  address: 'Av. Gran Colombia y 12 de Octubre, Quito',
  blood: 'O+',
  risk: 'Bajo',
  gpac: 'G1 P0 A0 C0',
  fum: '12 Abr 2026',
  fpp: '17 Ene 2027',
  alergias: 'Penicilina, AINES',
  antecedentes: 'Hipotiroidismo controlado',
}

const CONSULTATIONS_TIMELINE = [
  { date: '10 May 2026', type: 'Control Prenatal', doctor: 'Dra. Ana García', diagnosis: 'Embarazo 4 semanas, normoevolutivo.', weight: '64.5kg', bp: '120/80' },
  { date: '15 Abr 2026', type: 'Consulta Ginecología', doctor: 'Dra. Ana García', diagnosis: 'Confirmación de embarazo vía test HCG.', weight: '63.8kg', bp: '115/75' },
]

const PRESCRIPTIONS = [
  { id: 'REC-001', date: '10 May 2026', medicines: ['Ácido Fólico 5mg', 'Hierro Plus'], status: 'Activa' },
  { id: 'REC-002', date: '15 Abr 2026', medicines: ['Progesterona 200mg'], status: 'Finalizada' },
]

const DOCUMENTS = [
  { id: 'DOC-001', name: 'Ecografía Primer Trimestre.pdf', category: 'Ecografía', date: '10 May 2026', size: '2.4 MB' },
  { id: 'DOC-002', name: 'Hemograma Completo.pdf', category: 'Laboratorio', date: '12 May 2026', size: '1.1 MB' },
  { id: 'IMG-001', name: 'Captura Doppler.jpg', category: 'Imagenología', date: '10 May 2026', size: '4.5 MB' },
]

import { pacienteService } from '@/entities/paciente/api/paciente.service'
import type { Patient } from '@/entities/paciente/model/types'
import { useToast } from '@/shared/ui/ToastContext'
import { Loader2 } from 'lucide-react'

export const PacienteDetallePage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  
  const [activeTab, setActiveTab] = useState('historial')
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchPatient = async () => {
    if (!id) return
    try {
      setLoading(true)
      const data = await pacienteService.getById(id)
      setPatient(data)
    } catch (error) {
      showToast('Error al cargar la información de la paciente', 'error')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchPatient()
  }, [id])

  const tabs = [
    { id: 'datos', label: 'Datos Personales', icon: <User className="h-4 w-4" /> },
    { id: 'historial', label: 'Ficha Clínica', icon: <FileText className="h-4 w-4" /> },
    { id: 'citas', label: 'Citas', icon: <Calendar className="h-4 w-4" /> },
    { id: 'recetas', label: 'Recetas', icon: <Pill className="h-4 w-4" /> },
    { id: 'prenatal', label: 'Control Prenatal', icon: <Baby className="h-4 w-4" /> },
    { id: 'documentos', label: 'Documentos', icon: <FlaskConical className="h-4 w-4" /> },
  ]

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-clinical-50">
        <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-clinical-50 gap-4">
        <AlertCircle className="h-12 w-12 text-rose-500" />
        <h2 className="text-xl font-bold text-clinical-900">Paciente no encontrada</h2>
        <Button onClick={() => navigate('/pacientes')}>Volver al listado</Button>
      </div>
    )
  }

  const patientRisk = 'Bajo' // Placeholder for logic
  const patientInitials = `${patient.nombres.charAt(0)}${patient.apellidos.charAt(0)}`

  return (
    <div className="min-h-dvh bg-clinical-50/50 pb-20">
      {/* Banner de Paciente */}
      <div className="bg-white border-b border-clinical-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-50/30 skew-x-[-20deg] translate-x-20 pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 py-8 relative z-10">
           <button 
             onClick={() => navigate('/pacientes')}
             className="mb-6 flex items-center gap-2 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-widest"
           >
              <ChevronLeft className="h-4 w-4" /> Volver a Listado
           </button>

           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                 <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-[1.5rem] sm:rounded-[2rem] bg-primary-600 text-white flex items-center justify-center text-3xl sm:text-4xl font-bold shadow-2xl shadow-primary-200 ring-4 ring-white">
                    {patientInitials}
                 </div>
                 <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                       <h1 className="text-2xl sm:text-3xl font-black text-clinical-900 tracking-tight">{patient.nombres} {patient.apellidos}</h1>
                       <span className={cn(
                         "px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border",
                         patientRisk === 'Bajo' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                       )}>
                          Riesgo {patientRisk}
                       </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] sm:text-[11px] font-bold text-clinical-500 uppercase tracking-widest">
                       <span className="flex items-center gap-1.5"><Hash className="h-3.5 w-3.5" /> ID: {patient.numeroDocumento}</span>
                       <span className="flex items-center gap-1.5 border-clinical-200 sm:border-l sm:pl-4"><Clock className="h-3.5 w-3.5" /> {patient.fechaNacimiento ? new Date().getFullYear() - new Date(patient.fechaNacimiento).getFullYear() : '—'} años</span>
                       <span className="flex items-center gap-1.5 border-clinical-200 sm:border-l sm:pl-4"><FileText className="h-3.5 w-3.5" /> HC: 2026-{patient.id.substring(0,3).toUpperCase()}</span>
                    </div>
                 </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                 {/* Botones de acción removidos */}
              </div>
           </div>
        </div>
      </div>


      <main className="mx-auto max-w-7xl px-6 mt-10">
        {/* Navegación por Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-white rounded-[2rem] shadow-premium border border-white mb-10 overflow-x-auto no-scrollbar">
           {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all",
                  activeTab === tab.id 
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-100" 
                    : "text-clinical-400 hover:text-primary-600 hover:bg-primary-50"
                )}
              >
                 {tab.icon} {tab.label}
              </button>
           ))}
        </div>

        {/* Contenido de Tabs */}
        <AnimatePresence mode="wait">
           <motion.div
             key={activeTab}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             transition={{ duration: 0.2 }}
           >
              {activeTab === 'datos' && <DatosPersonalesTab patient={patient} />}
              {activeTab === 'historial' && <HistorialClinicoTab patient={patient} />}
              {activeTab === 'citas' && <CitasTab patient={patient} />}
              {activeTab === 'recetas' && <RecetasTab patient={patient} />}
              {activeTab === 'prenatal' && <ControlPrenatalTab patient={patient} />}
              {activeTab === 'documentos' && <DocumentosTab patient={patient} />}
           </motion.div>
        </AnimatePresence>
      </main>

      {/* Modal removido */}
    </div>
  )
}

/* ==================================================
   TAB COMPONENTS
   ================================================== */

function DatosPersonalesTab({ patient }: { patient: Patient }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
       <div className="md:col-span-2 space-y-8">
          <div className="glass-card rounded-[2.5rem] p-8 border-white">
             <h3 className="text-sm font-bold text-clinical-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <User className="h-4 w-4 text-primary-600" /> Información de Perfil
             </h3>
             <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                <DataField label="Nombre Completo" value={`${patient.nombres} ${patient.apellidos}`} />
                <DataField label="Fecha de Nacimiento" value={patient.fechaNacimiento ? new Date(patient.fechaNacimiento).toLocaleDateString() : '—'} />
                <DataField label="Correo Electrónico" value={patient.email || '—'} icon={<Mail className="h-3.5 w-3.5" />} />
                <DataField label="Teléfono / WhatsApp" value={patient.telefono || '—'} icon={<Phone className="h-3.5 w-3.5" />} />
                <DataField label="Dirección Residencial" value={patient.direccion || '—'} icon={<MapPin className="h-3.5 w-3.5" />} className="col-span-2" />
             </div>
          </div>

          <div className="glass-card rounded-[2.5rem] p-8 border-white">
             <h3 className="text-sm font-bold text-clinical-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-600" /> Información Clínica Base
             </h3>
             <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                <DataField label="Tipo de Sangre" value={patient.tipoSanguineo || '—'} />
                <DataField label="Antecedentes Médicos" value={patient.antecedentes || '—'} />
                <DataField label="Alergias Conocidas" value={patient.alergias || '—'} danger />
             </div>
          </div>
       </div>

       <div className="space-y-8">
          <div className="glass-card rounded-[2.5rem] p-8 border-white shadow-premium">
             <h3 className="text-sm font-bold text-clinical-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Baby className="h-4 w-4 text-primary-600" /> Estado Obstétrico
             </h3>
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black text-clinical-400 uppercase tracking-widest">Paridad (G/P/A/C)</span>
                   <span className="text-sm font-black text-clinical-900">G{patient.gestas} P{patient.partos} A{patient.abortos} C{patient.cesareas}</span>
                </div>
                <div className="h-px bg-clinical-100/50" />
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black text-clinical-400 uppercase tracking-widest">F.U.M.</span>
                   <span className="text-sm font-black text-primary-600">No reg.</span>
                </div>
                <div className="h-px bg-clinical-100/50" />
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black text-clinical-400 uppercase tracking-widest">F.P.P. (Estimada)</span>
                   <span className="text-sm font-black text-emerald-600">No reg.</span>
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}

function HistorialClinicoTab({ patient }: { patient: Patient }) {
  const consultations = patient.consultations || []

  return (
    <div className="space-y-8 w-full">
       <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-clinical-900 tracking-tight">Línea de Tiempo de Consultas</h3>
          <Button variant="secondary" className="h-9 text-[10px] font-black uppercase tracking-widest px-4 border-clinical-200">
             Descargar Resumen
          </Button>
       </div>
       
       {consultations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-clinical-200">
             <Stethoscope className="h-12 w-12 text-clinical-200 mb-4" />
             <p className="text-clinical-400 font-bold uppercase tracking-widest text-xs">No hay consultas registradas aún</p>
          </div>
       ) : (
          <div className="space-y-0 relative before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-[3px] before:bg-clinical-100 before:rounded-full">
             {consultations.map((item: any, i: number) => (
                <div key={item.id} className="relative pl-16 pb-12 last:pb-0">
                   <div className="absolute left-0 h-12 w-12 rounded-2xl bg-white border-4 border-clinical-50 flex items-center justify-center text-primary-600 shadow-sm z-10">
                      <Stethoscope className="h-5 w-5" />
                   </div>
                   <div className="glass-card rounded-[2.5rem] p-8 border-white hover:shadow-xl transition-all group">
                      <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-xl bg-primary-50 text-primary-700 text-[10px] font-black uppercase tracking-widest border border-primary-100">
                              {new Date(item.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <h4 className="text-lg font-black text-clinical-900">{item.type}</h4>
                         </div>
                         <button className="h-9 w-9 rounded-xl flex items-center justify-center text-clinical-300 hover:bg-clinical-50 hover:text-clinical-900 transition-all">
                            <MoreHorizontal className="h-5 w-5" />
                         </button>
                      </div>
                      <div className="bg-clinical-50/50 rounded-2xl p-6 border border-clinical-100 mb-6">
                         <p className="text-sm font-medium text-clinical-800 leading-relaxed italic">"{item.diagnosis || 'Sin diagnóstico registrado'}"</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-8">
                         <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-emerald-500" />
                            <span className="text-[11px] font-bold text-clinical-400 uppercase tracking-widest">Presión:</span>
                            <span className="text-xs font-black text-clinical-900">{item.pressure || '—'}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-amber-500" />
                            <span className="text-[11px] font-bold text-clinical-400 uppercase tracking-widest">Peso:</span>
                            <span className="text-xs font-black text-clinical-900">{item.weight || '—'}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary-500" />
                            <span className="text-[11px] font-bold text-clinical-400 uppercase tracking-widest">Doctor:</span>
                            <span className="text-xs font-black text-clinical-900">{item.doctor || '—'}</span>
                         </div>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       )}
    </div>
  )
}

function RecetasTab({ patient }: { patient: Patient }) {
  // Aquí luego cargaremos las recetas reales relacionadas al paciente
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       {PRESCRIPTIONS.map((receta, i) => (
          <div key={i} className="glass-card rounded-[2.5rem] p-8 border-white hover:shadow-xl transition-all">
             <div className="flex items-center justify-between mb-6">
                <div>
                   <span className="text-[10px] font-black text-clinical-300 uppercase tracking-widest">{receta.id} • {receta.date}</span>
                   <h4 className="text-lg font-black text-clinical-900 mt-0.5">Receta Médica</h4>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                  receta.status === 'Activa' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-clinical-50 text-clinical-400 border-clinical-100"
                )}>
                   {receta.status}
                </span>
             </div>
             <div className="space-y-3">
                {receta.medicines.map((med, j) => (
                   <div key={j} className="flex items-center gap-3 p-4 rounded-2xl bg-clinical-50/50 border border-clinical-100">
                      <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-primary-600 shadow-sm"><Pill className="h-4 w-4" /></div>
                      <span className="text-sm font-bold text-clinical-800">{med}</span>
                   </div>
                ))}
             </div>
             <div className="flex items-center gap-3 mt-8 pt-6 border-t border-clinical-100">
                <Button variant="secondary" className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest border-clinical-200">
                   <Download className="h-4 w-4 mr-2" /> Descargar PDF
                </Button>
                <Button variant="secondary" className="h-10 w-10 p-0 rounded-xl border-clinical-200 text-clinical-400">
                   <Eye className="h-5 w-5" />
                </Button>
             </div>
          </div>
       ))}
    </div>
  )
}

function ControlPrenatalTab({ patient }: { patient: Patient }) {
  return (
    <div className="space-y-8">
       <div className="bg-white rounded-[3rem] p-10 border border-clinical-100 shadow-premium relative overflow-hidden mb-10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-50/20 skew-x-[-15deg] translate-x-20" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="h-12 w-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600"><Baby className="h-8 w-8" /></div>
                   <h3 className="text-3xl font-black text-clinical-900 tracking-tight">Monitoreo Gestacional</h3>
                </div>
                <p className="text-clinical-500 max-w-md font-medium text-lg leading-relaxed">Actualmente en la semana <span className="text-primary-600 font-black">4 de gestación</span>. El desarrollo fetal se encuentra dentro de los parámetros normales.</p>
             </div>
             <div className="flex gap-4">
                <div className="px-8 py-5 bg-clinical-50 rounded-[2rem] border border-clinical-100 text-center min-w-[140px] shadow-inner">
                   <p className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-2">Semana</p>
                   <p className="text-3xl font-black text-clinical-900">04</p>
                </div>
                <div className="px-8 py-5 bg-clinical-50 rounded-[2rem] border border-clinical-100 text-center min-w-[140px] shadow-inner">
                   <p className="text-[10px] font-black text-clinical-400 uppercase tracking-widest mb-2">Días</p>
                   <p className="text-3xl font-black text-primary-600">28</p>
                </div>
             </div>
          </div>
       </div>

       <div className="w-full">
          <h3 className="text-lg font-bold text-clinical-900 mb-8 tracking-tight">Timeline de Evolución Prenatal</h3>
          <div className="space-y-0 relative before:absolute before:left-[23px] before:top-4 before:bottom-4 before:w-[3px] before:bg-clinical-100 before:rounded-full">
             {[
               { sem: '4', date: '10 May 2026', obs: 'Saco gestacional visible. Latido ausente por edad gestacional.', symp: 'Náuseas leves, fatiga' },
               { sem: '2', date: '15 Abr 2026', obs: 'Confirmación de embarazo. Se inicia suplementación.', symp: 'Retraso menstrual' },
             ].map((visit, i) => (
                <div key={i} className="relative pl-16 pb-12 last:pb-0">
                   <div className="absolute left-0 h-12 w-12 rounded-2xl bg-accent-50 border-4 border-white flex items-center justify-center text-accent-600 shadow-sm z-10">
                      <Baby className="h-5 w-5" />
                   </div>
                   <div className="glass-card rounded-[2.5rem] p-8 border-white">
                      <div className="flex items-center justify-between mb-4">
                         <h4 className="text-lg font-black text-clinical-900">Semana {visit.sem} de Gestación</h4>
                         <span className="text-[10px] font-black text-clinical-300 uppercase tracking-widest">{visit.date}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="p-5 rounded-2xl bg-clinical-50/50 border border-clinical-100">
                            <p className="text-[9px] font-black text-clinical-400 uppercase tracking-widest mb-2">Hallazgos & Observaciones</p>
                            <p className="text-xs font-bold text-clinical-800 italic">"{visit.obs}"</p>
                         </div>
                         <div className="p-5 rounded-2xl bg-rose-50/30 border border-rose-100/50">
                            <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-2">Síntomas Reportados</p>
                            <p className="text-xs font-bold text-rose-700">{visit.symp}</p>
                         </div>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  )
}

function DocumentosTab({ patient }: { patient: Patient }) {
  const categories = ['Laboratorio', 'Ecografía', 'Imagenología']
  
  return (
    <div className="space-y-10">
       {categories.map(cat => (
          <section key={cat}>
             <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 rounded-xl bg-white border border-clinical-100 shadow-sm flex items-center justify-center text-primary-600">
                   {cat === 'Laboratorio' ? <FlaskConical className="h-5 w-5" /> : 
                    cat === 'Ecografía' ? <Activity className="h-5 w-5" /> : 
                    <ImageIcon className="h-5 w-5" />}
                </div>
                <h3 className="text-lg font-bold text-clinical-900 tracking-tight">{cat}</h3>
                <div className="h-px flex-1 bg-clinical-100" />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DOCUMENTS.filter(doc => doc.category === cat).map(doc => (
                   <div key={doc.id} className="glass-card rounded-[2.5rem] p-6 border-white hover:border-primary-100 hover:shadow-xl transition-all group">
                      <div className="flex items-start justify-between mb-4">
                         <div className="h-12 w-12 rounded-2xl bg-clinical-50 text-clinical-300 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                            <FileText className="h-6 w-6" />
                         </div>
                         <div className="flex gap-1">
                            <button className="h-9 w-9 rounded-xl bg-white border border-clinical-100 text-clinical-400 flex items-center justify-center hover:bg-primary-50 hover:text-primary-600 transition-all"><Eye className="h-4 w-4" /></button>
                            <button className="h-9 w-9 rounded-xl bg-white border border-clinical-100 text-clinical-400 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-all"><Download className="h-4 w-4" /></button>
                         </div>
                      </div>
                      <h4 className="text-sm font-bold text-clinical-900 mb-1 truncate">{doc.name}</h4>
                      <div className="flex items-center justify-between text-[10px] font-bold text-clinical-400 uppercase tracking-widest mt-4">
                         <span>{doc.date}</span>
                         <span className="px-2 py-0.5 rounded-lg bg-clinical-50">{doc.size}</span>
                      </div>
                   </div>
                ))}
                
                {/* Empty State / Add Placeholder */}
                <button className="rounded-[2.5rem] border-2 border-dashed border-clinical-100 p-6 flex flex-col items-center justify-center text-clinical-300 hover:border-primary-300 hover:text-primary-600 transition-all bg-white/10 group">
                   <div className="h-10 w-10 rounded-full border-2 border-dashed border-clinical-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Plus className="h-5 w-5" /></div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Añadir {cat}</span>
                </button>
             </div>
          </section>
       ))}
    </div>
  )
}

function CitasTab({ patient }: { patient: Patient }) {
  const CITAS = [
    { id: 1, fecha: '12 Jun 2026', hora: '10:30', tipo: 'Control Prenatal', doctor: 'Dr. Marco Rivera', estado: 'Programada' },
    { id: 2, fecha: '15 May 2026', hora: '09:00', tipo: 'Ginecología', doctor: 'Dr. Marco Rivera', estado: 'Completada' },
    { id: 3, fecha: '20 Abr 2026', hora: '11:15', tipo: 'Control Prenatal', doctor: 'Dr. Marco Rivera', estado: 'Completada' },
  ]

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-clinical-900 tracking-tight">Historial de Citas</h2>
          <Button variant="primary" className="rounded-xl h-10 px-6 text-xs shadow-lg shadow-primary-200">
             <Plus className="h-4 w-4 mr-2" /> Agendar Cita
          </Button>
       </div>

       <div className="grid gap-4">
          {CITAS.map((cita) => (
             <div key={cita.id} className="glass-card rounded-[2rem] p-6 border-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-xl transition-all group">
                <div className="flex items-center gap-6">
                   <div className={cn(
                      "h-16 w-16 rounded-2xl flex flex-col items-center justify-center border transition-transform group-hover:scale-105",
                      cita.estado === 'Programada' ? "bg-primary-50 border-primary-100 text-primary-700" : "bg-clinical-50 border-clinical-100 text-clinical-400"
                   )}>
                      <span className="text-[10px] font-black uppercase tracking-tighter">{cita.fecha.split(' ')[1]}</span>
                      <span className="text-xl font-black leading-none">{cita.fecha.split(' ')[0]}</span>
                   </div>
                   <div>
                      <h3 className="text-base font-bold text-clinical-900 mb-1">{cita.tipo}</h3>
                      <p className="text-[11px] font-bold text-clinical-500 uppercase tracking-widest flex items-center gap-2">
                         <Clock className="h-3.5 w-3.5 text-primary-400" /> {cita.hora} • {cita.doctor}
                      </p>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                   <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      cita.estado === 'Programada' ? "bg-primary-50 text-primary-600 border-primary-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                   )}>
                      {cita.estado}
                   </span>
                   <button className="h-10 w-10 rounded-xl bg-clinical-50 text-clinical-400 flex items-center justify-center hover:bg-white hover:text-primary-600 hover:shadow-md transition-all border border-transparent hover:border-clinical-100">
                      <ChevronRight className="h-5 w-5" />
                   </button>
                </div>
             </div>
          ))}
       </div>
    </div>
  )
}

function DataField({ label, value, icon, className, danger }: any) {
  return (
    <div className={cn("space-y-2", className)}>
       <p className="text-[10px] font-black text-clinical-400 uppercase tracking-widest flex items-center gap-2">
          {icon} {label}
       </p>
       <p className={cn(
         "text-sm font-bold",
         danger ? "text-rose-600" : "text-clinical-900"
       )}>{value}</p>
    </div>
  )
}
