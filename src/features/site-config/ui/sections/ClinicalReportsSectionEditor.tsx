import type { BusinessSettings } from '@/features/site-config/model/use-business-settings'
import {
  ConfigBlock,
  ConfigCanvas,
  ConfigGhostInput,
  ConfigGhostTextarea,
  ConfigImageUpload,
} from '@/features/site-config/ui/molecules/config-editor-primitives'

type ClinicalReportsSectionEditorProps = {
  baseId: string
  draft: BusinessSettings
  onChange: (patch: Partial<BusinessSettings>) => void
}

export function ClinicalReportsSectionEditor({
  baseId,
  draft,
  onChange,
}: ClinicalReportsSectionEditorProps) {
  return (
    <ConfigCanvas>
      <ConfigBlock padding="none" className="bg-clinical-50/40 p-6 sm:p-8">
        <p className="mb-4 text-center text-xs font-medium text-clinical-500">
          Documento de ejemplo — edite los campos del encabezado
        </p>
        <div className="mx-auto max-w-md overflow-hidden rounded-xl border border-clinical-200 bg-white shadow-md">
          <div className="flex items-start gap-4 border-b border-clinical-100 p-5">
            <ConfigImageUpload
              fileInputId={`${baseId}-biz-logo-file`}
              value={draft.logoUrl || ''}
              onChange={(v) => onChange({ logoUrl: v || null })}
              variant="logo"
              label="Logo"
            />
            <div className="min-w-0 flex-1 space-y-1">
              <ConfigGhostInput
                id={`${baseId}-biz-name`}
                value={draft.clinicName || ''}
                onChange={(e) => onChange({ clinicName: e.target.value })}
                placeholder="Nombre de la clínica"
                className="!text-base"
              />
              <ConfigGhostInput
                id={`${baseId}-biz-id`}
                value={draft.taxId || ''}
                onChange={(e) => onChange({ taxId: e.target.value })}
                placeholder="RUC / NIT"
                tone="muted"
                className="!text-xs"
              />
              <ConfigGhostInput
                id={`${baseId}-biz-addr`}
                value={draft.address || ''}
                onChange={(e) => onChange({ address: e.target.value })}
                placeholder="Dirección"
                tone="muted"
                className="!text-xs"
              />
            </div>
          </div>
          <div className="space-y-4 p-5">
            <ConfigGhostTextarea
              id={`${baseId}-biz-header`}
              value={draft.reportHeader || ''}
              onChange={(e) => onChange({ reportHeader: e.target.value })}
              placeholder="Encabezado del informe (título o subtítulo)"
              rows={2}
              className="!text-sm"
            />
            <div className="space-y-2 opacity-40" aria-hidden>
              <div className="h-2 rounded-full bg-clinical-100" />
              <div className="h-2 w-4/5 rounded-full bg-clinical-50" />
              <div className="h-2 w-3/5 rounded-full bg-clinical-50" />
            </div>
            <ConfigGhostTextarea
              id={`${baseId}-biz-footer`}
              value={draft.reportFooter || ''}
              onChange={(e) => onChange({ reportFooter: e.target.value })}
              placeholder="Pie de informe (firma, legal, contacto)"
              rows={2}
              tone="muted"
              className="!text-xs border-t border-clinical-100 pt-3"
            />
          </div>
        </div>
      </ConfigBlock>
    </ConfigCanvas>
  )
}
