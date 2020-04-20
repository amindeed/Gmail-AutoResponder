function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}

function getUnreadEmails() {
  return GmailApp.getInboxUnreadCount();
}

function getEmail() {
  return Session.getActiveUser().getEmail();
}

function processForm(formObject) {
  var formBlob = formObject.myFile;
  var formText = formObject.myText;
  var formSheet = formObject.sheetId;
  
  var mySpreadsheet = SpreadsheetApp.openById(formSheet);
  var sheet = mySpreadsheet.getSheets()[0];
  
  var driveFile = DriveApp.createFile(formBlob);
  sheet.appendRow([formText]);
  
  return driveFile.getUrl();
}
