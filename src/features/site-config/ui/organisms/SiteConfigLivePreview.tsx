import type { ReactNode } from 'react'

import { useSiteConfig } from '@/features/site-config/model/site-config-context'
import { ServiceIcon } from '@/features/site-config/model/service-icons'
import type { ConfigSectionId } from '@/features/site-config/model/config-nav'
import type { BusinessSettings } from '@/features/site-config/model/use-business-settings'
import { LogoGlyphSvg } from '@/shared/ui/LogoGlyphSvg'
import { cn } from '@/shared/lib/cn'

type SiteConfigLivePreviewProps = {
  section: ConfigSectionId
  clinicalDraft?: BusinessSettings | null
  variant?: 'standalone' | 'bare'
}

export function SiteConfigLivePreview({
  section,
  clinicalDraft,
  variant = 'standalone',
}: SiteConfigLivePreviewProps) {
  const previewBody = (
    <PreviewFrame section={section}>
      {section === 'global-brand' && <BrandPreview />}
      {section === 'landing-hero' && <HeroPreview />}
      {section === 'landing-services' && <ServicesPreview />}
      {section === 'landing-cta' && <CtaPreview />}
      {section === 'clinical-reports' && <ReportPreview draft={clinicalDraft} />}
      {section === 'clinical-billing' && <BillingPreview draft={clinicalDraft} />}
    </PreviewFrame>
  )

  if (variant === 'bare') {
    return (
      <div
        className="flex w-full justify-center"
        aria-live="polite"
        aria-label="Vista previa de la seccion"
      >
        {previewBody}
      </div>
    )
  }

  return (
    <div
      className="glass-card flex h-full min-h-0 flex-col overflow-hidden rounded-[2rem] border border-white"
      aria-live="polite"
      aria-label="Vista previa"
    >
      <div className="border-b border-clinical-100/80 px-6 py-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-clinical-400">
          Vista previa
        </p>
      </div>
      <div className="flex flex-1 items-start justify-center overflow-auto bg-clinical-50/30 p-6">
        {previewBody}
      </div>
    </div>
  )
}

function PreviewFrame({
  section,
  children,
}: {
  section: ConfigSectionId
  children: ReactNode
}) {
  const wide = section === 'landing-services' || section === 'landing-hero'
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-2xl border border-clinical-100/80 bg-white shadow-premium ring-1 ring-inset ring-primary-100/30',
        wide ? 'max-w-2xl' : 'max-w-xl',
      )}
    >
      {children}
    </div>
  )
}

function BrandPreview() {
  const { config } = useSiteConfig()
  return (
    <>
      <div className="flex items-center justify-between border-b border-clinical-100 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <BrandLogo size="sm" />
          <div>
            <p className="text-sm font-semibold text-clinical-900">{config.brandName}</p>
            <p className="text-[11px] text-clinical-500">{config.brandTagline}</p>
          </div>
        </div>
        <span className="h-8 w-20 rounded bg-clinical-100" />
      </div>
      <div className="px-4 py-8">
        <div className="h-3 w-2/3 rounded bg-clinical-100" />
        <div className="mt-2 h-3 w-1/2 rounded bg-clinical-50" />
      </div>
      <div className="border-t border-clinical-100 px-4 py-3 text-center">
        <p className="text-[10px] text-clinical-400">© {config.footerNotice}</p>
      </div>
    </>
  )
}

function HeroPreview() {
  const { config } = useSiteConfig()
  return (
    <div className="p-4 space-y-4">
      <span className="inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-[10px] font-medium text-primary-800">
        {config.heroBadge}
      </span>
      <h3 className="font-display text-lg font-bold leading-tight text-clinical-900">
        {config.heroTitle}
      </h3>
      <p className="text-xs leading-relaxed text-clinical-600">{config.heroDescription}</p>
      <div className="overflow-hidden rounded-lg ring-1 ring-clinical-100">
        <img
          src={config.heroImageUrl}
          alt={config.heroImageAlt}
          className="aspect-[4/3] w-full object-cover"
        />
        <p className="bg-white px-3 py-2 text-[10px] text-clinical-600">{config.heroCaption}</p>
      </div>
    </div>
  )
}

