/**
 * Name 		:	Gmail AutoResponder
 * Version 		:	0.1
 * Descriton 	:	Automatic processing of incoming GMail messages
 * Author 		:	Amine Al Kaderi <alkaderi@amindeed.com>
 * License 		:	GNU GPLv3 license
 */

function autoReply() {
  
  // Script user properties as App's settings
  var userProperties = PropertiesService.getUserProperties();
  var isAppEnabled = userProperties.getProperty('enableApp');
  var starthour = userProperties.getProperty('starthour');
  var finishhour = userProperties.getProperty('finishhour');
  var utcoffset = userProperties.getProperty('utcoffset');
  
  var INTERVAL = 10;
  var date = new Date();
  var timeFrom = Math.floor(date.valueOf()/1000) - 60 * (INTERVAL+2);
  var searchQuery = 'is:inbox after:' + timeFrom;
  var hour = date.getHours();
  var threads = [];

  if ((isAppEnabled === 'true') && ((hour < (finishhour + utcoffset)) || (hour >= (starthour + utcoffset)))) {

    threads = GmailApp.search(searchQuery);
    logExecutionSession();

    // Get cached IDs of messages processed in the previous session
    var cache = CacheService.getScriptCache();

    for (i = 0; i < threads.length; i++) {

      var messages = threads[i].getMessages();
      var lastMsg = messages.length -1;
      var isFilteredOut = filterMessage(lastMsg, filters); // Should the message be skipped?
      var isAlreadyProcessed = cache.get(msgId); // Was the messages processed in the previous session?

      if ( isAlreadyProcessed === null ) {
        if ( !isFilteredOut ) {

          // Message should be responded to
          replyToThread(threads[i]);
          logProcessedMessage(lastMsg, false);
          cache.put(msgId, '', 960);

        } else {

          // Message should be skipped
          logProcessedMessage(lastMsg, true);
          cache.put(msgId, '', 960);
        
        }
      }
    }
  }
}
