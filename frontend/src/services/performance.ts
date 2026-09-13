import { api } from '@/lib/api';
import type { Employee } from './people';

export interface KPI {
  id: string;
  name: string;
  description?: string;
  target_value?: string;
  department?: string;
}

export interface Goal {
  id: string;
  employee: string;
  title: string;
  description?: string;
  kpi?: string;
  start_date: string;
  end_date: string;
  progress_percentage: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface Feedback {
  id: string;
  employee: string;
  provider?: string;
  feedback_type: '360_REVIEW' | 'CONTINUOUS';
  content: string;
  is_anonymous: boolean;
  created_at: string;
}

export const fetchKPIs = async (): Promise<KPI[]> => {
  const response = await api.get('/kpis/');
  return response.data;
};

export const createKPI = async (data: Partial<KPI>): Promise<KPI> => {
  const response = await api.post('/kpis/', data);
  return response.data;
};

export const updateKPI = async (id: string, data: Partial<KPI>): Promise<KPI> => {
  const response = await api.patch(`/kpis/${id}/`, data);
  return response.data;
};

export const deleteKPI = async (id: string): Promise<void> => {
  await api.delete(`/kpis/${id}/`);
};

export const fetchGoals = async (employeeId?: string): Promise<Goal[]> => {
  const params = employeeId ? { employee: employeeId } : {};
  const response = await api.get('/goals/', { params });
  return response.data;
};

export const createGoal = async (data: Partial<Goal>): Promise<Goal> => {
  const response = await api.post('/goals/', data);
  return response.data;
};

export const updateGoal = async (id: string, data: Partial<Goal>): Promise<Goal> => {
  const response = await api.patch(`/goals/${id}/`, data);
  return response.data;
};

export const fetchFeedbacks = async (employeeId?: string): Promise<Feedback[]> => {
  const params = employeeId ? { employee: employeeId } : {};
  const response = await api.get('/feedbacks/', { params });
  return response.data;
};

export const createFeedback = async (data: Partial<Feedback>): Promise<Feedback> => {
  const response = await api.post('/feedbacks/', data);
  return response.data;
};
