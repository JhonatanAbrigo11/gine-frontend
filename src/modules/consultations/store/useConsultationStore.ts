import { create } from 'zustand';
import type { Consultation, PatientReference } from '../types/consultation.types';

interface ConsultationState {
  // Estado de la consulta activa
  consultation: Consultation | null;
  patient: PatientReference | null;
  inheritance: any | null;
  loading: boolean;

  // Acciones
  initConsultation: (data: any) => void;
  updateConsultation: (fields: Partial<Consultation>) => void;
  updateVitalSigns: (fields: Partial<Consultation['vitalSigns']>) => void;
  updateGynecology: (fields: Partial<Consultation['gynecology']>) => void;
  updateTreatment: (fields: Partial<Consultation['treatment']>) => void;
  setDiagnoses: (diagnoses: Consultation['diagnoses']) => void;
  loadConsultation: (data: any) => void;
  reset: () => void;
}

export const useConsultationStore = create<ConsultationState>((set) => ({
  consultation: null,
  patient: null,
  inheritance: null,
  loading: false,

  initConsultation: (data) => set({
    patient: data.patient,
    inheritance: data.inheritance,
    consultation: {
      id: crypto.randomUUID(), // Generar ID para vinculación temprana
      ...data.initialState,
      patientId: data.patient.id,
      doctorId: 'dr-andres-morquecho'
    }
  }),

  updateConsultation: (fields) => set((state) => ({
    consultation: state.consultation ? { ...state.consultation, ...fields } : null
  })),

  updateVitalSigns: (fields) => set((state) => ({
    consultation: state.consultation 
      ? { ...state.consultation, vitalSigns: { ...state.consultation.vitalSigns, ...fields } } 
      : null
  })),

  updateGynecology: (fields) => set((state) => ({
    consultation: state.consultation 
      ? { ...state.consultation, gynecology: { ...state.consultation.gynecology, ...fields } } 
      : null
  })),

  updateTreatment: (fields) => set((state) => ({
    consultation: state.consultation 
      ? { ...state.consultation, treatment: { ...state.consultation.treatment, ...fields } } 
      : null
  })),

  setDiagnoses: (diagnoses) => set((state) => ({
    consultation: state.consultation ? { ...state.consultation, diagnoses } : null
  })),

  loadConsultation: (data: any) => set({
    patient: data.patient,
    consultation: data
  }),

  reset: () => set({ consultation: null, patient: null, inheritance: null })
}));
