import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

type SettingsTextareaProps = ComponentProps<'textarea'>

export function SettingsTextarea({ className, rows = 3, ...props }: SettingsTextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(
        'w-full resize-y rounded-xl border border-rose-dawn-300/80 bg-white px-3 py-2 text-sm text-slate-care-900 shadow-sm outline-none transition',
        'placeholder:text-slate-care-600/60 focus:border-teal-sage-400 focus:ring-2 focus:ring-teal-sage-200',
        className,
      )}
      {...props}
    />
  )
}
