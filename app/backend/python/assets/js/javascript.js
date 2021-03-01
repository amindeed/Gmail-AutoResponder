
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

// https://docs.djangoproject.com/en/3.1/ref/csrf/#acquiring-the-token-if-csrf-use-sessions-and-csrf-cookie-httponly-are-false
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function updateSettings(formData){
    //alert('\'updateSettings()\' was called.')
    //var formData = new FormData(formObject)
    //console.log(typeof(formData))

    makeRequest('POST', '/updatesettings/', 40000, formData)
       .then(function (result) {
           console.log('*** makeRequest() Success block ***')
           //result = JSON.parse(result)
           console.log(result)
        })
        .catch(function (err) {
            console.log('*** makeRequest() Error block ***')
            statusCode = err.status?err.status + ' ':''
            statusText = err.statusText?err.statusText + ': ':''
     
            //document.getElementById("waiting_msg").innerHTML = '<span style="color:red; font-weight:bold">Error: ' + statusCode + statusText + err.errorMessage + '</span>';

            console.log('Error: ' + statusCode + statusText + err.errorMessage)
        });
}


function loadSettings(){

    document.getElementById("waiting_msg").innerHTML = '<span style="color:blue; font-weight:bold">Loading settings...</span>';
    
    makeRequest('GET', '/getsettings', 20000)
       .then(function (result) {
           // Load settings into form
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
    
           statusCode = err.status?err.status + ' ':''
           statusText = err.statusText?err.statusText + ': ':''
    
           document.getElementById("waiting_msg").innerHTML = '<span style="color:red; font-weight:bold">Error: ' + statusCode + statusText + err.errorMessage + '</span>';
       });
}


function makeRequest(method, url, timeout=0, formData=null) {

    return new Promise(function (resolve, reject) {

    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.timeout = timeout
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
        } else {
        reject({
            status: this.status,
            statusText: xhr.statusText,
            errorMessage: xhr.response
        });
        }
    };

    xhr.ontimeout = function () {
        reject({
            errorMessage: "Request for '" + url + "' timed out."
        });
    };

    xhr.onerror = function () {
        reject({
            status: this.status,
            statusText: xhr.statusText,
            errorMessage: xhr.response
        });
    };

    if (formData && method === 'POST') {
        var formObj = new FormData(formData);
        const csrftoken = getCookie('csrftoken');
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
        xhr.send(formObj);
    } else {
        xhr.send();
    }

    });
}