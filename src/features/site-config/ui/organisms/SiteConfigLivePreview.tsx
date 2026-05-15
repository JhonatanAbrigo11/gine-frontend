import { LogoGlyphSvg } from '@/shared/ui/LogoGlyphSvg'

import { useSiteConfig } from '@/features/site-config/model/site-config-context'

/** Vista previa compacta en tiempo real (misma fuente que la landing y el header). */
export function SiteConfigLivePreview() {
  const { config } = useSiteConfig()

  return (
    <div
      className="overflow-hidden rounded-2xl border border-teal-sage-300/70 bg-gradient-to-b from-white to-rose-dawn-100/80 shadow-inner ring-1 ring-rose-dawn-200/60"
      aria-live="polite"
      aria-label="Vista previa en tiempo real de los cambios"
    >
      <div className="flex items-center gap-1.5 border-b border-rose-dawn-200/80 bg-white/90 px-2 py-1.5">
        <span className="h-2 w-2 rounded-full bg-rose-dawn-400" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-amber-200" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-teal-sage-300" aria-hidden />
        <span className="ml-auto text-[10px] font-medium text-slate-care-600">Vista previa</span>
      </div>

      <div className="space-y-2 p-2">
        <div className="flex items-center gap-2 rounded-xl border border-rose-dawn-200/60 bg-white/90 px-2 py-1.5">
          {config.logoUrl ? (
            <img
              src={config.logoUrl}
              alt=""
              className="h-8 w-8 shrink-0 rounded-lg object-cover shadow-sm"
            />
          ) : (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-rose-dawn-200 to-teal-sage-200 text-teal-sage-900">
              <LogoGlyphSvg className="h-4 w-4" />
            </span>
          )}
          <div className="min-w-0 leading-tight">
            <p className="truncate font-display text-xs font-semibold text-slate-care-900">
              {config.brandName}
            </p>
            <p className="truncate text-[10px] text-slate-care-600">{config.brandTagline}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl ring-1 ring-rose-dawn-200/70">
          <div className="aspect-[16/9] w-full bg-rose-dawn-100">
            <img
              src={config.heroImageUrl}
              alt={config.heroImageAlt}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="bg-white/95 px-2 py-1.5">
            <p className="line-clamp-2 font-display text-[11px] font-semibold leading-snug text-slate-care-900">
              {config.heroTitle}
            </p>
            <p className="mt-0.5 line-clamp-2 text-[10px] leading-relaxed text-slate-care-600">
              {config.heroDescription}
            </p>
          </div>
        </div>

        <p className="line-clamp-1 text-center text-[10px] font-medium text-teal-sage-800">
          {config.servicesTitle}
        </p>
      </div>
    </div>
  )
}
