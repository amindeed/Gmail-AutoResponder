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



function ColumnValues(sheet, column, remove_header){
  var values = sheet.getRange(column + "1:" + column + sheet.getMaxRows()).getValues();
  (values = [].concat.apply([], values.filter(String))).splice(0,remove_header?1:0);
  return values
}



function set_properties(FiltersSSId, LogSSId) {
  
  var userProperties = PropertiesService.getUserProperties();
  
  userProperties.setProperty('FILTERS_SS_ID', FiltersSSId);
  userProperties.setProperty('LOG_SS_ID', LogSSId);
  
  
  /*** Inspired from : https://stackoverflow.com/a/27179623/3208373 ***/
  function getFirstEmptyRow(sheet, column) {
    var values = sheet.getRange(column + "1:" + column + sheet.getLastRow()).getValues();
    var ct = 0;
    while ( values[ct] && values[ct][0] != "" ) {
      ct++;
    }
    return (ct+1);
  }
  
  var FiltersSSId = userProperties.getProperty('FILTERS_SS_ID');
  var config = SpreadsheetApp.openById(FiltersSSId);
  var config_sheet = config.getSheets()[0];
  
  var emptyCellIndex = getFirstEmptyRow(config_sheet, 'B');
  var emptyCell = config_sheet.getRange("B" + emptyCellIndex);
  emptyCell.setValue(Session.getActiveUser().getEmail());
  
  /** Other properties **/
  
  // Start hour
  // Finish hour
  // Interval
  // DST offset
  // Cc email address (optional)
  // noReply (boolean, only when applicable)
  
  // Add return value
  
}



function archive_log() {
  
  /*** Archiving logs monthly ***/
  
  var LogSSId = userProperties.getProperty('LOG_SS_ID');
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



function manage_triggers() {

  ScriptApp.newTrigger('autoReply')
  .timeBased()
  .everyMinutes(10) // Better, custom time interval as a sript user property value.
  .create();

  ScriptApp.newTrigger('archive_log')
  .timeBased()
  .onMonthDay(1)
  .atHour(5)
  .create();

  // Disable App by simply deleting all time-driven triggers.
  /*
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  */

  // Add return value
}



/*** Inspired from : https://stackoverflow.com/a/27179623/3208373 ***/

function getFirstEmptyRow(sheet, column) {
  var values = sheet.getRange(column + "1:" + column + sheet.getLastRow()).getValues();
  var ct = 0;
  while ( values[ct] && values[ct][0] != "" ) {
    ct++;
  }
  return (ct+1);
}