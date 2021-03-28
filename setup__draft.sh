# ------------ PROVISION: Development machine ------------
# - OpenSSH client, Remote access to a CI/CD tool (typically through a web interface)

# ------------ PROVISION: Control machine ------------
# - [OpenSSH client, Python3 + Paramiko]
# - Config. Management and/or CI/CD tool: Ansible, Jenkins, GitHub Actions

# ------------ PROVISION: Target server ------------
yum -y install epel-release
sudo yum update -y
#sudo reboot

## -- Core app requirements --
sudo yum -y install git curl gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
sudo yum -y install nodejs
sudo npm i @google/clasp -g

## -- Middleware app requirements --
sudo yum -y install python3
#pip install virtualenv uwsgi
read -p "Create and configure GCP and Apps Script projects (as instructed in this script\'s comments) before continuing..."
read -p "Are you ready to continue? [Press any key to confirm]"

# - Login to Google account
# - Go to: https://console.cloud.google.com/projectcreate
# - Create GCP project: 'Gmail AutoResponder'
# - Go to: 'APIs & Services' > 'Library' > 
    # - Enable required APIs: Apps Script, Drive, Gmail, Sheets
# - Go to: 'APIs & Services' > 'OAuth consent screen' > 'App information'
# - Go to: 'APIs & Services' > 'OAuth consent screen' > 'Add or remove scopes' > Add scopes manually (copy/paste):
    # openid, https://www.googleapis.com/auth/script.scriptapp, https://mail.google.com/, https://www.googleapis.com/auth/drive, https://www.googleapis.com/auth/userinfo.email, https://www.googleapis.com/auth/spreadsheets, https://www.googleapis.com/auth/userinfo.profile

# - Go to: 'APIs & Services' > 'Credentials' > 'Create Credentials' > 'OAuth client ID' > 
    # - 'Application type: Web Application'
    # - 'Name: Gmail AutoResponder Django Middleware'
    # - 'Authorized redirect URIs: http://127.0.0.1:8000/auth/'
    # - Download credentials file and save as 'credentials.json'
# - Go to: 'Home' > 'Dashboard' > Note 'Project number'
# - Go to 'https://script.google.com/home/usersettings' and enable 'Google Apps Script API'


# ------------ CONFIGURE ------------
mkdir ./gmail-autoresponder && cd ./gmail-autoresponder/
git clone https://github.com/amindeed/Gmail-AutoResponder.git .
cd app/core
clasp login --no-localhost
clasp create --type api --title "Gmail AutoResponder"
# Note project's edit URL and Script ID:
    # SCRIPT_ID >> ../middleware/script_run_parameters.py
# It is possible to fetch Script ID from '.clasp.json' file
clasp open # If you need project's edit URL or Scrit ID
clasp push --force
# - Go to project's edit URL > 'Project Settings' > 'Google Cloud Platform (GCP) Project: Change project'
    # - Set the created GCP project by entering its number
clasp deploy # Note Deployment ID: 
    # DEPLOYMENT_ID >> ../middleware/script_run_parameters.py

cd ../middleware
virtualenv venv
source ./venv/Scripts/activate
pip install -r requirements.txt


# ------------ CI/CD ------------
cd gmail-autoresponder/
git pull origin master
cd app/core/
clasp push --force
clasp deploy -i DEPLOYMENT_ID
# Restart Django App/WSGI/NGINX