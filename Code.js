function autoReply() {

  var interval = 10;    //  To execute teh script after each 10 min.
  var date = new Date();
  var timeFrom = Math.floor(date.valueOf()/1000) - 60 * interval;
  var hour = date.getHours();    // Returns current hour only. ex. 12:33 --> 12
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

  function ColumnValues(sheet, column){
    var AllCellsValues = sheet.getRange(column + "1:" + column + sheet.getMaxRows()).getValues();
    return [].concat.apply([], AllCellsValues.filter(String))
  }


  if (((hour < 6) || (hour >= 20)) && ((threads = GmailApp.search('is:inbox after:' + timeFrom)).length !== 0)) {

  // Log
  var LogSSId = 'LOG-SPREADSHEET-ID';
  var log = SpreadsheetApp.openById(LogSSId);
  var log_sheet = log.setActiveSheet(log.getSheets()[0]);
  var log_values = ColumnValues(log_sheet,"C");

  // Configs
  var ConfigSSId = 'CONFIG-SPREADSHEET-ID';
  var config = SpreadsheetApp.openById(ConfigSSId);
  var From_regex_blacklist = ColumnValues(config.getSheetByName("From_regex_blacklist"),"A");
  var To_blacklist = ColumnValues(config.getSheetByName("To_blacklist"),"A");
  var msgHeaders_blacklist = ColumnValues(config.getSheetByName("msgHeaders_blacklist"),"A");

  // Message body
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

      if( !MatchesRegex(msgFrom,From_regex_blacklist)
        && log_values.indexOf(msgId) === -1
        && !ContainsString(msgTo,To_blacklist)
        && !ContainsString(messages[lastMsg].getRawContent(),msgHeaders_blacklist) ) {

                var msgDate = messages[lastMsg].getDate();
				var msgSubject = messages[lastMsg].getSubject();
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
				  , cc: "amine@mycompany.com"
				});

                // Ajouter l'opération au journal
                log_sheet.appendRow([msgDate, new Date().toLocaleString(), msgId, threads[i].getId(), msgFrom, msgSubject]);
      }
    }
  }
}
