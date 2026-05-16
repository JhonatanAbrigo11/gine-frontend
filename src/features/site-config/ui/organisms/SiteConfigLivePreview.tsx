import { LogoGlyphSvg } from '@/shared/ui/LogoGlyphSvg'

import { useSiteConfig } from '@/features/site-config/model/site-config-context'

/** Vista previa compacta en tiempo real (misma fuente que la landing y el header). */
export function SiteConfigLivePreview() {
  const { config } = useSiteConfig()

  return (
    <div
      className="overflow-hidden rounded-[2rem] border border-clinical-100 bg-white shadow-xl shadow-clinical-900/5"
      aria-live="polite"
      aria-label="Vista previa en tiempo real de los cambios"
    >
      <div className="flex items-center gap-1.5 border-b border-clinical-100 bg-clinical-50/80 px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-accent-400" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-amber-300" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-primary-400" aria-hidden />
        <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-clinical-400">
          Vista previa
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-clinical-50/80 p-3 ring-1 ring-clinical-100">
          {config.logoUrl ? (
            <img
              src={config.logoUrl}
              alt=""
              className="h-9 w-9 shrink-0 rounded-xl object-cover shadow-sm"
            />
          ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
              <LogoGlyphSvg className="h-4 w-4" />
            </span>
          )}
          <div className="min-w-0 leading-tight">
            <p className="truncate font-display text-sm font-bold tracking-tight text-clinical-900">
              {config.brandName}
            </p>
            <p className="truncate text-xs font-medium text-clinical-600">{config.brandTagline}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl ring-1 ring-clinical-100">
          <div className="aspect-[16/9] w-full bg-primary-50">
            <img
              src={config.heroImageUrl}
              alt={config.heroImageAlt}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="bg-white px-3 py-2.5">
            <p className="line-clamp-2 font-display text-xs font-bold leading-snug tracking-tight text-clinical-900">
              {config.heroTitle}
            </p>
            <p className="mt-1 line-clamp-2 text-[11px] font-medium leading-relaxed text-clinical-600">
              {config.heroDescription}
            </p>
          </div>
        </div>

        <p className="line-clamp-1 text-center text-[10px] font-bold uppercase tracking-widest text-primary-600/80">
          {config.servicesTitle}
        </p>
      </div>
    </div>
  )
}
