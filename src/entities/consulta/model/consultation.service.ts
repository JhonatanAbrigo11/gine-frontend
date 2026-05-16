import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const consultationService = {
  // Inicializar nueva consulta con datos previos
  initConsultation: async (patientIdOrCedula: string) => {
    const response = await axios.get(`${API_URL}/patients/${patientIdOrCedula}/init-consultation`);
    return response.data;
  },

  // Guardar consulta
  save: async (data: any) => {
    const response = await axios.post(`${API_URL}/consultations`, data);
    return response.data;
  },

  // Obtener historial
  getByPatient: async (patientId: string) => {
    const response = await axios.get(`${API_URL}/consultations/patient/${patientId}`);
    return response.data;
  }
};
