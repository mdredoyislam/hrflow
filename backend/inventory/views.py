from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Asset, AssetAssignment
from .serializers import AssetSerializer, AssetAssignmentSerializer
from core.views_mixins import TenantAwareModelViewSet

class AssetViewSet(TenantAwareModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'category']

class AssetAssignmentViewSet(TenantAwareModelViewSet):
    queryset = AssetAssignment.objects.all()
    serializer_class = AssetAssignmentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee', 'asset']
