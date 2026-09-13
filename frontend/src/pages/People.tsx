import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchEmployees, createEmployee, deleteEmployee, fetchDesignations, createDesignation, deleteDesignation } from '@/services/people';
import type { Employee, Designation } from '@/services/people';
import { Plus, Loader2, Trash2, Search, Filter, Mail, Phone, Users as UsersIcon, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function People() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDesignationsModalOpen, setIsDesignationsModalOpen] = useState(false);
  const [newDesignationName, setNewDesignationName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState<Partial<Employee>>({
    first_name: '',
    last_name: '',
    email: '',
    employee_id: '',
    joining_date: '',
    employment_type: 'FT',
    status: 'A',
    create_user_account: true,
  });

  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  });

  const { data: designations, isLoading: isLoadingDesignations } = useQuery({
    queryKey: ['designations'],
    queryFn: fetchDesignations,
  });

  const createDesignationMutation = useMutation({
    mutationFn: createDesignation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designations'] });
      setNewDesignationName('');
    }
  });

  const deleteDesignationMutation = useMutation({
    mutationFn: deleteDesignation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designations'] });
    }
  });

  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Failed to add employee:', error);
      const data = error?.response?.data;
      let errorMsg = "Failed to create employee. Please try again.";
      if (data) {
        if (Array.isArray(data)) {
          errorMsg = data.join(', ');
        } else if (typeof data === 'object') {
          errorMsg = Object.entries(data)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
            .join('\n');
        } else {
          errorMsg = String(data);
        }
      }
      alert(errorMsg);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      employee_id: '',
      joining_date: '',
      employment_type: 'FT',
      status: 'A',
      create_user_account: true,
      manager: '',
      designation: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    if (!payload.manager) delete payload.manager;
    if (!payload.designation) delete payload.designation;
    createMutation.mutate(payload);
  };

  const filteredEmployees = employees?.filter(emp => 
    `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">People Directory</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your company's employees and system users.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsDesignationsModalOpen(true)}
            className="h-9 px-4 rounded-md border border-input bg-background text-sm font-medium hover:bg-muted transition-colors flex items-center"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Designations
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search employees by name, email, or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button className="h-10 px-4 rounded-md border border-input bg-background hover:bg-muted text-sm font-medium flex items-center transition-colors">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredEmployees?.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <UsersIcon className="w-12 h-12 mb-4 text-muted-foreground/50" />
            <p>No employees found in your organization.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Employee</th>
                  <th className="px-6 py-4 font-medium">ID</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEmployees?.map((emp) => (
                  <tr key={emp.id} className="hover:bg-muted/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold uppercase">
                          {emp.first_name[0]}{emp.last_name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{emp.first_name} {emp.last_name}</p>
                          <p className="text-xs text-muted-foreground">{emp.employment_type === 'FT' ? 'Full Time' : emp.employment_type === 'PT' ? 'Part Time' : 'Contract'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-muted-foreground">{emp.employee_id}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Mail className="w-3 h-3 mr-1.5" />
                          {emp.email}
                        </div>
                        {emp.phone && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Phone className="w-3 h-3 mr-1.5" />
                            {emp.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                        emp.status === 'A' ? "bg-green-100 text-green-700 border-green-200" :
                        "bg-muted text-muted-foreground border-border"
                      )}>
                        {emp.status === 'A' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            if (window.confirm('Delete this employee?')) {
                              deleteMutation.mutate(emp.id);
                            }
                          }}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-muted"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h2 className="text-lg font-semibold">Add New Employee</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <input 
                    type="text" required
                    value={formData.first_name}
                    onChange={e => setFormData({...formData, first_name: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <input 
                    type="text" required
                    value={formData.last_name}
                    onChange={e => setFormData({...formData, last_name: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <input 
                    type="email" required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employee ID</label>
                  <input 
                    type="text" 
                    disabled
                    placeholder="Auto-generated"
                    className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm opacity-50 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Designation</label>
                  <select 
                    value={formData.designation || ''}
                    onChange={e => setFormData({...formData, designation: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                  >
                    <option value="">Select Designation</option>
                    {designations?.map(des => (
                      <option key={des.id} value={des.id}>{des.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Joining Date</label>
                  <input 
                    type="date" required
                    value={formData.joining_date}
                    onChange={e => setFormData({...formData, joining_date: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Direct Manager</label>
                  <select 
                    value={formData.manager || ''}
                    onChange={e => setFormData({...formData, manager: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                  >
                    <option value="">No Manager</option>
                    {/* Because of SaaS tenancy, this ONLY lists employees in their company! */}
                    {employees?.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name} ({emp.employee_id})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="flex h-5 items-center">
                    <input 
                      type="checkbox" 
                      checked={formData.create_user_account}
                      onChange={e => setFormData({...formData, create_user_account: e.target.checked})}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                  <div>
                    <span className="text-sm font-semibold block mb-1">Create System Login Account</span>
                    <span className="text-xs text-muted-foreground block">
                      This will create a user account allowing this employee to log into the HR platform. They will use their email and the default password <code>HrFlow123!</code> to log in.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-border">
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
                  {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Create Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Designations Modal */}
      {isDesignationsModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h2 className="text-lg font-semibold">Manage Designations</h2>
              <button onClick={() => setIsDesignationsModalOpen(false)} className="text-muted-foreground hover:text-foreground">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  placeholder="New Designation Name"
                  value={newDesignationName}
                  onChange={e => setNewDesignationName(e.target.value)}
                  className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                />
                <button 
                  onClick={() => {
                    if (newDesignationName.trim()) {
                      createDesignationMutation.mutate({ name: newDesignationName });
                    }
                  }}
                  disabled={createDesignationMutation.isPending || !newDesignationName.trim()}
                  className="h-10 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
                >
                  {createDesignationMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
                </button>
              </div>

              <div className="space-y-2">
                {isLoadingDesignations ? (
                  <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                ) : designations?.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No designations found.</p>
                ) : (
                  designations?.map(des => (
                    <div key={des.id} className="flex justify-between items-center p-3 rounded-lg border border-border bg-muted/20">
                      <span className="text-sm font-medium">{des.name}</span>
                      <button 
                        onClick={() => {
                          if (window.confirm('Delete this designation?')) {
                            deleteDesignationMutation.mutate(des.id);
                          }
                        }}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-muted rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-border flex justify-end bg-muted/10">
              <button 
                onClick={() => setIsDesignationsModalOpen(false)}
                className="h-9 px-4 rounded-md border border-input bg-background hover:bg-muted text-sm font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
