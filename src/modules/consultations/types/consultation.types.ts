export interface VitalSigns {
  weight: string;
  height: string;
  pressure: string;
  heartRate: string;
  respRate: string;
  temp: string;
  saturacion: string;
  bmi: string;
  alturaUterina?: string;
  fcf?: string;
  movFetales?: string;
  edema?: string;
  contracciones?: string;
}

export interface GynecologyData {
  fum: string | null;
  fpp: string | null;
  eg: string | null;
  ciclo: number;
  duracion: number;
  regularidad: string;
  metodo: string | null;
  vidaSexualActiva: boolean;
  sintomasMenstruales: string | null;

  // Fórmula
  gestas: number;
  partos: number;
  cesareas: number;
  abortos: number;
  hijosVivos: number;
  ectopicos: number;
  fechaUltimoParto: string | null;

  // Antecedentes
  papUltimo: string | null;
  papResultado: string | null;
  colposcopia: string | null;
  itsPrevias: string | null;
  cirugiasGine: string | null;
  endometriosis: boolean;
  sop: boolean;
  miomatosis: boolean;
  quistes: boolean;

  // Síntomas
  dolorPelvico: boolean;
  dismenorrea: boolean;
  sangradoIrregular: boolean;
  leucorrea: boolean;
  mastalgia: boolean;
  amenorrea: boolean;

  observaciones?: string;
}

export interface Diagnosis {
  code: string;
  description: string;
  isPrimary: boolean;
}

export interface Treatment {
  plan: string;
  followUp: string;
}

export interface Consultation {
  id?: string;
  patientId: string;
  doctorId: string;
  type: string;
  reason: string;
  evolution: string;
  
  vitalSigns: VitalSigns;
  gynecology: GynecologyData;
  diagnoses: Diagnosis[];
  treatment: Treatment;
  medicalOrders?: any[]; // Usando any para evitar dependencias circulares complejas o importar si es posible
}

export interface PatientReference {
  id: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  numeroDocumento?: string;
  edad: number;
  tipoSanguineo: string;
  alergias: string;
  antecedentes: string;
}
