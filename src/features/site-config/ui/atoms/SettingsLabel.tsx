import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

type SettingsLabelProps = ComponentProps<'label'>

export function SettingsLabel({ className, ...props }: SettingsLabelProps) {
  return (
    <label
      className={cn('block text-xs font-semibold uppercase tracking-wide text-teal-sage-900', className)}
      {...props}
    />
  )
}
