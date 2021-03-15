function myFunction44() {

  var userProperties = PropertiesService.getUserProperties();
  //userProperties.setProperty('logger', JSON.stringify({'id': '1eTzBVvXvvB9bA2q7xdl0OnCcXc2J_hPwQkQX8fYC2fM'}));
  //userProperties.deleteAllProperties();
  var appSettings = userProperties.getProperties();

  var logger = JSON.parse(appSettings['logger'])
  createLoggerClass();
  var loggerInstance = new AppLogger(logger);

  Logger.log(typeof(loggerInstance));

  loggerInstance.append(
                  [
                    'from:ATOS',
                    new Date().toLocaleString(),
                    67,
                    'sdfksdfksdhg'
                  ],
                  'PROCESSED'
                ); 


  Logger.log(appSettings);


  
}
