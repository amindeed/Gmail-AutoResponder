function myFunction() {

  //set_properties('zz_df65g4dfg6dfg65','xx_kiuop7i847pi87po');

  /** Delete all user properties in the current script. **/
  ///// var userProperties = PropertiesService.getUserProperties();

  ///// Logger.log("FILTERS_SS_ID =" + userProperties.getProperty('FILTERS_SS_ID'));
  ///// Logger.log("LOG_SS_ID =" + userProperties.getProperty('LOG_SS_ID'));

  /*
  var FiltersSSId = userProperties.getProperty('FILTERS_SS_ID');
  var config = SpreadsheetApp.openById(FiltersSSId);
  var config_sheet = config.getSheets()[0];
  var emptyCellIndex = getFirstEmptyRow(config_sheet, 'B');
  var emptyCell = config_sheet.getRange("B" + emptyCellIndex);
  */
  
  /** Add script user's email address to `FROM_BLACKLIST` column of 'FILTERS' spreadsheet **/
  // emptyCell.setValue(Session.getActiveUser().getEmail());

  // var file = DriveApp.getFileById('1OQ59iq7nKozSOmm-nhtkYmn50uwW6gwF');
  /* 'Test_Dir2_GDrive' */ // DriveApp.getFolderById('1Gowy7big9P44KGNrn6-ElkDG-bSBmwvU').addFile(file);
  // DriveApp.getRootFolder().removeFile(file);
  
  function uploadFile() {
  var image = UrlFetchApp.fetch('http://goo.gl/nd7zjB').getBlob();
  var file = {
    title: 'google_logo.png',
    mimeType: 'image/png'
  };
  file = Drive.Files.insert(file, image);
  Logger.log('ID: %s, File size (bytes): %s', file.id, file.fileSize);
}
  
  uploadFile();

}
