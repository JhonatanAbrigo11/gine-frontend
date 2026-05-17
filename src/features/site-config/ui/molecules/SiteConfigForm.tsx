import { useEffect, useId, useState } from 'react'
import { FileText, ImageIcon, LayoutGrid, Megaphone, Palette, Receipt } from 'lucide-react'

import { useSiteConfig } from '@/features/site-config/model/site-config-context'
import { useBusinessSettings } from '@/features/site-config/model/use-business-settings'
import { SettingsButton } from '@/features/site-config/ui/atoms/SettingsButton'
import { SettingsInput } from '@/features/site-config/ui/atoms/SettingsInput'
import { SettingsLabel } from '@/features/site-config/ui/atoms/SettingsLabel'
import { SettingsTextarea } from '@/features/site-config/ui/atoms/SettingsTextarea'
import { Button } from '@/widgets/button'
import { HorizontalStepper, type HorizontalStepperStep } from '@/widgets/stepper'

const CONFIG_STEPPER_STEPS: HorizontalStepperStep[] = [
  { id: 'brand', label: 'Marca', Icon: Palette },
  { id: 'hero', label: 'Hero', Icon: ImageIcon },
  { id: 'services', label: 'Servicios', Icon: LayoutGrid },
  { id: 'cta', label: 'CTA y pie', Icon: Megaphone },
  { id: 'business', label: 'Informes', Icon: FileText },
  { id: 'billing', label: 'Facturación', Icon: Receipt },
]

