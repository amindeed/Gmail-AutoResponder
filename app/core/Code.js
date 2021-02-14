/**
 * Name 		:	Gmail AutoResponder
 * Version 		:	0.1
 * Descriton 	:	Automatic processing of incoming GMail messages
 * Author 		:	Amine Al Kaderi <alkaderi@amindeed.com>
 * License 		:	GNU GPLv3 license
 */

function autoReply() {
  
  var userProperties = PropertiesService.getUserProperties();
  var INTERVAL = 10;    // To execute the script after each 10 min.
  var START_HOUR = userProperties.getProperty('START_HOUR')?parseInt(userProperties.getProperty('START_HOUR'), 10):17;
  var FINISH_HOUR = userProperties.getProperty('FINISH_HOUR')?parseInt(userProperties.getProperty('FINISH_HOUR'), 10):8;
  var DST_OFFSET = userProperties.getProperty('DST_OFFSET')?parseInt(userProperties.getProperty('DST_OFFSET'), 10):0; // DST offset. Optional, to adjust time in case of.
  var date = new Date();
  var timeFrom = Math.floor(date.valueOf()/1000) - 60 * (INTERVAL+2);
  var GM_SEARCH_QUERY = 'is:inbox after:' + timeFrom;
  var hour = date.getHours();    // Returns current hour only. ex. 12:33 --> 12
  var FiltersSSId = userProperties.getProperty('FILTERS_SS_ID');
  var LogSSId = userProperties.getProperty('LOGS_SS_ID');
  var threads = [];
  var repNoReply = userProperties.getProperty('NOREPLY');
  var isAppEnabled = userProperties.getProperty('ENABLE_GMAUTOREP');

  // Configs #1
  var config = SpreadsheetApp.openById(FiltersSSId);
  var config_sheet = config.getSheets()[0];

  // Logs #1
  var log = SpreadsheetApp.openById(LogSSId);
  var ops_log_sheet = log.getSheets()[0];
  var exec_log_sheet = log.getSheets()[1];


  //if (((hour < (FINISH_HOUR + DST_OFFSET)) || (hour >= (START_HOUR + DST_OFFSET))) && ((threads = GmailApp.search(GM_SEARCH_QUERY)).length !== 0)) {
  if ((isAppEnabled === 'YES') && ((hour < (FINISH_HOUR + DST_OFFSET)) || (hour >= (START_HOUR + DST_OFFSET)))) {

  // log execution time and number of messages retrieved
  threads = GmailApp.search(GM_SEARCH_QUERY);
  exec_log_sheet.appendRow([GM_SEARCH_QUERY, new Date().toLocaleString(), threads.length]);

  // Logs #2
  /** Get cached IDs of messages processed in the previous session **/
  var cache = CacheService.getScriptCache();

  // Configs #2
  var From_blacklist = columnValues(config_sheet,"B",1);
  var To_blacklist = columnValues(config_sheet,"C",1);
  var RawMsg_blacklist = columnValues(config_sheet,"A",1);

  // Message body
  var body = userProperties.getProperty('MESSAGE_BODY');

  // TODO: better create a 2D array (or a JSON object) of processed messages

    for (i = 0; i < threads.length; i++) {

        var messages = threads[i].getMessages();
        var lastMsg = messages.length -1;
        var msgFrom = messages[lastMsg].getFrom();
        var msgTo = messages[lastMsg].getTo();
        var msgId = messages[lastMsg].getId();
        var isProcessed = cache.get(msgId);

      if( isProcessed === null
        && !containsString(msgTo,To_blacklist)
        && !matchesRegex(msgFrom,From_blacklist)
        && !containsString(messages[lastMsg].getRawContent(),RawMsg_blacklist) ) {

                var msgDate = messages[lastMsg].getDate(), msgSubject = messages[lastMsg].getSubject();
				var msgCc = messages[lastMsg].getCc();
				var msgBody = messages[lastMsg].getBody();

				threads[i].reply("", {
				  htmlBody: body
                  + '<span style=\"color: #333399;\">'
                  + '-----------------------------------------------------'
                  + '<br/><b>From : </b>' + msgFrom
                  + '<br/><b>Date : </b>' + msgDate
                  + '<br/><b>Subject : </b>' + msgSubject
                  + '<br/><b>To : </b>' + msgTo
                  + '<br/><b>Cc : </b>' + msgCc
                  + '</span>'
                  + '<br/><br/>' + msgBody + '<br/>',
                  cc: userProperties.getProperty('CC_ADDRESS'),
                  bcc: userProperties.getProperty('BCC_ADDRESS'),
                  noReply: (repNoReply === 'YES')?true:((repNoReply === 'NO')?false:null)
				});
                
                if ( userProperties.getProperty('STAR_PROCESSED_MESSAGE') !== 'NO' ) {
                  messages[lastMsg].star();
                }

                // Log message that has been responded to
                // Note that the ID of a Gmail thread is the ID of its first message
                ops_log_sheet.appendRow(['REP SENT', msgDate, new Date().toLocaleString(), msgId, threads[i].getId(), msgFrom, msgSubject]);
                
                /* Set custom background color  */
                //var last_OpsLog_row = ops_log_sheet.getRange(ops_log_sheet.getLastRow(),1,1,ops_log_sheet.getLastColumn());
                //last_OpsLog_row.setBackgroundRGB(252,229,205);
          
                cache.put(msgId, '', 960); // Cache ID of processed message

        } else if ( isProcessed === null ) {

          // Star skipped message
          if ( userProperties.getProperty('STAR_PROCESSED_MESSAGE') !== 'NO' ) {
                  messages[lastMsg].star();
          }

          // Log skipped message
          var msgDate = messages[lastMsg].getDate(), msgSubject = messages[lastMsg].getSubject();
          ops_log_sheet.appendRow(['SKIPPED', msgDate, 'N/A', msgId, threads[i].getId(), msgFrom, msgSubject]);
          cache.put(msgId, '', 960); // Cache ID of processed (skipped) message
        }
    }

    // TODO: append the 2D array (or the JSON object) of processed messages to the log

  } else if ( (hour === FINISH_HOUR + DST_OFFSET) && (date.getMinutes() <= (1.5*INTERVAL)) ) {

    // Mark session end on both 'Logs' sheets

    var last_OpsLog_row = ops_log_sheet.getRange(ops_log_sheet.getLastRow(),1,1,ops_log_sheet.getLastColumn());
    last_OpsLog_row.setBorder(null, null, true, null, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

    var last_ExecLog_row = exec_log_sheet.getRange(exec_log_sheet.getLastRow(),1,1,exec_log_sheet.getLastColumn());
    last_ExecLog_row.setBorder(null, null, true, null, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  }
}