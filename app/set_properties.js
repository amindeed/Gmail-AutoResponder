function set_properties(FiltersSSId, LogSSId) {
  
  var userProperties = PropertiesService.getUserProperties();
  
  userProperties.setProperty('FILTERS_SS_ID', FiltersSSId);
  userProperties.setProperty('LOG_SS_ID', LogSSId);
  
  /** Other properties **/
  
  // Start hour
  // Finish hour
  // Interval
  // DST offset
  // Cc email address (optional)
  // noReply (boolean, only when applicable)
  
  /** Delete all user properties **/
  
  // ...
  
}