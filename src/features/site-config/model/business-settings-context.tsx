import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  clearBusinessSettingsCache,
  fetchBusinessSettings,
  postBusinessSettings,
} from './business-settings-api'
import type { BusinessSettings } from './business-settings-types'

type BusinessSettingsContextValue = {
  settings: BusinessSettings | null
  loading: boolean
  error: string | null
  updateSettings: (data: Partial<BusinessSettings>) => Promise<BusinessSettings>
  refresh: () => Promise<void>
}

const BusinessSettingsContext = createContext<BusinessSettingsContextValue | null>(null)

export function BusinessSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<BusinessSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    fetchBusinessSettings()
      .then((data) => {
        if (!active) return
        setSettings(data)
        setError(null)
      })
      .catch((err: unknown) => {
        if (!active) return
        const message =
          err instanceof Error ? err.message : 'Error al cargar la configuración clínica'
        setError(message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const updateSettings = useCallback(async (data: Partial<BusinessSettings>) => {
    try {
      const next = await postBusinessSettings(data)
      setSettings(next)
      setError(null)
      return next
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al guardar la configuración'
      throw new Error(message)
    }
  }, [])

  const refresh = useCallback(async () => {
    clearBusinessSettingsCache()
    setLoading(true)
    setError(null)
    try {
      const data = await fetchBusinessSettings()
      setSettings(data)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar la configuración clínica'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const value = useMemo(
    () => ({
      settings,
      loading,
      error,
      updateSettings,
      refresh,
    }),
    [settings, loading, error, updateSettings, refresh],
  )

  return (
    <BusinessSettingsContext.Provider value={value}>{children}</BusinessSettingsContext.Provider>
  )
}

export function useBusinessSettings() {
  const ctx = useContext(BusinessSettingsContext)
  if (!ctx) {
    throw new Error('useBusinessSettings debe usarse dentro de BusinessSettingsProvider')
  }
  return ctx
}
