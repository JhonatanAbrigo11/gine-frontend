import { api } from '@/shared/api/base'

import type { BusinessSettings } from './business-settings-types'

let cached: BusinessSettings | null = null
let inflight: Promise<BusinessSettings> | null = null

/** Una sola petición GET en vuelo; reutiliza caché en memoria. */
export async function fetchBusinessSettings(): Promise<BusinessSettings> {
  if (cached) return cached
  if (inflight) return inflight

  inflight = api
    .get<BusinessSettings>('/settings')
    .then((res) => {
      cached = res.data
      return res.data
    })
    .finally(() => {
      inflight = null
    })

  return inflight
}

export function setBusinessSettingsCache(data: BusinessSettings): void {
  cached = data
}

export function clearBusinessSettingsCache(): void {
  cached = null
  inflight = null
}

export async function postBusinessSettings(
  data: Partial<BusinessSettings>,
): Promise<BusinessSettings> {
  const res = await api.post<BusinessSettings>('/settings', data)
  setBusinessSettingsCache(res.data)
  return res.data
}
