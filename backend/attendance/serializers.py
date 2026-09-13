from rest_framework import serializers
from .models import WorkSchedule, Holiday, Attendance, AttendanceBreak

class WorkScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkSchedule
        fields = '__all__'

class HolidaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Holiday
        fields = '__all__'

class AttendanceBreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceBreak
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    breaks = AttendanceBreakSerializer(many=True, read_only=True)
    employee_name = serializers.CharField(source='employee.first_name', read_only=True)
    
    class Meta:
        model = Attendance
        fields = '__all__'
