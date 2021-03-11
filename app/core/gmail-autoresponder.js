/**
 * Name 		  :	Gmail AutoResponder
 * Version 		:	0.1
 * Descriton 	:	Automatic processing of incoming GMail messages
 * Author 		:	Amine Al Kaderi <alkaderi@amindeed.com>
 * License 		:	GNU GPLv3 license
 */
 

/** Archiving logs monthly to separate sheets **/
/* 
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
  
  // Logged execution sessions
  var exec_log_sheet = log.getSheets()[1];
  // exec_log_sheet.deleteRows(2, exec_log_sheet.getLastRow() - 1);
  var range = exec_log_sheet.getRange(2,1,exec_log_sheet.getLastRow()-1,exec_log_sheet.getLastColumn());
  range.clear(); 
} 
*/


/** Delete all script triggers. **/
function deleteAllTriggers() {

  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}


/** Set Script User Parameters **/
function setSettings(objParams) {

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
        // /!\ If objParams item is a JSON object, it should be serialiazed ('stringified') first.
        userProperties.setProperties(objParams)
        returnObj['data']['success_message'] = '[Apps Script] Gmail AutoResponder user settings updated successfully.';
      }

  } catch(e) {
      e.message?errors.push(e.message):null;
  }

  returnObj['errors'] = errors;
  return returnObj; 
}


/** Get default response message body **/
function getDefaultMessageBody() {

  return '<p><strong>Automated response</strong></p>\
       <p>This automated response is only to \
       confirm that your e-mail has been well received.<br />\
       Thank you.</p>'
}


/** Initialize a Sheet **/
function initSheet(spreadSheetId, sheetNdx, header, sheetNewName=null) {

  var result = {
    'spreadsheetId': spreadSheetId,
  }
  sheetNewName?result['sheetNewName'] = sheetNewName:null;

  var spreadsheet = SpreadsheetApp.openById(spreadSheetId);
  var sheet = null
  
  if ( sheetNdx > spreadsheet.getNumSheets() -1 ) {
    sheet = spreadsheet.insertSheet(sheetNdx)
  } else {
    sheet = spreadsheet.getSheets()[sheetNdx]
  }

  // Clear sheet
  sheet.setFrozenRows(0);
  sheet.getLastRow()?sheet.deleteRows(1, sheet.getLastRow()):null;

  sheet.appendRow(header);

  // Format and freeze the header row
  var sheetHeader = sheet.getRange(1, 1, 1, header.length);
  sheetHeader.setFontWeight("bold");
  sheetHeader.setBackground("#cfe2f3");
  sheet.setFrozenRows(1);
  
  if (sheetNewName) {
    spreadsheet.setActiveSheet(sheet);
    spreadsheet.renameActiveSheet(sheetNewName);
  }

  result['intializedSheetIndex'] = sheet.getIndex();

  return result
}


