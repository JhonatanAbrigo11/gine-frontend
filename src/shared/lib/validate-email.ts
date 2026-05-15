/** Validación mínima para demo sin backend: correo con formato básico. */
export function isProbablyEmail(value: string) {
  const v = value.trim()
  if (v.length < 5) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}
