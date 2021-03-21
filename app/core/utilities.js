/**
 * Name 		  :	Gmail AutoResponder
 * Version 		:	0.1
 * Descriton 	:	Automatic processing of incoming GMail messages
 * Author 		:	Amine Al Kaderi <alkaderi@amindeed.com>
 * License 		:	MIT license
 */
 

/** Generate timestamp **/
function getTimestamp(){
  function pad2(n) { return n < 10 ? '0' + n : n }
  var date = new Date();
  var timestamp = date.getFullYear().toString() 
                  + pad2(date.getMonth() + 1) 
                  + pad2(date.getDate()) 
                  + pad2(date.getHours()) 
                  + pad2(date.getMinutes()) 
                  + pad2(date.getSeconds());
  return timestamp
}


/** Generate random string **/
/** https://stackoverflow.com/a/1349426/3208373 **/
function getRandomString(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}


/** Check for valid JSON object string **/
function isJsonObject(str) {
  try {
      var parsed = JSON.parse(str);
      if (parsed instanceof Array || parsed !== Object(parsed)) {
        throw new Error;
      }
  } catch (e) {
      return false;
  }
  return true;
}


/** Check if object if empty **/
function isEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}


/** Check if String is empty/null/undefined **/
function isStringEmpty(str) {
    return (!str || 0 === str.length)
}


/** Validate email address **/
function isValidEmail(emailAdr) {
  
  const validEmailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return emailAdr && validEmailRegex.test(String(emailAdr).toLowerCase());
}