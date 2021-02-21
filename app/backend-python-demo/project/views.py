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
from app_configs import *


flow = Flow.from_client_secrets_file(
    'credentials.json',
    scopes=SCOPES,
    redirect_uri=REDIRECT_URI)

messages = {
    'errors': [],
    'warnings': [],
    'info': []
    }


def home(request):
    session_messages = request.session.pop('messages', None)
    user = request.session.get('user')
    return render(request, 'home.html', context={'user': user, 'messages': session_messages})
    

def get_settings(request):
    access_token = request.session.get('token')
    creds = Credentials.from_authorized_user_info(access_token)

    service = build('script', 'v1', credentials=creds)

    if request.method == "GET" and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        try:
            response = service.scripts().run(body=api_request,
                    scriptId=SCRIPT_DEPLOYMENT_ID).execute()

            if 'error' in response:
                error = response['error']['details'][0]
                print("Script error message: {0}".format(error['errorMessage']))

                if 'scriptStackTraceElements' in error:
                    print("Script error stacktrace:")
                    for trace in error['scriptStackTraceElements']:
                        print("\t{0}: {1}".format(trace['function'],
                            trace['lineNumber']))
            else:
                script_function_return = response['response'].get('result', {})

        except errors.HttpError as e:
            print(e.content)
            
        return HttpResponse(json.dumps(script_function_return), content_type="application/json")
    else:
        return redirect('/')


def update_settings(request):
    access_token = request.session.get('token')
    creds = Credentials.from_authorized_user_info(access_token)

    service = build('script', 'v1', credentials=creds)

    if request.method == "POST" and True:
        pass
    else:
        return redirect('/')


def check_user_session(request, **kwargs):
    user = request.session.get('user')
    access_token = request.session.get('token')
    creds = None
    return_object = {}

    if user:
        
        if access_token:
            creds = Credentials.from_authorized_user_info(access_token)

        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
                request.session['token'] = json.loads(creds.to_json())
            else:
                logout(request)
                return redirect('/')
        
        return_object.update({'crendetials': creds})

    return


def login(request):
    auth_url, _ = flow.authorization_url(prompt='consent')
    return redirect(auth_url)


def auth(request):
    try:
        code = request.GET.get('code','')
        flow.fetch_token(code=code)

        json_creds = flow.credentials.to_json()
        dict_creds = json.loads(json_creds)

    except Exception as e:
        messages['errors'].append(('Error occured. Redirected to home page.', str(e)))
        request.session['messages'] = messages
        return redirect('/') # should redirect

    request.session['token'] = dict_creds
    request.session['user'] = id_token.verify_oauth2_token(flow.credentials.id_token, Request())

    return redirect('/')


def logout_view(request):
    logout(request)
    return redirect('/')
