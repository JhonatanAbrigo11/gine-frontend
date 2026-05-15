import { useId } from 'react'

import { useSiteConfig } from '@/features/site-config/model/site-config-context'
import { SettingsButton } from '@/features/site-config/ui/atoms/SettingsButton'
import { SettingsInput } from '@/features/site-config/ui/atoms/SettingsInput'
import { SettingsLabel } from '@/features/site-config/ui/atoms/SettingsLabel'
import { SettingsTextarea } from '@/features/site-config/ui/atoms/SettingsTextarea'

export function SiteConfigForm() {
  const { config, updateConfig, updateServiceCard } = useSiteConfig()
  const baseId = useId()

  return (
    <div className="space-y-6">
      <fieldset className="space-y-3 rounded-2xl border border-rose-dawn-200/80 bg-white/60 p-3">
        <legend className="px-1 text-[11px] font-bold uppercase tracking-wider text-teal-sage-800">
          Marca y logo
        </legend>
        <div className="space-y-1.5">
          <SettingsLabel htmlFor={`${baseId}-brand`}>Nombre de la clínica</SettingsLabel>
          <SettingsInput
            id={`${baseId}-brand`}
            value={config.brandName}
            onChange={(e) => updateConfig({ brandName: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <SettingsLabel htmlFor={`${baseId}-tag`}>Línea bajo el nombre</SettingsLabel>
          <SettingsInput
            id={`${baseId}-tag`}
            value={config.brandTagline}
            onChange={(e) => updateConfig({ brandTagline: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <SettingsLabel htmlFor={`${baseId}-logo-url`}>Logo (URL o sube imagen)</SettingsLabel>
          <SettingsInput
            id={`${baseId}-logo-url`}
            value={config.logoUrl}
            onChange={(e) => updateConfig({ logoUrl: e.target.value })}
            placeholder="https://… o vacío para icono por defecto"
            autoComplete="off"
          />
          <LogoFileRow inputId={`${baseId}-logo-file`} />
        </div>
      </fieldset>

      <fieldset className="space-y-3 rounded-2xl border border-rose-dawn-200/80 bg-white/60 p-3">
        <legend className="px-1 text-[11px] font-bold uppercase tracking-wider text-teal-sage-800">
          Hero de la landing
        </legend>
        <div className="space-y-1.5">
          <SettingsLabel htmlFor={`${baseId}-hero-url`}>Imagen principal (URL)</SettingsLabel>
          <SettingsInput
            id={`${baseId}-hero-url`}
            value={config.heroImageUrl}
            onChange={(e) => updateConfig({ heroImageUrl: e.target.value })}
            autoComplete="off"
          />
          <HeroFileRow inputId={`${baseId}-hero-file`} />
        </div>
        <div className="space-y-1.5">
          <SettingsLabel htmlFor={`${baseId}-hero-alt`}>Texto alternativo de la imagen</SettingsLabel>
          <SettingsInput
            id={`${baseId}-hero-alt`}
            value={config.heroImageAlt}
            onChange={(e) => updateConfig({ heroImageAlt: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <SettingsLabel htmlFor={`${baseId}-badge`}>Etiqueta superior</SettingsLabel>
          <SettingsInput
            id={`${baseId}-badge`}
            value={config.heroBadge}
            onChange={(e) => updateConfig({ heroBadge: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <SettingsLabel htmlFor={`${baseId}-hero-title`}>Título principal</SettingsLabel>
          <SettingsInput
            id={`${baseId}-hero-title`}
            value={config.heroTitle}
            onChange={(e) => updateConfig({ heroTitle: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <SettingsLabel htmlFor={`${baseId}-hero-desc`}>Descripción</SettingsLabel>
          <SettingsTextarea
            id={`${baseId}-hero-desc`}
            value={config.heroDescription}
            onChange={(e) => updateConfig({ heroDescription: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-1.5">
          <SettingsLabel htmlFor={`${baseId}-hero-cap`}>Pie de la imagen</SettingsLabel>
          <SettingsInput
            id={`${baseId}-hero-cap`}
            value={config.heroCaption}
            onChange={(e) => updateConfig({ heroCaption: e.target.value })}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-3 rounded-2xl border border-rose-dawn-200/80 bg-white/60 p-3">
        <legend className="px-1 text-[11px] font-bold uppercase tracking-wider text-teal-sage-800">
          Sección servicios
        </legend>
        <div className="space-y-1.5">
          <SettingsLabel htmlFor={`${baseId}-srv-title`}>Título</SettingsLabel>
          <SettingsInput
            id={`${baseId}-srv-title`}
            value={config.servicesTitle}
            onChange={(e) => updateConfig({ servicesTitle: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <SettingsLabel htmlFor={`${baseId}-srv-sub`}>Subtítulo</SettingsLabel>
          <SettingsTextarea
            id={`${baseId}-srv-sub`}
            value={config.servicesSubtitle}
            onChange={(e) => updateConfig({ servicesSubtitle: e.target.value })}
            rows={2}
          />
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-2 rounded-xl bg-teal-sage-100/40 p-2 ring-1 ring-teal-sage-200/60">
            <p className="text-[11px] font-bold text-teal-sage-900">Tarjeta {i + 1}</p>
            <div className="space-y-1.5">
              <SettingsLabel htmlFor={`${baseId}-c${i}-t`}>Título</SettingsLabel>
              <SettingsInput
                id={`${baseId}-c${i}-t`}
                value={config.serviceCards[i].title}
                onChange={(e) =>
                  updateServiceCard(i as 0 | 1 | 2, { title: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
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
      </fieldset>

      <fieldset className="space-y-3 rounded-2xl border border-rose-dawn-200/80 bg-white/60 p-3">
        <legend className="px-1 text-[11px] font-bold uppercase tracking-wider text-teal-sage-800">
          Llamada a la acción y pie
        </legend>
        <div className="space-y-1.5">
          <SettingsLabel htmlFor={`${baseId}-cta-t`}>Título CTA</SettingsLabel>
          <SettingsInput
            id={`${baseId}-cta-t`}
            value={config.ctaTitle}
            onChange={(e) => updateConfig({ ctaTitle: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <SettingsLabel htmlFor={`${baseId}-cta-d`}>Texto CTA</SettingsLabel>
          <SettingsTextarea
            id={`${baseId}-cta-d`}
            value={config.ctaDescription}
            onChange={(e) => updateConfig({ ctaDescription: e.target.value })}
            rows={2}
          />
        </div>
        <div className="space-y-1.5">
          <SettingsLabel htmlFor={`${baseId}-foot`}>Texto del pie de página</SettingsLabel>
          <SettingsInput
            id={`${baseId}-foot`}
            value={config.footerNotice}
            onChange={(e) => updateConfig({ footerNotice: e.target.value })}
          />
        </div>
      </fieldset>
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
