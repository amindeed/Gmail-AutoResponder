# Gmail AutoResponder

**Gmail AutoResponder** is a full-stack web application for automated email processing.


## Table of Contents

- [1. App Architecture](#1-app-architecture)
  - [1.1. Backend – Core: *Google Apps Script*](#11-backend--core-google-apps-script)
  	- [1.1.1. App Settings](#111-app-settings)
  	- [1.1.2. Execution](#112-execution)
  	- [1.1.3. Logging](#113-logging)
  - [1.2. Backend – Middleware: *Django*](#12-backend--middleware-django)
  - [1.3. Frontend: *Django templates + {CSS framework}*](#13-frontend-django-templates--css-framework)
- [2. Setup and Run](#2-setup-and-run)
  - [2.1. Provision *(Mostly manual)*](#21-provision-mostly-manual)
    - [*Requirements*](#provision-req)
    - [*Step 1: Create and configure a GCP Project*](#provision-step1)
    - [*Step 2: Create and configure a Apps Script Project*](#provision-step2)
  - [2.2. Configure *(Automated)*](#22-configure-automated)
  - [2.3. Continuous Deployment (CD)](#23-continuous-deployment-cd)
- [3. Background](#3-background)
- [4. License](#4-license)


## 1. App Architecture

<p align="center">
  <img src="/Gmail-AutoResponder-AppArch.png" alt="App Architecture"/>
  <!-- <img src="https://raw.githubusercontent.com/amindeed/Gmail-AutoResponder/master/Gmail-AutoResponder-AppArch.png" alt="App Architecture"/> -->
</p>

### 1.1. Backend – Core: *Google Apps Script*

<br /><img src="/assets/apps-script--logo.png" alt="apps-script--logo.png" height="80"/><br />

The **Core** App is a [Google Apps Script](https://script.google.com) app deployed as an [API executable](https://developers.google.com/apps-script/api/how-tos/execute#step_2_deploy_the_script_as_an_api_executable), and managed through the [Apps Script API](https://developers.google.com/apps-script/api/how-tos/execute) using the [Python client library](https://github.com/googleapis/google-api-python-client).

#### 1.1.1. App Settings

**App settings** are managed as [Apps Script User Properties](https://developers.google.com/apps-script/reference/properties/properties-service#getUserProperties()), and so are all [stored as strings in key-value pairs](https://developers.google.com/apps-script/guides/properties#data_format).   
Properties types here are only indicative, and often refer to their corresponding Django Forms Field classes in the **Middleware** App:

| Property             | Description                                                                                                                                           |
|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`IS_GSUITE_USER`** | `Boolean`                                                                                                                                            |
| **`enableApp`**      | `Boolean`. *(**default:** `'false'`)*                                                                                                                |
| **`coreAppEditUrl`** | `String`. Edit URL of the Apps Script project.                                                                                                        |
| **`filters`**        | `JSON string`; Message content filters.<br><br>***default:***<br><pre>{<br>    "rawContent": [<br>        'report-type=disposition-notification', // Read receipts<br>        'Content-Type: multipart/report', // Automatic delivery reports<br>        'report-type=delivery-status', // Automatic delivery reports<br>        'Content-Type: message/delivery-status' // Automatic delivery reports<br>    ],<br>    "from": [<br>        '(^&verbar;<)((mailer-daemon&verbar;postmaster)@.*)',<br>        'noreply&verbar;no-reply&verbar;do-not-reply',<br>        '.+@.*\\bgoogle\\.com',<br>        Session.getActiveUser().getEmail()<br>    ],<br>    "to": [<br>        'undisclosed-recipients' // Potential spams<br>    ]<br>}</pre>                                                                                                               |
| **`logger`**         | `JSON string`. `identifiers` property of an `AppLogger` class (a child class of [`BaseLogger`](/app/core/BaseLogger.js)) instance.<br><br>Example:<br><pre>{<br>	"id": "ABCDEF",<br>	"viewUri": "https://www.xxxx.yy/ABCDEF?view",<br>	"updateUri": "https://www.xxxx.yy/ABCDEF?update"<br>}</pre>                    |
| **`timeinterval`**   | `Integer`. *(**default:** `10`)*                                                                                                                     |
| **`starthour`**      | `Integer`. *(**default:** `17`)*                                                                                                                     |
| **`finishhour`**     | `Integer`. *(**default:** `8`)*                                                                                                                      |
| **`utcoffset`**      | `Integer`. *(**default:** `0`)*                                                                                                                      |
| **`ccemailadr`**     | `String`, one or a [RFC-compliant](https://tools.ietf.org/html/rfc2822#section-3.4.1) comma-separated list of email addresses. <br>***default:** `''`* |
| **`bccemailadr`**    | `String`, one or a [RFC-compliant](https://tools.ietf.org/html/rfc2822#section-3.4.1) comma-separated list of email addresses. <br>***default:** `''`* |
| **`noreply`**        | `Boolean`; whether or not to reply with a `noreply@` email address. <br>***default:** `0` if `IS_GSUITE_USER` === `'true'`, `2` otherwise*.             |
| **`msgbody`**        | `String`; Response message body in HTML format. <br>***default:** `getDefaultMessageBody()` function return value*.                                     |
| **`testEmail`**     | `String`. *(**default:** `null` or `''`)* <br><br>If set to a valid email address, `enableApp`, `starthour` and `finishhour` will be ignored, and a test message to that address will be sent in response to any received “non-filterable-out” email. <br>Deleting the property or setting it to `''` (or any other non-valid email value) will switch the application from its ***“Test Mode”***.  |


#### 1.1.2. Execution

When the **Core** App is enabled (i.e. `enableApp === 'true'`), `main()` function of the main script `main.js` will be continuously executed (triggered) on a recurring interval of `timeinterval` (+`2`) minutes from (`starthour` + `utcoffset`) to (`finishhour` + `utcoffset`).  
On each execution, which we'll refer to as **_Execution n_**, the function issues a [Gmail search query](https://developers.google.com/apps-script/reference/gmail/gmail-app#search%28String%29) to fetch last received messages. The search query returns an array of [Gmail threads](https://developers.google.com/apps-script/reference/gmail/gmail-thread) that were updated in the last `timeinterval` (+`2`) minutes. The last [message](https://developers.google.com/apps-script/reference/gmail/gmail-message) of each of these threads is extracted and processed, i.e. it would either be responded to or skipped if it matches one of the exclusion filters in the `filters` property.   
A **_Session_** is a series of [triggered executions](https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers) within a 24 hours span (e.g. from __05-Sep-2018 @7:00pm__ to __06-Sep-2018 @7:00am__).
   
In order to neither miss a message nor send an automated response more than once :
1. Although **_Execution (n-1)_** would normally have occurred `timeinterval` minutes ago, received messages are fetched from the last (`timeinterval` + `2`) minutes, in order not to miss any messages in case of a delay.
2. **[IDs](https://developers.google.com/apps-script/reference/gmail/gmail-message#getId%28%29)** of processed messages from **_Execution (n-1)_** are [cached](https://developers.google.com/apps-script/reference/cache/cache#put%28String%2CString%2CInteger%29) with a (`timeinterval` + `6`) minutes timeout. During **_Execution n_**, IDs of retrieved messages are checked against this cache to determine whether they were already processed or not.

#### 1.1.3. Logging

On each execution, the following information are logged to the `AppLogger` class instance, which is constructed from an `identifiers` JSON object generated by parsing the `logger` Script property:
- **`PROCESSED`:** Metadata of both messages responded to and those skipped (filtered out) : 
  - _Label_ (`REP_SENT` or `SKIPPED`), 
  - _Date/time Sent (Original Message)_, 
  - _Date/time Sent (Response)_ (when applicable), 
  - _Message ID_, 
  - _Thread ID_, 
  - _From_, 
  - _Subject_, 
  - _Applied filter_ (if the message was skipped).
- **`EXECUTIONS`:** The Gmail search query, along with the execution time and the number of threads returned (i.e. number of search results).
     
The default logger is a **[Google Spreadsheet](/app/core/GSpreadsheetLogger.js)**, but it is fairly easy to extend the **[`BaseLogger`](/app/core/BaseLogger.js)** class to create other logging targets as long as the following points are considered :
- The database has a REST API.
- Possibility to connect with Read/Write permissions to an existing instance (database), or create a new one if required.
- Possibility to create two ***data collections***: PROCESSED and EXECUTIONS (e.g.: `GSpreadsheets`: *sheets*, `SQL`: *tables*, `DocumentDB`: *collections*), each with the specified ***data fields*** (e.g.: `GSpreadsheets`: *columns/header*, `SQL`: *columns*, `DocumentDB`: *fields*).
- Logs would then be stored as single entries or 2D datasets (e.g.: `GSpreadsheets`: *rows*, `SQL`: *records*, `DocumentDB`: *documents*).

### 1.2. Backend – Middleware: *Django*

<br /><img src="/assets/django-logo.png" alt="django--logo.png" height="90"/><br />

The **Middleware** backend component requires the [Core app ID](#coreappid), and the [Client ID credentials](https://support.google.com/cloud/answer/6158849) file ([`credentials.json`](/app/backend/python/credentials_template.json)) of the associated GCP project.

It is a Django app providing the following features:
- **Authentication:** User sign-in through a full OAuth2 authentication flow.
- **Sessions:** Based on [Django Sessions](https://docs.djangoproject.com/en/3.1/topics/http/sessions/#using-sessions-in-views), allow users (identified by their parsed OIDC tokens) to access the webapp independently from any active Google account in the browser. No user data is kept after logout.
- **API Gateway:** Aggregates calls to the **Core** app by providing API endpoints to *initialize*, *retrieve* and *update* app settings. This enables the development of client-side apps, which typically use the [OAuth2 consent flow](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow) for [installed applications](https://developers.google.com/identity/protocols/oauth2/native-app) and store both *access* and *refresh tokens*. The **Middleware** app here acts as a proxy, by checking HTTP Authorization headers for bearer tokens and translating requests and responses between the custom client and the **Core** app.
- **Data validation:** Form data (App settings) validation and multi-level error handling: *HTTP request, [Django Forms API](https://docs.djangoproject.com/en/3.1/ref/forms/api/#using-forms-to-validate-data) data validation, Apps Script API and **Core** App errors*.
- **Handling App URLs:** mapping between *features*, *URLs* and *views*: *Home page*, *Login*, *Authentication* *(OAuth2 [authorized redirect URI](https://developers.google.com/identity/protocols/oauth2/web-server#creatingcred))*, *API Gateway endpoint URLs*, *Getting/Updating App settings*, *App reset* and *Logout*.


### 1.3. Frontend: *Django templates + {CSS framework}*

<br /><img src="/assets/frontend--logos.png" alt="frontend--logos.png" height="100"/><br />

The **Frontend** part is basically a Django template providing access to all needed features: Logged-in user information on top of a form to view and update [App Settings](#111-app-settings), along with ***Logout*** and App ***Enable/Disable/Reset*** commands.


## 2. Setup and Run
### 2.1. Provision *(Mostly manual)*

<br>

> ℹ Had it not been for `clasp` and `gcloud` command line tools [limitations](worklog.md#2020-04-13-update-2021-03-27), this stage would have been fully automatable.

<br>

| <a name="provision-req">Requirements :</a> |
| :------------- |
| <ul><li>[`git`](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)</li><li>[`Python 3`](https://wiki.python.org/moin/BeginnersGuide/Download) (and [`paramiko`](http://www.paramiko.org/installing.html))</li><li>[`Node.js`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-installer-to-install-nodejs-and-npm) and [`clasp`](https://www.npmjs.com/package/@google/clasp#install)</li><li>Google account</li><li>Linux (CEntOS 7) server with root/sudo access, manageable through SSH</li></ul>|

- <a name="provision-step1">**Step 1:** [Create](https://cloud.google.com/resource-manager/docs/creating-managing-projects#creating_a_project) and configure a Google Cloud Platform (GCP) Project:</a>
	- Enable required [Google APIs](https://cloud.google.com/service-usage/docs/enable-disable): 
    	- `Apps Script API`
    	- `Google Drive API`
    	- `Gmail API`
    	- `Google Sheets API`
	- [Configure](https://support.google.com/cloud/answer/6158849?ref_topic=3473162#userconsent) the OAuth Consent Screen: 
		- Set [OAuth2 scopes](https://developers.google.com/identity/protocols/oauth2/scopes):
			- `openid`
			- `https://www.googleapis.com/auth/script.scriptapp`
			- `https://mail.google.com/`
			- `https://www.googleapis.com/auth/drive`
			- `https://www.googleapis.com/auth/userinfo.email`
			- `https://www.googleapis.com/auth/spreadsheets`
			- `https://www.googleapis.com/auth/userinfo.profile`
	- Get the [Project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects).
	- [Create OAuth credentials](https://developers.google.com/apps-script/guides/cloud-platform-projects#creating_oauth_credentials): 
    	- Create **OAuth client ID** credentials for a **Web Application**.
		- Set **`Redirect URIs`**: `http://127.0.0.1:8000/auth/` *(local, development)*, `{APP_BASE_URL}/auth/` *(staging, production)*.
		- Download the JSON file containing the *client ID* and *client secret* and save it as [`credentials.json`](/app/backend/python/credentials_template.json).

- <a name="provision-step2">**Step 2:** Create a Google Apps Script Project:</a>

	- Enable Google Apps Script API, from the [Apps Script dashboard](https://script.google.com/home/usersettings).
	- Create a API Executable Apps Script project and push Core app code to it:

		```bash
		mkdir ./gmail-autoresponder && cd ./gmail-autoresponder/
		git clone git@github.com:amindeed/Gmail-AutoResponder.git .
		cd app/core
		clasp login
		# Default (global) credentials will be saved to: ~/.clasprc.json
		# N.B. If that didn't work, use the '--no-localhost' option, 
		# visit the provided URL, grant `clasp` required permissions, 
		# and copy/paste the code from the next web page. 
		clasp create --type api --title "Gmail AutoResponder"
		clasp push --force
		```

	- Switch Apps Script project's Google Cloud Project association to the standard (user-managed) project created in ***Step 1***, by [providing its number](https://developers.google.com/apps-script/guides/cloud-platform-projects#switching_to_a_different_standard_gcp_project).
	- ~~Deploy as an API Executable Google Apps Script project~~

### 2.2. Configure *(Automated)*

- **Requirements:** `Ansible` (control node), `Python`/`Bash` scripting capability.
- **Tasks to be automated:**
  - Install and configure on the CEntOS server: `NGINX`, `uWSGI`, `certbot`.

### 2.3. Continuous Deployment (CD)

Three deployment modes are supported:

|                             | 💻 Development               | 🧪 Staging                       | 🏭 Production                    |
|-----------------------------|---------------------------|-------------------------------|-------------------------------|
| **User <sup>[[1]](#user)</sup>** | Apps Script project owner                     | Any allowed Google user               | Any allowed Google user               |
| **devMode <sup>[[2]](#devmode)</sup>**                     | True                      | False                         | False                         |
| **Versioned deployment <sup>[[3]](#versioneddeploy)</sup>** | No                   | Yes                        | Yes                |
| **Core app ID <sup>[[4]](#coreappid)</sup>** | Script ID                   | Deployment ID                        | Deployment ID                |
| **HTTP Server <sup>[[5]](#httpsvr)</sup>**                 | Django Development Server | `NGinx` + `uWSGI` + `certbot` | `NGinx` + `uWSGI` + `certbot` |
| **Test Mode <sup>[[6]](#testmode)</sup>**               | –                         | Yes                           | No                            |

<br>

<a name="user">[1]</a> **User:** The Google account the Apps Script (Core) app is run as.

<a name="devmode">[2]</a> **devMode:** Boolean value of the HTTP Request body field [`devMode`](https://developers.google.com/apps-script/api/reference/rest/v1/scripts/run#request-body), of the Apps Script API method [`scripts.run`](https://developers.google.com/apps-script/api/reference/rest/v1/scripts/run). `False` implies a [*versioned deployment*](https://developers.google.com/apps-script/concepts/deployments#versioned_deployments), while `True` lets the Core app [run at the latest version](https://developers.google.com/apps-script/api/how-tos/execute#the_scriptsrun_method) of the Apps Script project code. 
<br>*(Defined in [`script_run_parameters.py`](/app/backend/python/script_run_parameters_example.py))*

<a name="versioneddeploy">[3]</a> **Versioned deployment:** whether to create a *versioned deployment* of the Apps Script (Core) app, i.e. a version deployed for use with the Apps Script API. In that case, a [*Deployment ID*](https://developers.google.com/apps-script/concepts/deployments#find_a_deployment_id) is used as the Core app ID, instead of the [*Script ID*](https://developers.google.com/apps-script/reference/script/script-app#getScriptId()).

<a name="coreappid">[4]</a> **Core app ID:** [*Deployment ID*](https://developers.google.com/apps-script/concepts/deployments#find_a_deployment_id) for versioned deployments, or [*Script ID*](https://developers.google.com/apps-script/reference/script/script-app#getScriptId()) when `devMode` is set to `True`. 
<br>*(Defined in [`script_run_parameters.py`](/app/backend/python/script_run_parameters_example.py))*

<a name="httpsvr">[5]</a> **HTTP Server:** HTTP server used to run the Django project (Middleware app): either the [Django built-in development server](https://docs.djangoproject.com/en/3.1/intro/tutorial01/#the-development-server), or the {`NGinx` + `uWSGI` + `certbot`} software suite to provide *HTTP server*, *Reverse proxy* and *HTTPS* functionalities.

<a name="testmode">[6]</a> **Test Mode:** The app is set to *“Test Mode”* by calling the `initSettings()` function with a valid test email address parameter, e.g. `initSettings(true, 'testadress@mydomain.com')`, which would set the Apps Script user property `testEmail` to `testadress@mydomain.com`.

<br>

```bash
# Stop any running Django App
cd ./gmail-autoresponder/
git pull origin master
cd app/core
clasp push --force
# Set `TIMEZONE`, `AppLogger` class name
# Deploy using clasp
# Get Deployment ID --> ../backend/python/script_deployment_id.py
# Launch Django App
```


## 3. Background

I [started](worklog.md#2017-07-26-code) **Gmail AutoResponder** back in 2017 as a script to manage automatic email responses outside the active hours of a company I worked for.   
Although it was possible to set Gmail to individually send [canned responses](https://support.google.com/mail/thread/14877273?hl=en&msgid=14879088), I could neither make time-specific filters nor programmatically make Gmail trigger an event upon email reception. So, inspired by an [answer](https://webapps.stackexchange.com/a/90089) on one of StackExchange forums, I had to figure out a way around and ultimately ended up with a [basic Apps Script app](https://github.com/amindeed/Gmail-AutoResponder/tree/796a6d84f1e7287b8a936083ae8f507035a28215/app), 6 instances of which have amazingly run for almost 3 years and processed more than 17k messages!  
  
To see how the project progressed, check [`worklog.md`](worklog.md).


## 4. License

This software is under the [MIT license](LICENSE).
