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

**Application Setup** menu items (draft/suggestion) :
> 1. Basic : _Manual Setup_
> 2. Advanced : _Customizable_
> 3. Scripted : _Continuous Deployment_

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

--------------------------------------------------------------------------------

#### Exploring creating a GCP project with OAuth credentials using just the `gcloud` CLI tool :

1. Install `Google Cloud SDK` :
    - Script installation : [Installing from versioned archives  |  Cloud SDK Documentation](https://cloud.google.com/sdk/docs/downloads-versioned-archives)
    - Human Installation : [Using the Google Cloud SDK installer  |  Cloud SDK Documentation](https://cloud.google.com/sdk/docs/downloads-interactive)
    - Detailed instructions to install and init Google Cloud SDK : [Google Cloud SDK documentation](https://cloud.google.com/sdk/docs)
2. <u>[GCP project](https://console.cloud.google.com/projectcreate) :</u>
    - Init :

    ```bash
    gcloud auth login --brief
    ```

    - Create a GCP project. Set Project **Name** and **ID** :

    ```bash
    gcloud projects create gcloud-sdk-test2 --name="GCLOUD SDK TEST 2" --account=test@amindeed.com --no-enable-cloud-apis
    ```

    From then on, following commands executed on the same console session seem to be run as the Google G-Suite user `test@amindeed.com`. So basically, you can create another GCP project for the same user without using the `--account` flag.

    - Enable **Drive** and **Script** APIs :

    ```bash
    CLOUDSDK_CORE_PROJECT=gcloud-test4-no-apis gcloud services enable drive.googleapis.com script.googleapis.com
    ```

    - Get and note down **Project Number** :

    ```bash
    gcloud projects describe gcloud-test4-no-apis
    ```

--------------------------------------------------------------------------------


## <u>_Draft :_ Using Google Drive API</u>

- [1. Curl](#1-curl)
	- [1.1. Get OAuth Client ID credentials of a GCP Project to use Drive API :](#u11-get-oauth-client-id-credentials-of-a-gcp-project-to-use-drive-api-u)
	- [1.2. Request Access Token / Authorization Code :](#u12-request-access-token-authorization-code-u)
	- [1.3. Get a new access token (authorization code), using the refresh token :](#u13-get-a-new-access-token-authorization-code-using-the-refresh-token-u)
	- [1.4. Create Drive Directory; Get its ID :](#u14-create-drive-directory-get-its-id-u)
	- [1.5. Get all metadata of a created folder (by ID) :](#u15-gethttpsdevelopersgooglecomdriveapiv3referencefilesget-all-metadatahttpsdevelopersgooglecomdriveapiv3referencefilesresource-of-a-created-folder-by-id-u)
	- [1.6. Getting information about the authenticated user (that is calling the API) :](#u16-getting-information-about-the-authenticated-user-that-is-calling-the-api-u)
	- [1.7. Import XLSX files to that directory. Save their respective IDs :](#u17-import-xlsx-files-to-that-directory-save-their-respective-ids-u)
	- [1.8. Rename a file in Drive :](#u18-rename-a-file-in-drive-u)
	- [1.9. Move Google Apps Script project file to the created directory :](#u19-move-google-apps-script-project-file-to-the-created-directory-u)

### 1. Curl
#### <u>1.1. Get OAuth Client ID credentials of a GCP Project to use Drive API :</u>

- Create Project, Set OAuth Consent Screen, Create "OAuth Client ID" credentials, download JSON file : `C:\Temp_\client_secret_749051560020-6cnf1ttck5qnq76224pnkc8jofevh9gu.apps.googleusercontent.com.json` :
<br/>

```json
{
    "installed": {
        "client_id": "749051560020-6cnf1ttck5qnq76224pnkc8jofevh9gu.apps.googleusercontent.com",
        "project_id": "curl-oauth",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": "cU9WY9vpe7kqBMR-wbbKODq4",
        "redirect_uris": ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"]
    }
}
```

- Get needed scopes (for Drive API, for instance) : [https://developers.google.com/identity/protocols/oauth2/scopes#drivev3](https://developers.google.com/identity/protocols/oauth2/scopes#drivev3)
- Create your Access token request URL :

```
https://accounts.google.com/o/oauth2/auth?access_type=offline&client_id=749051560020-6cnf1ttck5qnq76224pnkc8jofevh9gu.apps.googleusercontent.com&redirect_uri=urn:ietf:wg:oauth:2.0:oob&scope=https://www.googleapis.com/auth/drive&response_type=code
```

- Get your Access Token, to be used in the following API calls : `4/yQGSfldFg6V2OZSnDFrzHGfHQUhpimHcRHoE5KhLtl37g9laDBMFI0c`


#### <u>1.2. Request Access Token / Authorization Code :</u>

**HTTP Request :**

```bash
curl \
--request POST \
--data "code=4/ygGZjQIjlTPww-zRuKTi6N0H7XAtImpccWk7vg0m8J4trEo6tEQiHAo&client_id=749051560020-6cnf1ttck5qnq76224pnkc8jofevh9gu.apps.googleusercontent.com&client_secret=cU9WY9vpe7kqBMR-wbbKODq4&redirect_uri=urn:ietf:wg:oauth:2.0:oob&grant_type=authorization_code" \
https://accounts.google.com/o/oauth2/token
```

**HTTP Response :**

```json
{
    "access_token": "ya29.a0Ae4lvC3FOGRu4Wf60aXMwI-4m3D6alnI3Cbzd0Jn0wY0iE8MnsRhYgaQpRZLneO9fK9Qtyrx-94ewKwM2SxjKM3EdIvJ0hmGaaPEZAarcgwgVOpWuOYnEC6eY6BLC5nvuzF6tXWLnNbAhaZ8gFwqAGxTRh21b02JxIM",
    "expires_in": 3599,
    "refresh_token": "1//098xiX4JCZFZWCgYIARAAGAkSNwF-L9IrCLVmndwGlyk8x_u9UKJZONuac4m4xZLuwhFJ-omtasX9zVYXsVrXE6OfY4Wx1EgI26U",
    "scope": "https://www.googleapis.com/auth/drive",
    "token_type": "Bearer"
}
```

#### <u>1.3. Get a new access token (authorization code), using the refresh token :</u>

**HTTP Request :**

```bash
curl -X POST \
-d "client_id=749051560020-6cnf1ttck5qnq76224pnkc8jofevh9gu.apps.googleusercontent.com&client_secret=cU9WY9vpe7kqBMR-wbbKODq4&grant_type=refresh_token&refresh_token=1//098xiX4JCZFZWCgYIARAAGAkSNwF-L9IrCLVmndwGlyk8x_u9UKJZONuac4m4xZLuwhFJ-omtasX9zVYXsVrXE6OfY4Wx1EgI26U" \
https://accounts.google.com/o/oauth2/token
```

**HTTP Response :**

```json
{
  "access_token": "ya29.a0Ae4lvC30G-m2ociASaWmvvZurTjy0wq3B_B6ZC7n261i6Eyt-3MF8gL8XfLFJbkzP4I9KUEGPfuo0MVYUYUhkdUmC8hCz7OaOYCFb3hwZwNI11fZ7Kzbr7L8lSh3LM5ZfU223Jc43aO3C7FbIBaKx31FoTxQ7kdrwJHj",
  "expires_in": 3599,
  "scope": "https://www.googleapis.com/auth/drive",
  "token_type": "Bearer"
}
```

#### <u>1.4. Create Drive Directory; Get its ID :</u>

**HTTP Request :**

```bash
curl \
-X POST \
-H "Authorization: Bearer ya29.a0Ae4lvC0nve_UI9umuKrxjz9P_X6V-zh5ZEcIid8Vl0JUk-WMzLHHou2gdAFnqdwfVTpLWC3SSqAmBldFGYsUINAuNJcWUcVC_Dn3sZ1LmDg4FF9maXyp3mB8iBRH-BuJO-pkcXR-Cy5JBR1uZEZtQX2I8i1nXtcFGylz" \
-H "Content-Type: application/json" \
-d "{'mimeType':'application/vnd.google-apps.folder','name':'curl-test-dir5'}" \
https://www.googleapis.com/drive/v3/files?alt=json
```

**HTTP Response :**

```json
{
 "kind": "drive#file",
 "id": "1WYLIXZBe3PSHisZgjNpeT5nfV2-U6B5G",
 "name": "curl-test-dir5",
 "mimeType": "application/vnd.google-apps.folder"
}
```

#### <u>1.5. [Get](https://developers.google.com/drive/api/v3/reference/files/get) all [metadata](https://developers.google.com/drive/api/v3/reference/files#resource) of a created folder (by ID) :</u>

**HTTP Request :**

```bash
curl -X GET \
-H "Authorization: Bearer ya29.a0Ae4lvC3rQDHuVKipd09v6ht_n8frH4_D8fl2O_nGtDVeji-zEtlRC-1CstvuYnccFO_ZeC58tSA2eXR4ty2LoaTBv2KbpRWcLigV8YXhnRWO7d90cZ30aCUVlwFz_-Ig4BAaFazdU_47-12v2Ca2A_liSvfc3xRUtmX-" \
https://www.googleapis.com/drive/v3/files/1WYLIXZBe3PSHisZgjNpeT5nfV2-U6B5G?fields=*
```

**HTTP Response :**

```json
{
 "kind": "drive#file",
 "id": "1WYLIXZBe3PSHisZgjNpeT5nfV2-U6B5G",
 "name": "curl-test-dir5",
 "mimeType": "application/vnd.google-apps.folder",
 "starred": false,
 "trashed": false,
 "explicitlyTrashed": false,
 "parents": [
  "0ALlnR1X6kbuLUk9PVA"
 ],
 "spaces": [
  "drive"
 ],
 "version": "1",
 "webViewLink": "https://drive.google.com/drive/folders/1WYLIXZBe3PSHisZgjNpeT5nfV2-U6B5G",
 "iconLink": "https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.folder",
 "hasThumbnail": false,
 "thumbnailVersion": "0",
 "viewedByMe": false,
 "createdTime": "2020-04-11T19:11:03.686Z",
 "modifiedTime": "2020-04-11T19:11:03.686Z",
 "modifiedByMeTime": "2020-04-11T19:11:03.686Z",
 "modifiedByMe": true,
 "owners": [
  {
   "kind": "drive#user",
   "displayName": "Test3 Test3",
   "me": true,
   "permissionId": "15576437119490321135",
   "emailAddress": "test3@amindeed.com"
  }
 ],
 "lastModifyingUser": {
  "kind": "drive#user",
  "displayName": "Test3 Test3",
  "me": true,
  "permissionId": "15576437119490321135",
  "emailAddress": "test3@amindeed.com"
 },
 "shared": false,
 "ownedByMe": true,
 "capabilities": {
  "canAddChildren": true,
  "canAddMyDriveParent": false,
  "canChangeCopyRequiresWriterPermission": false,
  "canChangeViewersCanCopyContent": false,
  "canComment": true,
  "canCopy": false,
  "canDelete": true,
  "canDownload": true,
  "canEdit": true,
  "canListChildren": true,
  "canModifyContent": true,
  "canMoveChildrenWithinDrive": true,
  "canMoveItemIntoTeamDrive": true,
  "canMoveItemOutOfDrive": true,
  "canMoveItemWithinDrive": true,
  "canReadRevisions": false,
  "canRemoveChildren": true,
  "canRemoveMyDriveParent": true,
  "canRename": true,
  "canShare": true,
  "canTrash": true,
  "canUntrash": true
 },
 "viewersCanCopyContent": true,
 "copyRequiresWriterPermission": false,
 "writersCanShare": true,
 "permissions": [
  {
   "kind": "drive#permission",
   "id": "15576437119490321135",
   "type": "user",
   "emailAddress": "test3@amindeed.com",
   "role": "owner",
   "displayName": "Test3 Test3",
   "deleted": false
  }
 ],
 "permissionIds": [
  "15576437119490321135"
 ],
 "folderColorRgb": "#8f8f8f",
 "quotaBytesUsed": "0",
 "isAppAuthorized": true
}
```

#### <u>1.6. Getting information about the authenticated user (that is calling the API) :</u>

**HTTP Request :**

```bash
curl -X GET \
-H "Authorization: Bearer ya29.a0Ae4lvC3rQDHuVKipd09v6ht_n8frH4_D8fl2O_nGtDVeji-zEtlRC-1CstvuYnccFO_ZeC58tSA2eXR4ty2LoaTBv2KbpRWcLigV8YXhnRWO7d90cZ30aCUVlwFz_-Ig4BAaFazdU_47-12v2Ca2A_liSvfc3xRUtmX-" \
https://www.googleapis.com/drive/v3/about?fields=kind,user
```

**HTTP Response :**

```json
{
 "kind": "drive#about",
 "user": {
  "kind": "drive#user",
  "displayName": "Test3 Test3",
  "me": true,
  "permissionId": "15576437119490321135",
  "emailAddress": "test3@amindeed.com"
 }
}
```


#### <u>1.7. Import XLSX files to that directory. Save their respective IDs :</u>

**HTTP Request :**

```bash
curl -X POST \
-H "Authorization: Bearer ya29.a0Ae4lvC0b7itrj6r6oMXA6ZpU5xK3dSt-dQa3NCSRT6Gdf95u5fhdM-1N2eTskBmJ6GRuF-XMeDv3lmnMOiYAE4GtEwEmw_eLK0YngUWj-n1qJOYFA2DnxtTx7dvmqscI652As00hPX528i6h7d_yAmWACjVKqldIkF0" \
-F "metadata={name : 'XLSX_UPLOADED_CURL2', mimeType : 'application/vnd.google-apps.spreadsheet', parents: ['12pZEQYme5l5LsDJv054zz1wn7vi5jhgu'] }; type=application/json; charset=UTF-8" \
-F "file=@C:\Temp_\GMAIL_AUTORESPONDER_FILTERS.xlsx; type=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" \
https://www.googleapis.com/upload/drive/v3/files?alt=json&fields=id%%2Cname%%2Csize%%2Cmd5Checksum%%2CwebContentLink&uploadType=multipart
```

**HTTP Response : ON SUCCESS**

```json
{
 "kind": "drive#file",
 "id": "1mQ0FQTN14Z58Daws-yIdxU6ak7tmhdaUcxyBk0tUy3c",
 "name": "XLSX_UPLOADED_CURL2",
 "mimeType": "application/vnd.google-apps.spreadsheet"
}
```

**HTTP Response : ON FAILURE : _Parent directory not found_**

```json
"error": {
 "errors": [
  {
   "domain": "global",
   "reason": "notFound",
   "message": "File not found: 12pZEQYme5l5LsDJv084zz1wn7vi5jhgu.",
   "locationType": "parameter",
   "location": "fileId"
  }
 ],
 "code": 404,
 "message": "File not found: 12pZEQYme5l5LsDJv084zz1wn7vi5jhgu."
}
}
```

#### <u>1.8. Rename a file in Drive :</u>

**HTTP Request :**

```bash
curl -X PATCH \
-H "Authorization: Bearer ya29.a0Ae4lvC19pVZaOg84GNimSef1cVjz-Q00WyC8SxhziM5ua2JwrZSaMxYga-7I3Rjxd-d3RIu0M66KSKLPb_eP2j-WG_BVMYs-1Ia2q6PNpfoFe-s_uvYaqAGjqzqvd6maU_7XV88EaDmmI6vj-AVCsqjhZ8L-V5pNxbax" \
-H "Content-Type: application/json" \
-d "{'name':'patchedByCurl_Test_GDrive'}" \
https://www.googleapis.com/drive/v3/files/1l53JuqO1nONZXUyMCxkti3-8pK9Z5_-B
```

**HTTP Response :**

```json
{
 "kind": "drive#file",
 "id": "1l53JuqO1nONZXUyMCxkti3-8pK9Z5_-B",
 "name": "patchedByCurl_Test_GDrive",
 "mimeType": "image/png"
}
```

#### <u>1.9. Move Google Apps Script project file to the created directory :</u>

**HTTP Request :**

```bash
echo "Add Parent folder (a root subfolder)"
curl -X PATCH \
-H "Authorization: Bearer ya29.a0Ae4lvC0HOBMG-_UpumzXnK7cnMAAMg3eoWX8MvIlNaXw_ofcf2mndRRb3WkjNEFPD0u0vUuxeDdB46f8P0ga8dFJHe5OJBAsTwssHEA_D2c9G-sslYhF5kG2tnH3aFmVx-ZQWgj6Zg_3RbS73COJdOs2fvuhmkDvFv7x" \
-H "Content-Type: application/json" \
https://www.googleapis.com/drive/v3/files/1-pdgvPRx8wkRhrDTRppFNFZV4hXNCvUD1lZhTJ0CuqU?addParents=18MunVQ0VFA3s5d7aCLK22j8NbofBA2dj

echo "Remove Parent folder 'root'"
curl -X PATCH \
-H "Authorization: Bearer ya29.a0Ae4lvC0HOBMG-_UpumzXnK7cnMAAMg3eoWX8MvIlNaXw_ofcf2mndRRb3WkjNEFPD0u0vUuxeDdB46f8P0ga8dFJHe5OJBAsTwssHEA_D2c9G-sslYhF5kG2tnH3aFmVx-ZQWgj6Zg_3RbS73COJdOs2fvuhmkDvFv7x" \
-H "Content-Type: application/json" \
https://www.googleapis.com/drive/v3/files/1-pdgvPRx8wkRhrDTRppFNFZV4hXNCvUD1lZhTJ0CuqU?removeParents=root
```

**HTTP Response (for both requests):**

```json
{
 "kind": "drive#file",
 "id": "1-pdgvPRx8wkRhrDTRppFNFZV4hXNCvUD1lZhTJ0CuqU",
 "name": "GMAIL_AUTORESPONDER_FILTERS.xlsx",
 "mimeType": "application/vnd.google-apps.spreadsheet"
}
```
