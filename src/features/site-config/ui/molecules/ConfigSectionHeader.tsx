import { getSectionMeta, type ConfigSectionId } from '@/features/site-config/model/config-nav'

type ConfigSectionHeaderProps = {
  section: ConfigSectionId
  stepIndex: number
  stepTotal: number
}

export function ConfigSectionHeader({ section, stepIndex, stepTotal }: ConfigSectionHeaderProps) {
  const meta = getSectionMeta(section)
  const Icon = meta.Icon

  return (
    <header className="mb-5 flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-clinical-900/90 text-white">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-clinical-400">
          Paso {stepIndex + 1} de {stepTotal} · {meta.label}
        </p>
        <p className="text-xs font-medium text-clinical-500">{meta.description}</p>
      </div>
    </header>
  )
}
