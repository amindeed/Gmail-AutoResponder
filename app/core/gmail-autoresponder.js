/**
 * Name 		  :	Gmail AutoResponder
 * Version 		:	0.1
 * Descriton 	:	Automatic processing of incoming GMail messages
 * Author 		:	Amine Al Kaderi <alkaderi@amindeed.com>
 * License 		:	MIT license
 */
 

/** Declare Application Logger class **/
/** createLoggerClass() should always be called before instanciating AppLogger **/
var AppLogger = null;
function createLoggerClass() { AppLogger = GSpreadsheetLogger }

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
  
  var timestamp = getTimestamp();
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


/** Init. app settings **/
function initSettings() {

  var userProperties = PropertiesService.getUserProperties();

  try {
    
    // Check whether or not it is a GSuite user account
    userProperties.setProperty(
      'IS_GSUITE_USER', 
      (Session.getActiveUser().getEmail().split('@')[1]!=='gmail.com')?true:false
    );

    // Set 'enableApp' flag to 'false'
    userProperties.setProperty('enableApp', false);

    // Initialize filters
    var filtersString = JSON.stringify(getDefaultFilters())
    userProperties.setProperty('filters', filtersString)

    // Initialize logs
    createLoggerClass();
    var loggerInstance = new AppLogger();
    var logger = loggerInstance.initLogger();
    var loggerString = JSON.stringify(logger);
    userProperties.setProperty('logger', loggerString)

    // Initialize time settings
    userProperties.setProperty('starthour', 17)
    userProperties.setProperty('finishhour', 8)
    userProperties.setProperty('utcoffset', 0)

    // Initialize email settings
    userProperties.setProperty('ccemailadr', '');
    userProperties.setProperty('bccemailadr', '');
    userProperties.setProperty(
      'noreply', 
      (userProperties.getProperty('IS_GSUITE_USER') === 'true')?1:2
    );
    userProperties.setProperty('msgbody', getDefaultMessageBody());

    // Set app as 'already initialized'
    userProperties.setProperty('appInitialized', 'TheAppHasAlreadyBeenInitialized')

    // Create the trigger
    ScriptApp.newTrigger('main')
    .timeBased()
    .everyMinutes(10)
    .create();

  } catch (e) {
    Logger.log(e.message);
    userProperties.deleteAllProperties();
  }
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
