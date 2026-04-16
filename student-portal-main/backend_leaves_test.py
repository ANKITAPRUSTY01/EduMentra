import requests
import json

base_url = 'http://127.0.0.1:8001'

def test_leaves():
    try:
        # 1. Login
        login_resp = requests.post(f'{base_url}/token', data={'username': 'student1', 'password': 'student123'})
        if login_resp.status_code != 200:
            print(f"Login failed: {login_resp.status_code} {login_resp.text}")
            return
        
        token = login_resp.json()['access_token']
        headers = {'Authorization': f'Bearer {token}'}
        
        # 2. Add Leave
        leave_data = {
            "reason": "Family emergency",
            "duration": "1 Day",
            "start_date": "2026-02-15"
        }
        post_resp = requests.post(f'{base_url}/leaves', headers=headers, json=leave_data)
        print(f"Post Leave Status: {post_resp.status_code}")
        print(f"Post Result: {json.dumps(post_resp.json(), indent=2)}")

        # 3. Get Leaves
        leaves_resp = requests.get(f'{base_url}/leaves', headers=headers)
        print(f"Fetch Leaves Status: {leaves_resp.status_code}")
        print(f"Leaves: {json.dumps(leaves_resp.json(), indent=2)}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_leaves()
