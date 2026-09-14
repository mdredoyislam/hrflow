import asyncio
from playwright.async_api import async_playwright
import os

async def create_users():
    print("Creating users via django shell...")
    os.system("cd backend && .\\venv\\Scripts\\python.exe manage.py shell -c \"from users.models import User; from core.models import Organization; org, _ = Organization.objects.get_or_create(name='Screenshot Corp', is_active=True); User.objects.filter(email='super@example.com').exists() or User.objects.create_superuser('super@example.com', 'Super123!'); User.objects.filter(email='user@example.com').exists() or User.objects.create_user(email='user@example.com', password='Password123!', first_name='Test', last_name='User', organization=org)\"")

async def main():
    await create_users()
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        
        # --- SUPER ADMIN FLOW ---
        page = await browser.new_page(viewport={"width": 1280, "height": 800})
        print("Navigating to login...")
        await page.goto("http://localhost:5173/login")
        print("Logging in as superuser...")
        await page.fill("input[type='email']", "super@example.com")
        await page.fill("input[type='password']", "Super123!")
        await page.click("button[type='submit']")
        
        print("Waiting for super admin dashboard...")
        await page.wait_for_url("**/dashboard*", timeout=15000)
        await page.goto("http://localhost:5173/super-admin")
        await asyncio.sleep(2)
        
        print("Taking Super Admin screenshot...")
        await page.screenshot(path="docs/images/super_admin.png")
        await page.close()
        
        # --- REGULAR USER FLOW ---
        page2 = await browser.new_page(viewport={"width": 1280, "height": 800})
        print("Navigating to login as normal user...")
        await page2.goto("http://localhost:5173/login")
        
        await page2.fill("input[type='email']", "user@example.com")
        await page2.fill("input[type='password']", "Password123!")
        await page2.click("button[type='submit']")
        
        print("Waiting for dashboard...")
        await page2.wait_for_url("**/dashboard*", timeout=15000)
        await asyncio.sleep(3)
        
        print("Taking Dashboard screenshot...")
        await page2.screenshot(path="docs/images/dashboard.png")
        
        print("Taking Recruitment screenshot...")
        await page2.goto("http://localhost:5173/recruitment")
        await asyncio.sleep(3)
        await page2.screenshot(path="docs/images/recruitment.png")
        
        print("Taking Payroll screenshot...")
        await page2.goto("http://localhost:5173/payroll")
        await asyncio.sleep(3)
        await page2.screenshot(path="docs/images/payroll.png")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
