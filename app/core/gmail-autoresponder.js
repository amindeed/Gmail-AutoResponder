/**
 * Name 		:	Gmail AutoResponder
 * Version 		:	0.1
 * Descriton 	:	Automatic processing of incoming GMail messages
 * Author 		:	Amine Al Kaderi <alkaderi@amindeed.com>
 * License 		:	GNU GPLv3 license
 */
 

/** Check if string contains specified substring **/

function containsString(inputStr, checklist) {
  var contains = false;
  var i = 0;
  while (!contains && i < checklist.length) {
    if (inputStr.indexOf(checklist[i]) !== -1) {
      contains = true;
    } else {i++;}
  }
  return contains;
}


/** Check if string matches specified regex **/

function matchesRegex(inputStr, regexStr) {
  var matches = false;
  var i = 0;
  while (!matches && i < regexStr.length) {
    var regex = new RegExp(regexStr[i],'i');
    if (inputStr.match(regex)) {
      matches = true;
    } else {i++;}
  }
  return matches;
}


/** Get values in a Sheet's column **/

function columnValues(sheet, column, remove_header){
  var values = sheet.getRange(column + "1:" + column + sheet.getMaxRows()).getValues();
  (values = [].concat.apply([], values.filter(String))).splice(0,remove_header?1:0);
  return values
}


/** Archiving logs monthly to separate sheets **/

