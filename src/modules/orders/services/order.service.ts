import axios from 'axios';
import type { OrderType, MedicalOrder } from '../types/order.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const orderService = {
  // Obtener catálogo completo para órdenes
  getOrderTypes: async (): Promise<OrderType[]> => {
    const response = await axios.get(`${API_URL}/order-types`);
    return response.data;
  },

  // Obtener historial de órdenes de un paciente
  getPatientOrders: async (patientId: string): Promise<MedicalOrder[]> => {
    const response = await axios.get(`${API_URL}/medical-orders`, {
      params: { patientId }
    });
    return response.data;
  },

  // Obtener detalle de una orden
  getOrderDetails: async (id: string): Promise<MedicalOrder> => {
    const response = await axios.get(`${API_URL}/medical-orders/${id}`);
    return response.data;
  },

  // Crear nueva orden profesional
  createOrder: async (data: {
    patientId: string;
    orderTypeId: string;
    consultationId?: string;
    priority?: string;
    observations?: string;
    diagnosis?: string;
    examIds: string[];
  }): Promise<MedicalOrder> => {
    const response = await axios.post(`${API_URL}/medical-orders`, data);
    return response.data;
  },
  
  // Actualizar orden existente
  updateOrder: async (id: string, data: {
    priority?: string;
    observations?: string;
    diagnosis?: string;
    examIds: string[];
  }): Promise<MedicalOrder> => {
    const response = await axios.put(`${API_URL}/medical-orders/${id}`, data);
    return response.data;
  },

  // Subir archivos de resultados
  uploadResults: async (id: string, files: File[]): Promise<MedicalOrder> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await axios.post(`${API_URL}/medical-orders/${id}/results`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Eliminar un resultado específico
  deleteResult: async (orderId: string, resultId: string): Promise<void> => {
    await axios.delete(`${API_URL}/medical-orders/${orderId}/results/${resultId}`);
  }
};
