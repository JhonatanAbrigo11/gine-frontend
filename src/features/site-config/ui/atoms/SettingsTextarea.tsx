import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

type SettingsTextareaProps = ComponentProps<'textarea'>

export function SettingsTextarea({ className, rows = 3, ...props }: SettingsTextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(
        'w-full resize-y rounded-2xl border-0 bg-white p-4 text-sm font-medium text-clinical-900 shadow-premium outline-none ring-1 ring-inset ring-primary-100/50 transition-all',
        'placeholder:text-clinical-400 focus:ring-2 focus:ring-primary-500',
        className,
      )}
      {...props}
    />
  )
}
