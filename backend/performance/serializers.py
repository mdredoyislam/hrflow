from rest_framework import serializers
from .models import KPI, Goal, PerformanceReview, Feedback

class KPISerializer(serializers.ModelSerializer):
    class Meta:
        model = KPI
        fields = '__all__'
        read_only_fields = ['organization', 'created_at', 'updated_at']

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = '__all__'
        read_only_fields = ['organization', 'created_at', 'updated_at']

class PerformanceReviewSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.first_name', read_only=True)
    reviewer_name = serializers.CharField(source='reviewer.first_name', read_only=True)
    
    class Meta:
        model = PerformanceReview
        fields = '__all__'
        read_only_fields = ['organization', 'created_at', 'updated_at']

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'
        read_only_fields = ['organization', 'created_at', 'updated_at']
