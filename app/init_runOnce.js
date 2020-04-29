function init_runOnce(DriveDirName) {
  
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
