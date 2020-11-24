# Work Log

## 2020-06-10

- Basically, there are 3 building blocks of the problem to be addressed/implemented :
    1. Full OAuth2 flow.
    2. User session.
    3. (1+2) Turn stateless authenticated requests _[i.e. POST requests each with an authentication bearer obtained after a successful OAuth flow]_ into stateful requests, by providing multi-user sessions _[to let each user run his own instance of the Apps Script webapp against his Google account]_ and seamlessly process signup, login, logout and access token refresh operations.
- Suggested core packages to be used (along with any required dependencies) :
    - [google-auth-library](https://github.com/googleapis/google-auth-library-nodejs), or [passport-google-oauth](https://github.com/jaredhanson/passport-google-oauth)
    - [express-session](https://github.com/expressjs/session)
    - A basic session store, such as [connect-session-sequelize](https://github.com/mweibel/connect-session-sequelize) or [session-file-store](https://github.com/valery-barysok/session-file-store).
    - _Possibly :_ [body-parser](https://github.com/expressjs/body-parser), [uuid](https://github.com/uuidjs/uuid)
- Interesting resources :
    - [Google - OAuth 2.0 : Refresh token expiration](https://developers.google.com/identity/protocols/oauth2#expiration)
    - [OAuth flow / sequence diagram (1)](https://iteritory.com/wp-content/uploads/2018/08/oAuth2-implicit-grant-flow-diagram.gif). _[[Source]](https://iteritory.com/easy-tutorial-on-oauth2-0-resource-owner-password-credential-flow/)_
    - [OAuth flow / sequence diagram (2)](https://images.viblo.asia/full/a2e9badd-553d-4fcc-bd3a-6363fcffe4a8.png). _[[Source]](https://viblo.asia/p/authentication-with-google-oauth-using-nodejs-passportjs-mongodb-gAm5yqAV5db)_
    - [OAuth flow / sequence diagram (3)](https://www.sohamkamani.com/37076b4d79602c984e15c9a9eb60b7a9/node-oauth.svg). _[[Source]](https://www.sohamkamani.com/blog/javascript/2018-06-24-oauth-with-node-js/)_
    - [Flowchart of a Twitter OAuth authentication webapp](https://cdn-media-1.freecodecamp.org/images/1*hYMUC_9w-Szc075Uztq2bw.jpeg). _[[Source]](https://www.freecodecamp.org/news/how-to-set-up-twitter-oauth-using-passport-js-and-reactjs-9ffa6f49ef0/)_

## 2020-05-28
- I've decided to give the idea of _"making an API proxy"_ another go, after checking [@tanaikech](https://github.com/tanaikech)'s great [write-up about GAS Web Apps](https://github.com/tanaikech/taking-advantage-of-Web-Apps-with-google-apps-script). Here is the summary :

    <br /><img src="/assets/AppsScript_doPost().png" alt="AppsScript_doPost().png" width="700"/><br />

    - The web app will be executed as the user accessing it, either the owner or any other Google user.
    - The Apps Script project needs to be shared with any Google user that we would want to access the web app.
    - The Google user accessing the web app is required to provide a [OAuth access token](https://developers.google.com/apps-script/reference/script/script-app#getoauthtoken) as an authorization bearer in each GET or POST request sent to web app's URL.
    - On first time access, the user will be redirected to a web page to grant access to the scopes required by the app.
- Communicationg through GET and POST requests to a Google Apps Script web app from a third party application, NodeJS for instance : _A good [starter code](https://developers.google.com/drive/api/v3/quickstart/nodejs#step_3_set_up_the_sample) is provided in the Google documentation_.  
    There are a couple of adjustments and customizations to consider :
    - The example is geared towards CLI use, rather than in-browser use. So we'll need to modify the code to make it process [web app OAuth credentials](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow) (with custom redirect URL...etc)
    - Manage authentication tokens using sessions/cookies instead of reading/writing server-side files.
    - Slightly redesign the authentication and the access workflow.
    - A sample code (both GAS backend and client NodeJS) will be separately developed as a PoC.

## 2020-05-25
- Using `doPost()` to handle and process POST requests to the app seems to cause a lot of confusions and issues[⁽¹⁾](https://stackoverflow.com/questions/29525860/google-apps-script-cross-domain-requests-stopped-working)[⁽²⁾](https://stackoverflow.com/questions/56502086/google-app-script-web-app-get-and-post-request-blocked-by-cors-policy)[⁽³⁾](https://stackoverflow.com/questions/53433938/how-do-i-allow-a-cors-requests-in-my-google-script)[⁽⁴⁾](https://stackoverflow.com/questions/43238728/unable-to-send-post-request-to-google-apps-script)[⁽⁵⁾](https://stackoverflow.com/questions/57426821/post-data-from-javascript-to-google-apps-script)[⁽⁶⁾](https://ramblings.mcpher.com/google-apps-script-content-service/) around : 
    - _CORS (Cross-Origin Resource Sharing)_[⁽⁷⁾](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)[⁽⁸⁾](https://cloud.google.com/storage/docs/cross-origin), 
    - [web app access/permissions](https://developers.google.com/apps-script/guides/web#deploying_a_script_as_a_web_app), 
    - [head vs versioned deployments](https://developers.google.com/apps-script/concepts/deployments), 
    - possibly the used [Apps Script runtime](https://developers.google.com/apps-script/guides/v8-runtime).     
    
    I don't want to resort to "hacky ways", so I think (for the time being) I'll just continue developing and refining functions as I have been and consider [using Apps Script API to run them](https://developers.google.com/apps-script/api/reference/rest/v1/scripts/run) from any third party application.
- I'm receiving daily a summary of a significant number of the same error message for a running instance of the application. Unfortunately, regular Stackdriver logs do not provide any useful information, so I think I'll associate the Script app to a GCP project to get access to advanced logging.

    <br /><img src="/assets/2020-05-25 16_01_38-Summary of failures for Google Apps Script_ Copy of Gmail AutoResponder Dev - te.png" alt="GApps Errors" width="400"/><br />

## 2020-05-19 : _Last commit of the month of Ramadan_ 🌙
- Preparing code to test and progressively convert JavaScript client code to Ajax POST requests to be processed by the `doPost()` backend function.
- Setting up a custom GCP project for a script gives you access to verbose and more informative logs on each function call, which turns out to be fairy useful when debugging.
- Migrated `raw_notes.md`'s section about _"scripted deployment of Apps Script projects"_ to [DevOps Lab](https://github.com/amindeed/DevOps-Lab/blob/3bfc28b738adb94006fe5b0674c9c1ec94a5c031/AppsScript_AutoDeploy.md) repository.

## 2020-05-18
Since I often start working late at night, it is sometimes challenging to commit anything significant before midnight. So I'll leave this note here and be back a few hours later with more updates..

## 2020-05-17
- For some reason, the format used for JavaScript files documentation header made functions unrecognized :
    ```
    TypeError: google.script.run.withSuccessHandler(...).withFailureHandler(...).appinit is not a function
    ```
    Corrected headers of the files `appinit.js`, `Code.js` and `gmail-autoresponder.js`.

## 2020-05-16
- As [I already pointed it out](#2020-05-09), I'm thinking about making the code base "convertible" to other backend language, and this is how I'm planning to proceed :
    - **Client vs server JavaScript libraries :** Separate functions that run on the backend from those mainly executed client-side.
    - **Run Apps Script code as backend-only, and ultimately as a "API Proxy" :** Deploy code as "API Executable"; All client-side tasks will be run through HTTP POST requests, i.e. [`doPost()`](https://developers.google.com/apps-script/guides/web#request_parameters) will be the main entry point, instead of calling functions through the [`google.script.run` API](https://developers.google.com/apps-script/guides/html/reference/run).

## 2020-05-15
- Made the repository **public**.

## 2020-05-14
- Bringing together all the needed [Materialize](https://materializecss.com/) components to rebuild the frontend page.

    <br /><img src="/assets/2020-05-14 23_37_54-Materialize.png" alt="Materialize" width="400"/><br />

- Exploring Materialize website, checking and testing examples and sample codes.

<br />

> ## 2020-05-13 : _Missed_ 💢
> ...

<br />  

## 2020-05-12
- Exploring the possibility of building a fresh frontend with [Materialize](https://materializecss.com/) CSS framework, especially as there seem to be some good combinations with [CKEditor Inline mode](https://ckeditor.com/docs/ckeditor5/latest/examples/builds/inline-editor.html).
- Been testing app's behaviour when the added switch is turned on or off: _the app stops/starts sending responses accordingly, just as expected/desired._
- I should consider adding emails from Google (like Apps Script 'Summary of failures' sent from `apps-scripts-notifications@google.com`) to `From` filters. I had some test instances respond to these emails.

## 2020-05-11
- Added parameter (script user property) with binary value ('YES'/'NO') to enable/disable the app. Default value is 'NO'.
- Refined a little bit `README.md`.
- `TODO.md` content merged into `raw_notes.md`.

## 2020-05-10 [(code)](https://github.com/amindeed/Gmail-AutoResponder/tree/526559f64d535b8ef845f13c12b4141958be400b/app)
- First complete (backend and frontend) implementation of the cycle : `Initialize WebApp` ➝ `Modify settings` ➝ `Show updated settings` ➝ `Reset WebApp`:
    - New 3rd party component : [`SweetAlert2`](https://sweetalert2.github.io/), used instead of JavaScript's `alert()`.

    <br /><img src="/assets/2020-05-10 22_56_04-init-reset-demo.gif" alt="Init-Reset-Demo" width="500"/><br />
    
#### _[`ScriptApp.getService().getUrl()`](https://developers.google.com/apps-script/reference/script/service#getUrl()) return values, WTF?_
- I had some fun checking and comparing return values of the Apps Script method `ScriptApp.getService().getUrl()`, depending on multiple factors : 
    - _Account type (Free vs G-Suite),_ 
    - _Runtime (Legacy (Rhino, ES5) vs V8),_ 
    - _Caller of the function :_
        - _Manually, on the Apps Script Editor (`Logger.log(ScriptApp.getService().getUrl())`)_
        - _As a response to a GET request (`doGet()`)_
        - _Client-side (`google.script.run`)_
    - _Version of the deployed code (latest/dev vs specific/prod)_
- **Conclusion:** the returned URL is almost unpredictable!
   
    > ### 1) Gmail.com (Free)
    > - **Script Editor : `Logger.log(ScriptApp.getService().getUrl())`**
    > 	- **V8 Enabled :** `https://script.google.com/macros/s/{Dev-Deployment-ID}/dev`
    > 	- **V8 Disabled :** `https://script.google.com/macros/s/{Prod-Deployment-ID}/exec`
    > - **Deployed Web App :**
    > 	- **V8 Enabled :**
    > 		- **GET response `doGet()` :**
    > 			- Dev version (latest code deployed) : `https://script.google.com/macros/s/{Dev-Deployment-ID}/dev`
    > 			- Prod version (specific version deployed) : `https://script.google.com/macros/s/{Prod-Deployment-ID}/exec`
    > 		- **Called client-side : `google.script.run`**
    > 			- Dev version (latest code deployed) : `https://script.google.com/macros/s/{Dev-Deployment-ID}/dev`
    > 			- Prod version (specific version deployed) : `https://script.google.com/macros/s/{Prod-Deployment-ID}/exec`
    > 	- **V8 Disabled :**
    > 		- **GET response `doGet()` :**
    > 			- Dev version (latest code deployed) : `https://script.google.com/macros/s/{Dev-Deployment-ID}/dev`
    > 			- Prod version (specific version deployed) : `https://script.google.com/macros/s/{Prod-Deployment-ID}/exec`
    > 		- **Called client-side : `google.script.run`**
    > 			- Dev version (latest code deployed) : `https://script.google.com/macros/s/{Prod-Deployment-ID}/exec`
    > 			- Prod version (specific version deployed) : `https://script.google.com/macros/s/{Prod-Deployment-ID}/exec`
    > 										
    > ### 2) _mydomain.com_ (G-Suite)
    > - **Script Editor : `Logger.log(ScriptApp.getService().getUrl())`**
    > 	- **V8 Enabled :** `https://script.google.com/macros/s/{Dev-Deployment-ID}/dev`
    > 	- **V8 Disabled :** `https://script.google.com/a/mydomain.com/macros/s/{Prod-Deployment-ID}/exec`
    > - **Deployed Web App :**
    > 	- **V8 Enabled :**
    > 		- **GET response `doGet()` :**
    > 			- Dev version (latest code deployed) : `https://script.google.com/macros/s/{Dev-Deployment-ID}/dev`
    > 			- Prod version (specific version deployed) : `https://script.google.com/macros/s/{Prod-Deployment-ID}/exec`
    > 		- **Called client-side : `google.script.run`**
    > 			- Dev version (latest code deployed) : `https://script.google.com/macros/s/{Dev-Deployment-ID}/dev`
    > 			- Prod version (specific version deployed) : `https://script.google.com/a/mydomain.com/macros/s/{Prod-Deployment-ID}/exec`
    > 	- **V8 Disabled :**
    > 		- **GET response `doGet()` :**
    > 			- Dev version (latest code deployed) : `https://script.google.com/a/mydomain.com/macros/s/{Dev-Deployment-ID}/dev`
    > 			- Prod version (specific version deployed) : `https://script.google.com/macros/s/{Prod-Deployment-ID}/exec`
    > 		- **Called client-side : `google.script.run`**
    > 			- Dev version (latest code deployed) : `https://script.google.com/a/mydomain.com/macros/s/{Prod-Deployment-ID}/exec`
    > 			- Prod version (specific version deployed) : `https://script.google.com/a/mydomain.com/macros/s/{Prod-Deployment-ID}/exec`
    
    
    
## 2020-05-09
- Intended behaviour of the webapp, depending on the [`flag`](#2020-05-08) value :
    - **`flag === value1`** : _Typically, first time run_ :
        1. **Frontend :** Apps settings form is disabled.
        2. **Backend :** 
            - Any submitted data will be rejected (i.e. `setSettings()` won't modify any properties).
            - `appinit()` execution is allowed
    - **`flag === value2`** : _Web app already intialized/configured_ :
        1. **Frontend :** Apps settings form is enabled
        2. **Backend :**
            - Any form data submitted by the user will be applied.
            - `appinit()` execution is not allowed, unless an "App Reset" is explicitly requested.
- I'm kind of resisting the idea of using templated HTML outputs, maybe because I don't want the code to be closely tied to Google Apps Script's specific concepts and "ways of doing things", and so keep it clean and "easily convertible" to other backend languages.
- Exploring possible combinations, _as far as allowed by the V8 runtime of the Google Apps Script framework_[⁽¹⁾](https://stackoverflow.com/a/60174689/3208373)[⁽²⁾](https://developers.google.com/apps-script/guides/v8-runtime#improved_function_detection), of asynchronous execution and exception handling for both backend and frontend functions in order to address the above scenario.
- Finished importing entries from the old worklog.
- Some `README.md` refinements.

## 2020-05-08
- **Exploring :** On page/webapp URL load, a backend flag value would be checked first. Depending on the value of this flag, the app would decide whether to load the form to view/update the settings (i.e. app already initialized), or call `appinit()` backend function (i.e. first time run).
- **Things to consider :** As previously tested, loading dynamic HTML content into the frontend seems to require backend functions to return HTML code through [`HtmlService.createTemplateFromFile()`](https://developers.google.com/apps-script/reference/html/html-template) (i.e. templated HTML) instead of [`HtmlService.createHtmlOutput()`](https://developers.google.com/apps-script/reference/html/html-output).

## 2020-05-07
- Relying on a `GET` parameter value, `WebAppURL?reset=true` for instance, is not safe because the URL is kept with it's parameters, so if the page gets reloaded the application will be reset again!

    ```javascript
    function doGet(e) {

        var userProperties = PropertiesService.getUserProperties();

        if ( (userProperties.getProperty('INIT_ALREADY_RUN') !== 'YES') || (e.parameter.reset === 'true') ) {

            Logger.log(appinit());
            return HtmlService.createHtmlOutputFromFile('index')
                   .setTitle('Gmail AutoResponder - Settings');
        } else {

            return HtmlService.createHtmlOutputFromFile('index')
                   .setTitle('Gmail AutoResponder - Settings');
        }
    }
    ```
- Odd behaviour of Google Apps Script for G-Suite accounts (first noticed on [May 06](#2020-05-06), and thouroughly investigated on [May 10](https://github.com/amindeed/Gmail-AutoResponder/blob/master/worklog.md#2020-05-10-code)):
    - When Chrome V8 runtime is enabled, `ScriptApp.getService().getUrl()` returns : `https://script.google.com/macros/s/{Deployment-ID}/(exec|dev)`.
    - When Chrome V8 runtime is disabled, `ScriptApp.getService().getUrl()` returns : `https://script.google.com/a/mydomain.com/macros/s/{deployment-id}/(exec|dev)`.
- Tried [Templated HTML with scriplets](https://developers.google.com/apps-script/guides/html/templates) to "simulate" a page reload after `resetApp()` function is run : _it is not possible to load a URL, dynamically provided by the scriplet `<?= ScriptApp.getService().getUrl() ?>` and using [`window.open()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/open), into the active window, unless you override the recommended [default behaviour](https://developers.google.com/apps-script/reference/html/x-frame-options-mode) of Google Apps Script, which protects against clickjacking by setting the `X-Frame-Options` HTTP header._
   
    <br /><img src="/assets/2020-05-08 22_54_03-Gmail AutoResponder - Settings.png" alt="X-Frame-Options" width="500"/><br />
   
- Using `window.write()`, overwrite index page with its same code returned, as a HTML templated code, by a backend function : _page content seems to load without issues except `CKEditor`._

    <br /><img src="/assets/2020-05-07 23_53_00-https___script.google.com.png" alt="window.write()" width="500"/><br />

## 2020-05-06
- Exploring ways to implement a "first time run" process to initialize the webapp, without having to go/redirect to a custom URL.
- `ScriptApp.getService().getUrl()` doesn't seem to return the correct URL in case of a G-Suite account : `https://script.google.com/a/mydomain.com/macros/s/AKfy-----------------------k9/dev` : _missing `a/mydomain.com` between `https://script.google.com/` and `/macros/s/AKfy-----------------------k9/dev`._
- Imported a few old Worklog entries.

## 2020-05-05
- So I forgot that script properties accept only string values, and any other type would be converted, including boolean. Consequently, a `if` statement didn't work as expected since `true` and `false` were evaluated as literal non empty strings that are both equivalent to the boolean value `true`. Adjusted code accordingly.
   
    <br /><img src="/assets/2020-05-05 01_05_08-Executions.png" alt="Properties_strings" width="600"/><br />
   
- Adjusted project's scopes : `https://www.googleapis.com/auth/drive`, instead of `https://www.googleapis.com/auth/drive.readonly`.
- Now all app settings are configurable from the web frontend.
- Deployed, intialized and run the application successfully with both G-Suite and free Google accounts.
- Updated `worklog.md` and `README.md`.

## 2020-05-04
- `TIME_INTERVAL` hardcoded to **`10`**. because : 
    - this value has proved to be reliable,
    - `TIME_INTERVAL` should be equal to the parameter initially given to the [`everyMinutes()`](https://developers.google.com/apps-script/reference/script/clock-trigger-builder#everyMinutes(Integer)) method when script triggers were created, which there is no way to change afterwards other than deleting and recreating these triggers.
- No need now for spreadsheet templates. `Filters` and `Logs` are generated and initialized by `appinit()`.
- Frontend and backend code for "getting" and "setting" `NO_REPLY` and `STAR_PROCESSED_MESSAGE` properties (more tests are needed).
- Started enhancing the processing of properties values of `setProperties()` parameters object _(set default values...etc)_.
- User can either initialize or reset app settings using `appinit()`.
- Deleted non needed files from the repository.

## 2020-05-03 [(code)](https://github.com/amindeed/Gmail-AutoResponder/tree/618b8854f4ffac1daa1883e2784960cf30da996f/app)
- Added to my reading list : _[Google Apps Script: Demystifying Time Zones in Apps Script - Part 2](https://googleappsscript.blogspot.com/2011/03/demystifying-time-zones-in-apps-script_21.html)_
- Significant progress working on AppInit code.

## 2020-05-02 [(code)](https://github.com/amindeed/Gmail-AutoResponder/blob/038158f74e7c8e2eccb0ba49922f810d2b1e11c6/app/appinit.js)
- **How to tell if the application is run for the first time?** The only way that comes to my mind is checking whether there is a user script property, `'alreadyRun'` for example, of which the value _∉ {0, false, undefined, null, NaN, ""}_.
- Started `appinit()` function draft.


## 2020-05-01
- **App Init script roles :** _**First time / run once**_ script executed after the user has been authenticated (i.e. has granted access to his Google account) and the frontend URL has been visited (i.e. `doGet()` function is run) for the first time :
    1. Create `Filters` and `Logs` spreadsheets. Get URLs to show next to each one's input field.
    2. Place all app's files into the same Drive folder. Get and show URL of the folder.
    3. Create and set user script properties to their default values.
    4. [Create triggers _[, set Enable/Disable App flag]_ ].
    5. Let the user manually enable the application.
    6. Load app parameters into the frontend and let the user modify and save them.
- **Time Zone :** 
    - I couldn't understand what reference time zone Apps Script uses when processing Date/Time data (`Date` objects, for instance). It was neither [Script's](https://developers.google.com/apps-script/reference/base/session#getScriptTimeZone()) nor [Calendar's](https://support.google.com/calendar/answer/37064?co=GENIE.Platform%3DDesktop&hl=en&oco=0) in my tests! It's not the time zone of the OS on which the browser is running, and not even that of the location I'm connecting from! It's just like Google would automagically guess your time zone! So why would I bother setting it in the first place?! And to make it more confusing, there can be different time zones under the same Google account, depending on the programmatical context: _Calendar time zone, Script time zone, [Spreadsheet's time zone](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet?hl=en#setspreadsheettimezonetimezone)...!_
    - So I guess I will just settle with this solution, as stated by a StackOverflow user :  
       
        > _“If there are multiple users of the script in different time zones, then I set the Time Zone in the script to +GMT 00:00 no daylight savings. And leave it at that.”_ – [🌎](https://stackoverflow.com/a/44401527/3208373)
           
    - And as a precautionary measure, I'll keep the DST offset parameter.

## 2020-04-30
- I've been testing the `options` parameter of the method [`sendEmail(recipient, subject, body, options)`](https://developers.google.com/apps-script/reference/gmail/gmail-app#sendemailrecipient,-subject,-body,-options), which behaves the same as [`GmailThread.reply(body, options)`](https://developers.google.com/apps-script/reference/gmail/gmail-thread#replybody,-options), with the following code :

    ```javascript
    GmailApp.sendEmail('name@domain.com', 'Apps Script : Test message', 'This is a test messages from APps Script', {
        cc: null,
        bcc: null,
        noReply: null
    });
    ```
- Tried a few combinations of values for `cc`, `bcc` and `noReply` properties, using both free and G-Suite Google accounts, and it seemed that it is safe to always default to `null`. 
- In addition, these methods check whether given email addresses (recipient, Cc and Bcc) are valid and throws the exception `Invalid email` if they're not. So there is no need to provide backend code to validate addresses.
- Updated code accordingly.
- I couldn't keep the same work pace in the last couple of days due to some preoccupations. So I'm just trying to keep my daily commitment..

## 2020-04-29
- **Telling whether it is a G-Suite or a Free account :** I checked two online posts that I had added to `raw_notes.md` [on March 28](https://github.com/amindeed/Gmail-AutoResponder/commit/de9ba3b6137a64de4cd3815f814324f02d179169?short_path=deb3f38#diff-deb3f38e414de594d3421071ed162325). [One of them](https://www.labnol.org/code/20592-gsuite-account-check) suggests a method that doesn't seem to work any longer. [The other](https://stackoverflow.com/questions/57902993/google-app-script-to-check-if-an-email-exists-in-domain) suggests a seemingly working solution relying on the [Admin SDK Directory Service](https://developers.google.com/apps-script/advanced/admin-sdk-directory) that needs to be [enabled](https://developers.google.com/apps-script/guides/services/advanced#enabling_advanced_services) from the Script Editor UI through `Resources->Advanced Google Services...`, which I'm trying to avoid at the moment (unless it's required by other app features and/or makes things easier). 
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
    
- So basically, some fairy reliable resources and accepted solutions on the web suggest to first process the submitted file with [`FileReader()`](https://developer.mozilla.org/en-US/docs/Web/API/FileReader), and pass it as a [data URL](https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL) to a backend function for a second process that extracts content type from it, [decodes the submitted base64 data](https://developers.google.com/apps-script/reference/utilities/utilities#base64Decode(String)), and calls [`Utilities.newBlob()`](https://developers.google.com/apps-script/reference/utilities/utilities#newBlob(Byte,String)) to create a new blob object for [`DriveApp.createFile(blob)`](https://developers.google.com/apps-script/reference/drive/drive-app#createFile(BlobSource)).
- Here is a basic draft code as a wrap-up of what I've understood so far from the examples I studied. For the time being, this focuses only on that content type issue. Further development is needed to process forms with multiple types of input data (not only file upload) :
    - Frontend (client) :
  
        ```javascript
        /* // Example 1
        function sendFileToDrive(file) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var content = reader.result;
                google.script.run.withSuccessHandler(updateProgressbar)
                                 .uploadFileToDrive(content, file.name);
            }
            reader.readAsDataURL(file);
        }
        */
        
        // Example 2
        function sendFileToDrive(file) {
            var reader = new FileReader();
            reader.onloadend = function (event) {
                google.script.run.withSuccessHandler(updateProgressbar)
                                 .uploadFileToDrive(event.target.result, file.name);
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

***Entries to be translated from the [old worklog](https://github.com/amindeed/Gmail-AutoResponder/blob/929a26bdae365a69f56a1e951871575352800642/worklog.md) :***
    
    
## 2018-09-10
_Original :_
> Revue du code source de l’application web, après plus d’un an d’exécution continue en production, avec plus de **6700** réponses automatiques envoyées.
> 
> Liste exhaustive des types d'erreurs reportées par **Google Apps Scripts** (résumés en provenance de l'adresse `apps-scripts-notifications@google.com`) durant l'année, illustré chacun par un exemple. Informations à prendre en considération dans les prochaines améliorations du code:
> 
> | Start            | Function    | Error Message                                                                                                                                    | Trigger    | End              |
> |------------------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------|------------|------------------|
> | 10/07/2018 20:06 | autoReply   | Limit Exceeded: Email Body Size. (line 99, file "Code")                                                                                          | time-based | 10/07/2018 20:06 |
> | 10/04/2018 20:43 | autoReply   | Document {DOCUMENT-ID-DELETED} is missing (perhaps it was deleted, or you don't have read access?) (line 22, file "Code") | time-based | 10/04/2018 20:44 |
> | 9/17/18 12:53 AM | autoReply   | Service error: Spreadsheets (line 63, file "Code")                                                                                               | time-based | 9/17/18 12:53 AM |
> | 7/26/18 11:16 PM | autoReply   | Gmail operation not allowed. (line 62, file "Code")                                                                                              | time-based | 7/26/18 11:16 PM |
> | 4/24/18 4:52 AM  | autoReply   | Service timed out: Spreadsheets (line 63, file "Code")                                                                                           | time-based | 4/24/18 4:53 AM  |
> | 3/23/18 10:46 PM | autoReply   | We're sorry, a server error occurred. Please wait a bit and try again.                                                                           | time-based | 3/23/18 10:46 PM |
> | 1/25/18 8:22 PM  | autoReply   | We're sorry, a server error occurred. Please wait a bit and try again. (line 125, file "Code")                                                   | time-based | 1/25/18 8:24 PM  |
> | 12/01/2017 08:45 | archiveLog | Sorry, it is not possible to delete all non-frozen rows. (line 26, file "Archive_Log")                                                           | time-based | 12/01/2017 08:45 |
> | 10/02/2017 20:58 | autoReply   | Argument too large: subject (line 97, file "Code")                                                                                               | time-based | 10/02/2017 20:58 |
> | 10/01/2017 08:02 | archiveLog | You do not have permissions to access the requested document. (line 11, file "Archive_Log")                                                      | time-based | 10/01/2017 08:02 |
> | 8/30/17 11:06 PM | autoReply   | Invalid email: Judith Pin &lt;&gt; (line 92, file &quot;Code&quot;)                                                                              | time-based | 8/30/17 11:06 PM |


## 2017-12-11 [(code)](https://github.com/amindeed/Gmail-AutoResponder/blob/796a6d84f1e7287b8a936083ae8f507035a28215/app/Archive_log.js)
_Original :_
> Modification des codes source afin de rectifier un problème empêchant la réinitialisation mensuelle de la feuille du journal des sessions d’exécutions.


## 2017-11-14
_Original :_
> En vérifiant les journaux des messages traités ainsi que les occurrences d’exécution de la session du 13/11/2017 : la session s’est déroulée correctement après les dernières mises à jours des codes source.


## 2017-11-13 [(code)](https://github.com/amindeed/Gmail-AutoResponder/tree/205b51e16b5800dbdfab2a6402adc20100a6da58/app)
_Original :_
> Les sessions d’exécution du **11/11/2017** et le **12/11/2017** du programme de réponses mail automatiques du compte **OPERATIONS** se sont correctement déroulées après la dernière mise à jour du code source.
> Les changements ont été généralisés sur les autres programmes des comptes **OPERATIONS2**, **OPERATIONS3**, **OPERATIONS4**, **OPERATIONS5** et **OPERATIONS6**.
> Par ailleurs, des fonctions pour effacer mensuellement le journal des occurrences de chaque session d’exécution des programmes ont été ajoutées à leurs codes source respectifs.


## 2017-11-11
_Original :_
> Fin de la nouvelle version du code source. Premier déploiement pour le compte `OPERATIONS`. Le code sera au fur et à mesure amélioré selon les résultats.


## 2017-11-10
_Original :_
> Continuation du développement du code amélioré du programme des réponses mail automatiques.


## 2017-11-09
_Original :_
> Continuation du développement et test des premières améliorations du code source pour une meilleure performance d’exécution.


## 2017-11-08
_Original :_
> Début d’optimisation du code source pour une meilleure performance d’exécution :
> **_Mise à jour du code envisagés :_** Au lieu d’extraire, à chaque exécution, tous les identifiants des messages traités durant tout le mois depuis le journal des opérations pour vérifier si un message n’a pas été déjà traité, le programme vérifierait juste les identifiants des messages traités dans la dernière occurrence qui seraient déjà mis en cache.


## 2017-11-01
_Original :_
> Vérification des programmes (journaux et configurations) :
> - L’archivage des journaux du mois d’octobre a été correctement exécuté pour toutes les instances du programme.
> - Adresses ajoutées à la liste d’exclusion `From` de chacun des documents de configuration.


## 2017-10-30
_Original :_
> Les codes sources des programmes de réponses mail automatiques ont été mis à jour suite au changement de l’heure locale qui a eu lieu le 29/10/2017.


## 2017-10-23
_Original :_
> Les deux premières sessions d’exécution des programmes de réponses mail automatiques associés aux comptes **OPERATIONS5** et **OPERATIONS6** ont été respectivement exécuté le **21/10/2017** et le **22/10/2017**.
> **4** réponses automatiques ont été envoyées, **9** messages reçus sautés.
> Les adresses expéditrices avec la mention **`do-not-reply`** ont été ajoutées à la liste d’exclusion.
> Les résultats des sessions **OPERATIONS5** et **OPERATIONS6** seront suivis durant toute la semaine afin de corriger toute éventuelle anomalie.
> _**N.B. :**_ Depuis l’exécution de la première session de réponse mail automatique le 23/08/2017, **1203** réponses ont été envoyées.


## 2017-10-21
_Original :_
> Configurations des programmes de réponses mail automatiques pour les comptes `OPERATIONS5 <operations5@mycompany.com>` et `OPERATIONS6 <operations6@mycompany.com>`.
> Les premières sessions seront exécutées le jour même à partir de 20:00 (heure locale).


## 2017-10-05
_Original :_
> Etudes, rectification et suggestion d’amélioration suite aux remarques formulées dans le rapport du 03/10/2017:
> - Rectification du document de configuration du programme de `OPERATIONS2` auquel une opération d’archivage a été appliquée par erreur ; ce qui causait le traitement de l’intégralité des messages reçu sans aucun filtrage.
> - Une amélioration du code est à envisager suite aux erreurs reportées par le service `Google Apps Script` :
> 
>     ![2017-10-05 - Gmail-AutoResponder](assets/2017-10-05%20-%20Gmail-AutoResponder.png)
> 
>     - Les messages d’erreur `Argument too large: subject (line 97, file "Code") et Limit Exceeded: Email Body Size. (line 97, file "Code")` indiquent que le corps du message de réponse composé du texte informatif principal et de l’historique de la conversation peut potentiellement dépasser la limite de [la taille maximale du corps de message de réponse](https://developers.google.com/apps-script/reference/gmail/gmail-thread#reply(String)).
>     - Le concept permettant de contourner ce problème peut être résumé comme suit :
>         - L’ensemble du message (texte informatif + historique de la conversation) sera initialement stocké dans une chaîne de caractère (String).
>         - Si la taille de la chaîne dépasse 20Ko l’excédent sera supprimé et remplacé par des points de suspension.


## 2017-10-03
_Original :_
> Retour sur les résultats des sessions d’exécution des programmes associés aux comptes `OPERATIONS`, `OPERATIONS2`, `OPERATIONS3` et `OPERATIONS4` entre le 22/09/2017 et 02/10/2017.
> - _Premières remarques_ :
>     - Aucun filtrage n’a été appliqué aux messages reçus durant la session du 01/10/2017 et le 02/10/2017 du programme de `OPERATIONS2`. Une réponse automatique a été envoyée pour chaque message détecté et traité.
>     - La nécessité d’ajouter une colonne au journal contenant l’éventuelle raison d’exclusion d’un message se confirme.
>     - La couleur de remplissage des lignes, distinguant les messages sautés des réponses automatiques envoyée, n’a pas été correctement appliquée entre le 24/09/2017 et le 30/09/2017 aux journaux de `OPERATIONS` et `OPERATIONS2`. Il ne peut s’agir que d’un bug/disfonctionnement du programme.


## 2017-09-23
_Original :_
> Configuration du programme de réponses mail automatique pour un quatrième compte Google: **`OPERATIONS4 <operations4@mycompany.com>`**.


## 2017-09-22
_Original :_
> Evaluation des résultats des sessions d’exécution du 20/09/2017 et 21/09/2017: **23** réponses envoyées.


## 2017-09-20 [(code)](https://github.com/amindeed/Gmail-AutoResponder/blob/e46a511320e5f6197b24f73e6f3ab58493e4a002/app/Code.js)
_Original :_
> - Evaluation des résultats des sessions d’exécution du 19/09/2017: **26** réponses envoyées :
> - **Mise à jour du code:** Extension de deux minutes de l’intervalle de recherche des derniers emails reçus sur chacune des trois boîtes emails à chaque itération du programme afin de ne pas rater les emails coïncidant avec l’instant d’exécution.


## 2017-09-19 [(code)](https://github.com/amindeed/Gmail-AutoResponder/blob/44a42e3a03b2518d9bde6bd348897d47587ce0a2/app/Autorespond-config-OPS3.xlsx)
_Original :_
> - Evaluation des résultats des sessions d’exécution du 18/09/2017: **19** réponses automatiques envoyées :
>     - **`OPERATIONS`** : **60** itérations du programme ayant récupérés **68** `threads`. **68** messages traités, dont **50** sautés et **18** réponses automatiques envoyées.
>     - **OPERATIONS2** :
>         - **60** itérations du programme ayant récupérés **38** `threads`.  **38** messages traités et  sautés.
>         - **1** message non traité:
>             - L’heure de réception a coïncidé avec le déclenchement de la deuxième itération du programme pendant la session d’exécution du 18/09/2017. La partie du code recherchant et récupérant les derniers mails reçus l’aurait, par conséquent, raté.
>             - Le script du compte `OPERATIONS3` a détecté et sauté le message, comme il est configuré pour exclure les messages à destination de `OPERATIONS` et `OPERATIONS2` (adresses respectives ajoutées à la colonne `TO_BLACKLIST` du document de configuration `Autorespond-config` de l'instance de l'application associée au compte Google `OPERATIONS3`).
>             - Le script du compte `OPERATIONS` n’a pas détecté le message vu que l’itération qu’il l’aurait traité (exécutée à 19:26:02 GMT) a détecté un message plus récent dans la même conversation et auquel une réponse a été en effet envoyée.
>             - De toute façon, le message a été traité peu après par l’équipe `OPERATIONS2` même.
>     - **OPERATIONS3** : **60** itérations du programme ayant récupérés **25** `threads`. **25** messages traités, dont **24** sautés et une réponse envoyée.
> - Ajout du fichier `Autorespond-config-OPS3.xlsx` au code source:
>     - Un deuxième modèle du fichier `Autorespond-config` a été ajouté au code source, illustrant -à titre d'exemple- la configuration utilisée pour l'application associée au compte **`OPERATIONS3`**, l'empêchant d'envoyer une réponse à un message reçu si celui-ci est aussi destiné au moins à l'une des adresses `operations@mycompany.com` et `operations2@mycompany.com` et serait donc traité par l'une des applications respectives leur étant associées.
>     - A cet égard, les 3 instances en exécution sont en effet configurées comme suit:
>         - **_OPERATIONS :_** Traite tous les messages répondant aux critères de filtrage préconfigurés, excluant ainsi:
>             - les accusés de lectures
>             - les messages d'administration système (`postmaster`, `mailer-daemon`)
>             - les messages en provenance des adresses mail de la société (`*@mycompany.*`)
>             - les messages en provenance des adresses avec l'alias `noreply/no-reply`.
>             - les messages en provenance des adresses ajoutées au fur et à mesure à la liste d'exclusion `FROM_REGEX_BLACKLIST`
>             - les messages à destinations anonymes `undisclosed-recipients`.
>         - **_OPERATIONS2 :_** en plus des critères de filtrage précités, elle ne traite pas les messages destinés aussi à `operations@mycompany.com`.
>         - **_OPERATIONS3 :_** en plus des critères de filtrage précités, elle ne traite pas les messages destinés aussi au moins à l'une des adresses `operations@mycompany.com` et `operations2@mycompany.com`.
>     - Une même approche sera adoptée pour les autres instances de l'application qui seraient ultérieurement ajoutées et associées à d'autres compte Google.


## 2017-09-18 [(code)](https://github.com/amindeed/Gmail-AutoResponder/blob/7d67f6a683eedaf3e82a418670e2a7e66eb75c30/app/Code.js)
_Original :_
> Evaluation des résultats des sessions d’exécution du 16/09/2017 et 17/09/2017 : **31** réponses automatiques envoyées :
> - `OPERATIONS` :
>     - **120** itérations du programme ayant récupérés **84** `threads`. **84** messages traités, dont **63** sautées et **21** réponses automatiques envoyées.
> - `OPERATIONS2` :
>     - **120** itérations du programme ayant récupérés **53** `threads`.  **53** messages traités, dont **51** sautées et **2** réponses automatiques envoyées.
> - `OPERATIONS3` :
>     - **120** itérations du programme ayant récupérés **95** `threads`.  **95** messages traités, dont **88** sautées et **7** réponses automatiques envoyées.
> - _Améliorations et mises à jour_ :
>     - Les codes source ont été mis à jour pour activer le suivi (= ajouter `une étoile` au message sur le client webmail `Gmail`) de chaque message traité.


## 2017-09-16 [(code)](https://github.com/amindeed/Gmail-AutoResponder/tree/98a14d321fe76297b620b05c4f1655945decd5a4/app)
_Original :_
> Evaluation des résultats des sessions d’exécution du 14/09/2017 et 15/09/2017.
> - Améliorations et mises à jour :
>     - Ajout d'une nouvelle adresse aux listes d’exclusions respectives `From :` de chaque compte (i.e. `OPERATIONS`, `OPERATIONS2`, `OPERATIONS3`).
>     - Modification du code pour la mise en copie normale `Cc` (au lieu de `Cci`) des adresses d’administration pour un meilleur filtrage et suivi des réponses automatiques envoyées (i.e. pour une meilleure lisibilité sur l’application web `Gmail` avec des libellés personnalisés, par exemple). L'adresse mise en copie est en effet un [alias](https://support.google.com/a/answer/33327?hl=en) de **`amine@mycompany.com`**; Dans le cas des réponses automatiques programmées jusqu’au 16/09/2017, les alias sont respectivement : **it-operations@mycompany.com**, **it-operations2@mycompany.com**, **it-operations3@mycompany.com**.
>     - `OPERATIONS`2 et `OPERATIONS3` : A partir de la session d’exécution du 16/09/2017, le système de filtrage des messages reçus par destination vérifiera les champs `Cc :` et `Cci :` en plus du champ `To :`.
>     - _Prévisions :_ Comme [un identifiant unique](https://developers.google.com/apps-script/reference/gmail/gmail-message#getid) est attribué à chaque version d’un même message envoyé à plusieurs destinataires de **`*@mycompany.*`**, il va falloir penser à un autre critère de filtrage de tels messages pour qu’ils ne soient pas traités plusieurs fois. L’identifiant **`Message-ID`**, selon les spécifications du document **[« RFC 822 »](https://www.w3.org/Protocols/rfc822/)** de l’**IETF**, répond le plus aux critères requis. Une expression régulière pour l’extraction de cet identifiant a été développée et préparée pour utilisation dans de prochaines versions du programme : **```^Message-ID:\s*[<A-Za-z0-9!#$%&'*+-/=?^_`{}|~.@]*```**
>         - _**Révision (2019-06-09):** Il est possible d'extraire l'en-tête `Message-ID` sans avoir à utiliser une expression régulière sur tout le contenu du message original, et ce en utilisant la méthode [`getHeader(name)`](https://developers.google.com/apps-script/reference/gmail/gmail-message#getHeader(String)) de la classe `GmailMessage`._


## 2017-09-14
_Original :_
>Evaluation des résultats de la session d’exécution du 13/09/2017 : **60** itérations correctes du programme ayant récupérés **33** `threads`. **33** messages traités, dont **19** sautées et **14** réponses automatiques envoyées.
>Déploiement de versions adaptées du programme pour les deux comptes **`OPERATIONS2`** et **`OPERATIONS3`**.


## 2017-09-13
_Original :_
> Evaluation des résultats de la session d’exécution du 12/09/2017 : **60** itérations correctes du programme ayant récupérés **53** `threads`.  **53** messages traités, dont **42** sautées et **11** réponses automatiques envoyées.


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
>     - Enregistrement des configurations sur une seule feuille du document `Autorespond-config` avec plusieurs colonnes, au lieu de plusieurs feuilles contenant chacune un filtre. L'ancienne version fichier a été archivée sous le nom [`Autorespond-config_OLD-till-2017-08-24`](https://github.com/amindeed/Gmail-AutoResponder/blob/dd7a8278fe437169f68f611b59e95e1ee2ce0c93/app/Autorespond-config_OLD-till-2017-08-24.xlsx). Adaptation du code.
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
   
