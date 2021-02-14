import json
from django.urls import reverse
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

def home(request):
    user = request.session.get('user')
    creds = None
    funcReturnVal = None
    return_json = None

    if user:
        
        if request.session.get('token'):
            creds = Credentials.from_authorized_user_info(request.session.get('token'))

        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
                request.session['token'] = json.loads(creds.to_json())
            else:
                logout(request)
                return render(request, 'home.html')

        service = build('script', 'v1', credentials=creds)

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
                funcReturnVal = response['response'].get('result', {})

        except errors.HttpError as e:
            # The API encountered a problem before the script started executing.
            print(e.content)

        return_json = json.dumps({'user': user, 'funcReturnVal': funcReturnVal, 'token_json': request.session.get('token')})

    return render(request, 'home.html', context={'user': user, 'return_json': return_json})


def login(request):
    auth_url, _ = flow.authorization_url(prompt='consent')
    return redirect(auth_url)


def auth(request):
    code = request.GET.get('code','')
    flow.fetch_token(code=code)

    json_creds = flow.credentials.to_json()
    dict_creds = json.loads(json_creds)
    request.session['token'] = dict_creds

    request.session['user'] = id_token.verify_oauth2_token(flow.credentials.id_token, Request())

    return redirect('/')


def logout_view(request):
    logout(request)
    return redirect('/')
