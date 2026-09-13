from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from .models import WorkSchedule, Holiday, Attendance, AttendanceBreak
from .serializers import WorkScheduleSerializer, HolidaySerializer, AttendanceSerializer, AttendanceBreakSerializer
from core.views_mixins import TenantAwareModelViewSet

class WorkScheduleViewSet(TenantAwareModelViewSet):
    queryset = WorkSchedule.objects.all()
    serializer_class = WorkScheduleSerializer

class HolidayViewSet(TenantAwareModelViewSet):
    queryset = Holiday.objects.all()
    serializer_class = HolidaySerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['type', 'branch']
    ordering_fields = ['date']

class AttendanceViewSet(TenantAwareModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['employee', 'date', 'status']
    ordering_fields = ['date', 'clock_in']

class AttendanceBreakViewSet(TenantAwareModelViewSet):
    queryset = AttendanceBreak.objects.all()
    serializer_class = AttendanceBreakSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['attendance']
