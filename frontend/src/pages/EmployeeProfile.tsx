import { useState } from 'react';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Briefcase, Calendar, FileText, Clock, TrendingUp, HandCoins } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function EmployeeProfile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = [
    { name: 'Overview', icon: FileText },
    { name: 'Personal', icon: Mail },
    { name: 'Employment', icon: Briefcase },
    { name: 'Attendance', icon: Clock },
    { name: 'Leave', icon: Calendar },
    { name: 'Payroll', icon: HandCoins },
    { name: 'Performance', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Back & Actions */}
      <div className="flex items-center justify-between">
        <Link to="/people" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Directory
        </Link>
        <div className="flex space-x-2">
          <button className="h-9 px-4 rounded-md border border-input bg-background hover:bg-muted text-sm font-medium flex items-center transition-colors">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Header Profile Card */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl shrink-0">
          JS
        </div>
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">John Smith</h1>
              <p className="text-primary font-medium mt-1">Software Engineer • Engineering</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Active Employee
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="w-4 h-4 mr-2" />
              john.smith@acme.com
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="w-4 h-4 mr-2" />
              +1 (555) 123-4567
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              New York, NY
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Joined Jan 2023
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-6 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={cn(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm inline-flex items-center transition-colors",
                activeTab === tab.name
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              )}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-4">
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">About</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  John is a senior software engineer with over 8 years of experience building scalable web applications. He specializes in React, Node.js, and Cloud Infrastructure. He has been instrumental in delivering our core SaaS product over the past year.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Skills & Competencies</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'].map(skill => (
                    <span key={skill} className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Reporting Line</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                      JD
                    </div>
                    <div>
                      <p className="text-sm font-medium">Jane Doe</p>
                      <p className="text-xs text-muted-foreground">VP of Engineering (Manager)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab !== 'Overview' && (
          <div className="bg-card p-12 rounded-xl border border-border shadow-sm flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-semibold">{activeTab} details</h3>
            <p className="text-muted-foreground text-sm mt-1">This module will be populated in subsequent development phases.</p>
          </div>
        )}
      </div>
    </div>
  );
}
