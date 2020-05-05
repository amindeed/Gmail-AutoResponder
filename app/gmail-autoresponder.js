
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
  var ops_log_sheet = log.getSheets()[0];
  
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


/** Delete all script triggers. **/

function deleteAllTriggers() {

  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}


/** Inspired from : https://stackoverflow.com/a/27179623/3208373 **/
/***** No longer needed. Kept for reference.
function getFirstEmptyRow(sheet, column) {
  var values = sheet.getRange(column + "1:" + column + sheet.getLastRow()).getValues();
  var ct = 0;
  while ( values[ct] && values[ct][0] != "" ) {
    ct++;
  }
  return (ct+1);
}
*****/

/** Frontend (1) **/

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
           .setTitle('Gmail AutoResponder - Settings')
           .setFaviconUrl('https://findicons.com/files/icons/42/basic/16/letter.png'); // Sample favicon. Base64 data URLs not supported.
}


/** Set Script User Parameters **/

function setProperties(objParams) {
  var userProperties = PropertiesService.getUserProperties();
  var defaultMsgBody = userProperties.getProperty('DEFAULT_MESSAGE_BODY');
  
  userProperties.setProperty('FILTERS_SS_ID', objParams['filtersssid']); // Consider preventing rewriting of correct values with empty string
  userProperties.setProperty('LOGS_SS_ID', objParams['logsssid']); // Consider preventing rewriting of correct values with empty string
  
  if ( objParams['starthour'] ) {
    userProperties.setProperty('START_HOUR', objParams['starthour']);
  } else {
    userProperties.setProperty('START_HOUR', 17);
  }

  if ( objParams['finishhour'] ) {
    userProperties.setProperty('FINISH_HOUR', objParams['finishhour']);
  } else {
    userProperties.setProperty('FINISH_HOUR', 8);
  }
  
  if ( objParams['dstoffset'] ) {
    userProperties.setProperty('DST_OFFSET', objParams['dstoffset']);
  } else {
    userProperties.setProperty('DST_OFFSET', 0);
  }
  
  userProperties.setProperty('MESSAGE_BODY', objParams['msgbody']?objParams['msgbody']:defaultMsgBody);
    
  if ( objParams['ccemailadr'] ) {
    userProperties.setProperty('CC_ADDRESS', objParams['ccemailadr']);
  } else {
    userProperties.setProperty('CC_ADDRESS', '');
  }
  
  if ( objParams['bccemailadr'] ) {
    userProperties.setProperty('BCC_ADDRESS', objParams['bccemailadr']);
  } else {
    userProperties.setProperty('BCC_ADDRESS', '');
  }
  
  /*
  Logger.log("[DEBUG/SET] \'IS_GSUITE_USER\' === " 
             + userProperties.getProperty('IS_GSUITE_USER') 
             + ", of type : " 
             + typeof(userProperties.getProperty('IS_GSUITE_USER'))
             );
  Logger.log("[DEBUG/SET] objParams[\'noreply\'] === " + objParams['noreply'] + ", of type : " + typeof(objParams['noreply']));
  */
  
  if ( (objParams['noreply'] === "YES") || (objParams['noreply'] === "NO") ) {
    userProperties.setProperty('NOREPLY', (userProperties.getProperty('IS_GSUITE_USER') !== 'GMAIL')?objParams['noreply']:"N_A");
  } else {
    userProperties.setProperty('NOREPLY', (userProperties.getProperty('IS_GSUITE_USER') === 'GMAIL')?"N_A":"NO");
  }
  
  //Logger.log("[DEBUG/SET] objParams[\'starmsg\'] === " + objParams['starmsg'] + ", of type : " + typeof(objParams['starmsg']));
  userProperties.setProperty('STAR_PROCESSED_MESSAGE', (objParams['starmsg'] === 'NO')?'NO':'YES');
  
}


/** Get Script User Parameters **/

function getSettings(){
  var settingsObj = {};
  var driveRoot = DriveApp.getRootFolder();
  var driveUserPhoto = driveRoot.getOwner().getPhotoUrl();
  var userProperties = PropertiesService.getUserProperties();
  var defaultUserPhoto = userProperties.getProperty('DEFAULT_USER_PHOTO');
    
  settingsObj['userPhotoUrl'] = driveUserPhoto?driveUserPhoto.replace(/=s.*$/,''):defaultUserPhoto;
  settingsObj['userEmail'] = Session.getEffectiveUser().getEmail(); 
  settingsObj['filtersssid'] = userProperties.getProperty('FILTERS_SS_ID');
  settingsObj['logsssid'] = userProperties.getProperty('LOGS_SS_ID');
  settingsObj['starthour'] = userProperties.getProperty('START_HOUR');
  settingsObj['finishhour'] = userProperties.getProperty('FINISH_HOUR');
  settingsObj['dstoffset'] = userProperties.getProperty('DST_OFFSET');
  settingsObj['ccemailadr'] = userProperties.getProperty('CC_ADDRESS');
  settingsObj['bccemailadr'] = userProperties.getProperty('BCC_ADDRESS');
  settingsObj['noreply'] = userProperties.getProperty('NOREPLY');
  settingsObj['starmsg'] = userProperties.getProperty('STAR_PROCESSED_MESSAGE');
  settingsObj['msgbody'] = userProperties.getProperty('MESSAGE_BODY');
  
  return settingsObj;
}
