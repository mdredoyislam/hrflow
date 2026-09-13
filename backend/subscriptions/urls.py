from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SubscriptionPlanViewSet, OrganizationSubscriptionViewSet

router = DefaultRouter()
router.register(r'plans', SubscriptionPlanViewSet, basename='subscription-plans')
router.register(r'subscriptions', OrganizationSubscriptionViewSet, basename='organization-subscriptions')

urlpatterns = [
    path('', include(router.urls)),
]
