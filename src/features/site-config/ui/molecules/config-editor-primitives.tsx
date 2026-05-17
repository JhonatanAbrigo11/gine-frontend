import type { ComponentProps, ReactNode } from 'react'
import { ImageIcon, PencilLine } from 'lucide-react'
import { toast } from 'sonner'

import { SettingsButton } from '@/features/site-config/ui/atoms/SettingsButton'
import { cn } from '@/shared/lib/cn'

const MAX_IMAGE_BYTES = 2 * 1024 * 1024

type GhostTone = 'light' | 'dark' | 'muted'

const editableShellClass: Record<GhostTone, string> = {
  light:
    'border-primary-200/70 bg-white/50 hover:border-primary-400 hover:bg-white focus-within:border-primary-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-500/25',
  dark:
    'border-white/30 bg-white/5 hover:border-white/50 hover:bg-white/10 focus-within:border-white/70 focus-within:bg-white/15 focus-within:ring-2 focus-within:ring-white/25',
  muted:
    'border-clinical-200 bg-clinical-50/80 hover:border-clinical-300 hover:bg-white focus-within:border-primary-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-500/20',
}

const ghostTextClass: Record<GhostTone, string> = {
  light: 'text-clinical-900 placeholder:text-clinical-400 placeholder:italic',
  dark: 'text-white placeholder:text-white/50 placeholder:italic',
  muted: 'text-clinical-700 placeholder:text-clinical-400 placeholder:italic',
}

const editIconClass: Record<GhostTone, string> = {
  light: 'text-primary-500/70 group-hover/editable:text-primary-600',
  dark: 'text-white/50 group-hover/editable:text-white/90',
  muted: 'text-clinical-400 group-hover/editable:text-primary-600',
}

