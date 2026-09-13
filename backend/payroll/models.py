from django.db import models
from core.models import TenantModel
from employees.models import Employee

class SalaryStructure(TenantModel):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name='salary_structure')
    base_salary = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default='USD')
    payment_cycle = models.CharField(max_length=20, choices=[('MONTHLY', 'Monthly'), ('WEEKLY', 'Weekly'), ('BIWEEKLY', 'Bi-weekly')], default='MONTHLY')
    effective_from = models.DateField()

    def __str__(self):
        return f"{self.employee} - {self.base_salary} {self.currency}"

class Allowance(TenantModel):
    salary_structure = models.ForeignKey(SalaryStructure, on_delete=models.CASCADE, related_name='allowances')
    name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_taxable = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name}: {self.amount}"

class Deduction(TenantModel):
    salary_structure = models.ForeignKey(SalaryStructure, on_delete=models.CASCADE, related_name='deductions')
    name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.name}: {self.amount}"

class Payslip(TenantModel):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('GENERATED', 'Generated'),
        ('PAID', 'Paid'),
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='payslips')
    month = models.IntegerField()
    year = models.IntegerField()
    basic_salary = models.DecimalField(max_digits=12, decimal_places=2)
    total_allowances = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    net_pay = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='DRAFT')
    payment_date = models.DateField(null=True, blank=True)
    pdf_document = models.FileField(upload_to='payslips/', null=True, blank=True)

    class Meta:
        unique_together = ('employee', 'month', 'year')

    def __str__(self):
        return f"Payslip - {self.employee} ({self.month}/{self.year})"
