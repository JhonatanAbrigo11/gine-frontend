import { toast } from 'sonner'

import type { ConfigSectionId } from '@/features/site-config/model/config-nav'
import { isClinicalSection } from '@/features/site-config/model/config-nav'
import type { BusinessSettings } from '@/features/site-config/model/use-business-settings'
import { ClinicalBillingSectionEditor } from '@/features/site-config/ui/sections/ClinicalBillingSectionEditor'
import { ClinicalReportsSectionEditor } from '@/features/site-config/ui/sections/ClinicalReportsSectionEditor'
import { ClinicalRecipesSectionEditor } from '@/features/site-config/ui/sections/ClinicalRecipesSectionEditor'
import { ClinicalUsersSectionEditor } from '@/features/site-config/ui/sections/ClinicalUsersSectionEditor'
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
  if (isClinicalSection(section) && section !== 'clinical-recipes' && section !== 'clinical-users' && (clinicalLoading || !clinicalDraft)) {
    return (
      <p className="py-16 text-center text-sm font-medium text-clinical-400">
        Cargando configuración…
      </p>
    )
  }

  return (
    <div className="space-y-6">
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
      {section === 'clinical-recipes' && (
        <ClinicalRecipesSectionEditor
          baseId={baseId}
        />
      )}
      {section === 'clinical-users' && (
        <ClinicalUsersSectionEditor />
      )}

      {isClinicalSection(section) && section !== 'clinical-recipes' && section !== 'clinical-users' && clinicalDraft ? (
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

