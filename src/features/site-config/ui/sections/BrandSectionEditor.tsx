import { useSiteConfig } from '@/features/site-config/model/site-config-context'
import {
  ConfigBlock,
  ConfigCanvas,
  ConfigGhostInput,
  ConfigImageUpload,
} from '@/features/site-config/ui/molecules/config-editor-primitives'

type BrandSectionEditorProps = {
  baseId: string
}

export function BrandSectionEditor({ baseId }: BrandSectionEditorProps) {
  const { config, updateConfig } = useSiteConfig()

  return (
    <ConfigCanvas>
      <ConfigBlock padding="none" className="overflow-hidden">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:gap-8">
          <ConfigImageUpload
            fileInputId={`${baseId}-logo-file`}
            value={config.logoUrl}
            onChange={(v) => updateConfig({ logoUrl: v })}
            variant="logo"
            label="Logo"
          />
          <div className="min-w-0 flex-1 space-y-4 border-t border-clinical-100/80 pt-6 sm:border-t-0 sm:border-l sm:pl-8 sm:pt-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-clinical-400">
              Vista en cabecera
            </p>
            <ConfigGhostInput
              id={`${baseId}-brand`}
              value={config.brandName}
              onChange={(e) => updateConfig({ brandName: e.target.value })}
              placeholder="Nombre de la clínica"
              className="!text-2xl sm:!text-3xl"
            />
            <ConfigGhostInput
              id={`${baseId}-tag`}
              value={config.brandTagline}
              onChange={(e) => updateConfig({ brandTagline: e.target.value })}
              placeholder="Eslogan o especialidad"
              tone="muted"
              className="!text-sm !font-medium"
            />
          </div>
        </div>
      </ConfigBlock>
    </ConfigCanvas>
  )
}
