import { api } from '@/shared/api/base'

import type { SiteConfig } from './types'

let cached: SiteConfig | null = null
let inflight: Promise<SiteConfig> | null = null

export async function fetchSiteConfig(): Promise<SiteConfig> {
  if (cached) return cached
  if (inflight) return inflight

  inflight = api
    .get<SiteConfig>('/site-config')
    .then((res) => {
      cached = res.data
      return res.data
    })
    .finally(() => {
      inflight = null
    })

  return inflight
}

export function setSiteConfigCache(data: SiteConfig): void {
  cached = data
}

export function clearSiteConfigCache(): void {
  cached = null
  inflight = null
}

export async function postSiteConfig(
  data: Partial<SiteConfig> & { reset?: boolean },
): Promise<SiteConfig> {
  const res = await api.post<SiteConfig>('/site-config', data)
  setSiteConfigCache(res.data)
  return res.data
}
