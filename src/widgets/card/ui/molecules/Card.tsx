import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string
  description?: string
  icon?: ReactNode
  footer?: ReactNode
}

export function Card({
  className,
  title,
  description,
  icon,
  footer,
  children,
  ...props
}: CardProps) {
  return (
    <article
      className={cn(
        'flex flex-col gap-4 rounded-3xl border border-rose-dawn-200/80 bg-white/80 p-6 shadow-soft backdrop-blur-sm',
        className,
      )}
      {...props}
    >
      {icon ? (
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-sage-100 text-teal-sage-700">
            {icon}
          </div>
          <div className="space-y-1">
            {title ? (
              <h3 className="font-display text-lg font-semibold text-slate-care-900">{title}</h3>
            ) : null}
            {description ? (
              <p className="text-sm leading-relaxed text-slate-care-600">{description}</p>
            ) : null}
          </div>
        </div>
      ) : (
        <>
          {title ? (
            <h3 className="font-display text-lg font-semibold text-slate-care-900">{title}</h3>
          ) : null}
          {description ? (
            <p className="text-sm leading-relaxed text-slate-care-600">{description}</p>
          ) : null}
        </>
      )}
      {children}
      {footer}
    </article>
  )
}
