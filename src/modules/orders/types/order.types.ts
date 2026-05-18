export interface SampleType {
  id: string;
  name: string;
  description?: string;
}

export interface ExamPreparation {
  id: string;
  title: string;
  content: string;
  active: boolean;
}

export interface MedicalExam {
  id: string;
  categoryId: string;
  sampleTypeId?: string;
  name: string;
  code?: string;
  description?: string;
  preparation?: string;
  recommendations?: string;
  normalRange?: string;
  active: boolean;
  
  sampleType?: SampleType;
  preparations?: ExamPreparation[];
}

export interface ExamCategory {
  id: string;
  orderTypeId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  sortOrder: number;
  active: boolean;
  
  exams: MedicalExam[];
}

export interface OrderType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  active: boolean;
  
  categories: ExamCategory[];
}

export type MedicalOrder = {
  id: string;
  patientId: string;
  orderTypeId: string;
  consultationId?: string;
  consultationType?: string | null;
  doctorId: string;
  secuencial: string;
  date: string;
  status: 'Pendiente' | 'En Proceso' | 'Completado';
  priority: 'Normal' | 'Urgente';
  observations?: string;
  diagnosis?: string;
  
  patient?: any;
  orderType?: OrderType;
  items: MedicalOrderItem[];
  results?: OrderResult[];
  
  _count?: {
    items: number;
  };
};

export interface OrderResult {
  id: string;
  orderId: string;
  url: string;
  filename: string;
  fileType: string;
  createdAt: string;
}

export interface MedicalOrderItem {
  id: string;
  orderId: string;
  examId: string;
  status: string;
  resultUrl?: string;
  observations?: string;
  
  exam: MedicalExam;
}
