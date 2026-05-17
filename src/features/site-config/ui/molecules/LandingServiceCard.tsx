import type { ServiceCardConfig } from '@/features/site-config/model/types'
import { ServiceIcon } from '@/features/site-config/model/service-icons'
import { cn } from '@/shared/lib/cn'

type LandingServiceCardProps = {
  service: ServiceCardConfig
  className?: string
}

export function LandingServiceCard({ service, className }: LandingServiceCardProps) {
  const hasImage = Boolean(service.imageUrl)

  return (
    <article
      className={cn(
        'glass-card flex h-full flex-col overflow-hidden rounded-[2rem] transition-all duration-300 hover:translate-y-[-4px] hover:shadow-premium',
        className,
      )}
    >
      {hasImage ? (
        <div className="relative h-48 w-full shrink-0 overflow-hidden">
          <img
            src={service.imageUrl}
            alt={service.title}
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-primary-700 shadow-md ring-1 ring-white/80 backdrop-blur-sm">
            <ServiceIcon id={service.icon} className="h-5 w-5" />
          </span>
        </div>
      ) : (
        <div className="flex h-48 shrink-0 items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100/60">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-primary-700 shadow-md ring-1 ring-primary-100/80">
            <ServiceIcon id={service.icon} className="h-8 w-8" />
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-7">
        <h3 className="font-display text-xl font-bold leading-tight text-clinical-900">
          {service.title}
        </h3>
        <p className="text-sm font-medium leading-relaxed text-clinical-800/60">
          {service.description}
        </p>
      </div>
    </article>
  )
}
