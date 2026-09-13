import { useState } from 'react';
import { Package, Search, Filter, Plus, Laptop, Monitor, Smartphone, Server, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAssets, createAsset } from '@/services/inventory';

export default function Inventory() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'all' | 'assigned' | 'available' | 'maintenance'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [assetForm, setAssetForm] = useState({ name: '', category: 'Laptop', serial_number: '', purchase_cost: '', status: 'AVAILABLE' });

  const { data: assets, isLoading } = useQuery({ queryKey: ['assets'], queryFn: fetchAssets });

  const createAssetMutation = useMutation({
    mutationFn: createAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      setIsAddModalOpen(false);
      setAssetForm({ name: '', category: 'Laptop', serial_number: '', purchase_cost: '', status: 'AVAILABLE' });
    }
  });

  const getIcon = (category: string) => {
    switch (category) {
      case 'Laptop': return <Laptop className="w-4 h-4 text-primary" />;
      case 'Monitor': return <Monitor className="w-4 h-4 text-primary" />;
      case 'Mobile': return <Smartphone className="w-4 h-4 text-primary" />;
      default: return <Server className="w-4 h-4 text-primary" />;
    }
  };

  const filteredAssets = assets?.filter(a => {
    if (activeTab === 'all') return true;
    return a.status.toLowerCase() === activeTab;
  }) || [];

  const summary = {
    total: assets?.length || 0,
    assigned: assets?.filter(a => a.status === 'ASSIGNED').length || 0,
    available: assets?.filter(a => a.status === 'AVAILABLE').length || 0,
    maintenance: assets?.filter(a => a.status === 'MAINTENANCE').length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">IT & Asset Inventory</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage company assets, assignments, and hardware lifecycle.</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Asset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-lg"><Package className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Assets</p>
              <h3 className="text-2xl font-bold">{summary.total}</h3>
            </div>
         </div>
         <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-lg"><Laptop className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Assigned</p>
              <h3 className="text-2xl font-bold">{summary.assigned}</h3>
            </div>
         </div>
         <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-700 rounded-lg"><Server className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Available</p>
              <h3 className="text-2xl font-bold">{summary.available}</h3>
            </div>
         </div>
         <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-700 rounded-lg"><Monitor className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Maintenance</p>
              <h3 className="text-2xl font-bold">{summary.maintenance}</h3>
            </div>
         </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <nav className="flex space-x-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0" aria-label="Tabs">
            {['All', 'Assigned', 'Available', 'Maintenance'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase() as any)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  activeTab === tab.toLowerCase() ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                )}
              >
                {tab}
              </button>
            ))}
          </nav>
          
          <div className="flex gap-2 w-full sm:w-auto">
             <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search assets..." 
                className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button className="h-9 px-3 rounded-md border border-input bg-background hover:bg-muted text-sm font-medium flex items-center shrink-0">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Asset Name</th>
                <th className="px-6 py-4">Serial Number</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" /></td></tr>
              ) : filteredAssets.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">No assets found.</td></tr>
              ) : filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                        {getIcon(asset.category)}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{asset.name}</div>
                        <div className="text-xs text-muted-foreground">{asset.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{asset.serial_number}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                      asset.status === 'ASSIGNED' ? "bg-blue-100 text-blue-700 border-blue-200" :
                      asset.status === 'AVAILABLE' ? "bg-green-100 text-green-700 border-green-200" :
                      "bg-red-100 text-red-700 border-red-200"
                    )}>
                      {asset.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{asset.purchase_cost ? `$${asset.purchase_cost}` : '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline text-sm font-medium">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h2 className="text-lg font-semibold">Add New Asset</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-muted-foreground hover:text-foreground">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Asset Name</label>
                <input 
                  type="text"
                  value={assetForm.name} onChange={e => setAssetForm({...assetForm, name: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  placeholder="e.g. MacBook Pro 16"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select 
                    value={assetForm.category} onChange={e => setAssetForm({...assetForm, category: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select 
                    value={assetForm.status} onChange={e => setAssetForm({...assetForm, status: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="MAINTENANCE">In Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Serial Number</label>
                <input 
                  type="text"
                  value={assetForm.serial_number} onChange={e => setAssetForm({...assetForm, serial_number: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  placeholder="Unique Serial ID"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Purchase Cost (Optional)</label>
                <input 
                  type="number"
                  value={assetForm.purchase_cost} onChange={e => setAssetForm({...assetForm, purchase_cost: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
              <button onClick={() => setIsAddModalOpen(false)} className="h-10 px-4 py-2 border rounded-md text-sm font-medium">Cancel</button>
              <button 
                onClick={() => createAssetMutation.mutate(assetForm as any)}
                disabled={createAssetMutation.isPending || !assetForm.name || !assetForm.serial_number}
                className="h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium disabled:opacity-50 flex items-center"
              >
                {createAssetMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Add Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
