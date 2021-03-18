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
- [2. Setup](#2-setup)
- [3. Background](#3-background)
- [4. License](#4-license)


## 1. App Architecture

<p align="center">
  <img src="/Gmail-AutoResponder-AppArch.png" alt="App Architecture"/>
  <!-- <img src="https://raw.githubusercontent.com/amindeed/Gmail-AutoResponder/master/Gmail-AutoResponder-AppArch.png" alt="App Architecture"/> -->
</p>

### 1.1. Backend – Core: *Google Apps Script*

The **Core** App is a [Google Apps Script](https://script.google.com) app deployed as an [API executable](https://developers.google.com/apps-script/api/how-tos/execute#step_2_deploy_the_script_as_an_api_executable), and associated to a standard (user-managed) GCP project with the following [Google Services APIs](https://cloud.google.com/service-usage/docs/enable-disable) and [OAuth2 scopes](https://developers.google.com/identity/protocols/oauth2/scopes) enabled:
- **APIs:** `Apps Script API`, `Google Drive API`, `Gmail API` and `Google Sheets API`.
- **Scopes:**
  - `openid`, 
  - `https://www.googleapis.com/auth/script.scriptapp`, 
  - `https://mail.google.com/`, 
  - `https://www.googleapis.com/auth/drive`, 
  - `https://www.googleapis.com/auth/userinfo.email`, 
  - `https://www.googleapis.com/auth/spreadsheets`, 
  - `https://www.googleapis.com/auth/userinfo.profile`.


**Core** App is thus manageable with 3 functions: **`initSettings()`**, **`getSettings()`** and **`setSettings()`**, all run through the [Apps Script API](https://developers.google.com/apps-script/api/how-tos/execute) using the [Python client library](https://github.com/googleapis/google-api-python-client).

#### 1.1.1. App Settings

**App settings** are managed as [Apps Script User Properties](https://developers.google.com/apps-script/reference/properties/properties-service#getUserProperties()), and so are all [stored as strings in key-value pairs](https://developers.google.com/apps-script/guides/properties#data_format). Properties types here are only indicative, and often refer to their corresponding Django Forms Field classes in the **Middleware** App:

| Property             | Description                                                                                                                                           |
|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`IS_GSUITE_USER`** | `Boolean`.                                                                                                                                            |
| **`enableApp`**      | `Boolean`. *(**default:** `'false'`)*.                                                                                                                |
| **`coreAppEditUrl`** | `String`. Edit URL of the Apps Script project.                                                                                                        |
| **`filters`**        | `JSON string`; Message content filters.<br><br>***default:***<br><pre>{<br>    "rawContent": ["report-type=disposition-notification"],<br>    "from": [<br>        "(^&verbar;<)((mailer-daemon&verbar;postmaster)@.*)",<br>        "noreply&verbar;no-reply&verbar;do-not-reply",<br>        ".+@.*\\bgoogle\\.com",<br>        Session.getActiveUser().getEmail()<br>        ],<br>    "to": ["undisclosed-recipients"]<br>}<br></pre>                                                                                                               |
| **`logger`**         | `JSON string`. `identifiers` property of an `AppLogger` class (a child class of [`BaseLogger`](/app/core/BaseLogger.js)) instance.<br><br>Example:<br><pre>{<br>	"id": "ABCDEF",<br>	"viewUri": "https://www.xxxx.yy/ABCDEF?view",<br>	"updateUri": "https://www.xxxx.yy/ABCDEF?update"<br>}</pre>                    |
| **`timeinterval`**   | `Integer`. *(**default:** `10`)*.                                                                                                                     |
| **`starthour`**      | `Integer`. *(**default:** `17`)*.                                                                                                                     |
| **`finishhour`**     | `Integer`. *(**default:** `8`)*.                                                                                                                      |
| **`ccemailadr`**     | `String`, one or a [RFC-compliant](https://tools.ietf.org/html/rfc2822#section-3.4.1) comma-separated list of email addresses. <br>***default:** `''`*. |
| **`bccemailadr`**    | `String`, one or a [RFC-compliant](https://tools.ietf.org/html/rfc2822#section-3.4.1) comma-separated list of email addresses. <br>***default:** `''`*. |
| **`noreply`**        | `Boolean`; whether or not to reply with a `noreply@` email address. <br>***default:** `0` if `IS_GSUITE_USER` === `'true'`, `2` otherwise*.             |
| **`msgbody`**        | `String`; Response message body in HTML format. <br>***default:** `getDefaultMessageBody()` function return value*.                                     |


#### 1.1.2. Execution

When the **Core** App is enabled (i.e. `enableApp === 'true'`), `main()` function of the main script `main.js` will be continuously executed (triggered) on a recurring interval of `timeinterval` (+`2`) minutes from (`starthour` + `utcoffset`) to (`finishhour` + `utcoffset`). On each execution, which we'll refer to as **_Execution n_**, the function issues a [Gmail search query](https://developers.google.com/apps-script/reference/gmail/gmail-app#search%28String%29) to fetch last received messages.  
The search query returns an array of [Gmail threads](https://developers.google.com/apps-script/reference/gmail/gmail-thread) that were updated in the last `timeinterval` (+`2`) minutes. The last [message](https://developers.google.com/apps-script/reference/gmail/gmail-message) of each of these threads is extracted and processed, i.e. it would either be responded to or skipped if it matches one of the exclusion filters in the `filters` property.   
A **_Session_** is a series of [triggered executions](https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers) within a 24 hours span (e.g. from __05-Sep-2018 @7:00pm__ to __06-Sep-2018 @7:00am__).
   
In order to neither miss a message nor send an automated response more than once :
1. Although **_Execution (n-1)_** would normally have occurred `timeinterval` minutes ago, received messages are fetched from the last (`timeinterval` + `2`) minutes, in order not to miss any messages in case of a delay.
2. **[IDs](https://developers.google.com/apps-script/reference/gmail/gmail-message#getId%28%29)** of processed messages from **_Execution (n-1)_** are [cached with a (`timeinterval` + `6`) minutes timeout](https://developers.google.com/apps-script/reference/cache/cache#put%28String%2CString%2CInteger%29). During **_Execution n_**, IDs of retrieved messages are checked against this cache to determine whether they were already processed or not.

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
     
The default logger is a **[Google Spreadsheet](/app/core/GSpreadsheetLogger.js)**, but it is fairly easy to extend the **[`BaseLogger`]((/app/core/BaseLogger.js))** class to create other logging targets as long as the following points are considered :
- The database has a REST API.
- Possibility to connect with Read/Write permissions to an existing instance, or create a new one.
- Possibility to create two data collections: PROCESSED and EXECUTIONS (e.g.: `GSpreadsheets`: *sheets*, `SQL`: *tables*, `DocumentDB`: *collections*), each with the specified data fields (e.g.: `GSpreadsheets`: *columns/header*, `SQL`: *columns*, `DocumentDB`: *fields*).
- Logs would then be stored as single entries or 2D datasets (e.g.: `GSpreadsheets`: *rows*, `SQL`: *records*, `DocumentDB`: *documents*).

### 1.2. Backend – Middleware: *Django*

The **Middleware** backend component requires the [deployment ID](https://developers.google.com/apps-script/api/reference/rest/v1/projects.deployments) ([`script_deployment_id.py`](/app/backend/python/script_deployment_id_example.py)) of the **Core** App, and the [Client ID credentials](https://support.google.com/cloud/answer/6158849) file ([`credentials.json`](/app/backend/python/credentials_template.json)) of the associated GCP project.

It is a Django app providing the following features:
- **Authentication:** User sign-in through a full OAuth2 authentication flow.
- **Sessions:** Based on [Django Sessions](https://docs.djangoproject.com/en/3.1/topics/http/sessions/#using-sessions-in-views), allow users (identified by their parsed OIDC tokens) to access the webapp independently from any active Google account in the browser. No user data is kept after logout.
- **Data validation:** Form data (App settings) validation and multi-level error handling: *HTTP request, [Django Forms API](https://docs.djangoproject.com/en/3.1/ref/forms/api/#using-forms-to-validate-data) data validation, Apps Script API and **Core** App errors*.
- **App URLs handling:** mapping between *features*, *URLs* and *views*: *Home page*, *Login*, *Authentication* *(OAuth2 [authorized redirect URI](https://developers.google.com/identity/protocols/oauth2/web-server#creatingcred))*, *Getting App settings*, *Updating App settings*, *App reset* and *Logout*.


### 1.3. Frontend: *Django templates + {CSS framework}*

The **Frontend** part is basically a Django template providing access to all needed features: Logged-in user information on top of a form to view and update [App Settings](#111-app-settings), along with ***Logout*** and App ***Enable/Disable/Reset*** commands.


## 2. Setup

*Being revised. Coming soon.*


## 3. Background

I [started](https://github.com/amindeed/Gmail-AutoResponder/blob/master/worklog.md#2017-07-26-code) **Gmail AutoResponder** back in 2017 as a script to manage automatic email responses beyond the active hours of the company I worked for.   
Although it was possible to set Gmail to individually send [canned responses](https://support.google.com/mail/thread/14877273?hl=en&msgid=14879088), I could neither make time-specific filters nor programmatically make Gmail trigger an event upon email reception. So, inspired by an [answer](https://webapps.stackexchange.com/a/90089) on one of StackExchange forums, I had to figure out a way around and ultimately ended up with a [basic Apps Script app](https://github.com/amindeed/Gmail-AutoResponder/tree/796a6d84f1e7287b8a936083ae8f507035a28215/app), 6 instances of which have amazingly run for almost 3 years and processed more than 17k messages!  
  
To see how the project progressed, check [`worklog.md`](worklog.md).


## 4. License

This software is under the [MIT license](LICENSE).
