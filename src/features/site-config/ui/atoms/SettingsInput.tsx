import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

type SettingsInputProps = ComponentProps<'input'>

export function SettingsInput({ className, ...props }: SettingsInputProps) {
  return (
    <input
      className={cn(
        'h-12 w-full rounded-2xl border-none bg-white px-4 text-sm font-medium text-clinical-900 shadow-sm outline-none ring-1 ring-clinical-200 transition-all',
        'placeholder:text-clinical-400 focus:ring-2 focus:ring-primary-500',
        className,
      )}
      {...props}
    />
  )
}
