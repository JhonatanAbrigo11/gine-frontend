import type { ReactNode } from 'react'
import { ChevronDown, ChevronUp, Copy, Trash2 } from 'lucide-react'

import { serviceDisplayLabel } from '@/features/site-config/model/service-card-defaults'
import { SERVICE_ICON_OPTIONS } from '@/features/site-config/model/service-icons'
import type { ServiceCardConfig, ServiceIconId } from '@/features/site-config/model/types'
import { SettingsLabel } from '@/features/site-config/ui/atoms/SettingsLabel'
import {
  ConfigGhostInput,
  ConfigGhostTextarea,
  ConfigImageUpload,
  ConfigSelect,
} from '@/features/site-config/ui/molecules/config-editor-primitives'
import { cn } from '@/shared/lib/cn'

type ServiceCardEditorProps = {
  card: ServiceCardConfig
  index: number
  total: number
  baseId: string
  embedded?: boolean
  onUpdate: (patch: Partial<ServiceCardConfig>) => void
  onRemove: () => void
  onDuplicate: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export function ServiceCardEditor({
  card,
  index,
  total,
  baseId,
  embedded = false,
  onUpdate,
  onRemove,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: ServiceCardEditorProps) {
  const label = serviceDisplayLabel(index)
  const canRemove = total > 1
  const canMoveUp = index > 0
  const canMoveDown = index < total - 1

  return (
    <article
      className="overflow-hidden rounded-2xl border border-clinical-100/90 bg-white shadow-premium ring-1 ring-inset ring-primary-100/30"
      aria-labelledby={embedded ? undefined : `${baseId}-svc-${card.id}-heading`}
    >
      <header
        className={cn(
          'flex flex-wrap items-center gap-3 border-b border-clinical-100/80 bg-clinical-50/50 px-4 py-3',
          embedded ? 'justify-end' : 'justify-between',
        )}
      >
        {embedded ? null : (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary-600/80">
              {label}
            </p>
            <h3
              id={`${baseId}-svc-${card.id}-heading`}
              className="text-sm font-semibold text-clinical-900"
            >
              {card.title || label}
            </h3>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-1">
          <ToolbarButton
            label="Subir orden"
            disabled={!canMoveUp}
            onClick={onMoveUp}
          >
            <ChevronUp className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Bajar orden"
            disabled={!canMoveDown}
            onClick={onMoveDown}
          >
            <ChevronDown className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton label="Duplicar servicio" onClick={onDuplicate}>
            <Copy className="h-4 w-4" />
          </ToolbarButton>
          {canRemove ? (
            <ToolbarButton
              label="Eliminar servicio"
              onClick={onRemove}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </ToolbarButton>
          ) : null}
        </div>
      </header>

      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <SettingsLabel htmlFor={`${baseId}-c${index}-img-file`}>Imagen del servicio</SettingsLabel>
          <ConfigImageUpload
            fileInputId={`${baseId}-c${index}-img-file`}
            value={card.imageUrl || ''}
            onChange={(v) => onUpdate({ imageUrl: v || undefined })}
            variant="service"
            label="Imagen del servicio"
          />
        </div>

        <div className="space-y-2">
          <SettingsLabel htmlFor={`${baseId}-c${index}-t`}>Título visible</SettingsLabel>
          <ConfigGhostInput
            id={`${baseId}-c${index}-t`}
            value={card.title}
            placeholder={label}
            onChange={(e) => onUpdate({ title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <SettingsLabel htmlFor={`${baseId}-c${index}-d`}>Descripción</SettingsLabel>
          <ConfigGhostTextarea
            id={`${baseId}-c${index}-d`}
            value={card.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <SettingsLabel htmlFor={`${baseId}-c${index}-icon`}>
            Icono (si no hay imagen)
          </SettingsLabel>
          <ConfigSelect
            id={`${baseId}-c${index}-icon`}
            value={card.icon}
            onChange={(e) => onUpdate({ icon: e.target.value as ServiceIconId })}
          >
            {SERVICE_ICON_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </ConfigSelect>
        </div>
      </div>
    </article>
  )
}

function ToolbarButton({
  label,
  children,
  disabled,
  onClick,
  className,
}: {
  label: string
  children: ReactNode
  disabled?: boolean
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-xl text-clinical-600 transition-colors',
        'hover:bg-white hover:text-clinical-900 disabled:pointer-events-none disabled:opacity-30',
        className,
      )}
    >
      {children}
    </button>
  )
}
