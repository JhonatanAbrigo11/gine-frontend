import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

import type { ConfigSectionId } from '@/features/site-config/model/config-nav'
import type { BusinessSettings } from '@/features/site-config/model/use-business-settings'
import { SiteConfigLivePreview } from '@/features/site-config/ui/organisms/SiteConfigLivePreview'

type SiteConfigPreviewDrawerProps = {
  open: boolean
  onClose: () => void
  section: ConfigSectionId
  clinicalDraft: BusinessSettings | null
}

export function SiteConfigPreviewDrawer({
  open,
  onClose,
  section,
  clinicalDraft,
}: SiteConfigPreviewDrawerProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Cerrar vista previa"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-clinical-900/45 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="site-config-preview-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="fixed right-0 top-0 z-[51] flex h-full w-full max-w-3xl flex-col border-l border-clinical-100/80 bg-white shadow-2xl"
          >
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-clinical-100/80 px-6 py-4">
              <div>
                <p
                  id="site-config-preview-title"
                  className="text-[10px] font-bold uppercase tracking-widest text-clinical-400"
                >
                  Vista previa
                </p>
                <p className="text-sm font-semibold text-clinical-900">
                  Así se verá la sección actual
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-clinical-50 text-clinical-600 transition-colors hover:bg-clinical-100 hover:text-clinical-900"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto bg-clinical-50/40 p-6">
              <SiteConfigLivePreview
                variant="bare"
                section={section}
                clinicalDraft={clinicalDraft}
              />
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
