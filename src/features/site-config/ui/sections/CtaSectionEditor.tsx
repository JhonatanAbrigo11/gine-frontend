import { useSiteConfig } from '@/features/site-config/model/site-config-context'
import {
  ConfigBlock,
  ConfigCanvas,
  ConfigGhostInput,
  ConfigGhostTextarea,
} from '@/features/site-config/ui/molecules/config-editor-primitives'

type CtaSectionEditorProps = {
  baseId: string
}

export function CtaSectionEditor({ baseId }: CtaSectionEditorProps) {
  const { config, updateConfig } = useSiteConfig()

  return (
    <ConfigCanvas>
      <ConfigBlock
        padding="none"
        className="overflow-hidden border-primary-100/60 bg-gradient-to-br from-primary-50/50 via-white to-clinical-50/80"
      >
        <div className="space-y-5 p-6 sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary-600/70">
            Vista del bloque en la landing
          </p>
          <ConfigGhostInput
            id={`${baseId}-cta-t`}
            value={config.ctaTitle}
            onChange={(e) => updateConfig({ ctaTitle: e.target.value })}
            placeholder="Título del llamado a la acción"
            className="!text-xl font-bold !leading-tight text-clinical-900 sm:!text-2xl"
          />
          <ConfigGhostTextarea
            id={`${baseId}-cta-d`}
            value={config.ctaDescription}
            onChange={(e) => updateConfig({ ctaDescription: e.target.value })}
            placeholder="Texto que invita a agendar o ingresar al panel"
            tone="muted"
            rows={3}
          />
          <span
            className="inline-flex cursor-default rounded-full border border-primary-200/80 bg-primary-600/90 px-5 py-2.5 text-sm font-semibold text-white shadow-sm"
            title="El botón en la landing usa este estilo"
          >
            Entrar al panel
          </span>
          <p className="text-[11px] font-medium text-clinical-500">
            En la página pública este bloque se muestra con fondo oscuro; aquí se edita con
            colores suaves para mayor comodidad.
          </p>
        </div>
      </ConfigBlock>

      <ConfigBlock
        title="Pie de página global"
        hint="Texto legal o informativo al final de la landing."
        className="border-clinical-100/80 bg-clinical-50/40"
      >
        <ConfigGhostInput
          id={`${baseId}-foot`}
          value={config.footerNotice}
          onChange={(e) => updateConfig({ footerNotice: e.target.value })}
          placeholder="Aviso legal o copyright"
          tone="muted"
          className="!text-center !text-xs"
        />
      </ConfigBlock>
    </ConfigCanvas>
  )
}
