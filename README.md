# Gmail AutoResponder

**Gmail AutoResponder** is a customizable webapp to send automated email responses. All application components are contained in the Google Account running it : 
- **[Apps Script](https://developers.google.com/apps-script/reference/)** serves as the core framework, 
- Messages are read and sent from **Gmail**, 
- and **Drive Sheets** are used to read content filters and save logs.
   
***This project is still under active, albeit slow, development. Check [`worklog.md`](worklog.md) for updates.***

## Setup

> _This section will be thoroughly revised in the future, to cover more setup options and scenarios._

Using [`clasp`](https://github.com/google/clasp#install) command line tool :

```bash
git clone https://github.com/amindeed/Gmail-AutoResponder.git
cd Gmail-AutoResponder/app/core
clasp login
clasp create --type webapp --title "Gmail AutoResponder Dev"
# Copy the URL of the created Apps Script project
clasp push --force
# 1. Go to the Apps Script project URL
# 2. Run the empty function `grantAccess()` ('grantAccess.gs')
clasp deployments
# 1. Copy the deployment ID of @HEAD (dev version with latest code). 
# 2. Go to either :
#  - G-Suite Account : https://script.google.com/a/{yourdomain.com}/macros/s/{Deployment-ID}/dev
#  - Free Account : https://script.google.com/macros/s/{Deployment-ID}/dev
```

## Settings

Managed as [Apps Script User Properties](https://developers.google.com/apps-script/reference/properties/properties-service#getUserProperties()):
- **`ENABLE_GMAUTOREP` :** _Flag,_ switch to enable/disable the app.
- **`FILTERS_SS_ID` :** Drive ID of the `Filters` Google spreadsheet where the user can define regular expressions to be applied as filters to sender and receiver addresses, as well as to raw message / headers contents. Default filters :
    - _**Raw Message :** `report-type=disposition-notification`; to filter out read receipts,_
    - _**Sender header :**_ 
        - _`(^|<)((mailer-daemon|postmaster)@.*)`; to filter out delivery reports,_
        - _Email addresses with the keywords `noreply`, `no-reply` and `do-not-reply`,_
        - _Email addresses with the domain name `google.com` or any of its subdomains,_
        - _Email address of the user running the application,_
    - _**Receiver header :** `undisclosed-recipients`; to filter out potential spams._
- **`LOGS_SS_ID` :** Drive ID of the `Logs` Google spreadsheet, where metadata of each response sent or message skipped are logged, along with general information about each execution.
- **`START_HOUR` :** _in 24h format;_ the hour from which the application will start sending responses.
- **`FINISH_HOUR`** _in 24h format;_ for example, `6` would let the application send responses until **6:59 AM**.
- **`DST_OFFSET` :** _Optional_, legacy parameter kept as a [workaround](https://github.com/amindeed/Gmail-AutoResponder/blob/master/worklog.md#2020-05-01) in case app's tasks seem to not run in their expected times.
- **`CC_ADDRESS` :** _Optional,_ comma separated list of email addresses to CC.
- **`BCC_ADDRESS` :** _Optional,_ comma separated list of email addresses to BCC.
- **`NOREPLY` :** _Optional,_ _Flag,_ whether to reply with the email address `noreply@mydomain.com`. Only applicable to G-Suite accounts.
- **`STAR_PROCESSED_MESSAGE` :** _Flag,_ whether to star processed messages in Gmail webmail.
- **`MESSAGE_BODY` :** Response message body in HTML format.


## Execution

`autoReply()` function of the main script `Code.js` is continuously executed (triggered) on a recurring interval of 10 minutes from `START_HOUR` to `FINISH_HOUR`. On each execution, referred to as **_Execution n_**, the function issues a [Gmail search query](https://developers.google.com/apps-script/reference/gmail/gmail-app#search%28String%29) to fetch last received messages.  
The search query returns an array of [Gmail threads](https://developers.google.com/apps-script/reference/gmail/gmail-thread) that were updated in the last 10 minutes. The last [message](https://developers.google.com/apps-script/reference/gmail/gmail-message) of each of these threads is extracted and processed, i.e. it would either be responded to or skipped if it matches one of the exclusion filters in the `Filters` spreadsheet.   
A **_Session_** is a series of [triggered executions](https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers) within a 24 hours span (e.g. from __05-Sep-2018 @7:00pm__ to __06-Sep-2018 @7:00am__).
   
In order to neither miss a message nor send an automated response more than once :
1. Although **_Execution (n-1)_** would normally have occurred 10 minutes ago, received messages are fetched from the last 12 minutes, in order not to miss any messages in case of a delay.
2. **[IDs](https://developers.google.com/apps-script/reference/gmail/gmail-message#getId%28%29)** of processed messages from **_Execution (n-1)_** are [cached with a 16 minutes timeout](https://developers.google.com/apps-script/reference/cache/cache#put%28String%2CString%2CInteger%29). During **_Execution n_**, IDs of retrieved messages are checked against this cache to determine whether they were already processed or not.

   
## Logging

On each execution, the following information are logged to the `Logs` spreadsheet :
- **`OPERATIONS` (sheet #1):** Metadata of both messages responded to and those skipped (filtered out) : _Label_ (`REP_SENT` or `SKIPPED`), _Date/time Sent (Original Message)_, _Date/time Sent (Response)_ (when applicable), _Message ID_, _Thread ID_, _From_, _Subject_.
- **`EXECUTIONS` (sheet #2):** The Gmail search query, along with the execution time and the number of threads returned (search results).   
**`archiveLog()`** functions runs on the first day of each month to archive previous month log [of processed messages] in a separate sheet of `Logs` named `MONTH_YY`.


## Background

I [started](https://github.com/amindeed/Gmail-AutoResponder/blob/master/worklog.md#2017-07-26-code) **Gmail AutoResponder** back in 2017 as a script to manage automatic email responses beyond the active hours of the company I worked for.   
Although it was possible to set Gmail to individually send [canned responses](https://support.google.com/mail/thread/14877273?hl=en&msgid=14879088), I could neither make time-specific filters nor programmatically make Gmail trigger an event upon email reception. So, inspired by an [answer](https://webapps.stackexchange.com/a/90089) on one of StackExchange forums, I had to figure out a way around and ultimately ended up with a [basic Apps Script app](https://github.com/amindeed/Gmail-AutoResponder/tree/796a6d84f1e7287b8a936083ae8f507035a28215/app), 6 instances of which have amazingly run for almost 3 years and processed more than 17k messages!  
  
To see how the project progressed, check [`worklog.md`](worklog.md).


## License

This software is under the [GNU GPLv3 license](https://www.gnu.org/licenses/gpl-3.0.txt).
   
Third party open source software licenses :
- [CKEditor 4](https://github.com/ckeditor/ckeditor4/blob/major/LICENSE.md)
- [Configuration Helper (CKEditor 4 Addon)](https://github.com/AlfonsoML/confighelper/blob/master/LICENSE)
- [SweetAlert2](https://github.com/sweetalert2/sweetalert2/blob/master/LICENSE)
- [Materialize](https://github.com/Dogfalo/materialize/blob/master/LICENSE)
