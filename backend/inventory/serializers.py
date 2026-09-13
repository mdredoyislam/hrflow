from rest_framework import serializers
from .models import Asset, AssetAssignment

class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = '__all__'

class AssetAssignmentSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source='asset.name', read_only=True)
    employee_name = serializers.CharField(source='employee.first_name', read_only=True)
    
    class Meta:
        model = AssetAssignment
        fields = '__all__'
