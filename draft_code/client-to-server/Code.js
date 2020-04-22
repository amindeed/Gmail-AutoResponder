function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}

function getUnreadEmails() {
  return GmailApp.getInboxUnreadCount();
}

function getEmail() {
  return Session.getActiveUser().getEmail();
}

// Form 1
function processForm(formObject) {
  var formBlob = formObject.myFile;
  var formText = formObject.myText;
  //👍 var formSheet = formObject.sheetId;
  
  //👍 var mySpreadsheet = SpreadsheetApp.openById(formSheet);
  //👍 var sheet = mySpreadsheet.getSheets()[0];
  
  var driveFile = DriveApp.createFile(formBlob);
  //👍 sheet.appendRow([formText]);
  
  return [driveFile.getUrl(),formBlob.getBytes().length,formBlob.getContentType()];
}

// Form 2
function uploadFileToDrive(base64Data, fileName) {
  var splitBase = base64Data.split(',');
  var contentType = splitBase[0].split(';')[0].replace('data:', '');
  var bytes = Utilities.base64Decode(splitBase[1]);
  var blob = Utilities.newBlob(bytes, contentType, fileName);
  
  /* Alternate way to create the blob object (not yet tested)
  var contentType = base64Data.substring(5, base64Data.indexOf(';'));
  var bytes = Utilities.base64Decode(base64Data.substr(base64Data.indexOf('base64,') + 7));
  var blob = Utilities.newBlob(bytes, contentType, fileName);
  */
  
  var driveFile = DriveApp.createFile(blob);
  return driveFile.getUrl();
}
