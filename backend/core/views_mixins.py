from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

class TenantAwareModelViewSet(viewsets.ModelViewSet):
    """
    A viewset that provides default `create()` and `get_queryset()`
    actions to automatically link/filter by the user's organization.
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        if self.request.user.organization:
            return super().get_queryset().filter(organization=self.request.user.organization)
        return super().get_queryset().none()

    def perform_create(self, serializer):
        if self.request.user.organization:
            serializer.save(organization=self.request.user.organization)
        else:
            serializer.save()
