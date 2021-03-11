/**
 * Name 	  	:	Gmail AutoResponder
 * Version 		:	0.1
 * Descriton 	:	Automatic processing of incoming GMail messages
 * Author 		:	Amine Al Kaderi <alkaderi@amindeed.com>
 * License 		:	GNU GPLv3 license
 */


/** Check if data in a given array is consistent, **/
/** i.e. elements are either of primitive types (1D array), **/
/** or are all non empty arrays of primitive types (2D array) **/
function isDatasetConsistent(dataset) {

  const isPrimitive = (element) => element !== Object(element);

  const isValid2DArray = (element, i, arr) => element instanceof Array 
                                          && element.length
                                          && element.length === arr[0].length
                                          && element.every(isPrimitive);

  if ( dataset instanceof Array && dataset.length ) {
    return dataset.every(isPrimitive) || dataset.every(isValid2DArray)

  } else {
    return false
  }
}


/** Log processed message **/
function appLogger(logEntries, target) {

  /*
    Example:

    function logToGSheet(logEntries, spreadsheetId, sheetIndex);

    target = {
      "function": logToGSheet,
      "additionalArgs": [appSettings['logsssid'], 0]
    }

    appLogger(logEntries, target)
  */

  var args = null;

  if (isDatasetConsistent(logEntries)) {
    if ( 
        target.hasOwnProperty('additionalArgs') 
        && target['additionalArgs'] 
        && (target['additionalArgs'] instanceof Array) 
        && target['additionalArgs'].length 
      ) {

        args = target['additionalArgs'];
        args.unshift(logEntries);
        //Logger.log(args) //DEBUG

      } else {
        args = [logEntries];
        //Logger.log(args) //DEBUG
      }

    target['function'].apply(this, args);
  }
}


/** Log to a Google Spreadsheet **/
function logToGSheet(logEntries, spreadsheetId, sheetIndex) {

  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheets()[sheetIndex];

  if ( logEntries[0] instanceof Array ) {

    sheet
    .getRange(
      sheet.getLastRow() + 1,
      1,
      logEntries.length,
      logEntries[0].length
    )
    .setValues(logEntries);

  } else if ( logEntries[0] !== Object(logEntries[0]) ) {
    sheet.appendRow(logEntries);
  }
}


/** DRAFT: Log to a remote Document DB **/
function logToDocDB(logEntries, URL, credentials) {
  // ...
  return true
}