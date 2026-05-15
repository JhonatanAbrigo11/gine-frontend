import { Link } from 'react-router-dom'

import { useSiteConfig } from '@/features/site-config/model/site-config-context'
import { ROUTES } from '@/shared/config/routes'
import { composeButtonClassName } from '@/widgets/button'
import { Card } from '@/widgets/card'
import { PageHeader } from '@/widgets/header'

function IconStethoscope() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
      <path
        strokeWidth="1.7"
        strokeLinecap="round"
        d="M6.5 8.5V7a4 4 0 0 1 4-4h.2a4 4 0 0 1 3.8 2.7"
      />
      <path strokeWidth="1.7" strokeLinecap="round" d="M6.5 8.5a2.5 2.5 0 1 0 0 5M17.5 10.5v5a3 3 0 0 1-3 3h-.5" />
      <path strokeWidth="1.7" strokeLinecap="round" d="M14 18.5h2.5a2 2 0 0 0 2-2V12" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
      <path
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3 5 6v5c0 5 3.5 9 7 10 3.5-1 7-5 7-10V6l-7-3Z"
      />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
      <path
        strokeWidth="1.7"
        strokeLinecap="round"
        d="M8 6.5V4m8 2.5V4M5.5 9h13M7 20h10a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2Z"
      />
    </svg>
  )
}

const serviceIcons = [<IconStethoscope key="a" />, <IconShield key="b" />, <IconCalendar key="c" />]

export function LandingPage() {
  const { config } = useSiteConfig()

  return (
    <div className="flex min-h-dvh flex-col">
      <PageHeader />

      <main id="contenido-principal">
        <section className="relative overflow-hidden border-b border-rose-dawn-200/60 bg-gradient-to-br from-white via-rose-dawn-50 to-teal-sage-100">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-8 lg:grid-cols-2 lg:items-center lg:py-16">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold text-teal-sage-800 ring-1 ring-teal-sage-200">
                <span className="h-2 w-2 rounded-full bg-teal-sage-500" aria-hidden />
                {config.heroBadge}
              </p>
              <h1 className="font-display text-4xl font-semibold leading-tight text-slate-care-900 sm:text-5xl">
                {config.heroTitle}
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-slate-care-600">{config.heroDescription}</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={ROUTES.login}
                  className={composeButtonClassName('primary', 'px-6 no-underline')}
                >
                  Iniciar sesión
                </Link>
                <a
                  href="#servicios"
                  className={composeButtonClassName('secondary', 'px-6 no-underline')}
                >
                  Ver servicios
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-rose-dawn-200/70 blur-2xl" aria-hidden />
              <div className="absolute -bottom-10 -right-8 h-36 w-36 rounded-full bg-teal-sage-200/70 blur-3xl" aria-hidden />
              <figure className="relative overflow-hidden rounded-3xl shadow-soft ring-1 ring-rose-dawn-200/80">
                <img
                  src={config.heroImageUrl}
                  alt={config.heroImageAlt}
                  className="aspect-[4/3] w-full object-cover sm:aspect-[5/4]"
                  width={1200}
                  height={900}
                  loading="eager"
                  decoding="async"
                />
                <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-care-900/80 to-transparent p-4 text-sm text-white">
                  {config.heroCaption}
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section id="servicios" className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold text-slate-care-900">{config.servicesTitle}</h2>
            <p className="mt-3 text-slate-care-600">{config.servicesSubtitle}</p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Card
                key={i}
                title={config.serviceCards[i].title}
                description={config.serviceCards[i].description}
                icon={serviceIcons[i]}
              />
            ))}
          </div>
        </section>

        <section className="border-t border-rose-dawn-200/70 bg-white/70 py-14">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-8">
            <div>
              <h2 className="font-display text-2xl font-semibold text-slate-care-900">{config.ctaTitle}</h2>
              <p className="mt-2 max-w-xl text-slate-care-600">{config.ctaDescription}</p>
            </div>
            <Link
              to={ROUTES.login}
              className={composeButtonClassName('primary', 'shrink-0 px-7 no-underline')}
            >
              Entrar al panel
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-rose-dawn-200/70 bg-white/80 py-8 text-center text-sm text-slate-care-600">
        <p>
          © {new Date().getFullYear()} {config.footerNotice}
        </p>
      </footer>
    </div>
  )
}