/** Get Script User Parameters **/
function getSettings(){

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


/** DRAFT: App Init & Reset Function **/
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
    
    // 0. Delete All triggers, Logs spreadsheet and user script properties
    
    try {

       deleteAllTriggers();
       DriveApp.getFileById(userProperties.getProperty('logsssid')).setTrashed(true);
       userProperties.deleteAllProperties();

    } catch(e) {
       Logger.log(e.message);
    }
    
    // 1. Create `Logs` spreadsheet. Get URL.
    // 1.1. Place all app files in one Drive folder
    
    var ssLogs = SpreadsheetApp.create("GMAIL_AUTORESPONDER_LOGS");
    
    var ssLogsId = ssLogs.getId();
    var scriptId = ScriptApp.getScriptId();
    
    var ssLogsDrvFile = DriveApp.getFileById(ssLogsId);
    var scriptFile = DriveApp.getFileById(scriptId);
    
    var appDrvFolder = DriveApp.createFolder(driveDirName).getId(); 
    
    DriveApp.getFolderById(appDrvFolder).addFile(ssLogsDrvFile);
    DriveApp.getFolderById(appDrvFolder).addFile(scriptFile);
    
    DriveApp.getRootFolder().removeFile(ssLogsDrvFile);

    var oldParent = scriptFile.getParents().next();

    oldParent.removeFile(scriptFile);

    if (oldParent.getParents().hasNext() && !oldParent.getFiles().hasNext()) {
      oldParent.setTrashed(true);
    }
    
    
    // 1.2. Initialize 'Logs' spreadsheet

    processedMsgsLogHeader = [
        'Label', 
        'Date/time Sent (Original message)', 
        'Date/time Sent (Response)', 
        'Message ID', 
        'Thread ID', 
        'From', 
        'Subject',
        'Applied Filter'
    ]
    
    initSheet(ssLogsId, 0, processedMsgsLogHeader, 'PROCESSED_MSGS');


    sessionsLogHeader = ['SEARCH QUERY', 'EXECUTION TIME', 'NUMBER OF THREADS']
    initSheet(ssLogsId, 0, sessionsLogHeader, 'EXECUTIONS');
    
    
    // 3. Create and set user script properties to their default values.
    
    //// Check whether the user has a G-Suite account
    userProperties.setProperty(
      'IS_GSUITE_USER', 
      (Session.getActiveUser().getEmail().split('@')[1]!=='gmail.com')?'GSUITE':'GMAIL'
    );
    
    var defaultMsgBody = getDefaultMessageBody();
    
    var defaultProperties = {
      'enableApp': false,
      'logsssid': ssLogsId,
      'logsssurl': ssLogs.getUrl(),
      'starthour': 17,
      'finishhour': 8,
      'utcoffset': 0,
      'msgbody': defaultMsgBody,
      'noreply': (userProperties.getProperty('IS_GSUITE_USER') === 'GSUITE')?1:2
    };

      /* User Properties / App Settings:

        'APP_ALREADY_INIT': '',
        'IS_GSUITE_USER': (Session.getActiveUser().getEmail().split('@')[1]!=='gmail.com')?true:false,
        'enableApp': false,
        'filters': JSON.stringify(getDefaultFilters()),
        'logsssid': '',
        'logsssurl': '',
        'starthour': 17,
        'finishhour': 8,
        'utcoffset': 0,
        'ccemailadr': '',
        'bccemailadr': '',
        'noreply': '',
        'msgbody': getDefaultMessageBody()
      */
    
    setSettings(defaultProperties);
    
    // 4. Create script triggers
    
    ScriptApp.newTrigger('main')
    .timeBased()
    .everyMinutes(10)
    .create();

    /* 
    ScriptApp.newTrigger('archiveLog')
    .timeBased()
    .onMonthDay(1)
    .atHour(5)
    .create(); 
    */
    
    // 5. Provide the user with a Enable/Disable switch
    // ...
    
    // 6. Set script user property 'APP_ALREADY_INIT' to true.
    userProperties.setProperty('APP_ALREADY_INIT', true);
    
    // 7. return webapp full URL
  } /*If*/
  
  return true;
}


/** Get last message in a Gmail thread **/
function getLastMessage(gmailThread) {

  var threadMessages = gmailThread.getMessages();
  var lastMsgNdx = threadMessages.length -1;
  return threadMessages[lastMsgNdx]

}


/** Reply to Gmail thread, quoting last message **/
function replyToThread(gmailThread) {
  
  var userProperties = PropertiesService.getUserProperties();
  var appSettings = userProperties.getProperties();

  var lastMsg = getLastMessage(gmailThread);

  var receivedMsgFrom = lastMsg.getFrom();
  var receivedMsgTo = lastMsg.getTo();
  var receivedMsgDate = lastMsg.getDate();
  var receivedMsgSubject = lastMsg.getSubject();
	var receivedMsgCc = lastMsg.getCc();
	var receivedMsgBody = lastMsg.getBody();

  gmailThread.reply("", 
    {
        htmlBody: appSettings['msgbody']
                + '<br/><span style=\"color: #333399;\">'
                + '-----------------------------------------------------'
                + '<br/><b>From : </b>' + receivedMsgFrom
                + '<br/><b>Date : </b>' + receivedMsgDate
                + '<br/><b>Subject : </b>' + receivedMsgSubject
                + '<br/><b>To : </b>' + receivedMsgTo
                + '<br/><b>Cc : </b>' + receivedMsgCc
                + '</span>'
                + '<br/><br/>' + receivedMsgBody + '<br/>',
                cc: appSettings['ccemailadr'],
                bcc: appSettings['bccemailadr'],
                noReply: (appSettings['noreply'] === 'true')?true:null
    }
  );
}
