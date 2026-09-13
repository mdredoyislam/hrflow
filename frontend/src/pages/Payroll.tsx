import { useState } from 'react';
import { Search, Download, Filter, FileText, CheckCircle2, ChevronRight, Calculator, RefreshCw, Loader2, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPayslips, createPayslip, fetchSalaryStructures } from '@/services/payroll';
import { fetchEmployees } from '@/services/people';
import type { Payslip } from '@/services/payroll';

export default function Payroll() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'overview' | 'payslips'>('overview');
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  
  // Tax calculator state
  const [calcSalary, setCalcSalary] = useState('');
  const [calcTaxRate, setCalcTaxRate] = useState('20');
  const [calcDeductions, setCalcDeductions] = useState('');

  const { data: employees } = useQuery({ queryKey: ['employees'], queryFn: fetchEmployees });
  const { data: payslips, isLoading: isLoadingPayslips } = useQuery({ queryKey: ['payslips'], queryFn: () => fetchPayslips() });
  const { data: salaryStructures } = useQuery({ queryKey: ['salaryStructures'], queryFn: () => fetchSalaryStructures() });

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const createPayslipMutation = useMutation({
    mutationFn: createPayslip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payslips'] });
    }
  });

  const handleRunPayroll = async () => {
    if (!employees || !salaryStructures) return;
    
    // Simple mock logic: create a payslip for each employee with a salary structure for current month
    const promises = [];
    for (const emp of employees) {
      const structure = salaryStructures.find(s => s.employee === emp.id);
      if (structure) {
        // Check if already exists
        const exists = payslips?.find(p => p.employee === emp.id && p.month === currentMonth && p.year === currentYear);
        if (!exists) {
          const basic = Number(structure.base_salary);
          promises.push(createPayslipMutation.mutateAsync({
            employee: emp.id,
            month: currentMonth,
            year: currentYear,
            basic_salary: basic,
            total_allowances: 0,
            total_deductions: basic * 0.2, // Mock 20% deduction
            net_pay: basic * 0.8,
            status: 'GENERATED'
          }));
        }
      }
    }
    await Promise.all(promises);
    alert('Payroll processed for current month!');
  };

  const processedCount = payslips?.filter(p => p.month === currentMonth && p.year === currentYear).length || 0;
  const totalEmployees = employees?.length || 0;
  const totalGrossPay = payslips?.reduce((sum, p) => sum + Number(p.basic_salary) + Number(p.total_allowances), 0) || 0;
  const totalNetPay = payslips?.reduce((sum, p) => sum + Number(p.net_pay), 0) || 0;
  const totalDeductions = payslips?.reduce((sum, p) => sum + Number(p.total_deductions), 0) || 0;

  // Formatter
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  // Tax Calculator logic
  const calculatedTax = (Number(calcSalary) * (Number(calcTaxRate) / 100)) + Number(calcDeductions);
  const calculatedNet = Number(calcSalary) - calculatedTax;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payroll Engine</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage salary structures, process payroll, and generate payslips.</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsTaxModalOpen(true)}
            className="h-9 px-4 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Tax Calculator
          </button>
          <button 
            onClick={handleRunPayroll}
            disabled={createPayslipMutation.isPending}
            className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center disabled:opacity-50"
          >
            {createPayslipMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Run Payroll
          </button>
        </div>
      </div>

      <div className="border-b border-border">
        <nav className="flex space-x-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === 'overview' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
            )}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('payslips')}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === 'payslips' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
            )}
          >
            Payslips
          </button>
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm">
            <h3 className="font-semibold">Current Pay Period: Month {currentMonth}, {currentYear}</h3>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
              {processedCount} / {totalEmployees} Processed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">Total Gross Pay (All Time)</p>
              <h3 className="text-3xl font-bold mt-2">{formatCurrency(totalGrossPay)}</h3>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">Total Deductions (All Time)</p>
              <h3 className="text-3xl font-bold mt-2 text-destructive">{formatCurrency(totalDeductions)}</h3>
              <p className="text-xs text-muted-foreground mt-2">Taxes, Benefits, etc.</p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm border-l-4 border-l-primary">
              <p className="text-sm font-medium text-muted-foreground">Total Net Pay (All Time)</p>
              <h3 className="text-3xl font-bold mt-2 text-primary">{formatCurrency(totalNetPay)}</h3>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border shadow-sm p-6 flex items-center justify-center min-h-[300px]">
             <div className="text-center">
               <h3 className="text-lg font-semibold mb-2">Detailed Analytics</h3>
               <p className="text-muted-foreground text-sm">Payroll trends and departmental breakdowns will be visualized here.</p>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'payslips' && (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search employees..." 
                className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
               <button className="h-9 px-3 w-full sm:w-auto rounded-md border border-input bg-background hover:bg-muted text-sm font-medium flex items-center justify-center">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              <button className="h-9 px-3 w-full sm:w-auto rounded-md border border-input bg-background hover:bg-muted text-sm font-medium flex items-center justify-center">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Gross Pay</th>
                  <th className="px-6 py-4">Net Pay</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoadingPayslips ? (
                   <tr><td colSpan={6} className="px-6 py-4 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" /></td></tr>
                ) : payslips?.length === 0 ? (
                   <tr><td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">No payslips generated yet.</td></tr>
                ) : (
                  payslips?.map((ps) => {
                    const emp = employees?.find(e => e.id === ps.employee);
                    const empName = emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown';
                    const role = emp?.designation_name || 'No Title';
                    const gross = Number(ps.basic_salary) + Number(ps.total_allowances);
                    return (
                      <tr key={ps.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-muted-foreground">{ps.month}/{ps.year}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground">{empName}</div>
                          <div className="text-xs text-muted-foreground">{role}</div>
                        </td>
                        <td className="px-6 py-4">{formatCurrency(gross)}</td>
                        <td className="px-6 py-4 font-bold">{formatCurrency(Number(ps.net_pay))}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                            ps.status === 'PAID' ? "bg-green-500/10 text-green-500" :
                            ps.status === 'GENERATED' ? "bg-blue-500/10 text-blue-500" :
                            "bg-yellow-500/10 text-yellow-500"
                          )}>
                            {ps.status === 'PAID' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {ps.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm">
                            <FileText className="w-4 h-4 mr-1" />
                            View
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tax Calculator Modal */}
      {isTaxModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h2 className="text-lg font-semibold flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-primary" />
                Tax & Deductions Simulator
              </h2>
              <button onClick={() => setIsTaxModalOpen(false)} className="text-muted-foreground hover:text-foreground">&times;</button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gross Salary (Annual)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="number"
                      value={calcSalary}
                      onChange={e => setCalcSalary(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm focus:ring-primary"
                      placeholder="e.g. 60000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Estimated Tax Rate (%)</label>
                  <input 
                    type="number"
                    value={calcTaxRate}
                    onChange={e => setCalcTaxRate(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Other Fixed Deductions</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="number"
                      value={calcDeductions}
                      onChange={e => setCalcDeductions(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm focus:ring-primary"
                      placeholder="e.g. 1500 (Insurance, etc.)"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-sm mb-3">Simulation Results</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gross Salary</span>
                    <span className="font-medium">{formatCurrency(Number(calcSalary))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Taxes & Deductions</span>
                    <span className="font-medium text-destructive">-{formatCurrency(calculatedTax)}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-border flex justify-between font-bold text-base">
                    <span>Estimated Net Pay</span>
                    <span className="text-primary">{formatCurrency(calculatedNet)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-border flex justify-end bg-muted/20">
              <button 
                onClick={() => setIsTaxModalOpen(false)}
                className="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
              >
                Close Simulator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
