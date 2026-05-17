import type { ConfigNavItem, ConfigSectionId } from '@/features/site-config/model/config-nav'
import { CONFIG_NAV_ITEMS } from '@/features/site-config/model/config-nav'
import { cn } from '@/shared/lib/cn'

type ConfigPageNavProps = {
  activeId: ConfigSectionId
  onSelect: (id: ConfigSectionId) => void
}

export function ConfigPageNav({ activeId, onSelect }: ConfigPageNavProps) {
  return (
    <nav
      className="flex flex-wrap gap-2"
      aria-label="Secciones de configuración"
    >
      {CONFIG_NAV_ITEMS.map((item: ConfigNavItem) => {
        const isActive = activeId === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={cn(
              'shrink-0 rounded-2xl px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all',
              isActive
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                : 'bg-white text-clinical-600 ring-1 ring-inset ring-primary-100/50 hover:text-primary-700',
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
