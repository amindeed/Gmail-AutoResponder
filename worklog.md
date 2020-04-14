# Work Log

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

## 2017-12-11 [(code)](https://github.com/amindeed/Gmail-Autoresponder/blob/323bb1078531ae50034ddcaa058ff43d0dafdd5e/app/Archive_log.js)


## …

## 2017-07-26 [(code)](https://github.com/amindeed/Gmail-Autoresponder/blob/52cb442af57432b3a2a4068077d0438806896a43/Code.js)
…
