/******** DRAFT // 17-08-2017 **********/

function autoReply() {
  var interval = 10;    //  To execute teh script after each 10 min.
  var date = new Date();
  var hour = date.getHours();    // Returns current hour only. ex. 12:33 --> 12
  var LogSSId = 'LOG-SPREADSHEET-ID';
  var ConfigSSId = 'CONFIG-SPREADSHEET-ID';

  function ContainsString(InputStr, checklist) {
    var Contains = false;
    var i = 0;
    while (!Contains && i < checklist.length) {
      if (InputStr.toLowerCase().indexOf(checklist[i]) !== -1) {
        Exists = true;
      } else {i++;}
    }
    return Contains;
  }

  function MatchesRegex(InputStr, regex) {
    var Matches = false;
    var i = 0;
    while (!Matches && i < regex.length) {
      if (InputStr.toLowerCase().match(regex[i]) !== -1) {
        Exists = true;
      } else {i++;}
    }
    return Matches;
  }

  ///// if ((hour < 6) || (hour >= 20)) { // Commented out for testing

  var timeFrom = Math.floor(date.valueOf()/1000) - 60 * interval;
  var threads = GmailApp.search('is:inbox after:' + timeFrom);

  // Log
  var log = SpreadsheetApp.openById(LogSSId);
  var log_sheet = log.setActiveSheet(log.getSheets()[0]);
  var log_values = log_sheet.getDataRange().getValues();

  // Configs
  var config = SpreadsheetApp.openById(ConfigSSId);
  var From_regex_blacklist = config.getSheetByName("From_regex_blacklist").getDataRange().getValues();
  var To_blacklist = config.getSheetByName("To_blacklist").getDataRange().getValues();
  var msgHeaders_blacklist = config.getSheetByName("msgHeaders_blacklist").getDataRange().getValues();


  /****** Retrieve HTML body content from a "Google Docs" document *********
  var MsgBdyDocId = "MSG-BODY-CONTENT-GOOGLE-DOC-ID";
  var forDriveScope = DriveApp.getStorageUsed();
  var url = "https://docs.google.com/feeds/download/documents/export/Export?id="+MsgBdyDocId+"&exportFormat=html";
  var param = {
  method      : "get",
  headers     : {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
  muteHttpExceptions:true,
  };
  var body = UrlFetchApp.fetch(url,param).getContentText();
  **************************************************************************/


  var WEB_USERNAME = 'user0';
  var WEB_PWD = 'p@s$wOrD';
  var url = 'http://mycompany.com/prv/email_body.html';
  var headers = {"Authorization" : "Basic " + Utilities.base64Encode(WEB_USERNAME + ':' + WEB_PWD)};
  var params = {
    "method":"POST",
    "headers":headers
  };
  var body = UrlFetchApp.fetch(url,params).getContentText();


    for (var i = 0; i < threads.length; i++) {

        var messages = threads[i].getMessages();
        var lastMsg = messages.length -1;
        var msgFrom = messages[lastMsg].getFrom();
        var msgTo = messages[lastMsg].getTo();
        Logger.log(messages[lastMsg].getFrom());

      if( !MatchesRegex(msgFrom,From_regex_blacklist)
        && log_values[1].indexOf(messages[lastMsg].getId()) === -1
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

                // log processed message to "Autorespond-log" sheet
                log_sheet.appendRow([msgDate, messages[lastMsg].getId(), threads[i].getId(), msgFrom, msgSubject]);
      }
    }
  ////// }
}
