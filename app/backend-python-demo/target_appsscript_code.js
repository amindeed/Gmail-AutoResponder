function useGoogleServices(spreadsheetName, emailRecipients, emailSubject) {
  
    var errors = [];
    var returnObject = {
      'data': {},
      'errors': []
    };
  
    function getDatetimestamp(){
      function pad2(n) { return n < 10 ? '0' + n : n }
      var date = new Date();
      var timestamp = date.getFullYear().toString() 
                      + pad2(date.getMonth() + 1) 
                      + pad2(date.getDate()) 
                      + pad2(date.getHours()) 
                      + pad2(date.getMinutes()) 
                      + pad2(date.getSeconds());
      return timestamp
    }
  
    function random(min, max) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      return num;
    }
  
    // This block intentionally raises an error
    try {
      
      DriveApp.getFolderById('A00000000000000009').addFile('B1111111111111118');
  
    } catch(e) {
      errors.push(e.message)
    }
  
    // Create a new spreadsheet and write content to it
    try {
      
      var mySpreadsheet = SpreadsheetApp.create(getDatetimestamp() + "_" + spreadsheetName);
      var mySpreadsheetId = mySpreadsheet.getId();
      var mySpreadsheetURL = mySpreadsheet.getUrl();
      var openMySpreadsheet = SpreadsheetApp.openById(mySpreadsheetId);
      var firstSheet = openMySpreadsheet.getSheets()[0];
      firstSheet.appendRow([getDatetimestamp(), random(5000, 9999), random(5000, 9999)]);
  
      returnObject['data']['spreadSheetId'] = mySpreadsheetId;
      returnObject['data']['spreadSheetURL'] = mySpreadsheetURL;
  
    } catch(e) {
      errors.push(e.message)
    }
  
    // List Drive's root content
    try {
  
      var root = DriveApp.getRootFolder();
      var folders = root.getFolders();
      var folderSet = {};
      while (folders.hasNext()) {
        var folder = folders.next();
        folderSet[folder.getId()] = folder.getName();
      }
      
      returnObject['data']['folderSet'] = folderSet;
  
    } catch(e) {
      errors.push(e.message)
    }
  
    // Send an email
    try {
  
      var userEmail = Session.getActiveUser().getEmail();
  
      GmailApp.sendEmail(emailRecipients, getDatetimestamp() + emailSubject, "", {
        htmlBody: "<h3>Test Message</h3>" + "<p>" + 
                  "This message was sent by an Apps Script project run by: " + userEmail +
                  "<br/><strong>- Spreadsheet ID:  </strong>" + mySpreadsheetId +
                  "<br/><strong>- Spreadsheet URL:  </strong>" + mySpreadsheetURL +
                  "<br/><br/>Here is the list of Drive's root folders:<br/><br/>" + JSON.stringify(folderSet) + 
                  "</p>"
        });
  
      returnObject['data']['userEmail'] = userEmail;
  
    } catch(e) {
      errors.push(e.message)
    }
  
    returnObject['errors'] = errors;
    
    return returnObject
  }