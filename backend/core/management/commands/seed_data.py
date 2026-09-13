from django.core.management.base import BaseCommand
from core.models import Organization, Department, Designation
from users.models import User, Role
from employees.models import Employee
from django.utils import timezone
from datetime import timedelta

class Command(BaseCommand):
    help = 'Seeds the database with initial HRFlow data'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting to seed data...")

        # 1. Create Organization
        org, created = Organization.objects.get_or_create(
            name="Acme Corp",
            defaults={
                'subdomain': 'acme',
                'website': 'https://acmecorp.com'
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f"Created organization: {org.name}"))

        # 2. Create Roles
        admin_role, _ = Role.objects.get_or_create(organization=org, name="Super Admin")
        manager_role, _ = Role.objects.get_or_create(organization=org, name="Manager")
        employee_role, _ = Role.objects.get_or_create(organization=org, name="Employee")
        
        # 3. Create Admin User
        admin_user, created = User.objects.get_or_create(
            email="admin@acmecorp.com",
            defaults={
                'first_name': "Admin",
                'last_name': "User",
                'organization': org,
                'role': admin_role,
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS(f"Created admin user: {admin_user.email} (Password: admin123)"))

        # 4. Create Departments
        engineering, _ = Department.objects.get_or_create(organization=org, name="Engineering")
        hr, _ = Department.objects.get_or_create(organization=org, name="Human Resources")
        sales, _ = Department.objects.get_or_create(organization=org, name="Sales")

        # 5. Create Designations
        software_engineer, _ = Designation.objects.get_or_create(organization=org, department=engineering, name="Software Engineer")
        hr_manager, _ = Designation.objects.get_or_create(organization=org, department=hr, name="HR Manager")

        # 6. Create some basic Employees if they don't exist
        if not Employee.objects.filter(organization=org).exists():
            Employee.objects.create(
                organization=org,
                first_name="Evan",
                last_name="Wright",
                email="evan.wright@acmecorp.com",
                employee_id="EMP-1001",
                department=engineering,
                designation=software_engineer,
                joining_date=timezone.now().date() - timedelta(days=365)
            )
            Employee.objects.create(
                organization=org,
                first_name="Diana",
                last_name="Prince",
                email="diana.prince@acmecorp.com",
                employee_id="EMP-1002",
                department=hr,
                designation=hr_manager,
                joining_date=timezone.now().date() - timedelta(days=200)
            )
            self.stdout.write(self.style.SUCCESS("Created sample employees."))

        self.stdout.write(self.style.SUCCESS("Successfully seeded database!"))
