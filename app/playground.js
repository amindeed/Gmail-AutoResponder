function myFunction() {

  //var userProperties = PropertiesService.getUserProperties();
  
  /*
  userProperties.setProperty(
      'DEFAULT_MESSAGE_BODY',
      '<p><strong>Automated response</strong></p>\
       <p>This automated response is only to \
       confirm that your e-mail has been well received.\
       Thank you.</p>\
       <p>Best regards.</p>'
    );
    */
  
  //userProperties.deleteAllProperties();
  //userProperties.setProperty('ENABLE_GMAUTOREP','YES');
  //Logger.log(userProperties.getProperty('ENABLE_GMAUTOREP'));
  
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
  
  //appinit({"resetApp": true});
  
  var myObj = {'myArray': []};
  myObj['myArray'].push('Appended item');
  Logger.log(Math.floor(Math.random() * Math.floor(999999)).toString());
  
}
