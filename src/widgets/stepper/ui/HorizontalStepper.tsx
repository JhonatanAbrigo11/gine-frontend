import type { LucideIcon } from 'lucide-react'

import { cn } from '@/shared/lib/cn'

export type HorizontalStepperStep = {
  id: string
  label: string
  Icon: LucideIcon
}

export type HorizontalStepperProps = {
  steps: HorizontalStepperStep[]
  currentIndex: number
  onStepChange: (index: number) => void
  className?: string
}

/** Indicador horizontal de pasos, alineado con módulos autenticados. */
export function HorizontalStepper({
  steps,
  currentIndex,
  onStepChange,
  className,
}: HorizontalStepperProps) {
  return (
    <nav
      className={cn('w-full min-w-0', className)}
      aria-label="Pasos de configuración"
    >
      <div className="px-1">
        <ol className="m-0 flex list-none gap-2 p-0 sm:gap-3">
          {steps.map((step, index) => {
            const isActive = index === currentIndex
            const isComplete = index < currentIndex

            return (
              <li key={step.id} className="min-w-0 flex-1">
                <button
                  type="button"
                  aria-current={isActive ? 'step' : undefined}
                  onClick={() => onStepChange(index)}
                  className={cn(
                    'group flex min-w-0 flex-1 flex-col items-center gap-2 rounded-xl py-1 transition',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all',
                      isActive &&
                        'bg-primary-600 text-white shadow-lg shadow-primary-200',
                      !isActive &&
                        isComplete &&
                        'bg-primary-100 text-primary-700 group-hover:bg-primary-200',
                      !isActive &&
                        !isComplete &&
                        'bg-clinical-100 text-clinical-400 group-hover:bg-clinical-200 group-hover:text-clinical-600',
                    )}
                  >
                    <step.Icon className="h-5 w-5 shrink-0" aria-hidden strokeWidth={2} />
                  </span>
                  <span
                    className={cn(
                      'max-w-full truncate px-0.5 text-center text-[10px] font-bold uppercase leading-tight tracking-widest',
                      isActive && 'text-primary-700',
                      !isActive && isComplete && 'text-primary-600/80',
                      !isActive && !isComplete && 'text-clinical-400',
                    )}
                    title={step.label}
                  >
                    {step.label}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
