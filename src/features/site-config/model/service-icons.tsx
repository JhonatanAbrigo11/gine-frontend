import type { ReactNode } from 'react'
import {
  Baby,
  CalendarDays,
  Heart,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from 'lucide-react'

import type { ServiceIconId } from '@/features/site-config/model/types'

export const SERVICE_ICON_OPTIONS: { id: ServiceIconId; label: string }[] = [
  { id: 'stethoscope', label: 'Consulta' },
  { id: 'shield', label: 'Prevención' },
  { id: 'calendar', label: 'Agenda' },
  { id: 'heart', label: 'Bienestar' },
  { id: 'baby', label: 'Obstetricia' },
  { id: 'sparkles', label: 'Especial' },
]

const ICON_MAP: Record<ServiceIconId, (className?: string) => ReactNode> = {
  stethoscope: (c) => <Stethoscope className={c} />,
  shield: (c) => <ShieldCheck className={c} />,
  calendar: (c) => <CalendarDays className={c} />,
  heart: (c) => <Heart className={c} />,
  baby: (c) => <Baby className={c} />,
  sparkles: (c) => <Sparkles className={c} />,
}

export function ServiceIcon({
  id,
  className = 'h-6 w-6',
}: {
  id: ServiceIconId
  className?: string
}) {
  return ICON_MAP[id]?.(className) ?? ICON_MAP.stethoscope(className)
}

export function serviceIconFallback(index: number): ServiceIconId {
  const order: ServiceIconId[] = ['stethoscope', 'shield', 'calendar', 'heart', 'baby', 'sparkles']
  return order[index % order.length]
}
