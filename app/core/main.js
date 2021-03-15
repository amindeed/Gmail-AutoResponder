/**
 * Name 		  :	Gmail AutoResponder
 * Version 		:	0.1
 * Descriton 	:	Automatic processing of incoming GMail messages
 * Author 		:	Amine Al Kaderi <alkaderi@amindeed.com>
 * License 		:	MIT license
 */

function main() {
  
  var userProperties = PropertiesService.getUserProperties();
  var appSettings = userProperties.getProperties();

  var isAppEnabled = appSettings['enableApp'];
  var starthour = appSettings['starthour'];
  var finishhour = appSettings['finishhour'];
  var utcoffset = appSettings['utcoffset'];
  
  var INTERVAL = 10; // Probably better as a script property
  var date = new Date();
  var timeFrom = Math.floor(date.valueOf()/1000) - 60 * (INTERVAL+2);
  var searchQuery = 'is:inbox after:' + timeFrom;
  var hour = date.getHours();
  var threads = [];

  // if (true) {   // for testing
  if ((isAppEnabled === 'true') && ((hour < (finishhour + utcoffset)) || (hour >= (starthour + utcoffset)))) {

    threads = GmailApp.search(searchQuery);
    
    // Log session execution
    var logger = JSON.parse(appSettings['logger']);
    createLoggerClass();
    var loggerInstance = new AppLogger(logger);

    loggerInstance.append(
                    [
                      searchQuery,
                      new Date().toLocaleString(),
                      threads.length
                    ],
                    'EXECUTIONS'
                  );

    // Get cached IDs of messages processed in the previous session
    var cache = CacheService.getScriptCache();
    
    var filters = appSettings['filters'];
    var processedMsgsLog = [];

    for (i = 0; i < threads.length; i++) {

      var lastMsg = getLastMessage(gmailThread);
      var filterResult = filterMessage(lastMsg, filters);
      var isFilteredOut = filterResult['filterOut'];
      var msgId = lastMsg.getId();
      var isAlreadyProcessed = cache.get(msgId);

      if ( isAlreadyProcessed === null ) {
        if ( !isFilteredOut ) {

          // Message should be responded to
          replyToThread(threads[i]);

          processedMsgsLog.push(
            [
              'REP SENT',
              lastMsg.getDate(),
              new Date().toLocaleString(),
              msgId,
              lastMsg.getThread().getId(),
              lastMsg.getFrom(),
              lastMsg.getSubject(),
              ''
            ]
          );

          cache.put(msgId, '', 960);

        } else {

          // Message should be skipped

          processedMsgsLog.push(
            [
              'SKIPPED',
              lastMsg.getDate(),
              '',
              msgId,
              lastMsg.getThread().getId(),
              lastMsg.getFrom(),
              lastMsg.getSubject(),
              filterResult['appliedFilter']
            ]
          );

          cache.put(msgId, '', 960);
        }
      }
    }

    loggerInstance.append(processedMsgsLog,'PROCESSED');
  }
}
