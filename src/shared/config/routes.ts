export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  pacientes: '/pacientes',
  pacienteFicha: '/pacientes/ficha/:id',
  agenda: '/agenda',
  consultas: '/consultas',
  nuevaConsulta: '/consultas/nueva/:id/:num?',
  controlObstetrico: '/control-obstetrico',
  controlObstetricoDetalle: '/control-obstetrico/:id',
  nuevoControlObstetrico: '/control-obstetrico/nuevo/:patientId',
  recetas: '/recetas',
  ordenes: '/ordenes',
  documentos: '/documentos',
  ecografias: '/ecografias',
  reportes: '/reportes',
  configuracion: '/configuracion',
  confirmacion: '/confirmacion-cita/:id',
} as const

export type RouteKey = keyof typeof ROUTES
