import { toast } from 'sonner'

import type { ConfigSectionId } from '@/features/site-config/model/config-nav'
import { isClinicalSection } from '@/features/site-config/model/config-nav'
import type { BusinessSettings } from '@/features/site-config/model/use-business-settings'
import { ServicesConfigSection } from '@/features/site-config/ui/molecules/ServicesConfigSection'
import { BrandSectionEditor } from '@/features/site-config/ui/sections/BrandSectionEditor'
import { ClinicalBillingSectionEditor } from '@/features/site-config/ui/sections/ClinicalBillingSectionEditor'
import { ClinicalReportsSectionEditor } from '@/features/site-config/ui/sections/ClinicalReportsSectionEditor'
import { CtaSectionEditor } from '@/features/site-config/ui/sections/CtaSectionEditor'
import { HeroSectionEditor } from '@/features/site-config/ui/sections/HeroSectionEditor'
import { Button } from '@/widgets/button'

type SiteConfigFormProps = {
  baseId: string
  section: ConfigSectionId
  clinicalDraft: BusinessSettings | null
  clinicalLoading: boolean
  saving: boolean
  onClinicalChange: (patch: Partial<BusinessSettings>) => void
  onSaveClinical: () => Promise<void>
}

export function SiteConfigForm({
  baseId,
  section,
  clinicalDraft,
  clinicalLoading,
  saving,
  onClinicalChange,
  onSaveClinical,
}: SiteConfigFormProps) {
  if (isClinicalSection(section) && (clinicalLoading || !clinicalDraft)) {
    return (
      <p className="py-16 text-center text-sm font-medium text-clinical-400">
        Cargando configuración…
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {section === 'global-brand' && <BrandSectionEditor baseId={baseId} />}
      {section === 'landing-hero' && <HeroSectionEditor baseId={baseId} />}
      {section === 'landing-services' && <ServicesConfigSection baseId={baseId} />}
      {section === 'landing-cta' && <CtaSectionEditor baseId={baseId} />}
      {section === 'clinical-reports' && clinicalDraft && (
        <ClinicalReportsSectionEditor
          baseId={baseId}
          draft={clinicalDraft}
          onChange={onClinicalChange}
        />
      )}
      {section === 'clinical-billing' && clinicalDraft && (
        <ClinicalBillingSectionEditor
          baseId={baseId}
          draft={clinicalDraft}
          onChange={onClinicalChange}
        />
      )}

      {isClinicalSection(section) && clinicalDraft ? (
        <div className="flex justify-end pt-2">
          <Button
            type="button"
            variant="primary"
            className="h-11 rounded-xl px-8 shadow-lg shadow-primary-200"
            disabled={saving}
            onClick={async () => {
              try {
                await onSaveClinical()
                toast.success('Guardado')
              } catch {
                toast.error('Error al guardar')
              }
            }}
          >
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
