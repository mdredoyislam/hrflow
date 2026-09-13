import { api } from '@/lib/api';

export interface Asset {
  id: string;
  name: string;
  category: string;
  serial_number: string;
  purchase_date?: string;
  purchase_cost?: string | number;
  status: 'AVAILABLE' | 'ASSIGNED' | 'MAINTENANCE' | 'RETIRED';
}

export interface Document {
  id: string;
  title: string;
  category?: string;
  file: string;
  uploaded_at: string;
  is_public: boolean;
}

export const fetchAssets = async (): Promise<Asset[]> => {
  const response = await api.get('/assets/');
  return response.data;
};

export const createAsset = async (data: Partial<Asset>): Promise<Asset> => {
  const response = await api.post('/assets/', data);
  return response.data;
};

export const fetchDocuments = async (): Promise<Document[]> => {
  const response = await api.get('/documents/');
  return response.data;
};

export const createDocument = async (formData: FormData): Promise<Document> => {
  const response = await api.post('/documents/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
