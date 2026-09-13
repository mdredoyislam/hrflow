import { api } from '@/lib/api';
import type { Employee } from './people';

export interface LeaveType {
  id: string;
  name: string;
  description?: string;
  annual_quota: number;
  is_paid: boolean;
  carry_forward_limit: number;
}

export interface LeaveBalance {
  id: string;
  employee: string;
  leave_type: string;
  year: number;
  total_quota: number;
  used: number;
}

export interface LeaveRequest {
  id: string;
  employee: string;
  employee_details?: Employee;
  leave_type: string;
  leave_type_details?: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  approved_by?: string;
  rejection_reason?: string;
}

export const fetchLeaveTypes = async (): Promise<LeaveType[]> => {
  const response = await api.get('/leave-types/');
  return response.data;
};

export const fetchLeaveBalances = async (employeeId?: string): Promise<LeaveBalance[]> => {
  const params = employeeId ? { employee: employeeId } : {};
  const response = await api.get('/leave-balances/', { params });
  return response.data;
};

export const fetchLeaveRequests = async (employeeId?: string): Promise<LeaveRequest[]> => {
  const params = employeeId ? { employee: employeeId } : {};
  const response = await api.get('/leave-requests/', { params });
  return response.data;
};

export const createLeaveRequest = async (data: Partial<LeaveRequest>): Promise<LeaveRequest> => {
  const response = await api.post('/leave-requests/', data);
  return response.data;
};

export const updateLeaveRequestStatus = async (id: string, status: string, rejection_reason?: string): Promise<LeaveRequest> => {
  const data = { status, rejection_reason };
  const response = await api.patch(`/leave-requests/${id}/`, data);
  return response.data;
};
