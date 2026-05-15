import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { DEFAULT_SITE_CONFIG } from './default-site-config'
import type { SiteConfig } from './types'

const STORAGE_KEY = 'gine-site-config'

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function mergeWithDefaults(stored: unknown): SiteConfig {
  const base = DEFAULT_SITE_CONFIG
  if (!isRecord(stored)) {
    return { ...base, serviceCards: [...base.serviceCards] as unknown as SiteConfig['serviceCards'] }
  }

  const cardsRaw = stored.serviceCards
  let serviceCards: SiteConfig['serviceCards'] = [...base.serviceCards] as unknown as SiteConfig['serviceCards']
  if (Array.isArray(cardsRaw) && cardsRaw.length >= 3) {
    serviceCards = [
      {
        title:
          typeof cardsRaw[0]?.title === 'string' ? cardsRaw[0].title : base.serviceCards[0].title,
        description:
          typeof cardsRaw[0]?.description === 'string'
            ? cardsRaw[0].description
            : base.serviceCards[0].description,
      },
      {
        title:
          typeof cardsRaw[1]?.title === 'string' ? cardsRaw[1].title : base.serviceCards[1].title,
        description:
          typeof cardsRaw[1]?.description === 'string'
            ? cardsRaw[1].description
            : base.serviceCards[1].description,
      },
      {
        title:
          typeof cardsRaw[2]?.title === 'string' ? cardsRaw[2].title : base.serviceCards[2].title,
        description:
          typeof cardsRaw[2]?.description === 'string'
            ? cardsRaw[2].description
            : base.serviceCards[2].description,
      },
    ] as SiteConfig['serviceCards']
  }

  const str = (k: keyof SiteConfig): string => {
    const v = stored[k as string]
    const d = base[k]
    return typeof v === 'string' ? v : (d as string)
  }

  return {
    brandName: str('brandName'),
    brandTagline: str('brandTagline'),
    logoUrl: str('logoUrl'),
    heroImageUrl: str('heroImageUrl'),
    heroImageAlt: str('heroImageAlt'),
    heroBadge: str('heroBadge'),
    heroTitle: str('heroTitle'),
    heroDescription: str('heroDescription'),
    heroCaption: str('heroCaption'),
    servicesTitle: str('servicesTitle'),
    servicesSubtitle: str('servicesSubtitle'),
    serviceCards,
    ctaTitle: str('ctaTitle'),
    ctaDescription: str('ctaDescription'),
    footerNotice: str('footerNotice'),
  }
}

function loadConfig(): SiteConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return {
        ...DEFAULT_SITE_CONFIG,
        serviceCards: [...DEFAULT_SITE_CONFIG.serviceCards] as unknown as SiteConfig['serviceCards'],
      }
    }
    return mergeWithDefaults(JSON.parse(raw) as unknown)
  } catch {
    return {
      ...DEFAULT_SITE_CONFIG,
      serviceCards: [...DEFAULT_SITE_CONFIG.serviceCards] as unknown as SiteConfig['serviceCards'],
    }
  }
}

function cloneConfig(c: SiteConfig): SiteConfig {
  return {
    ...c,
    serviceCards: [
      { ...c.serviceCards[0] },
      { ...c.serviceCards[1] },
      { ...c.serviceCards[2] },
    ] as SiteConfig['serviceCards'],
  }
}

function applyPatch(prev: SiteConfig, patch: Partial<SiteConfig>): SiteConfig {
  const next = cloneConfig(prev)
  const keys = Object.keys(patch) as (keyof SiteConfig)[]
  for (const key of keys) {
    const v = patch[key]
    if (v === undefined) continue
    if (key === 'serviceCards') {
      const p = patch.serviceCards!
      next.serviceCards = [
        { ...next.serviceCards[0], ...p[0] },
        { ...next.serviceCards[1], ...p[1] },
        { ...next.serviceCards[2], ...p[2] },
      ] as SiteConfig['serviceCards']
      continue
    }
    ;(next as Record<string, unknown>)[key as string] = v
  }
  return next
}

type SiteConfigContextValue = {
  config: SiteConfig
  updateConfig: (patch: Partial<SiteConfig>) => void
  updateServiceCard: (
    index: 0 | 1 | 2,
    patch: Partial<{ title: string; description: string }>,
  ) => void
  resetConfig: () => void
}

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null)

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(() => loadConfig())

  const persist = useCallback((next: SiteConfig) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* ignore quota */
    }
  }, [])

  const updateConfig = useCallback(
    (patch: Partial<SiteConfig>) => {
      setConfig((prev) => {
        const next = applyPatch(prev, patch)
        persist(next)
        return next
      })
    },
    [persist],
  )

  const updateServiceCard = useCallback(
    (index: 0 | 1 | 2, patch: Partial<{ title: string; description: string }>) => {
      setConfig((prev) => {
        const next = cloneConfig(prev)
        next.serviceCards = [
          index === 0 ? { ...next.serviceCards[0], ...patch } : { ...next.serviceCards[0] },
          index === 1 ? { ...next.serviceCards[1], ...patch } : { ...next.serviceCards[1] },
          index === 2 ? { ...next.serviceCards[2], ...patch } : { ...next.serviceCards[2] },
        ] as SiteConfig['serviceCards']
        persist(next)
        return next
      })
    },
    [persist],
  )

  const resetConfig = useCallback(() => {
    const fresh: SiteConfig = {
      ...DEFAULT_SITE_CONFIG,
      serviceCards: [...DEFAULT_SITE_CONFIG.serviceCards] as unknown as SiteConfig['serviceCards'],
    }
    setConfig(fresh)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* noop */
    }
  }, [])

  const value = useMemo(
    () => ({ config, updateConfig, updateServiceCard, resetConfig }),
    [config, updateConfig, updateServiceCard, resetConfig],
  )

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext)
  if (!ctx) {
    throw new Error('useSiteConfig debe usarse dentro de SiteConfigProvider')
  }
  return ctx
}
