SCOPES = ['https://www.googleapis.com/auth/drive', 'https://mail.google.com/', 'https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/userinfo.email', 'openid']

REDIRECT_URI = 'http://127.0.0.1:8000/auth/'

SCRIPT_DEPLOYMENT_ID = 'XXXXXXXXXXXXXXXXXXXXXXXXXXX'

api_request = {
    "function": "useGoogleServices",
    "parameters": [
        'Sheet_created_through_API',
        'address@domain.com',
        ' Mail sent through API'
        ]
    }