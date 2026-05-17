import { useSiteConfig } from '@/features/site-config/model/site-config-context'
import {
  ConfigBlock,
  ConfigCanvas,
  ConfigFieldRow,
  ConfigGhostInput,
  ConfigGhostTextarea,
  ConfigImageUpload,
} from '@/features/site-config/ui/molecules/config-editor-primitives'

type HeroSectionEditorProps = {
  baseId: string
}

export function HeroSectionEditor({ baseId }: HeroSectionEditorProps) {
  const { config, updateConfig } = useSiteConfig()

  return (
    <ConfigCanvas>
      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <ConfigBlock padding="none" className="overflow-hidden">
          <ConfigImageUpload
            fileInputId={`${baseId}-hero-file`}
            value={config.heroImageUrl}
            onChange={(v) => updateConfig({ heroImageUrl: v })}
            variant="hero"
            label="Foto de portada"
          />
        </ConfigBlock>

        <ConfigBlock title="Textos de bienvenida" hint="Haga clic en cada línea para editar.">
          <div className="space-y-5">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-primary-600/70">
                Etiqueta
              </p>
              <ConfigGhostInput
                id={`${baseId}-badge`}
                value={config.heroBadge}
                onChange={(e) => updateConfig({ heroBadge: e.target.value })}
                placeholder="Mensaje corto destacado"
                className="!text-xs !font-bold !uppercase !tracking-wider !text-primary-600"
              />
            </div>
            <div>
              <ConfigGhostInput
                id={`${baseId}-hero-title`}
                value={config.heroTitle}
                onChange={(e) => updateConfig({ heroTitle: e.target.value })}
                placeholder="Título principal"
                className="!text-xl sm:!text-2xl"
              />
            </div>
            <ConfigGhostTextarea
              id={`${baseId}-hero-desc`}
              value={config.heroDescription}
              onChange={(e) => updateConfig({ heroDescription: e.target.value })}
              placeholder="Descripción que acompaña al título"
              rows={4}
            />
            <ConfigFieldRow label="Accesibilidad" htmlFor={`${baseId}-hero-alt`} hint="Texto alternativo de la imagen">
              <ConfigGhostInput
                id={`${baseId}-hero-alt`}
                value={config.heroImageAlt}
                onChange={(e) => updateConfig({ heroImageAlt: e.target.value })}
                placeholder="Descripción de la imagen para lectores de pantalla"
                tone="muted"
                className="!text-sm"
              />
            </ConfigFieldRow>
            <ConfigFieldRow label="Pie visual" htmlFor={`${baseId}-hero-cap`}>
              <ConfigGhostInput
                id={`${baseId}-hero-cap`}
                value={config.heroCaption}
                onChange={(e) => updateConfig({ heroCaption: e.target.value })}
                placeholder="Texto bajo la imagen (opcional)"
                tone="muted"
                className="!text-sm"
              />
            </ConfigFieldRow>
          </div>
        </ConfigBlock>
      </div>
    </ConfigCanvas>
  )
}
