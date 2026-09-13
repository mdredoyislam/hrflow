from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Organization, Branch, Department, Team, Designation
from .serializers import OrganizationSerializer, BranchSerializer, DepartmentSerializer, TeamSerializer, DesignationSerializer
from .views_mixins import TenantAwareModelViewSet

class OrganizationViewSet(viewsets.ModelViewSet):
    # Organizations are global, so we use a standard ModelViewSet
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        if self.request.user.organization:
            return super().get_queryset().filter(id=self.request.user.organization.id)
        return super().get_queryset().none()

class BranchViewSet(TenantAwareModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer

class DepartmentViewSet(TenantAwareModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class TeamViewSet(TenantAwareModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class DesignationViewSet(TenantAwareModelViewSet):
    queryset = Designation.objects.all()
    serializer_class = DesignationSerializer