export function SiteConfigForm() {
  const { config, updateConfig, updateServiceCard } = useSiteConfig()
  const { settings, updateSettings, loading } = useBusinessSettings()
  const [localSettings, setLocalSettings] = useState<any>(null)
  const baseId = useId()
  const [stepIndex, setStepIndex] = useState(0)

  const lastIndex = CONFIG_STEPPER_STEPS.length - 1

  useEffect(() => {
    if (settings && !localSettings) {
      setLocalSettings(settings)
    }
  }, [settings, localSettings])

  const handleUpdateLocal = (patch: any) => {
    setLocalSettings((prev: any) => ({ ...prev, ...patch }))
  }

  const handleSaveSettings = async () => {
    if (localSettings) {
      await updateSettings(localSettings)
      alert('Configuración guardada correctamente')
    }
  }

  return (
    <div className="space-y-6">
      <HorizontalStepper
        steps={CONFIG_STEPPER_STEPS}
        currentIndex={stepIndex}
        onStepChange={setStepIndex}
        className="pb-2"
      />

      <div className="min-h-[min(28rem,70vh)]">
        {stepIndex === 0 && (
          <section className="space-y-5" aria-labelledby={`${baseId}-step-brand`}>
            <h2
              id={`${baseId}-step-brand`}
              className="font-display text-lg font-bold tracking-tight text-clinical-900"
            >
              Marca y logo
            </h2>
            <div className="space-y-2">
              <SettingsLabel htmlFor={`${baseId}-brand`}>Nombre de la clínica</SettingsLabel>
              <SettingsInput
                id={`${baseId}-brand`}
                value={config.brandName}
                onChange={(e) => updateConfig({ brandName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <SettingsLabel htmlFor={`${baseId}-tag`}>Línea bajo el nombre</SettingsLabel>
              <SettingsInput
                id={`${baseId}-tag`}
                value={config.brandTagline}
                onChange={(e) => updateConfig({ brandTagline: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <SettingsLabel htmlFor={`${baseId}-logo-url`}>Logo (URL o sube imagen)</SettingsLabel>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {config.logoUrl ? (
                  <img 
                    src={config.logoUrl} 
                    alt="Logo preview" 
                    className="h-16 w-16 shrink-0 rounded-lg border border-clinical-100 bg-white object-contain p-1" 
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-clinical-200 bg-clinical-50/50">
                    <ImageIcon className="h-6 w-6 text-clinical-300" />
                  </div>
                )}
                <div className="flex w-full flex-col gap-2">
                  <SettingsInput
                    id={`${baseId}-logo-url`}
                    value={config.logoUrl}
                    onChange={(e) => updateConfig({ logoUrl: e.target.value })}
                    placeholder="https://… o vacío para icono por defecto"
                    autoComplete="off"
                  />
                  <LogoFileRow inputId={`${baseId}-logo-file`} />
                </div>
              </div>
            </div>
          </section>
        )}

        {stepIndex === 1 && (
          <section className="space-y-5" aria-labelledby={`${baseId}-step-hero`}>
            <h2
              id={`${baseId}-step-hero`}
              className="font-display text-lg font-bold tracking-tight text-clinical-900"
            >
              Hero de la landing
            </h2>
            <div className="space-y-2">
              <SettingsLabel htmlFor={`${baseId}-hero-url`}>Imagen principal (URL)</SettingsLabel>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {config.heroImageUrl ? (
                  <img 
                    src={config.heroImageUrl} 
                    alt="Hero preview" 
                    className="h-20 w-32 shrink-0 rounded-lg border border-clinical-100 object-cover" 
                  />
                ) : (
                  <div className="flex h-20 w-32 shrink-0 items-center justify-center rounded-lg border border-dashed border-clinical-200 bg-clinical-50/50">
                    <ImageIcon className="h-6 w-6 text-clinical-300" />
                  </div>
                )}
                <div className="flex w-full flex-col gap-2">
                  <SettingsInput
                    id={`${baseId}-hero-url`}
                    value={config.heroImageUrl}
                    onChange={(e) => updateConfig({ heroImageUrl: e.target.value })}
                    autoComplete="off"
                  />
                  <HeroFileRow inputId={`${baseId}-hero-file`} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <SettingsLabel htmlFor={`${baseId}-hero-alt`}>Texto alternativo de la imagen</SettingsLabel>
              <SettingsInput
                id={`${baseId}-hero-alt`}
                value={config.heroImageAlt}
                onChange={(e) => updateConfig({ heroImageAlt: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <SettingsLabel htmlFor={`${baseId}-badge`}>Etiqueta superior</SettingsLabel>
              <SettingsInput
                id={`${baseId}-badge`}
                value={config.heroBadge}
                onChange={(e) => updateConfig({ heroBadge: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <SettingsLabel htmlFor={`${baseId}-hero-title`}>Título principal</SettingsLabel>
              <SettingsInput
                id={`${baseId}-hero-title`}
                value={config.heroTitle}
                onChange={(e) => updateConfig({ heroTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <SettingsLabel htmlFor={`${baseId}-hero-desc`}>Descripción</SettingsLabel>
              <SettingsTextarea
                id={`${baseId}-hero-desc`}
                value={config.heroDescription}
                onChange={(e) => updateConfig({ heroDescription: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <SettingsLabel htmlFor={`${baseId}-hero-cap`}>Pie de la imagen</SettingsLabel>
              <SettingsInput
                id={`${baseId}-hero-cap`}
                value={config.heroCaption}
                onChange={(e) => updateConfig({ heroCaption: e.target.value })}
              />
            </div>
          </section>
        )}

        {stepIndex === 2 && (
          <section className="space-y-5" aria-labelledby={`${baseId}-step-services`}>
            <h2
              id={`${baseId}-step-services`}
              className="font-display text-lg font-bold tracking-tight text-clinical-900"
            >
              Sección servicios
            </h2>
            <div className="space-y-2">
              <SettingsLabel htmlFor={`${baseId}-srv-title`}>Título</SettingsLabel>
              <SettingsInput
                id={`${baseId}-srv-title`}
                value={config.servicesTitle}
                onChange={(e) => updateConfig({ servicesTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <SettingsLabel htmlFor={`${baseId}-srv-sub`}>Subtítulo</SettingsLabel>
              <SettingsTextarea
                id={`${baseId}-srv-sub`}
                value={config.servicesSubtitle}
                onChange={(e) => updateConfig({ servicesSubtitle: e.target.value })}
                rows={2}
              />
            </div>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="space-y-4 rounded-2xl bg-clinical-50/80 p-4 ring-1 ring-clinical-100"
              >
                <p className="px-1 text-[10px] font-bold uppercase tracking-widest text-clinical-400">
                  Tarjeta {i + 1}
                </p>
                <div className="space-y-2">
                  <SettingsLabel htmlFor={`${baseId}-c${i}-t`}>Título</SettingsLabel>
                  <SettingsInput
                    id={`${baseId}-c${i}-t`}
                    value={config.serviceCards[i].title}
                    onChange={(e) =>
                      updateServiceCard(i as 0 | 1 | 2, { title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <SettingsLabel htmlFor={`${baseId}-c${i}-d`}>Descripción</SettingsLabel>
                  <SettingsTextarea
                    id={`${baseId}-c${i}-d`}
                    value={config.serviceCards[i].description}
                    onChange={(e) =>
                      updateServiceCard(i as 0 | 1 | 2, { description: e.target.value })
                    }
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </section>
        )}

        {stepIndex === 3 && (
          <section className="space-y-5" aria-labelledby={`${baseId}-step-cta`}>
            <h2
              id={`${baseId}-step-cta`}
              className="font-display text-lg font-bold tracking-tight text-clinical-900"
            >
              Llamada a la acción y pie
            </h2>
            <div className="space-y-2">
              <SettingsLabel htmlFor={`${baseId}-cta-t`}>Título CTA</SettingsLabel>
              <SettingsInput
                id={`${baseId}-cta-t`}
                value={config.ctaTitle}
                onChange={(e) => updateConfig({ ctaTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <SettingsLabel htmlFor={`${baseId}-cta-d`}>Texto CTA</SettingsLabel>
              <SettingsTextarea
                id={`${baseId}-cta-d`}
                value={config.ctaDescription}
                onChange={(e) => updateConfig({ ctaDescription: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <SettingsLabel htmlFor={`${baseId}-foot`}>Texto del pie de página</SettingsLabel>
              <SettingsInput
                id={`${baseId}-foot`}
                value={config.footerNotice}
                onChange={(e) => updateConfig({ footerNotice: e.target.value })}
              />
            </div>
          </section>
        )}

        {stepIndex === 4 && (
          <section className="space-y-5" aria-labelledby={`${baseId}-step-business`}>
            <h2
              id={`${baseId}-step-business`}
              className="font-display text-lg font-bold tracking-tight text-clinical-900"
            >
              Informes y Clínica
            </h2>
            {loading ? (
              <p className="text-sm text-clinical-400">Cargando configuración...</p>
            ) : (
              <>
                <div className="space-y-2">
                  <SettingsLabel htmlFor={`${baseId}-biz-name`}>Nombre Formal de la Clínica</SettingsLabel>
                  <SettingsInput
                    id={`${baseId}-biz-name`}
                    value={localSettings?.clinicName || ''}
                    onChange={(e) => handleUpdateLocal({ clinicName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <SettingsLabel htmlFor={`${baseId}-biz-id`}>Identificación Tributaria (RUC/NIT)</SettingsLabel>
                  <SettingsInput
                    id={`${baseId}-biz-id`}
                    value={localSettings?.taxId || ''}
                    onChange={(e) => handleUpdateLocal({ taxId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <SettingsLabel htmlFor={`${baseId}-biz-addr`}>Dirección</SettingsLabel>
                  <SettingsInput
                    id={`${baseId}-biz-addr`}
                    value={localSettings?.address || ''}
                    onChange={(e) => handleUpdateLocal({ address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <SettingsLabel htmlFor={`${baseId}-biz-header`}>Encabezado de Informes</SettingsLabel>
                  <SettingsTextarea
                    id={`${baseId}-biz-header`}
                    value={localSettings?.reportHeader || ''}
                    onChange={(e) => handleUpdateLocal({ reportHeader: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <SettingsLabel htmlFor={`${baseId}-biz-footer`}>Pie de página de Informes</SettingsLabel>
                  <SettingsTextarea
                    id={`${baseId}-biz-footer`}
                    value={localSettings?.reportFooter || ''}
                    onChange={(e) => handleUpdateLocal({ reportFooter: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <SettingsLabel htmlFor={`${baseId}-biz-logo`}>Logo para Informes (Imagen)</SettingsLabel>
                  <div className="flex items-center gap-4">
                    {localSettings?.logoUrl ? (
                      <img 
                        src={localSettings.logoUrl} 
                        alt="Logo informes" 
                        className="h-16 w-16 rounded-lg border border-clinical-100 object-contain p-1" 
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-clinical-200 bg-clinical-50/50">
                        <ImageIcon className="h-6 w-6 text-clinical-300" />
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <SettingsButton
                        type="button"
                        onClick={() => document.getElementById(`${baseId}-biz-logo-file`)?.click()}
                      >
                        {localSettings?.logoUrl ? 'Cambiar logo' : 'Subir logo'}
                      </SettingsButton>
                      {localSettings?.logoUrl && (
                        <button 
                          type="button" 
                          className="text-left text-xs text-red-500 hover:underline"
                          onClick={() => handleUpdateLocal({ logoUrl: null })}
                        >
                          Eliminar logo
                        </button>
                      )}
                    </div>
                    <input
                      id={`${baseId}-biz-logo-file`}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (!f) return
                        const reader = new FileReader()
                        reader.onload = () => handleUpdateLocal({ logoUrl: String(reader.result) })
                        reader.readAsDataURL(f)
                        e.target.value = ''
                      }}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleSaveSettings}
                  className="mt-4 w-full rounded-xl"
                  variant="primary"
                >
                  Guardar Cambios de Informes
                </Button>
              </>
            )}
          </section>
        )}

        {stepIndex === 5 && (
          <section className="space-y-5" aria-labelledby={`${baseId}-step-billing`}>
            <h2
              id={`${baseId}-step-billing`}
              className="font-display text-lg font-bold tracking-tight text-clinical-900"
            >
              Configuración de Facturación
            </h2>
            {loading || !localSettings ? (
              <p className="text-sm text-clinical-400">Cargando configuración...</p>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <SettingsLabel htmlFor={`${baseId}-bill-series`}>Serie (Ej: F001)</SettingsLabel>
                    <SettingsInput
                      id={`${baseId}-bill-series`}
                      value={localSettings.billingSeries || ''}
                      onChange={(e) => handleUpdateLocal({ billingSeries: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <SettingsLabel htmlFor={`${baseId}-bill-next`}>Próximo Número</SettingsLabel>
                    <SettingsInput
                      id={`${baseId}-bill-next`}
                      type="number"
                      value={localSettings.billingNextNumber || 1}
                      onChange={(e) => handleUpdateLocal({ billingNextNumber: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <SettingsLabel htmlFor={`${baseId}-bill-curr`}>Moneda</SettingsLabel>
                  <select
                    id={`${baseId}-bill-curr`}
                    className="w-full rounded-xl border-clinical-100 bg-clinical-50/50 p-3 text-sm ring-1 ring-clinical-200/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    value={localSettings.currency || 'USD'}
                    onChange={(e) => handleUpdateLocal({ currency: e.target.value })}
                  >
                    <option value="USD">Dólares (USD)</option>
                    <option value="EUR">Euros (EUR)</option>
                    <option value="PEN">Soles (PEN)</option>
                    <option value="COP">Pesos (COP)</option>
                    <option value="MXN">Pesos (MXN)</option>
                  </select>
                </div>
                <Button 
                  onClick={handleSaveSettings}
                  className="mt-4 w-full rounded-xl"
                  variant="primary"
                >
                  Guardar Configuración de Facturación
                </Button>
              </>
            )}
          </section>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-clinical-100 pt-6">
        <Button
          type="button"
          variant="secondary"
          className="h-12 rounded-2xl"
          disabled={stepIndex === 0}
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
        >
          Anterior
        </Button>
        <p className="text-center text-sm font-medium text-clinical-800/60">
          Paso {stepIndex + 1} de {CONFIG_STEPPER_STEPS.length}
        </p>
        <Button
          type="button"
          variant="primary"
          className="h-12 rounded-2xl shadow-lg shadow-primary-200"
          disabled={stepIndex >= lastIndex}
          onClick={() => setStepIndex((i) => Math.min(lastIndex, i + 1))}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}

function LogoFileRow({ inputId }: { inputId: string }) {
  const { updateConfig } = useSiteConfig()

  return (
    <div className="flex flex-wrap gap-2">
      <SettingsButton
        type="button"
        onClick={() => document.getElementById(inputId)?.click()}
      >
        Subir logo (archivo)
      </SettingsButton>
      <SettingsButton type="button" onClick={() => updateConfig({ logoUrl: '' })}>
        Quitar imagen
      </SettingsButton>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (!f) return
          const reader = new FileReader()
          reader.onload = () => updateConfig({ logoUrl: String(reader.result) })
          reader.readAsDataURL(f)
          e.target.value = ''
        }}
      />
    </div>
  )
}

function HeroFileRow({ inputId }: { inputId: string }) {
  const { updateConfig } = useSiteConfig()

  return (
    <div className="flex flex-wrap gap-2">
      <SettingsButton
        type="button"
        onClick={() => document.getElementById(inputId)?.click()}
      >
        Subir imagen hero
      </SettingsButton>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (!f) return
          const reader = new FileReader()
          reader.onload = () => updateConfig({ heroImageUrl: String(reader.result) })
          reader.readAsDataURL(f)
          e.target.value = ''
        }}
      />
    </div>
  )
}
