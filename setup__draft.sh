#!/bin/bash

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
sudo yum -y install nginx certbot python3 python3-pip uwsgi uwsgi-plugin-python3

echo -e "
\n\n\
- Login to Google account\n\
- Go to: https://console.cloud.google.com/projectcreate\n\
- Create GCP project: 'Gmail AutoResponder'\n\
- Go to: 'APIs & Services' > 'Library' > \n\
    - Enable required APIs: Apps Script, Drive, Gmail, Sheets\n\
- Go to: 'APIs & Services' > 'OAuth consent screen' > 'App information'\n\
- Go to: 'APIs & Services' > 'OAuth consent screen' > 'Add or remove scopes' > Add scopes manually (copy/paste):\n\n\
    openid, https://www.googleapis.com/auth/script.scriptapp, https://mail.google.com/, https://www.googleapis.com/auth/drive, https://www.googleapis.com/auth/userinfo.email, https://www.googleapis.com/auth/spreadsheets, https://www.googleapis.com/auth/userinfo.profile\n\
\n\
- Go to: 'APIs & Services' > 'Credentials' > 'Create Credentials' > 'OAuth client ID' > \n\
    - 'Application type: Web Application'\n\
    - 'Name: Gmail AutoResponder Django Middleware'\n\
    - 'Authorized redirect URIs: http://127.0.0.1:8000/auth/'\n\
        Any IP address or hostname/FQDN of a redirect URI set here should be\n\
        added to Django's app 'ALLOWED_HOSTS' list in 'project/settings.py'.\n\
    - Download credentials file and save it as 'credentials.json'\n\
- Go to: 'Home' > 'Dashboard' > Note 'Project number'\n\
- Go to 'https://script.google.com/home/usersettings' and enable 'Google Apps Script API'\
\n\n
"

read -p "Are you ready to continue? [Press any key to confirm]"

# ------------ CONFIGURE ------------
mkdir ./gmail-autoresponder && cd ./gmail-autoresponder/
git clone https://github.com/amindeed/Gmail-AutoResponder.git .

## -- Config. Core app --
cd app/core
clasp login --no-localhost

echo "Creating the Apps Script (Core) app project..."
echo "SCRIPT_ID = \"$(clasp create --type api --title "Gmail AutoResponder" | grep -oP '(?<=https://script.google.com/d/)(.+?)(?=/)')\"" >> ../middleware/script_run_parameters.py

# It is also possible to fetch Script ID from '.clasp.json' file
    # jq -r '."scriptId"' .clasp.json
    # echo "SCRIPT_ID = \"$(jq -r '."scriptId"' .clasp.json)\"" >> app/middleware/script_run_parameters.py

clasp push --force

echo -e "
\n\n\
- Go to project's edit URL > 'Project Settings' > 'Google Cloud Platform (GCP) Project: Change project'\n\
    - Set the created GCP project by entering its number\
\n\n
"

read -p "Are you ready to continue? [Press any key to confirm]"

echo "Deploying the Apps Script (Core) app..."
echo "DEPLOYMENT_ID = \"$(clasp deploy | grep -oP '(?<=-\s)(.+?)(?=\s@)')\"" >> ../middleware/script_run_parameters.py

echo -e "CORE_APP_ID = SCRIPT_ID\ndevMode = True" >> ../middleware/script_run_parameters.py

## -- Config. Middleware app --
cd ../middleware
python3 -m venv venv
source venv/bin/activate # On Windows: `source venv/Scripts/activate`
pip install --upgrade pip
pip install pysqlite3-binary

sed -i "1s/^/# Resolve SQLite3 version compatibility issue\n__import__('pysqlite3')\nimport sys\nsys.modules['sqlite3'] = sys.modules.pop('pysqlite3')\n\n/" project/settings.py

pip install -r requirements.txt
python manage.py migrate
# [...]
# - uwsgi: add a new host
# - NGINX: Configure a new site (reverse-proxy)
# - Certbot: add a new [sub]domain
# - Configure firewallD

# ------------ CI/CD ------------
# cd gmail-autoresponder/
# git pull origin master
# cd app/core/
# clasp push --force
# clasp deploy -i DEPLOYMENT_ID
# Restart Django App/WSGI/NGINX