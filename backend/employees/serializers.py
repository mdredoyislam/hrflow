from rest_framework import serializers
from .models import Employee, EmploymentHistory, EmployeeDocument
from core.serializers import DepartmentSerializer, DesignationSerializer, BranchSerializer, TeamSerializer

class EmploymentHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EmploymentHistory
        fields = '__all__'

class EmployeeDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeDocument
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    create_user_account = serializers.BooleanField(write_only=True, required=False, default=False)
    employee_id = serializers.CharField(read_only=True)
    
    department_details = DepartmentSerializer(source='department', read_only=True)
    designation_details = DesignationSerializer(source='designation', read_only=True)
    branch_details = BranchSerializer(source='branch', read_only=True)
    team_details = TeamSerializer(source='team', read_only=True)
    
    # Optional nested data
    employment_history = EmploymentHistorySerializer(many=True, read_only=True)
    documents = EmployeeDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = Employee
        fields = '__all__'