export function ConfigCanvas({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('space-y-5', className)}>
      <div className="flex items-center gap-2.5 rounded-xl border border-clinical-100/90 bg-clinical-50/80 px-3.5 py-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-primary-600 shadow-sm ring-1 ring-clinical-100">
          <PencilLine className="h-3.5 w-3.5" aria-hidden />
        </span>
        <p className="text-xs font-medium leading-snug text-clinical-600">
          Los recuadros con borde punteado son editables. Haga clic para cambiar el texto.
        </p>
      </div>
      <div
        className={cn(
          'space-y-5 rounded-[1.75rem] bg-gradient-to-b from-clinical-50/90 via-white to-white p-4 sm:p-6',
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function ConfigBlock({
  title,
  hint,
  children,
  className,
  padding = 'default',
}: {
  title?: string
  hint?: string
  children: ReactNode
  className?: string
  padding?: 'default' | 'none'
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-clinical-100/70 bg-white shadow-sm ring-1 ring-inset ring-white/80',
        padding === 'default' && 'p-5 sm:p-6',
        className,
      )}
    >
      {title || hint ? (
        <div className={cn(padding === 'none' && 'px-5 pt-5 sm:px-6 sm:pt-6', 'mb-4')}>
          {title ? <p className="text-sm font-semibold text-clinical-900">{title}</p> : null}
          {hint ? <p className="mt-0.5 text-xs font-medium text-clinical-500">{hint}</p> : null}
        </div>
      ) : null}
      {children}
    </div>
  )
}

export function ConfigFieldRow({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string
  htmlFor?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="group flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-6">
      <div className="shrink-0 pt-0.5 sm:w-36 sm:pt-3">
        <label
          htmlFor={htmlFor}
          className="text-[11px] font-bold uppercase tracking-wider text-clinical-400"
        >
          {label}
        </label>
        {hint ? <p className="mt-1 text-[11px] leading-snug text-clinical-400">{hint}</p> : null}
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

function EditableFieldShell({
  tone,
  multiline,
  className,
  children,
}: {
  tone: GhostTone
  multiline?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'group/editable relative cursor-text rounded-xl border-2 border-dashed px-3 py-2.5 transition-all',
        editableShellClass[tone],
        multiline && 'py-3',
        className,
      )}
    >
      {children}
      <PencilLine
        className={cn(
          'pointer-events-none absolute h-4 w-4 transition-opacity',
          editIconClass[tone],
          multiline ? 'right-3 top-3 opacity-60' : 'right-3 top-1/2 -translate-y-1/2 opacity-50',
          'group-hover/editable:opacity-100 group-focus-within/editable:opacity-100',
        )}
        aria-hidden
      />
    </div>
  )
}

export function ConfigGhostInput({
  tone = 'light',
  className,
  ...props
}: ComponentProps<'input'> & { tone?: GhostTone }) {
  return (
    <EditableFieldShell tone={tone} className={className}>
      <input
        className={cn(
          'w-full cursor-text border-0 bg-transparent py-0.5 pr-8 text-base font-semibold outline-none',
          ghostTextClass[tone],
        )}
        {...props}
      />
    </EditableFieldShell>
  )
}

export function ConfigGhostTextarea({
  tone = 'light',
  className,
  ...props
}: ComponentProps<'textarea'> & { tone?: GhostTone }) {
  return (
    <EditableFieldShell tone={tone} multiline className={className}>
      <textarea
        className={cn(
          'w-full min-h-[4.5rem] cursor-text resize-y border-0 bg-transparent py-0.5 pr-8 text-sm font-medium leading-relaxed outline-none',
          ghostTextClass[tone],
        )}
        {...props}
      />
    </EditableFieldShell>
  )
}

export function ConfigImageUpload({
  fileInputId,
  value,
  onChange,
  variant = 'compact',
  label = 'Imagen',
}: {
  fileInputId: string
  value: string
  onChange: (value: string) => void
  variant?: 'compact' | 'hero' | 'logo' | 'service'
  label?: string
}) {
  const handleFile = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Seleccione un archivo de imagen')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error('La imagen no debe superar 2 MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => onChange(String(reader.result))
    reader.readAsDataURL(file)
  }

  const boxClass =
    variant === 'hero'
      ? 'aspect-[16/10] w-full'
      : variant === 'service'
        ? 'aspect-[16/10] h-44 w-full max-w-sm sm:h-48'
        : variant === 'logo'
          ? 'h-28 w-28'
          : 'h-24 w-24'

  const buttonWidthClass =
    variant === 'hero' ? 'w-full' : variant === 'service' ? 'mx-auto w-full max-w-sm' : 'w-auto'

  return (
    <div className={cn('space-y-3', variant === 'service' && 'flex flex-col items-center')}>
      <button
        type="button"
        onClick={() => document.getElementById(fileInputId)?.click()}
        className={cn(
          'group/img relative block overflow-hidden rounded-2xl border-2 border-dashed text-left transition-all',
          'border-primary-300/80 bg-clinical-50/60 hover:border-primary-500 hover:bg-primary-50/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40',
          boxClass,
          buttonWidthClass,
        )}
      >
        {value ? (
          <img
            src={value}
            alt=""
            className={cn('h-full w-full', variant === 'logo' ? 'object-contain p-2' : 'object-cover')}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-primary-100">
              <ImageIcon className="h-5 w-5 text-primary-500" />
            </span>
            <span className="text-xs font-semibold text-primary-700">{label}</span>
            <span className="text-[10px] font-medium text-clinical-500">Clic para subir</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-clinical-900/75 to-transparent p-3 pt-10 opacity-0 transition-opacity group-hover/img:opacity-100 group-focus-visible/img:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-[11px] font-bold text-clinical-900 shadow">
            <PencilLine className="h-3 w-3" />
            {value ? 'Cambiar imagen' : 'Subir imagen'}
          </span>
        </div>
      </button>
      <p
        className={cn(
          'text-[11px] font-medium text-clinical-400',
          variant === 'service' && 'text-center',
        )}
      >
        PNG, JPG o WEBP · máx. 2 MB
      </p>
      <input
        id={fileInputId}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/*"
        className="sr-only"
        onChange={(e) => {
          handleFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </div>
  )
}

export function ConfigSelect({
  className,
  children,
  ...props
}: ComponentProps<'select'>) {
  return (
    <div className="group/select relative">
      <select
        className={cn(
          'h-11 w-full cursor-pointer rounded-xl border-2 border-dashed border-primary-200/70 bg-clinical-50/80 px-4 pr-10 text-sm font-semibold text-clinical-900 outline-none transition-all',
          'hover:border-primary-400 hover:bg-white focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/25',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <PencilLine
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-500/60 group-hover/select:text-primary-600"
        aria-hidden
      />
    </div>
  )
}
