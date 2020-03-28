# Raw Notes

*(This is to keep `README.md` clean)*

- Deploy to Google Apps Script using GitHub Actions. (possible?)
- [Development Environment - Importing and Exporting Projects  |  Apps Script](https://developers.google.com/apps-script/guides/import-export) ---> Check `clasp` instead.
- All parameters as script user properties : https://developers.google.com/apps-script/guides/properties
- Triggers :
    - [Installable Triggers : Managing triggers programmatically](https://developers.google.com/apps-script/guides/triggers/installable#managing_triggers_programmatically)
    - _Enable App :_ [Class ScriptApp - newTrigger(functionName)](https://developers.google.com/apps-script/reference/script/script-app#newTrigger(String))
    - _Disable App :_ [Class ScriptApp - deleteTrigger(trigger)](https://developers.google.com/apps-script/reference/script/script-app#deleteTrigger(Trigger))
    - [Class TriggerBuilder - timeBased()](https://developers.google.com/apps-script/reference/script/trigger-builder#timeBased())
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

- Using [`clasp`](https://github.com/google/clasp) CLI to create a Google Apps Script Project along all needed resources [in the same Google Drive directory] :

```bash
npm install @google/clasp -g
clasp login --no-localhost
# Visit the provided URL, grant `clasp` required permissions, and copy/paste
# the code from the resulting page
clasp create --type webapp --title "Gmail-AutoResponder"
```

- Place all project resources in the ssame Google Drive directory :

```bash
#
```
