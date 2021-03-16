/**
 * Name 		  :	Gmail AutoResponder
 * Version 		:	0.1
 * Descriton 	:	Automatic processing of incoming GMail messages
 * Author 		:	Amine Al Kaderi <alkaderi@amindeed.com>
 * License 		:	MIT license
 */
 

/** Declare Application Logger class **/
/** createLoggerClass() should always be called before instanciating AppLogger 
 *  Example:
 *    createLoggerClass();
 *    var loggerInstance = new AppLogger(loggerIdentifiersObject);
 *    loggerInstance.append(sessionInfo1DArray, 'EXECUTIONS');
 *    loggerInstance.append(processedMsgs2DArray, 'PROCESSED');
 **/
var AppLogger = null;
function createLoggerClass() { AppLogger = GSpreadsheetLogger }


/** Delete all script triggers. **/
function deleteAllTriggers() {

  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
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

      if (isEmpty(appSettings)) {
        Logger.log('App initialized'); //DEBUG
        appSettings = initSettings();
      }

      for (var key in appSettings) {
        settingsObj['data'][key] = appSettings[key];
      }

  } catch(e) {
      errors.push(e.message);
  }

  settingsObj['errors'] = errors;
  
  return settingsObj;
}


/** Set Script User Parameters **/
function setSettings(objParams) {

  // TODO: check if app needs to be [re]initialized

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


/** Init. app settings **/
function initSettings(reset=false) {

  var userProperties = PropertiesService.getUserProperties();
  var currentLogger = userProperties.getProperty('logger');
  var currentLoggerObj = null;
  var result = {};

  try {
    if ( reset 
        && isJsonObject(currentLogger) 
        && !isEmpty(JSON.parse(currentLogger))
        ) {
            var loggerObj = JSON.parse(userProperties.getProperty('logger'));
            createLoggerClass();
            var loggerInstance = new AppLogger(loggerObj);
            currentLoggerObj = loggerInstance.initLogger();
    }

    // Delete any existing/remaining properties
    userProperties.deleteAllProperties();
    
    // General settings
    userProperties.setProperty(
      'IS_GSUITE_USER', 
      (Session.getActiveUser().getEmail().split('@')[1]!=='gmail.com')?true:false
    );
    var scriptId = ScriptApp.getScriptId();
    var coreAppEditUrls = { 'urls': [
                                    'https://script.google.com/d/' + scriptId + '/edit',
                                    'https://script.google.com/home/projects/' + scriptId + '/edit'
                                    ]
                          };
    userProperties.setProperty('coreAppEditUrl', JSON.stringify(coreAppEditUrls));
    userProperties.setProperty('enableApp', false);

    // Initialize filters
    var filtersString = JSON.stringify(getDefaultFilters())
    userProperties.setProperty('filters', filtersString)

    // Initialize logs
      /**
        Example 'logger' / 'loggerString' value:
        {
          'id': 'XXXXXX',
          'viewUri': 'https://www.xxxx.yy?view',
          'updateUri': 'https://www.xxxx.yy?update'
        }
      **/
    if (currentLoggerObj) {
      var loggerString = JSON.stringify(currentLoggerObj);
      userProperties.setProperty('logger', loggerString)
    } else {
      createLoggerClass();
      var loggerInstance = new AppLogger();
      var logger = loggerInstance.initLogger();
      var loggerString = JSON.stringify(logger);
      userProperties.setProperty('logger', loggerString)
    }

    // Initialize time settings
    userProperties.setProperty('timeinterval', 10)
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
    //userProperties.setProperty('appInitialized', 'TheAppHasAlreadyBeenInitialized')

    // Create the trigger
    ScriptApp.newTrigger('main')
    .timeBased()
    .everyMinutes(10)
    .create();

    // Return an object of initialized script user properties
    result = userProperties.getProperties();


  } catch (e) {
    userProperties.deleteAllProperties();
    result['error'] = e.message;
  }
  return result
}


/** Get default response message body **/
function getDefaultMessageBody() {

  return '<p><strong>Automated response</strong></p>\
       <p>This automated response is only to \
       confirm that your e-mail has been well received.<br />\
       Thank you.</p>'
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
