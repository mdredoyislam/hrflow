import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchKPIs, createKPI, updateKPI, deleteKPI } from '@/services/performance';
import type { KPI } from '@/services/performance';
import { Plus, Loader2, Edit, Trash2 } from 'lucide-react';

export default function KPIPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    target_value: '',
  });

  const { data: kpis, isLoading } = useQuery({
    queryKey: ['kpis'],
    queryFn: fetchKPIs,
  });

  const createMutation = useMutation({
    mutationFn: createKPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; payload: Partial<KPI> }) => updateKPI(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteKPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
    }
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', target_value: '' });
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (kpi: KPI) => {
    setFormData({
      name: kpi.name,
      description: kpi.description || '',
      target_value: kpi.target_value || '',
    });
    setEditingId(kpi.id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, payload: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Key Performance Indicators</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage organizational KPIs and metrics.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add KPI
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : kpis?.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No KPIs found. Create your first KPI to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium">Target Value</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {kpis?.map((kpi) => (
                  <tr key={kpi.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{kpi.name}</td>
                    <td className="px-6 py-4 text-muted-foreground max-w-md truncate">{kpi.description}</td>
                    <td className="px-6 py-4">{kpi.target_value}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEdit(kpi)}
                          className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-muted"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this KPI?')) {
                              deleteMutation.mutate(kpi.id);
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-semibold">{editingId ? 'Edit KPI' : 'Create KPI'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">KPI Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Value</label>
                <input 
                  type="text" 
                  required
                  value={formData.target_value}
                  onChange={e => setFormData({...formData, target_value: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. $10,000 or 95%"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-4 py-2 border border-input bg-background hover:bg-muted rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors flex items-center"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editingId ? 'Save Changes' : 'Create KPI'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
