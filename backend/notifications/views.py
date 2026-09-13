from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Notification
from .serializers import NotificationSerializer
from core.views_mixins import TenantAwareModelViewSet

class NotificationViewSet(TenantAwareModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_read', 'notification_type']

    def get_queryset(self):
        # Additional filtering by the request user, as notifications are specific to a user
        qs = super().get_queryset()
        return qs.filter(user=self.request.user)
