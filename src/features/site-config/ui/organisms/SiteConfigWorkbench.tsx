import { useCallback, useEffect, useId, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/widgets/button'

import {
  CONFIG_NAV_ITEMS,
  getAdjacentSection,
  getSectionIndex,
  type ConfigSectionId,
} from '@/features/site-config/model/config-nav'
import {
  useBusinessSettings,
  type BusinessSettings,
} from '@/features/site-config/model/use-business-settings'
import { ConfigProgressStepper } from '@/features/site-config/ui/molecules/ConfigProgressStepper'
import { ConfigSectionHeader } from '@/features/site-config/ui/molecules/ConfigSectionHeader'
import { SiteConfigForm } from '@/features/site-config/ui/molecules/SiteConfigForm'

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

export function SiteConfigWorkbench() {
  const { settings, updateSettings, loading } = useBusinessSettings()
  const [section, setSection] = useState<ConfigSectionId>(CONFIG_NAV_ITEMS[0].id)
  const [clinicalDraft, setClinicalDraft] = useState<BusinessSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const baseId = useId()

  const stepIndex = getSectionIndex(section)
  const stepTotal = CONFIG_NAV_ITEMS.length
  const prevSection = getAdjacentSection(section, 'prev')
  const nextSection = getAdjacentSection(section, 'next')
  const isLastStep = stepIndex === stepTotal - 1

  useEffect(() => {
    if (settings) setClinicalDraft(settings)
  }, [settings])

  const handleClinicalChange = useCallback((patch: Partial<BusinessSettings>) => {
    setClinicalDraft((prev) => (prev ? { ...prev, ...patch } : prev))
  }, [])

  const handleSaveClinical = useCallback(async () => {
    if (!clinicalDraft) return
    setSaving(true)
    try {
      await updateSettings(clinicalDraft)
    } catch {
      // Ignored for layout
    } finally {
      setSaving(false)
    }
  }, [clinicalDraft, updateSettings])

  return (
    <div className="flex min-h-dvh w-full min-w-0 flex-col bg-clinical-50/50">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex w-full min-w-0 flex-1 flex-col px-6 py-10 lg:px-8"
      >
        <motion.header
          variants={itemVariants}
          className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-12 rounded-full bg-primary-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600/70">
                Administración
              </span>
            </div>
            <h1 className="mb-2 font-display text-4xl font-bold tracking-tight text-clinical-900">
              Configuración de la <span className="text-primary-700">Clínica</span>
            </h1>
            <p className="max-w-lg text-sm font-medium text-clinical-800/60">
              Configure los datos e identidad de la clínica, los parámetros de facturación, recetas médicas y administración de usuarios.
            </p>
          </div>
        </motion.header>

        <motion.div variants={itemVariants} className="min-h-0 flex-1">
          <div className="glass-card flex min-h-0 w-full flex-col overflow-hidden rounded-[2rem] border border-white">
            <div className="border-b border-clinical-100/80 bg-white/60 px-4 py-5 sm:px-6">
              <div className="-mx-1 overflow-x-auto pb-1">
                <ConfigProgressStepper activeId={section} onSelect={setSection} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-4 pt-6">
              <ConfigSectionHeader
                section={section}
                stepIndex={stepIndex}
                stepTotal={stepTotal}
              />
              <SiteConfigForm
                baseId={baseId}
                section={section}
                clinicalDraft={clinicalDraft}
                clinicalLoading={loading}
                saving={saving}
                onClinicalChange={handleClinicalChange}
                onSaveClinical={handleSaveClinical}
              />
            </div>

            <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-clinical-100/80 bg-clinical-50/40 px-6 py-4">
              <Button
                type="button"
                variant="secondary"
                className="h-11 gap-1.5 rounded-xl px-4"
                disabled={!prevSection}
                onClick={() => prevSection && setSection(prevSection)}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              <span className="text-xs font-semibold text-clinical-500">
                {stepIndex + 1} / {stepTotal}
              </span>

              {isLastStep ? (
                <div className="w-[100px]" />
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  className="h-11 gap-1.5 rounded-xl px-4"
                  disabled={!nextSection}
                  onClick={() => nextSection && setSection(nextSection)}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </footer>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

