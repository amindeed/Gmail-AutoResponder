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
  
  /*** Daylight Saving Time offset ***/
  //var dstOffset = userProperties.getProperty('DST_OFFSET')?userProperties.getProperty('DST_OFFSET'):0;
  //var dstOffset = userProperties.getProperty('DST_OFFSET');
  
  //set_properties('11111111', '22222222', '333333333', '4444444444', '555555555', '66666666666');
  //Logger.log(userProperties.getProperties());
  
  /** Function object property as base64 images **/
  function images(){
  images.defaultUserPhotoUrl = "";
  }
  
  
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
  
   Logger.log(objGetSettings());
  
}
