import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hrflow_backend.settings')
django.setup()

from subscriptions.models import SubscriptionPlan

def seed():
    plans = [
        {
            'name': 'Free',
            'description': 'For small startups',
            'price_monthly': 0.00,
            'price_yearly': 0.00,
            'max_users': 5,
            'features': ['Basic HR', 'Attendance Tracking', 'Up to 5 Users']
        },
        {
            'name': 'Pro',
            'description': 'For growing businesses',
            'price_monthly': 99.00,
            'price_yearly': 990.00,
            'max_users': 50,
            'features': ['Everything in Free', 'Performance Reviews', 'Payroll Integrations', 'Up to 50 Users']
        },
        {
            'name': 'Enterprise',
            'description': 'For large organizations',
            'price_monthly': 299.00,
            'price_yearly': 2990.00,
            'max_users': -1,
            'features': ['Everything in Pro', 'Custom Roles', 'Audit Logs', 'Unlimited Users', 'Priority Support']
        }
    ]
    
    for plan in plans:
        SubscriptionPlan.objects.update_or_create(
            name=plan['name'],
            defaults=plan
        )
    print("Seeded subscription plans!")

if __name__ == '__main__':
    seed()
