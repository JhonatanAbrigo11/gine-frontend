export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  /** Ruta ASCII estándar; la interfaz muestra el título «Configuración». */
  configuracion: '/configuracion',
} as const

export type RouteKey = keyof typeof ROUTES
