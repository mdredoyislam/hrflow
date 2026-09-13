from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from core.models import BaseModel, Organization, TenantModel
import uuid

class Permission(BaseModel):
    name = models.CharField(max_length=255, unique=True) # e.g. "employee.view"
    description = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return self.name

class Role(TenantModel):
    name = models.CharField(max_length=100) # e.g. "HR Manager"
    description = models.TextField(null=True, blank=True)
    permissions = models.ManyToManyField(Permission, related_name='roles', blank=True)
    
    class Meta:
        unique_together = ('organization', 'name')
    
    def __str__(self):
        return f"{self.name} - {self.organization.name}"

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        # Superuser does not necessarily belong to a specific organization.
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser, BaseModel):
    username = None # Use email as the primary identifier
    email = models.EmailField(unique=True)
    
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True, related_name='users')
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    is_hr_admin = models.BooleanField(default=False, help_text="Designates whether the user is an HR Admin for their organization.")

    
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    def __str__(self):
        return self.email

    def has_permission(self, perm_name):
        if self.is_superuser:
            return True
        if self.role and self.role.permissions.filter(name=perm_name).exists():
            return True
        return False
