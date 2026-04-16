import requests
import json

base_url = 'http://127.0.0.1:8001'

def test_classify():
    try:
        # 1. Login as admin (any user works)
        login_resp = requests.post(f'{base_url}/token', data={'username': 'admin', 'password': 'admin123'})
        if login_resp.status_code != 200:
            print(f"Login failed: {login_resp.status_code} {login_resp.text}")
            return
        
        token = login_resp.json()['access_token']
        headers = {'Authorization': f'Bearer {token}'}
        
        # 2. Test Classification
        payload = {"reason": "I am suffering from severe fever and headache."}
        print(f"Testing /classify with payload: {payload}")
        
        resp = requests.post(f'{base_url}/classify', headers=headers, json=payload)
        print(f"Status Code: {resp.status_code}")
        print(f"Response: {resp.text}")
        
        if resp.status_code == 200:
            print("SUCCESS: Classification working correctly.")
        else:
            print("FAILURE: Classification failed.")

    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_classify()
