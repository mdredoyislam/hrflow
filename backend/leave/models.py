from django.db import models
from core.models import TenantModel
from employees.models import Employee

class LeaveType(TenantModel):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    annual_quota = models.IntegerField()
    is_paid = models.BooleanField(default=True)
    carry_forward_limit = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name

class LeaveBalance(TenantModel):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leave_balances')
    leave_type = models.ForeignKey(LeaveType, on_delete=models.CASCADE)
    year = models.IntegerField()
    total_quota = models.DecimalField(max_digits=5, decimal_places=1)
    used = models.DecimalField(max_digits=5, decimal_places=1, default=0.0)
    
    class Meta:
        unique_together = ('employee', 'leave_type', 'year')
        
    def __str__(self):
        return f"{self.employee.first_name} - {self.leave_type.name} ({self.year})"

class LeaveRequest(TenantModel):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('CANCELLED', 'Cancelled'),
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leave_requests')
    leave_type = models.ForeignKey(LeaveType, on_delete=models.RESTRICT)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    approved_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_leaves')
    rejection_reason = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.employee.first_name} - {self.leave_type.name} ({self.start_date} to {self.end_date})"
