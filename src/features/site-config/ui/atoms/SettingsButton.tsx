import type { ComponentProps } from 'react'

import { composeButtonClassName } from '@/widgets/button'
import { cn } from '@/shared/lib/cn'

type SettingsButtonProps = ComponentProps<'button'>

/** Botón auxiliar alineado con `Button` secondary del design system. */
export function SettingsButton({ className, type = 'button', ...props }: SettingsButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        composeButtonClassName('secondary', 'h-10 rounded-2xl px-4 py-2 text-xs'),
        className,
      )}
      {...props}
    />
  )
}
