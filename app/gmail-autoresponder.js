
/** ........................................ **/

function ContainsString(InputStr, checklist) {
  var Contains = false;
  var i = 0;
  while (!Contains && i < checklist.length) {
    if (InputStr.indexOf(checklist[i]) !== -1) {
      Contains = true;
    } else {i++;}
  }
  return Contains;
}


/** ........................................ **/

function MatchesRegex(InputStr, regexStr) {
  var Matches = false;
  var i = 0;
  while (!Matches && i < regexStr.length) {
    var regex = new RegExp(regexStr[i],'i');
    if (InputStr.match(regex)) {
      Matches = true;
    } else {i++;}
  }
  return Matches;
}


/** ........................................ **/

function ColumnValues(sheet, column, remove_header){
  var values = sheet.getRange(column + "1:" + column + sheet.getMaxRows()).getValues();
  (values = [].concat.apply([], values.filter(String))).splice(0,remove_header?1:0);
  return values
}


/** Archiving logs monthly to separate sheets **/

function archive_log() {
   
  var LogSSId = userProperties.getProperty('LOGS_SS_ID');
  var log = SpreadsheetApp.openById(LogSSId);
  var ops_log_sheet = log.setActiveSheet(log.getSheets()[0]);
  
  SpreadsheetApp.setActiveSpreadsheet(log);
  log.setActiveSheet(ops_log_sheet);
  log.duplicateActiveSheet();
  
  var d = new Date();
  var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  var mNdx = d.getMonth();
  var sheet_name = months[(mNdx-1)>=0?(mNdx-1):11] + "_" + d.getFullYear().toString().substr(-2);
  
  log.renameActiveSheet(sheet_name);
  
  log.moveActiveSheet(log.getNumSheets());
  var range = ops_log_sheet.getRange(2,1,ops_log_sheet.getLastRow()-1,ops_log_sheet.getLastColumn());
  range.clear();
  
  /** Logged execution sessions **/
  var exec_log_sheet = log.getSheets()[1];
  /* exec_log_sheet.deleteRows(2, exec_log_sheet.getLastRow() - 1); */
  var range = exec_log_sheet.getRange(2,1,exec_log_sheet.getLastRow()-1,exec_log_sheet.getLastColumn());
  range.clear(); 
}


/** ........................................ **/

function create_Triggers() {

  ScriptApp.newTrigger('autoReply')
  .timeBased()
  .everyMinutes(10) // Better, custom time interval as a sript user property value.
  .create();

  ScriptApp.newTrigger('archive_log')
  .timeBased()
  .onMonthDay(1)
  .atHour(5)
  .create();

  // Add return value
}


/** Disable App by deleting all time-driven triggers. **/

function delete_Triggers() {

  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}


/** Inspired from : https://stackoverflow.com/a/27179623/3208373 **/

function getFirstEmptyRow(sheet, column) {
  var values = sheet.getRange(column + "1:" + column + sheet.getLastRow()).getValues();
  var ct = 0;
  while ( values[ct] && values[ct][0] != "" ) {
    ct++;
  }
  return (ct+1);
}


/** Frontend (1) **/

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}


/** Set Script User Parameters **/

function objSetproperties(objParams) {
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('FILTERS_SS_ID', objParams['filtersssid']);
  userProperties.setProperty('LOGS_SS_ID', objParams['logsssid']);
  userProperties.setProperty('START_HOUR', objParams['starthour']);
  userProperties.setProperty('FINISH_HOUR', objParams['finishhour']);
  userProperties.setProperty('TIME_INTERVAL', objParams['timeinterval']);
  userProperties.setProperty('DST_OFFSET', objParams['dstoffset']);
  
  /** Other properties **/
  
  // Cc email address (optional)
  // noReply flag (boolean, only when applicable)
  
  // return up-to-date properties ?
}


/** Get Script User Parameters **/

function objGetSettings(){
  var settingsObj = {};
  var driveRoot = DriveApp.getRootFolder();
  var driveUser = driveRoot.getOwner();
  settingsObj['userPhotoUrl'] = driveUser.getPhotoUrl()?driveUser.getPhotoUrl().replace(/=s.*$/,''):"data:image/png;base64,\
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\
dEoxq64J3QAAAABJRU5ErkJggg==";
  settingsObj['userEmail'] = Session.getEffectiveUser().getEmail(); 
  var userProperties = PropertiesService.getUserProperties();
  settingsObj['filtersssid'] = userProperties.getProperty('FILTERS_SS_ID');
  settingsObj['logsssid'] = userProperties.getProperty('LOGS_SS_ID');
  settingsObj['starthour'] = userProperties.getProperty('START_HOUR');
  settingsObj['finishhour'] = userProperties.getProperty('FINISH_HOUR');
  settingsObj['timeinterval'] = userProperties.getProperty('TIME_INTERVAL');
  settingsObj['dstoffset'] = userProperties.getProperty('DST_OFFSET');
  return settingsObj;
}