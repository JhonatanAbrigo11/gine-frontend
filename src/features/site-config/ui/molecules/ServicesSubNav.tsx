import { Plus } from 'lucide-react'

import { serviceDisplayLabel } from '@/features/site-config/model/service-card-defaults'
import { cn } from '@/shared/lib/cn'

type ServicesSubNavProps = {
  activeIndex: number
  serviceCount: number
  canAdd: boolean
  onSelect: (index: number) => void
  onAdd: () => void
}

export function ServicesSubNav({
  activeIndex,
  serviceCount,
  canAdd,
  onSelect,
  onAdd,
}: ServicesSubNavProps) {
  return (
    <nav
      className="flex flex-wrap items-center gap-2 border-b border-clinical-100/80 pb-4"
      aria-label="Subsecciones de servicios"
    >
      {Array.from({ length: serviceCount }, (_, i) => (
        <SubNavPill
          key={i}
          label={serviceDisplayLabel(i)}
          isActive={activeIndex === i}
          onClick={() => onSelect(i)}
        />
      ))}
      {canAdd ? (
        <button
          type="button"
          title="Agregar servicio"
          aria-label="Agregar servicio"
          onClick={onAdd}
          className={cn(
            'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all',
            'bg-white text-primary-600 ring-1 ring-inset ring-primary-100/50',
            'hover:bg-primary-50 hover:text-primary-700 hover:ring-primary-200',
          )}
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </button>
      ) : null}
    </nav>
  )
}

function SubNavPill({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-xl px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all',
        isActive
          ? 'bg-primary-600 text-white shadow-md shadow-primary-200/80'
          : 'bg-white text-clinical-600 ring-1 ring-inset ring-primary-100/50 hover:text-primary-700',
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {label}
    </button>
  )
}
