# Gmail AutoResponder

**Gmail AutoResponder** is a customizable webapp to selectively send automated email responses in a specified timeframe of each day. All application components are contained in the Google Account running it : _**[Apps Script](https://developers.google.com/apps-script/reference/)** serves as the core framework, messages are read and sent from **Gmail**, and **Drive Sheets** are used to read content filters and save logs._
   
***The project is still under active, albeit slow, development.***

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Setup](#setup)
	- [Method 1: Copy Project Templates](#method-1-copy-project-templates)
	- [Method 2: Deploy Source Code](#method-2-deploy-source-code)
- [Parameters & Components](#parameters-components)
- [How it works?](#how-it-works)
	- [1. Execution](#1-execution)
	- [2. Reliability](#2-reliability)
	- [3. Logging](#3-logging)
- [Background](#background)
- [TODO](#todo)
- [License](#license)

<!-- /TOC -->

## Setup
### Method 1: Copy Project Templates
1. Make a copy of the [**Google Apps Script** project template](https://drive.google.com/open?id=1G6d8vtFv8BMwssQ-Elmu40oIb0XOXG0LUt9LIYfo1BdlV7ttSFfKfXVb), where latest updates are pushed.  

	<img src="/assets/makecopy_script.png" alt="makecopy_script" width="300"/>

2. Make copies of [`Filters`](https://docs.google.com/spreadsheets/d/1zG25-RyaELsVGaCPU1zGlIxt8HHZJ86kRaiDVkBumGA/copy) and [`Logs`](https://docs.google.com/spreadsheets/u/0/d/1rJzYHqXA5-3SEeRW-RZkW8rRGI8kTdmIZzN95ZcjgOo/copy) spreadsheets templates to your Google account. 

3. Note down IDs of spreadsheets copies.

	<img src="/assets/copy_sheet_id.png" alt="copy_sheet_id" width="520"/>

4. 🛠 _(Initialize app)_

### Method 2: Deploy Source Code
- Using [`clasp`](https://github.com/google/clasp) command line tool :

	```bash
	cd /app
	clasp login
	clasp create --type webapp --title "Gmail AutoResponder Dev"
	clasp push --force
	```

- 🖱/🖥 Initialize the app

## Parameters & Components

- **`START_HOUR`**
- **`FINISH_HOUR`**
- **`TIME_INTERVAL`**
- **`DST_OFFSET`**
- **`FILTERS_SS_ID` :** Drive ID of `Filters` Google spreadsheet where the user can define regular expressions to be applied as filters to sender and receiver addresses, as well as to raw message / headers contents. Default filters :
    - _For raw message : `report-type=disposition-notification`; to filter out read receipts,_
    - _For Sender header : `(^|<)((mailer-daemon|postmaster)@.*)`; to filter out delivery reports,_
    - _For Receiver header : `undisclosed-recipients`; to filter out potential spams._
- **`LOGS_SS_ID` :** Drive ID of `Logs` Google spreadsheet, where metadata of each response sent or message skipped are logged, along with general information about each execution.
- 


## How it works?
### 1. Execution

`autoReply()` function of the main script `Code.js` is continuously executed (triggered) on a recurring interval of `TIME_INTERVAL` minutes from `START_HOUR` to `FINISH_HOUR`. On each execution, referred to as **Execution n**, the function issues a [Gmail search query](https://developers.google.com/apps-script/reference/gmail/gmail-app#search%28String%29) to fetch last received messages.  
The search query returns an array of [Gmail threads](https://developers.google.com/apps-script/reference/gmail/gmail-thread) that were updated in the last `TIME_INTERVAL` minutes. The last [message](https://developers.google.com/apps-script/reference/gmail/gmail-message) of each of these threads is extracted and added to an array to be processed by the application.  
Processing a message means either …  
A **Session** is a series of [triggered executions](https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers) within a 24 hours span (e.g. from __05-Sep-2018 @7:00pm__ to __06-Sep-2018 @7:00am__).

### 2. Reliability

Two tweaks have been made so far as an attempt to neither miss a message nor send an automated response more than once :

1. Although **Execution (n-1)** would normally have occurred `TIME_INTERVAL` minutes ago, received messages are fetched from the last `TIME_INTERVAL + 2` minutes, in order not to miss any messages in case of a delay.
2. **[IDs](https://developers.google.com/apps-script/reference/gmail/gmail-message#getId%28%29)** of processed messages from **Execution (n-1)** are [cached with a 16 minutes timeout](https://developers.google.com/apps-script/reference/cache/cache#put%28String%2CString%2CInteger%29). During **Execution n**, IDs of retrieved messages are checked against this cache to determine whether they were already processed or not.

<img src="/assets/exec-timeline.jpg" alt="Execution timeline" width="900"/>

### 3. Logging

On each execution, the following information are logged to the `Logs` spreadsheet :
- **`OPERATIONS` (sheet #1):** Metadata of both messages responded to and those skipped (filtered out) : 
    - _Label_ : `REP_SENT` or `SKIPPED`
    - _Date/time Sent (Original Message)_
    - _Date/time Sent (Response)_ (when applicable)
    - _Message ID_
    - _Thread ID_
    - _From_
    - _Subject_
- **`EXECUTIONS` (sheet #2):** The Gmail search query, along with the execution time and the number of threads returned (search results).
- **`archive_log()`** functions runs on the first day of each month to archive previous month log [of processed messages] in a separate sheet of `Logs` named `MONTH_YY`.

## Background

I [started](https://github.com/amindeed/Gmail-AutoResponder/blob/master/worklog.md#2017-07-26-code) **Gmail AutoResponder** back in 2017 as a script to manage automatic email responses to be sent out of a company's working hours.  
Although it was possible to set Gmail to individually send [canned responses](https://support.google.com/mail/thread/14877273?hl=en&msgid=14879088), I could neither make time-specific filters nor programmatically make Gmail trigger an event upon email reception. So, inspired by an [answer](https://webapps.stackexchange.com/a/90089) on one of StackExchange forums, I had to figure out a way around and ultimately ended up with a [basic Apps Script app](https://github.com/amindeed/Gmail-AutoResponder/tree/796a6d84f1e7287b8a936083ae8f507035a28215/app), 6 instances of which have amazingly run for almost 3 years and processed more than 17k messages!  
  
To see how the project progressed, check [`worklog.md`](worklog.md).


## TODO

_Check [`TODO.md`](TODO.md)_

## License

Sample :

> Copyright © 2018 Amine Al Kaderi
>
> This software is released under the GNU GPLv3 license. For more information read the [license](https://www.gnu.org/licenses/gpl-3.0.txt).
>
> For third party software licenses, please check [licenses.md](licenses.md)
