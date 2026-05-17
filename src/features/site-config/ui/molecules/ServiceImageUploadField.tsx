import { ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

import { SettingsButton } from '@/features/site-config/ui/atoms/SettingsButton'
import { cn } from '@/shared/lib/cn'

const MAX_IMAGE_BYTES = 2 * 1024 * 1024

type ServiceImageUploadFieldProps = {
  fileInputId: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ServiceImageUploadField({
  fileInputId,
  value,
  onChange,
  className,
}: ServiceImageUploadFieldProps) {
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

  return (
    <div className={cn('space-y-2', className)}>
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border border-dashed border-primary-200/80 bg-white shadow-premium ring-1 ring-inset ring-primary-100/40',
          value ? 'border-solid' : '',
        )}
      >
        <div className="aspect-[16/9] w-full">
          {value ? (
            <img src={value} alt="Vista previa del servicio" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 bg-clinical-50/80 p-6 text-center">
              <ImageIcon className="h-10 w-10 text-clinical-300" aria-hidden />
              <p className="text-xs font-medium text-clinical-500">
                Suba una imagen para este servicio
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <SettingsButton type="button" onClick={() => document.getElementById(fileInputId)?.click()}>
          {value ? 'Cambiar imagen' : 'Subir imagen'}
        </SettingsButton>
        {value ? (
          <SettingsButton type="button" onClick={() => onChange('')}>
            Quitar imagen
          </SettingsButton>
        ) : null}
      </div>
      <p className="text-[11px] font-medium text-clinical-400">PNG, JPG o WEBP · máx. 2 MB</p>
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
