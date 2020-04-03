function init(FiltersSSId, LogSSId /*, StartHour, FinishHour, Interval, CcEmailAdrs, GSuiteNoReply*/) {
  
  /** Set 'FILTERS' and 'LOGS' spreadsheets IDs **/
  set_properties(FiltersSSId, LogSSId);

  var userProperties = PropertiesService.getUserProperties();
  var FiltersSSId = userProperties.getProperty('FILTERS_SS_ID');
  var config = SpreadsheetApp.openById(FiltersSSId);
  var config_sheet = config.getSheets()[0];
  var emptyCellIndex = getFirstEmptyRow(config_sheet, 'B');
  var emptyCell = config_sheet.getRange("B" + emptyCellIndex);
  
  /** Add script user's email address to `FROM_BLACKLIST` of 'FILTERS' **/
  emptyCell.setValue(Session.getActiveUser().getEmail());
  
  /** Create script triggers **/
  create_Triggers(); 
}
