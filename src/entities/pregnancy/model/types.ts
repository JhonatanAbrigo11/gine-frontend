// ==========================================
// TIPOS: Módulo de Embarazos y Obstetricia
// ==========================================

export type RiskLevel = 'sin_riesgo' | 'bajo' | 'alto' | 'muy_alto'
export type PregnancyStatus = 'activo' | 'cerrado' | 'perdido' | 'ectopico'
export type StudyType = 'morfologica' | 'tamizaje' | 'doppler' | 'biofisico' | 'transvaginal' | 'otro'
export type EdemaGrade = 'Ausente' | '+' | '++' | '+++'
export type FetalMovements = 'Presentes' | 'Disminuidos' | 'Ausentes'
export type ContractionStatus = 'Ausentes' | 'Irregulares' | 'Regulares'

export interface Pregnancy {
  id: string
  patientId: string
  fum: string           // ISO date
  fpp: string           // ISO date — calculado por backend (Regla de Naegele)
  egInitial?: number    // semanas al inicio
  initialWeight?: number // kg
  initialHeight?: number // cm
  initialImc?: number   // calculado
  bloodType?: string
  rh?: string
  riskScore: number
  riskLevel: RiskLevel
  status: PregnancyStatus
  notes?: string
  createdAt: string
  closedAt?: string
  // Relaciones incluidas en respuestas detalladas
  controls?: PrenatalControl[]
  risks?: PregnancyRisk[]
  echographies?: PregnancyEchography[]
  // Incluido en GET /api/pregnancies/:id y /active-list
  patient?: {
    id: string
    nombres: string
    apellidos: string
    numeroDocumento: string
    fechaNacimiento?: string
    tipoSanguineo?: string
    alergias?: string
    antecedentes?: string
  }
  // Incluido en listas (count de relaciones)
  _count?: {
    controls: number
    echographies?: number
  }
}

export interface PrenatalControl {
  id: string
  pregnancyId: string
  controlDate: string       // ISO date
  gestationalAge: number    // semanas (ej: 24.2)
  maternalWeight?: number   // kg
  bloodPressure?: string    // "110/70"
  temperature?: number      // °C
  fetalHeartRate?: number   // lpm (FCF)
  uterineHeight?: number    // cm (AU)
  edema?: EdemaGrade
  fetalMovements?: FetalMovements
  contractions?: ContractionStatus
  observations?: string
  plan?: string
  createdAt: string
}

export interface PregnancyRisk {
  id: string
  pregnancyId: string
  riskName: string
  riskScore: number
  notes?: string
  createdAt: string
}

export interface PregnancyEchography {
  id: string
  pregnancyId: string
  studyDate: string      // ISO date
  studyType: StudyType
  gestationalAge?: number
  studyName: string
  report?: string
  doctorName?: string
  pdfUrl?: string
  images: string[]
  createdAt: string
}

// DTOs para creación
export interface CreatePregnancyDto {
  patientId: string
  fum: string            // ISO date string
  initialWeight?: number
  initialHeight?: number
  bloodType?: string
  rh?: string
  notes?: string
}

export interface CreatePrenatalControlDto {
  controlDate?: string
  gestationalAge: number
  maternalWeight?: number
  bloodPressure?: string
  temperature?: number
  fetalHeartRate?: number
  uterineHeight?: number
  edema?: EdemaGrade
  fetalMovements?: FetalMovements
  contractions?: ContractionStatus
  observations?: string
  plan?: string
}

export interface CreatePregnancyRiskDto {
  riskName: string
  riskScore: number
  notes?: string
}

export interface CreateEchographyDto {
  studyDate: string
  studyType: StudyType
  gestationalAge?: number
  studyName: string
  report?: string
  doctorName?: string
}
