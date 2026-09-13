import { api } from '@/lib/api';
import type { Employee } from './people';

export interface SalaryStructure {
  id: string;
  employee: string;
  employee_details?: Employee;
  base_salary: string | number;
  currency: string;
  payment_cycle: string;
  effective_from: string;
}

export interface Payslip {
  id: string;
  employee: string;
  employee_details?: Employee;
  month: number;
  year: number;
  basic_salary: string | number;
  total_allowances: string | number;
  total_deductions: string | number;
  net_pay: string | number;
  status: 'DRAFT' | 'GENERATED' | 'PAID';
  payment_date?: string;
  pdf_document?: string;
}

export const fetchSalaryStructures = async (): Promise<SalaryStructure[]> => {
  const response = await api.get('/salary-structures/');
  return response.data;
};

export const fetchPayslips = async (params?: Record<string, any>): Promise<Payslip[]> => {
  const response = await api.get('/payslips/', { params });
  return response.data;
};

export const createPayslip = async (data: Partial<Payslip>): Promise<Payslip> => {
  const response = await api.post('/payslips/', data);
  return response.data;
};

export const updatePayslip = async (id: string, data: Partial<Payslip>): Promise<Payslip> => {
  const response = await api.patch(`/payslips/${id}/`, data);
  return response.data;
};
