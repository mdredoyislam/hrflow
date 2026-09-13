from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import User, Role, Permission
from .serializers import UserSerializer, RoleSerializer, PermissionSerializer, RegisterSerializer
from core.views_mixins import TenantAwareModelViewSet

class PermissionViewSet(viewsets.ReadOnlyModelViewSet):
    # Permissions are globally read-only
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [permissions.IsAuthenticated]

class RoleViewSet(TenantAwareModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return super().get_queryset()
        if self.request.user.organization:
            return super().get_queryset().filter(organization=self.request.user.organization)
        return super().get_queryset().none()

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
