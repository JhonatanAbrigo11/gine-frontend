import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

import { Button, composeButtonClassName } from '@/widgets/button'

import { useSiteConfig } from '@/features/site-config/model/site-config-context'
import { SiteConfigForm } from '@/features/site-config/ui/molecules/SiteConfigForm'
import { SiteConfigLivePreview } from '@/features/site-config/ui/organisms/SiteConfigLivePreview'
import { ROUTES } from '@/shared/config/routes'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

/**
 * Vista completa de configuración (preview + formulario + acciones).
 * Mismo shell visual que Pacientes, Consultas, Agenda, etc.
 */
export function SiteConfigWorkbench() {
  const { resetConfig } = useSiteConfig()

  return (
    <div className="min-h-dvh bg-clinical-50/50">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mx-auto max-w-7xl px-6 py-10"
      >
        <motion.header
          variants={itemVariants}
          className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-12 rounded-full bg-primary-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600/70">
                Administración
              </span>
            </div>
            <h1
              id="site-config-heading"
              className="mb-2 text-4xl font-bold tracking-tight text-clinical-900"
            >
              Configuración del <span className="text-primary-700">sitio</span>
            </h1>
            <p className="max-w-xl text-sm text-clinical-800/60">
              Personalice textos e imágenes de la landing. Los cambios se guardan en este navegador.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={ROUTES.home}
              className={composeButtonClassName(
                'secondary',
                'h-12 gap-2 rounded-2xl px-5 text-sm no-underline shadow-sm',
              )}
            >
              <ExternalLink className="h-4 w-4" />
              Ver landing
            </Link>
            <Link
              to={ROUTES.dashboard}
              className={composeButtonClassName(
                'ghost',
                'h-12 rounded-2xl px-5 text-sm no-underline',
              )}
            >
              Volver al panel
            </Link>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] xl:items-start">
          <motion.div variants={itemVariants} className="min-w-0 xl:sticky xl:top-8 xl:self-start">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-clinical-400">
              Vista previa en vivo
            </p>
            <SiteConfigLivePreview />
          </motion.div>

          <motion.div variants={itemVariants} className="min-w-0">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-clinical-400">
              Campos
            </p>
            <div className="rounded-[2rem] border border-clinical-100 bg-white p-6 shadow-xl shadow-clinical-900/5 sm:p-8">
              <SiteConfigForm />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                type="button"
                variant="secondary"
                className="h-12 rounded-2xl"
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
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
