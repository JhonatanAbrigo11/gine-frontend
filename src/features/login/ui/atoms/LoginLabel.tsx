import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

type LoginLabelProps = ComponentProps<'label'>

export function LoginLabel({ className, ...props }: LoginLabelProps) {
  return (
    <label
      className={cn('block text-xs font-bold uppercase tracking-widest text-clinical-900/60 mb-2 px-1', className)}
      {...props}
    />
  )
}
