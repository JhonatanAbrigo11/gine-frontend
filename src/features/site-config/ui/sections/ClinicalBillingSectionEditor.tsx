import type { BusinessSettings } from '@/features/site-config/model/use-business-settings'
import {
  ConfigBlock,
  ConfigCanvas,
  ConfigGhostInput,
  ConfigSelect,
} from '@/features/site-config/ui/molecules/config-editor-primitives'

type ClinicalBillingSectionEditorProps = {
  baseId: string
  draft: BusinessSettings
  onChange: (patch: Partial<BusinessSettings>) => void
}

export function ClinicalBillingSectionEditor({
  baseId,
  draft,
  onChange,
}: ClinicalBillingSectionEditorProps) {
  const series = draft.billingSeries || 'F001'
  const num = draft.billingNextNumber ?? 1
  const currency = draft.currency || 'USD'

  return (
    <ConfigCanvas>
      <ConfigBlock padding="none" className="overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="border-b border-clinical-100 bg-gradient-to-br from-primary-50/80 to-white p-6 lg:border-b-0 lg:border-r">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-primary-600/80">
              Próximo comprobante
            </p>
            <p className="font-mono text-3xl font-bold tracking-tight text-clinical-900">
              {series}-{String(num).padStart(5, '0')}
            </p>
            <p className="mt-2 text-sm font-medium text-clinical-500">Moneda: {currency}</p>
          </div>
          <div className="space-y-5 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-clinical-400">
                  Serie
                </p>
                <ConfigGhostInput
                  id={`${baseId}-bill-series`}
                  value={draft.billingSeries || ''}
                  onChange={(e) => onChange({ billingSeries: e.target.value })}
                  placeholder="F001"
                  className="!rounded-xl !bg-clinical-50/80 !px-3 !py-2"
                />
              </div>
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-clinical-400">
                  Siguiente número
                </p>
                <ConfigGhostInput
                  id={`${baseId}-bill-next`}
                  type="number"
                  value={draft.billingNextNumber || 1}
                  onChange={(e) =>
                    onChange({
                      billingNextNumber: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  className="!rounded-xl !bg-clinical-50/80 !px-3 !py-2"
                />
              </div>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-clinical-400">
                Moneda
              </p>
              <ConfigSelect
                id={`${baseId}-bill-curr`}
                value={draft.currency || 'USD'}
                onChange={(e) => onChange({ currency: e.target.value })}
              >
                <option value="USD">USD — Dólar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="PEN">PEN — Sol</option>
                <option value="COP">COP — Peso colombiano</option>
                <option value="MXN">MXN — Peso mexicano</option>
              </ConfigSelect>
            </div>
          </div>
        </div>
      </ConfigBlock>
    </ConfigCanvas>
  )
}
