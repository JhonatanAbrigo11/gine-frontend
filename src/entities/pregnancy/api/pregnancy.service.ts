import type {
  Pregnancy,
  PrenatalControl,
  PregnancyRisk,
  PregnancyEchography,
  CreatePregnancyDto,
  CreatePrenatalControlDto,
  CreatePregnancyRiskDto,
  CreateEchographyDto,
} from '../model/types'

import { API_URL } from '@/shared/api/base'

const BASE = API_URL

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || `HTTP ${res.status}`)
  }
  return res.json()
}

export const pregnancyService = {
  // ─── Embarazos ────────────────────────────────────────────────────────────

  /** Lista todos los embarazos de una paciente */
  getByPatient: (patientId: string): Promise<Pregnancy[]> =>
    fetch(`${BASE}/patients/${patientId}/pregnancies`).then(r => handleResponse<Pregnancy[]>(r)),

  /** Retorna el embarazo activo de la paciente, o null si no tiene */
  getActive: (patientId: string): Promise<Pregnancy | null> =>
    fetch(`${BASE}/patients/${patientId}/pregnancies/active`).then(r =>
      r.status === 404 ? null : handleResponse<Pregnancy>(r)
    ),

  /** Detalle completo de un embarazo (con controles, riesgos, ecografías) */
  getById: (pregnancyId: string): Promise<Pregnancy> =>
    fetch(`${BASE}/pregnancies/${pregnancyId}`).then(r => handleResponse<Pregnancy>(r)),

  /** Inicia un nuevo embarazo. Lanza error 409 si ya hay uno activo. */
  create: (data: CreatePregnancyDto): Promise<Pregnancy> =>
    fetch(`${BASE}/pregnancies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => handleResponse<Pregnancy>(r)),

  /** Actualiza datos del embarazo (notes, status, etc.) */
  update: (pregnancyId: string, data: Partial<Pregnancy>): Promise<Pregnancy> =>
    fetch(`${BASE}/pregnancies/${pregnancyId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => handleResponse<Pregnancy>(r)),

  /** Lista todos los embarazos activos (para el dashboard de obstetricia) */
  listActive: (): Promise<Array<Pregnancy & { patient: { nombres: string; apellidos: string; numeroDocumento: string } }>> =>
    fetch(`${BASE}/pregnancies/active-list`).then(r => handleResponse(r)),

  // ─── Controles Prenatales ─────────────────────────────────────────────────

  /** Lista de controles del embarazo, ordenados por fecha DESC */
  getControls: (pregnancyId: string): Promise<PrenatalControl[]> =>
    fetch(`${BASE}/pregnancies/${pregnancyId}/controls`).then(r => handleResponse<PrenatalControl[]>(r)),

  /** Registra un nuevo control prenatal */
  addControl: (pregnancyId: string, data: CreatePrenatalControlDto): Promise<PrenatalControl> =>
    fetch(`${BASE}/pregnancies/${pregnancyId}/controls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => handleResponse<PrenatalControl>(r)),

  /** Edita un control existente */
  updateControl: (controlId: string, data: Partial<CreatePrenatalControlDto>): Promise<PrenatalControl> =>
    fetch(`${BASE}/prenatal-controls/${controlId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => handleResponse<PrenatalControl>(r)),

  // ─── Riesgos Obstétricos ──────────────────────────────────────────────────

  /** Lista de factores de riesgo del embarazo */
  getRisks: (pregnancyId: string): Promise<PregnancyRisk[]> =>
    fetch(`${BASE}/pregnancies/${pregnancyId}/risks`).then(r => handleResponse<PregnancyRisk[]>(r)),

  /** Agrega un factor de riesgo. Recalcula riskLevel automáticamente. */
  addRisk: (pregnancyId: string, data: CreatePregnancyRiskDto): Promise<PregnancyRisk> =>
    fetch(`${BASE}/pregnancies/${pregnancyId}/risks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => handleResponse<PregnancyRisk>(r)),

  /** Elimina un factor de riesgo. Recalcula riskLevel. */
  deleteRisk: (riskId: string): Promise<void> =>
    fetch(`${BASE}/pregnancy-risks/${riskId}`, { method: 'DELETE' }).then(r =>
      r.ok ? undefined : handleResponse<void>(r)
    ),

  // ─── Ecografías ───────────────────────────────────────────────────────────

  /** Lista de ecografías del embarazo */
  getEchographies: (pregnancyId: string): Promise<PregnancyEchography[]> =>
    fetch(`${BASE}/pregnancies/${pregnancyId}/echographies`).then(r => handleResponse<PregnancyEchography[]>(r)),

  /** Registra una nueva ecografía (con posible subida de archivos) */
  addEchography: (pregnancyId: string, data: CreateEchographyDto | FormData): Promise<PregnancyEchography> => {
    const isFormData = data instanceof FormData
    return fetch(`${BASE}/pregnancies/${pregnancyId}/echographies`, {
      method: 'POST',
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data),
    }).then(r => handleResponse<PregnancyEchography>(r))
  },
}
