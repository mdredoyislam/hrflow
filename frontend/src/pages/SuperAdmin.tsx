import { useState } from 'react';
import { Shield, Building2, Users, Search, Activity, SearchX, CheckCircle, XCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOrganizations, updateOrganization, fetchAllUsers } from '@/services/superadmin';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function SuperAdmin() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'companies' | 'users'>('companies');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: companies, isLoading: loadingCompanies } = useQuery({
    queryKey: ['super-admin', 'organizations'],
    queryFn: fetchOrganizations,
  });

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['super-admin', 'users'],
    queryFn: fetchAllUsers,
    enabled: activeTab === 'users',
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) => updateOrganization(id, { is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin', 'organizations'] });
    },
  });

  const filteredCompanies = companies?.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users?.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-red-600 dark:text-red-500">
            <Shield className="w-6 h-6" />
            Super Admin Control Panel
          </h1>
          <p className="text-muted-foreground mt-1">Manage all tenant organizations and system access.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {[
            { id: 'companies', name: 'Companies (Tenants)', icon: Building2 },
            { id: 'users', name: 'All Users', icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'companies' | 'users')}
              className={cn(
                "pb-4 pt-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors",
                activeTab === tab.id
                  ? "border-red-500 text-red-600 dark:text-red-500"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={activeTab === 'companies' ? "Search companies..." : "Search users..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 h-9 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {activeTab === 'companies' && (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-medium">Company Name</th>
                  <th className="px-6 py-3 font-medium">Subdomain</th>
                  <th className="px-6 py-3 font-medium">Created On</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loadingCompanies ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      <Activity className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading companies...
                    </td>
                  </tr>
                ) : filteredCompanies?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      <SearchX className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      No companies found matching "{searchQuery}"
                    </td>
                  </tr>
                ) : (
                  filteredCompanies?.map((company) => (
                    <tr key={company.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{company.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{company.subdomain || 'N/A'}</td>
                      <td className="px-6 py-4 text-muted-foreground">{format(new Date(company.created_at), 'MMM d, yyyy')}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          company.is_active 
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        )}>
                          {company.is_active ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => toggleStatusMutation.mutate({ id: company.id, is_active: !company.is_active })}
                          disabled={toggleStatusMutation.isPending}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                            company.is_active
                              ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/50"
                              : "bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-950/50 dark:hover:bg-green-900/50"
                          )}
                        >
                          {company.is_active ? (
                            <><XCircle className="w-3.5 h-3.5" /> Suspend</>
                          ) : (
                            <><CheckCircle className="w-3.5 h-3.5" /> Activate</>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Company (Organization ID)</th>
                  <th className="px-6 py-3 font-medium">Role / Status</th>
                  <th className="px-6 py-3 font-medium">Joined On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loadingUsers ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                      <Activity className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                      <SearchX className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      No users found matching "{searchQuery}"
                    </td>
                  </tr>
                ) : (
                  filteredUsers?.map((user) => {
                    const org = companies?.find(c => c.id === (typeof user.organization === 'object' ? (user.organization as any).id : user.organization));
                    return (
                      <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs">
                              {user.first_name?.[0]}{user.last_name?.[0]}
                            </div>
                            <div>
                              <p className="font-medium">{user.first_name} {user.last_name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-foreground">{org?.name || 'Super Admin (No Org)'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1 items-start">
                            {user.is_superuser && (
                              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider">
                                Super Admin
                              </span>
                            )}
                            {user.is_hr_admin && !user.is_superuser && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                                HR Admin
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {user.date_joined ? format(new Date(user.date_joined as string), 'MMM d, yyyy') : 'N/A'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
