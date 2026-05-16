export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  pacientes: '/pacientes',
  agenda: '/agenda',
  consultas: '/consultas',
  nuevaConsulta: '/consultas/nueva/:id',
  controlObstetrico: '/control-obstetrico',
  controlObstetricoDetalle: '/control-obstetrico/:id',
  recetas: '/recetas',
  ordenes: '/ordenes',
  documentos: '/documentos',
  ecografias: '/ecografias',
  reportes: '/reportes',
  configuracion: '/configuracion',
  confirmacion: '/confirmacion-cita/:id',
} as const

export type RouteKey = keyof typeof ROUTES
