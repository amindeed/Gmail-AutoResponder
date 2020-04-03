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


---------------------------------------------

## 4/3/2020, 11:57:42 PM

- New scopes needed :
    - `https://www.googleapis.com/auth/drive` : To use `DriveApp` to move file from one dir to another, while keeping the same ID.
    - `https://www.googleapis.com/auth/script.external_request` : To upload files to Drive. Advanced Google Service / Drive API to be enabled.

- [apps script APi executable API key curl dopost - Google Search](https://www.google.com/search?pws=0&hl=all&q=apps+script+APi+executable+API+key+curl+dopost&gws_rd=ssl&gl=US)
	- [Executing Functions using the Apps Script API  |  Google Developers](https://developers.google.com/apps-script/api/how-tos/execute)

- [apps script api executable curl "only me" OR "only me" - Google Search](https://www.google.com/search?pws=0&hl=all&gl=US&q=apps+script+api+executable+curl+%22only+me%22+OR+%22only+me%22&spell=1&sa=X&ved=2ahUKEwjKsfuUpc3oAhVMLewKHWYfBgYQBSgAegQICxAl&biw=1344&bih=704&dpr=1.25)
	- **(1)** [Apps Script Execution API showing error with devMode: true - Stack Overflow](https://stackoverflow.com/questions/47892350/apps-script-execution-api-showing-error-with-devmode-true)
		- [google apps script api executable run function token OR secret OR "api key" - Google Search](https://www.google.com/search?pws=0&hl=all&gl=US&biw=1344&bih=704&ei=traHXp_RNpGZsAeoz5dg&q=google+apps+script+api+executable+run+function+token+OR+secret+OR+%22api+key%22&oq=google+apps+script+api+executable+run+function+token+OR+secret+OR+%22api+key%22&gs_lcp=CgZwc3ktYWIQAzoFCCEQoAE6BAghEBU6BwghEAoQoAE6BAghEApKCggXEgYxMi0yMzlKCQgYEgUxMi00NFDZGFi8mQFg0poBaAFwAHgAgAHSBIgB9k-SAQwxLjI5LjEuNi4yLjWYAQCgAQGqAQdnd3Mtd2l6&sclient=psy-ab&ved=0ahUKEwifhIGepc3oAhWRDOwKHajnBQwQ4dUDCAs&uact=5)

- [apps script drive upload spreadsheet - Google Search](https://www.google.com/search?pws=0&hl=all&gl=US&ei=2WuHXsPiC4iVkgXK3rjoBg&q=apps+script+drive+upload+spreadsheet&oq=apps+script+drive+upload+spreadsheet&gs_lcp=CgZwc3ktYWIQAzoECAAQRzoICCEQFhAdEB46BQghEKABULUrWNBGYNFJaAJwA3gAgAGyAYgB2w6SAQQwLjEzmAEAoAEBqgEHZ3dzLXdpeg&sclient=psy-ab&ved=0ahUKEwiDs4vr3czoAhWIiqQKHUovDm0Q4dUDCAo&uact=5)
	- [Uploading Files from URLs | Advanced Drive Service  |  Apps Script  |  Google Developers](https://developers.google.com/apps-script/advanced/drive#uploading_files)
	- [apps script dopost upload binary file - Google Search](https://www.google.com/search?pws=0&hl=all&q=apps+script+dopost+upload+binary+file&gws_rd=ssl&gl=US)
		- [javascript - How to upload a file via POST (doPost) to a Google Script's Web App? - Stack Overflow](https://stackoverflow.com/questions/42217052/how-to-upload-a-file-via-post-dopost-to-a-google-scripts-web-app/42217817)
		- [File upload using doPost on Google Web Apps · tanaike](https://tanaikech.github.io/2017/02/05/file-upload-using-dopost-on-google-web-apps/)

- [How to Convert Microsoft Excel to Google Spreadsheet Format with Apps Script - Digital Inspiration](https://www.labnol.org/code/20500-convert-microsoft-excel-xlsx-to-google-spreadsheet)

- [Moving Files In Google Drive Using Google Script - Stack Overflow](https://stackoverflow.com/questions/38808875/moving-files-in-google-drive-using-google-script)


---------------------------------------------

### 1. Manual Setup

Application components :
    - Latest code update deployed as a template : _link_
    - ['Filters' Google Spreadsheets template](https://docs.google.com/spreadsheets/d/1pdbsI6gaKcv3zLVwnFHosOD-0b1eVUvMN_mJQYNogMc)
    - ['Logs' Google Spreadsheet template](https://docs.google.com/spreadsheets/d/1TyU0XlutRS4sBXCvtPa8AyrlEPfEuiSEoIbAKcYiSzU)

(Animated GIF)

### 2. Scripted Setup
#### 2.1. Initial Setup

1. <u>[Create a GCP project](https://console.cloud.google.com/projectcreate) :</u>
    - Set **Project Name** to `Clasp - GDrive`.
    - On **APIs & Services** dashboard, click on **ENABLE APIS AND SERVICES**. Search for **"Drive"**, and enable **Google Drive API**.
    - Note down **Project ID** (`GCP_PROJECT_ID`) and **Project number**. (Example: `my-sample-project-191923.` and `314053285323`). You can find these values later by selecting `Clasp - GDrive` from the top-left drop down projects list on the console page, and going to **IAM & Admin** > **Settings**.
    - Set **Application Name** for OAuth consent screen :
        - Go to : `https://console.developers.google.com/apis/credentials/consent?project=[GCP_PROJECT_ID]`
        - Set **User Type** to `Internal`.
        - Set **Application Name** to `Clasp & GDrive CLI`.
        - Click **Save**.
2. <u>Create credentials for both `gdrive` and `clasp` :</u>
    - Go to **Credentials** > **Create credentials** > **OAuth client ID**.
    - For `gdrive` :
        - <u>Application type :</u> **Other**. <u>Name :</u> **GDrive**.
        - **Create** > **OK**.
        - Copy values of both **Client ID** and **Secret**.
        - Download latest `gdrive` source code from GitHub :

            ```bash
            cd /any/temp/directory/
            git clone https://github.com/gdrive-org/gdrive.git gdrive-src
            ```

        - Replace values of `ClientId` and `ClientSecret` variables in the source file `gdrive-src/handlers_drive.go`.
    - For `clasp` :
        - <u>Application type :</u> **Other**. <u>Name :</u> **Clasp**.
        - **Create** > **OK**.
        - Download the JSON file containing credentials, save it to your app directory as `creds.json`. This file should be kept secret (i.e. to be added to both `.claspignore` and `.gitignore`).
3. <u>Install and configure tools :</u>
    - Install prerequisites : [Go](https://golang.org/dl/), [npm](https://nodejs.org/en/), Bash/[Git Bash](https://git-scm.com/downloads).
    - Build and install `gdrive`; Grant `Clasp & GDrive CLI` required permissions :

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

    - Install `clasp` and grant corresponding GCP App `clasp - The Apps Script CLI` required permissions :

        ```bash
        npm install @google/clasp -g
        clasp login --no-localhost
        # Visit the provided URL, grant `clasp` required permissions, and copy/paste
        # the code from the next web page. Default (global) credentials will then be
        # saved to: ~\.clasprc.json
        ```

    - Enable **Google Apps Script API**, by going to **Settings** menu on the page : [script.google.com/home/usersettings](https://script.google.com/home/usersettings)

4. Import `GMAIL_AUTORESPONDER_FILTERS.xlsx` and `GMAIL_AUTORESPONDER_LOGS.xlsx` files to Google Drive and save their IDs to the respective environment variables `GM_AUTORESP_FILTERS_ID` and `GM_AUTORESP_LOGS_ID` :

    ```bash
    cd app/
    export GM_AUTORESP_FILTERS_ID=$(cut -d " " -f2 <<<"$(gdrive import GMAIL_AUTORESPONDER_FILTERS.xlsx)")
    export GM_AUTORESP_LOGS_ID=$(cut -d " " -f2 <<<"$(gdrive import GMAIL_AUTORESPONDER_LOGS.xlsx)")
    ```

5. <u>Create a Google Apps Script project; Push local files :</u>
    - Set your [time zone](https://mkyong.com/java8/java-display-all-zoneid-and-its-utc-offset/) in the manifest file `appsscript.json`.
    - Create an API Executable Google Apps Script project :

        ```
        clasp create --type api --title "Gmail AutoResponder Dev"
        ```

        Note down project's URL and ID for future reference : `https://script.google.com/d/[APPS_SCRIPT_PROJECT_ID]/edit`.

    - Push local code files to the created Google Apps Script project :

        ```
        clasp push --force
        ```

6. <u>Finalize project by setting user properties and creating triggers / Intilalize project :</u>
    - Run : `clasp setting projectId <GCP_PROJECT_ID>` to add `projectId` to your `.clasp.json`.
    - Associate Google Apps Script project `Gmail AutoResponder Dev` to GCP project `Clasp & GDrive CLI` :
        - Open Google Apps Script project main page : `clasp open`
        - Go to **Resources** > **Cloud Platform project...**
        - Paste `Project number` in **Change Project** and click **Set Project**.
    - Call `clasp login --creds creds.json --no-localhost`
    - Grant `Clasp & GDrive CLI` required permissions. This will create a credentials file `.clasprc.json` in your app directory. This file should be kept secret (i.e. to be added to both `.claspignore` and `.gitignore`).
    - Set project properties (namely 'Logs' and 'Filters' Spreadsheets IDs) by running the command line :

        ```
        eval "clasp run 'set_properties' -p '[\"$GM_AUTORESP_FILTERS_ID\", \"$GM_AUTORESP_LOGS_ID\"]'"
        ```

    - _Function run: Add script user's email address to `FROM_BLACKLIST`_
    - ⚠️ Create triggers :

        ```
        clasp run 'manage_triggers'
        ```

        Application would start running automatically right after. You can check project's triggers by going to : `https://script.google.com/home/projects/[APPS_SCRIPT_PROJECT_ID]/triggers`

#### 2.2. Continuous Deployment

From here on, any update to **Gmail AutoResponder**'s code can be pushed to `script.google.com` by simply running the command line : `clasp push --force`, along with `clasp run` if there are any functions to be executed through the API (e.g. to create/set new user properties, to modify triggers...etc) : `clasp run 'myfunction' -p '[JSON-STRING-ARRAY-OF-PARAMETERS]'`.
