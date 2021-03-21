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
  var logLabelsuffix = '';
  
  var timeinterval = appSettings['timeinterval']; // Must be 1, 5, 10, 15 or 30. (https://j.mp/3tHq6KC)
  var date = new Date();
  var timeFrom = Math.floor(date.valueOf()/1000 - 60 * (timeinterval+2));
  var searchQuery = 'is:inbox after:' + timeFrom;
  var hour = date.getHours();
  var threads = [];
  var execCondition = false;

  /** Check if it's a test instance **/
  if (isValidEmail(appSettings['testEmail'])) {
    execCondition = true;
    logLabelsuffix = '__TEST';
  } else {
    execCondition = (isAppEnabled === 'true') && ((hour < (finishhour + utcoffset)) || (hour >= (starthour + utcoffset)));
  }

  if (execCondition) {

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

    for (var i = 0; i < threads.length; i++) {
      var lastMsg = getLastMessage(threads[i]);
      var filterResult = filterMessage(lastMsg, filters);
      var isFilteredOut = filterResult['filterOut'];
      var msgId = lastMsg.getId();
      var isAlreadyProcessed = cache.get(msgId);

      if ( !isAlreadyProcessed ) {
        if ( !isFilteredOut ) {

          // Message should be responded to
          autoReply(threads[i]);

          processedMsgsLog.push(
            [
              'REP_SENT' + logLabelsuffix,
              lastMsg.getDate().toLocaleString(),
              new Date().toLocaleString(),
              msgId,
              threads[i].getId(),
              lastMsg.getFrom(),
              lastMsg.getSubject(),
              ''
            ]
          );
          
          cache.put(msgId, msgId, (timeinterval+6)*60);

        } else {

          // Message should be skipped

          processedMsgsLog.push(
            [
              'SKIPPED' + logLabelsuffix,
              lastMsg.getDate().toLocaleString(),
              '',
              msgId,
              threads[i].getId(),
              lastMsg.getFrom(),
              lastMsg.getSubject(),
              filterResult['appliedFilter']
            ]
          );

          cache.put(msgId, msgId, (timeinterval+6)*60);
        }
      }
    }
    loggerInstance.append(processedMsgsLog,'PROCESSED');
  }
}
