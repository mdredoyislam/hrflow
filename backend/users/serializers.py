from rest_framework import serializers
from .models import User, Role, Permission
from django.contrib.auth.password_validation import validate_password

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'

class RoleSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)
    permission_ids = serializers.PrimaryKeyRelatedField(
        queryset=Permission.objects.all(), source='permissions', many=True, write_only=True
    )
    
    class Meta:
        model = Role
        fields = ['id', 'name', 'description', 'permissions', 'permission_ids', 'organization', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)
    role_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(), source='role', write_only=True, required=False, allow_null=True
    )
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'organization', 'role', 'role_id', 'is_active', 'date_joined', 'is_hr_admin', 'is_superuser']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    company_name = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'company_name']

    def create(self, validated_data):
        company_name = validated_data.pop('company_name')
        
        from core.models import Organization
        from subscriptions.models import OrganizationSubscription
        from django.db import transaction
        
        with transaction.atomic():
            organization = Organization.objects.create(name=company_name)
            
            user = User.objects.create_user(
                email=validated_data['email'],
                password=validated_data['password'],
                first_name=validated_data.get('first_name', ''),
                last_name=validated_data.get('last_name', ''),
                organization=organization,
                is_hr_admin=True
            )
            
            OrganizationSubscription.objects.create(
                organization=organization,
                status='TRIALING'
            )
            
        return user
