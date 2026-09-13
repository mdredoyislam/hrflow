import { api } from '@/lib/api';

export interface DashboardMetrics {
  totalEmployees: number;
  openJobs: number;
  attendanceRate: number;
  leaveRequests: number;
}

export const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const [employeesRes, jobsRes, leaveRes] = await Promise.all([
    api.get('/employees/'),
    api.get('/job-postings/?status=OPEN'),
    api.get('/leave-requests/?status=PENDING'),
  ]);

  return {
    totalEmployees: employeesRes.data.count || employeesRes.data.length || 0,
    openJobs: jobsRes.data.count || jobsRes.data.length || 0,
    attendanceRate: 94.5, // Mocked until attendance agg is implemented
    leaveRequests: leaveRes.data.count || leaveRes.data.length || 0,
  };
};
