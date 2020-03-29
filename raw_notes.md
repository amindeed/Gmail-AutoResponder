# Raw Notes

*(This is to keep `README.md` clean)*

- Deploy to Google Apps Script using GitHub Actions. (possible?)
- [Development Environment - Importing and Exporting Projects  |  Apps Script](https://developers.google.com/apps-script/guides/import-export) ---> Check `clasp` instead.
- All parameters as script user properties : https://developers.google.com/apps-script/guides/properties
- Triggers :
    - [Installable Triggers : Managing triggers programmatically](https://developers.google.com/apps-script/guides/triggers/installable#managing_triggers_programmatically)
    - _Disable App :_ [Class ScriptApp - deleteTrigger(trigger)](https://developers.google.com/apps-script/reference/script/script-app#deleteTrigger(Trigger))
    - [Class ClockTriggerBuilder](https://developers.google.com/apps-script/reference/script/clock-trigger-builder)
- To decide whether or not to respond with a 'no-reply' email address :
    - [How to Check if the Google User has a G Suite Account - Digital Inspiration](https://www.labnol.org/code/20592-gsuite-account-check)
    - [gsuite - Google app script to check if an email exists in domain - Stack Overflow](https://stackoverflow.com/questions/57902993/google-app-script-to-check-if-an-email-exists-in-domain)

<br/>


## Deploy (`config-deploy.md`)

1. Prepare a Google Drive directory for the project :
    - **Manual Method :**
        - Go to your [Google Drive](https://drive.google.com/)
        - Create a directory named `Gmail AutoResponder`
    - **[Semi-]automatic Method :**
        - [Install](https://github.com/gdrive-org/gdrive) or [compile](https://www.mynotepaper.com/mount-google-drive-using-gdrive-on-linux-server-with-own-oauth-credentials) Gdrive on your machine.

- Install and configure prerequisites : [Go](https://golang.org/dl/), [npm](https://nodejs.org/en/), [`clasp`](https://github.com/google/clasp) and [`gdrive`](https://www.mynotepaper.com/mount-google-drive-using-gdrive-on-linux-server-with-own-oauth-credentials) :

```bash
npm install @google/clasp -g
clasp login --no-localhost
# Visit the provided URL, grant `clasp` required permissions, and copy/paste
# the code from the next web page
```
```bash
git clone https://github.com/gdrive-org/gdrive.git gdrive-src
cd gdrive-src
# Get your client ID and secret as explained on 'mynotepaper.com' blog (link
# above), and set them in the file `handlers_drive.go`
nano handlers_drive.go
go get github.com/prasmussen/gdrive
go build
mv $GOPATH/bin/gdrive.exe $GOPATH/bin/gdrive-original.exe
mv gdrive-src.exe $GOPATH/bin/gdrive.exe
cd .. && rm -r -f gdrive-src/
gdrive about
# Visit the provided URL, grant `gdrive` required permissions, and copy/paste
# the code from the next web page
```

- **Deploy** :

```bash
cd app/
clasp create --type standalone --title "Gmail AutoResponder Dev"
clasp push --force
```

- Place all project resources in the same Google Drive directory. Steps :
    - First time :
        - Set your [time zone](https://mkyong.com/java8/java-display-all-zoneid-and-its-utc-offset/) in the manifest file `appsscript.json`. e.g.:

        ```
        {
          "timeZone": "Africa/Casablanca",
          "dependencies": {
          },
          "exceptionLogging": "STACKDRIVER",
          "runtimeVersion": "V8"
        }
        ```

        - Create a standalone Google Apps Script project [and get its ID] :

        ```
        clasp create --type standalone --title "Gmail AutoResponder Dev"
        ```

        - Push local code files to that project :

        ```
        clasp push --force
        ```

        - <u>Google Drive</u> : Export 'Logs' and 'Filters' ('Configs') Google Spreadsheets (publicly shared templates), save them to a temporary local location, import them to your Google Drive and retrieve their IDs.
        - Set project properties (namely 'Logs' and 'Filters' ('Configs') Spreadsheet IDs)
            - [`clasp run`](https://github.com/google/clasp/blob/master/docs/run.md) : `clasp run 'set_properties' -p '["Logs-Spreadsheet-ID", "Configs-Spreadsheet-ID"]'`
            - <u>Suggestion</u> : Even if `User Properties` would make more sense, I think it's better to use `Script Properties`, since you can check and modify them using the web UI.
        - Create triggers : `clasp run 'manage_triggers'`
