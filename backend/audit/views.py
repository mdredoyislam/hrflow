from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from .models import AuditLog
from .serializers import AuditLogSerializer
from core.views_mixins import TenantAwareModelViewSet

class AuditLogViewSet(TenantAwareModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['action', 'user', 'content_type']
    ordering_fields = ['timestamp']
    
    # Audit logs should typically be read-only via API
    http_method_names = ['get', 'head', 'options']
