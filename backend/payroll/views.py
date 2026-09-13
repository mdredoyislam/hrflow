from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from .models import SalaryStructure, Allowance, Deduction, Payslip
from .serializers import SalaryStructureSerializer, AllowanceSerializer, DeductionSerializer, PayslipSerializer
from core.views_mixins import TenantAwareModelViewSet

class SalaryStructureViewSet(TenantAwareModelViewSet):
    queryset = SalaryStructure.objects.all()
    serializer_class = SalaryStructureSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee']

class AllowanceViewSet(TenantAwareModelViewSet):
    queryset = Allowance.objects.all()
    serializer_class = AllowanceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['salary_structure']

class DeductionViewSet(TenantAwareModelViewSet):
    queryset = Deduction.objects.all()
    serializer_class = DeductionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['salary_structure']

class PayslipViewSet(TenantAwareModelViewSet):
    queryset = Payslip.objects.all()
    serializer_class = PayslipSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['employee', 'month', 'year', 'status']
    ordering_fields = ['year', 'month']
