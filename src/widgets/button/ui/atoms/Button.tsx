import { forwardRef, type ButtonHTMLAttributes } from 'react'

import { cn } from '@/shared/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-700 text-white shadow-premium hover:bg-primary-600 active:bg-primary-800 disabled:opacity-60',
  secondary:
    'bg-white text-clinical-900 border border-clinical-200 hover:border-primary-300 hover:bg-primary-50/50 disabled:opacity-60',
  ghost: 'bg-transparent text-primary-900 hover:bg-primary-100/50 disabled:opacity-60',
}

export const buttonBaseClasses =
  'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition focus-visible:outline-none disabled:cursor-not-allowed'

export function composeButtonClassName(variant: ButtonVariant, className?: string) {
  return cn(buttonBaseClasses, buttonVariantClasses[variant], className)
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={composeButtonClassName(variant, className)}
      {...props}
    />
  )
})
