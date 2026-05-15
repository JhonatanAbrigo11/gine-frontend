import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

type LoginLabelProps = ComponentProps<'label'>

export function LoginLabel({ className, ...props }: LoginLabelProps) {
  return (
    <label
      className={cn('text-sm font-medium text-slate-care-800', className)}
      {...props}
    />
  )
}
