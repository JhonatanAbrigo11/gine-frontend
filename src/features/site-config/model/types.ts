export type ServiceCardConfig = {
  title: string
  description: string
}

export type SiteConfig = {
  brandName: string
  brandTagline: string
  /** URL o data URL; vacío = icono vectorial por defecto */
  logoUrl: string

  heroImageUrl: string
  heroImageAlt: string
  heroBadge: string
  heroTitle: string
  heroDescription: string
  heroCaption: string

  servicesTitle: string
  servicesSubtitle: string
  serviceCards: readonly [ServiceCardConfig, ServiceCardConfig, ServiceCardConfig]

  ctaTitle: string
  ctaDescription: string

  footerNotice: string
}
