import { api } from '@/lib/api';
import type { User } from '@/contexts/AuthContext';

export interface Organization {
  id: string;
  name: string;
  subdomain?: string;
  is_active: boolean;
  created_at: string;
}

export const fetchOrganizations = async (): Promise<Organization[]> => {
  const response = await api.get('/organizations/');
  return response.data;
};

export const updateOrganization = async (id: string, data: Partial<Organization>): Promise<Organization> => {
  const response = await api.patch(`/organizations/${id}/`, data);
  return response.data;
};

export const fetchAllUsers = async (): Promise<User[]> => {
  const response = await api.get('/users/');
  return response.data;
};
