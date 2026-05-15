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
    <div className="space-y-2">
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
        <p id={`${id}-error`} className="text-sm text-rose-dawn-600" role="alert">
          {error}
        </p>
      ) : null}
      {helper && !error ? (
        <p id={`${id}-helper`} className="text-xs text-slate-care-600">
          {helper}
        </p>
      ) : null}
    </div>
  )
}
