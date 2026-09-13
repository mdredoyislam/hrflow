from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from .models import KPI, Goal, PerformanceReview, Feedback
from .serializers import KPISerializer, GoalSerializer, PerformanceReviewSerializer, FeedbackSerializer
from core.views_mixins import TenantAwareModelViewSet

class KPIViewSet(TenantAwareModelViewSet):
    queryset = KPI.objects.all()
    serializer_class = KPISerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['department']

class GoalViewSet(TenantAwareModelViewSet):
    queryset = Goal.objects.all()
    serializer_class = GoalSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['employee', 'status', 'kpi']
    ordering_fields = ['end_date']

class PerformanceReviewViewSet(TenantAwareModelViewSet):
    queryset = PerformanceReview.objects.all()
    serializer_class = PerformanceReviewSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['employee', 'reviewer', 'is_published']
    ordering_fields = ['review_period_end']

class FeedbackViewSet(TenantAwareModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['employee', 'provider', 'feedback_type']
    ordering_fields = ['created_at']
