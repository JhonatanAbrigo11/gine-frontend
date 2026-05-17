import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { DEFAULT_SITE_CONFIG } from './default-site-config'
import {
  cloneServiceCard,
  createServiceCard,
  createServiceId,
} from './service-card-defaults'
import { serviceIconFallback } from './service-icons'
import {
  fetchSiteConfig,
  postSiteConfig,
  setSiteConfigCache,
} from './site-config-api'
import type { ServiceCardConfig, ServiceIconId, SiteConfig } from './types'
import { MAX_SERVICE_CARDS, MIN_SERVICE_CARDS } from './types'

const STORAGE_KEY = 'gine-site-config-v4'
const LEGACY_STORAGE_KEYS = [
  'gine-site-config-v3',
  'gine-site-config-v2',
  'gine-site-config-v1',
]
const SAVE_DEBOUNCE_MS = 900

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function parseIcon(v: unknown, index: number): ServiceIconId {
  const valid: ServiceIconId[] = [
    'stethoscope',
    'shield',
    'calendar',
    'heart',
    'baby',
    'sparkles',
  ]
  return typeof v === 'string' && valid.includes(v as ServiceIconId)
    ? (v as ServiceIconId)
    : serviceIconFallback(index)
}

function normalizeServiceCards(raw: unknown): ServiceCardConfig[] {
  const base = DEFAULT_SITE_CONFIG.serviceCards
  if (!Array.isArray(raw) || raw.length === 0) {
    return base.map((c) => ({ ...c }))
  }

  const parsed = raw.slice(0, MAX_SERVICE_CARDS).map((item, i) => {
    const rec = isRecord(item) ? item : {}
    const fallback = base[i] ?? base[0]
    return {
      id:
        typeof rec.id === 'string' && rec.id
          ? rec.id
          : typeof fallback.id === 'string'
            ? fallback.id
            : createServiceId(),
      title: typeof rec.title === 'string' ? rec.title : fallback.title,
      description:
        typeof rec.description === 'string' ? rec.description : fallback.description,
      imageUrl: typeof rec.imageUrl === 'string' && rec.imageUrl ? rec.imageUrl : undefined,
      icon: parseIcon(rec.icon, i),
    }
  })

  return parsed.length >= MIN_SERVICE_CARDS
    ? parsed
    : base.map((c) => ({ ...c }))
}

export function mergeWithDefaults(stored: unknown): SiteConfig {
  const base = DEFAULT_SITE_CONFIG
  if (!isRecord(stored)) {
    return {
      ...base,
      serviceCards: base.serviceCards.map((c) => ({ ...c })),
    }
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
    serviceCards: normalizeServiceCards(stored.serviceCards),
    ctaTitle: str('ctaTitle'),
    ctaDescription: str('ctaDescription'),
    footerNotice: str('footerNotice'),
  }
}

function loadConfigFromLocal(): SiteConfig {
  const keys = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS]
  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) continue
      const config = mergeWithDefaults(JSON.parse(raw) as unknown)
      if (key !== STORAGE_KEY) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
        } catch {
          /* ignore */
        }
      }
      return config
    } catch {
      continue
    }
  }
  return {
    ...DEFAULT_SITE_CONFIG,
    serviceCards: DEFAULT_SITE_CONFIG.serviceCards.map((c) => ({ ...c })),
  }
}

function persistLocal(next: SiteConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* ignore quota */
  }
}

function cloneConfig(c: SiteConfig): SiteConfig {
  return {
    ...c,
    serviceCards: c.serviceCards.map((card) => ({ ...card })),
  }
}

function applyPatch(prev: SiteConfig, patch: Partial<SiteConfig>): SiteConfig {
  const next = cloneConfig(prev)
  const keys = Object.keys(patch) as (keyof SiteConfig)[]
  for (const key of keys) {
    const v = patch[key]
    if (v === undefined) continue
    if (key === 'serviceCards' && Array.isArray(v)) {
      next.serviceCards = normalizeServiceCards(v)
      continue
    }
    ;(next as Record<string, unknown>)[key as string] = v
  }
  return next
}

