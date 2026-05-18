import type { LucideIcon } from 'lucide-react'
import {
  FileText,
  Receipt,
  Pill,
  Users,
} from 'lucide-react'

export type ConfigSectionId =
  | 'clinical-reports'
  | 'clinical-billing'
  | 'clinical-recipes'
  | 'clinical-users'

export type ConfigNavItem = {
  id: ConfigSectionId
  label: string
  title: string
  description: string
  Icon: LucideIcon
}

export const CONFIG_NAV_ITEMS: ConfigNavItem[] = [
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
  {
    id: 'clinical-users',
    label: 'Usuarios',
    title: 'Usuarios del Sistema',
    description: 'Administración de usuarios: crear, editar, suspender y cambiar contraseñas.',
    Icon: Users,
  },
]

export const LANDING_SECTIONS = new Set<ConfigSectionId>([])

export function isClinicalSection(id: ConfigSectionId) {
  return id === 'clinical-reports' || id === 'clinical-billing' || id === 'clinical-recipes' || id === 'clinical-users'
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

