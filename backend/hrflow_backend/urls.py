from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from core.views import OrganizationViewSet, BranchViewSet, DepartmentViewSet, TeamViewSet, DesignationViewSet
from users.views import UserViewSet, RoleViewSet, PermissionViewSet, RegisterView
from employees.views import EmployeeViewSet, EmploymentHistoryViewSet, EmployeeDocumentViewSet
from attendance.views import WorkScheduleViewSet, HolidayViewSet, AttendanceViewSet, AttendanceBreakViewSet
from leave.views import LeaveTypeViewSet, LeaveBalanceViewSet, LeaveRequestViewSet
from recruitment.views import (
    JobPostingViewSet, CandidateViewSet, ApplicationViewSet, 
    InterviewViewSet, OnboardingTaskViewSet,
    PublicJobPostingRetrieveView, PublicApplicationCreateView
)
from payroll.views import SalaryStructureViewSet, AllowanceViewSet, DeductionViewSet, PayslipViewSet
from performance.views import KPIViewSet, GoalViewSet, PerformanceReviewViewSet, FeedbackViewSet
from inventory.views import AssetViewSet, AssetAssignmentViewSet
from documents.views import DocumentViewSet, DocumentCategoryViewSet
from notifications.views import NotificationViewSet
from audit.views import AuditLogViewSet
from reports.views import ReportGenerationView

router = DefaultRouter()
# Core routes
router.register(r'organizations', OrganizationViewSet)
router.register(r'branches', BranchViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'teams', TeamViewSet)
router.register(r'designations', DesignationViewSet)

# Users routes
router.register(r'users', UserViewSet)
router.register(r'roles', RoleViewSet)
router.register(r'permissions', PermissionViewSet)

# Employees routes
router.register(r'employees', EmployeeViewSet)
router.register(r'employment-history', EmploymentHistoryViewSet)
router.register(r'employee-documents', EmployeeDocumentViewSet)

# Attendance routes
router.register(r'work-schedules', WorkScheduleViewSet)
router.register(r'holidays', HolidayViewSet)
router.register(r'attendance', AttendanceViewSet)
router.register(r'attendance-breaks', AttendanceBreakViewSet)

# Leave routes
router.register(r'leave-types', LeaveTypeViewSet)
router.register(r'leave-balances', LeaveBalanceViewSet)
router.register(r'leave-requests', LeaveRequestViewSet)

# Recruitment routes
router.register(r'job-postings', JobPostingViewSet)
router.register(r'candidates', CandidateViewSet)
router.register(r'applications', ApplicationViewSet)
router.register(r'interviews', InterviewViewSet)
router.register(r'onboarding-tasks', OnboardingTaskViewSet)

# Payroll routes
router.register(r'salary-structures', SalaryStructureViewSet)
router.register(r'allowances', AllowanceViewSet)
router.register(r'deductions', DeductionViewSet)
router.register(r'payslips', PayslipViewSet)

# Performance routes
router.register(r'kpis', KPIViewSet)
router.register(r'goals', GoalViewSet)
router.register(r'performance-reviews', PerformanceReviewViewSet)
router.register(r'feedback', FeedbackViewSet)

# Inventory routes
router.register(r'assets', AssetViewSet)
router.register(r'asset-assignments', AssetAssignmentViewSet)

# Document routes
router.register(r'documents', DocumentViewSet)
router.register(r'document-categories', DocumentCategoryViewSet)

# Notification routes
router.register(r'notifications', NotificationViewSet)

# Audit routes
router.register(r'audit-logs', AuditLogViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/register/', RegisterView.as_view(), name='auth_register'),
    path('api/v1/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/reports/generate/', ReportGenerationView.as_view(), name='generate_report'),
    
    # Public Recruitment APIs
    path('api/v1/public/jobs/<uuid:pk>/', PublicJobPostingRetrieveView.as_view(), name='public-job-detail'),
    path('api/v1/public/jobs/<uuid:pk>/apply/', PublicApplicationCreateView.as_view(), name='public-job-apply'),
    
    path('api/v1/', include('subscriptions.urls')),
    path('api/v1/', include(router.urls)),
]
