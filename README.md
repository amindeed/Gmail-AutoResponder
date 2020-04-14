# Gmail Autoresponder

**Gmail AutoResponder** is a customizable **[Google Apps Script](https://developers.google.com/apps-script/reference/)** web application to automatically process incoming Gmail messages.
It can be configured to selectively send canned responses to messages received within a specified time interval of each day.
The application reads custom filters _(= regular expressions applied to sender and receiver addresses, as well as to raw message / headers content)_ from the `Filters` Spreadsheet, process received emails and logs every operation (i.e. response sent or message skipped) to the `Logs` Spreadsheet.

## Demo
...

- Google Apps Script apps hosted by free Google accounts are subject to Apps Script services [quotas and limitations.](https://developers.google.com/apps-script/guides/services/quotas). You can check your total runtime with `Stackdriver Logging` under the `View` menu.
- To later revoke app's access to your data, follow the steps described here: [Revoking access rights | Authorization for Google Services  |  Apps Script](https://developers.google.com/apps-script/guides/services/authorization#revoking_access_rights).

## Setup

...

## How it works?

`autoReply()` function of the main script `Code.js` is continuously executed on a recurring interval of `TIME_INTERVAL` minutes from `START_HOUR` to `FINISH_HOUR`. On each execution, referred to as **Execution n**, the function issues a Gmail search query to fetch last received messages.

A **Session** is a series of [triggered executions](https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers) within a 24 hours span (e.g. from __05-Sep-2018 @7:00pm__ to __06-Sep-2018 @7:00am__).

In fact, the [search query](https://developers.google.com/apps-script/reference/gmail/gmail-app#search%28String%29) returns an array of [Gmail threads](https://developers.google.com/apps-script/reference/gmail/gmail-thread) that were updated in the last `TIME_INTERVAL` minutes. The last [message](https://developers.google.com/apps-script/reference/gmail/gmail-message) of each of these threads is extracted and added to an array to be processed by the application :


**Logs :**
- __responded to__, with the content of `body.html` file in the same Google Apps Script project; they are then [starred](https://developers.google.com/apps-script/reference/gmail/gmail-message#star) and have their metadata logged to `Logs` spreadsheet with the `REP_SENT` label;
- or __skipped__, if they contain one of the blacklisted words/expressions defined in `Filters` spreadsheet; then they are starred and have their meta-data logged to `Logs spreadsheet` with the `SKIPPED` label.
- The search query, along with the execution time and the number of threads are logged to the second sheet of `Logs` spreadsheet named `EXECUTIONS`.

Examples of values predefined in the `Filters spreadsheet`:
- **`RAWMSG_BLACKLIST`**: `report-type=disposition-notification`; to filter out read receipts,
- **`FROM_BLACKLIST`**: `(^|<)((mailer-daemon|postmaster)@.*)`; to filter out delivery reports,
- **`TO_BLACKLIST`**: `undisclosed-recipients`; to filter out potential spams.

> Although **Execution (n-1)** would normally have occurred `TIME_INTERVAL` minutes ago, received messages are fetched from the last `TIME_INTERVAL + 2` minutes, in order not to miss any messages in case of a delay.

[IDs](https://developers.google.com/apps-script/reference/gmail/gmail-message#getId%28%29) of `processed messages` from `Execution (n-1)` are [cached with a 16 minutes timeout](https://developers.google.com/apps-script/reference/cache/cache#put%28String%2CString%2CInteger%29). During `Execution n`, IDs of retrieved messages are checked against this cache to determine whether they were already processed or not. Thus, we leave little to no chance of sending an automated message more than once in response to the same email.

![Execution timeline](assets/exec-timeline.jpg)

`archive_log()` functions runs on the first day of each month to archive previous month log [of processed messages] in a separate sheet of `Logs` named `MONTH_YY`.


## Background ~~Motivations / Principles / History / Justify choices~~

* **Gmail Autoresponder** was inspired by an [answer](https://webapps.stackexchange.com/a/90089) on Stack Exchange Web Applications forum.
* As there is no event triggered on email reception ... *** then most features and configurations were abstracted for better app modularity and code readability.
* One backend application with a single access point (REST API), that will interface with all needed Google Services (Gmail and Spreadsheets, in our case) ** which the user will explicitly grant access to, all at once. This should make the web application more flexible, customizable and easier to maintain.


## TODO

- Summary of app errors reported during more than 2 years of execution, to be addressed in future updates :

| Start            | Function    | Error Message                                                                                                                                    | Trigger    | End              |
| ---------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ---------------- |
| 10/07/2018 20:06 | autoReply   | Limit Exceeded: Email Body Size. (line 99, file "Code")                                                                                          | time-based | 10/07/2018 20:06 |
| 10/04/2018 20:43 | autoReply   | Document 1qjB-QoZ17jLql6g4Zz1l6-xV8xlVlXu3I1m52WZOMrY is missing (perhaps it was deleted, or you don't have read access?) (line 22, file "Code") | time-based | 10/04/2018 20:44 |
| 9/17/18 12:53 AM | autoReply   | Service error: Spreadsheets (line 63, file "Code")                                                                                               | time-based | 9/17/18 12:53 AM |
| 7/26/18 11:16 PM | autoReply   | Gmail operation not allowed. (line 62, file "Code")                                                                                              | time-based | 7/26/18 11:16 PM |
| 4/24/18 4:52 AM  | autoReply   | Service timed out: Spreadsheets (line 63, file "Code")                                                                                           | time-based | 4/24/18 4:53 AM  |
| 3/23/18 10:46 PM | autoReply   | We're sorry, a server error occurred. Please wait a bit and try again.                                                                           | time-based | 3/23/18 10:46 PM |
| 1/25/18 8:22 PM  | autoReply   | We're sorry, a server error occurred. Please wait a bit and try again. (line 125, file "Code")                                                   | time-based | 1/25/18 8:24 PM  |
| 12/01/2017 08:45 | archive_log | Sorry, it is not possible to delete all non-frozen rows. (line 26, file "Archive_Log")                                                           | time-based | 12/01/2017 08:45 |
| 10/02/2017 20:58 | autoReply   | Argument too large: subject (line 97, file "Code")                                                                                               | time-based | 10/02/2017 20:58 |
| 10/01/2017 08:02 | archive_log | You do not have permissions to access the requested document. (line 11, file "Archive_Log")                                                      | time-based | 10/01/2017 08:02 |
| 8/30/17 11:06 PM | autoReply   | Invalid email: Judith Pin &lt;&gt; (line 92, file &quot;Code&quot;)                                                                              | time-based | 8/30/17 11:06 PM |
| 10/29/19 9:46 PM | autoReply   | Error sending email to RECIPIENT NAME . Please try again later. (line 99, file "Code")                                                           | time-based | 10/29/19 9:46 PM |
| 11/16/19 4:42 PM | autoReply   | Service error: Spreadsheets                                                                                                                      | time-based | 11/16/19 4:46 PM |

## Dependencies / used components
...

## Resources / Credits / Thanks
...

## License

Sample :

> Copyright © 2018 Amine Al Kaderi
>
> This software is released under the GNU GPLv3 license. For more information read the [license](https://www.gnu.org/licenses/gpl-3.0.txt).
>
> For third party software licenses, please check [licenses.md](licenses.md)
