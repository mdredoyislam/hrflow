import { Outlet, NavLink } from "react-router-dom"
import { Building2, LayoutDashboard, Users, Calendar, CalendarClock, HandCoins, TrendingUp, Target, Package, FileText, Settings, Bell, Search, Menu, LogOut, UserPlus, ListTodo, CreditCard } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const { user, logout } = useAuth()
  
  const allNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "People", href: "/people", icon: Users, adminOnly: true },
    { name: "Recruitment", href: "/recruitment", icon: UserPlus, adminOnly: true },
    { name: "Onboarding", href: "/onboarding", icon: ListTodo, adminOnly: true },
    { name: "Attendance", href: "/attendance", icon: CalendarClock },
    { name: "Leave", href: "/leave", icon: Calendar },
    { name: "Payroll", href: "/payroll", icon: HandCoins, adminOnly: true },
    { name: "Performance", href: "/performance", icon: TrendingUp },
    { name: "KPI", href: "/kpi", icon: Target, adminOnly: true },
    { name: "Inventory", href: "/inventory", icon: Package, adminOnly: true },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Reports", href: "/reports", icon: FileText, adminOnly: true },
    { name: "Subscription", href: "/subscription", icon: CreditCard, adminOnly: true },
  ]
  
  const navItems = allNavItems.filter(item => user?.is_hr_admin || !item.adminOnly)

  const notifications = [
    { id: 1, title: 'Leave Request Approved', message: 'Your sick leave for Oct 25 has been approved.', time: '10m ago', unread: true },
    { id: 2, title: 'New Asset Assigned', message: 'MacBook Pro 16" has been assigned to you.', time: '1h ago', unread: true },
    { id: 3, title: 'Performance Review', message: 'Please complete your self-evaluation by Nov 15.', time: '1d ago', unread: false },
  ]

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 md:relative md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Building2 className="w-6 h-6 text-primary mr-3" />
          <span className="font-bold text-xl text-primary tracking-tight">HRFlow</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-border">
          <NavLink to="/settings" className={({ isActive }) => cn(
            "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
            isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}>
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </NavLink>
          <button 
            onClick={logout}
            className="flex items-center w-full mt-1 px-3 py-2.5 text-sm font-medium rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 z-10">
          <div className="flex items-center">
            <button 
              className="md:hidden mr-4 text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search anything... (Ctrl+K)" 
                className="h-9 w-64 md:w-80 rounded-md border border-input bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className="relative text-muted-foreground hover:text-foreground"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full border border-card"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg border border-border shadow-lg z-50">
                  <div className="p-3 border-b border-border flex justify-between items-center">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    <button className="text-xs text-primary hover:underline">Mark all as read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(notif => (
                      <div key={notif.id} className={cn("p-3 border-b border-border hover:bg-muted/50 cursor-pointer", notif.unread && "bg-primary/5")}>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={cn("text-sm", notif.unread ? "font-semibold" : "font-medium text-muted-foreground")}>{notif.title}</h4>
                          <span className="text-xs text-muted-foreground">{notif.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 text-center border-t border-border">
                    <button className="text-sm text-primary hover:underline">View All Notifications</button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3 pl-4 border-l border-border">
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium leading-none">{user?.first_name} {user?.last_name}</div>
                <div className="text-xs text-muted-foreground mt-1">{user?.is_hr_admin ? "HR Admin" : (user?.role || "Employee")}</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
