import axios from 'axios'

const API_URL = 'http://localhost:3001/api'

export interface Consultation {
  id: string
  patientId: string
  date: string
  type: string
  reason?: string
  diagnosis?: string
  pressure?: string
  weight?: string
  doctor?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateConsultationDto {
  patientId: string
  date?: string
  type: string
  reason?: string
  diagnosis?: string
  pressure?: string
  weight?: string
  doctor?: string
  notes?: string
}

export const consultaService = {
  getByPatientId: async (patientId: string): Promise<Consultation[]> => {
    const response = await axios.get(`${API_URL}/patients/${patientId}/consultations`)
    return response.data
  },

  create: async (data: CreateConsultationDto): Promise<Consultation> => {
    const response = await axios.post(`${API_URL}/consultations`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/consultations/${id}`)
  }
}
