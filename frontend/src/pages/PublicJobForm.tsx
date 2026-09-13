import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchPublicJob, submitPublicApplication } from '@/services/recruitment';
import { Loader2, Briefcase, MapPin, Building, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PublicJobForm() {
  const { jobId } = useParams<{ jobId: string }>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    linkedin_url: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['publicJob', jobId],
    queryFn: () => fetchPublicJob(jobId!),
    enabled: !!jobId,
    retry: false
  });

  const submitMutation = useMutation({
    mutationFn: (data: FormData) => submitPublicApplication(jobId!, data),
    onSuccess: () => {
      setIsSubmitted(true);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      alert("Please upload your resume.");
      return;
    }
    
    const submitData = new FormData();
    submitData.append('first_name', formData.first_name);
    submitData.append('last_name', formData.last_name);
    submitData.append('email', formData.email);
    submitData.append('phone', formData.phone);
    submitData.append('linkedin_url', formData.linkedin_url);
    submitData.append('resume', resumeFile);

    submitMutation.mutate(submitData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
        <p className="text-muted-foreground mb-6">This position may have been filled or the link is invalid.</p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card border border-border rounded-xl p-8 max-w-md w-full text-center shadow-lg"
        >
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
          <p className="text-muted-foreground mb-6">Thank you for applying to the <strong>{job.title}</strong> position. We will review your application and get back to you soon.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <div className="font-bold text-xl tracking-tight text-primary flex items-center gap-2">
            HRFlow Careers
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Job Details */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-4">{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {job.location}</span>
              <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1" /> {job.employment_type}</span>
            </div>
            
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h3 className="text-lg font-semibold mb-2">About the Role</h3>
              <p className="whitespace-pre-wrap text-muted-foreground mb-6">{job.description}</p>
              
              <h3 className="text-lg font-semibold mb-2">Requirements</h3>
              <p className="whitespace-pre-wrap text-muted-foreground">{job.requirements}</p>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="md:col-span-1">
          <div className="bg-card border border-border rounded-xl shadow-sm p-6 sticky top-8">
            <h3 className="font-semibold text-lg mb-4">Apply for this Position</h3>
            
            {submitMutation.isError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm">
                Failed to submit application. Please check your inputs and try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium">First Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" required
                    value={formData.first_name}
                    onChange={e => setFormData({...formData, first_name: e.target.value})}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Last Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" required
                    value={formData.last_name}
                    onChange={e => setFormData({...formData, last_name: e.target.value})}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium">Email <span className="text-red-500">*</span></label>
                <input 
                  type="email" required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium">Phone</label>
                <input 
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium">LinkedIn URL</label>
                <input 
                  type="url"
                  value={formData.linkedin_url}
                  onChange={e => setFormData({...formData, linkedin_url: e.target.value})}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:ring-primary placeholder:text-muted-foreground/50"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium">Resume (PDF, DOCX) <span className="text-red-500">*</span></label>
                <input 
                  type="file" required
                  accept=".pdf,.doc,.docx"
                  onChange={e => setResumeFile(e.target.files?.[0] || null)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:ring-primary file:border-0 file:bg-transparent file:text-sm file:font-medium"
                />
              </div>

              <button 
                type="submit" 
                disabled={submitMutation.isPending}
                className="w-full h-10 mt-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
              >
                {submitMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
