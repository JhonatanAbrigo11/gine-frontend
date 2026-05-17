import { Check } from 'lucide-react'

import {
  CONFIG_NAV_ITEMS,
  getSectionIndex,
  type ConfigSectionId,
} from '@/features/site-config/model/config-nav'
import { cn } from '@/shared/lib/cn'

type ConfigProgressStepperProps = {
  activeId: ConfigSectionId
  onSelect: (id: ConfigSectionId) => void
}

type StepState = 'completed' | 'active' | 'upcoming'

export function ConfigProgressStepper({ activeId, onSelect }: ConfigProgressStepperProps) {
  const activeIndex = getSectionIndex(activeId)

  return (
    <nav aria-label="Progreso de configuración" className="w-full">
      <ol className="relative flex min-w-[36rem] items-start justify-between gap-1 sm:min-w-0">
        <li
          aria-hidden
          className="pointer-events-none absolute left-[8%] right-[8%] top-5 hidden h-px bg-clinical-200 sm:block"
        />
        {CONFIG_NAV_ITEMS.map((item, index) => {
          const state: StepState =
            index < activeIndex ? 'completed' : index === activeIndex ? 'active' : 'upcoming'
          const Icon = item.Icon

          return (
            <li key={item.id} className="relative z-[1] flex min-w-[4.5rem] flex-1 flex-col items-center">
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                aria-current={state === 'active' ? 'step' : undefined}
                className="group flex flex-col items-center gap-2 outline-none"
              >
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl border-2 bg-white transition-all',
                    state === 'active' &&
                      'border-primary-600 text-primary-600 shadow-md shadow-primary-100 ring-4 ring-primary-50',
                    state === 'completed' &&
                      'border-primary-200 bg-primary-50 text-primary-600 group-hover:border-primary-400',
                    state === 'upcoming' &&
                      'border-clinical-200 text-clinical-400 group-hover:border-clinical-300 group-hover:text-clinical-600',
                  )}
                >
                  {state === 'completed' ? (
                    <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                  ) : (
                    <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
                  )}
                </span>
                <span
                  className={cn(
                    'max-w-[5.5rem] text-center text-[9px] font-bold uppercase leading-tight tracking-wide sm:text-[10px]',
                    state === 'active' && 'text-primary-700',
                    state === 'completed' && 'text-primary-600/80',
                    state === 'upcoming' && 'text-clinical-400',
                  )}
                >
                  {item.label}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
