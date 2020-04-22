# Work Log

<br />

> _**In progress :** translating old entries from the original [french worklog](https://github.com/amindeed/Gmail-AutoResponder/blob/929a26bdae365a69f56a1e951871575352800642/worklog.md)._

<br />

<!-- ----------------------------------------------------------------------- -->

## 2020-04-22
- Got a basic file upload example to work properly.
- First working frontend example that retrieves App settings from backend.

    <br /><img src="/assets/2020-04-22 23_51_20-demo-load-settings.gif" alt="Demo Load From Backend" width="700"/><br />

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

*Entries to be translated from the [old worklog](https://github.com/amindeed/Gmail-AutoResponder/blob/929a26bdae365a69f56a1e951871575352800642/worklog.md) :*

## 2018-09-10
…

## 2017-12-11


## …


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
