function myFunction() {
  var userProperties = PropertiesService.getUserProperties();

  //userProperties.setProperty('ENABLE_GMAUTOREP', false);
  //userProperties.setProperty('NOREPLY', 2);
  //userProperties.setProperty('STAR_PROCESSED_MESSAGE', true);

  //userProperties.setProperty('testScriptUserPty', 333)
  //userProperties.setProperty('testScriptUserPty2', 444)
  
  //Logger.log(userProperties.getProperty('testScriptUserPty'))
  //Logger.log(userProperties.getProperty('testScriptUserPty2'))
  
  //userProperties.deleteProperty('testScriptUserPty');
  //userProperties.deleteProperty('testScriptUserPty2');


  appSettings = userProperties.getProperties()

  for (var key in appSettings) {
    Logger.log('%s   ===    %s\n', key,appSettings[key]);
  }

  //userProperties.setProperty('ccemailadr','')
  //userProperties.setProperty('msgbody','')
  //userProperties.setProperty('bccemailadr','')

  //Logger.log(userProperties.getProperty('ccemailadr'))
  //Logger.log(userProperties.getProperty('msgbody'))
  //Logger.log(userProperties.getProperty('bccemailadr'))
  userProperties.deleteProperty('NOREPLY')
  userProperties.setProperty('noreply', '')

}
