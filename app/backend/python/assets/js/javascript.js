
// Prevent forms from being submitted
function preventFormSubmit() {
    var forms = document.querySelectorAll('form');
    for (var i = 0; i < forms.length; i++) {
        forms[i].addEventListener('submit', function(event) {
            event.preventDefault();
        });
    }
}

function clearForm(){
    document.getElementById("gmasettings").reset();
}


function updateSettings(){
    alert('\'updateSettings()\' was called.')
}


function loadSettings(){

 document.getElementById("waiting_msg").innerHTML = '<span style="color:blue; font-weight:bold">Loading settings...</span>';

 makeRequest('GET', '/getsettings')
    .then(function (result) {
        // Load settings into form
        // console.log(result)
        result = JSON.parse(result)

        if (result['data']['enableApp'] === 'false') {
            document.getElementById("disable_app").checked = true;
        } else {
            document.getElementById("enable_app").checked = true;
        }

        // document.getElementById("filtersssid").value = result['data']['filtersssid'];
        document.getElementById("filtersssurl").href = result['data']['filtersssurl'];
        document.getElementById("filtersssurl").innerHTML = document.getElementById('sheet-icon').outerHTML;

        // document.getElementById("logsssid").value =result['data']['logsssid'];
        document.getElementById("logsssurl").href =result['data']['logsssurl'];
        document.getElementById("logsssurl").innerHTML = document.getElementById('sheet-icon').outerHTML;

        document.getElementById("starthour").value = parseInt(result['data']['starthour'], 10);
        document.getElementById("finishhour").value = parseInt(result['data']['finishhour'], 10);
        document.getElementById("dstoffset").value = parseInt(result['data']['dstoffset'], 10);
        document.getElementById("ccemailadr").value = result['data']['ccemailadr'];
        document.getElementById("bccemailadr").value = result['data']['bccemailadr'];


        if ( result['data']['noreply'] == 1 ) {
            document.getElementById("yes_noreply").checked = true;

        } else if ( result['data']['noreply'] == 0 ) {
            document.getElementById("no_noreply").checked = true;

        } else if ( result['data']['noreply'] == 2 ) {
            document.getElementById("yes_noreply").checked = false;
            document.getElementById("no_noreply").checked = false;
            document.getElementById("yes_noreply").disabled = true;
            document.getElementById("no_noreply").disabled = true;

        } else {
            document.getElementById("no_noreply").checked = true;
        }


        if ( result['data']['starmsg'] === "false" ) {
            document.getElementById("no_starmsg").checked = true;

        } else {
            document.getElementById("yes_starmsg").checked = true;
        }

        document.getElementById("msgbody").value = result['data']['msgbody'];

        document.getElementById("waiting_msg").innerHTML = '';
    })
    .catch(function (err) {
        document.getElementById("waiting_msg").innerHTML = '<span style="color:red; font-weight:bold">Error: ' + err.status + ' ' + err.statusText + '</span>';
        //alert(err.status + ' ' + err.statusText);
    });
}


function makeRequest(method, url) {

    return new Promise(function (resolve, reject) {

    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
        } else {
        reject({
            status: this.status,
            statusText: xhr.statusText
        });
        }
    };

    xhr.onerror = function () {
        reject({
        status: this.status,
        statusText: xhr.statusText
        });
    };

    xhr.send();
    });
}