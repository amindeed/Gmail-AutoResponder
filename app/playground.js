function myFunction() {

  var userProperties = PropertiesService.getUserProperties();
  //userProperties.setProperty('tadadada', 'dsfdsfsdfsdfsdfsd');
  

  
  Logger.log(userProperties.getProperty('IS_GSUITE_USER'));  
}
