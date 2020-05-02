function myFunction() {

  /***** Upload file using Advanced Drive Service
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
  *****/
  
  // var scriptID = ScriptApp.getScriptId();
  // var file = DriveApp.getFileById(scriptID);
  
  
  var userProperties = PropertiesService.getUserProperties();
  //Logger.log(""?"is not null":"is null");
  
  /*
  var msg = '<p><strong>Automated response</strong></p><p>Thank you for \
             contacting us.<br />This automated response is only to \
             confirm that your e-mail has been well received.<br />We \
             will reply to you shortly.</p><p>Best regards.</p>';
  
  userProperties.setProperty('MESSAGE_BODY', msg);
  */
  
  /*
  if (userProperties.getProperty('MESSAGE_BODY') == null){
    Logger.log("MESSAGE_BODY is null");
  } else { Logger.log("MESSAGE_BODY is not null"); }
  */
  
  /*** Daylight Saving Time offset ***/
  //var dstOffset = userProperties.getProperty('DST_OFFSET')?userProperties.getProperty('DST_OFFSET'):0;
  //var dstOffset = userProperties.getProperty('DST_OFFSET');
  

  
   
  
  
  //var mySettings = {};
  //var mySettings['myCcAddress'] = {};
  
  
  
  /**** Testing objects
  
  var obj = {
    key1: "value1",
    key2: "value2"
  };
  
  Logger.log(obj["key4"]);
  Logger.log(obj.key1);
  
  obj["key3"] = "value3"
  
  Logger.log(obj["key3"]);
  
  var obj2 = {};
  obj2["keyA"] = "ValueAAAA";
  Logger.log(obj2.keyA);
  
  ****/
  
  //Logger.log(getSettings());
  
  //var userProperties = PropertiesService.getUserProperties();
  //userProperties.deleteAllProperties();
  
  /*
  var myObjA = {'keyA1': 'valueA1'};
  var myObjB = {'keyB1': 'valueB1', 'keyB2': 'valueB2'};
 
  myObjA['keyA2'] = myObjB['keyB3'];
  */
  
  /*
  Logger.log(userProperties.getProperty('ISENABLED_NOREPLY'));
  userProperties.setProperty('ISENABLED_NOREPLY', (Session.getActiveUser().getEmail().split('@')[1]!=='gmail.com')?true:false);
  Logger.log(userProperties.getProperty('ISENABLED_NOREPLY'));
  */
  
  /*
  GmailApp.sendEmail('invalid_email_address', 'Apps Script : Test message', 'This is a test messages from APps Script', {
    cc: null,
	bcc: null,
	noReply: true
  });
  */
  
  //userProperties.setProperty('testKey', "");
  Logger.log(userProperties.getProperty('testKey')?"is not false/null/undefined":"is either false/null/undefined");
  
  
}
