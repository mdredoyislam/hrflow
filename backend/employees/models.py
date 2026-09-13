from django.db import models
from core.models import TenantModel, Branch, Department, Team, Designation
from users.models import User

class Employee(TenantModel):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    MARITAL_STATUS_CHOICES = [
        ('S', 'Single'),
        ('M', 'Married'),
        ('D', 'Divorced'),
        ('W', 'Widowed'),
    ]
    
    EMPLOYMENT_TYPE_CHOICES = [
        ('FT', 'Full Time'),
        ('PT', 'Part Time'),
        ('C', 'Contract'),
        ('I', 'Internship'),
    ]
    
    STATUS_CHOICES = [
        ('A', 'Active'),
        ('P', 'Probation'),
        ('L', 'On Leave'),
        ('S', 'Suspended'),
        ('R', 'Resigned'),
        ('T', 'Terminated'),
        ('RT', 'Retired'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='employee_profile')
    
    # Personal Info
    employee_id = models.CharField(max_length=50)
    profile_photo = models.ImageField(upload_to='employees/photos/', null=True, blank=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True)
    marital_status = models.CharField(max_length=1, choices=MARITAL_STATUS_CHOICES, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    emergency_contact = models.TextField(null=True, blank=True)
    
    # Employment Info
    joining_date = models.DateField()
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True)
    designation = models.ForeignKey(Designation, on_delete=models.SET_NULL, null=True, blank=True)
    manager = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subordinates')
    employment_type = models.CharField(max_length=2, choices=EMPLOYMENT_TYPE_CHOICES, default='FT')
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default='A')
    work_location = models.CharField(max_length=255, null=True, blank=True)
    
    # Financial Info (Basic)
    base_salary = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    bank_information = models.JSONField(default=dict, blank=True) # E.g., {'bank_name': '', 'account_no': ''}
    tax_information = models.JSONField(default=dict, blank=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['organization', 'employee_id'], name='unique_employee_id_per_org')
        ]

    def save(self, *args, **kwargs):
        if not self.employee_id:
            last_emp = Employee.objects.filter(
                organization=self.organization, 
                employee_id__startswith="EMP-"
            ).order_by('-id').first()
            
            if last_emp and last_emp.employee_id:
                try:
                    last_num = int(last_emp.employee_id.split('-')[-1])
                    new_num = last_num + 1
                except ValueError:
                    new_num = 1
            else:
                new_num = 1
            
            self.employee_id = f"EMP-{new_num:04d}"
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.employee_id})"


class EmploymentHistory(TenantModel):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='employment_history')
    company_name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.company_name} - {self.designation}"


class EmployeeDocument(TenantModel):
    DOCUMENT_TYPES = [
        ('RESUME', 'Resume'),
        ('CONTRACT', 'Contract'),
        ('ID', 'NID/ID'),
        ('CERT', 'Certificate'),
        ('TAX', 'Tax Document'),
        ('OTHER', 'Other'),
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=10, choices=DOCUMENT_TYPES)
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='employees/documents/')
    expiry_date = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.employee.first_name} - {self.name}"
