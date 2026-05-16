import { type ReactNode } from 'react'

import { LoginInput } from '@/features/login/ui/atoms/LoginInput'
import { LoginLabel } from '@/features/login/ui/atoms/LoginLabel'

type EmailFieldProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  autoComplete?: string
  helper?: ReactNode
}

export function EmailField({
  id,
  label,
  value,
  onChange,
  error,
  autoComplete = 'email',
  helper,
}: EmailFieldProps) {
  const describedBy = error ? `${id}-error` : helper ? `${id}-helper` : undefined

  return (
    <div className="space-y-1">
      <LoginLabel htmlFor={id}>{label}</LoginLabel>
      <LoginInput
        id={id}
        name="email"
        type="email"
        inputMode="email"
        autoComplete={autoComplete}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
      />
      {error ? (
        <p id={`${id}-error`} className="text-[11px] font-bold text-accent-500 px-1 mt-1" role="alert">
          {error}
        </p>
      ) : null}
      {helper && !error ? (
        <p id={`${id}-helper`} className="text-[11px] font-medium text-clinical-800/40 px-1 mt-1">
          {helper}
        </p>
      ) : null}
    </div>
  )
}
