import { useState } from 'react';
import { Search, Plus, Filter, CheckCircle2, Circle, Clock, Building2, Monitor, FileKey, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchEmployees } from '@/services/people';
import { fetchOnboardingTasks, createOnboardingTask, updateOnboardingTask } from '@/services/onboarding';
import type { OnboardingTask } from '@/services/onboarding';

export default function Onboarding() {
  const queryClient = useQueryClient();
  const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<OnboardingTask>>({
    employee: '',
    task_name: '',
    description: '',
    due_date: '',
    assigned_to: ''
  });

  const { data: employees, isLoading: isLoadingEmployees } = useQuery({ 
    queryKey: ['employees'], 
    queryFn: fetchEmployees,
    // Auto-select first employee when loaded if none selected
  });

  // Effect to select first employee
  if (employees && employees.length > 0 && !activeEmployeeId) {
    setActiveEmployeeId(employees[0].id);
  }

  const { data: tasks, isLoading: isLoadingTasks } = useQuery({ 
    queryKey: ['onboardingTasks'], 
    queryFn: fetchOnboardingTasks 
  });

  const createMutation = useMutation({
    mutationFn: createOnboardingTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboardingTasks'] });
      setIsModalOpen(false);
      setFormData({ employee: activeEmployeeId || '', task_name: '', description: '', due_date: '', assigned_to: '' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<OnboardingTask> }) => updateOnboardingTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboardingTasks'] });
    }
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const toggleTaskStatus = (task: OnboardingTask) => {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    updateMutation.mutate({ id: task.id, data: { status: newStatus } });
  };

  const activeEmployee = employees?.find(e => e.id === activeEmployeeId);
  const activeTasks = tasks?.filter(t => t.employee === activeEmployeeId) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Onboarding</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage new hire checklists and welcome workflows.</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => {
              setFormData({ ...formData, employee: activeEmployeeId || '' });
              setIsModalOpen(true);
            }}
            className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Assign Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: Employees List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search employees..." 
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {isLoadingEmployees ? (
              <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
            ) : employees?.map(emp => {
              const empTasks = tasks?.filter(t => t.employee === emp.id) || [];
              const completed = empTasks.filter(t => t.status === 'COMPLETED').length;
              const progress = empTasks.length > 0 ? Math.round((completed / empTasks.length) * 100) : 0;
              
              return (
                <button 
                  key={emp.id}
                  onClick={() => setActiveEmployeeId(emp.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all",
                    activeEmployeeId === emp.id 
                      ? "bg-primary/5 border-primary shadow-sm" 
                      : "bg-card border-border hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                      {emp.first_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{emp.first_name} {emp.last_name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{emp.designation_name || 'No Title'}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{empTasks.length} Task(s)</span>
                      <span className="font-medium text-primary">{progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Area: Checklist */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden min-h-[500px] flex flex-col">
            {activeEmployee ? (
              <>
                <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/20 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">Onboarding Checklist</h3>
                    <p className="text-sm text-muted-foreground">{activeEmployee.first_name} {activeEmployee.last_name} • {activeEmployee.designation_name}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="h-8 px-3 rounded-md border border-input bg-background hover:bg-muted text-xs font-medium flex items-center">
                      <Filter className="w-3 h-3 mr-1.5" />
                      Filter
                    </button>
                  </div>
                </div>

                <div className="p-6 flex-1 bg-gradient-to-b from-background to-muted/10">
                  {isLoadingTasks ? (
                    <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                  ) : activeTasks.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-full text-muted-foreground space-y-4">
                      <Monitor className="w-12 h-12 text-muted-foreground/30" />
                      <p>No onboarding tasks assigned.</p>
                      <button 
                        onClick={() => {
                          setFormData({ ...formData, employee: activeEmployeeId || '' });
                          setIsModalOpen(true);
                        }}
                        className="text-sm text-primary hover:underline font-medium"
                      >
                        Assign first task
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeTasks.map(task => {
                        const assignee = employees?.find(e => e.id === task.assigned_to);
                        const assigneeName = assignee ? `${assignee.first_name} ${assignee.last_name}` : 'Unassigned';
                        
                        return (
                          <div key={task.id} className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                            <button 
                              onClick={() => toggleTaskStatus(task)}
                              disabled={updateMutation.isPending}
                              className="shrink-0 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                            >
                              {task.status === 'COMPLETED' ? (
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                              ) : (
                                <Circle className="w-6 h-6 group-hover:text-primary/50" />
                              )}
                            </button>
                            
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                "text-sm font-medium transition-colors",
                                task.status === 'COMPLETED' ? "text-muted-foreground line-through" : "text-foreground group-hover:text-primary"
                              )}>
                                {task.task_name}
                              </p>
                              {task.description && (
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{task.description}</p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center">
                                  <Building2 className="w-3 h-3 mr-1.5 text-primary/70" />
                                  Assignee: {assigneeName}
                                </span>
                                {task.due_date && (
                                  <span className={cn(
                                    "flex items-center",
                                    task.status !== 'COMPLETED' && new Date(task.due_date) < new Date() ? "text-red-500 font-medium" : ""
                                  )}>
                                    <Clock className="w-3 h-3 mr-1.5" />
                                    Due {task.due_date}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {task.status !== 'COMPLETED' && (
                              <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 bg-yellow-500/10 text-yellow-600 rounded-full border border-yellow-500/20">
                                {task.status}
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground p-6 text-center">
                Select an employee from the sidebar to view their onboarding tasks.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assign Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h2 className="text-lg font-semibold">Assign Onboarding Task</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">&times;</button>
            </div>
            
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Employee</label>
                <select 
                  required
                  value={formData.employee}
                  onChange={e => setFormData({...formData, employee: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                >
                  <option value="">Select employee</option>
                  {employees?.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Task Name</label>
                <input 
                  type="text" required
                  placeholder="e.g. Provision Laptop"
                  value={formData.task_name}
                  onChange={e => setFormData({...formData, task_name: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  placeholder="Additional details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Date</label>
                  <input 
                    type="date"
                    value={formData.due_date}
                    onChange={e => setFormData({...formData, due_date: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assign To</label>
                  <select 
                    value={formData.assigned_to}
                    onChange={e => setFormData({...formData, assigned_to: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  >
                    <option value="">Unassigned</option>
                    {employees?.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.first_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-2 border-t border-border mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-4 py-2 border border-input bg-background hover:bg-muted rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={createMutation.isPending}
                  className="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors flex items-center"
                >
                  {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
