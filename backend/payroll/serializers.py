from rest_framework import serializers
from .models import SalaryStructure, Allowance, Deduction, Payslip

class AllowanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allowance
        fields = '__all__'

class DeductionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deduction
        fields = '__all__'

class SalaryStructureSerializer(serializers.ModelSerializer):
    allowances = AllowanceSerializer(many=True, read_only=True)
    deductions = DeductionSerializer(many=True, read_only=True)
    employee_name = serializers.CharField(source='employee.first_name', read_only=True)
    
    class Meta:
        model = SalaryStructure
        fields = '__all__'

class PayslipSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.first_name', read_only=True)
    
    class Meta:
        model = Payslip
        fields = '__all__'
