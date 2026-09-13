import { useState } from 'react';
import { Target, TrendingUp, Search, Plus, Filter, MessageSquare, Award, AlertCircle, Loader2, List, Calendar, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchGoals, fetchFeedbacks, createGoal, createFeedback, createKPI, fetchKPIs } from '@/services/performance';
import { fetchEmployees } from '@/services/people';
import { useAuth } from '@/contexts/AuthContext';

export default function Performance() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'goals' | 'kpis' | 'reviews' | 'feedback'>('goals');
  
  // Modals state
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isKPIModalOpen, setIsKPIModalOpen] = useState(false);

  const { data: employees } = useQuery({ queryKey: ['employees'], queryFn: fetchEmployees });
  const { data: goals, isLoading: goalsLoading } = useQuery({ queryKey: ['goals'], queryFn: () => fetchGoals() });
  const { data: feedbacks, isLoading: feedbacksLoading } = useQuery({ queryKey: ['feedbacks'], queryFn: () => fetchFeedbacks() });
  const { data: kpis, isLoading: kpisLoading } = useQuery({ queryKey: ['kpis'], queryFn: fetchKPIs });

  // Mutations
  const createGoalMutation = useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setIsGoalModalOpen(false);
    }
  });

  const createFeedbackMutation = useMutation({
    mutationFn: createFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      setIsFeedbackModalOpen(false);
    }
  });

  const createKPIMutation = useMutation({
    mutationFn: createKPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      setIsKPIModalOpen(false);
    }
  });

  const radialData = [
    { name: 'Completed', value: goals?.filter(g => g.status === 'COMPLETED').length || 0, fill: 'hsl(var(--primary))' },
    { name: 'On Track', value: goals?.filter(g => g.status === 'IN_PROGRESS').length || 0, fill: 'hsl(var(--accent))' },
    { name: 'At Risk', value: goals?.filter(g => g.status === 'NOT_STARTED').length || 0, fill: 'hsl(var(--destructive))' },
  ];

  // Forms state
  const [goalForm, setGoalForm] = useState({ title: '', description: '', kpi: '', start_date: '', end_date: '', employee: '' });
  const [feedbackForm, setFeedbackForm] = useState({ content: '', feedback_type: 'CONTINUOUS', provider: '', is_anonymous: false, employee: '' });
  const [kpiForm, setKpiForm] = useState({ name: '', description: '', target_value: '' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Performance & Growth</h1>
          <p className="text-muted-foreground text-sm mt-1">Track goals, KPIs, reviews, and continuous feedback.</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsKPIModalOpen(true)}
            className="h-9 px-4 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center"
          >
            <List className="w-4 h-4 mr-2" />
            New KPI
          </button>
          <button 
            onClick={() => setIsFeedbackModalOpen(true)}
            className="h-9 px-4 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Request Feedback
          </button>
          <button 
            onClick={() => setIsGoalModalOpen(true)}
            className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </button>
        </div>
      </div>

      <div className="border-b border-border">
        <nav className="flex space-x-6 overflow-x-auto" aria-label="Tabs">
          <button onClick={() => setActiveTab('goals')} className={cn("py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap", activeTab === 'goals' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground")}>Goals</button>
          <button onClick={() => setActiveTab('kpis')} className={cn("py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap", activeTab === 'kpis' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground")}>KPIs</button>
          <button onClick={() => setActiveTab('feedback')} className={cn("py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap", activeTab === 'feedback' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground")}>360 Feedback</button>
          <button onClick={() => setActiveTab('reviews')} className={cn("py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap", activeTab === 'reviews' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground")}>Performance Reviews</button>
        </nav>
      </div>

      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">Active Goals</h3>
                <button className="text-sm font-medium text-primary hover:underline">View All</button>
              </div>
              
              <div className="space-y-4">
                {goalsLoading ? (
                  <div className="flex justify-center p-8"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
                ) : goals?.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground border rounded-xl border-dashed">No active goals found.</div>
                ) : goals?.map(goal => {
                  const emp = employees?.find(e => e.id === goal.employee);
                  const kpi = kpis?.find(k => k.id === goal.kpi);
                  return (
                    <div key={goal.id} className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-base">{goal.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1 flex items-center">
                            <Target className="w-4 h-4 mr-1.5" />
                            KPI: {kpi ? kpi.name : 'None'}
                          </p>
                        </div>
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                          goal.status === 'COMPLETED' ? "bg-green-100 text-green-700 border-green-200" :
                          goal.status === 'IN_PROGRESS' ? "bg-blue-100 text-blue-700 border-blue-200" :
                          "bg-red-100 text-red-700 border-red-200"
                        )}>
                          {goal.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-foreground">{goal.progress_percentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className={cn(
                            "h-2 rounded-full transition-all",
                            goal.progress_percentage === 100 ? "bg-green-500" : "bg-primary"
                          )} style={{ width: `${goal.progress_percentage}%` }}></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                        <span>Owner: {emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown'}</span>
                        <span>Due: {goal.end_date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Goal Health</h3>
                <div className="h-64 flex items-center justify-center">
                   <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      cx="50%" cy="50%" 
                      innerRadius="30%" outerRadius="100%" 
                      barSize={15} data={radialData}
                    >
                      <RadialBar background dataKey="value" cornerRadius={10} />
                      <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'kpis' && (
        <div className="space-y-4">
          {kpisLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
          ) : kpis?.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground border rounded-xl border-dashed">No KPIs defined yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kpis?.map(kpi => (
                <div key={kpi.id} className="bg-card p-5 rounded-xl border border-border shadow-sm hover:border-primary/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-base">{kpi.name}</h4>
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{kpi.description}</p>
                  <div className="bg-muted p-3 rounded-lg flex justify-between items-center text-sm">
                    <span className="font-medium text-foreground">Target</span>
                    <span className="font-bold text-primary">{kpi.target_value || 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacksLoading ? (
              <div className="col-span-2 flex justify-center p-8"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
            ) : feedbacks?.length === 0 ? (
              <div className="col-span-2 p-8 text-center text-muted-foreground border rounded-xl border-dashed">No feedback found.</div>
            ) : feedbacks?.map(fb => {
              const emp = employees?.find(e => e.id === fb.employee);
              const provider = employees?.find(e => e.id === fb.provider);
              return (
                <div key={fb.id} className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-sm">
                        {fb.is_anonymous ? '?' : provider?.first_name?.[0] || 'T'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">
                          {fb.is_anonymous ? 'Anonymous' : provider ? `${provider.first_name} ${provider.last_name}` : 'Unknown'}
                        </h4>
                        <p className="text-xs text-muted-foreground">To: {emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{fb.feedback_type.replace('_', ' ')} • {new Date(fb.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm leading-relaxed text-foreground italic border-l-2 border-primary/50 pl-3 py-1">
                    "{fb.content}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="bg-card p-12 rounded-xl border border-border shadow-sm flex flex-col items-center justify-center text-center h-[400px]">
          <TrendingUp className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-semibold">Q4 Performance Review Cycle</h3>
          <p className="text-muted-foreground mt-2 max-w-md">
            The next official performance review cycle begins on December 1st. Self-evaluations will be unlocked at that time.
          </p>
          <button className="mt-6 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            View Past Reviews
          </button>
        </div>
      )}

      {/* Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h2 className="text-lg font-semibold">Create New Goal</h2>
              <button onClick={() => setIsGoalModalOpen(false)} className="text-muted-foreground hover:text-foreground">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <input 
                  type="text"
                  value={goalForm.title} onChange={e => setGoalForm({...goalForm, title: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  placeholder="e.g. Increase sales by 20%"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employee</label>
                  <select 
                    value={goalForm.employee} onChange={e => setGoalForm({...goalForm, employee: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  >
                    <option value="">Select Employee</option>
                    {employees?.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">KPI</label>
                  <select 
                    value={goalForm.kpi} onChange={e => setGoalForm({...goalForm, kpi: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  >
                    <option value="">Select KPI (Optional)</option>
                    {kpis?.map(kpi => (
                      <option key={kpi.id} value={kpi.id}>{kpi.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <input 
                    type="date"
                    value={goalForm.start_date} onChange={e => setGoalForm({...goalForm, start_date: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <input 
                    type="date"
                    value={goalForm.end_date} onChange={e => setGoalForm({...goalForm, end_date: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
              <button onClick={() => setIsGoalModalOpen(false)} className="h-10 px-4 py-2 border rounded-md text-sm font-medium">Cancel</button>
              <button 
                onClick={() => createGoalMutation.mutate({ ...goalForm, progress_percentage: 0, status: 'NOT_STARTED' } as any)}
                disabled={createGoalMutation.isPending || !goalForm.title || !goalForm.employee || !goalForm.start_date || !goalForm.end_date}
                className="h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium disabled:opacity-50 flex items-center"
              >
                {createGoalMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Modal */}
      {isKPIModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h2 className="text-lg font-semibold">Define KPI</h2>
              <button onClick={() => setIsKPIModalOpen(false)} className="text-muted-foreground hover:text-foreground">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">KPI Name</label>
                <input 
                  type="text"
                  value={kpiForm.name} onChange={e => setKpiForm({...kpiForm, name: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  placeholder="e.g. Monthly Active Users"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  value={kpiForm.description} onChange={e => setKpiForm({...kpiForm, description: e.target.value})}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  placeholder="Details about this KPI..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Value</label>
                <input 
                  type="text"
                  value={kpiForm.target_value} onChange={e => setKpiForm({...kpiForm, target_value: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  placeholder="e.g. 100,000"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
              <button onClick={() => setIsKPIModalOpen(false)} className="h-10 px-4 py-2 border rounded-md text-sm font-medium">Cancel</button>
              <button 
                onClick={() => createKPIMutation.mutate(kpiForm as any)}
                disabled={createKPIMutation.isPending || !kpiForm.name}
                className="h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium disabled:opacity-50 flex items-center"
              >
                {createKPIMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save KPI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h2 className="text-lg font-semibold">Submit Feedback</h2>
              <button onClick={() => setIsFeedbackModalOpen(false)} className="text-muted-foreground hover:text-foreground">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">To Employee</label>
                  <select 
                    value={feedbackForm.employee} onChange={e => setFeedbackForm({...feedbackForm, employee: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  >
                    <option value="">Select Employee</option>
                    {employees?.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">From (Provider)</label>
                  <select 
                    value={feedbackForm.provider} onChange={e => setFeedbackForm({...feedbackForm, provider: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  >
                    <option value="">Select Provider (You)</option>
                    {employees?.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Feedback</label>
                <textarea 
                  value={feedbackForm.content} onChange={e => setFeedbackForm({...feedbackForm, content: e.target.value})}
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  placeholder="Share constructive feedback..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="anonymous" 
                  checked={feedbackForm.is_anonymous}
                  onChange={e => setFeedbackForm({...feedbackForm, is_anonymous: e.target.checked})}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary" 
                />
                <label htmlFor="anonymous" className="text-sm font-medium leading-none cursor-pointer">Submit Anonymously</label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
              <button onClick={() => setIsFeedbackModalOpen(false)} className="h-10 px-4 py-2 border rounded-md text-sm font-medium">Cancel</button>
              <button 
                onClick={() => createFeedbackMutation.mutate(feedbackForm as any)}
                disabled={createFeedbackMutation.isPending || !feedbackForm.employee || !feedbackForm.content || !feedbackForm.provider}
                className="h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium disabled:opacity-50 flex items-center"
              >
                {createFeedbackMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
