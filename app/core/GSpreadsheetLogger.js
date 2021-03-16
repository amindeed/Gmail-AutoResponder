/**
 * Name 		  :	Gmail AutoResponder
 * Version 		:	0.1
 * Descriton 	:	Automatic processing of incoming GMail messages
 * Author 		:	Amine Al Kaderi <alkaderi@amindeed.com>
 * License 		:	MIT license
 */

class GSpreadsheetLogger extends BaseLogger {

  /** Check whether a Spreadsheet with the gived ID exists **/
  static checkSpreadsheetById(id) {
    var ss = null
    try {
      ss = SpreadsheetApp.openById(id)
    } catch (e) {
      return ss
    }
    return ss
  }
  
  /** Initialize a sheet within a Google Spreadsheet **/
  static initSheet(spreadSheetId=null, sheetNdx=0, header=[''], sheetName=null) {

    var loggerSs = null;
    var sheet = null;
    sheetNdx = sheetNdx?sheetNdx:0;
    header = header?header:[''];
    
    var result = {
      'spreadsheetId': spreadSheetId,
      'initSheetNdx': null,
      'sheetName': sheetName
    }

    function addHeader(sheet,header) {
      sheet.appendRow(header);
      var sheetHeader = sheet.getRange(1, 1, 1, header.length);
      sheetHeader.setFontWeight("bold");
      sheetHeader.setBackground("#cfe2f3");
      sheet.setFrozenRows(1);
    }

    // If the provided ID is invalid, a new speardsheet
    // will be created, and its ID will be returned

    /* if ( !this.checkSpreadsheetById(spreadSheetId) ) {
      if (autoCreateSs) {

        loggerSs = SpreadsheetApp.create('LOGGER_' + getTimestamp());
        Logger.log('****** loggerSs : ' + loggerSs); //DEBUG
        result['spreadsheetId'] = loggerSs.getId();

        Logger.log('****** sheetNdx : ' + sheetNdx); //DEBUG
        sheet = loggerSs.insertSheet(sheetNdx);
        addHeader(sheet,header);

        if (sheetName) {
          loggerSs.setActiveSheet(sheet);
          loggerSs.renameActiveSheet(sheetName);
        }

        result['initSheetNdx'] = sheet.getIndex();

      } else {
        result['spreadsheetId'] = null;
        return result
      }
    } else { */

      var loggerSs = SpreadsheetApp.openById(spreadSheetId);
      var existingSheet = null;

      if (sheetNdx <= loggerSs.getNumSheets() -1) {
        if (sheetName) {
          if (existingSheet = loggerSs.getSheetByName(sheetName)) {
            // Archive existing Sheet. Create new at index 'sheetNdx' and name it 'sheetName'
            existingSheet.setName(sheetName + '_' + getTimestamp());
            sheet = loggerSs.insertSheet(sheetName, sheetNdx);
          } else {
            // Create new sheet at index 'sheetNdx' and name it 'sheetName'
            sheet = loggerSs.insertSheet(sheetName, sheetNdx);
          }
        } else {
          // Create new sheet at index 'sheetNdx'
          sheet = loggerSs.insertSheet(sheetNdx);
        }
        addHeader(sheet,header);
        result['initSheetNdx'] = sheet.getIndex();

      } else if ( sheetNdx > loggerSs.getNumSheets() -1 ) {
        if (sheetName) {
          if (existingSheet = loggerSs.getSheetByName(sheetName)) {
            // Archive existing Sheet. Create new sheet named 'sheetName'
            // at the same index as the old sheet
            var newSheetNdx = existingSheet.getIndex() - 1;
            existingSheet.setName(sheetName + '_' + getTimestamp());
            sheet = loggerSs.insertSheet(sheetName, newSheetNdx);
          } else {
            // Insert new sheet named 'sheetName'
            sheet = loggerSs.insertSheet(sheetName, loggerSs.getNumSheets());
          }
        } else {
          // Insert new sheet
          sheet = loggerSs.insertSheet(loggerSs.getNumSheets());
        }
        addHeader(sheet,header);
        result['initSheetNdx'] = sheet.getIndex();
      }
    /* } */
    return result
  }

  /** Logger identifiers validator **/
  isIdValid() {
    return this.constructor.checkSpreadsheetById(this.identifiers.id)
  }

  /** Append an array of log entries to the target sheet **/
  append(logEntries, target) {

    var result = false;
    var spreadsheet = null;
    var targets = super.constructor.getDataCollections().filter( function(item){return (item.name==target)} );

    if (targets.length && super.constructor.isDatasetConsistent(logEntries)) {

      var logEntriesTarget = targets[0];
      if ( !this.isIdValid() ) { this.initLogger(true) }
      spreadsheet = SpreadsheetApp.openById(this.identifiers.id);
      var sheet = spreadsheet.getSheetByName(target) || spreadsheet.getSheets()[logEntriesTarget.index];

      if (!sheet) {
        var initLogSheet = this.constructor.initSheet(
                                              this.identifiers.id, 
                                              logEntriesTarget.index, 
                                              logEntriesTarget.dataFields, 
                                              logEntriesTarget.name
                                            );

        sheet = spreadsheet.getSheets()[initLogSheet['initSheetNdx'] - 1];
      }

      if ( logEntries[0] instanceof Array ) {

        sheet
        .getRange(
          sheet.getLastRow() + 1,
          1,
          logEntries.length,
          logEntries[0].length
        )
        .setValues(logEntries);
        result = true;

      } else if ( logEntries[0] !== Object(logEntries[0]) ) {
        sheet.appendRow(logEntries);
        result = true;
      } 
    }
    return result
  };

  /** Initialize GSpreadsheetLogger instance  **/
  initLogger(forceCreateSs=false) {

    if ( forceCreateSs || !this.isIdValid() ) {
      var loggerSs = SpreadsheetApp.create('LOGGER_' + getTimestamp());
      this.identifiers = {'id': '', 'viewUri': '', 'updateUri': ''};
      this.identifiers.id = loggerSs.getId();
    }

    var ssUrl = SpreadsheetApp.openById(this.identifiers.id).getUrl();
    this.identifiers.viewUri = this.identifiers.updateUri = ssUrl;

    var collections = super.constructor.getDataCollections();

    for (var i = 0; i < collections.length; i++) {
      this.constructor.initSheet(
                          this.identifiers.id, 
                          collections[i].index, 
                          collections[i].dataFields, 
                          collections[i].name
                        );
    }

    return this.identifiers
  }
}