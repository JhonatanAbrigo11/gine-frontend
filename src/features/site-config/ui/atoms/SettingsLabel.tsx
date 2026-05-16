import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

type SettingsLabelProps = ComponentProps<'label'>

export function SettingsLabel({ className, ...props }: SettingsLabelProps) {
  return (
    <label
      className={cn(
        'block px-1 text-xs font-bold uppercase tracking-widest text-clinical-900/60',
        className,
      )}
      {...props}
    />
  )
}