function ServicesPreview() {
  const { config } = useSiteConfig()
  return (
    <div className="p-4 space-y-4">
      <div className="text-center">
        <h3 className="text-sm font-semibold text-clinical-900">{config.servicesTitle}</h3>
        <p className="mt-1 text-[11px] text-clinical-500">{config.servicesSubtitle}</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {config.serviceCards.map((card) => (
          <div
            key={card.id}
            className="overflow-hidden rounded-lg border border-clinical-100"
          >
            {card.imageUrl ? (
              <img src={card.imageUrl} alt="" className="h-16 w-full object-cover" />
            ) : (
              <span className="flex h-16 items-center justify-center bg-primary-50/80">
                <ServiceIcon id={card.icon} className="h-5 w-5 text-primary-700" />
              </span>
            )}
            <div className="p-2.5">
            <p className="text-xs font-semibold text-clinical-900">
              {card.title}
            </p>
            <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-clinical-500">
              {card.description}
            </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CtaPreview() {
  const { config } = useSiteConfig()
  return (
    <div className="space-y-4 p-4">
      <div className="rounded-lg bg-clinical-900 p-5">
        <h3 className="text-sm font-semibold text-white">{config.ctaTitle}</h3>
        <p className="mt-2 text-[11px] leading-relaxed text-clinical-300">
          {config.ctaDescription}
        </p>
        <span className="mt-4 inline-block rounded-md bg-white px-3 py-1.5 text-[10px] font-medium text-clinical-900">
          Entrar
        </span>
      </div>
      <p className="text-center text-[10px] text-clinical-400">
        © {new Date().getFullYear()} {config.footerNotice}
      </p>
    </div>
  )
}

function ReportPreview({ draft }: { draft?: BusinessSettings | null }) {
  const clinic = draft?.clinicName || 'Nombre de la clínica'
  const header = draft?.reportHeader || 'Encabezado del informe'
  const address = draft?.address || 'Dirección'
  const tax = draft?.taxId

  return (
    <div className="p-6">
      <div className="mx-auto max-w-[280px] rounded border border-clinical-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3 border-b border-clinical-100 pb-3">
          {draft?.logoUrl ? (
            <img src={draft.logoUrl} alt="" className="h-10 w-10 object-contain" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded bg-clinical-100 text-clinical-500">
              <LogoGlyphSvg className="h-4 w-4" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-clinical-900">{clinic}</p>
            {tax ? <p className="text-[10px] text-clinical-500">RUC {tax}</p> : null}
            <p className="mt-1 text-[10px] text-clinical-500">{address}</p>
          </div>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-clinical-600">{header}</p>
        <div className="mt-4 space-y-1.5">
          <div className="h-2 rounded bg-clinical-100" />
          <div className="h-2 w-4/5 rounded bg-clinical-50" />
          <div className="h-2 w-3/5 rounded bg-clinical-50" />
        </div>
        {draft?.reportFooter ? (
          <p className="mt-4 border-t border-clinical-100 pt-3 text-[9px] text-clinical-400">
            {draft.reportFooter}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function BillingPreview({ draft }: { draft?: BusinessSettings | null }) {
  const series = draft?.billingSeries || 'F001'
  const num = draft?.billingNextNumber ?? 1
  const currency = draft?.currency || 'USD'

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-xs rounded-lg border border-clinical-200 p-6 text-center">
        <p className="text-[10px] font-medium uppercase tracking-wider text-clinical-400">
          Próximo comprobante
        </p>
        <p className="mt-3 font-mono text-2xl font-semibold text-clinical-900">
          {series}-{String(num).padStart(6, '0')}
        </p>
        <p className="mt-2 text-xs text-clinical-500">{currency}</p>
      </div>
    </div>
  )
}

function BrandLogo({ size }: { size: 'sm' | 'md' }) {
  const { config } = useSiteConfig()
  const dim = size === 'sm' ? 'h-9 w-9' : 'h-11 w-11'
  if (config.logoUrl) {
    return (
      <img src={config.logoUrl} alt="" className={cn(dim, 'rounded-lg object-contain')} />
    )
  }
  return (
    <span
      className={cn(
        dim,
        'flex items-center justify-center rounded-lg bg-primary-600 text-white',
      )}
    >
      <LogoGlyphSvg className="h-4 w-4" />
    </span>
  )
}

