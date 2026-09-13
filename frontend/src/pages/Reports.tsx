import { useState } from 'react';
import { Download, FileText, Filter, Calendar, Users, TrendingUp, HandCoins, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function Reports() {
  const [activeReportType, setActiveReportType] = useState('attendance');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { id: 'attendance', name: 'Attendance & Leave', icon: <Calendar className="w-4 h-4 mr-2" /> },
    { id: 'payroll', name: 'Payroll & Expenses', icon: <HandCoins className="w-4 h-4 mr-2" /> },
    { id: 'performance', name: 'Performance & KPI', icon: <TrendingUp className="w-4 h-4 mr-2" /> },
    { id: 'headcount', name: 'Headcount & Diversity', icon: <Users className="w-4 h-4 mr-2" /> },
  ];

  const generatedReports = [
    { id: 'REP-101', name: 'Q3 2023 Performance Summary', type: 'Performance', date: 'Oct 01, 2023', size: '1.2 MB' },
    { id: 'REP-102', name: 'September 2023 Payroll Export', type: 'Payroll', date: 'Sep 30, 2023', size: '3.4 MB' },
    { id: 'REP-103', name: 'Annual Leave Balances 2023', type: 'Attendance', date: 'Sep 15, 2023', size: '800 KB' },
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const response = await api.get(`/reports/generate/?type=${activeReportType}`);
      const downloadUrl = response.data.download_url;
      // In a real app we'd download the file. Here we just show an alert with the URL since it's a mock endpoint.
      alert(`${response.data.message}\nDownload URL: ${downloadUrl}`);
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Generate, view, and export organization-wide reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground mb-3 px-2">Report Categories</h3>
          {reportTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setActiveReportType(type.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeReportType === type.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-transparent text-foreground hover:bg-muted'
              }`}
            >
              {type.icon}
              {type.name}
            </button>
          ))}
        </div>
        
        <div className="md:col-span-3 space-y-6">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 text-primary rounded-lg">
                {reportTypes.find(r => r.id === activeReportType)?.icon}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{reportTypes.find(r => r.id === activeReportType)?.name} Report Generator</h2>
                <p className="text-sm text-muted-foreground">Select parameters to generate a custom report.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                  <option>Last 30 Days</option>
                  <option>This Quarter</option>
                  <option>This Year</option>
                  <option>Custom Range</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                  <option>All Departments</option>
                  <option>Engineering</option>
                  <option>Marketing</option>
                  <option>Human Resources</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Format</label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                  <option>PDF Document</option>
                  <option>CSV Spreadsheet</option>
                  <option>Excel Worksheet</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button className="h-10 px-4 rounded-md border border-input bg-background hover:bg-muted text-sm font-medium transition-colors">
                Preview Data
              </button>
              <button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="h-10 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors flex items-center disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                Generate & Download
              </button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold text-lg">Recently Generated</h3>
              <button className="text-sm font-medium text-primary hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium">
                  <tr>
                    <th className="px-6 py-3">Report Name</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Size</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {generatedReports.map((report) => (
                    <tr key={report.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          {report.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">{report.type}</td>
                      <td className="px-6 py-4 text-muted-foreground">{report.date}</td>
                      <td className="px-6 py-4 text-muted-foreground">{report.size}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary hover:underline font-medium">Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
