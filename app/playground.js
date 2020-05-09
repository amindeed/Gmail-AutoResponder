function myFunction() {

  //var userProperties = PropertiesService.getUserProperties();
  
  function firstFunction(_callback){
    for (i = 0; i < 3; i++) {
      Logger.log('firstFunction(), iteration #' + i);
      Utilities.sleep(2 * 1000)
    }
    _callback();    
  }

  function secondFunction(){
    firstFunction(function() {
      Logger.log('[secondFunction] I\'m done!');
    });    
  }
  
  firstFunction(() => Logger.log("[firstFunction] I\'m done!"));
  Logger.log('************************');
  secondFunction();
  
}
