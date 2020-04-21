# Work Log

## 2020-04-21
- For some reason, files created on Drive from Blob data (= input file of a submitted form) lose their MIME type and get corrupted. What I couldn't understand is that up until the file is uploaded to the server, and right before a Drive file is created with its data by calling [`DriveApp.createFile(blob)`](https://developers.google.com/apps-script/reference/drive/drive-app#createFile(BlobSource)), the blob type is correct. The backend function `processForm()` of `draft_code\client-to-server\Code.js` was modified to illustrate the issue :

    <br /><img src="/assets/2020-04-21 11_45_15-_corrupted-drive-files.gif" alt="Corrupted Drive Files" width="500"/><br />
    
- So basically, some fairy reliable resources and accepted examples on the web suggest to first process the submitted file with [`FileReader()`](https://developer.mozilla.org/en-US/docs/Web/API/FileReader), and pass it as a [data URL](https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL) to a backend function for a second process that extracts content type from it, [decodes the submitted base64 data](https://developers.google.com/apps-script/reference/utilities/utilities#base64Decode(String)), and calls [`Utilities.newBlob()`](https://developers.google.com/apps-script/reference/utilities/utilities#newBlob(Byte,String)) to create a new blob object for [`DriveApp.createFile(blob)`](https://developers.google.com/apps-script/reference/drive/drive-app#createFile(BlobSource)).
- Here is a basic draft code as a wrap-up of what I've understood so far from the examples I studied. For the time being, this focuses only on that content type issue. Further development is needed to process forms with multiple types of input data (not only file upload) :
    - Frontend (client) :
  
        ```javascript
        /* // Example 1
        function sendFileToDrive(file) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var content = reader.result;
                google.script.run.withSuccessHandler(updateProgressbar).uploadFileToDrive(content, file.name);
            }
            reader.readAsDataURL(file);
        }
        */
        
        // Example 2
        function sendFileToDrive(file) {
            var reader = new FileReader();
            reader.onloadend = function (event) {
                google.script.run.withSuccessHandler(updateProgressbar).uploadFileToDrive(event.target.result, file.name);
            }
            reader.readAsDataURL(file);
        }
        
        // On form submit
        function FileUpload() {
            var allFiles = document.getElementById('myFile').files;
            sendFileToDrive(allFiles[0]); // Since there is only 1 file
        }
        ```
  
    - Backend (Google Apps Script):

        ```javascript
        /* // Example 1
        function uploadFileToDrive(base64Data, fileName) {
        
            var contentType = base64Data.substring(5, base64Data.indexOf(';'));
            var bytes = Utilities.base64Decode(base64Data.substr(base64Data.indexOf('base64,') + 7));
            var blob = Utilities.newBlob(bytes, contentType, fileName);
            var driveFile = DriveApp.createFile(blob);
        }
        */
        
        // Example 2
        function uploadFileToDrive(base64Data, fileName) {
        
            var splitBase = base64Data.split(',');
            var contentType = splitBase[0].split(';')[0].replace('data:', '');
            var bytes = Utilities.base64Decode(splitBase[1]);
            var blob = Utilities.newBlob(bytes, contentType);
            blob.setName(fileName);
            var driveFile = DriveApp.createFile(blob);
        }
        ```

## 2020-04-20 [(code)](https://github.com/amindeed/Gmail-AutoResponder/tree/6f783eaec59ea7751ca44d7c438fcc8c4ed300cf/draft_code/client-to-server)
- **Objective :** Provide a same web page / frontend to both get current app's parameters' values _(= prefill form fields on page load using [`google.script.run`](https://developers.google.com/apps-script/guides/html/reference/run) to call server-side "getters")_ and update them on submit.
- Researching and testing code about [Google Apps Script Client-to-Server Communication](https://developers.google.com/apps-script/guides/html/communication)

    <br /><img src="/assets/2020-04-20 23_47_11-c2s_demo.png" alt="C2S_Demo" width="700"/><br />

- There are still concepts that I'm trying to deeply understand how they imply or impact each other, namely script scopes, APIs' scopes, whether or not it is required to connect to a GCP project, deploying as "a web app" vs "API Executable"... For instance, I had to publish the app as "API Executable" to be able to run through the Apps Script API some initialization functions _(providing 'Logs' and 'Filters' spreadsheets' IDs...etc)_. But now, as I'm working on a frontend, I have to publish the app as "a web app" to issue client-to-server calls and provide a convenient way to show and update app's configs. So I guess, I will just make my best to both learn and enhance my code as I go.

## 2020-04-18
- Working on a basic HTML file that will let us "get" and/or "set" app's parameters.
    - Information to retrieve/modify :
        - User's profile picture
        - User's ~~name~~ email
        - Time zone
        - Message body (HTML)
        - Script user's parameters :
            - `FILTERS_SS_ID`
            - `LOG_SS_ID`
            - `START_HOUR`
            - `FINISH_HOUR`
            - `TIME_INTERVAL`
            - `DST_OFFSET`
    - I had to add another scope `https://www.googleapis.com/auth/drive.readonly` to retrieve [the URL of script user's photo](https://developers.google.com/apps-script/reference/drive/user#getphotourl)


## 2020-04-17
Significant update of `README.md`'s structure and content (draft).  
Started adding old worklog entries translated from French.

## 2020-04-15, 04-16
Still refining `README.md`, along with some modifications here and there.

## 2020-04-14
- Cleaning up `README.md`

## 2020-04-13
- Exploring `gcloud` capabilities. Trying to automate/script the "GCP Project" part of the Apps Script application setup process.
- I've been trying to find a way to automate, or bypass altogether, the process described in [`clasp run` CLI doc](https://github.com/google/clasp/blob/master/docs/run.md). But, for the time being, and according to the official documentation, there is no automated way to associate a Google Apps Script project to a Standard GCP Project to allow Script functions calls through [Apps Script API](https://developers.google.com/apps-script/api/) :

    - > _**Setup Instructions :** […] 3. Set the `projectId` to your Apps Script project : […] - In the menu, click `Resources > Cloud Platform project...` - Paste `Project number` in `Change Project` and click `Set Project`._ [🌎](https://github.com/google/clasp/blob/master/docs/run.md#setup-instructions)
    - > **General procedure for using the Apps Script API to execute Apps Script functions :** [...] **Step 2:** Set up the common Cloud Platform project : _Both your script and the calling application need to share the same Cloud Platform (GCP) project. This GCP project can be an existing project or a new project created for this purpose. Once you have a GCP project, you must **switch your script project to use it**._ [🌎](https://developers.google.com/apps-script/api/how-tos/execute#step_2_set_up_the_common_cloud_platform_project)
        - > _**Switching to a different standard GCP project :** […] **(4).** In the Apps Script editor, open the script whose GCP project you want to replace. **(5).** Click **Resources > Cloud Platform project.** **(6).** In the **Change Project** section, paste the project number you copied into the text field, then click **Set Project**. **(7).** A warning screen explains the effects of changing the Cloud Platform project. Read the notice carefully, and click **Confirm**._ [🌎](https://developers.google.com/apps-script/guides/cloud-platform-projects#switching_to_a_different_standard_gcp_project)
    - > _The GCP project must be a [standard GCP project](https://developers.google.com/apps-script/guides/cloud-platform-projects#standard_cloud_platform_projects); default projects created for Apps Script projects are insufficient._ [🌎](https://developers.google.com/apps-script/api/how-tos/execute)
        - > _**When standard GCP projects are required :** […] - When you have an application that needs to execute functions in your script project using the Apps Script API's scripts.run method._ [🌎](https://developers.google.com/apps-script/guides/cloud-platform-projects#when_standard_gcp_projects_are_required)

- Apparently, there is no possibility to create credentials for a GCP project through `gcloud` CLI, which is really frustrating :
    - `gcloud` offers only the possibility to [create keys for Service Accounts](https://cloud.google.com/sdk/gcloud/reference/iam/service-accounts/keys/create).
    - [credentials - Create Api Key using gcloud? - Stack Overflow](https://stackoverflow.com/a/49465325)
        - [Create API key using gcloud [76227920] - Visible to Public - Issue Tracker](https://issuetracker.google.com/issues/76227920)
    - [google cloud platform - how to create a oauth client id for gcp programmatically - Stack Overflow](https://stackoverflow.com/questions/51549109/how-to-create-a-oauth-client-id-for-gcp-programmatically)
        - [New API to manage API OAuth client Credentials [116182848] - Visible to Public - Issue Tracker](https://issuetracker.google.com/issues/116182848#comment77)
        - [Resource to create OAuth 2.0 credentials · Issue #1287 · terraform-providers/terraform-provider-google](https://github.com/terraform-providers/terraform-provider-google/issues/1287)
    - [How to get application_default_credentials.json file? - Google Groups](https://groups.google.com/forum/#!topic/google-cloud-dev/I5uU7fO89-U)
- Many online resources suggest the use of Identity-Aware Proxy (IAP) service to programmatically create OAuth clients :
    - [**Suggesting IAP as a solution :** New API to manage API OAuth client Credentials - Issue Tracker](https://issuetracker.google.com/issues/116182848#comment75)
    - [Programmatically creating OAuth clients for IAP](https://cloud.google.com/iap/docs/programmatic-oauth-clients)
    - [apps-script-oauth2/CloudIdentityAwareProxy.gs](https://github.com/gsuitedevs/apps-script-oauth2/blob/master/samples/CloudIdentityAwareProxy.gs)
- **<u>Conslusion :</u>** Using `gcloud` would make some sense only if Google Cloud SDK is already installed and actively used by the developer wanting to deploy this Apps Script project.

## 2020-04-03 - 04-12 (intermittently)
- I had to use [`Fiddler`](https://superuser.com/a/1354620/291080) to intercept sequences of HTTP requests to Drive API URLs while using [`gdrive`](https://github.com/gdrive-org/gdrive) . Trying to mimic these requests using `CURL`.
- After days of researching, I finally managed to find `CURL` command lines corresponding to each of the following Drive operations :
    1. [Not Curl] Construct Access Token request URL; Get the code to use in the next step
    2. Request Access Token / Authorization Code
    3. Request a new Authorization Code using the refresh token
    4. Upload files to Drive; Import XLSX file as a Google SpreadSheet
    5. Create Drive Directory
    6. Move a Drive file to another folder
    7. Other useful operations :
        - Getting information about the authenticated Google user
        - Rename a file in Drive
- `CURL` will be used instead of `gdrive` from now on.
- I will probably document what I have found about dealing with Google Drive API using `curl` in dedicated MD file/Repo/Gist/Blog post.
- So, there is no need now to use Google Apps Script code in order to upload/import files to Drive. Gotta update code accordingly.

## 2020-04-03, 04-04
- Exploring alternative ways :
    - To make [continuous] deployment of the application as automated as possible.
    - To make the initial setup of the application easy, with one function call.
    - To upload/import files to Drive using just the API, without relying on third-party tools like [`gdrive`](https://github.com/gdrive-org/gdrive).
- Restructuring/Cleaning code.

## 2020-04-01, 04-02
Drafting instructions for project setup using both [`clasp`](https://github.com/google/clasp) and [`gdrive`](https://github.com/gdrive-org/gdrive). Deployed successfully an updated version of the code.

## 2020-03-29, 03-31 [(code)](https://github.com/amindeed/Gmail-AutoResponder/tree/4de2d9853bd5d869f795209ae16459321bd1db0f/app)
Exploring [`clasp`](https://github.com/google/clasp) tool for automated deployment of Google Apps Script project. Successfully deployed a first version of the code.

## 2020-03-28 [(code)](https://github.com/amindeed/Gmail-AutoResponder/commit/de9ba3b6137a64de4cd3815f814324f02d179169#diff-deb3f38e414de594d3421071ed162325)
Documenting: Collecting notes about app logic, features and auto-deployment

## 2019-10-31, 11-19
Added new examples of AppScript execution errors (from summary).

## 2019-08-26
Added first draft of `README.md`.

## 2018-09-21, 11-20 [(code)](https://github.com/amindeed/Gmail-AutoResponder/tree/2e255b5b9d820964334adf4cda92997e3f1085e5/app/frontend)

Added and updated sample frontend code using [Material Design Lite](https://getmdl.io/components/index.html).

----------------

*Worklog entries, to be translated from `worklog-fr.md`.*

## 2018-09-10
…

## 2017-12-11


## …

## 2017-07-27 [(code)](https://github.com/amindeed/Gmail-AutoResponder/blob/15601924647c0576cf0d1f88ca486a67e25c7a73/Code.js)

_Original :_  

> Continuation de l’étude et développement.
> - **Spécifications et cahier de charges** :
>     - Le script sera configuré pour exécution automatique régulière entre 20h et 6h sur chaque compte utilisateur Google.
>     - Il vérifiera les derniers messages reçu. Puisque les messages sont interprétés par Gmail comme des groupes de > discussion (threads), les discussions avec de nouveaux messages (réponses ou transferts) seront inclues.
>     - Les messages en provenance des contacts de `MyCompany` seront exclus.
>     - Option : Les messages/discussions avec le libellé Gmail `_autoRep` seront considérés comme déjà traités et seront > donc systématiquement exclus.
>     - Traitement des messages : Envoie du corp de la réponse automatique sous forme de texte riche (HTML) suivie des > informations (date, expéditeur, destinataires, objet) et une citation du contenu du message traité.
>     - Attribution du libellé Gmail `_autoRep` pour marquer le message comme traité.



## 2017-07-26 [(code)](https://github.com/amindeed/Gmail-AutoResponder/blob/6f6100735ee16a48a7d1ada8c79a07915ab96108/Code.js)
Developing a first prototype of a script to send automatic responses to emails received in a specific timeframe of each day.

![2017-07-26 - Gmail-AutoResponder](assets/2017-07-26%20-%20Gmail-AutoResponder.png)

<br />

-------------
_Archived version, from an old commit, of the original worklog (in French) : [worklog.md](https://github.com/amindeed/Gmail-AutoResponder/blob/929a26bdae365a69f56a1e951871575352800642/worklog.md)_
