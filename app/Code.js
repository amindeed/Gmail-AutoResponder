/* Conventions :
There are two types of processed messages:
1) Messages that have been responded to.
2) Skipped messages (matching an exclusion criteria).
*/

function autoReply() {
  
  var userProperties = PropertiesService.getUserProperties();
  var INTERVAL = userProperties.getProperty('TIME_INTERVAL')?userProperties.getProperty('TIME_INTERVAL'):10;    // To execute the script after each 10 min.
  var START_HOUR = userProperties.getProperty('START_HOUR')?userProperties.getProperty('START_HOUR'):17;    // Local time
  var FINISH_HOUR = userProperties.getProperty('FINISH_HOUR')?userProperties.getProperty('FINISH_HOUR'):8;    // Local time
  var DST_OFFSET = userProperties.getProperty('DST_OFFSET')?userProperties.getProperty('DST_OFFSET'):0; // DST offset
  var date = new Date();
  var timeFrom = Math.floor(date.valueOf()/1000) - 60 * (INTERVAL+2);
  var GM_SEARCH_QUERY = 'is:inbox after:' + timeFrom;
  var hour = date.getHours();    // Returns current hour only. ex. 12:33 --> 12
  var FiltersSSId = userProperties.getProperty('FILTERS_SS_ID');
  var LogSSId = userProperties.getProperty('LOGS_SS_ID');
  var threads = [];

  // Configs #1
  var config = SpreadsheetApp.openById(FiltersSSId);
  var config_sheet = config.getSheets()[0];

  // Logs #1
  var log = SpreadsheetApp.openById(LogSSId);
  var ops_log_sheet = log.getSheets()[0];
  var exec_log_sheet = log.getSheets()[1];


  //if (((hour < (FINISH_HOUR + DST_OFFSET)) || (hour >= (START_HOUR + DST_OFFSET))) && ((threads = GmailApp.search(GM_SEARCH_QUERY)).length !== 0)) {
  if ((hour < (FINISH_HOUR + DST_OFFSET)) || (hour >= (START_HOUR + DST_OFFSET))) {

  // log execution time and number of messages retrieved
  threads = GmailApp.search(GM_SEARCH_QUERY);
  exec_log_sheet.appendRow([GM_SEARCH_QUERY, new Date().toLocaleString(), threads.length]);

  // Logs #2
  /** Get cached IDs of messages processed in the previous session **/
  var cache = CacheService.getScriptCache();

  // Configs #2
  var From_blacklist = ColumnValues(config_sheet,"B",1);
  var To_blacklist = ColumnValues(config_sheet,"C",1);
  var RawMsg_blacklist = ColumnValues(config_sheet,"A",1);

  // Message body
  var body = HtmlService.createHtmlOutputFromFile('body.html').getContent();

  /***#####*** declare 2D array of processed messages ***#####***/

    for (i = 0; i < threads.length; i++) {

        var messages = threads[i].getMessages();
        var lastMsg = messages.length -1;
        var msgFrom = messages[lastMsg].getFrom();
        var msgTo = messages[lastMsg].getTo();
        var msgId = messages[lastMsg].getId();
        var isProcessed = cache.get(msgId);

      if( isProcessed === null
        && !ContainsString(msgTo,To_blacklist)
        && !MatchesRegex(msgFrom,From_blacklist)
        && !ContainsString(messages[lastMsg].getRawContent(),RawMsg_blacklist) ) {

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
                  + '<br/><br/>' + msgBody + '<br/>'
                  //, cc: "it-operations@mycompany.com", /* alias of 'amine@mycompany.com' */
                  //noReply: true /* Works only for G-Suite accounts */
				});
                // Correction: star messages that have been responded to
                messages[lastMsg].star();

                // Log message that has been responded to
                // Note that the ID of a Gmail thread is the ID of its first message
                ops_log_sheet.appendRow(['REP SENT', msgDate, new Date().toLocaleString(), msgId, threads[i].getId(), msgFrom, msgSubject]);
                var last_OpsLog_row = ops_log_sheet.getRange(ops_log_sheet.getLastRow(),1,1,ops_log_sheet.getLastColumn());
                last_OpsLog_row.setBackgroundRGB(252,229,205);
                cache.put(msgId, '', 960); // Cache ID of processed message

        } else if ( isProcessed === null ) {

          // Star skipped message
          messages[lastMsg].star();

          // Log skipped message
          var msgDate = messages[lastMsg].getDate(), msgSubject = messages[lastMsg].getSubject();
          ops_log_sheet.appendRow(['SKIPPED', msgDate, '', msgId, threads[i].getId(), msgFrom, msgSubject]);
          cache.put(msgId, '', 960); // Cache ID of processed (skipped) message
        }
    }

    /****** Save 2D array of processed message to log sheet *********/

  } else if ( (hour === FINISH_HOUR + DST_OFFSET) && (date.getMinutes() <= (1.5*INTERVAL)) ) {

    // Mark session end on both sheets

    var last_OpsLog_row = ops_log_sheet.getRange(ops_log_sheet.getLastRow(),1,1,ops_log_sheet.getLastColumn());
    last_OpsLog_row.setBorder(null, null, true, null, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

    var last_ExecLog_row = exec_log_sheet.getRange(exec_log_sheet.getLastRow(),1,1,exec_log_sheet.getLastColumn());
    last_ExecLog_row.setBorder(null, null, true, null, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);


  }
}
