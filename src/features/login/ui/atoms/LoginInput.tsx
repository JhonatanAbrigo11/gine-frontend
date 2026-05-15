import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

type LoginInputProps = ComponentProps<'input'>

export function LoginInput({ className, ...props }: LoginInputProps) {
  return (
    <input
      className={cn(
        'w-full rounded-xl border border-rose-dawn-300/80 bg-white px-4 py-3 text-slate-care-800 shadow-sm outline-none transition placeholder:text-slate-care-600/70 focus:border-teal-sage-400 focus:ring-2 focus:ring-teal-sage-200',
        className,
      )}
      {...props}
    />
  )
}
