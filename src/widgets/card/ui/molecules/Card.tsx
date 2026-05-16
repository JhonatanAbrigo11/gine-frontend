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
        'glass-card rounded-[2rem] p-7 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-premium',
        className,
      )}
      {...props}
    >
      {icon ? (
        <div className="flex flex-col gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700 shadow-sm border border-white">
            {icon}
          </div>
          <div className="space-y-2">
            {title ? (
              <h3 className="font-display text-xl font-bold text-clinical-900 leading-tight">{title}</h3>
            ) : null}
            {description ? (
              <p className="text-sm leading-relaxed text-clinical-800/60 font-medium">{description}</p>
            ) : null}
          </div>
        </div>
      ) : (
        <>
          {title ? (
            <h3 className="font-display text-xl font-bold text-clinical-900 leading-tight">{title}</h3>
          ) : null}
          {description ? (
            <p className="text-sm leading-relaxed text-clinical-800/60 font-medium">{description}</p>
          ) : null}
        </>
      )}
      {children}
      {footer}
    </article>
  )
}
