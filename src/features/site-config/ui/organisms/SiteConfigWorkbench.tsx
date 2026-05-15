import { Link } from 'react-router-dom'

import { Button, composeButtonClassName } from '@/widgets/button'

import { useSiteConfig } from '@/features/site-config/model/site-config-context'
import { SiteConfigForm } from '@/features/site-config/ui/molecules/SiteConfigForm'
import { SiteConfigLivePreview } from '@/features/site-config/ui/organisms/SiteConfigLivePreview'
import { ROUTES } from '@/shared/config/routes'

/**
 * Vista completa de configuración (preview + formulario + acciones).
 * Pensado para la página dedicada, no para el sidebar.
 */
export function SiteConfigWorkbench() {
  const { resetConfig } = useSiteConfig()

  return (
    <div className="w-full min-w-0 px-4 py-6 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
      <header className="mb-8 border-b border-rose-dawn-200/80 pb-6">
        <p className="text-sm font-medium text-teal-sage-800">Administración</p>
        <h1 id="site-config-heading" className="font-display text-3xl font-semibold text-slate-care-900">
          Configuración del sitio
        </h1>
        <p className="mt-2 max-w-3xl text-slate-care-600 lg:max-w-none">
          Los cambios se guardan en este navegador (sin servidor). La vista previa refleja el mismo contenido
          que verás en la{' '}
          <Link to={ROUTES.home} className="font-semibold text-teal-sage-800 underline-offset-2 hover:underline">
            landing pública
          </Link>
          .
        </p>
      </header>

      <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] xl:items-start">
        <div className="min-w-0 xl:sticky xl:top-6 xl:self-start">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-sage-900">
            Vista previa en vivo
          </p>
          <SiteConfigLivePreview />
        </div>

        <div className="min-w-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-sage-900">
            Campos
          </p>
          <SiteConfigForm />
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (
                  confirm(
                    '¿Restaurar valores por defecto? Se perderán los textos e imágenes guardados localmente.',
                  )
                ) {
                  resetConfig()
                }
              }}
            >
              Restaurar predeterminados
            </Button>
            <Link
              to={ROUTES.home}
              className={composeButtonClassName(
                'primary',
                'justify-center px-5 py-3 text-sm no-underline sm:inline-flex',
              )}
            >
              Abrir landing
            </Link>
            <Link
              to={ROUTES.dashboard}
              className={composeButtonClassName(
                'ghost',
                'justify-center px-5 py-3 text-sm no-underline sm:inline-flex',
              )}
            >
              Volver al panel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
