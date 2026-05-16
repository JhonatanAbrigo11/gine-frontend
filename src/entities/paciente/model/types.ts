export interface Patient {
  id: string;
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  estadoCivil: string;
  ocupacion?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  contactoEmergencia?: string;
  telefonoEmergencia?: string;
  tipoSanguineo?: string;
  alergias?: string;
  antecedentes?: string;
  seguroMedico?: string;
  menarquia?: string;
  metodoAnticonceptivo?: string;
  vidaSexualActiva: string;
  gestas: number;
  partos: number;
  cesareas: number;
  abortos: number;
  fechaRegistro: string;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
  consultations?: any[];
}

export type CreatePatientDto = Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>;
