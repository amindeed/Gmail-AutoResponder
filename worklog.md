# Work Log

<br />

> _**In progress :** translating old entries from the original [french worklog](https://github.com/amindeed/Gmail-AutoResponder/blob/929a26bdae365a69f56a1e951871575352800642/worklog.md)._

<br />

<!-- ----------------------------------------------------------------------- -->

## 2020-04-30
- I've been testing the `options` parameter of the method [`sendEmail(recipient, subject, body, options)`](https://developers.google.com/apps-script/reference/gmail/gmail-app#sendemailrecipient,-subject,-body,-options), which behaves the same as [`GmailThread.replyAll(body, options)`](https://developers.google.com/apps-script/reference/gmail/gmail-thread#replybody,-options), with the following code :

    ```javascript
    GmailApp.sendEmail('name@domain.com', 'Apps Script : Test message', 'This is a test messages from APps Script', {
        cc: null,
        bcc: null,
        noReply: null
    });
    ```
- Tried a few combinations of values for `cc`, `bcc` and `noReply` properties, using both free and G-Suite Google accounts, and it seemed that it is safe to always default to `null`. 
- In addition these methods check whether given email addresses (recipient, Cc and Bcc) are valid and throws the exception `Invalid email` if they're not. So there is no need to provide backend code to validate addresses.
- Updated code accordingly.
- I couldn't keep the same work pace in last couple of days due to some preoccupations. So I'm just trying here to keep my daily commitment..

## 2020-04-29
- I checked two online posts that I had added to `raw_notes.md` [on March 28](https://github.com/amindeed/Gmail-AutoResponder/commit/de9ba3b6137a64de4cd3815f814324f02d179169?short_path=deb3f38#diff-deb3f38e414de594d3421071ed162325). [One of them](https://www.labnol.org/code/20592-gsuite-account-check) suggests a method that doesn't seem to work any longer. [The other](https://stackoverflow.com/questions/57902993/google-app-script-to-check-if-an-email-exists-in-domain) suggests a seemingly working solution relying on the [Admin SDK Directory Service](https://developers.google.com/apps-script/advanced/admin-sdk-directory) that needs to be [enabled](https://developers.google.com/apps-script/guides/services/advanced#enabling_advanced_services) from the Script Editor UI through `Resources->Advanced Google Services...`, which I'm trying to avoid at the moment (unless it's required by other app features and/or makes things easier). 
- But, at the end, it seems that we can simply check whether script user's email address ends with `gmail.com` or some custom domain name! So I guess I'll settle with this for the moment :

    ```javascript
    userProperties.setProperty('ISENABLED_NOREPLY', (Session.getActiveUser().getEmail().split('@')[1]!=='gmail.com')?true:false);
    ```

## 2020-04-28 [(code)](https://github.com/amindeed/Gmail-AutoResponder/tree/946fbf632411b5ac12e045befd59088a7f5ebcc2/app)
- Finished customizing CKEditor for form's text area :
    - Set a default response message body in the backend. Trying to set a placeholder text with CKEditor 4 on the frontend, and the [Configuration Helper (`confighelper`)](https://ckeditor.com/cke4/addon/confighelper) plugin seems needed. The configuration isn't straightforward, as almost all resources I could find online suppose that a custom configuration file `config.js` along with a directory containing needed plugins are used, i.e. available for any customization, which doesn't apply to our case.
    - Considering the desired customizations, I'm trying to figure out [whether or not](https://support.ckeditor.com/hc/en-us/articles/115005281569-Shall-I-use-CKEditor-5-instead-of-CKEditor-4-is-it-better-) it's worth/easier to use CKEditor 5 instead.
    - Finally, I managed to create a basic example by checking the source code of [this blog post](https://alfonsoml.blogspot.com/2012/04/placeholder-text-in-ckeditor.html) by `confighelper` plugin author.

## 2020-04-27 [(code)](https://github.com/amindeed/Gmail-AutoResponder/tree/a0e349ce36d1604550e295d33153ed8052dd3faa/app)
- I would prefer using **CKEditor**, as a plain JavaScript solution, over **TinyMCE** which is developed in TypeScript (and I have no plans to learn TypeScript at the moment).
- According to most resources I checked, CKEditor creates its own DOM when [`replace()`](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR.html#method-replace) method is called, _right at the end of page load,_ to replace form's `textarea` element. So, I had to force CKeditor to update the text area value using the [`updateElement()`](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#method-updateElement) method before the form content is submitted to the backend. In addition, I had to use CKEditor's [`setData()`](https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_editor.html#method-setData) method, instead of setting element's `innerText` property value, in order to update the text area with the content retrieved from the backend.
- [Customizing](https://ckeditor.com/docs/ckeditor4/latest/examples/toolbar.html) CKEditor toolbar..
- Removed two directories from this repository :
    - [`draft_code/client-to-server`](https://github.com/amindeed/Gmail-AutoResponder/tree/020eca4709463f3262002dac292bb2aca472ae63/draft_code/client-to-server) : content moved to another generic repository I'm working on, to be adapted and published as a code snippet.
    - [`app/frontend`](https://github.com/amindeed/Gmail-AutoResponder/tree/799e840b14fd8547c8def4023662349322140bc1/app/frontend) : as the Material Design Lite library, on which this frontend template is based, [will no longer receive further development/updates](https://github.com/google/material-design-lite/tree/60f441a22ed98ed2c03f6179adf460d888bf459f#limited-support).

## 2020-04-26 [(code)](https://github.com/amindeed/Gmail-AutoResponder/tree/799e840b14fd8547c8def4023662349322140bc1/app)
- Tried a [basic CKEditor 4 preset](https://ckeditor.com/docs/ckeditor4/latest/examples/basicpreset.html) for message body text area, but the content is not sent to the backend on form submit. Falled back to plain HTML `textarea` which worked fine, for both retrieving and modifying settings. I'll try a [basic TinyMCE setup](https://www.tiny.cloud/docs/general-configuration-guide/basic-setup/) and see.
- Worked on another code repository.

## 2020-04-25 : _First commit of the month of Ramadan_ 🌙
- Since it is [not possible](https://stackoverflow.com/a/44401527/3208373) to change script time zone from within a Script app, I'm trying to figure out a way for providing a "script user-side" time zone parameter that can be modified using the frontend, and leave script's time zone at "GMT+00".
- A Google user isn't given a default profile picture if he has never set one manually. So, the app should provide an alternate/default picture in case [`getPhotoUrl()`](https://developers.google.com/apps-script/reference/drive/user#getPhotoUrl()) returns `null`.

    <br /><img src="/assets/2020-04-25 11_36_11-test user photo.png" alt="No Profile Picture" width="500"/><br />
    
- Added a default user profile picture encoded in base64
- It would make sense to retrieve app's settings on page load if a "enable/disable app" switch is used. There seem to be two choices for an app status switch :
    - A boolean script user property to be set accordingly.
    - Function(s) to create and delete triggers.
- `raw_notes.md` revision :
    - Deleted old non-needed entries.
    - Moved some "TODO" entries to `TODO.md`.
- Custom errors to be created for / thrown by `setProperties()` function :
    - Provided Spreadsheets IDs are not valid, either because the resources do not exist or are not readable/writable by the script user.
    - Invalid start/finish hours
    - Invalid execution time interval 
    - Invalid Cc email address.
    - "Reply with 'noreply' address" is set for non G-Suite user.
    - Message body exceeds maximum number of characters. Format/Content not allowed.

## 2020-04-24
- Enhanced code across the repository :
    - `Code.js` : get all parameters from script user properties, otherwise assign default values.
    - Replaced `LOG_SS_ID` with `LOGS_SS_ID`.
    - `frontend_index.html` : 
        - Added link to revoke script's access to user data (logout). 
        - Added default values next to input fields
- Refined/Updated `README.md` and `worklog.md`.


## 2020-04-23 [(code)](https://github.com/amindeed/Gmail-AutoResponder/tree/5aee4c4b20ac17c5e730c271471f7ed9dbd94c3d/app)
- Basic frontend example can now **"set"** Apps' settings.
- A couple of backend functions now use objects as parameters, instead of arrays. Consequently, there was one less function needed which was removed.
- Added some basic styling to highlight data retrieved from backend app.

    <br /><img src="/assets/2020-04-23 17_37_40-demo_basic_get_set.gif" alt="Basic Get/Set" width="500"/><br />
    
- All frontend functions moved to `gmail-autoresponder.js`.


## 2020-04-22
- Got a basic file upload example to work properly. **[(Code)](https://github.com/amindeed/Gmail-AutoResponder/tree/020eca4709463f3262002dac292bb2aca472ae63/draft_code/client-to-server)**

    <br /><img src="/assets/2020-04-23 00_07_14-sucess-upload-drive.gif" alt="Successful Upload to Drive" width="500"/><br />

- First working frontend example that retrieves App settings from backend. **Code : [`frontend_index.html`](https://github.com/amindeed/Gmail-AutoResponder/blob/020eca4709463f3262002dac292bb2aca472ae63/app/frontend_index.html), [`frontend.js`](https://github.com/amindeed/Gmail-AutoResponder/blob/020eca4709463f3262002dac292bb2aca472ae63/app/frontend.js)**

    <br /><img src="/assets/2020-04-22 23_51_20-demo-load-settings.gif" alt="Demo Load From Backend" width="500"/><br />

- Refined a little bit `worklog.md`.


## 2020-04-21 [(code)](https://github.com/amindeed/Gmail-AutoResponder/tree/22a47df9cd312c2dcfb28bf41dbc5617e901f829/draft_code/client-to-server)
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
   
<br />

> ## 2020-04-19 : _Missed_ 😔
> _But hey, I normally “code” more than 1 hour a day! C'mon, it's not that bad!_

<br />  

## 2020-04-18
- Working on a basic HTML file that will let us "get" and/or "set" app's parameters.
    - Information to retrieve/modify :
        - User's profile picture
        - User's ~~name~~ email
        - Time zone
        - Message body (HTML)
        - Script user's parameters :
            - `FILTERS_SS_ID`
            - `LOGS_SS_ID`
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
    <br /><img src="/assets/2020-03-30 22_51_53-Gmail AutoResponder Dev.png" alt="Associate_AppsScript_to_GCP" width="500"/><br />

## 2020-03-28 : _First commit during COVID-19 national lockdown_ 😷 [(code)](https://github.com/amindeed/Gmail-AutoResponder/commit/de9ba3b6137a64de4cd3815f814324f02d179169#diff-deb3f38e414de594d3421071ed162325)
Documenting: Collecting notes about app logic, features and auto-deployment

## 2019-10-31, 11-19
Added new examples of AppScript execution errors (from summary).

## 2019-08-26
Added first draft of `README.md`.

## 2018-09-21, 11-20 [(code)](https://github.com/amindeed/Gmail-AutoResponder/tree/2e255b5b9d820964334adf4cda92997e3f1085e5/app/frontend)

Added and updated sample frontend code using [Material Design Lite](https://getmdl.io/components/index.html).

----------------

*Entries to be translated from the [old worklog](https://github.com/amindeed/Gmail-AutoResponder/blob/929a26bdae365a69f56a1e951871575352800642/worklog.md) :*

## 2018-09-10
…

## 2017-12-11


## …

## 2017-09-12
_Original :_
> Evaluation des résultats de la session d’exécution du 11/09/2017 : **60** itérations correctes du programme ayant récupérés **66** `threads`. **66** messages traités, dont **45** sautées et **21** réponses automatiques envoyées.
> Un message récupéré depuis la boîte email `operations@OldMailServer.com` n’a pas été traité. L’hypothèse établie dans le rapport du 09/09/2017 se tient.
> - _**Révision (2019-06-08) :** Le script de test initial aurait été créé pour vérifier si l'application avait déjà traité des messages envoyés au compte non-Google `operations@OldMailServer.com` et récupérés sur la boîte Gmail G-Suite `operations@mycompany.com`, et ce en vérifiant les IDs des threads (auxquels ces messages sont respectivement attribués par Gmail), retournés par la requête de recherche, contre ceux des messages/threads traités journalisés dans le document Google Spreadsheet `Autorespond-log`. Néanmoins, l'analyse du 12/09/2017 porte ici à confusion, et comme les résulats du 11/09/2017 ne sont plus vérifiables, un nouveau script de test **[(voir code)](https://github.com/amindeed/Gmail-AutoResponder/blob/fb6665b9ab7bc662f2184463db6a97ba875adaf4/app/test_2017-09-12.js)** a été développé afin de confirmer que ces threads sont traités d'une façon normale, c.à.d. que l'**ID Gmail** (qui est différent du **`Message-ID`** de la norme **`RFC 822`**) du thread correspond à l'**ID** de son premier message. A noter que ces messages risquent quand même de ne pas être relevés par l'application à cause des éventuels retards mis à [leur récupération](https://support.google.com/mail/answer/21289?hl=en)._


## 2017-09-11
_Original :_
> Evaluation des résultats des sessions d’exécution du 09/09/2017 et 10/09/2017 : **73** messages traités, dont **51** sautées et **22** réponses automatiques envoyées.


## 2017-09-09
_Original :_
> Analyse des résultats de la session d’exécution du 08/09/2017 :
> - **58** messages traités, dont **44** sautées pour des raisons valides et **14** réponses envoyées.
> - **2** messages non traités :
>     - **MESSAGE (1):** L’heure de réception du message était très proche (en amont) de l’instant de l’itération du programme qui a eu lieu exactement à 19:06 (GMT).
>     - **MESSAGE (2):** Le message a été reçu sur la boîte email `operations@OldMailServer.com` et [récupéré](https://support.google.com/mail/answer/21289?hl=en&authuser=2) sur la boîte principale `operations@mycompany.com`.
>         - Rédaction en cours d'un script de test [(voir code)](https://github.com/amindeed/Gmail-AutoResponder/blob/98a14d321fe76297b620b05c4f1655945decd5a4/app/test_2017-09-09.js) afin de vérifier si de tels messages auraient compromis un traitement pertinent des messages: _Récupération des IDs des `threads` auxquels appartiennent les messages envoyés [exclusivement] à l’adresse `operations@OldMailServer.com`. Vérifier les valeurs récupérées contre les journaux des messages traités._


## 2017-09-08
_Original :_
> Evaluation des résultats de la session d’exécution du **07/09/2017** : **36** messages traités, dont **27** sautées pour des raisons valides et **9** réponses envoyées.


## 2017-09-07 [(code)](https://github.com/amindeed/Gmail-AutoResponder/tree/a2ea53c5e9039b5c3ca7412970b650b0a51716b8/app)
_Original :_
> Analyse des résultats de la session d’exécution du 06/09/2017 :
> - Le projet Google Apps Script `AutoRespond` est configuré avec un déclencheur en fonctions du temps qui se lance après chaque 10 minute. Les heures des premières et dernières exécutions effectives du programme sont respectivement 19:06 (GMT) et 04:56 (GMT). _En effet, le programme s’exécute continument après chaque 10 minute durant toutes les 24 heures. Cependant le traitement des messages reçus n’est effectué que si la condition est satisfaite, à savoir : être dans la plage horaire [20h-06h]._
> - Comme les messages Gmail sont organisés sous forme de [threads](https://developers.google.com/apps-script/reference/gmail/gmail-thread#) (conversations), le programme récupère à chaque exécution les nouveaux `threads` ainsi que ceux mis à jour _(c.à.d. réception de nouvelles réponses à une ancienne conversation (échange))_ dans les dernières 10 minutes et traite ensuite leurs derniers messages respectifs.
> - Pour chaque `thread`, si le dernier message ne répond à aucun critère d’exclusion, une réponse automatique lui serait envoyée ; sinon, le programme passe au `thread` suivant. Dans chacun des deux cas, les messages traités ainsi que le nombre de `threads` récupérés à chaque exécution sont journalisés. Les informations du journal (log) permettent le suivi, l’analyse et le diagnostic des éventuels problèmes rencontrés.
> - Deux cas de figures se sont présentés suite à la dernière session d’exécution; qui peuvent nécessiter une analyse de comportement du programme, une évaluation des risques ainsi que des éventuelles améliorations du code source :
>     - **MESSAGE (1):** Le message a été reçu vers 21:16 mais n’a pas été traité.
>         - Vu qu’il était le dernier message de son `thread` jusqu’à la fin de la session d’exécution, la seule cause apparente serait le fait que sa réception a coïncidé avec le déclenchement du programme et il n’a pas été récupéré parmi les messages reçus dans les dernières 10 minutes.
>         - Le message n’a pas été non plus récupéré dans l’itération suivante.
>         - Il serait donc plus prudent d’ajouter une marge d’erreur à l’intervalle de temps. Ce serait pratique d’attribuer une valeur dynamique à cet intervalle, soit par exemple **1.5x** la durée séparant deux exécutions (automatique) consécutives du programme. Documentation en cours sur [les moyens disponibles](https://developers.google.com/apps-script/reference/script/trigger) pour y parvenir.
>     - **MESSAGE (2):** Deux minutes après, et dans le même `thread`, le message a été suivi par un autre (i.e. une réponse) envoyé par (`accounting@mycompany.com`) avec l’adresse (`operations@mycompany.com`) en copie.
>         - Vu que le dernier message du `thread` venait d’une adresse mail exclue, il a été sauté.
>         - Le présent cas laisse à penser à d’autres cas probables pouvant être critique, comme celui d’un message répondant à tous les critères de réponse automatique suivi juste après, dans le même `thread`, d’un mail exclu mais sans qu’il soit envoyé depuis une autre adresse email de `MyCompany`; cas d’un accusé de lecture d’un ancien message dans le même `thread` reçu du même expéditeur, par exemple.
>         - Etude en cours d’améliorations et méthodes alternatives pour traiter avec plus de prudence les files des derniers messages reçus.


## 2017-09-06
_Original :_
> Analyse des résultats de la session d’exécution du 05/09/2017 :
> - 57 messages traités : 18 réponses envoyées, 39 messages sautés pour des raisons valides.
> - Les réponses automatiques envoyées ont couverts tous les `threads` Gmail reçus dans la plage horaire [20h-06h].
> - Mises à jour mineures du code source.
> - Documentation sur les améliorations envisagées :
>     - Utilisation du [Cache](https://developers.google.com/apps-script/reference/cache/) : pour le stockage temporaire et la consultation rapide des identifiants des derniers messages traités, au lieu d’extraire et de rechercher dans toutes les valeurs de la colonne D `Message ID` de la première feuille du document `Google Spreadsheet` de journalisation `Autorespond-log`.
>     - Etude d’une nouvelle architecture `Master/Slave` du programme pour déclencher simultanément les réponses automatiques de plusieurs comptes depuis un même script asynchrone avec des requêtes `HTTP POST`.


## 2017-09-05
_Original :_
> Évaluation de l’exécution du programme du compte `OPERATIONS` entre le 31/08/2017 (soir) et le 05/09/2017 (matinée):
> - 162 threads détectés, dont 114 sautés et 48 réponses envoyées.
> - Ajout d'adresse mails à la liste d’exclusion.


## 2017-08-31
_Original :_
> Evaluation de l’exécution de la session du 31/07/2017 :
> - 50 mails traités, dont 37 sautés.
> - Ajoutée des adresses à la liste d’exclusion
> - Un message `SPAM` sans une vraie adresse `envelop sender` ni `From :` a déclenché une erreur, puisque la méthode [`GmailMessage.getFrom()`](https://developers.google.com/apps-script/reference/gmail/gmail-message#getfrom) dans le code a retourné la valeur `Judith Pin  <>` qui n’est pas une adresse valide pour envoyer une réponse avec la méthode [`GmailThread.reply(body, options)`](https://developers.google.com/apps-script/reference/gmail/gmail-thread#replybody-options). Bien que l’erreur n’était pas bloquante et ait été bien reportée par email, il serait plus judicieux de journaliser de tels cas avec le message d’erreur comme note. Cette suggestion peut faire objet d’une future amélioration du code avec des éventuels [traitements d’exceptions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch).
> -  _Idées et prévisions_ : Exécution du programme sur toutes les boîtes emails depuis un même programme central :
>     - La méthode la plus sûre serait de communiquer, depuis le script `operations`, avec d’autres scripts `Google Apps Script` associés aux autres comptes, en utilisant des requêtes HTTP POST sur des connexions chiffrées (SSL/TLS).
>     - Comme prérequis, il va falloir d’abord publier chacun des autres scripts en tant qu’application web (avec d’éventuelles restrictions d’accès pour protéger les données).
>     - Les autres scripts auraient les droits suivant :
>         - Modification du document `Google Spreadsheet` : `Autorespond-log`, propriété du compte `operations@mycompany.com`.
>         - Lecture depuis le document `Google Spreadsheet` : `Autorespond-config`, propriété du compte `operations@mycompany.com`.
>     - Consultation en cours des documentations ainsi que les forums d’aide et support officiels aux sujets précités.


## 2017-08-30 [(code)](https://github.com/amindeed/Gmail-AutoResponder/tree/f13a3c815bba3059f40e1bab617e449647090313/app)
_Original :_
> Confirmation de l’exécution optimale de la session du 29/07/2017 du programme associé au compte Google `operations@mycompany.com`.
> Le test d’archivage du journal des messages traités s’est exécuté comme planifié et avec succès. Dorénavant, au début de chaque mois, l’historique des opérations du mois précédent sera archivé dans une feuille séparée du même fichier.
> Etude en cours de la possibilité de gérer les réponses automatiques de toutes les boîtes emails de la société avec un seul programme lisant les configurations depuis un même fichier et enregistrant toutes les opérations exécutées dans le même journal. Si cela s’avère faisable, une révision considérable du tout le code source serait nécessaire.


## 2017-08-29
_Original :_
> Confirmation de l’exécution optimale de la session du 28/07/2017 du programme associé au compte Google `operations@mycompany.com` avec les dernières mises à jours du code.
> - Améliorations :
>     - Inclusion du code HTML constituant le corps du message de réponse dans un fichier HTML du même projet `Google Apps Script`, au lieu de l’importer depuis un fichier externe hébergé sur un espace d’hébergement web tiers.
>     - Rajout d’un fichier de script supplémentaire au même projet et sa programmation pour exécution automatique mensuelle. Le script archivera les opérations (i.e. réponses envoyées, et messages sautés) de chaque mois dans une nouvelle feuille du document log `Spreadsheet` `Autorespond-log` afin d’alléger la feuille principale du journal.
>     - Le code source sera publié le 30/08/2017
> - Configuration provisoire pour test et validation : le script `Archive_log.gs` a été paramétré pour exécution automatique mensuelle le 30 de chaque mois ; en l’occurrence, une première exécution aurait lieu le lendemain 30/08/2017.


## 2017-08-28
_Original :_
> Evaluation des performances du programme associé au compte `operations@mycompany.com` durant son exécution du 26/08/2017 au 28/08/2017 :
> - **87** messages traités:
>     - **16** réponses automatiques envoyées, dont **5** étaient non pertinentes (adresses email à ajouter à la liste d'exclusion)
>     - **71** messages sautés pour des raisons valides.
> - Améliorations du code :
>     - Ajout d’une nouvelle feuille dans le fichier de journalisation `Autorespond-log` pour l’enregistrement de l’heure d’exécution ainsi que le nombre de conversations (threads) Gmail (récupérés et traités) du dernier intervalle de temps (prédéfini, et après lequel le programme se ré-exécute).
>     - Marquage de la fin de session d’exécution globale (20h-06h) sur chacune des feuilles du journal afin d’en faciliter la lecture et l’analyse.
>     - Le code source sera publié le 30/08/2017


## 2017-08-26
_Original :_
> Evaluation des performances du programme associé au compte `operations@mycompany.com` durant son exécution entre 25/08/2017 à 20:00 et 26/08/2017 à 06:00 :
> - **32/33** des messages reçus dans la plage horaire 20h-06h ont été traités.
>     - **1** message non détecté. Il s’agit d’un deuxième accusé de lecture du même message par le même destinataire. Vu que les deux emails font partie de la même conversation (thread) Gmail, seul le plus récent a été traité.
>     - **3** réponses automatiques envoyées
>     - **29** messages exclus pour des raisons valides
> - Vu le résultat assez satisfaisant de son exécution, le code source -en sa dernière version- sera retenu.


## 2017-08-25 [(code)](https://github.com/amindeed/Gmail-AutoResponder/blob/5dd721f5dedab3a6b3547f4fea1c4a912aaf0840/Code.js)
_Original :_
> Bilan de l’exécution du programme pour le compte `operations@mycompany.com` pour le 24/08/2017 :
> - 17 réponses automatiques envoyées entre 20:28 et 06:35 (heure locale)
> - Amélioration du programme :
>     - Réorganisation des lignes de déclaration des variables pour une meilleure lisibilité et portabilité du code.
>     - Enregistrement des configurations sur une seule feuille du document `Autorespond-config` avec plusieurs colonnes, au lieu de plusieurs feuilles contenant chacune un filtre. L'ancienne version fichier a été archivée sous le nom [`Autorespond-config_OLD-till-2017-08-24`](app/Autorespond-config_OLD-till-2017-08-24.xlsx). Adaptation du code.
> - Rajout d’une valeur de décalage pour faciliter l’ajustement de la plage horaire d’exécution en cas de changement de l’heure locale.
> - Utilisation d’une adresse générique `no-reply` afin de dissuader les destinataires de répondre directement aux messages automatiques. Par ailleurs, cela nous épargnera de configurer et maintenir sur chaque installation du logiciel `Outlook` un filtre pour en supprimer les copies reçues.
> - Exclusion des adresses email contenant les mots `noreply` et `no-reply`.
> - Journalisation de tous les emails, traités et sautés.


## 2017-08-24
_Original :_
> Bilan de l’exécution du programme pour le compte `operations@mycompany.com` :
> - 24 réponses automatiques envoyées entre 21:06 et 06:26 (heure locale).
> - La stratégie adoptée par les services et applications Google pour déterminer l’heure exacte des événements (l’heure de réception des messages en l’occurrence) porte plutôt à confusion. Par conséquent, comme Google affirme  qu’elle [utilise l’heure UTC](https://support.google.com/calendar/answer/37064?hl=en) sur ses services en ligne, une plage horaire plus large sera utilisée pour que l’intervalle **20h-06h** (heure locale) soit toujours couvert malgré les éventuels changements (i.e. début, suspension et fin de l’heure d’été). La ligne de code suivante :
>     - `if (((hour < 6) || (hour >= 20)) && ((threads = GmailApp.search('is:inbox after:' + timeFrom)).length !== 0)) {` sera donc modifié en :
>     - **`if (((hour < 6) || (hour >= 19)) && ((threads = GmailApp.search('is:inbox after:' + timeFrom)).length !== 0)) {`**.
> - Confirmation avec l'équipe des Opérations de la liste des contacts à exclure de la réponse automatique.
> - Désinscription de quelques newsletters via les liens fournis dans les corps de leurs messages respectifs.
> - Modification du message de réponse automatique : l’adresse de modération `amine@mycompany.com` en `Cci` au lieu de `Cc`.
> - Groupement des fichiers du programme dans un même dossier sous `Google Drive`. Partage avec le compte Google de `AMINE` (lecture et modification) pour faciliter (centraliser) les consultations et les mises à jour.


## 2017-08-23 [(code)](https://github.com/amindeed/Gmail-AutoResponder/blob/d2bd4d61f82f5c7d3263340f00c7b4bf60527633/Code.js)
_Original :_
> Fin du développement de la deuxième version (améliorée).
> - Tests appliqués et réussis :
>     - Exclusion des conversations Gmail (avec de nouveau message) au-delà des dernières 10 minutes
>     - Exclusions des messages envoyés depuis des adresses avec les alias `MAILER-DAEMON@*` et `postmaster@*`
>     - Exclusion des messages en provenance des adresses emails de `MyCompany` (domaine principal + tous les domaines alias)
>     - Exclusion des accusés de lecture
>     - Exclusion des messages avec des destinations anonymes (`undisclosed-recipients`)
>     - Exclusion des messages déjà traités (i.e. journalisés sur le fichier `Autorespond-log`)


## 2017-08-22
_Original :_
> Correction et amélioration du code :
> - Résolu : Interprétation comme expression régulière des chaînes de caractères extraites des fichiers de configuration.
> - Tests, adaptations et corrections.


## 2017-08-19
_Original :_
> Problèmes en cours de traitement :
> - Le contenu extrait des cellules de la feuille `From_regex_blacklist` du document `Google Spreadsheet` `Autorespond-config`, par la fonction `MatchesRegex()` ne semble pas être correctement interprété comme étant une expression régulière contre laquelle l’expéditeur devrait être vérifié afin d’exclure les adresses email de `MyCompany` ainsi que les adresses emails d’administrateur système réservées `postmaster@...` et `mailer-daemon@...`.
> - La fonction `ContainsString()` appliquée sur les en-têtes de l’email (i.e. message brut/original) ne détecte pas la présence des expressions `report-type=disposition-notification` et `report-type=delivery-status`, ce qui aurait permis l’exclusion des accusés de lecture et des rapports de remise.


## 2017-08-18 [(code)](https://github.com/amindeed/Gmail-AutoResponder/blob/f948d191cc8f2856a21768ef1621029f790d0aa7/Code.js)
_Original :_
> - Définitions complètes des fonctions d’extractions et de vérification de valeurs depuis des documents `Google Spreadsheet` (configurations et journaux `Logs`). Le fichier des configuration `Autorespond-config` contient les feuilles suivantes: `To_whitelist`, `To_regex_whitelist`, `To_blacklist`, `To_regex_blacklist`, `From_whitelist`, `From_regex_whitelist`, `From_blacklist`, `From_regex_blacklist`, `msgHeaders_blacklist`, `msgHeaders_regex_blacklist`.
> - Un modèle du fichier `Autorespond-config` sera ultérieurement ajouté au code source sous le format XLSX.
> 
> ![2017-08-23 - Gmail-Autoresponder](assets/2017-08-23%20-%20Gmail-Autoresponder.png)
> 
> - Test et débogage du code.
> 
> ![2017-08-18 - Gmail-AutoResponder](assets/2017-08-18%20-%20Gmail-AutoResponder.png)


## 2017-08-17 [(code)](https://github.com/amindeed/Gmail-AutoResponder/blob/95193ad863ea52cd2eb06162e30fc608239bbefa/Code.js)
_Original :_
> Optimisation du code :
> - Améliorations apportées ou en cours de développement :
>     - Lecture de configurations depuis un document `Google Spreadsheets` (`Autorespond-config`),
>     - Enregistrement (journalisation) et vérification des informations identifiant les messages traités dans/depuis un document `Google Spreadsheets` (`Autorespond-log`),
>     - Définition de fonctions génériques pour vérifier les données des en-têtes des messages contre les données extraites des documents précités,
>     - Récupération du message de réponse automatique (corps HTML) depuis un emplacement sécurisé sur l’espace d’hébergement web de la société.
>     - Utilisation d’une combinaison de configurations pour filtrer les messages à traiter,


## 2017-08-11
_Original :_
> Test et évaluation de la lecture et écriture de données sur des documents `Google Spreadsheet`, pour la journalisation des opérations et la lecture de configurations.


## 2017-08-09
_Original :_
> Améliorations du code : Premiers essais et évaluation d’une journalisation des opérations vers des documents `Google Spreadsheet`, proprité du même compte Google exécutant le script.


## 2017-08-08
_Original :_
> La solution finalement retenue et implémentée pour le stockage et l’importation du contenu du corps de message de réponse est l’hébergement d’un fichier HTML sur notre espace web, sous un répertoire protégé par nom d’utilisateur et un mot de passe. Tests et validation.


## 2017-08-07
_Original :_
> **_Problématique_** : Inclusion d’un texte unique dans le corps du message de réponse sans aucune mention d’informations de contact au format texte. La solution envisagée et d’inclure un tableau de contacts sous format Image dans le corps du message.
> **Améliorations étudiées** :
> - Inclusion du corps de message au format HTML depuis un fichier externe :
>     - Cas d’un fichier texte au format HTML stocké sur `Google Drive`. **Difficulté** : Aucune procédure simple et fonctionnelle n’a été trouvée pour lire le contenu brut d’un fichier texte stocké sur `Google Drive`.
>     - Cas d’un document `Google Docs` exporté au format HTML. **Difficulté** : Il était possible de récupérer le contenu d’un document `Google Docs` sous forme de code HTML et l’insérer dans le corps du message de réponse, mais l’image est par défaut bloquée par la plupart des clients de messagerie modernes puisqu’elle est hébergée dans un emplacement externe.
>     - Cas d’un fichier texte au format HTML récupéré via un URL : Un fichier contenant le contenu du corps du message au format HTML a été stocké sur notre espace d’hébergement web, et récupéré via l’URL `http://mycompany.com/email_body.html`. L’image présentant le tableau des contacts y a été codée en Base64 . **Difficulté** : Le corps du message généré dépasse ainsi la taille maximale autorisée pour un script/projet `Google Apps Script`.


## 2017-08-02
_Original :_
> Optimisation du code source du script associé à la boîte email `operations@mycompany.com` :
> - Exclusion des messages (souvent spam) dont la destination est anonyme (`undisclosed-recipients`)
> - Exclusion des messages automatiques envoyés depuis des administrateurs de serveurs de messagerie (`mailer-daemon`, `postmaster`)
> - Exclusion des accusés de lecture et des rapports de remise.


## 2017-08-01
_Original :_
> Coordination avec l’équipe des opérations et discussions à propos de la meilleure stratégie à adopter pour la programmation des messages de réponse automatique envisagée hors les heures de travail.


## 2017-07-29
_Original :_
> - Véirication des résultats de la première exécution programmée entre 06:00GMT et 20:00GMT.
> - **Idées pour amélioration:**
>     - Exclusion des accusés de lecture. Il va falloir interpréter en-avale les en-têtes dans le code source (en-têtes) de chaque email traité afin de vérifier si le contenu [MIME](https://en.wikipedia.org/wiki/MIME#Report) `multipart/report` est de type : `report-type=disposition-notification`.
>     - Précautions pour assurer une exécution continue du programme jusqu’à la fin de la plage horaire prédéfinie. Cela dépend de plusieurs facteurs :
>         - Le temps d’exécution maximal autorisé durant une journée (24h). Les références en ligne à ce sujet ([documentation Google officielle](https://developers.google.com/apps-script/guides/services/quotas#current_limitations) comprise) laissent des ambiguïtés : ce serait entre [1h](https://webapps.stackexchange.com/a/90089) et [6h](https://developers.google.com/apps-script/guides/services/quotas#current_quotas). Par conséquent, l’intervalle de temps entre chaque exécution du script devra être convenablement choisi selon le temps moyen nécessaire pour le traitement des derniers messages reçus sur le compte mail.
>         - Le fuseau horaire et l’heure d’été. Afin d’éviter toute confusion, [Google utilise à la base l’heure UTC sur ses plateformes et services](https://support.google.com/calendar/answer/37064?hl=en), y compris Google Apps Script. Par conséquent, et suite aux changements de l’heure locale, il serait difficile d’inclure des référence horaires dynamiques dans le code source du script ou bien de les modifier manuellement à chaque changement. A concevoir donc, éventuellement, une solution pour adapter automatiquement la plage horaire. En attendant, une plage horaire plus inclusive ; 19h-6h (GMT), soit 20h-7h (GMT+1), sera utilisée.
>         - Voir la possibilité de vérifier l’authenticité des expéditeurs (signatures des e-mails…)
>         - Externaliser les filtres et les contenus personnalisés pour une meilleure portabilité du code.


## 2017-07-28 [(code)](https://github.com/amindeed/Gmail-AutoResponder/blob/328c9e135917e3ea50b523039dace52472977bc7/Code.js)
_Original :_  
> - Fin de développement de la première version du script.
> - Première exécution (automatique) de test pour la boîte email `operations@mycompany.com` prévue entre 28/07/2017, 20:00GMT et 29/07/2017 06:00GMT.
>    
> ![2017-07-28 - Gmail-Autoresponder](assets/2017-07-28%20-%20Gmail-Autoresponder.png)


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
_Archived version (from an old commit) of the original french worklog : [worklog.md](https://github.com/amindeed/Gmail-AutoResponder/blob/929a26bdae365a69f56a1e951871575352800642/worklog.md)_
