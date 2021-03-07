function myFunction() {
  var userProperties = PropertiesService.getUserProperties();

/*   appSettings = userProperties.getProperties()

  for (var key in appSettings) {
    Logger.log('%s   ===    %s\n', key,appSettings[key]);
  } */


  threads = GmailApp.search('is:inbox');

  Logger.log(threads[0].getId());

  reply = threads[0].reply(44);

  Logger.log(reply.getId());

}
