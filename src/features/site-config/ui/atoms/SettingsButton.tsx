import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

type SettingsButtonProps = ComponentProps<'button'>

export function SettingsButton({ className, type = 'button', ...props }: SettingsButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-xl border border-teal-sage-300 bg-white px-3 py-2 text-xs font-semibold text-teal-sage-900 shadow-sm transition',
        'hover:border-teal-sage-500 hover:bg-teal-sage-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-sage-300 disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
