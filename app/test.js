function myFunction() {

  //set_properties('zz_df65g4dfg6dfg65','xx_kiuop7i847pi87po');

  /** Delete all user properties in the current script. **/
  var userProperties = PropertiesService.getUserProperties();
  // userProperties.deleteAllProperties();

  //Logger.log(PropertiesService.getUserProperties().getProperty(PropertiesService.getUserProperties().getKeys()[0]));
  //Logger.log(PropertiesService.getUserProperties().getProperty(PropertiesService.getUserProperties().getKeys()[1]));

  //Logger.log(PropertiesService.getUserProperties().getKeys()[0]);
  //Logger.log(PropertiesService.getUserProperties().getKeys()[1]);

  ///// Logger.log("FILTERS_SS_ID =" + userProperties.getProperty('FILTERS_SS_ID'));
  ///// Logger.log("LOG_SS_ID =" + userProperties.getProperty('LOG_SS_ID'));


  var FiltersSSId = userProperties.getProperty('FILTERS_SS_ID');
  var config = SpreadsheetApp.openById(FiltersSSId);
  var config_sheet = config.getSheets()[0];
  var emptyCellIndex = getFirstEmptyRow(config_sheet, 'B');
  var emptyCell = config_sheet.getRange("B" + emptyCellIndex);
  
  // Add script user's email address to `FROM_BLACKLIST` column of 'FILTERS' spreadsheet
  emptyCell.setValue(Session.getActiveUser().getEmail());


}
