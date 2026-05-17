import { serviceIconFallback } from './service-icons'
import type { ServiceCardConfig, ServiceIconId } from './types'

/** Imágenes de ejemplo para servicios nuevos o sin foto. */
export const SERVICE_PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1551076805-e1869038a561?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1631217868264-e5b1b5c4b1c5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1666214280557-f1b7c8c4e0e0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1579684385127-1ef15a5089a2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1584820927498-cfe5211fdcd0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b29?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec3?auto=format&fit=crop&w=800&q=80',
] as const

export function createServiceId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `svc-${crypto.randomUUID()}`
  }
  return `svc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function serviceDisplayLabel(index: number): string {
  return `Servicio ${index + 1}`
}

export function placeholderImageForIndex(index: number): string {
  return SERVICE_PLACEHOLDER_IMAGES[index % SERVICE_PLACEHOLDER_IMAGES.length]
}

export function createServiceCard(
  index: number,
  overrides?: Partial<Omit<ServiceCardConfig, 'id'>> & { id?: string },
): ServiceCardConfig {
  const { id: overrideId, ...rest } = overrides ?? {}
  return {
    id: overrideId ?? createServiceId(),
    title: serviceDisplayLabel(index),
    description:
      'Describa el servicio que ofrece su clínica: qué incluye, a quién va dirigido y por qué elegirlo.',
    imageUrl: placeholderImageForIndex(index),
    icon: serviceIconFallback(index),
    ...rest,
  }
}

export function cloneServiceCard(card: ServiceCardConfig, newIndex: number): ServiceCardConfig {
  return {
    ...card,
    id: createServiceId(),
    title: serviceDisplayLabel(newIndex),
    imageUrl: card.imageUrl || placeholderImageForIndex(newIndex),
    icon: card.icon as ServiceIconId,
  }
}
