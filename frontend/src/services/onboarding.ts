import { api } from '@/lib/api';
import type { Employee } from './people';

export interface OnboardingTask {
  id: string;
  employee: string;
  employee_details?: Employee;
  task_name: string;
  description?: string;
  due_date?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  assigned_to?: string;
  assigned_to_details?: Employee;
}

export const fetchOnboardingTasks = async (): Promise<OnboardingTask[]> => {
  const response = await api.get('/onboarding-tasks/');
  return response.data;
};

export const createOnboardingTask = async (data: Partial<OnboardingTask>): Promise<OnboardingTask> => {
  const response = await api.post('/onboarding-tasks/', data);
  return response.data;
};

export const updateOnboardingTask = async (id: string, data: Partial<OnboardingTask>): Promise<OnboardingTask> => {
  const response = await api.patch(`/onboarding-tasks/${id}/`, data);
  return response.data;
};
