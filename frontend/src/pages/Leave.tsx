import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, FileText, Plus, Check, X, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLeaveRequests, fetchLeaveTypes, fetchLeaveBalances, createLeaveRequest, updateLeaveRequestStatus } from '@/services/leave';
import { fetchEmployees } from '@/services/people';
import { useAuth } from '@/contexts/AuthContext';
import type { LeaveRequest, LeaveType, LeaveBalance } from '@/services/leave';

export default function Leave() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isManager = user?.is_hr_admin || false;
  const [activeTab, setActiveTab] = useState<'my_leaves' | 'approvals' | 'calendar'>('my_leaves');
  
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<LeaveRequest>>({
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: '',
    employee: ''
  });

  // Queries
  const { data: employees } = useQuery({ queryKey: ['employees'], queryFn: fetchEmployees });
  const { data: leaveTypes } = useQuery({ queryKey: ['leaveTypes'], queryFn: fetchLeaveTypes });
  
  // Find current user's employee record (or fallback to first for demo if admin)
  const currentEmployee = useMemo(() => {
    if (!employees) return null;
    return employees.find(e => e.email === user?.email) || (isManager ? employees[0] : null);
  }, [employees, user, isManager]);

  const { data: balances, isLoading: isLoadingBalances } = useQuery({
    queryKey: ['leaveBalances', currentEmployee?.id],
    queryFn: () => fetchLeaveBalances(currentEmployee?.id),
    enabled: !!currentEmployee?.id
  });

  const { data: requests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['leaveRequests'],
    queryFn: () => fetchLeaveRequests()
  });

  // Derived data
  const myRequests = requests?.filter(r => r.employee === currentEmployee?.id) || [];
  const pendingApprovals = requests?.filter(r => r.status === 'PENDING' && r.employee !== currentEmployee?.id) || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: createLeaveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
      setIsApplyModalOpen(false);
      setFormData({ leave_type: '', start_date: '', end_date: '', reason: '', employee: '' });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => updateLeaveRequestStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
    }
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmployee) {
      alert("No employee record found for your user. Cannot apply for leave.");
      return;
    }
    createMutation.mutate({
      ...formData,
      employee: currentEmployee.id
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leave Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Apply for leave and manage approvals.</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsApplyModalOpen(true)}
            className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Apply Leave
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('my_leaves')}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === 'my_leaves' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
            )}
          >
            My Leaves
          </button>
          {isManager && (
            <button
              onClick={() => setActiveTab('approvals')}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center",
                activeTab === 'approvals' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              )}
            >
              Approvals
              {pendingApprovals.length > 0 && (
                <span className="ml-2 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {pendingApprovals.length}
                </span>
              )}
            </button>
          )}
          <button
            onClick={() => setActiveTab('calendar')}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === 'calendar' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
            )}
          >
            Team Calendar
          </button>
        </nav>
      </div>

      {activeTab === 'my_leaves' && (
        <>
          {/* Leave Balances */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingBalances ? (
              <div className="col-span-3 flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : balances?.length === 0 ? (
              <div className="col-span-3 text-center text-muted-foreground py-8">No leave balances found. Contact HR.</div>
            ) : (
              balances?.map((balance) => {
                const remaining = balance.total_quota - balance.used;
                const typeName = leaveTypes?.find(t => t.id === balance.leave_type)?.name || 'Unknown Leave';
                return (
                  <div key={balance.id} className="bg-card p-5 rounded-xl border border-border shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                    <h3 className="font-semibold text-lg">{typeName}</h3>
                    <div className="mt-4 grid grid-cols-3 text-center divide-x divide-border">
                      <div>
                        <p className="text-2xl font-bold">{remaining}</p>
                        <p className="text-xs text-muted-foreground">Remaining</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{balance.used}</p>
                        <p className="text-xs text-muted-foreground">Used</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{balance.total_quota}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Request History */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden mt-6">
            <div className="p-4 border-b border-border flex items-center">
              <FileText className="w-5 h-5 mr-2 text-muted-foreground" />
              <h3 className="font-semibold">My Requests</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Leave Type</th>
                    <th className="px-6 py-4">Dates</th>
                    <th className="px-6 py-4">Reason</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoadingRequests ? (
                    <tr><td colSpan={4} className="px-6 py-4 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" /></td></tr>
                  ) : myRequests.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-4 text-center text-muted-foreground">No leave requests found.</td></tr>
                  ) : (
                    myRequests.map((req) => {
                      const typeName = leaveTypes?.find(t => t.id === req.leave_type)?.name || 'Unknown Leave';
                      return (
                        <tr key={req.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 font-medium">{typeName}</td>
                          <td className="px-6 py-4">{req.start_date} to {req.end_date}</td>
                          <td className="px-6 py-4 truncate max-w-[200px]">{req.reason}</td>
                          <td className="px-6 py-4 text-right">
                            <span className={cn(
                              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                              req.status === 'APPROVED' ? "bg-green-500/10 text-green-500" :
                              req.status === 'PENDING' ? "bg-yellow-500/10 text-yellow-500" :
                              "bg-red-500/10 text-red-500"
                            )}>
                              {req.status === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
                              {req.status === 'APPROVED' && <Check className="w-3 h-3 mr-1" />}
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg mb-4">Pending Approvals</h3>
          {pendingApprovals.length === 0 ? (
            <p className="text-muted-foreground">No pending approvals.</p>
          ) : (
            pendingApprovals.map((req) => {
              const emp = employees?.find(e => e.id === req.employee);
              const empName = emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown';
              const typeName = leaveTypes?.find(t => t.id === req.leave_type)?.name || 'Unknown Leave';

              return (
                <div key={req.id} className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {empName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{empName}</h4>
                      <p className="text-sm text-primary font-medium mt-1">{typeName}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        <CalendarIcon className="inline w-4 h-4 mr-1" />
                        {req.start_date} to {req.end_date}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2 border-l-2 border-muted pl-2 italic">
                        "{req.reason}"
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => updateStatusMutation.mutate({ id: req.id, status: 'REJECTED' })}
                      className="flex-1 md:flex-none px-4 py-2 rounded-md border border-destructive text-destructive hover:bg-destructive/10 text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                    <button 
                      onClick={() => updateStatusMutation.mutate({ id: req.id, status: 'APPROVED' })}
                      className="flex-1 md:flex-none px-4 py-2 rounded-md bg-green-600/10 text-green-500 hover:bg-green-600/20 text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
          <CalendarIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-semibold">Team Calendar View</h3>
          <p className="text-muted-foreground mt-2 max-w-md">
            The full interactive calendar view for team absences and public holidays will be integrated here using a library like FullCalendar.
          </p>
        </div>
      )}

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h2 className="text-lg font-semibold">Apply for Leave</h2>
              <button onClick={() => setIsApplyModalOpen(false)} className="text-muted-foreground hover:text-foreground">&times;</button>
            </div>
            
            <form onSubmit={handleApply} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Leave Type</label>
                <select 
                  required
                  value={formData.leave_type}
                  onChange={e => setFormData({...formData, leave_type: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                >
                  <option value="">Select leave type</option>
                  {leaveTypes?.map(lt => (
                    <option key={lt.id} value={lt.id}>{lt.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <input 
                    type="date" required
                    value={formData.start_date}
                    onChange={e => setFormData({...formData, start_date: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <input 
                    type="date" required
                    value={formData.end_date}
                    onChange={e => setFormData({...formData, end_date: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Reason</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.reason}
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  placeholder="Why are you taking leave?"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-2 border-t border-border mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsApplyModalOpen(false)}
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
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
