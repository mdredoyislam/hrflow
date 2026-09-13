from django.db import models
import uuid

class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True

class Organization(BaseModel):
    name = models.CharField(max_length=255)
    subdomain = models.CharField(max_length=100, unique=True, null=True, blank=True)
    logo = models.ImageField(upload_to='organizations/logos/', null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name

class TenantModel(BaseModel):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="%(class)ss")
    
    class Meta:
        abstract = True

class Branch(TenantModel):
    name = models.CharField(max_length=255)
    address = models.TextField(null=True, blank=True)
    contact_email = models.EmailField(null=True, blank=True)
    contact_phone = models.CharField(max_length=20, null=True, blank=True)
    
    class Meta:
        verbose_name_plural = "Branches"
    
    def __str__(self):
        return f"{self.name} - {self.organization.name}"

class Department(TenantModel):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name='departments')
    
    def __str__(self):
        return f"{self.name} - {self.organization.name}"

class Team(TenantModel):
    name = models.CharField(max_length=255)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='teams')
    
    def __str__(self):
        return f"{self.name} - {self.department.name}"

class Designation(TenantModel):
    name = models.CharField(max_length=255)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='designations')
    
    def __str__(self):
        return self.name
