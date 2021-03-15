# Gmail AutoResponder

| ***ℹ This project is still under active, albeit slow, development. Check [`worklog.md`](worklog.md) for updates.*** |
| --------------------------------------------------------------------------------------------------------------------|


**Gmail AutoResponder** is a customizable webapp to send automated email responses. 

***Section to be revised:***
> All application components are contained in the Google Account running it : 
> - **[Apps Script](https://developers.google.com/apps-script/reference/)** serves as the core framework, 
> - Messages are read and sent from **Gmail**, 
> - and **Drive Sheets** are used to read content filters and save logs.
> 
> ## Setup
> 
> Using [`clasp`](https://github.com/google/clasp#install) command line tool :
> 
> ```bash
> git clone https://github.com/amindeed/Gmail-AutoResponder.git
> cd Gmail-AutoResponder/app/core
> clasp login
> clasp create --type webapp --title "Gmail AutoResponder Dev"
> # Copy the URL of the created Apps Script project
> clasp push --force
> # 1. Go to the Apps Script project URL
> # 2. Run the empty function `grantAccess()` ('grantAccess.gs')
> clasp deployments
> # 1. Copy the deployment ID of @HEAD (dev version with latest code). 
> # 2. Go to either :
> #  - G-Suite Account : https://script.google.com/a/{yourdomain.com}/macros/s/{Deployment-ID}/dev
> #  - Free Account : https://script.google.com/macros/s/{Deployment-ID}/dev
> ```


***Section being revised:***
> ## App Components
> ### 1. Core: *Google Apps Script*
> #### App Settings:
> 
> Managed as [Apps Script User Properties](https://developers.google.com/apps-script/reference/properties/properties-service#getUserProperties()):
> - **`appInitialized`**: `Random string`.
> - **`IS_GSUITE_USER`**: `Boolean`.
> - **`enableApp`**: `Boolean`. *(**default:** `'false'`)*.
> - **`filters`**: `JSON string`; Message content filters.
> 
>     ***default:***
>     ```
>     {
>         "rawContent": ['report-type=disposition-notification'],
>         "from": [
>             '(^|<)((mailer-daemon|postmaster)@.*)',
>             'noreply|no-reply|do-not-reply',
>             '.+@.*\\bgoogle\\.com',
>             Session.getActiveUser().getEmail()
>             ],
>         "to": ['undisclosed-recipients']
>     }
>     ```
> - **`logger`**: `JSON string`. *(**default:** auto-generated and initialized Google Spreadsheet)*.
> 
>     Example value (for a Google Spreadsheet):
>     ```jsonc
>     {
>         "type": "gspreadsheet",
>         "function": "logToGSheet", // To be evaluated as a function
>         "identifiers": 
>             {
>                 "id": "XXXX",
>                 "updateUri": "https://docs.google.com/spreadsheets/d/XXXX",
>                 "viewUri": "https://docs.google.com/spreadsheets/d/XXXX"
>                 // +Possibly: "authenticationScheme" / "credentials" ...
>             },
>         "dataCollections": [
>             // dataCollections[0] --> Processed messages
>             {
>                 "name": "PROCESSED",
>                 "index": 0,
>                 "dataFields" : [ // Typically used to initialize the database
>                     "LABEL",
>                     "ORIG_MSG_SENT_DATE",
>                     "RESPONSE_DATE", // should be nullable, or accept empty string
>                     "MESSAGE_ID",
>                     "THREAD_ID",
>                     "FROM",
>                     "SUBJECT",
>                     "APPLIED_FILTER" // should be nullable, or accept empty string
>                 ]
>             },
>             // dataCollections[1] --> Executions
>             {
>                 "name": "EXECUTIONS",
>                 "index": 1,
>                 "dataFields" : [ // Typically used to initialize the database
>                     "SEARCH_QUERY",
>                     "EXECUTION_TIME",
>                     "NUMBER_THREADS"
>                 ]
>             }
>         ]
>     }
>     ```
> - **`starthour`**: `Integer`. *(**default:** `17`)*.
> - **`finishhour`**: `Integer`. *(**default:** `8`)*.
> - **`utcoffset`**: `Integer`. *(**default:** `0`)*.
> - **`ccemailadr`**: `String`, one or a [RFC-compliant](https://tools.ietf.org/html/rfc2822#section-3.4.1) comma-separated list of email addresses. *(**default:** `''`)*.
> - **`bccemailadr`**: `String`, one or a [RFC-compliant](https://tools.ietf.org/html/rfc2822#section-3.4.1) comma-separated list of email addresses. *(**default:** `''`)*.
> - **`noreply`**: `Boolean`; whether or not to reply with a `noreply@` email address. *(**default:** `0` if `IS_GSUITE_USER` === `'true'`, `2` otherwise)*.
> - **`msgbody`**: `String`; Response message body in HTML format. *(**default:** `getDefaultMessageBody()` function return value)*.
> 
> #### Execution
> 
> `main()` function of the main script `main.js` is continuously executed (triggered) on a recurring interval of 10 minutes from `starthour` to `finishhour`. On each execution, referred to as **_Execution n_**, the function issues a [Gmail search query](https://developers.google.com/apps-script/reference/gmail/gmail-app#search%28String%29) to fetch last received messages.  
> The search query returns an array of [Gmail threads](https://developers.google.com/apps-script/reference/gmail/gmail-thread) that were updated in the last 10 minutes. The last [message](https://developers.google.com/apps-script/reference/gmail/gmail-message) of each of these threads is extracted and processed, i.e. it would either be responded to or skipped if it matches one of the exclusion filters in the `filters` property.   
> A **_Session_** is a series of [triggered executions](https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers) within a 24 hours span (e.g. from __05-Sep-2018 @7:00pm__ to __06-Sep-2018 @7:00am__).
>    
> In order to neither miss a message nor send an automated response more than once :
> 1. Although **_Execution (n-1)_** would normally have occurred 10 minutes ago, received messages are fetched from the last 12 minutes, in order not to miss any messages in case of a delay.
> 2. **[IDs](https://developers.google.com/apps-script/reference/gmail/gmail-message#getId%28%29)** of processed messages from **_Execution (n-1)_** are [cached with a 16 minutes timeout](https://developers.google.com/apps-script/reference/cache/cache#put%28String%2CString%2CInteger%29). During **_Execution n_**, IDs of retrieved messages are checked against this cache to determine whether they were already processed or not.
> 
> #### Logging
> 
> On each execution, the following information are logged:
> - **`PROCESSED_MESSAGES`:** Metadata of both messages responded to and those skipped (filtered out) : _Label_ (`REP_SENT` or `SKIPPED`), _Date/time Sent (Original Message)_, _Date/time Sent (Response)_ (when applicable), _Message ID_, _Thread ID_, _From_, _Subject_, _Applied filter_ (if the message was skipped).
> - **`EXECUTIONS`:** The Gmail search query, along with the execution time and the number of threads returned (search results).
> 
> ### 2. Backend: *Django*
> ...
> 
> ### 3. Frontend
> ...
> 


## Background

I [started](https://github.com/amindeed/Gmail-AutoResponder/blob/master/worklog.md#2017-07-26-code) **Gmail AutoResponder** back in 2017 as a script to manage automatic email responses beyond the active hours of the company I worked for.   
Although it was possible to set Gmail to individually send [canned responses](https://support.google.com/mail/thread/14877273?hl=en&msgid=14879088), I could neither make time-specific filters nor programmatically make Gmail trigger an event upon email reception. So, inspired by an [answer](https://webapps.stackexchange.com/a/90089) on one of StackExchange forums, I had to figure out a way around and ultimately ended up with a [basic Apps Script app](https://github.com/amindeed/Gmail-AutoResponder/tree/796a6d84f1e7287b8a936083ae8f507035a28215/app), 6 instances of which have amazingly run for almost 3 years and processed more than 17k messages!  
  
To see how the project progressed, check [`worklog.md`](worklog.md).


## License

This software is under the [MIT license](LICENSE).
