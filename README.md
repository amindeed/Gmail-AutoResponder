# Gmail AutoResponder

**Gmail AutoResponder** is a customizable webapp to selectively send automated email responses in a specified timeframe of each day. All application components are contained in the Google Account running it : _**[Apps Script](https://developers.google.com/apps-script/reference/)** serves as the core framework, messages are read and sent from **Gmail**, and **Drive Sheets** are used to read content filters and save logs._
   
***The project is still under active, albeit slow, development.***

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [1. Setup](#1-setup)
- [2. Settings](#2-settings)
- [3. Execution](#3-execution)
- [4. Logging](#4-logging)
- [5. Background](#5-background)
- [6. TODO](#6-todo)
- [7. License](#7-license)

<!-- /TOC -->

## 1. Setup

Using [`clasp`](https://github.com/google/clasp#install) command line tool :

	```bash
	cd /app
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

## 2. Settings

- **`FILTERS_SS_ID` :** Drive ID of `Filters` Google spreadsheet where the user can define regular expressions to be applied as filters to sender and receiver addresses, as well as to raw message / headers contents. Default filters :
    - _For raw message : `report-type=disposition-notification`; to filter out read receipts,_
    - _For Sender header : `(^|<)((mailer-daemon|postmaster)@.*)`; to filter out delivery reports,_
    - _For Receiver header : `undisclosed-recipients`; to filter out potential spams._
- **`LOGS_SS_ID` :** Drive ID of `Logs` Google spreadsheet, where metadata of each response sent or message skipped are logged, along with general information about each execution.
- **`START_HOUR`**
- **`FINISH_HOUR`**
- **`DST_OFFSET`**
- **`CC_ADDRESS`**
- **`BCC_ADDRESS`**
- **`NOREPLY`**
- **`STAR_PROCESSED_MESSAGE`**
- **`MESSAGE_BODY`**


## 3. Execution

`autoReply()` function of the main script `Code.js` is continuously executed (triggered) on a recurring interval of `TIME_INTERVAL` minutes from `START_HOUR` to `FINISH_HOUR`. On each execution, referred to as **Execution n**, the function issues a [Gmail search query](https://developers.google.com/apps-script/reference/gmail/gmail-app#search%28String%29) to fetch last received messages.  
The search query returns an array of [Gmail threads](https://developers.google.com/apps-script/reference/gmail/gmail-thread) that were updated in the last `TIME_INTERVAL` minutes. The last [message](https://developers.google.com/apps-script/reference/gmail/gmail-message) of each of these threads is extracted and added to an array to be processed by the application.  
Processing a message means either …  
A **Session** is a series of [triggered executions](https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers) within a 24 hours span (e.g. from __05-Sep-2018 @7:00pm__ to __06-Sep-2018 @7:00am__).
   
In order to neither miss a message nor send an automated response more than once :
1. Although **Execution (n-1)** would normally have occurred `TIME_INTERVAL` minutes ago, received messages are fetched from the last `TIME_INTERVAL + 2` minutes, in order not to miss any messages in case of a delay.
2. **[IDs](https://developers.google.com/apps-script/reference/gmail/gmail-message#getId%28%29)** of processed messages from **Execution (n-1)** are [cached with a 16 minutes timeout](https://developers.google.com/apps-script/reference/cache/cache#put%28String%2CString%2CInteger%29). During **Execution n**, IDs of retrieved messages are checked against this cache to determine whether they were already processed or not.
   
    <img src="/assets/exec-timeline.jpg" alt="Execution timeline" width="600"/>
   
## 4. Logging

On each execution, the following information are logged to the `Logs` spreadsheet :
- **`OPERATIONS` (sheet #1):** Metadata of both messages responded to and those skipped (filtered out) : _Label_ (`REP_SENT` or `SKIPPED`), _Date/time Sent (Original Message)_, _Date/time Sent (Response)_ (when applicable), _Message ID_, _Thread ID_, _From_, _Subject_.
- **`EXECUTIONS` (sheet #2):** The Gmail search query, along with the execution time and the number of threads returned (search results).
**`archive_log()`** functions runs on the first day of each month to archive previous month log [of processed messages] in a separate sheet of `Logs` named `MONTH_YY`.

## 5. Background

I [started](https://github.com/amindeed/Gmail-AutoResponder/blob/master/worklog.md#2017-07-26-code) **Gmail AutoResponder** back in 2017 as a script to manage automatic email responses to be sent out of a company's working hours.  
Although it was possible to set Gmail to individually send [canned responses](https://support.google.com/mail/thread/14877273?hl=en&msgid=14879088), I could neither make time-specific filters nor programmatically make Gmail trigger an event upon email reception. So, inspired by an [answer](https://webapps.stackexchange.com/a/90089) on one of StackExchange forums, I had to figure out a way around and ultimately ended up with a [basic Apps Script app](https://github.com/amindeed/Gmail-AutoResponder/tree/796a6d84f1e7287b8a936083ae8f507035a28215/app), 6 instances of which have amazingly run for almost 3 years and processed more than 17k messages!  
  
To see how the project progressed, check [`worklog.md`](worklog.md).


## 6. TODO

_Check [`TODO.md`](TODO.md)_

## 7. License

Sample :

> Copyright © 2018 Amine Al Kaderi
>
> This software is released under the GNU GPLv3 license. For more information read the [license](https://www.gnu.org/licenses/gpl-3.0.txt).
>
> For third party software licenses, please check [licenses.md](licenses.md)
