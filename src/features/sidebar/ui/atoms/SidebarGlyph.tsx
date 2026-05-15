import type { ReactNode } from 'react'

import { cn } from '@/shared/lib/cn'

type SidebarGlyphProps = {
  className?: string
  title: string
  children: ReactNode
}

export function SidebarGlyph({ className, title, children }: SidebarGlyphProps) {
  return (
    <span
      title={title}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-teal-sage-800 shadow-sm ring-1 ring-teal-sage-200/70',
        className,
      )}
      aria-hidden
    >
      {children}
    </span>
  )
}
