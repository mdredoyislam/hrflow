from django.db import models
from core.models import TenantModel

class DocumentCategory(TenantModel):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

class Document(TenantModel):
    title = models.CharField(max_length=255)
    category = models.ForeignKey(DocumentCategory, on_delete=models.SET_NULL, null=True, related_name='documents')
    file = models.FileField(upload_to='company_documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_public = models.BooleanField(default=True, help_text="Available to all employees in the organization")

    def __str__(self):
        return self.title
