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
  
  /*
  var inputStr = 'apps-scripts-notifications@sdsd.google.com';
  var regex1 = new RegExp('.+@.*google.com','i'); // Doesn't work
  var regex2 = new RegExp('.+@.*google.com','i'); // Works
  var regex3 = new RegExp('.+@.*\\bgoogle\\.com','i'); // Works
  */
  
  /*
  Logger.log(inputStr.match(regex1));
  Logger.log(inputStr.match(regex2));
  Logger.log(inputStr.match(regex3));
  */
  
  
}
