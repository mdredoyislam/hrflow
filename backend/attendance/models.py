from django.db import models
from core.models import TenantModel, Branch
from employees.models import Employee

class WorkSchedule(TenantModel):
    name = models.CharField(max_length=100)
    start_time = models.TimeField()
    end_time = models.TimeField()
    grace_period_minutes = models.IntegerField(default=15)
    working_days = models.JSONField(default=list) # e.g. [0,1,2,3,4] for Mon-Fri
    
    def __str__(self):
        return f"{self.name} ({self.start_time} - {self.end_time})"

class Holiday(TenantModel):
    HOLIDAY_TYPES = [
        ('PUBLIC', 'Public Holiday'),
        ('COMPANY', 'Company Holiday'),
        ('OPTIONAL', 'Optional Holiday'),
    ]
    name = models.CharField(max_length=255)
    date = models.DateField()
    type = models.CharField(max_length=10, choices=HOLIDAY_TYPES, default='PUBLIC')
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} - {self.date}"

class Attendance(TenantModel):
    STATUS_CHOICES = [
        ('PRESENT', 'Present'),
        ('ABSENT', 'Absent'),
        ('LATE', 'Late'),
        ('HALF_DAY', 'Half Day'),
        ('ON_LEAVE', 'On Leave'),
    ]
    SOURCE_CHOICES = [
        ('WEB', 'Web'),
        ('MANUAL', 'Manual'),
        ('API', 'API / Biometric'),
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField()
    clock_in = models.DateTimeField(null=True, blank=True)
    clock_out = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PRESENT')
    source = models.CharField(max_length=10, choices=SOURCE_CHOICES, default='WEB')
    work_hours = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    overtime_hours = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    
    class Meta:
        unique_together = ('employee', 'date')
        
    def __str__(self):
        return f"{self.employee.first_name} - {self.date} ({self.status})"

class AttendanceBreak(TenantModel):
    attendance = models.ForeignKey(Attendance, on_delete=models.CASCADE, related_name='breaks')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Break for {self.attendance}"
