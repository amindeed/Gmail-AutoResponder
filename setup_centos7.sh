#!/bin/bash

echo -e "\n$(tput setaf 6)\
☆.。.:*・°☆..。.:*・°☆.。.:*・°☆.。..:*・°☆☆.。.:*・°☆\n\
╔═╗┌┬┐┌─┐┬┬    ╔═╗┬ ┬┌┬┐┌─┐╦═╗┌─┐┌─┐┌─┐┌─┐┌┐┌┌┬┐┌─┐┬─┐\n\
║ ╦│││├─┤││    ╠═╣│ │ │ │ │╠╦╝├┤ └─┐├─┘│ ││││ ││├┤ ├┬┘\n\
╚═╝┴ ┴┴ ┴┴┴─┘  ╩ ╩└─┘ ┴ └─┘╩╚═└─┘└─┘┴  └─┘┘└┘─┴┘└─┘┴└─\n\
☆.。.:*・°☆.。..:*・°☆.。.:*・°☆.。.:*・°☆☆..。.:*・°☆\n\
$(tput sgr0)"

FULL_DISTRO_NAME=$(( lsb_release -ds || cat /etc/*release || uname -om ) 2>/dev/null | head -n1)

shopt -s nocasematch

if [[ ${FULL_DISTRO_NAME} =~ .*CENTOS.* ]] && \
   [[ $(rpm -q --queryformat '%{VERSION}' centos-release) == 7 ]]; then

	shopt -u nocasematch
	echo -e "\n$(tput setaf 3)Running setup on a CentOS 7 system.$(tput sgr0)"

    # ------------ PROVISION: Development machine ------------
	# - Requirements: OpenSSH client, and -if need be- remote access (typically through a web interface) to a CI/CD tool 
	
	# ------------ PROVISION: Control machine ------------
	# - Requirements: Typically a SSH client/server and Config. Management and/or CI/CD tool/service, like Ansible, Jenkins, GitHub Actions
	
	# ------------ PROVISION: Target server ------------
	
	setup_dir_name="gm-autoresp-setup-tmp_$(cat /dev/urandom | tr -cd 'a-f0-9' | head -c 12)"
	mkdir $setup_dir_name && cd $setup_dir_name
	
	function install_req()
	{
		yum -y install epel-release
		yum update -y
		
		## -- Core app requirements --
		yum -y install git curl jq

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

	echo -e "\n$(tput setaf 5)## Installing system-wide requirements (sudo required): ##$(tput sgr0)\n"
	FUNC=$(declare -f install_req)
	sudo bash -c "$FUNC; install_req"
	echo -e "\n$(tput setaf 2)Finished checking system software requirements.$(tput sgr0)"

	echo -e "\n$(tput setaf 5)## Creating and configuring the Google Cloud Platform (GCP) Project: ##\n"
	sleep 2
	echo -e "$(tput setaf 6)- Login to Google account\n\
- Go to: $(tput sgr0)https://console.cloud.google.com/projectcreate$(tput setaf 6)\n\
- Create GCP project: $(tput sgr0)Gmail AutoResponder$(tput setaf 6)\n\
- Go to: 'APIs & Services' > 'Library': \n\
  - Enable required APIs: $(tput sgr0)Apps Script, Drive, Gmail, Sheets\n$(tput setaf 6)\
- Go to: 'APIs & Services' > 'OAuth consent screen':\n\
  - > 'App information'\n\
  - > 'Add or remove scopes' > Add scopes manually (copy/paste):\n\
\n\
$(tput sgr0)openid, https://www.googleapis.com/auth/script.scriptapp, https://mail.google.com/, https://www.googleapis.com/auth/drive, https://www.googleapis.com/auth/userinfo.email, https://www.googleapis.com/auth/spreadsheets, https://www.googleapis.com/auth/userinfo.profile\
\n\n$(tput sgr0)"

	read -p "Press any key to continue..."

	echo -e "$(tput setaf 5)\n## Getting OAuth2 Client ID credentials files of the GCP project: ##\n"
	sleep 2
	echo -e "$(tput setaf 6)- Go to: 'APIs & Services' > 'Credentials' > 'Create Credentials' > 'OAuth client ID': \n\
  - Application type: $(tput sgr0)Web Application\n\
  - $(tput setaf 6)Name: $(tput sgr0)Gmail AutoResponder Django Middleware\n\
  - $(tput setaf 6)Authorized redirect URIs: $(tput sgr0)http://127.0.0.1:8000/auth/\n\n\
    $(tput setaf 3)Note: Any IP address or hostname/FQDN of a redirect URI set here should be\n\
    later added to Django's app 'ALLOWED_HOSTS' list in 'project/settings.py'.\n\n\
  $(tput setaf 6)- Download credentials file and save it as $(tput sgr0)'credentials.json'$(tput setaf 6).\n\
  - Open the file with a text editor and copy/paste its content here, \n\
    then press 'ENTER': \n$(tput sgr0)"

	n=0
	until [ "$n" -ge 3 ]
	do
		read creds
		if jq -e . >/dev/null 2>&1 <<<"$creds"; then
			echo $creds > credentials.json
			creds_file_path="$(pwd)/credentials.json"
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
  - Go to: 'Home' > 'Dashboard' > Note $(tput setaf 3)'Project number'$(tput setaf 6)\n\
\n\
- Enable 'Google Apps Script API':\n\
  - Go to $(tput sgr0)https://script.google.com/home/usersettings$(tput setaf 6) and enable Google Apps Script API$(tput sgr0)\n"
	
	read -p "Press any key to continue..."

	clasp login --no-localhost

	apps_script_project_url=$(clasp create --type api --title "Gmail AutoResponder" | grep -oP 'http.?://\S+')
	clasp_file_path="$(pwd)/.clasp.json"
	rm appsscript.json
	cd ..

	echo -e "\
$(tput setaf 6)\n- Go to project's edit URL > 'Project Settings' \n\
 > 'Google Cloud Platform (GCP) Project: Change project'\n\n\
    $(tput sgr0)$apps_script_project_url\n\n\
  - $(tput setaf 6)Set the created GCP project by entering its number \n\
    ($(tput setaf 3)Project Number $(tput setaf 6)you previously noted)$(tput sgr0)\n\n\
  - $(tput setaf 6)While there, you can check the box next to $(tput sgr0)\"Show 'appsscript.json' manifest file in editor\"\n"
	
	read -p "Press any key to continue..."

	## Output: $creds_file_path, $clasp_file_path

	# ------------ CONFIGURE ------------

	## Iutput: $creds_file_path (-> Allowed hosts), $clasp_file_path (-> Script ID), $git_repo_url 
	##         [Core and Middleware apps relative paths, w/ default values]
	
	echo -e "\n\n$(tput setaf 5)## Cloning 'Gmail AutoResponder' git repository: ##$(tput sgr0)\n"
	
	git_repo_url="https://github.com/amindeed/Gmail-AutoResponder.git"

	mkdir gmail-autoresponder && cd gmail-autoresponder/

	# TODO: Consider using a bare repository instead
	git clone $git_repo_url .

	if [[ -n $creds_file_path ]] && \
	   [[ -f $creds_file_path ]]; then 
	    mv "$creds_file_path" app/middleware/
	else
		echo -e "$(tput setaf 1)Required file 'credentials.json' is missing.$(tput sgr0)"
	fi

	if [[ -n $clasp_file_path ]] && \
	   [[ -f $clasp_file_path ]]; then 
	    mv "$clasp_file_path" app/core/
	else
		echo -e "$(tput setaf 1)Required file '.clasp.json' is missing.$(tput sgr0)"
	fi
	
	## -- Config. Core app --
	cd app/core
	echo -e "\n$(tput setaf 5)## Creating the Google Apps Script Project (Core backend app): ##$(tput sgr0)\n"
		
	echo "SCRIPT_ID = \"$(jq -r '."scriptId"' .clasp.json)\"" >> ../middleware/script_run_parameters.py
	
	clasp push --force
	
	echo -e "$(tput setaf 3)\nDeploying the Apps Script (Core) app...$(tput sgr0)"
	echo "DEPLOYMENT_ID = \"$(clasp deploy | grep -oP '(?<=-\s)(.+?)(?=\s@)')\"" >> ../middleware/script_run_parameters.py
	
	echo -e "CORE_APP_ID = SCRIPT_ID\ndevMode = True" >> ../middleware/script_run_parameters.py
	
	## -- Config. Middleware app --
	echo -e "\n$(tput setaf 5)## Configuring the Django app (backend middleware app): ##$(tput sgr0)\n"
	cd ../middleware
	python3 -m venv venv
	source venv/bin/activate # On Windows: `source venv/Scripts/activate`
	pip install --upgrade pip
	pip install pysqlite3-binary
	
	sed -i "1s/^/# Resolve SQLite3 version compatibility issue\n__import__('pysqlite3')\nimport sys\nsys.modules['sqlite3'] = sys.modules.pop('pysqlite3')\n\n/" project/settings.py
	
	pip install -r requirements.txt

	if [[ -f credentials.json ]]; then
    	python manage.py migrate
	else
		echo -e "\n$(tput setaf 6)Get OAuth2 Client ID credentials file 'credentials.json' and place it in '/app/middleware/', and run $(tput sgr0)'python manage.py migrate'$(tput setaf 6) within the virtual environement.$(tput sgr0)"
	fi

	deactivate

	# [...]
	# - uwsgi: add a new host
	# - NGINX: Configure a new site (reverse-proxy)
	# - Certbot: add a new [sub]domain
	# - Configure firewallD
	
	# ------------ CI/CD ------------
	## Input: devMode, ...
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
echo -e "$(tput setaf 6)\n☆.。.:*・°☆..。.:*・°☆.。.:*・°☆.。..:*・°☆☆.。.:*・°☆\n$(tput sgr0)"