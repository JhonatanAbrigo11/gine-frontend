import { forwardRef, type ButtonHTMLAttributes } from 'react'

import { cn } from '@/shared/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-teal-sage-600 text-white shadow-soft hover:bg-teal-sage-500 active:bg-teal-sage-700 disabled:opacity-60',
  secondary:
    'bg-white text-teal-sage-900 border border-teal-sage-200 hover:border-teal-sage-400 hover:bg-teal-sage-100/60 disabled:opacity-60',
  ghost: 'bg-transparent text-teal-sage-800 hover:bg-teal-sage-100/80 disabled:opacity-60',
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
