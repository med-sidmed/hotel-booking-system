
import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

base_url = "http://localhost:8000/api"

def make_request(url, data=None, headers=None, method='POST'):
    if data:
        data = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers=headers or {}, method=method)
    try:
        with urllib.request.urlopen(req, context=ctx) as response:
            return response.getcode(), response.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8')
    except Exception as e:
        return None, str(e)

# Login as admin
login_data = {
    "email": "admin@luxotel.com",
    "password": "adminpassword"
}
code, body = make_request(f"{base_url}/auth/login/", login_data, {"Content-Type": "application/json"})

if code != 200:
    print(f"Login failed: {code} {body}")
    exit(1)

token = json.loads(body).get("token")
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

# Try to create invitation
inv_data = {
    "email": "debug_new_owner_urllib@example.com",
    "role": "owner",
    "expires_at": "2026-12-31T23:59:59Z"
}
code, body = make_request(f"{base_url}/invitations/", inv_data, headers)
print(f"Status Code: {code}")
print(f"Response Body: {body}")
