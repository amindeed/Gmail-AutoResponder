/* Conventions :
There are two types of processed messages:
1) Messages that have been responded to.
2) Skipped messages (matching an exclusion criteria).
*/

function autoReply() {

  var INTERVAL = 10;    // To execute the script after each 10 min.
  var START_HOUR = 20;    // Local time
  var FINISH_HOUR = 6;    // Local time
  var TIME_OFFSET = 0; // Changed from '-1' to '0' due to DST status change
  var date = new Date();
  var timeFrom = Math.floor(date.valueOf()/1000) - 60 * (INTERVAL+2);
  var GM_SEARCH_QUERY = 'is:inbox after:' + timeFrom;
  var hour = date.getHours();    // Returns current hour only. ex. 12:33 --> 12
  var ConfigSSId = 'CONFIG-SPREADSHEET-ID';
  var LogSSId = 'LOG-SPREADSHEET-ID';
  var threads = [];

  // Configs #1
  var config = SpreadsheetApp.openById(ConfigSSId);
  var config_sheet = config.getSheets()[0];

  // Logs #1
  var log = SpreadsheetApp.openById(LogSSId);
  var ops_log_sheet = log.getSheets()[0];
  var exec_log_sheet = log.getSheets()[1];


  function ContainsString(InputStr, checklist) {
    var Contains = false;
    var i = 0;
    while (!Contains && i < checklist.length) {
      if (InputStr.indexOf(checklist[i]) !== -1) {
        Contains = true;
      } else {i++;}
    }
    return Contains;
  }

  function MatchesRegex(InputStr, regexStr) {
    var Matches = false;
    var i = 0;
    while (!Matches && i < regexStr.length) {
      var regex = new RegExp(regexStr[i],'i');
      if (InputStr.match(regex)) {
        Matches = true;
      } else {i++;}
    }
    return Matches;
  }

  function ColumnValues(sheet, column, remove_header){
    // shift: {0, false, undefined, null, NaN, ""} <=> false
    var values = sheet.getRange(column + "1:" + column + sheet.getMaxRows()).getValues();
    (values = [].concat.apply([], values.filter(String))).splice(0,remove_header?1:0);
    return values
  }


  //if (((hour < (FINISH_HOUR + TIME_OFFSET)) || (hour >= (START_HOUR + TIME_OFFSET))) && ((threads = GmailApp.search(GM_SEARCH_QUERY)).length !== 0)) {
  if ((hour < (FINISH_HOUR + TIME_OFFSET)) || (hour >= (START_HOUR + TIME_OFFSET))) {

  // log execution time and number of messages retrieved
  threads = GmailApp.search(GM_SEARCH_QUERY);
  exec_log_sheet.appendRow([GM_SEARCH_QUERY, new Date().toLocaleString(), threads.length]);

  // Logs #2
  ///// var log_msgIDs = ColumnValues(ops_log_sheet,"D",1);
  /** Get cached IDs of messages processed in the previous session **/
  var cache = CacheService.getScriptCache();
  
  // Configs #2
  var From_regex_blacklist = ColumnValues(config_sheet,"D",1);
  var To_blacklist = ColumnValues(config_sheet,"G",1);
  var Headers_blacklist = ColumnValues(config_sheet,"A",1);

  // Message body
  var body = HtmlService.createHtmlOutputFromFile('body.html').getContent();

  /***#####*** declare 2D array of processed messages ***#####***/

    for (i = 0; i < threads.length; i++) {

        var messages = threads[i].getMessages();
        var lastMsg = messages.length -1;
        var msgFrom = messages[lastMsg].getFrom();
        var msgTo = messages[lastMsg].getTo();
        var msgId = messages[lastMsg].getId();
        //// var msgIdNdx = log_msgIDs.indexOf(msgId);
        var isProcessed = cache.get(msgId);
      
      if( /* msgIdNdx === -1 */ isProcessed === null
        && !ContainsString(msgTo,To_blacklist)
        && !MatchesRegex(msgFrom,From_regex_blacklist)
        && !ContainsString(messages[lastMsg].getRawContent(),Headers_blacklist) ) {

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
				  cc: "it-operations@mycompany.com", // alias of 'amine@mycompany.com'
                  noReply: true // Works only for G-Suite accounts
				});
                // Correction: star messages that have been responded to
                messages[lastMsg].star();
              
                // Log message that has been responded to
                ops_log_sheet.appendRow(['REP SENT', msgDate, new Date().toLocaleString(), msgId, threads[i].getId(), msgFrom, msgSubject]);
                var last_OpsLog_row = ops_log_sheet.getRange(ops_log_sheet.getLastRow(),1,1,ops_log_sheet.getLastColumn());
                last_OpsLog_row.setBackgroundRGB(252,229,205);
                cache.put(msgId, '', 960); // Cache ID of processed message
          
        } else if ( /* msgIdNdx === -1 */ isProcessed === null ) { 
          
          // Star skipped message
          messages[lastMsg].star();

          // Log skipped message
          var msgDate = messages[lastMsg].getDate(), msgSubject = messages[lastMsg].getSubject();
          ops_log_sheet.appendRow(['SKIPPED', msgDate, '', msgId, threads[i].getId(), msgFrom, msgSubject]);
          cache.put(msgId, '', 960); // Cache ID of processed (skipped) message
        }
    }

    /****** Save 2D array of processed message to log sheet *********/

  } else if ( (hour === FINISH_HOUR + TIME_OFFSET) && (date.getMinutes() <= (1.5*INTERVAL)) ) {

    // Mark session end on both sheets

    var last_OpsLog_row = ops_log_sheet.getRange(ops_log_sheet.getLastRow(),1,1,ops_log_sheet.getLastColumn());
    last_OpsLog_row.setBorder(null, null, true, null, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

    var last_ExecLog_row = exec_log_sheet.getRange(exec_log_sheet.getLastRow(),1,1,exec_log_sheet.getLastColumn());
    last_ExecLog_row.setBorder(null, null, true, null, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM);


  }
}
