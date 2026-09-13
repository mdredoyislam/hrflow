import { useState } from 'react';
import { Building2, ShieldCheck, Database, BellRing, User, Key, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    { id: 'company', name: 'Company Profile', icon: <Building2 className="w-4 h-4 mr-2" /> },
    { id: 'security', name: 'Security & Roles', icon: <ShieldCheck className="w-4 h-4 mr-2" /> },
    { id: 'audit', name: 'Audit Logs', icon: <Database className="w-4 h-4 mr-2" /> },
    { id: 'notifications', name: 'Notifications', icon: <BellRing className="w-4 h-4 mr-2" /> },
  ];

  const auditLogs = [
    { id: 1, action: 'CREATE', user: 'admin@hrflow.com', target: 'Employee (ID: 1042)', time: 'Oct 26, 2023 14:32:00', ip: '192.168.1.42' },
    { id: 2, action: 'UPDATE', user: 'hr_manager@hrflow.com', target: 'SalaryStructure (ID: 55)', time: 'Oct 26, 2023 11:15:22', ip: '192.168.1.10' },
    { id: 3, action: 'LOGIN', user: 'admin@hrflow.com', target: '-', time: 'Oct 26, 2023 09:00:01', ip: '192.168.1.42' },
    { id: 4, action: 'DELETE', user: 'admin@hrflow.com', target: 'JobPosting (ID: 12)', time: 'Oct 25, 2023 16:45:00', ip: '192.168.1.42' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organization Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage company details, security policies, and view audit logs.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </aside>

        <main className="flex-1 space-y-6">
          {activeTab === 'company' && (
            <div className="bg-card rounded-xl border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold">Company Profile</h2>
                <p className="text-sm text-muted-foreground mt-1">Update your organization's core information.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Organization Name</label>
                    <input type="text" defaultValue="Acme Corp" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Registration Number</label>
                    <input type="text" defaultValue="REG-993812" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Headquarters Address</label>
                    <input type="text" defaultValue="123 Business Avenue, Tech District, SF, CA" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Primary Domain</label>
                    <input type="text" defaultValue="acmecorp.com" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Timezone</label>
                    <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option>Pacific Time (PT)</option>
                      <option>Eastern Time (ET)</option>
                      <option>Coordinated Universal Time (UTC)</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button className="h-10 px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">Audit Logs</h2>
                  <p className="text-sm text-muted-foreground mt-1">Immutable record of critical system actions for compliance.</p>
                </div>
                <button className="h-9 px-4 rounded-md border border-input bg-background hover:bg-muted text-sm font-medium transition-colors">
                  Export Logs
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground font-medium">
                    <tr>
                      <th className="px-6 py-3">Timestamp</th>
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3">Action</th>
                      <th className="px-6 py-3">Target Resource</th>
                      <th className="px-6 py-3">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-mono text-xs">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 text-muted-foreground">{log.time}</td>
                        <td className="px-6 py-4 font-medium text-foreground">{log.user}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded font-bold tracking-wider",
                            log.action === 'CREATE' ? "text-green-600 bg-green-100" :
                            log.action === 'UPDATE' ? "text-blue-600 bg-blue-100" :
                            log.action === 'DELETE' ? "text-red-600 bg-red-100" :
                            "text-gray-600 bg-gray-100"
                          )}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{log.target}</td>
                        <td className="px-6 py-4 text-muted-foreground">{log.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
             <div className="bg-card rounded-xl border border-border shadow-sm p-12 text-center flex flex-col items-center">
               <Key className="w-16 h-16 text-muted-foreground/30 mb-4" />
               <h3 className="text-xl font-semibold">Security & Roles</h3>
               <p className="text-muted-foreground mt-2 max-w-md">Configure Password Policies, 2FA enforcement, and granular Role-Based Access Control (RBAC) permissions here.</p>
             </div>
          )}
        </main>
      </div>
    </div>
  )
}
