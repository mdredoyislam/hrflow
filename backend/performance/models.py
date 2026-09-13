from django.db import models
from core.models import TenantModel
from employees.models import Employee

class KPI(TenantModel):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    target_value = models.CharField(max_length=100, null=True, blank=True)
    department = models.ForeignKey('core.Department', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name

class Goal(TenantModel):
    STATUS_CHOICES = [
        ('NOT_STARTED', 'Not Started'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='goals')
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    kpi = models.ForeignKey(KPI, on_delete=models.SET_NULL, null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    progress_percentage = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NOT_STARTED')

    def __str__(self):
        return f"{self.title} ({self.employee})"

class PerformanceReview(TenantModel):
    RATING_CHOICES = [
        (1, 'Poor'),
        (2, 'Fair'),
        (3, 'Good'),
        (4, 'Very Good'),
        (5, 'Excellent'),
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='performance_reviews')
    reviewer = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='reviews_given')
    review_period_start = models.DateField()
    review_period_end = models.DateField()
    overall_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True)
    comments = models.TextField(null=True, blank=True)
    is_published = models.BooleanField(default=False)

    def __str__(self):
        return f"Review for {self.employee} ({self.review_period_end})"

class Feedback(TenantModel):
    TYPE_CHOICES = [
        ('360_REVIEW', '360 Review'),
        ('CONTINUOUS', 'Continuous Feedback'),
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='received_feedbacks')
    provider = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='provided_feedbacks')
    feedback_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='CONTINUOUS')
    content = models.TextField()
    is_anonymous = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for {self.employee}"
