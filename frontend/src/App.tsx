import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Landing from "./pages/Landing"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import People from "./pages/People"
import EmployeeProfile from "./pages/EmployeeProfile"
import Attendance from "./pages/Attendance"
import Leave from "./pages/Leave"
import Recruitment from "./pages/Recruitment"
import Onboarding from "./pages/Onboarding"
import Payroll from "./pages/Payroll"
import Performance from "./pages/Performance"
import Inventory from "./pages/Inventory"
import Documents from "./pages/Documents"
import Reports from "./pages/Reports"
import Settings from "./pages/Settings"
import Subscription from "./pages/Subscription"
import KPIPage from "./pages/KPI"
import PublicJobForm from "./pages/PublicJobForm"
import SuperAdmin from "./pages/SuperAdmin"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

const SuperAdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!user?.is_superuser) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/careers/:jobId" element={<PublicJobForm />} />
            
            {/* Protected routes wrapped in Layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/people" element={<People />} />
                <Route path="/people/:id" element={<EmployeeProfile />} />
                <Route path="/recruitment" element={<Recruitment />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/leave" element={<Leave />} />
                <Route path="/payroll" element={<Payroll />} />
                <Route path="/performance" element={<Performance />} />
                <Route path="/kpi" element={<KPIPage />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/super-admin" element={<SuperAdminRoute><SuperAdmin /></SuperAdminRoute>} />
              </Route>
            </Route>
            
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App
