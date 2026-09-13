import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, PieChart, Pie } from 'recharts';
import { Users, Building2, Calendar, Target, Plus, Search, Activity, UserPlus, Clock, CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardMetrics } from '@/services/dashboard';
import { useAuth } from '@/contexts/AuthContext';

const growthData = [
  { name: 'Jan', employees: 120 },
  { name: 'Feb', employees: 132 },
  { name: 'Mar', employees: 141 },
  { name: 'Apr', employees: 155 },
  { name: 'May', employees: 168 },
  { name: 'Jun', employees: 184 },
];

const attendanceData = [
  { name: 'Mon', present: 160, absent: 24 },
  { name: 'Tue', present: 175, absent: 9 },
  { name: 'Wed', present: 180, absent: 4 },
  { name: 'Thu', present: 178, absent: 6 },
  { name: 'Fri', present: 155, absent: 29 },
];

const leaveData = [
  { name: 'Annual', value: 45 },
  { name: 'Sick', value: 25 },
  { name: 'Casual', value: 20 },
  { name: 'Unpaid', value: 10 },
];
const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--destructive))', 'hsl(var(--muted-foreground))'];

function EmployeeDashboard() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground text-sm mt-1">Here is a summary of your personal dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:border-primary/50 cursor-pointer transition-colors" onClick={() => navigate('/leave')}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Available Leave</p>
              <h3 className="text-3xl font-bold mt-1">12 Days</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="text-sm text-primary flex items-center font-medium">
            <span>Apply for leave &rarr;</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:border-primary/50 cursor-pointer transition-colors" onClick={() => navigate('/attendance')}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Today's Hours</p>
              <h3 className="text-3xl font-bold mt-1">7h 45m</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="text-sm text-green-600 flex items-center font-medium">
            <span>Currently clocked in</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:border-primary/50 cursor-pointer transition-colors" onClick={() => navigate('/performance')}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
              <h3 className="text-3xl font-bold mt-1">3</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div className="text-sm text-amber-600 flex items-center font-medium">
            <span>View your performance &rarr;</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Upcoming Tasks</h3>
          <div className="space-y-4">
            {[
              { text: "Complete Security Training", due: "Tomorrow" },
              { text: "Submit Weekly Report", due: "Friday" },
              { text: "Self Evaluation for Q3", due: "Next Week" }
            ].map((task, i) => (
              <div key={i} className="flex items-center gap-4">
                <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{task.text}</p>
                </div>
                <span className="text-xs text-muted-foreground">{task.due}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Recent Announcements</h3>
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <h4 className="text-sm font-semibold">Q3 Townhall Meeting</h4>
              <p className="text-xs text-muted-foreground mt-1">Join us this Friday at 3PM for the Q3 results and updates from the executive team.</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <h4 className="text-sm font-semibold">New Health Benefits</h4>
              <p className="text-xs text-muted-foreground mt-1">Check out the updated health benefits portal for new wellness programs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState("7d");
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['dashboardMetrics', timeframe],
    queryFn: fetchDashboardMetrics,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organization Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Here's what's happening in your organization today.</p>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="1y">This Year</option>
          </select>
          <button 
            onClick={() => navigate('/reports')}
            className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Download Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between hover:border-primary/50 cursor-pointer transition-colors" onClick={() => navigate('/people')}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
              <h3 className="text-3xl font-bold mt-1">{isLoading ? '...' : (metrics?.totalEmployees || 0)}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="text-sm text-green-600 flex items-center font-medium">
            <Activity className="w-4 h-4 mr-1" />
            <span>+2.5% from last month</span>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between hover:border-primary/50 cursor-pointer transition-colors" onClick={() => navigate('/attendance')}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
              <h3 className="text-3xl font-bold mt-1">{isLoading ? '...' : `${metrics?.attendanceRate || 0}%`}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="text-sm text-green-600 flex items-center font-medium">
            <Activity className="w-4 h-4 mr-1" />
            <span>+0.8% from last week</span>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between hover:border-primary/50 cursor-pointer transition-colors" onClick={() => navigate('/recruitment')}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Open Jobs</p>
              <h3 className="text-3xl font-bold mt-1">{isLoading ? '...' : (metrics?.openJobs || 0)}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground flex items-center font-medium">
            <Activity className="w-4 h-4 mr-1" />
            <span>3 urgent positions</span>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between hover:border-primary/50 cursor-pointer transition-colors" onClick={() => navigate('/leave')}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Leave Requests</p>
              <h3 className="text-3xl font-bold mt-1">{isLoading ? '...' : (metrics?.leaveRequests || 0)}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div className="text-sm text-amber-600 flex items-center font-medium">
            <Activity className="w-4 h-4 mr-1" />
            <span>Requires approval</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Employee Growth</h3>
            <p className="text-sm text-muted-foreground">Total headcounts over the past 6 months.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEmployees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="employees" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorEmployees)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Overview */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate('/leave')}>
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Leave Statistics</h3>
            <p className="text-sm text-muted-foreground">Current month breakdown.</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leaveData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Bar Chart */}
        <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border shadow-sm cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate('/attendance')}>
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Attendance Overview</h3>
            <p className="text-sm text-muted-foreground">Weekly attendance trends.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar dataKey="present" name="Present" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="absent" name="Absent" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Recent Activities</h3>
          </div>
          <div className="space-y-6">
            {[
              { text: "Sarah Connor requested annual leave.", time: "10 mins ago" },
              { text: "New hire John Smith onboarded.", time: "2 hours ago" },
              { text: "Payroll for March processed.", time: "1 day ago" },
              { text: "System update completed.", time: "2 days ago" },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-primary flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-foreground">{activity.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate('/reports')}
            className="w-full mt-6 py-2 text-sm font-medium text-primary hover:bg-muted rounded-md transition-colors"
          >
            View All Activity
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth();
  
  if (user?.is_hr_admin) {
    return <AdminDashboard />;
  }
  
  return <EmployeeDashboard />;
}
