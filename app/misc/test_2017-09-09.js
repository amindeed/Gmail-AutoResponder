/** Check work log, entry '2017-09-09' for more details **/

function myFunction() {


  function ColumnValues(sheet, column, remove_header){
    // shift: {0, false, undefined, null, NaN, ""} <=> false
    var values = sheet.getRange(column + "1:" + column + sheet.getMaxRows()).getValues();
    (values = [].concat.apply([], values.filter(String))).splice(0,remove_header?1:0);
    return values
  }

  // Logs #1
  var log = SpreadsheetApp.openById('LOG-SPREADSHEET-ID');
  var ops_log_sheet = log.getSheets()[0];
  var arch_log_sheet = log.getSheets()[2];
  var log_thrdIDs = ColumnValues(ops_log_sheet,"E",1).concat(ColumnValues(arch_log_sheet,"E",1));


  var threads = GmailApp.search('in:all to:operations@OldMailServer.com');
  Logger.log(threads.length);

  for (i = 0; i < threads.length; i++) {
    if ( log_thrdIDs.indexOf(threads[i].getId()) !== -1 ) {
      Logger.log(threads[i].getId());
    }
  }

  Logger.log('*****END****');

}
