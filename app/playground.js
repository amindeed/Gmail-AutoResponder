function myFunction() {

  var userProperties = PropertiesService.getUserProperties();
  //userProperties.deleteAllProperties();
  //userProperties.setProperty('ENABLE_GMAUTOREP','YES');
  Logger.log(userProperties.getProperty('ENABLE_GMAUTOREP'));
  
  //Logger.log(DriveApp.getRootFolder().getOwner().getDomain());
  
  /*
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
  */
  
  
  /*
  function resolveAfter2Seconds() {
    return new Promise(resolve => {
       setTimeout(() => {
          resolve('resolved');
       }, 2000);
    });
  }
      
  async function asyncCall() {
     Logger.log('calling');
     const result = await resolveAfter2Seconds();
     Logger.log(result);
     // expected output: 'resolved'
  }
      
  asyncCall();
  */
  
}
