import { useEffect, useState } from 'react'
import { Pill, Shield, Award, MapPin, AlertTriangle, Calendar, Image as ImageIcon, Building2, AlignLeft, PhoneCall, Check } from 'lucide-react'
import { toast } from 'sonner'
import { ConfigBlock, ConfigCanvas, ConfigImageUpload } from '@/features/site-config/ui/molecules/config-editor-primitives'
import { Button } from '@/widgets/button'
import { useBusinessSettings } from '@/features/site-config/model/use-business-settings'

interface RecipeSettings {
  clinicName: string
  clinicSubtitle: string
  clinicAddress: string
  clinicPhone: string
  doctorName: string
  doctorSpecialty: string
  doctorAcess: string
  defaultCity: string
  defaultAllergies: string
  defaultValidityDays: string
  logoUrl: string
}

const DEFAULT_SETTINGS: RecipeSettings = {
  clinicName: 'GineCentro Premium',
  clinicSubtitle: 'Ginecología y Obstetricia de Alta Especialidad',
  clinicAddress: 'Quito, Ecuador • Av. Amazonas N34-45',
  clinicPhone: 'Tel: (02) 2555-000',
  doctorName: 'Dra. Ana García',
  doctorSpecialty: 'Ginecología y Obstetricia',
  doctorAcess: '7456-2026',
  defaultCity: 'Quito',
  defaultAllergies: 'Ninguna conocida',
  defaultValidityDays: '3',
  logoUrl: ''
}

type ClinicalRecipesSectionEditorProps = {
  baseId: string
}

