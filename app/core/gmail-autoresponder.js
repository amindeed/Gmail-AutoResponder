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

function setProperties(objParams) {
  
  //➜ Should check first if (userProperties.getProperty('INIT_ALREADY_RUN') !== 'true')
  
  var errors = [];
  var returnObj = {
    'data': {},
    'errors': []
  };

  try {
      var userProperties = PropertiesService.getUserProperties();
      var defaultMsgBody = userProperties.getProperty('DEFAULT_MESSAGE_BODY');
      
      userProperties.setProperty('ENABLE_GMAUTOREP', (objParams['enablegmautorep'] === true)?'true':'false');
      userProperties.setProperty('FILTERS_SS_ID', objParams['filtersssid']);
      userProperties.setProperty('LOGS_SS_ID', objParams['logsssid']);
      
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
        
      if ( (objParams['noreply'] === 1) || (objParams['noreply'] === 2) ) {
        userProperties.setProperty('NOREPLY', (userProperties.getProperty('IS_GSUITE_USER') !== 'GMAIL')?objParams['noreply']:'2');
      } else {
        userProperties.setProperty('NOREPLY', (userProperties.getProperty('IS_GSUITE_USER') === 'GMAIL')?'2':'0');
      }
      
      userProperties.setProperty('STAR_PROCESSED_MESSAGE', (objParams['starmsg'] === false)?'false':'true');

  } catch(e) {
      errors.push(e.message)
  }

  returnObj['errors'] = errors;
  returnObj['data']['message'] = 'Settings updated successfully!';
  
  return returnObj; 
}

var setSettings = setProperties


/** Test Set Settings **/

function test_setSettings(objParams) {
  
  /* User Properties / App Settings:

    APP_ALREADY_INIT (instead of 'INIT_ALREADY_RUN')
    IS_GSUITE_USER

    enableApp
    filtersssurl  (instead of 'filtersssid')
    logsssurl  (instead of 'logsssid')
    starthour
    finishhour
    dstoffset
    ccemailadr
    bccemailadr
    noreply
    starmsg
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
  
  //➜ Should check first if (userProperties.getProperty('INIT_ALREADY_RUN') !== 'true')

  var errors = [];
  var settingsObj = {
    'data': {},
    'errors': []
  };
  
  try {
      //var driveRoot = DriveApp.getRootFolder();
      //var driveUserPhoto = driveRoot.getOwner().getPhotoUrl();
      var userProperties = PropertiesService.getUserProperties();
      //var defaultUserPhoto = userProperties.getProperty('DEFAULT_USER_PHOTO');
        
      //settingsObj['data']['userPhotoUrl'] = driveUserPhoto?driveUserPhoto.replace(/=s.*$/,''):defaultUserPhoto;
      settingsObj['data']['effectiveUserEmail'] = Session.getEffectiveUser().getEmail(); 
      settingsObj['data']['enablegmautorep'] = userProperties.getProperty('ENABLE_GMAUTOREP');
      settingsObj['data']['filtersssid'] = userProperties.getProperty('FILTERS_SS_ID');
      settingsObj['data']['filtersssurl'] = SpreadsheetApp.openById(userProperties.getProperty('FILTERS_SS_ID')).getUrl();
      settingsObj['data']['logsssid'] = userProperties.getProperty('LOGS_SS_ID');
      settingsObj['data']['logsssurl'] = SpreadsheetApp.openById(userProperties.getProperty('LOGS_SS_ID')).getUrl();
      settingsObj['data']['starthour'] = userProperties.getProperty('START_HOUR');
      settingsObj['data']['finishhour'] = userProperties.getProperty('FINISH_HOUR');
      settingsObj['data']['dstoffset'] = userProperties.getProperty('DST_OFFSET');
      settingsObj['data']['ccemailadr'] = userProperties.getProperty('CC_ADDRESS');
      settingsObj['data']['bccemailadr'] = userProperties.getProperty('BCC_ADDRESS');
      settingsObj['data']['noreply'] = userProperties.getProperty('NOREPLY');
      settingsObj['data']['starmsg'] = userProperties.getProperty('STAR_PROCESSED_MESSAGE');
      settingsObj['data']['msgbody'] = userProperties.getProperty('MESSAGE_BODY');

  } catch(e) {
      errors.push(e.message)
  }

  settingsObj['errors'] = errors;
  
  return settingsObj;
}


/** Test Get Settings **/

function test_getSettings(){
  
  /* User Properties / App Settings:

    APP_ALREADY_INIT (instead of 'INIT_ALREADY_RUN')
    IS_GSUITE_USER

    enableApp
    filtersssurl  (instead of 'filtersssid')
    logsssurl  (instead of 'logsssid')
    starthour
    finishhour
    dstoffset
    ccemailadr
    bccemailadr
    noreply
    starmsg
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
  
  // https://stackoverflow.com/a/19448513/3208373
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
  
  if ( (userProperties.getProperty('INIT_ALREADY_RUN') !== 'true') || (initParams && (initParams['resetApp'] === true)) ) {
    
    // 0. Delete All triggers, Logs/Filters spreadsheets and user script properties
    
    try {
       deleteAllTriggers();
       DriveApp.getFileById(userProperties.getProperty('FILTERS_SS_ID')).setTrashed(true);
       DriveApp.getFileById(userProperties.getProperty('LOGS_SS_ID')).setTrashed(true);
       userProperties.deleteAllProperties();
    } catch(e) {
       Logger.log(e.message);
    }
    
    // 1. Create `Filters` and `Logs` spreadsheets. Get URLs to show next to each one's input field.
    // 1.1. Place all app files in one Drive folder
    
    var ssFilters = SpreadsheetApp.create("GMAIL_AUTORESPONDER_FILTERS");
    var ssLogs = SpreadsheetApp.create("GMAIL_AUTORESPONDER_LOGS");
    
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
    
    //var ssFiltersURL = ssFilters.getUrl();
    //var ssLogsURL = ssLogs.getUrl();
    
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
    
    //// Default user photo URL
    //userProperties.setProperty('DEFAULT_USER_PHOTO', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEU...==');
    
    //// Check whether the user has a G-Suite account
    userProperties.setProperty(
      'IS_GSUITE_USER', 
      (Session.getActiveUser().getEmail().split('@')[1]!=='gmail.com')?'GSUITE':'GMAIL'
    );
    
    userProperties.setProperty(
      'DEFAULT_MESSAGE_BODY',
      '<p><strong>Automated response</strong></p>\
       <p>This automated response is only to \
       confirm that your e-mail has been well received.<br />\
       Thank you.</p>\
       <p>Best regards.</p>'
    );
    
    var defaultProperties = {
      'enablegmautorep': false,
      'filtersssid': ssFiltersId,
      'logsssid': ssLogsId,
      'starthour': 17,
      'finishhour': 8,
      'dstoffset': 0,
      'msgbody': userProperties.getProperty('DEFAULT_MESSAGE_BODY'),
      'noreply': (userProperties.getProperty('IS_GSUITE_USER') === 'GSUITE')?1:2,
      'starmsg': false
    };
    
    setProperties(defaultProperties);
    
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
    
    // 6. Set script user property 'INIT_ALREADY_RUN' to true.
    userProperties.setProperty('INIT_ALREADY_RUN', 'true');
    
    // 7. return webapp full URL
  } /*If*/
  
  return true;
}
