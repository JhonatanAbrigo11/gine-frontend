import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

type SettingsInputProps = ComponentProps<'input'>

export function SettingsInput({ className, ...props }: SettingsInputProps) {
  return (
    <input
      className={cn(
        'h-12 w-full rounded-2xl border-0 bg-white px-4 text-sm font-medium text-clinical-900 shadow-premium outline-none ring-1 ring-inset ring-primary-100/50 transition-all',
        'placeholder:text-clinical-400 focus:ring-2 focus:ring-primary-500',
        className,
      )}
      {...props}
    />
  )
}