export function ClinicalRecipesSectionEditor({ baseId }: ClinicalRecipesSectionEditorProps) {
  const { settings: dbSettings, updateSettings } = useBusinessSettings()
  const [settings, setSettings] = useState<RecipeSettings>(DEFAULT_SETTINGS)
  const [saving, setSaving] = useState(false)

  // Load from backend dbSettings when available
  useEffect(() => {
    if (dbSettings) {
      setSettings({
        clinicName: dbSettings.clinicName || DEFAULT_SETTINGS.clinicName,
        clinicSubtitle: dbSettings.reportHeader || DEFAULT_SETTINGS.clinicSubtitle,
        clinicAddress: dbSettings.address || DEFAULT_SETTINGS.clinicAddress,
        clinicPhone: dbSettings.phone || DEFAULT_SETTINGS.clinicPhone,
        doctorName: dbSettings.recipeDoctorName || DEFAULT_SETTINGS.doctorName,
        doctorSpecialty: dbSettings.recipeDoctorSpecialty || DEFAULT_SETTINGS.doctorSpecialty,
        doctorAcess: dbSettings.recipeDoctorAcess || DEFAULT_SETTINGS.doctorAcess,
        defaultCity: dbSettings.recipeDefaultCity || DEFAULT_SETTINGS.defaultCity,
        defaultAllergies: dbSettings.recipeDefaultAllergies || DEFAULT_SETTINGS.defaultAllergies,
        defaultValidityDays: dbSettings.recipeDefaultValidityDays || DEFAULT_SETTINGS.defaultValidityDays,
        logoUrl: dbSettings.recipeLogoUrl || ''
      })
    }
  }, [dbSettings])

  const handleChange = (key: keyof RecipeSettings, val: string) => {
    setSettings(prev => ({ ...prev, [key]: val }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateSettings({
        clinicName: settings.clinicName,
        reportHeader: settings.clinicSubtitle,
        address: settings.clinicAddress,
        phone: settings.clinicPhone,
        recipeDoctorName: settings.doctorName,
        recipeDoctorSpecialty: settings.doctorSpecialty,
        recipeDoctorAcess: settings.doctorAcess,
        recipeDefaultCity: settings.defaultCity,
        recipeDefaultAllergies: settings.defaultAllergies,
        recipeDefaultValidityDays: settings.defaultValidityDays,
        recipeLogoUrl: settings.logoUrl || null
      })
      toast.success('Configuración de recetas guardada correctamente')
    } catch (e) {
      toast.error('Error al conectar con el servidor')
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <ConfigCanvas>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Formulario de Configuración */}
        <div className="lg:col-span-6 space-y-6">
          {/* Logo y Encabezado */}
          <ConfigBlock className="p-6 rounded-2xl bg-white border border-clinical-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-clinical-100 pb-3">
              <ImageIcon className="h-5 w-5 text-primary-600" />
              <h3 className="text-sm font-black text-clinical-900 uppercase tracking-widest">Logo Impreso y Marca de Agua</h3>
            </div>
            
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
              <ConfigImageUpload
                fileInputId={`${baseId}-recipe-logo`}
                value={settings.logoUrl}
                onChange={(v) => handleChange('logoUrl', v || '')}
                variant="logo"
                label="Logo Receta"
              />
              <div className="space-y-2">
                <p className="text-xs font-black text-clinical-800 uppercase tracking-wider">Dimensiones: 1:1 sugeridas</p>
                <p className="text-[11px] leading-normal text-clinical-450 font-medium">
                  Este logotipo se imprimirá en el extremo superior izquierdo de ambas columnas (RP e Indicaciones) y se renderizará de forma sutil en el fondo de la receta como una elegante marca de agua de baja opacidad.
                </p>
              </div>
            </div>
          </ConfigBlock>

          {/* Información del Centro Médico */}
          <ConfigBlock className="p-6 rounded-2xl bg-white border border-clinical-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-clinical-100 pb-3">
              <Building2 className="h-5 w-5 text-primary-600" />
              <h3 className="text-sm font-black text-clinical-900 uppercase tracking-widest">Encabezado del Centro Médico</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                  Nombre del Centro Médico
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-clinical-300" />
                  <input
                    type="text"
                    value={settings.clinicName}
                    onChange={(e) => handleChange('clinicName', e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                    placeholder="Ej: GineCentro Premium"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                  Subtítulo de Especialidad del Centro
                </label>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-clinical-300" />
                  <input
                    type="text"
                    value={settings.clinicSubtitle}
                    onChange={(e) => handleChange('clinicSubtitle', e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                    placeholder="Ej: Ginecología y Obstetricia de Alta Especialidad"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                  Dirección del Centro Médico
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-clinical-300" />
                  <input
                    type="text"
                    value={settings.clinicAddress}
                    onChange={(e) => handleChange('clinicAddress', e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                    placeholder="Ej: Quito, Ecuador • Av. Amazonas N34-45"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                  Teléfono e Información de Contacto
                </label>
                <div className="relative">
                  <PhoneCall className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-clinical-300" />
                  <input
                    type="text"
                    value={settings.clinicPhone}
                    onChange={(e) => handleChange('clinicPhone', e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                    placeholder="Ej: Tel: (02) 2555-000"
                  />
                </div>
              </div>
            </div>
          </ConfigBlock>

          {/* Profesional */}
          <ConfigBlock className="p-6 rounded-2xl bg-white border border-clinical-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-clinical-100 pb-3">
              <Award className="h-5 w-5 text-primary-600" />
              <h3 className="text-sm font-black text-clinical-900 uppercase tracking-widest">Información del Profesional (Firma)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                  Nombre del Profesional
                </label>
                <input
                  type="text"
                  value={settings.doctorName}
                  onChange={(e) => handleChange('doctorName', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                  placeholder="Ej: Dra. Ana García"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                  Especialidad
                </label>
                <input
                  type="text"
                  value={settings.doctorSpecialty}
                  onChange={(e) => handleChange('doctorSpecialty', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                  placeholder="Ej: Ginecología y Obstetricia"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                  Registro ACESS (Ecuador)
                </label>
                <input
                  type="text"
                  value={settings.doctorAcess}
                  onChange={(e) => handleChange('doctorAcess', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                  placeholder="Ej: 7456-2026"
                />
              </div>
            </div>
          </ConfigBlock>

          {/* Configs por Defecto */}
          <ConfigBlock className="p-6 rounded-2xl bg-white border border-clinical-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-clinical-100 pb-3">
              <Shield className="h-5 w-5 text-primary-600" />
              <h3 className="text-sm font-black text-clinical-900 uppercase tracking-widest">Valores por Defecto de la Receta</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                  Ciudad de Emisión por Defecto
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-clinical-300" />
                  <input
                    type="text"
                    value={settings.defaultCity}
                    onChange={(e) => handleChange('defaultCity', e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                    placeholder="Ej: Quito"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                  Vigencia de Recetas (días)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-clinical-300" />
                  <input
                    type="number"
                    min="1"
                    value={settings.defaultValidityDays}
                    onChange={(e) => handleChange('defaultValidityDays', e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                    placeholder="Ej: 3"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-clinical-450 uppercase tracking-widest mb-1.5 block">
                  Alergias / Advertencias por Defecto
                </label>
                <div className="relative">
                  <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-clinical-300" />
                  <input
                    type="text"
                    value={settings.defaultAllergies}
                    onChange={(e) => handleChange('defaultAllergies', e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-lg bg-white border border-clinical-150 text-xs font-semibold text-clinical-900 focus:border-primary-300 focus:ring-2 focus:ring-primary-500/10 outline-none shadow-sm transition-all"
                    placeholder="Ej: Ninguna conocida"
                  />
                </div>
              </div>
            </div>
          </ConfigBlock>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="primary"
              onClick={handleSave}
              disabled={saving}
              className="h-11 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md shadow-primary-200"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios de Receta'}
            </Button>
          </div>
        </div>

        {/* Panel de Vista Previa Dual (PDF Real-Time Simulation) */}
        <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-6">
          <ConfigBlock className="p-6 rounded-2xl bg-clinical-50/50 border border-clinical-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-clinical-450 uppercase tracking-widest flex items-center gap-1.5">
                <Pill className="h-3.5 w-3.5 text-primary-600 animate-pulse" /> Vista Previa Real del Formato PDF (Doble Columna)
              </h4>
              <span className="px-2 py-0.5 rounded bg-primary-100 text-primary-700 text-[8px] font-black uppercase tracking-wider">Simulación Impresión</span>
            </div>
            
            <div className="p-4 rounded-2xl bg-white border border-clinical-150 shadow-inner space-y-4 overflow-x-auto">
              <div className="min-w-[650px] bg-[#fdfdfd] p-6 rounded-xl border border-clinical-100 shadow-sm grid grid-cols-2 gap-4 divide-x divide-dashed divide-clinical-200 text-[10px] text-clinical-800 leading-normal relative select-none">
                 
                 {/* COLUMNA IZQUIERDA: RP (PRESCRIPTION) */}
                 <div className="pr-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-start gap-2.5">
                       <div className="h-11 w-11 bg-clinical-50 border border-clinical-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                          {settings.logoUrl ? (
                             <img src={settings.logoUrl} alt="Logo" className="h-full w-full object-contain p-0.5" />
                          ) : (
                             <span className="text-[9px] font-black text-primary-500 uppercase">Logo</span>
                          )}
                       </div>
                       <div className="min-w-0">
                          <h4 className="text-xs font-black text-clinical-950 truncate leading-none mb-0.5">{settings.clinicName || 'GineCentro Premium'}</h4>
                          <p className="text-[8px] font-bold text-clinical-500 truncate leading-none mb-1">{settings.clinicSubtitle || 'Ginecología de Alta Especialidad'}</p>
                          <p className="text-[7.5px] text-clinical-400 font-semibold leading-tight truncate">{settings.clinicAddress || 'Quito, Ecuador'}</p>
                          <p className="text-[7.5px] text-clinical-400 font-semibold leading-tight truncate">{settings.clinicPhone || 'Tel: (02) 2555-000'}</p>
                       </div>
                    </div>

                    <div className="h-0.5 bg-primary-500" />

                    {/* Metadata block */}
                    <div className="border border-clinical-100 rounded-lg p-2.5 bg-clinical-50/30 space-y-1 text-[8px] leading-relaxed">
                       <p className="font-bold text-clinical-950">RECETA MÉDICA Nro: <span className="text-primary-600 font-black">REC-2026-0045</span></p>
                       <p className="text-clinical-500">Fecha: 15/5/2026 <span className="float-right font-bold">Vence: {settings.defaultValidityDays || '3'} días</span></p>
                       <p className="text-clinical-800 font-medium">Paciente: <span className="font-black text-clinical-950">Andres Morquecho</span></p>
                       <p className="text-clinical-450">CI: 0603953761 • Edad: 28 Años • HC: 2026-92F</p>
                    </div>

                    {/* Content Block */}
                    <div className="space-y-2">
                       <h5 className="font-black text-[9px] uppercase tracking-wider text-primary-700">PRODUCTO / MEDICAMENTO (RP)</h5>
                       <div className="space-y-1 pl-1">
                          <p className="font-black text-clinical-900">1. Clotrimazol (100 mg)</p>
                          <p className="text-[8px] text-clinical-450 leading-relaxed font-semibold pl-2">Cantidad: 21 (VEINTIUNO) [Comercial: CANESTEN]<br />Presentación: Óvulo vaginal • Vía: Vaginal</p>
                       </div>
                    </div>
                 </div>

                 {/* COLUMNA DERECHA: INDICACIONES (DIRECTIONS) */}
                 <div className="pl-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-start gap-2.5">
                       <div className="h-11 w-11 bg-clinical-50 border border-clinical-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                          {settings.logoUrl ? (
                             <img src={settings.logoUrl} alt="Logo" className="h-full w-full object-contain p-0.5" />
                          ) : (
                             <span className="text-[9px] font-black text-primary-500 uppercase">Logo</span>
                          )}
                       </div>
                       <div className="min-w-0">
                          <h4 className="text-xs font-black text-clinical-950 truncate leading-none mb-0.5">{settings.clinicName || 'GineCentro Premium'}</h4>
                          <p className="text-[8px] font-bold text-clinical-500 truncate leading-none mb-1">{settings.clinicSubtitle || 'Ginecología de Alta Especialidad'}</p>
                          <p className="text-[7.5px] text-clinical-400 font-semibold leading-tight truncate">{settings.clinicAddress || 'Quito, Ecuador'}</p>
                          <p className="text-[7.5px] text-clinical-400 font-semibold leading-tight truncate">{settings.clinicPhone || 'Tel: (02) 2555-000'}</p>
                       </div>
                    </div>

                    <div className="h-0.5 bg-primary-500" />

                    {/* Metadata block */}
                    <div className="border border-clinical-100 rounded-lg p-2.5 bg-clinical-50/30 space-y-1 text-[8px] leading-relaxed">
                       <p className="font-bold text-clinical-950">RECETA MÉDICA Nro: <span className="text-primary-600 font-black">REC-2026-0045</span></p>
                       <p className="text-clinical-500">Fecha: 15/5/2026 <span className="float-right font-bold">Vence: {settings.defaultValidityDays || '3'} días</span></p>
                       <p className="text-clinical-800 font-medium">Paciente: <span className="font-black text-clinical-950">Andres Morquecho</span></p>
                       <p className="text-clinical-450">CI: 0603953761 • Edad: 28 Años • HC: 2026-92F</p>
                    </div>

                    {/* Content Block */}
                    <div className="space-y-2">
                       <h5 className="font-black text-[9px] uppercase tracking-wider text-primary-700">INDICACIONES DE USO</h5>
                       <div className="space-y-1 pl-1">
                          <p className="font-black text-clinical-900">1. Clotrimazol (100 mg)</p>
                          <p className="text-[8px] text-clinical-450 leading-relaxed font-semibold pl-2"><span className="font-black text-clinical-850">Dosis:</span> 1 óvulo<br /><span className="font-black text-clinical-850">Frecuencia:</span> Cada 24 horas (antes de acostarse) • <span className="font-black text-clinical-850">Duración:</span> 6 días</p>
                       </div>
                    </div>
                 </div>

              </div>
            </div>

            {/* Sello de Firma Pre-Visualización */}
            <div className="p-4 rounded-xl bg-white border border-clinical-150 space-y-3">
              <span className="text-[8px] font-black text-clinical-400 uppercase tracking-widest block">Simulación de Sello de Firma al Pie</span>
              <div className="flex flex-col items-center text-center py-2 bg-clinical-50/20 rounded-lg">
                <div className="h-8 w-24 border-b border-dashed border-clinical-300 mb-2 relative flex items-center justify-center">
                  <span className="text-[8px] text-clinical-300 font-serif italic">Firma Electrónica / Sello</span>
                </div>
                <h6 className="text-[10px] font-black text-clinical-950 leading-none mb-0.5">{settings.doctorName || 'Dra. Ana García'}</h6>
                <p className="text-[8px] font-bold text-clinical-500 uppercase tracking-widest mb-1.5">{settings.doctorSpecialty || 'Especialista'}</p>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-650 rounded text-[7px] font-black tracking-widest border border-indigo-100 uppercase">
                  REG. ACESS: {settings.doctorAcess || 'NÚMERO'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <p className="text-[9.5px] leading-normal text-emerald-800 font-bold">
                Esta configuración de encabezado y sello se autocompleta en todas tus recetas impresas e históricas al instante de guardar los cambios.
              </p>
            </div>
          </ConfigBlock>
        </div>
      </div>
    </ConfigCanvas>
  )
}
