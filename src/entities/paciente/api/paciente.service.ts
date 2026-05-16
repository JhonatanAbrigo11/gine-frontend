import { api } from '@/shared/api/base';
import type { Patient, CreatePatientDto } from '../model/types';

export const pacienteService = {
  getAll: async (): Promise<Patient[]> => {
    const response = await api.get<Patient[]>('/patients');
    return response.data;
  },

  getById: async (id: string): Promise<Patient> => {
    const response = await api.get<Patient>(`/patients/${id}`);
    return response.data;
  },

  create: async (data: CreatePatientDto): Promise<Patient> => {
    const response = await api.post<Patient>('/patients', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreatePatientDto>): Promise<Patient> => {
    const response = await api.patch<Patient>(`/patients/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/patients/${id}`);
  },
};
