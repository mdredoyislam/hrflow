import requests

# 1. Login to get token
login_url = "http://127.0.0.1:8000/api/v1/auth/login/"
payload = {
    "email": "admin@acmecorp.com",
    "password": "admin123"
}
resp = requests.post(login_url, json=payload)
print("Login status:", resp.status_code)
if resp.status_code != 200:
    print(resp.text)
    exit(1)

token = resp.json()["access"]
headers = {"Authorization": f"Bearer {token}"}

# 2. Create a KPI
create_url = "http://127.0.0.1:8000/api/v1/kpis/"
kpi_data = {
    "name": "Test KPI",
    "description": "Test Desc",
    "target_value": "100"
}
resp = requests.post(create_url, json=kpi_data, headers=headers)
print("Create status:", resp.status_code)
print("Create response:", resp.json())
kpi_id = resp.json().get("id")

if kpi_id:
    # 3. Update the KPI
    update_url = f"http://127.0.0.1:8000/api/v1/kpis/{kpi_id}/"
    update_data = {
        "name": "Updated KPI",
    }
    resp = requests.patch(update_url, json=update_data, headers=headers)
    print("Update status:", resp.status_code)
    print("Update response:", resp.text)
