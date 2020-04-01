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

-

- **Deploy** :

```bash
cd app/
clasp create --type standalone --title "Gmail AutoResponder Dev"
clasp push --force
```

- Place all project resources in the same Google Drive directory. Steps :
    - First time :


        - <u>Google Drive</u> : Export 'Logs' and 'Filters' ('Configs') Google Spreadsheets (publicly shared templates), save them to a temporary local location, import them to your Google Drive and retrieve their IDs.
            - [Gmail Autoresponder - Logs template - Google Sheets](https://drive.google.com/open?id=1TyU0XlutRS4sBXCvtPa8AyrlEPfEuiSEoIbAKcYiSzU) / [Gmail Autoresponder - Filters template - Google Sheets](https://drive.google.com/open?id=1pdbsI6gaKcv3zLVwnFHosOD-0b1eVUvMN_mJQYNogMc)
                - There seem to be some [unresolved issues](https://github.com/gdrive-org/gdrive/issues/154) regarding MIME types specification while importing/exporting files to/from Google Drive. So, so far, the only method that worked without issues is using `gdrive import` CLI to upload a local `*.xlsx` file (`Microsoft Excel 2007+` / `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` mime type) and "seamlessly" convert it to Google Spreadsheet format :

                ```
                gdrive import GMAIL_AUTORESPONDER_FILTERS.xlsx
                gdrive import GMAIL_AUTORESPONDER_LOGS.xlsx
                ```

                - The output of `gdrive import` command line is like : `Imported 1D4----------------------qvc with mime type: 'application/vnd.google-apps.spreadsheet'`. So, to both import the two spreadsheets and save their respective IDs to variables we combine multiple commands like this :

                ```
                export GM_AUTORESP_FILTERS_ID=$(cut -d " " -f2 <<<"$(gdrive import GMAIL_AUTORESPONDER_FILTERS.xlsx)")
                export GM_AUTORESP_LOGS_ID=$(cut -d " " -f2 <<<"$(gdrive import GMAIL_AUTORESPONDER_LOGS.xlsx)")
                ```


---------------------------------------------

### Setup Instructions

- [Create a GCP project](https://console.cloud.google.com/projectcreate). Set **Project Name** to `Clasp - GDrive`.
- Enable **Google Drive API**.
- Note down values of `Project ID` and `Project number`. (Example: `my-sample-project-191923.` and `314053285323`). To later retrieve these information, select the project `Clasp - GDrive` from the top-left drop down list, and go to **GCP Console** > **IAM & Admin** > **Settings**.
* Go to URL : `https://console.developers.google.com/apis/credentials/consent?project=[GCP_PROJECT_ID]`
    - Set **User Type** to `Internal`.
    - Set **Application Name** to `Clasp & GDrive CLI`.
    - Click **Save**.
* Create credentials for both `gdrive` and `clasp`.
    - Go to **Credentials** > **Create credentials** > **OAuth client ID**.
    * For `gdrive` :
        * Application type: **Other**. Name : **GDrive**.
        * **Create** > **OK**.
        * Get **Client ID** and **Secret** values.
        * Download latest `gdrive` source code from GitHub :

            ```bash
            cd /any/temp/directory/
            git clone https://github.com/gdrive-org/gdrive.git gdrive-src
            ```

        * Replace values of `ClientId` and `ClientSecret` variables in the source file `gdrive-src/handlers_drive.go`.
    * For `clasp` :
        - Application type: **Other**. Name : **Clasp**.
        - **Create** > **OK**.
        - Download the JSON file containing credentials, save it to your app directory as `creds.json`. This file should be kept secret.
* Installing and configuring tools :
    * Install prerequisites : [Go](https://golang.org/dl/), [npm](https://nodejs.org/en/).
    * Build and install `gdrive`; Grant `Clasp & GDrive CLI` required permissions :

        ```bash
        cd gdrive-src
        go get github.com/prasmussen/gdrive
        go build
        mv $GOPATH/bin/gdrive.exe $GOPATH/bin/gdrive-original.exe
        mv gdrive-src.exe $GOPATH/bin/gdrive.exe
        cd .. && rm -r -f gdrive-src/
        gdrive about
        # Visit the provided URL, grant `gdrive` required permissions, and copy/paste
        # the code from the next web page. This will create a token file inside the
        # .gdrive folder in your home directory; On windows 10, for instance :
        # `C:\Users\Username\AppData\Roaming\.gdrive\token_v2.json`
        ```

    * Install `clasp` and grant corresponding GCP App `clasp - The Apps Script CLI` required permissions :

        ```bash
        npm install @google/clasp -g
        clasp login --no-localhost
        # Visit the provided URL, grant `clasp` required permissions, and copy/paste
        # the code from the next web page. Default (global) credentials will then be
        # saved to: ~\.clasprc.json
        ```

    - Enable Google Apps Script API, by going to **Settings** menu in the page : [script.google.com/home/usersettings](https://script.google.com/home/usersettings)

* Import `GMAIL_AUTORESPONDER_FILTERS.xlsx` and `GMAIL_AUTORESPONDER_LOGS.xlsx` files in `/app` directory to Google Drive and save their IDs to the respective environment variables `GM_AUTORESP_FILTERS_ID` and `GM_AUTORESP_LOGS_ID` :

    ```bash
    export GM_AUTORESP_FILTERS_ID=$(cut -d " " -f2 <<<"$(gdrive import GMAIL_AUTORESPONDER_FILTERS.xlsx)")
    export GM_AUTORESP_LOGS_ID=$(cut -d " " -f2 <<<"$(gdrive import GMAIL_AUTORESPONDER_LOGS.xlsx)")
    ```

* Create [and intialize / push local files] Google Apps Script project under a Google account with `clasp` :
    - Set your [time zone](https://mkyong.com/java8/java-display-all-zoneid-and-its-utc-offset/) in the manifest file `appsscript.json`.
    - Create a API Executable Google Apps Script project:

        ```
        clasp create --type api --title "Gmail AutoResponder Dev"
        ```

        You can note down project's URL and ID for future reference : `https://script.google.com/d/[APPS_SCRIPT_PROJECT_ID]/edit`.

    - Push local code files to the created Google Apps Script project :

        ```
        clasp push --force
        ```
- Run : `clasp setting projectId <GCP_PROJECT_ID>` to add `projectId` to your `.clasp.json`.
- Associate Google Apps Script project `Gmail AutoResponder Dev` to GCP project `Clasp & GDrive CLI` :
    - Open Google Apps Script project main page : `clasp open`
    - In the menu, got to `Resources > Cloud Platform project...`
    - Paste `Project number` in `Change Project` and click `Set Project`
- Call `clasp login --creds creds.json --no-localhost`
- Grant `Clasp & GDrive CLI` required permissions. This will create a credentials file `.clasprc.json` in your app directory.
- Set project properties (namely 'Logs' and 'Filters' Spreadsheet IDs) by running the command line :

    ```
    clasp run 'set_properties' -p '[$GM_AUTORESP_LOGS_ID, $GM_AUTORESP_FILTERS_ID]'
    ```
- ⚠️ Create triggers : `clasp run 'manage_triggers'`. Application would start running automatically right after. You can check that filters were created correctly by going to : `https://script.google.com/home/projects/[APPS_SCRIPT_PROJECT_ID]/triggers`
