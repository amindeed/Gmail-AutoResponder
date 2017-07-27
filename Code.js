function autoReply() {
  var interval = 5;
  var date = new Date();
  var hour = date.getHours();
  //if (hour < 9 || hour >= 21) {
  var timeFrom = Math.floor(date.valueOf()/1000) - 60 * interval;
  var threads = GmailApp.search('is:inbox after:' + timeFrom);
    for (var i = 0; i < threads.length; i++) {
        var messages = threads[i].getMessages();
        var lastMsg = messages.length -1;
        var msgFrom = messages[lastMsg].getFrom();
        var companyAdr = /(admin|boss|accounting)@mycompany.*(.com|.biz|.info|.org|.net)/;

        if (!msgFrom.match(companyAdr)) {

          var labels = threads[i].getLabels();
          var hasLabel = false;

          for (var j = 0; j < labels.length; i++) {
            if (labels[j].getName() === label){
              var hasLabel = true;
              break;
            }
          }

            if (hasLabel == false) {

              var msgDate = messages[lastMsg].getDate();
              var msgSubject = messages[lastMsg].getSubject();
              var msgTo = messages[lastMsg].getTo();
              var msgCc = messages[lastMsg].getCc();
              var msgBody = messages[lastMsg].getBody();
              var label = GmailApp.getUserLabelByName("_autoRep");
              var currentTime = date.toLocaleTimeString();

              threads[i].reply("", {
                htmlBody: '<h3>Current time: ' + date + ', ' + currentTime + '</h3><br/>-------------------------<br/><b>From : </b>' + msgFrom + '<br/><b>Date : </b>' + msgDate + '<br/><b>Subject : </b>' + msgSubject + '<br/><b>To : </b>' + msgTo + '<br/><b>Cc : </b>' + msgCc + '<br/><br/>' + msgBody + '<br/>',
                cc: "amine@mycompany.com"
              });
              threads[i].addLabel(label);
            }
        }
    }
//}
}
