function archive_log() {

  /*** Archiving logs monthly ***/

  var LogSSId = 'LOG-SPREADSHEET-ID';
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

}