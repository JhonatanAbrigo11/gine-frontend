export type ServiceIconId =
  | 'stethoscope'
  | 'shield'
  | 'calendar'
  | 'heart'
  | 'baby'
  | 'sparkles'

export type ServiceCardConfig = {
  id: string
  title: string
  description: string
  imageUrl?: string
  icon: ServiceIconId
}

export type SiteConfig = {
  brandName: string
  brandTagline: string
  logoUrl: string

  heroImageUrl: string
  heroImageAlt: string
  heroBadge: string
  heroTitle: string
  heroDescription: string
  heroCaption: string

  servicesTitle: string
  servicesSubtitle: string
  serviceCards: ServiceCardConfig[]

  ctaTitle: string
  ctaDescription: string

  footerNotice: string
}

export const MAX_SERVICE_CARDS = 10
export const MIN_SERVICE_CARDS = 1
