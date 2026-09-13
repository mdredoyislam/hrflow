from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Employee, EmploymentHistory, EmployeeDocument
from .serializers import EmployeeSerializer, EmploymentHistorySerializer, EmployeeDocumentSerializer
from core.views_mixins import TenantAwareModelViewSet
from subscriptions.models import OrganizationSubscription
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
import traceback

class EmployeeViewSet(TenantAwareModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['department', 'branch', 'status', 'employment_type']
    search_fields = ['first_name', 'last_name', 'email', 'employee_id']
    ordering_fields = ['first_name', 'joining_date']

    def perform_create(self, serializer):
        org = self.request.user.organization
        if org:
            try:
                sub = OrganizationSubscription.objects.get(organization=org)
                if sub.plan and sub.plan.max_users != -1:
                    current_count = Employee.objects.filter(organization=org).count()
                    if current_count >= sub.plan.max_users:
                        raise ValidationError("You have reached the maximum number of employees for your plan. Please upgrade to add more.")
            except OrganizationSubscription.DoesNotExist:
                # No subscription means no employees allowed, or maybe default to free limits.
                # For safety, we block if they have no subscription at all.
                raise ValidationError("Your organization does not have an active subscription.")
        
        # Extract the create_user_account flag
        create_user = serializer.validated_data.pop('create_user_account', False)
        
        # Save the employee
        employee = serializer.save(organization=org)
        
        # Create user account if requested
        if create_user:
            User = get_user_model()
            email = employee.email
            if User.objects.filter(email=email).exists():
                raise ValidationError({"email": "A user account with this email already exists."})
            
            try:
                # Default password for new SaaS users
                user = User.objects.create_user(
                    email=email,
                    password="HrFlow123!",
                    first_name=employee.first_name,
                    last_name=employee.last_name,
                    organization=org
                )
                # Link user to employee
                employee.user = user
                employee.save(update_fields=['user'])
            except Exception as e:
                # If user creation fails, log it but don't crash employee creation
                print(f"Error creating user account for employee {employee.id}: {e}")
                traceback.print_exc()

class EmploymentHistoryViewSet(TenantAwareModelViewSet):
    queryset = EmploymentHistory.objects.all()
    serializer_class = EmploymentHistorySerializer
    filterset_fields = ['employee']

class EmployeeDocumentViewSet(TenantAwareModelViewSet):
    queryset = EmployeeDocument.objects.all()
    serializer_class = EmployeeDocumentSerializer
    filterset_fields = ['employee', 'document_type']