type SiteConfigContextValue = {
  config: SiteConfig
  loading: boolean
  syncing: boolean
  updateConfig: (patch: Partial<SiteConfig>) => void
  updateServiceCard: (index: number, patch: Partial<ServiceCardConfig>) => void
  addServiceCard: () => void
  removeServiceCard: (index: number) => void
  duplicateServiceCard: (index: number) => void
  moveServiceCard: (index: number, direction: 'up' | 'down') => void
  resetConfig: () => Promise<void>
}

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null)

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(() => loadConfigFromLocal())
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scheduleRemoteSave = useCallback((next: SiteConfig) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      setSyncing(true)
      postSiteConfig(next)
        .then((saved) => {
          const normalized = mergeWithDefaults(saved)
          setSiteConfigCache(normalized)
        })
        .catch(() => {
          /* se mantiene copia local */
        })
        .finally(() => setSyncing(false))
    }, SAVE_DEBOUNCE_MS)
  }, [])

  const persist = useCallback(
    (next: SiteConfig) => {
      persistLocal(next)
      setSiteConfigCache(next)
      scheduleRemoteSave(next)
    },
    [scheduleRemoteSave],
  )

  useEffect(() => {
    let active = true
    fetchSiteConfig()
      .then((data) => {
        if (!active) return
        const normalized = mergeWithDefaults(data)
        setConfig(normalized)
        persistLocal(normalized)
        setSiteConfigCache(normalized)
      })
      .catch(() => {
        if (!active) return
        setConfig(loadConfigFromLocal())
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
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
    (index: number, patch: Partial<ServiceCardConfig>) => {
      setConfig((prev) => {
        const next = cloneConfig(prev)
        if (index < 0 || index >= next.serviceCards.length) return prev
        next.serviceCards[index] = { ...next.serviceCards[index], ...patch }
        persist(next)
        return next
      })
    },
    [persist],
  )

  const addServiceCard = useCallback(() => {
    setConfig((prev) => {
      if (prev.serviceCards.length >= MAX_SERVICE_CARDS) return prev
      const next = cloneConfig(prev)
      const i = next.serviceCards.length
      next.serviceCards.push(createServiceCard(i))
      persist(next)
      return next
    })
  }, [persist])

  const removeServiceCard = useCallback(
    (index: number) => {
      setConfig((prev) => {
        if (prev.serviceCards.length <= MIN_SERVICE_CARDS) return prev
        if (index < 0 || index >= prev.serviceCards.length) return prev
        const next = cloneConfig(prev)
        next.serviceCards.splice(index, 1)
        persist(next)
        return next
      })
    },
    [persist],
  )

  const duplicateServiceCard = useCallback(
    (index: number) => {
      setConfig((prev) => {
        if (prev.serviceCards.length >= MAX_SERVICE_CARDS) return prev
        if (index < 0 || index >= prev.serviceCards.length) return prev
        const next = cloneConfig(prev)
        const copy = cloneServiceCard(prev.serviceCards[index], next.serviceCards.length)
        next.serviceCards.splice(index + 1, 0, copy)
        persist(next)
        return next
      })
    },
    [persist],
  )

  const moveServiceCard = useCallback(
    (index: number, direction: 'up' | 'down') => {
      setConfig((prev) => {
        const target = direction === 'up' ? index - 1 : index + 1
        if (index < 0 || index >= prev.serviceCards.length) return prev
        if (target < 0 || target >= prev.serviceCards.length) return prev
        const next = cloneConfig(prev)
        const [item] = next.serviceCards.splice(index, 1)
        next.serviceCards.splice(target, 0, item)
        persist(next)
        return next
      })
    },
    [persist],
  )

  const resetConfig = useCallback(async () => {
    setSyncing(true)
    try {
      const saved = await postSiteConfig({ reset: true })
      const fresh = mergeWithDefaults(saved)
      setConfig(fresh)
      persistLocal(fresh)
      setSiteConfigCache(fresh)
    } finally {
      setSyncing(false)
    }
  }, [])

  const value = useMemo(
    () => ({
      config,
      loading,
      syncing,
      updateConfig,
      updateServiceCard,
      addServiceCard,
      removeServiceCard,
      duplicateServiceCard,
      moveServiceCard,
      resetConfig,
    }),
    [
      config,
      loading,
      syncing,
      updateConfig,
      updateServiceCard,
      addServiceCard,
      removeServiceCard,
      duplicateServiceCard,
      moveServiceCard,
      resetConfig,
    ],
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
