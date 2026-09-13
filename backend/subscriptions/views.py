from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import SubscriptionPlan, OrganizationSubscription
from .serializers import SubscriptionPlanSerializer, OrganizationSubscriptionSerializer
from core.models import Organization

class SubscriptionPlanViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public read-only viewset for available plans.
    """
    queryset = SubscriptionPlan.objects.filter(is_active=True).order_by('price_monthly')
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

class OrganizationSubscriptionViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # A user should only see the subscription of their organization
        if getattr(self.request.user, 'organization', None):
            return OrganizationSubscription.objects.filter(organization=self.request.user.organization)
        return OrganizationSubscription.objects.none()

    @action(detail=False, methods=['GET'])
    def current(self, request):
        """
        Get the current subscription for the user's organization.
        """
        if not request.user.organization:
            return Response({'detail': 'No organization associated.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            subscription = OrganizationSubscription.objects.get(organization=request.user.organization)
            serializer = self.get_serializer(subscription)
            return Response(serializer.data)
        except OrganizationSubscription.DoesNotExist:
            return Response({'detail': 'No subscription found.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['POST'])
    def subscribe(self, request):
        """
        Endpoint to handle manual subscription switching/upgrading.
        In a real scenario, this would create a Stripe checkout session.
        """
        if not request.user.organization:
            return Response({'detail': 'No organization associated.'}, status=status.HTTP_400_BAD_REQUEST)

        plan_id = request.data.get('plan_id')
        try:
            plan = SubscriptionPlan.objects.get(id=plan_id)
        except SubscriptionPlan.DoesNotExist:
            return Response({'detail': 'Invalid plan ID.'}, status=status.HTTP_400_BAD_REQUEST)

        # Upsert the organization's subscription
        sub, created = OrganizationSubscription.objects.get_or_create(
            organization=request.user.organization,
            defaults={'plan': plan, 'status': 'ACTIVE'}
        )
        if not created:
            sub.plan = plan
            sub.status = 'ACTIVE'
            sub.save()

        serializer = self.get_serializer(sub)
        return Response(serializer.data, status=status.HTTP_200_OK)