function archiveLog() {
   
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


/** Set Script User Parameters **/

function setSettings(objParams) {
  
  /* User Properties / App Settings:

    APP_ALREADY_INIT (instead of 'INIT_ALREADY_RUN')
    IS_GSUITE_USER

    enableApp
    filtersssid
    filtersssurl
    logsssid
    logsssurl
    starthour
    finishhour
    utcoffset
    ccemailadr
    bccemailadr
    noreply
    msgbody
  */

  var errors = [
      {
        non_existing_properties: []
      }
    ];

  var returnObj = {
    'data': {},
    'errors': []
  };

  try {
      var userProperties = PropertiesService.getUserProperties();

      for (item in objParams) {
        if (!userProperties.getProperty(item) && userProperties.getProperty(item) !== '') {
          errors[0]['non_existing_properties'].push(item)
        }
      }

      if (errors[0]['non_existing_properties'].length) {
        throw new Error;
      } else {
        userProperties.setProperties(objParams)
        returnObj['data']['success_message'] = '[Apps Script] Gmail AutoResponder user settings updated successfully.';
      }

  } catch(e) {
      e.message?errors.push(e.message):null;
  }

  returnObj['errors'] = errors;
  return returnObj; 
}



/** Get Script User Parameters **/

function getSettings(){
  
  /* User Properties / App Settings:

    APP_ALREADY_INIT (instead of 'INIT_ALREADY_RUN')
    IS_GSUITE_USER

    enableApp
    filtersssid
    filtersssurl
    logsssid
    logsssurl
    starthour
    finishhour
    utcoffset
    ccemailadr
    bccemailadr
    noreply
    msgbody
  */

  var errors = [];
  var settingsObj = {
    'data': {},
    'errors': []
  };
  
  try {
      
      var userProperties = PropertiesService.getUserProperties();
      var appSettings = userProperties.getProperties();

      for (var key in appSettings) {
        settingsObj['data'][key] = appSettings[key];
      }

  } catch(e) {
      errors.push(e.message);
  }

  settingsObj['errors'] = errors;
  
  return settingsObj;
}


/** App Init & Reset Function **/

function appinit(initParams) {
  
  // Generate timestamp
  function pad2(n) { return n < 10 ? '0' + n : n }
  var date = new Date();
  var timestamp = date.getFullYear().toString() 
                  + pad2(date.getMonth() + 1) 
                  + pad2(date.getDate()) 
                  + pad2(date.getHours()) 
                  + pad2(date.getMinutes()) 
                  + pad2(date.getSeconds());
  
  var driveDirName = (initParams && initParams['dirName'])?initParams['dirName']:'Gmail_AutoResponder_'+timestamp;
  
  var userProperties = PropertiesService.getUserProperties();
  
  if ( (userProperties.getProperty('APP_ALREADY_INIT') !== 'true') || (initParams && (initParams['resetApp'] === true)) ) {
    
    // 0. Delete All triggers, Logs/Filters spreadsheets and user script properties
    
    try {

       deleteAllTriggers();
       DriveApp.getFileById(userProperties.getProperty('filtersssid')).setTrashed(true);
       DriveApp.getFileById(userProperties.getProperty('logsssid')).setTrashed(true);
       userProperties.deleteAllProperties();

    } catch(e) {
       Logger.log(e.message);
    }
    
    // 1. Create `Filters` and `Logs` spreadsheets. Get URLs to show next to each one's input field.
    // 1.1. Place all app files in one Drive folder
    
    var ssFilters = SpreadsheetApp.create("GMAIL_AUTORESPONDER_FILTERS");
    var ssLogs = SpreadsheetApp.create("GMAIL_AUTORESPONDER_LOGS");

    var ssFiltersURL = ssFilters.getUrl();
    var ssLogsURL = ssLogs.getUrl();
    
    var ssFiltersId = ssFilters.getId();
    var ssLogsId = ssLogs.getId();
    var scriptId = ScriptApp.getScriptId();
    
    var ssFiltersDrvFile = DriveApp.getFileById(ssFiltersId);
    var ssLogsDrvFile = DriveApp.getFileById(ssLogsId);
    var scriptFile = DriveApp.getFileById(scriptId);
    
    var appDrvFolder = DriveApp.createFolder(driveDirName).getId(); 
    
    DriveApp.getFolderById(appDrvFolder).addFile(ssFiltersDrvFile);
    DriveApp.getFolderById(appDrvFolder).addFile(ssLogsDrvFile);
    DriveApp.getFolderById(appDrvFolder).addFile(scriptFile);
    
    DriveApp.getRootFolder().removeFile(ssFiltersDrvFile);
    DriveApp.getRootFolder().removeFile(ssLogsDrvFile);

    var oldParent = scriptFile.getParents().next();

    oldParent.removeFile(scriptFile);

    if (oldParent.getParents().hasNext() && !oldParent.getFiles().hasNext()) {
      oldParent.setTrashed(true);
    }
    
    
    // 1.2. Initialize 'Filters' and 'Logs' spreadsheets
    
    var openSsFilters = SpreadsheetApp.openById(ssFiltersId);
    var firstFiltersSheet = openSsFilters.getSheets()[0];

    var values = [
      ['RAWMSG_BLACKLIST', 'FROM_BLACKLIST', 'FROM_WHITELIST', 'TO_BLACKLIST', 'TO_WHITELIST'],
      ['report-type=disposition-notification', '(^|<)((mailer-daemon|postmaster)@.*)', '', 'undisclosed-recipients', ''],
      ['', 'noreply|no-reply|do-not-reply', '', '', ''],
      ['', '.+@.*\\bgoogle\\.com', '', '', ''],
      ['', Session.getActiveUser().getEmail(), '', '', '']
    ];

    var range = firstFiltersSheet.getRange("A1:E5");
    range.setValues(values);
    
    var filtersHeader = firstFiltersSheet.getRange("A1:E1");
    filtersHeader.setFontWeight("bold");
    filtersHeader.setBackground("#cfe2f3");
    firstFiltersSheet.setFrozenRows(1);

    openSsFilters.setActiveSheet(firstFiltersSheet);
    openSsFilters.renameActiveSheet('FILTERS');
    
    var openSsLogs = SpreadsheetApp.openById(ssLogsId);
    
    var firstLogsSheet = openSsLogs.getSheets()[0];
    firstLogsSheet.appendRow(
      [
        'Label', 
        'Date/time Sent (Original message)', 
        'Date/time Sent (Response)', 
        'Message ID', 
        'Thread ID', 
        'From', 
        'Subject'
      ]
    );
    
    var logsHeader1 = firstLogsSheet.getRange("A1:G1");
    logsHeader1.setFontWeight("bold");
    logsHeader1.setBackground("#cfe2f3");
    firstLogsSheet.setFrozenRows(1);
    
    openSsLogs.setActiveSheet(firstLogsSheet);
    openSsLogs.renameActiveSheet('PROCESSED_MSGS');
    
    var secondLogsSheet = openSsLogs.insertSheet('EXECUTIONS');
    secondLogsSheet.appendRow(
      [
        'SEARCH QUERY', 
        'EXECUTION TIME', 
        'NUMBER OF THREADS'
      ]
    );

    var logsHeader2 = secondLogsSheet.getRange("A1:C1");
    logsHeader2.setFontWeight("bold");
    logsHeader2.setBackground("#cfe2f3");
    secondLogsSheet.setFrozenRows(1);
    
    // 3. Create and set user script properties to their default values.
    
    //// Check whether the user has a G-Suite account
    userProperties.setProperty(
      'IS_GSUITE_USER', 
      (Session.getActiveUser().getEmail().split('@')[1]!=='gmail.com')?'GSUITE':'GMAIL'
    );
    
    var defaultMsgBody = '<p><strong>Automated response</strong></p>\
       <p>This automated response is only to \
       confirm that your e-mail has been well received.<br />\
       Thank you.</p>';
    
    var defaultProperties = {
      'enableApp': false,
      'filtersssid': ssFiltersId,
      'filtersssurl': ssFiltersURL,
      'logsssid': ssLogsId,
      'logsssurl': ssLogsURL,
      'starthour': 17,
      'finishhour': 8,
      'utcoffset': 0,
      'msgbody': defaultMsgBody,
      'noreply': (userProperties.getProperty('IS_GSUITE_USER') === 'GSUITE')?1:2
    };
    
    setSettings(defaultProperties);
    
    // 4. Create script triggers
    
    ScriptApp.newTrigger('autoReply')
    .timeBased()
    .everyMinutes(10)
    .create();

    ScriptApp.newTrigger('archiveLog')
    .timeBased()
    .onMonthDay(1)
    .atHour(5)
    .create();
    
    // 5. Provide the user with a Enable/Disable switch
    // ...
    
    // 6. Set script user property 'APP_ALREADY_INIT' to true.
    userProperties.setProperty('APP_ALREADY_INIT', true);
    
    // 7. return webapp full URL
  } /*If*/
  
  return true;
}


/** DRAFT: Get message filters **/
function getMessageFilters() {
  
  var filters = {}

  return filters
}


/** DRAFT: Filter Gmail Message **/
function filterMessage(gmailMessage, filtersObject) {

  var filterOut = false
  var filtersObject = getMessageFilters()

  /*

  var filtersssid = userProperties.getProperty('filtersssid');
  var config = SpreadsheetApp.openById(filtersssid);
  var config_sheet = config.getSheets()[0];

  var From_blacklist = columnValues(config_sheet,"B",1);
  var To_blacklist = columnValues(config_sheet,"C",1);
  var RawMsg_blacklist = columnValues(config_sheet,"A",1);

  !containsString(msgTo,To_blacklist)
  && !matchesRegex(msgFrom,From_blacklist)
  && !containsString(messages[lastMsg].getRawContent(),RawMsg_blacklist)

  */


  return filterOut
}


/** DRAFT: Reply to Gmail thread **/
function replyToThread(gmailThread) {

  /*
  
  threads[i].reply("", {
            htmlBody: repMsgBody
                    + '<span style=\"color: #333399;\">'
                    + '-----------------------------------------------------'
                    + '<br/><b>From : </b>' + msgFrom
                    + '<br/><b>Date : </b>' + msgDate
                    + '<br/><b>Subject : </b>' + msgSubject
                    + '<br/><b>To : </b>' + msgTo
                    + '<br/><b>Cc : </b>' + msgCc
                    + '</span>'
                    + '<br/><br/>' + msgBody + '<br/>',
                    cc: ccemailadr,
                    bcc: bccemailadr,
                    noReply: (repNoReply === 'true')?true:((repNoReply === 'false')?false:null)
          });
  
  */

}


/** DRAFT: Log processed message **/
function logProcessedMessage(gmailMessage, isFilterOut) {

  /*

  var logsssid = userProperties.getProperty('logsssid');
  var log = SpreadsheetApp.openById(logsssid);
  var ops_log_sheet = log.getSheets()[0];
  
  if ( !isFilterOut ) {

    // Log as 'REP SENT'
    // Note that the ID of a Gmail thread is the ID of its first message
    ops_log_sheet.appendRow(['REP SENT', msgDate, new Date().toLocaleString(), msgId, threads[i].getId(), msgFrom, msgSubject]);

  } else {

    // Log as 'SKIPPED'
    var msgDate = messages[lastMsg].getDate(), msgSubject = messages[lastMsg].getSubject();
    ops_log_sheet.appendRow(['SKIPPED', msgDate, 'N/A', msgId, threads[i].getId(), msgFrom, msgSubject]);

  }

  // TODO: append 2D array (or the JSON object) of processed messages to the Google Sheets log
  
  */

}


/** DRAFT: log execution time and number of messages retrieved **/
function logExecutionSession(logsTarget){

  /*

  var logsssid = userProperties.getProperty('logsssid');
  var log = SpreadsheetApp.openById(logsssid);
  var exec_log_sheet = log.getSheets()[1];

  exec_log_sheet.appendRow([searchQuery, new Date().toLocaleString(), threads.length]);
  
  */

}
