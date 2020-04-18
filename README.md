# Gmail AutoResponder

**Gmail AutoResponder** is a customizable webapp to selectively send automated email responses in a specified timeframe of each day.  
All application components are contained in the Google Account running it : _**[Apps Script](https://developers.google.com/apps-script/reference/)** serves as the core framework, messages are read and sent from **Gmail**, and **Drive Sheets** are used to read content filters and save logs._

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
- Make a copy of the [**Google Apps Script** project template](https://drive.google.com/open?id=1G6d8vtFv8BMwssQ-Elmu40oIb0XOXG0LUt9LIYfo1BdlV7ttSFfKfXVb), where latest updates are pushed.  

<img src="/assets/makecopy_script.png" alt="makecopy_script" width="335"/>

- Make copies of [`Filters`](https://drive.google.com/open?id=1zG25-RyaELsVGaCPU1zGlIxt8HHZJ86kRaiDVkBumGA) and [`Logs`](https://drive.google.com/open?id=1rJzYHqXA5-3SEeRW-RZkW8rRGI8kTdmIZzN95ZcjgOo) spreadsheets templates. 

<img src="/assets/makecopy_sheets.png" alt="makecopy_sheets" width="382"/>

- Note down IDs of spreadsheets copies you just created in your Google Drive.

<img src="/assets/copy_sheet_id.png" alt="copy_sheet_id" width="572"/>

- _(Initialize app)_

### Method 2: Deploy Source Code
- _(Create GCP Project)_
- Push code to Google Apps Script
- Import `GMAIL_AUTORESPONDER_FILTERS.xlsx` and `GMAIL_AUTORESPONDER_LOGS.xlsx` as Google Spreadsheets to your Google Drive.
- Initialize the app

## Parameters & Components

- **`START_HOUR`**
- **`FINISH_HOUR`**
- **`TIME_INTERVAL`**
- **`DST_OFFSET`**
- **`FILTERS_SS_ID` :** Drive ID of `Filters` Google spreadsheet where the user can define regular expressions to be applied as filters to sender and receiver addresses, as well as to raw message / headers contents. Default filters :
    - For raw message : `report-type=disposition-notification`; to filter out read receipts,
    - For Sender header : `(^|<)((mailer-daemon|postmaster)@.*)`; to filter out delivery reports,
    - For Receiver header : `undisclosed-recipients`; to filter out potential spams.
- **`LOG_SS_ID` :** Drive ID of `Logs` Google spreadsheet, where metadata of each response sent or message skipped are logged, along with general information about each execution.


## How it works?
### 1. Execution

`autoReply()` function of the main script `Code.js` is continuously executed (triggered) on a recurring interval of `TIME_INTERVAL` minutes from `START_HOUR` to `FINISH_HOUR`. On each execution, referred to as **Execution n**, the function issues a [Gmail search query](https://developers.google.com/apps-script/reference/gmail/gmail-app#search%28String%29) to fetch last received messages.  
The search query returns an array of [Gmail threads](https://developers.google.com/apps-script/reference/gmail/gmail-thread) that were updated in the last `TIME_INTERVAL` minutes. The last [message](https://developers.google.com/apps-script/reference/gmail/gmail-message) of each of these threads is extracted and added to an array to be processed by the application.  
Processing a message means either …  
A **Session** is a series of [triggered executions](https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers) within a 24 hours span (e.g. from __05-Sep-2018 @7:00pm__ to __06-Sep-2018 @7:00am__).

### 2. Reliability

Two tweaks have been made in an attempt to neither miss a message nor send an automated response more than once :

1. Although **Execution (n-1)** would normally have occurred `TIME_INTERVAL` minutes ago, received messages are fetched from the last `TIME_INTERVAL + 2` minutes, in order not to miss any messages in case of a delay.
2. **[IDs](https://developers.google.com/apps-script/reference/gmail/gmail-message#getId%28%29)** of processed messages from **Execution (n-1)** are [cached with a 16 minutes timeout](https://developers.google.com/apps-script/reference/cache/cache#put%28String%2CString%2CInteger%29). During **Execution n**, IDs of retrieved messages are checked against this cache to determine whether they were already processed or not.

<img src="/assets/exec-timeline.jpg" alt="Execution timeline" width="900"/>

### 3. Logging

On each execution, the following information are logged to the `Logs` spreadsheet :
- **`OPERATIONS` (Sheet #1):** Metadata of both messages responded to and those skipped (filtered out) : 
    - _**Label**_ : `REP_SENT` or `SKIPPED`
    - _**Date/time Sent (Original Message)**_
    - _**Date/time Sent (Auto-response)**_ (when applicable)
    - _**Message ID**_
    - _**Thread ID**_
    - _**From**_
    - _**Subject**_
- **`EXECUTIONS` (Sheet #2):** The Gmail search query, along with the execution time and the number of threads returned (search results).
- `archive_log()` functions runs on the first day of each month to archive previous month log [of processed messages] in a separate sheet of `Logs` named `MONTH_YY`.

## Background

- **Gmail Autoresponder** was inspired by an [answer](https://webapps.stackexchange.com/a/90089) on Stack Exchange Web Applications forum.
- As there is no event triggered on email reception ... *** then most features and configurations were abstracted for better app modularity and code readability.
_Check [`worklog.md`](worklog.md)_


## TODO

_Check [`TODO.md`](TODO.md)_

## License

Sample :

> Copyright © 2018 Amine Al Kaderi
>
> This software is released under the GNU GPLv3 license. For more information read the [license](https://www.gnu.org/licenses/gpl-3.0.txt).
>
> For third party software licenses, please check [licenses.md](licenses.md)
