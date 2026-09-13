from django.db import models
from core.models import BaseModel, Organization

class SubscriptionPlan(BaseModel):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    price_monthly = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    price_yearly = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    max_users = models.IntegerField(help_text="Maximum allowed users (-1 for unlimited)")
    features = models.JSONField(default=list, help_text="List of feature strings")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.max_users} users"

class OrganizationSubscription(BaseModel):
    STATUS_CHOICES = (
        ('TRIALING', 'Trialing'),
        ('ACTIVE', 'Active'),
        ('PAST_DUE', 'Past Due'),
        ('CANCELED', 'Canceled'),
    )

    organization = models.OneToOneField(Organization, on_delete=models.CASCADE, related_name="subscription")
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, null=True, related_name="subscriptions")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='TRIALING')
    is_annual = models.BooleanField(default=False)
    current_period_end = models.DateTimeField(null=True, blank=True)
    stripe_customer_id = models.CharField(max_length=255, null=True, blank=True)
    stripe_subscription_id = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.organization.name} - {self.plan.name if self.plan else 'No Plan'}"
