from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from .models import LeaveType, LeaveBalance, LeaveRequest
from .serializers import LeaveTypeSerializer, LeaveBalanceSerializer, LeaveRequestSerializer
from core.views_mixins import TenantAwareModelViewSet

class LeaveTypeViewSet(TenantAwareModelViewSet):
    queryset = LeaveType.objects.all()
    serializer_class = LeaveTypeSerializer

class LeaveBalanceViewSet(TenantAwareModelViewSet):
    queryset = LeaveBalance.objects.all()
    serializer_class = LeaveBalanceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee', 'leave_type', 'year']

class LeaveRequestViewSet(TenantAwareModelViewSet):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['employee', 'leave_type', 'status']
    ordering_fields = ['start_date', 'created_at']
