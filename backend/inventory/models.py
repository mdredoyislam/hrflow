from django.db import models
from core.models import TenantModel
from employees.models import Employee

class Asset(TenantModel):
    STATUS_CHOICES = [
        ('AVAILABLE', 'Available'),
        ('ASSIGNED', 'Assigned'),
        ('MAINTENANCE', 'In Maintenance'),
        ('RETIRED', 'Retired'),
    ]
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    serial_number = models.CharField(max_length=100, unique=True)
    purchase_date = models.DateField(null=True, blank=True)
    purchase_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE')

    def __str__(self):
        return f"{self.name} ({self.serial_number})"

class AssetAssignment(TenantModel):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='assignments')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='assets')
    assigned_date = models.DateField()
    returned_date = models.DateField(null=True, blank=True)
    condition_on_assignment = models.CharField(max_length=255, null=True, blank=True)
    condition_on_return = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.asset} assigned to {self.employee}"
