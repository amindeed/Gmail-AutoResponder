#!/bin/bash

echo -e "\n\
☆.。.:*・°☆..。.:*・°☆.。.:*・°☆.。..:*・°☆☆.。.:*・°☆\n\
╔═╗┌┬┐┌─┐┬┬    ╔═╗┬ ┬┌┬┐┌─┐╦═╗┌─┐┌─┐┌─┐┌─┐┌┐┌┌┬┐┌─┐┬─┐\n\
║ ╦│││├─┤││    ╠═╣│ │ │ │ │╠╦╝├┤ └─┐├─┘│ ││││ ││├┤ ├┬┘\n\
╚═╝┴ ┴┴ ┴┴┴─┘  ╩ ╩└─┘ ┴ └─┘╩╚═└─┘└─┘┴  └─┘┘└┘─┴┘└─┘┴└─\n\
☆.。.:*・°☆.。..:*・°☆.。.:*・°☆.。.:*・°☆☆..。.:*・°☆\n"

FULL_DISTRO_NAME=$(( lsb_release -ds || cat /etc/*release || uname -om ) 2>/dev/null | head -n1)

shopt -s nocasematch

if [[ ${FULL_DISTRO_NAME} =~ .*CENTOS.* ]] && \
   [[ $(rpm -q --queryformat '%{VERSION}' centos-release) == 7 ]]; then

	shopt -u nocasematch
	echo -e "\n$(tput setaf 3)Running setup on a CentOS 7 system.$(tput sgr0)"

    # ------------ PROVISION: Development machine ------------
	# - Requirements: OpenSSH client, Remote access to a CI/CD tool (typically through a web interface)
	
	# ------------ PROVISION: Control machine ------------
	# - Requirements:
	# 	- [OpenSSH client, Python3 + Paramiko]
	# 	- Config. Management and/or CI/CD tool: Ansible, Jenkins, GitHub Actions
	
	# ------------ PROVISION: Target server ------------
	
	function install_req()
	{
		yum -y install epel-release
		yum update -y
		
		## -- Core app requirements --
		yum -y install git curl curl jq

		# Install clasp
		if yum list installed nodejs >/dev/null 2>&1 ; then
			if [[ $(rpm --queryformat="%{VERSION}" -q nodejs) =~ ^(14|15) ]]; then
				if ! npm list -g 2>/dev/null | grep clasp >/dev/null ; then
					npm i @google/clasp -g
				else
					npm update @google/clasp -g
				fi
			else
				curl -sL https://rpm.nodesource.com/setup_lts.x | sudo -E bash -
				yum -y install nodejs
				npm i @google/clasp -g
			fi
		else
			curl -sL https://rpm.nodesource.com/setup_lts.x | sudo -E bash -
			yum -y install nodejs
			npm i @google/clasp -g
		fi

		## -- Middleware app requirements --
		yum -y install nginx certbot python3 python3-pip uwsgi uwsgi-plugin-python3
	}

	echo -e "\n$(tput setaf 5)## Installing system-wide requirements (sudo required): $(tput sgr0)\n"
	FUNC=$(declare -f install_req)
	sudo bash -c "$FUNC; install_req"
	echo -e "\n$(tput setaf 2)Finished checking system software requirements.$(tput sgr0)"

	echo -e "\n$(tput setaf 5)## Creating and configuring the Google Cloud Platform (GCP) Project: $(tput sgr0)\n\n\
$(tput setaf 6)- Login to Google account\n\
- Go to: https://console.cloud.google.com/projectcreate\n\
- Create GCP project: 'Gmail AutoResponder'\n\
- Go to: 'APIs & Services' > 'Library': \n\
  - Enable required APIs: $(tput sgr0)Apps Script, Drive, Gmail, Sheets\n$(tput setaf 6)\
- Go to: 'APIs & Services' > 'OAuth consent screen':\n\
  - > 'App information'\n\
  - > 'Add or remove scopes' > Add scopes manually (copy/paste):\n\
\n\
$(tput sgr0)openid, https://www.googleapis.com/auth/script.scriptapp, https://mail.google.com/, https://www.googleapis.com/auth/drive, https://www.googleapis.com/auth/userinfo.email, https://www.googleapis.com/auth/spreadsheets, https://www.googleapis.com/auth/userinfo.profile\
\n\n$(tput sgr0)"

read -p "Press any key to continue...\n"

echo -e "$(tput setaf 5)## Getting OAuth2 Client ID credentials files of the GCP project: \n\n\
$(tput setaf 6)- Go to: 'APIs & Services' > 'Credentials' > 'Create Credentials' > 'OAuth client ID': \n\
  - 'Application type: $(tput sgr0)Web Application'\n\
  - '$(tput setaf 6)Name: $(tput sgr0)Gmail AutoResponder Django Middleware'\n\
  - '$(tput setaf 6)Authorized redirect URIs: $(tput sgr0)http://127.0.0.1:8000/auth/'\n\n\
    $(tput setaf 3)Note: Any IP address or hostname/FQDN of a redirect URI set here should be\n\
    added to Django's app 'ALLOWED_HOSTS' list in 'project/settings.py'.\n\n\
  $(tput setaf 6)- Download credentials file and save it as $(tput sgr0)'credentials.json'$(tput setaf 6).\n\
  - Open the file with a text editor and copy/paste its content here, then press 'ENTER': $(tput sgr0)"

	n=0
	until [ "$n" -ge 3 ]
	do
		read creds
		if jq -e . >/dev/null 2>&1 <<<"$creds"; then
			echo $creds > credentials.json
			echo -e "\n$(tput setaf 2)JSON text parsed and saved as '$(pwd)/credentials.json'.$(tput sgr0)\n"
			break
		else
			echo -e "\n$(tput setaf 3)Failed to parse pasted text as JSON.$(tput sgr0)"

			if [ "$n" -lt 2 ]; then
				echo -e "$(tput setaf 6)Try again. \nMake sure not to copy any leading or trailing characters, spaces or new lines:$(tput sgr0)\n"
			else
				echo -e "$(tput setaf 3)Too many failed attemps. \n$(tput setaf 6)Make sure to place the file 'credentials.json' in the 'app/middleware/' directory.$(tput sgr0)"
				break
			fi 
		fi
		n=$((n+1))
	done

	echo -e "$(tput setaf 6)- Get GCP project number:\n\
  - Go to: 'Home' > 'Dashboard' > Note 'Project number'\n\
\n\
- Enable 'Google Apps Script API':\n\
  - Go to $(tput sgr0)https://script.google.com/home/usersettings$(tput setaf 6) and enable 'Google Apps Script API'.$(tput sgr0)\n"
	
	read -p "Press any key to continue..."

	echo -e "\n\n$(tput setaf 5)## Cloning 'Gmail AutoResponder' git repository: $(tput sgr0)\n"
	
	# ------------ CONFIGURE ------------
	mkdir ./gmail-autoresponder && cd ./gmail-autoresponder/

	git clone https://github.com/amindeed/Gmail-AutoResponder.git .

	if [ -f ../credentials.json ]; then
    	mv ../credentials.json app/middleware/
	fi
	
	## -- Config. Core app --
	cd app/core
	echo -e "\n$(tput setaf 5)## Creating the Google Apps Script Project (Core backend app): $(tput sgr0)\n"
	clasp login --no-localhost
	
	echo "SCRIPT_ID = \"$(clasp create --type api --title "Gmail AutoResponder" | grep -oP '(?<=https://script.google.com/d/)(.+?)(?=/)')\"" >> ../middleware/script_run_parameters.py
	
	# It is also possible to fetch Script ID from '.clasp.json' file
	    # jq -r '."scriptId"' .clasp.json
	    # echo "SCRIPT_ID = \"$(jq -r '."scriptId"' .clasp.json)\"" >> app/middleware/script_run_parameters.py
	
	clasp push --force
	
	echo -e "\
$(tput setaf 6)\n- Go to project's edit URL > 'Project Settings' > 'Google Cloud Platform (GCP) Project: Change project'\n\
  - Set the created GCP project by entering its number$(tput sgr0)\n"
	
	read -p "Press any key to continue...\n"
	
	echo "$(tput setaf 3)Deploying the Apps Script (Core) app...$(tput sgr0)"
	echo "DEPLOYMENT_ID = \"$(clasp deploy | grep -oP '(?<=-\s)(.+?)(?=\s@)')\"" >> ../middleware/script_run_parameters.py
	
	echo -e "CORE_APP_ID = SCRIPT_ID\ndevMode = True" >> ../middleware/script_run_parameters.py
	
	## -- Config. Middleware app --
	echo -e "\n$(tput setaf 5)## Configuring Middleware Django app: $(tput sgr0)\n"
	cd ../middleware
	python3 -m venv venv
	source venv/bin/activate # On Windows: `source venv/Scripts/activate`
	pip install --upgrade pip
	pip install pysqlite3-binary
	
	sed -i "1s/^/# Resolve SQLite3 version compatibility issue\n__import__('pysqlite3')\nimport sys\nsys.modules['sqlite3'] = sys.modules.pop('pysqlite3')\n\n/" project/settings.py
	
	pip install -r requirements.txt

	if [ -f credentials.json ]; then
    	python manage.py migrate
	else
		echo -e "\n$(tput setaf 6)Get OAuth2 Client ID credentials file 'credentials.json' and place it in '/app/middleware/', and run 'python manage.py migrate' within the virtual environement.$(tput sgr0)"
	fi

	deactivate

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

else

  shopt -u nocasematch
  echo -e "\n$(tput setaf 3)Only CentOS 7 is supported. Setup script aborted.$(tput sgr0)\n"

fi

shopt -u nocasematch
echo -e "\n☆.。.:*・°☆..。.:*・°☆.。.:*・°☆.。..:*・°☆☆.。.:*・°☆\n"