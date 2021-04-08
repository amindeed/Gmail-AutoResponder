# Gmail AutoResponder

[![GitHub last commit](https://img.shields.io/github/last-commit/amindeed/Gmail-AutoResponder?logo=git&logoColor=ffffff)](https://github.com/amindeed/Gmail-AutoResponder)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/amindeed/Gmail-AutoResponder?logo=github)](https://github.com/amindeed/Gmail-AutoResponder/commits/master)
[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-ES6-orange?logo=v8&logoColor=ffffff)](https://developers.google.com/apps-script/guides/v8-runtime)
[![Django](https://img.shields.io/badge/Django-v3.1.5-yellowgreen?logo=django)](https://docs.djangoproject.com/en/3.1/releases/3.1.5/)
[![License](https://img.shields.io/github/license/amindeed/Gmail-AutoResponder?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAYCAYAAAD3Va0xAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAB3RJTUUH5QMcESAcS1MDzAAAAj1JREFUOMuVlDtoVFEQhr+zu0pik0C6YLQwIDaJjRY2aSyNj9ikkaC1QhAjFkI0YhWrgCJ2SnwgiqAiNhaiVnY+IqTQ+AoWSrLiIyZmPwvnLtc12dWBwz13Zs7MPzP/OYkQNdsWgFWx7wDGgATsB96F/htQSSmRP1SVMFwDnsWaAGaAT8CL0D0FzqeU8slJ2U8YdgI3gBFA4AnwCqgAnUAXsACcALamlO6p5JGh7lC/qhfUfvW5v2VGnY39hLpHPad+UbdX26KiXg/Hy+qB2I+rzblETZFEdUi9GvtbmUOz+lo9pvaFcXd+CPleqL3hs00dVstqIQs0pR5RJ9VxlpEsYJT2Mc7MZIHWRYZ98W2hgagd4Tsc366sP3fVjepsDafqoVpUe9RH6pUC0A5MAStjtP8qi0AJeAm0o3YHvH7rQfkTVWtueqo9BWASeANsAKbVk8uVl9MdBD4DLcAs8LAQDBb4EPdqSF1fewUyBqurgaPAcWA6zBXUknpH/a7uVS+pc+qA2lpTzoD6M4g7EOy+n89WDMOiOqYORu1z6nSsudAdVkfVSiQuEc9DHvYgMAr0Ak1AT0wnAUXgAVAGbgKHUkpn/rq0OXTZZZ1Xf6hn1dOBaCFsjxuNNUO4Kco8pb5V36sjUU5n3rcRa7sj+1q1JVZbBFqzFD2WeiGrvQOKKaVySqkcParaavtSakDiiloAVgTXlpVCHVsCtgDzManN9QLVQ1QELgYdEnCb/5V4o+bVvpxuV7C6bakzvwBluHvhBl+OCQAAAABJRU5ErkJggg==)](/LICENSE)

**Gmail AutoResponder** is a full-stack web application for automated email processing.


## Table of Contents

- [1. App Architecture](#1-app-architecture)
  - [1.1. Backend – Core: *Google Apps Script*](#11-backend--core-google-apps-script)
  	- [1.1.1. App Settings](#111-app-settings)
  	- [1.1.2. Execution](#112-execution)
  	- [1.1.3. Logging](#113-logging)
  - [1.2. Backend – Middleware: *Django*](#12-backend--middleware-django)
  - [1.3. Frontend](#13-frontend)
- [2. Setup](#2-setup)
  - [2.1. Provision](#21-provision)
  - [2.2. Configure](#22-configure)
  - [2.3. Deploy](#23-deploy)
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

| `PROCESSED`        | `EXECUTIONS`          |
| ------------------ |---------------------|
| Metadata of both messages responded to and those skipped (filtered out) :<br><br><ul><li>_Label_ (`REP_SENT` or `SKIPPED`), </li><li>_Date/time Sent (Original Message)_, </li><li>_Date/time Sent (Response)_ (when applicable), </li><li>_Message ID_, </li><li>_Thread ID_, </li><li>_From_, </li><li>_Subject_, </li><li>_Applied filter_ (if the message was skipped).</li></ul>           | <ul><li>Gmail search query.</li><li>Execution time.</li><li>Number of threads returned (i.e. number of search results).</li></ul>       |
     
The default logger is a **[Google Spreadsheet](/app/core/GSpreadsheetLogger.js)**, but it is fairly easy to extend the **[`BaseLogger`](/app/core/BaseLogger.js)** class to create other logging targets as long as the following points are considered :
- The database has a REST API.
- Possibility to connect with Read/Write permissions to an existing instance (database), or create a new one if required.
- Possibility to create two ***data collections***: PROCESSED and EXECUTIONS (e.g.: `GSpreadsheets`: *sheets*, `SQL`: *tables*, `DocumentDB`: *collections*), each with the specified ***data fields*** (e.g.: `GSpreadsheets`: *columns/header*, `SQL`: *columns*, `DocumentDB`: *fields*).
- Logs would then be stored as single entries or 2D datasets (e.g.: `GSpreadsheets`: *rows*, `SQL`: *records*, `DocumentDB`: *documents*).

### 1.2. Backend – Middleware: *Django*

<br /><img src="/assets/django-logo.png" alt="django--logo.png" height="90"/><br />

The **Middleware** backend component requires the [Core app ID](#versioneddeploy), and the [Client ID credentials](https://support.google.com/cloud/answer/6158849) file ([`credentials.json`](/app/backend/python/credentials_template.json)) of the associated GCP project.

It is a Django app providing the following features:
- **Authentication:** User sign-in through a full OAuth2 authentication flow.
- **Sessions:** Based on [Django Sessions](https://docs.djangoproject.com/en/3.1/topics/http/sessions/#using-sessions-in-views), allow users (identified by their parsed OIDC tokens) to access the webapp independently from any active Google account in the browser. No user data is kept after logout.
- **API Gateway:** Aggregates calls to the **Core** app by providing API endpoints to *initialize*, *retrieve* and *update* app settings. This enables the development of client-side apps, which typically use the [OAuth2 consent flow](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow) for [installed applications](https://developers.google.com/identity/protocols/oauth2/native-app) and store both *access* and *refresh tokens*. The **Middleware** app here acts as a proxy, by checking HTTP Authorization headers for bearer tokens and translating requests and responses between the custom client and the **Core** app.
- **Data validation:** Form data (App settings) validation and multi-level error handling: *HTTP request, [Django Forms API](https://docs.djangoproject.com/en/3.1/ref/forms/api/#using-forms-to-validate-data) data validation, Apps Script API and **Core** App errors*.
- **Handling App URLs:** mapping between *features*, *URLs* and *views*: *Home page*, *Login*, *Authentication* *(OAuth2 [authorized redirect URI](https://developers.google.com/identity/protocols/oauth2/web-server#creatingcred))*, *API Gateway endpoint URLs*, *Getting/Updating App settings*, *App reset* and *Logout*.


### 1.3. Frontend

<br /><img src="/assets/frontend--logos.png" alt="frontend--logos.png" height="100"/><br />

*Django templates + {CSS framework}.*

The **Frontend** part is basically a Django template providing access to all needed features: Logged-in user information on top of a form to view and update [App Settings](#111-app-settings), along with ***Logout*** and App ***Enable/Disable/Reset*** commands.


## 2. Setup

<a href="https://asciinema.org/a/9mZzpFW7Ie86P2kGTbKct9vbT" target="_top"><img align="right" width="202" height="130" alt="Asciinema: Gmail AutoResponder - Dev/Test Deployment" src="/assets/asciinema_setup_centos7.png"></a>

- ***Notes:***
    - *This section is still being actively worked on. You can meanwhile check [`setup_centos7.sh`](/setup_centos7.sh) with a [sample output](/setup_centos7_output.html), and this [asciicast](https://asciinema.org/a/9mZzpFW7Ie86P2kGTbKct9vbT).*
	- *Had it not been for `clasp` and `gcloud` command line tools [limitations](worklog.md#2020-04-13-update-2021-04-04), most (if not all) of the tasks would have been fully automatable.*

### 2.1. Provision

Install software requirements and configure ***development***, ***test*** and ***deployment*** environments:

- **Development machine:** Git, Python3, a modern and updated web browser, text editor/IDE, SSH client, virtualization software *(optional, but recommended)*, and—when required—remote access (typically through a web interface) to a CI/CD server.

- **Control Machine** or **Deployment Server**: A dedicated host with SSH service installed and configured; typically with a configuration management software like Ansible, and—if need be—a CI/CD software or service, like Jenkins and GitHub Actions.

- **Target Server:** Install dependencies and make required configurations:
    - Install system-wide software requirements, generally: `git`, `curl`, `jq`, `clasp`, `nginx`, `certbot`, `python3` and `uwsgi`.
    - [Setup](https://cloud.google.com/resource-manager/docs/creating-managing-projects#creating_a_project) a Google Cloud Platform (GCP) Project:
        - Note the [Project Number](https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects)
        - Enable required Google [APIs](https://cloud.google.com/service-usage/docs/enable-disable): `Apps Script API`, `Google Drive API`, `Gmail API`, `Google Sheets API`.
        - [Configure](https://support.google.com/cloud/answer/6158849?ref_topic=3473162#userconsent) OAuth consent screen: 
            - Add [scopes](https://developers.google.com/identity/protocols/oauth2/scopes):

                ```
                openid
                https://www.googleapis.com/auth/script.scriptapp
                https://mail.google.com/
                https://www.googleapis.com/auth/drive
                https://www.googleapis.com/auth/userinfo.email
                https://www.googleapis.com/auth/spreadsheets
                https://www.googleapis.com/auth/userinfo.profile
                ```

            - [Create](https://developers.google.com/apps-script/guides/cloud-platform-projects#creating_oauth_credentials) a OAuth2 Client ID for a web application. Set redirect URIs, depending on the deployment stage. Get [credentials JSON file](/app/backend/python/credentials_template.json).
    - Configure Google Apps Script:
        - Enable Google Apps Script API (from the [Apps Script dashboard](https://script.google.com/home/usersettings)).
        - [Authorize](https://github.com/google/clasp#login) `clasp` command line tool.
        - [Create](https://github.com/google/clasp#create) a new Apps Script project to be deployed as an *API Executable*.
        - [Switch](https://developers.google.com/apps-script/guides/cloud-platform-projects#switching_to_a_different_standard_gcp_project) Apps Script's Google Cloud Project association from the default project to the standard (user-managed) project already created.

### 2.2. Configure

Install app dependencies and make a base deployment of the backend:
- [Push](https://github.com/google/clasp#push) and [deploy](https://github.com/google/clasp#deploy) **Core** app code (`/app/core` content) to the newly created Apps Script project.
- Create and configure a Django app:
    - Install Python3 requirements (`/app/middleware/requirements.txt`) in a virtual environment.
    - Apply all migrations (`python manage.py migrate`)
- Configure NGINX, uWSGI and Certbot (for *Staging* and *Production* deployments).

### 2.3. Deploy

**Continuous Deployment (CD):** *versioned* for the ***Core*** and *incremental* for the ***Middleware***.

There are three deployments stages:

| `Parameters`                  | 💻 Development           | 🧪 Staging                       | 🏭 Production                    |
|-----------------------------|---------------------------|-------------------------------|-------------------------------|
| **User <sup>[[1]](#user)</sup>** | Apps Script project owner                     | Any allowed Google user               | Any allowed Google user               |
| **devMode <sup>[[2]](#devmode)</sup>**                     | True                      | False                         | False                         |
| **Versioned deployment <sup>[[3]](#versioneddeploy)</sup>** | No<br>(use `SCRIPT_ID`) | Yes<br>(use `DEPLOYMENT_ID`) | Yes<br>(use `DEPLOYMENT_ID`) |
| **HTTP Server <sup>[[4]](#httpsvr)</sup>**                 | Django Development Server | `NGinx` + `uWSGI` <br>+ `certbot` (specifically for public cloud deployments) | `NGinx` + `uWSGI` + `certbot` |
| **Test Mode <sup>[[5]](#testmode)</sup>**               | –                         | Yes                           | No                            |
| **Hosts <sup>[[6]](#hosts)</sup>** | `localhost`, `127.0.0.1`      | **- LAN:** hostnames or private IP addresses of external hosts.<br>**- Internet:** [sub]domain names or public IP addresses, ideally with HTTP Basic Auth. | [sub]domain name or public IP address |
| **Debug & Log <sup>[[7]](#debug-log)</sup>** | Yes      | *OK*			  | No [`DEBUG`](https://docs.djangoproject.com/en/3.1/ref/settings/#std:setting-DEBUG) mode |

<br>

<a name="user">[1]</a> **User:** The Google account the Apps Script (Core) app is run as. This is set through the value of the `access` key of the *API executable* configuration field ([`executionApi`](https://developers.google.com/apps-script/manifest#executionapi)) in Apps Script project manifest file [`appscript.json`](/app/core/appsscript.json).

<a name="devmode">[2]</a> **devMode:** Boolean value of the HTTP Request body field [`devMode`](https://developers.google.com/apps-script/api/reference/rest/v1/scripts/run#request-body), of the Apps Script API method [`scripts.run`](https://developers.google.com/apps-script/api/reference/rest/v1/scripts/run). `False` implies a [*versioned deployment*](https://developers.google.com/apps-script/concepts/deployments#versioned_deployments), while `True` lets the Core app [run at the latest version](https://developers.google.com/apps-script/api/how-tos/execute#the_scriptsrun_method) of the Apps Script project code. 
<br>*(Defined in [`script_run_parameters.py`](/app/backend/python/script_run_parameters_example.py))*

<a name="versioneddeploy">[3]</a> **Versioned deployment:** whether to create a *versioned deployment* of the Apps Script (Core) app. In that case, a [*Deployment ID*](https://developers.google.com/apps-script/concepts/deployments#find_a_deployment_id) is used as the *Core app ID (defined in [`script_run_parameters.py`](/app/backend/python/script_run_parameters_example.py) with the name `CORE_APP_ID`)*, instead of the [*Script ID*](https://developers.google.com/apps-script/reference/script/script-app#getScriptId()).

<a name="httpsvr">[4]</a> **HTTP Server:** HTTP server used to run the Django project (Middleware app): either the [Django built-in development server](https://docs.djangoproject.com/en/3.1/intro/tutorial01/#the-development-server), or the {`NGinx` + `uWSGI` + `certbot`} software suite to provide *HTTP server*, *Reverse proxy* and *HTTPS* functionalities.

<a name="testmode">[5]</a> **Test Mode:** The app is set to *“Test Mode”* by calling the `initSettings()` function with a valid test email address parameter, e.g. `initSettings(true, 'testadress@mydomain.com')`, which would set the Apps Script user property `testEmail` to `testadress@mydomain.com`.

<a name="hosts">[6]</a> **Hosts:** All IP addresses or/and hostnames/FQDNs of the GCP project's OAuth2 authorized redirect URIs, that should also be added to Django app's (Backend Middlware) [`ALLOWED_HOSTS`](https://docs.djangoproject.com/en/3.1/ref/settings/#allowed-hosts) list in [`project/settings.py`](/app/middleware/project/settings.py).

<a name="debug-log">[7]</a> **Debug & Log:** Whether to use Django's [debugging](https://docs.djangoproject.com/en/3.1/ref/settings/#std:setting-DEBUG) and [logging](https://docs.djangoproject.com/en/3.1/topics/logging/) capabilities.


## 3. Background

I [started](worklog.md#2017-07-26-code) **Gmail AutoResponder** back in 2017 as a script to manage automatic email responses outside the active hours of a company I worked for.   
Although it was possible to set Gmail to individually send [canned responses](https://support.google.com/mail/thread/14877273?hl=en&msgid=14879088), I could neither make time-specific filters nor programmatically make Gmail trigger an event upon email reception. So, inspired by an [answer](https://webapps.stackexchange.com/a/90089) on one of StackExchange forums, I had to figure out a way around and ultimately ended up with a [basic Apps Script app](https://github.com/amindeed/Gmail-AutoResponder/tree/796a6d84f1e7287b8a936083ae8f507035a28215/app), 6 instances of which have amazingly run for almost 3 years and processed more than 17k messages!  
  
To see how the project progressed, check [`worklog.md`](worklog.md).


## 4. License

This software is under the [MIT license](LICENSE).
