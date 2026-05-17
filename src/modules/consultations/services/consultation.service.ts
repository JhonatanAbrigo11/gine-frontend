import axios from 'axios';
import type { Consultation } from '../types/consultation.types';

const API_URL = 'http://localhost:3001/api';

export const consultationService = {
  // Inicializar con inteligencia clínica
  init: async (id: string) => {
    const response = await axios.get(`${API_URL}/patients/${id}/init-consultation`);
    return response.data;
  },

  // Guardar consulta completa (Atómico)
  save: async (consultation: Consultation) => {
    const response = await axios.post(`${API_URL}/consultations`, consultation);
    return response.data;
  },

  // Historial global
  getAll: async () => {
    const response = await axios.get(`${API_URL}/consultations`);
    return response.data;
  },

  // Actualizar
  update: async (id: string, consultation: Consultation) => {
    const response = await axios.post(`${API_URL}/consultations/${id}`, consultation);
    return response.data;
  },

  // Detalle individual
  getById: async (id: string) => {
    const response = await axios.get(`${API_URL}/consultations/${id}`);
    return response.data;
  },

  // Historial por paciente
  getHistory: async (patientId: string) => {
    const response = await axios.get(`${API_URL}/consultations/patient/${patientId}`);
    return response.data;
  },

  // Eliminar
  delete: async (id: string) => {
    const response = await axios.delete(`${API_URL}/consultations/${id}`);
    return response.data;
  }
};
