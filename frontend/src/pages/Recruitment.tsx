import { useState, useMemo } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Briefcase, Mail, Phone, Loader2, Link as LinkIcon, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJobPostings, fetchApplications, createJobPosting, updateApplicationStatus } from '@/services/recruitment';
import type { JobPosting, Application } from '@/services/recruitment';

export default function Recruitment() {
  const queryClient = useQueryClient();
  const [activeJobId, setActiveJobId] = useState<string>('');
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobFormData, setJobFormData] = useState<Partial<JobPosting>>({
    title: '',
    location: '',
    employment_type: 'Full-time',
    description: '',
    requirements: '',
    status: 'PUBLISHED'
  });

  const { data: jobs, isLoading: isLoadingJobs } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobPostings,
  });

  // Automatically select the first job if none is selected
  useMemo(() => {
    if (jobs && jobs.length > 0 && !activeJobId) {
      setActiveJobId(jobs[0].id);
    }
  }, [jobs, activeJobId]);

  const { data: applications, isLoading: isLoadingApps } = useQuery({
    queryKey: ['applications', activeJobId],
    queryFn: () => fetchApplications(activeJobId),
    enabled: !!activeJobId,
  });

  const createJobMutation = useMutation({
    mutationFn: createJobPosting,
    onSuccess: (newJob) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsJobModalOpen(false);
      setActiveJobId(newJob.id);
      setJobFormData({
        title: '',
        location: '',
        employment_type: 'Full-time',
        description: '',
        requirements: '',
        status: 'PUBLISHED'
      });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => updateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', activeJobId] });
    }
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    createJobMutation.mutate(jobFormData);
  };

  const stages = [
    { id: 'APPLIED', name: 'Applied' },
    { id: 'SCREENING', name: 'Screening' },
    { id: 'INTERVIEW', name: 'Interview' },
    { id: 'OFFERED', name: 'Offered' },
    { id: 'HIRED', name: 'Hired' },
    { id: 'REJECTED', name: 'Rejected' },
  ];

  const handleCopyLink = () => {
    if (!activeJobId) return;
    const url = `${window.location.origin}/careers/${activeJobId}`;
    navigator.clipboard.writeText(url);
    alert('Public job link copied to clipboard!');
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recruitment Pipeline</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage active job postings and candidate pipelines.</p>
        </div>
        <div className="flex space-x-2">
          {activeJobId && (
            <button 
              onClick={handleCopyLink}
              className="h-9 px-4 rounded-md border border-input bg-background hover:bg-muted text-sm font-medium transition-colors flex items-center"
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Copy Public Link
            </button>
          )}
          <button 
            onClick={() => setIsJobModalOpen(true)}
            className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Job
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center shrink-0">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <select 
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
              value={activeJobId}
              onChange={(e) => setActiveJobId(e.target.value)}
              disabled={isLoadingJobs}
            >
              <option value="">Select a Job Posting</option>
              {jobs?.map(job => (
                <option key={job.id} value={job.id}>{job.title} ({job.status})</option>
              ))}
            </select>
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {isLoadingApps ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !activeJobId ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Please select or create a job posting to view applications.
          </div>
        ) : (
          stages.map(stage => {
            const stageApps = applications?.filter(app => app.status === stage.id) || [];
            return (
              <div key={stage.id} className="w-80 shrink-0 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm flex items-center">
                    {stage.name} 
                    <span className="ml-2 bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs">
                      {stageApps.length}
                    </span>
                  </h3>
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex-1 bg-muted/30 rounded-xl p-3 border border-border/50 flex flex-col gap-3 min-h-[200px]">
                  {stageApps.map(app => (
                    <div key={app.id} className="bg-card p-4 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow group flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{app.candidate_details?.first_name} {app.candidate_details?.last_name}</h4>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{app.candidate_details?.email}</span>
                      </div>

                      {app.candidate_details?.resume && (
                        <a href={app.candidate_details.resume} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
                          View Resume
                        </a>
                      )}
                      
                      <div className="mt-2 pt-2 border-t border-border">
                        <select 
                          className="w-full h-7 text-xs rounded border-input bg-background focus:ring-primary"
                          value={app.status}
                          onChange={(e) => updateStatusMutation.mutate({ id: app.id, status: e.target.value })}
                        >
                          {stages.map(s => (
                            <option key={s.id} value={s.id}>Move to {s.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                  
                  {stageApps.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground border-2 border-dashed border-border rounded-lg">
                      No candidates
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* New Job Modal */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h2 className="text-lg font-semibold">Post New Job</h2>
              <button onClick={() => setIsJobModalOpen(false)} className="text-muted-foreground hover:text-foreground">&times;</button>
            </div>
            
            <form onSubmit={handleCreateJob} className="p-6 overflow-y-auto space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Title</label>
                <input 
                  type="text" required
                  value={jobFormData.title}
                  onChange={e => setJobFormData({...jobFormData, title: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <input 
                    type="text" required
                    value={jobFormData.location}
                    onChange={e => setJobFormData({...jobFormData, location: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employment Type</label>
                  <select 
                    value={jobFormData.employment_type}
                    onChange={e => setJobFormData({...jobFormData, employment_type: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Job Description</label>
                <textarea 
                  required
                  rows={4}
                  value={jobFormData.description}
                  onChange={e => setJobFormData({...jobFormData, description: e.target.value})}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Requirements</label>
                <textarea 
                  required
                  rows={3}
                  value={jobFormData.requirements}
                  onChange={e => setJobFormData({...jobFormData, requirements: e.target.value})}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-2 border-t border-border">
                <button 
                  type="button" 
                  onClick={() => setIsJobModalOpen(false)}
                  className="h-10 px-4 py-2 border border-input bg-background hover:bg-muted rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={createJobMutation.isPending}
                  className="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors flex items-center"
                >
                  {createJobMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
