import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pregnancyService } from '../api/pregnancy.service'
import type { CreatePregnancyDto, CreatePrenatalControlDto, CreatePregnancyRiskDto, CreateEchographyDto } from '../model/types'

// ─── Query Keys (centralizadas para invalidación consistente) ─────────────────

export const pregnancyKeys = {
  all:               ['pregnancies'] as const,
  byPatient:         (patientId: string) => ['pregnancies', 'patient', patientId] as const,
  active:            (patientId: string) => ['pregnancies', 'active', patientId] as const,
  activeList:        () => ['pregnancies', 'active-list'] as const,
  detail:            (pregnancyId: string) => ['pregnancies', pregnancyId] as const,
  controls:          (pregnancyId: string) => ['controls', pregnancyId] as const,
  risks:             (pregnancyId: string) => ['risks', pregnancyId] as const,
  echographies:      (pregnancyId: string) => ['echographies', pregnancyId] as const,
}

// ─── Hooks de Consulta ────────────────────────────────────────────────────────

/** Obtiene todos los embarazos de una paciente */
export function usePatientPregnancies(patientId: string | undefined) {
  return useQuery({
    queryKey: pregnancyKeys.byPatient(patientId ?? ''),
    queryFn: () => pregnancyService.getByPatient(patientId!),
    enabled: !!patientId,
  })
}

/** Obtiene el embarazo activo de una paciente (null si no tiene) */
export function useActivePregnancy(patientId: string | undefined) {
  return useQuery({
    queryKey: pregnancyKeys.active(patientId ?? ''),
    queryFn: () => pregnancyService.getActive(patientId!),
    enabled: !!patientId,
  })
}

/** Detalle completo de un embarazo */
export function usePregnancy(pregnancyId: string | undefined) {
  return useQuery({
    queryKey: pregnancyKeys.detail(pregnancyId ?? ''),
    queryFn: () => pregnancyService.getById(pregnancyId!),
    enabled: !!pregnancyId,
  })
}

/** Lista de embarazos activos para el dashboard de obstetricia */
export function useActivePregnanciesList() {
  return useQuery({
    queryKey: pregnancyKeys.activeList(),
    queryFn: () => pregnancyService.listActive(),
  })
}

/** Controles prenatales de un embarazo */
export function usePrenatalControls(pregnancyId: string | undefined) {
  return useQuery({
    queryKey: pregnancyKeys.controls(pregnancyId ?? ''),
    queryFn: () => pregnancyService.getControls(pregnancyId!),
    enabled: !!pregnancyId,
  })
}

/** Riesgos obstétricos de un embarazo */
export function usePregnancyRisks(pregnancyId: string | undefined) {
  return useQuery({
    queryKey: pregnancyKeys.risks(pregnancyId ?? ''),
    queryFn: () => pregnancyService.getRisks(pregnancyId!),
    enabled: !!pregnancyId,
  })
}

/** Ecografías de un embarazo */
export function usePregnancyEchographies(pregnancyId: string | undefined) {
  return useQuery({
    queryKey: pregnancyKeys.echographies(pregnancyId ?? ''),
    queryFn: () => pregnancyService.getEchographies(pregnancyId!),
    enabled: !!pregnancyId,
  })
}

// ─── Hooks de Mutación ────────────────────────────────────────────────────────

/** Inicia un nuevo embarazo */
export function useCreatePregnancy() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePregnancyDto) => pregnancyService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: pregnancyKeys.byPatient(variables.patientId) })
      queryClient.invalidateQueries({ queryKey: pregnancyKeys.active(variables.patientId) })
      queryClient.invalidateQueries({ queryKey: pregnancyKeys.activeList() })
    },
  })
}

/** Registra un nuevo control prenatal */
export function useAddPrenatalControl(pregnancyId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePrenatalControlDto) => pregnancyService.addControl(pregnancyId, data),
    onSuccess: () => {
      // Invalida controles + detalle del embarazo (actualiza estadísticas de cabecera)
      queryClient.invalidateQueries({ queryKey: pregnancyKeys.controls(pregnancyId) })
      queryClient.invalidateQueries({ queryKey: pregnancyKeys.detail(pregnancyId) })
      queryClient.invalidateQueries({ queryKey: pregnancyKeys.activeList() })
    },
  })
}

/** Agrega un factor de riesgo y recalcula el nivel */
export function useAddPregnancyRisk(pregnancyId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePregnancyRiskDto) => pregnancyService.addRisk(pregnancyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pregnancyKeys.risks(pregnancyId) })
      queryClient.invalidateQueries({ queryKey: pregnancyKeys.detail(pregnancyId) })
    },
  })
}

/** Elimina un factor de riesgo */
export function useDeletePregnancyRisk(pregnancyId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (riskId: string) => pregnancyService.deleteRisk(riskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pregnancyKeys.risks(pregnancyId) })
      queryClient.invalidateQueries({ queryKey: pregnancyKeys.detail(pregnancyId) })
    },
  })
}

/** Registra una nueva ecografía */
export function useAddEchography(pregnancyId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateEchographyDto | FormData) => pregnancyService.addEchography(pregnancyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pregnancyKeys.echographies(pregnancyId) })
    },
  })
}

/** Actualiza un embarazo (cerrar, editar notas, etc.) */
export function useUpdatePregnancy(pregnancyId: string, patientId?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof pregnancyService.update>[1]) =>
      pregnancyService.update(pregnancyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pregnancyKeys.detail(pregnancyId) })
      queryClient.invalidateQueries({ queryKey: pregnancyKeys.activeList() })
      if (patientId) {
        queryClient.invalidateQueries({ queryKey: pregnancyKeys.active(patientId) })
        queryClient.invalidateQueries({ queryKey: pregnancyKeys.byPatient(patientId) })
      }
    },
  })
}
