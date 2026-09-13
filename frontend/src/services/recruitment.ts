import { api } from '@/lib/api';

export interface JobPosting {
  id: string;
  title: string;
  department?: string;
  location: string;
  employment_type: string;
  description: string;
  requirements: string;
  status: string;
  opening_date: string;
  closing_date?: string;
  applications_count?: number;
}

export interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  resume?: string;
  linkedin_url?: string;
  source?: string;
}

export interface Application {
  id: string;
  job: string;
  job_details?: JobPosting;
  candidate: string;
  candidate_details?: Candidate;
  status: string;
  applied_on: string;
  notes?: string;
}

export const fetchJobPostings = async (): Promise<JobPosting[]> => {
  const response = await api.get('/job-postings/');
  return response.data;
};

export const createJobPosting = async (data: Partial<JobPosting>): Promise<JobPosting> => {
  const response = await api.post('/job-postings/', data);
  return response.data;
};

export const updateJobPosting = async (id: string, data: Partial<JobPosting>): Promise<JobPosting> => {
  const response = await api.patch(`/job-postings/${id}/`, data);
  return response.data;
};

export const fetchApplications = async (jobId?: string): Promise<Application[]> => {
  const params = jobId ? { job: jobId } : {};
  const response = await api.get('/applications/', { params });
  return response.data;
};

export const updateApplicationStatus = async (id: string, status: string): Promise<Application> => {
  const response = await api.patch(`/applications/${id}/`, { status });
  return response.data;
};

// Public Endpoints
export const fetchPublicJob = async (jobId: string): Promise<JobPosting> => {
  // Using fetch directly or public api instance if needed, but since api handles token, we can just call it
  const response = await api.get(`/public/jobs/${jobId}/`);
  return response.data;
};

export const submitPublicApplication = async (jobId: string, formData: FormData): Promise<any> => {
  const response = await api.post(`/public/jobs/${jobId}/apply/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  return response.data;
};
