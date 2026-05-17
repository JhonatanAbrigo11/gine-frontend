import type { LucideIcon } from 'lucide-react'
import {
  FileText,
  ImageIcon,
  Layers,
  Megaphone,
  Receipt,
  Sparkles,
  Pill,
} from 'lucide-react'

export type ConfigSectionId =
  | 'global-brand'
  | 'landing-hero'
  | 'landing-services'
  | 'landing-cta'
  | 'clinical-reports'
  | 'clinical-billing'
  | 'clinical-recipes'

export type ConfigNavItem = {
  id: ConfigSectionId
  label: string
  title: string
  description: string
  Icon: LucideIcon
}

export const CONFIG_NAV_ITEMS: ConfigNavItem[] = [
  {
    id: 'global-brand',
    label: 'Marca',
    title: 'Identidad de marca',
    description: 'Nombre, eslogan y logo que verán en la landing y el panel.',
    Icon: Sparkles,
  },
  {
    id: 'landing-hero',
    label: 'Hero',
    title: 'Portada principal',
    description: 'Imagen, títulos y mensaje de bienvenida de la página pública.',
    Icon: ImageIcon,
  },
  {
    id: 'landing-services',
    label: 'Servicios',
    title: 'Servicios ofrecidos',
    description: 'Tarjetas con imagen, título y descripción de cada servicio.',
    Icon: Layers,
  },
  {
    id: 'landing-cta',
    label: 'CTA',
    title: 'Llamado a la acción',
    description: 'Bloque final que invita a agendar o contactar.',
    Icon: Megaphone,
  },
  {
    id: 'clinical-reports',
    label: 'Informes',
    title: 'Informes clínicos',
    description: 'Datos de la clínica, encabezado y pie para documentos PDF.',
    Icon: FileText,
  },
  {
    id: 'clinical-billing',
    label: 'Facturación',
    title: 'Facturación',
    description: 'Serie, numeración y moneda para comprobantes.',
    Icon: Receipt,
  },
  {
    id: 'clinical-recipes',
    label: 'Recetas',
    title: 'Recetas Médicas',
    description: 'Encabezado, pie de página, vigencia por defecto y advertencias de la receta.',
    Icon: Pill,
  },
]

export const LANDING_SECTIONS = new Set<ConfigSectionId>([
  'global-brand',
  'landing-hero',
  'landing-services',
  'landing-cta',
])

export function isClinicalSection(id: ConfigSectionId) {
  return id === 'clinical-reports' || id === 'clinical-billing' || id === 'clinical-recipes'
}

export function getSectionIndex(id: ConfigSectionId): number {
  return CONFIG_NAV_ITEMS.findIndex((item) => item.id === id)
}

export function getSectionMeta(id: ConfigSectionId): ConfigNavItem {
  return CONFIG_NAV_ITEMS[getSectionIndex(id)] ?? CONFIG_NAV_ITEMS[0]
}

export function getAdjacentSection(
  id: ConfigSectionId,
  direction: 'prev' | 'next',
): ConfigSectionId | null {
  const index = getSectionIndex(id)
  if (index < 0) return null
  const nextIndex = direction === 'next' ? index + 1 : index - 1
  return CONFIG_NAV_ITEMS[nextIndex]?.id ?? null
}
