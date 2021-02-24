function myFunction() {
  var userProperties = PropertiesService.getUserProperties();

  userProperties.setProperty('ENABLE_GMAUTOREP', false);
  userProperties.setProperty('NOREPLY', 2);
  userProperties.setProperty('STAR_PROCESSED_MESSAGE', true);
}
