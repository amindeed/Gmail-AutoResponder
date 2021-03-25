import json
from django.urls import reverse
from django.http import HttpResponse
from django.shortcuts import render, redirect
from googleapiclient import errors
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import Flow
from google.auth.transport.requests import Request
from google.oauth2 import id_token
from google.oauth2.credentials import Credentials
from django.contrib.auth import logout
from script_run_parameters import *
from .forms import SettingsForm

SCOPES = [
    'openid', 
    'https://www.googleapis.com/auth/script.scriptapp', 
    'https://mail.google.com/', 
    'https://www.googleapis.com/auth/drive', 
    'https://www.googleapis.com/auth/userinfo.email', 
    'https://www.googleapis.com/auth/spreadsheets', 
    'https://www.googleapis.com/auth/userinfo.profile'
]

REDIRECT_URI = 'http://127.0.0.1:8000/auth/'

flow = Flow.from_client_secrets_file(
    'credentials.json',
    scopes=SCOPES,
    redirect_uri=REDIRECT_URI)


# @require_auth decorator
def require_auth(function):
    def wrapper(request, *args, **kwargs):
        user = request.session.get('user')
        access_token = request.session.get('token')

        if user and access_token:
            creds = Credentials.from_authorized_user_info(access_token)
            if not creds or not creds.valid:
                if creds and creds.expired and creds.refresh_token:
                    creds.refresh(Request())
                    request.session['token'] = json.loads(creds.to_json())
                    return function(request, *args, **kwargs)
                else:
                    logout(request)
                    return redirect('/login')
            else:
                return function(request, *args, **kwargs)
        else:
            logout(request)
            return redirect('/login')

    return wrapper


@require_auth
def home(request):
    session_messages = request.session.pop('messages', None)
    user = request.session.get('user')
    return render(request, 'home.html', context={'user': user, 'messages': session_messages})


@require_auth
def reset(request):
    # ...
    return HttpResponse('Reset request well received!', status=200, content_type="application/json")
    

def get_settings(request):
    if request.method == "GET" and request.headers.get('x-requested-with') == 'XMLHttpRequest':

        access_token = request.session.get('token')
        creds = Credentials.from_authorized_user_info(access_token)

        service = build('script', 'v1', credentials=creds)

        getSettings_api_request = {
            "function": "getSettings",
            "parameters": []
        }

        try:
            response = service.scripts().run(body=getSettings_api_request,
                    scriptId=SCRIPT_ID).execute()

            if 'error' in response:
                # The API executed, but the script returned an error.
                api_call_error = response['error']['details'][0]
                http_response_err_msg = 'Google API call error: ' + str(api_call_error['errorMessage'])
                return HttpResponse(http_response_err_msg, status=500, content_type="application/json")
            else:
                script_function_return = response['response'].get('result', {})

        except errors.HttpError as e:
            # The API encountered a problem before the script started executing.
            http_response_err_msg = 'Google API call error: ' + e.content
            return HttpResponse(http_response_err_msg, status=500, content_type="application/json")
            
        return HttpResponse(json.dumps(script_function_return), content_type="application/json")
    else:
        return redirect('/')


def update_settings(request):
    script_function_return = {}
    print('**************** A *****************')
    if request.method == 'POST' and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        form = SettingsForm(request.POST)
        print('**************** B *****************')
        if form.is_valid():
            print('**************** C *****************')
            parameters = [form.cleaned_data]
            print(form.cleaned_data)

            access_token = request.session.get('token')
            creds = Credentials.from_authorized_user_info(access_token)

            service = build('script', 'v1', credentials=creds)

            setSettings_api_request = {
                "function": "setSettings",
                "parameters": parameters,
                "devMode": devMode
            }

            try:
                print('**************** D *****************')
                response = service.scripts().run(body=setSettings_api_request,
                        scriptId=SCRIPT_DEPLOYMENT_ID).execute()

                response_item = response.get('response', {})
                script_function_return = response_item.get('result', {})
                s_errors = script_function_return.get('errors', [])
                s_data = script_function_return.get('data', {})

                # Check for Apps Script API-level errors
                if 'error' in response:
                    print('**************** E (1) *****************')
                    ## The API executed, but the script returned an error.
                    api_call_error = response['error']['details'][0]
                    http_response_err_msg = 'Google API call error: ' + str(api_call_error['errorMessage'])
                    return HttpResponse(http_response_err_msg, status=500, content_type="application/json")

                # Check for Apps Script core app-level errors (1)
                elif len(s_errors[0]['non_existing_properties']):
                    print('**************** E (2) *****************')
                    appsscript_err_msg = "[Apps Script] Trying to set non existing Script user property(ies): " + ", ".join(s_errors[0]['non_existing_properties'])
                    return HttpResponse(appsscript_err_msg, status=422, content_type="application/json")

                # Check for Apps Script core app-level errors (2)
                elif len(s_errors) > 1:
                    print('**************** E (3) *****************')
                    return HttpResponse("[Apps Script] " + s_errors[1], status=422, content_type="application/json")

                elif not s_data:
                    print('**************** F (1) *****************')
                    print(script_function_return)
                    return HttpResponse("API call returned empty data object.", status=400, content_type="application/json")

                else:
                    print('**************** F (2) *****************')
                    return HttpResponse(json.dumps(script_function_return), content_type="application/json")
            
            # Check (handle) HTTP request-level errors
            except errors.HttpError as e:
                print('**************** G *****************')
                # The API encountered a problem before the script started executing.
                http_response_err_msg = 'Google API call error: ' + e.content
                return HttpResponse(http_response_err_msg, status=500, content_type="application/json")

        # Process invalid form data errors,
        # handled by Django Forms before calling the Apps Script API
        else:
            print('**************** H *****************')
            return HttpResponse(json.dumps(dict(form.errors)), status=422, content_type="application/json")
    
    # Redirect to home page if the HTTP request is not a valid AJAX form submit
    else:
        print('**************** I *****************')
        return redirect('/')


def login(request):
    user = request.session.get('user')

    if user :
        # If user is already logged in, redirect to home page.
        messages = request.session.get('messages', {})
        messages.setdefault('warning', []).append({'usr_msg': 'User already logged in. Redirected to home page.', 'sys_msg': ''})
        request.session['messages'] = messages
        return redirect('/')
    else:
        # Get the authorization URL and redirect to it.
        auth_url, _ = flow.authorization_url(prompt='consent')
        return redirect(auth_url)


def auth(request):
    messages = request.session.get('messages', {})

    try:
        code = request.GET.get('code','')
        flow.fetch_token(code=code)

        json_creds = flow.credentials.to_json()
        dict_creds = json.loads(json_creds)

    except Exception as e:
        messages.setdefault('errors', []).append({'usr_msg': 'Error occured. Redirected to home page.', 'sys_msg': str(e)})
        request.session['messages'] = messages
        return redirect('/')

    request.session['token'] = dict_creds
    request.session['user'] = id_token.verify_oauth2_token(flow.credentials.id_token, Request())

    messages.setdefault('info', []).append({'usr_msg': 'User successfully logged in.', 'sys_msg': ''})
    request.session['messages'] = messages

    return redirect('/')


def logout_view(request):
    logout(request)
    return redirect('/')
