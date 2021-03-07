
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


// https://stackoverflow.com/a/33369954/3208373
function isJson(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

    return false;
}


function updateSettings(data){
    //alert('\'updateSettings()\' was called.')
    //var data = new FormData(formObject)
    //console.log(typeof(data))

    makeRequest('POST', '/updatesettings/', 40000, data)
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


function jsonPostRequest(url, jsonStringReqBody){

    makeRequest('POST', url, 40000, jsonStringReqBody)
       .then(function (result) {
           console.log('*** makeRequest() Success block ***')
           //result = JSON.parse(result)
           console.log(result)
        })
        .catch(function (err) {
            console.log('*** makeRequest() Error block ***')
            statusCode = err.status?err.status + ' ':''
            statusText = err.statusText?err.statusText + ': ':''
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
               
           } else if ( result['data']['enableApp'] === 'true' ) {
               document.getElementById("enable_app").checked = true;

           } /* else {
               document.getElementById("enable_app").checked = true;
           } */
    
           // document.getElementById("filtersssid").value = result['data']['filtersssid'];
           if (result['data']['filtersssurl']) {
                document.getElementById("filtersssurl").href = result['data']['filtersssurl'];
                document.getElementById("filtersssurl").innerHTML = document.getElementById('sheet-icon').outerHTML;
           }
    
           // document.getElementById("logsssid").value =result['data']['logsssid'];
           if (result['data']['logsssurl']) {
                document.getElementById("logsssurl").href = result['data']['logsssurl'];
                document.getElementById("logsssurl").innerHTML = document.getElementById('sheet-icon').outerHTML;
           }
    
           document.getElementById("starthour").value = parseInt(result['data']['starthour'], 10);
           document.getElementById("finishhour").value = parseInt(result['data']['finishhour'], 10);
           document.getElementById("utcoffset").value = parseInt(result['data']['utcoffset'], 10);
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
    
           } /* else {
               document.getElementById("no_noreply").checked = true;
           } */
    
           document.getElementById("msgbody").value = result['data']['msgbody'];
    
           document.getElementById("waiting_msg").innerHTML = '';
       })
       .catch(function (err) {
    
           statusCode = err.status?err.status + ' ':''
           statusText = err.statusText?err.statusText + ': ':''
    
           document.getElementById("waiting_msg").innerHTML = '<span style="color:red; font-weight:bold">Error: ' + statusCode + statusText + err.errorMessage + '</span>';
       });
}


function makeRequest(method, url, timeout=0, data=null) {

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

    if (method === 'POST') {
        if ( data ) {
            const csrftoken = getCookie('csrftoken');

            if ( typeof(data) === 'object' ) {
                var formObj = new FormData(data);
                xhr.setRequestHeader('X-CSRFToken', csrftoken);
                xhr.send(formObj);

            } else if ( typeof(data) === 'string' && isJson(data) ) {
                xhr.setRequestHeader('X-CSRFToken', csrftoken);
                xhr.setRequestHeader('Content-Type', 'application/json'); // 'application/json;charset=UTF-8'
                xhr.send(data);

            } else {
                // Request body is neither an Object nor a JSON String
                //throw new Error('wrong POST req parameters.');
                let err = new Error();
                err.errorMessage = 'Wrong POST req parameters.';
                throw err;
            }
        } else {
            // No request body provided
            //throw new Error('No data to submit/send.');
            let err = new Error();
            err.errorMessage = 'No data to submit/send.';
            throw err;
        }
    } else {
        // Typically a GET request
        xhr.send();
    }

    });
}