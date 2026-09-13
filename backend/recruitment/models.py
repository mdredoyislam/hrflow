from django.db import models
from core.models import TenantModel, Department
from employees.models import Employee

class JobPosting(TenantModel):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('PUBLISHED', 'Published'),
        ('CLOSED', 'Closed'),
    ]
    title = models.CharField(max_length=255)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    location = models.CharField(max_length=255)
    employment_type = models.CharField(max_length=50) # e.g., Full-time, Contract
    description = models.TextField()
    requirements = models.TextField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='DRAFT')
    opening_date = models.DateField(null=True, blank=True)
    closing_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title

class Candidate(TenantModel):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    linkedin_url = models.URLField(null=True, blank=True)
    source = models.CharField(max_length=100, null=True, blank=True) # e.g., LinkedIn, Referral

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Application(TenantModel):
    STATUS_CHOICES = [
        ('APPLIED', 'Applied'),
        ('SCREENING', 'Screening'),
        ('INTERVIEW', 'Interview'),
        ('OFFERED', 'Offered'),
        ('HIRED', 'Hired'),
        ('REJECTED', 'Rejected'),
    ]
    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name='applications')
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='APPLIED')
    applied_on = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(null=True, blank=True)

    class Meta:
        unique_together = ('job', 'candidate')

    def __str__(self):
        return f"{self.candidate} -> {self.job.title}"

class Interview(TenantModel):
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='interviews')
    interviewer = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True)
    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(default=60)
    interview_type = models.CharField(max_length=50) # e.g., Technical, HR
    notes = models.TextField(null=True, blank=True)
    result = models.CharField(max_length=50, null=True, blank=True) # e.g., Passed, Failed

    def __str__(self):
        return f"Interview for {self.application} at {self.scheduled_at}"

class OnboardingTask(TenantModel):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='onboarding_tasks')
    task_name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    assigned_to = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tasks')

    def __str__(self):
        return f"{self.task_name} for {self.employee}"
