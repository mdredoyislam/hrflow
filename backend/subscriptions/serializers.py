from rest_framework import serializers
from .models import SubscriptionPlan, OrganizationSubscription

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = '__all__'

class OrganizationSubscriptionSerializer(serializers.ModelSerializer):
    plan_details = SubscriptionPlanSerializer(source='plan', read_only=True)
    
    class Meta:
        model = OrganizationSubscription
        fields = '__all__'
        read_only_fields = ['organization', 'status', 'current_period_end']
