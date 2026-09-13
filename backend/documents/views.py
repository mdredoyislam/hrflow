from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Document, DocumentCategory
from .serializers import DocumentSerializer, DocumentCategorySerializer
from core.views_mixins import TenantAwareModelViewSet

class DocumentCategoryViewSet(TenantAwareModelViewSet):
    queryset = DocumentCategory.objects.all()
    serializer_class = DocumentCategorySerializer

class DocumentViewSet(TenantAwareModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'is_public']
