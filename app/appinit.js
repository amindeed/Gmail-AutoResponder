function appinit(DriveDirName) {
  
  var userProperties = PropertiesService.getUserProperties();
  
  if ( !userProperties.getProperty('alreadyRun') ) {
    
    // 1. Create `Filters` and `Logs` spreadsheets. Get URLs to show next to each one's input field.
    
    var ssFilters = SpreadsheetApp.create("GMAIL_AUTORESPONDER_FILTERS");
    var ssLogs = SpreadsheetApp.create("GMAIL_AUTORESPONDER_LOGS");
    
    var ssFiltersId = ssFilters.getId();
    var ssLogsId = ssLogs.getId();
    var scriptId = ScriptApp.getScriptId();
    
    userProperties.setProperty('FILTERS_SS_ID', ssFiltersId);
    userProperties.setProperty('LOGS_SS_ID', ssLogsId);
    
    var ssFiltersDrvFile = DriveApp.getFileById(ssFiltersId);
    var ssLogsDrvFile = DriveApp.getFileById(ssLogsId);
    var scriptFile = DriveApp.getFileById(scriptId);
    
    var appDrvFolder = DriveApp.createFolder(DriveDirName).getId();
    
    DriveApp.getFolderById(appDrvFolder).addFile(ssFiltersDrvFile);
    DriveApp.getFolderById(appDrvFolder).addFile(ssLogsDrvFile);
    DriveApp.getFolderById(appDrvFolder).addFile(scriptFile);
    
    DriveApp.getRootFolder().removeFile(ssFiltersDrvFile);
    DriveApp.getRootFolder().removeFile(ssLogsDrvFile);
    DriveApp.getRootFolder().removeFile(scriptFile); // considering it was created in Drive root folder
        
    var ssFiltersURL = ssFilters.getUrl();
    var ssLogsURL = ssLogs.getUrl();
    
    
    // 2. Place all app's files into the same Drive folder. Get and show URL of the folder.
    // 3. Create and set user script properties to their default values.
    // 4. [Create triggers _[, set Enable/Disable App flag]_ ].
    // 5. Let the user manually enable the application.
    // 6. Load app parameters into the frontend and let the user modify and save them.
    // 7. Set script user property 'alreadyRun' to true.
  
  }
  
 
  /* ------------------------------------------------------------------ */
  
  // Call after successful execution of 'set_Properties()'
  
  /** Create dedicated Drive directory for project components and get its ID **/
  //...
  
  /** Rename and move 'FILTERS' and 'LOGS' spreadsheets to the created directory **/
  var FiltersSSId = userProperties.getProperty('FILTERS_SS_ID');
  var LogsSSId = userProperties.getProperty('LOGS_SS_ID');
  var filters = DriveApp.getFileById(FiltersSSId);
  var logs = DriveApp.getFileById(LogsSSId);
  // Rename 'filters'
  // Rename 'logs'
  // DriveApp.getFolderById(Project_Dir_ID).addFile(filters);
  // DriveApp.getFolderById(Project_Dir_ID).addFile(logs);
  DriveApp.getRootFolder().removeFile(filters);
  DriveApp.getRootFolder().removeFile(logs);
  //...
  
  /** Move Apps Script project file to the new directory **/
  // Get Apps Script project file Drive ID
  // DriveApp.getFolderById(Project_Dir_ID).addFile(apps_script_file_id);
  // DriveApp.getRootFolder().removeFile(apps_script_file_id);
  
  /** Add script user's email address to `FROM_BLACKLIST` of 'FILTERS' **/
  var userProperties = PropertiesService.getUserProperties();
  var FiltersSSId = userProperties.getProperty('FILTERS_SS_ID');
  var config = SpreadsheetApp.openById(FiltersSSId);
  var config_sheet = config.getSheets()[0];
  var emptyCellIndex = getFirstEmptyRow(config_sheet, 'B');
  var emptyCell = config_sheet.getRange("B" + emptyCellIndex);
  emptyCell.setValue(Session.getActiveUser().getEmail());
  
  /** Check whether the user has a G-Suite account **/
  userProperties.setProperty('ISENABLED_NOREPLY', (Session.getActiveUser().getEmail().split('@')[1]!=='gmail.com')?true:false);
  
  /** Create script triggers **/
  create_Triggers(); 
}
