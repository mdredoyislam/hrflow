import { api } from '@/lib/api';

export interface Employee {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  joining_date: string;
  department?: string;
  department_name?: string;
  designation?: string;
  designation_name?: string;
  manager?: string;
  employment_type: string;
  status: string;
  create_user_account?: boolean;
}

export const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await api.get('/employees/');
  return response.data;
};

export const createEmployee = async (data: Partial<Employee>): Promise<Employee> => {
  const response = await api.post('/employees/', data);
  return response.data;
};

export const updateEmployee = async (id: string, data: Partial<Employee>): Promise<Employee> => {
  const response = await api.patch(`/employees/${id}/`, data);
  return response.data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  await api.delete(`/employees/${id}/`);
};

export interface Designation {
  id: string;
  name: string;
  description?: string;
}

export const fetchDesignations = async (): Promise<Designation[]> => {
  const response = await api.get('/designations/');
  return response.data;
};

export const createDesignation = async (data: Partial<Designation>): Promise<Designation> => {
  const response = await api.post('/designations/', data);
  return response.data;
};

export const deleteDesignation = async (id: string): Promise<void> => {
  await api.delete(`/designations/${id}/`);
};
