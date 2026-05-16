import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

type LoginInputProps = ComponentProps<'input'>

export function LoginInput({ className, ...props }: LoginInputProps) {
  return (
    <input
      className={cn(
        'w-full h-12 rounded-2xl border border-primary-100 bg-white/80 px-5 text-sm font-medium text-clinical-900 shadow-sm outline-none transition backdrop-blur-sm placeholder:text-clinical-800/30 focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10',
        className,
      )}
      {...props}
    />
  )
}
