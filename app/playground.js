function myFunction() {

  var userProperties = PropertiesService.getUserProperties();
  //userProperties.setProperty('tadadada', 'dsfdsfsdfsdfsdfsd');
  

  
  Logger.log(userProperties.getProperty('START_HOUR') + ', of type : ' + typeof(userProperties.getProperty('START_HOUR')));
  Logger.log(parseInt(userProperties.getProperty('START_HOUR'), 10) + ', of type : ' + typeof(parseInt(userProperties.getProperty('START_HOUR'), 10)));
}
