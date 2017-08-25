/**** OPERATIONS ****/

function autoReply() {

  var interval = 10;    //  To execute the script after each 10 min.
  var date = new Date();
  var timeFrom = Math.floor(date.valueOf()/1000) - 60 * interval;
  var GM_SEARCH_QUERY = 'is:inbox after:' + timeFrom;
  var hour = date.getHours();    // Returns current hour only. ex. 12:33 --> 12
  var ConfigSSId = 'CONFIG-SPREADSHEET-ID';
  var LogSSId = 'LOG-SPREADSHEET-ID';
  var threads = [];


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

  function ColumnValues(sheet, column, shift){
    // shift: {0, false, undefined, null, NaN, ""} <=> false
    var values = sheet.getRange(column + "1:" + column + sheet.getMaxRows()).getValues();
    (values = [].concat.apply([], values.filter(String))).splice(0,shift?1:0);
    return values
  }


  //Configs #1
  var config = SpreadsheetApp.openById(ConfigSSId);
  var config_sheet = config.setActiveSheet(config.getSheets()[0]);
  var TIME_OFFSET = ColumnValues(config_sheet,"A",1)[0];

  if (((hour < (6 + TIME_OFFSET)) || (hour >= (20 + TIME_OFFSET))) && ((threads = GmailApp.search(GM_SEARCH_QUERY)).length !== 0)) {

  // Log
  var log = SpreadsheetApp.openById(LogSSId);
  var log_sheet = log.setActiveSheet(log.getSheets()[0]);
  var log_msgIDs = ColumnValues(log_sheet,"D",1);

  // Configs #2
  var From_regex_blacklist = ColumnValues(config_sheet,"E",1);
  var To_blacklist = ColumnValues(config_sheet,"H",1);
  var Headers_blacklist = ColumnValues(config_sheet,"B",1);

  // Corps du message de réponse automatique
  var WEB_USERNAME = 'user0';
  var WEB_PWD = 'p@s$wOrD';
  var URL_HTML_BODY = 'https://mycompany.com/prv/email_body.html';
  var headers = {"Authorization" : "Basic " + Utilities.base64Encode(WEB_USERNAME + ':' + WEB_PWD)};
  var params = {
    "method":"POST",
    "headers":headers,
    "validateHttpsCertificates":false
  };
  var body = UrlFetchApp.fetch(URL_HTML_BODY,params).getContentText();

    for (i = 0; i < threads.length; i++) {

        var messages = threads[i].getMessages();
        var lastMsg = messages.length -1;
        var msgFrom = messages[lastMsg].getFrom();
        var msgTo = messages[lastMsg].getTo();
        var msgId = messages[lastMsg].getId();
        var msgIdNdx = log_msgIDs.indexOf(msgId);

      if( !MatchesRegex(msgFrom,From_regex_blacklist)
        && !ContainsString(msgTo,To_blacklist)
        && !ContainsString(messages[lastMsg].getRawContent(),Headers_blacklist)
        && msgIdNdx === -1 ) {

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
				  bcc: "amine@mycompany.com",
                  noReply: true
				});

                // Log processed message
                log_sheet.appendRow(['PROCESSED', msgDate, new Date().toLocaleString(), msgId, threads[i].getId(), msgFrom, msgSubject]);
                var range = log_sheet.getRange(log_sheet.getLastRow(),1,1,log_sheet.getLastColumn());
                range.setBackgroundRGB(252,229,205);

        } else if (typeof ColumnValues(log_sheet,"A",1)[msgIdNdx] === 'undefined') {

          // Log skipped message
          var msgDate = messages[lastMsg].getDate(), msgSubject = messages[lastMsg].getSubject();
          log_sheet.appendRow(['SKIPPED', msgDate, '', msgId, threads[i].getId(), msgFrom, msgSubject]);
        }
    }
  }
}
