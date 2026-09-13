import { useState, useRef } from 'react';
import { Search, Folder, FileText, Upload, MoreVertical, Shield, FileCheck, Users, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDocuments, createDocument } from '@/services/inventory';

export default function Documents() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [docForm, setDocForm] = useState<{title: string, category: string, file: File | null, is_public: boolean}>({
    title: '', category: 'Company Policies', file: null, is_public: true
  });

  const { data: documents, isLoading } = useQuery({ queryKey: ['documents'], queryFn: fetchDocuments });

  const uploadMutation = useMutation({
    mutationFn: createDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setIsUploadModalOpen(false);
      setDocForm({ title: '', category: 'Company Policies', file: null, is_public: true });
    }
  });

  const handleUploadSubmit = () => {
    if (!docForm.title || !docForm.file) return;
    const formData = new FormData();
    formData.append('title', docForm.title);
    formData.append('is_public', docForm.is_public.toString());
    formData.append('file', docForm.file);
    // Note: Assuming backend handles category string or needs category ID, we'll just send title for now
    uploadMutation.mutate(formData);
  };

  const categories = [
    { id: '1', name: 'Company Policies', icon: <Shield className="w-5 h-5 text-blue-500" />, count: documents?.filter(d => d.title.includes('Policy')).length || 0 },
    { id: '2', name: 'Templates', icon: <FileCheck className="w-5 h-5 text-green-500" />, count: documents?.filter(d => d.title.includes('Template')).length || 0 },
    { id: '3', name: 'Employee Handbook', icon: <Users className="w-5 h-5 text-purple-500" />, count: documents?.filter(d => d.title.includes('Handbook')).length || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground text-sm mt-1">Centralized hub for company policies, handbooks, and templates.</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-card p-4 rounded-xl border border-border shadow-sm hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                {cat.icon}
              </div>
              <div>
                <h3 className="font-semibold">{cat.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{cat.count} files</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center">
           <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search documents by name or category..." 
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date Added</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" /></td></tr>
              ) : documents?.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-muted-foreground">No documents found.</td></tr>
              ) : documents?.map((doc) => (
                <tr key={doc.id} className="hover:bg-muted/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <a href={doc.file} target="_blank" rel="noreferrer" className="font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer">
                        {doc.title}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                      {doc.is_public ? 'Public' : 'Private'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h2 className="text-lg font-semibold">Upload Document</h2>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-muted-foreground hover:text-foreground">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Document Title</label>
                <input 
                  type="text"
                  value={docForm.title} onChange={e => setDocForm({...docForm, title: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                  placeholder="e.g. Employee Handbook 2024"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">File</label>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={e => setDocForm({...docForm, file: e.target.files?.[0] || null})}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-primary"
                />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input 
                  type="checkbox" 
                  id="is_public"
                  checked={docForm.is_public}
                  onChange={e => setDocForm({...docForm, is_public: e.target.checked})}
                  className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                />
                <label htmlFor="is_public" className="text-sm font-medium">
                  Make available to all employees
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
              <button onClick={() => setIsUploadModalOpen(false)} className="h-10 px-4 py-2 border rounded-md text-sm font-medium">Cancel</button>
              <button 
                onClick={handleUploadSubmit}
                disabled={uploadMutation.isPending || !docForm.title || !docForm.file}
                className="h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium disabled:opacity-50 flex items-center"
              >
                {uploadMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
