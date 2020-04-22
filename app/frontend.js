function doGet() {
  return HtmlService.createHtmlOutputFromFile('frontend_index');
}

function getUserPhoto(){
  var driveRoot = DriveApp.getRootFolder();
  var driveUser = driveRoot.getOwner();
  var userPhotoURL = driveUser.getPhotoUrl();
  return userPhotoURL;
}

function getScriptUserEmail(){
  return Session.getEffectiveUser().getEmail();
}

function getSettings(){
  
  // Get User Photo
  var driveRoot = DriveApp.getRootFolder();
  var driveUser = driveRoot.getOwner();
  var userPhotoURL = driveUser.getPhotoUrl();
  //var defaultPhoto = "URL of a default photo";
  
  // Get User Email
  var userEmail = Session.getEffectiveUser().getEmail(); 
  
  // Get Properties
  var userProperties = PropertiesService.getUserProperties();
  var filtersSSId = userProperties.getProperty('FILTERS_SS_ID');
  var logsSSId = userProperties.getProperty('LOG_SS_ID');
  var startHour = userProperties.getProperty('START_HOUR');
  var finishHour = userProperties.getProperty('FINISH_HOUR');
  var timeInterval = userProperties.getProperty('TIME_INTERVAL');
  var dstOffset = userProperties.getProperty('DST_OFFSET');
  
  var settings = [userPhotoURL,
                  userEmail,
                  filtersSSId,
                  logsSSId,
                  startHour,
                  finishHour,
                  timeInterval,
                  dstOffset
                 ];
   
  return settings;
}


function setSettings(newSettings){
  
  // Set Properties
  set_properties(newSettings.filtersssid, 
                 newSettings.logsssid, 
                 newSettings.starthour, 
                 newSettings.finishhour, 
                 newSettings.timeinterval, 
                 newSettings.dstoffset);
  
  // Get Updated Properties
  var userProperties = PropertiesService.getUserProperties();
  var filtersSSId = userProperties.getProperty('FILTERS_SS_ID');
  var logsSSId = userProperties.getProperty('LOG_SS_ID');
  var startHour = userProperties.getProperty('START_HOUR');
  var finishHour = userProperties.getProperty('FINISH_HOUR');
  var timeInterval = userProperties.getProperty('TIME_INTERVAL');
  var dstOffset = userProperties.getProperty('DST_OFFSET');
  
  var updatedSettings = [filtersSSId,
                         logsSSId,
                         startHour,
                         finishHour,
                         timeInterval,
                         dstOffset
                        ];
   
  return updatedSettings;
}
