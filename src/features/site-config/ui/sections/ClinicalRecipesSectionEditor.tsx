import { useEffect, useState } from 'react'
import { Pill, Shield, Award, MapPin, AlertTriangle, Calendar, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { ConfigBlock, ConfigCanvas, ConfigImageUpload } from '@/features/site-config/ui/molecules/config-editor-primitives'
import { Button } from '@/widgets/button'
import { useBusinessSettings } from '@/features/site-config/model/use-business-settings'

interface RecipeSettings {
  doctorName: string
  doctorSpecialty: string
  doctorAcess: string
  defaultCity: string
  defaultAllergies: string
  defaultValidityDays: string
  logoUrl: string
}

const DEFAULT_SETTINGS: RecipeSettings = {
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
        <div className="lg:col-span-7 space-y-6">
          {/* Logo y Encabezado */}
          <ConfigBlock className="p-6 rounded-2xl bg-white border border-clinical-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-clinical-100 pb-3">
              <ImageIcon className="h-5 w-5 text-primary-600" />
              <h3 className="text-sm font-black text-clinical-900 uppercase tracking-widest">Logo de Encabezado y Marca de Agua</h3>
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
                <p className="text-xs font-black text-clinical-800 uppercase tracking-wider">Dimensiones sugeridas: cuadradas (1:1)</p>
                <p className="text-[11px] leading-normal text-clinical-450 font-medium">
                  Este logotipo se imprimirá automáticamente en el extremo superior izquierdo de ambas columnas de la receta (RP e Indicaciones) y se renderizará de forma sutil en el fondo de la receta como una elegante marca de agua de baja opacidad.
                </p>
              </div>
            </div>
          </ConfigBlock>

          {/* Profesional */}
          <ConfigBlock className="p-6 rounded-2xl bg-white border border-clinical-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-clinical-100 pb-3">
              <Award className="h-5 w-5 text-primary-600" />
              <h3 className="text-sm font-black text-clinical-900 uppercase tracking-widest">Información del Profesional (Firma de Receta)</h3>
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
                  Especialidad / Subespecialidad
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

        {/* Panel de Vista Previa / Tarjeta del Médico */}
        <div className="lg:col-span-5 space-y-6">
          <ConfigBlock className="p-6 rounded-2xl bg-clinical-50/50 border border-clinical-100 shadow-sm space-y-4">
            <h4 className="text-[10px] font-black text-clinical-450 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Pill className="h-3.5 w-3.5 text-primary-600 animate-pulse" /> Vista Previa del Sello Profesional (ACESS)
            </h4>
            
            <div className="p-6 rounded-2xl bg-white border border-clinical-150 shadow-inner flex flex-col items-center text-center space-y-4">
              <div className="h-20 w-20 rounded-full bg-primary-50 border border-primary-200 flex items-center justify-center overflow-hidden shadow-inner">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo Clinica" className="h-full w-full object-contain p-1" />
                ) : (
                  <span className="text-primary-600 font-black text-2xl shadow-sm">
                    {settings.doctorName.charAt(settings.doctorName.startsWith('Dra.') || settings.doctorName.startsWith('Dr.') ? 4 : 0)}
                  </span>
                )}
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-black text-clinical-900">{settings.doctorName || 'Nombre Profesional'}</h3>
                <p className="text-[10px] font-bold text-clinical-400 uppercase tracking-widest">{settings.doctorSpecialty || 'Especialidad'}</p>
                <div className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-[9px] font-black text-indigo-600 tracking-wider uppercase mt-2">
                  REG. ACESS: {settings.doctorAcess || 'NÚMERO REGISTRO'}
                </div>
              </div>

              <div className="w-full border-t border-dashed border-clinical-200 pt-4 text-[9px] font-bold text-clinical-400 space-y-1">
                <p>Ciudad de Emisión: <span className="text-clinical-900 font-black">{settings.defaultCity}</span></p>
                <p>Vigencia Estándar: <span className="text-clinical-900 font-black">{settings.defaultValidityDays} días</span></p>
                <p>Advertencia de Alergias: <span className="text-rose-600 font-black">{settings.defaultAllergies}</span></p>
              </div>
            </div>
            <p className="text-[9.5px] font-bold text-clinical-400 text-center leading-normal">
              Esta información se precargará de manera automática cada vez que compongas una nueva Receta Médica en el sistema, ahorrando hasta un 80% de digitación.
            </p>
          </ConfigBlock>
        </div>
      </div>
    </ConfigCanvas>
  )
}
