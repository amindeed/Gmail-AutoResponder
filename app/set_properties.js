function set_properties(ConfigSSId, LogSSId) {
  
  var userProperties = PropertiesService.getUserProperties();
  
  userProperties.setProperty('CONFIG_SS_ID', ConfigSSId);
  userProperties.setProperty('LOG_SS_ID', LogSSId);
  
  /** Other properties **/
  
  // Start hour
  // Finish hour
  // Interval
  // DST offset
  // Cc email address (optional)
  // noReply (boolean, only when applicable)
  
}