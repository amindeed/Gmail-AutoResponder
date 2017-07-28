function autoReply() {
  var interval = 10;    //  To execute the script after each 10 minutes.
  var date = new Date();
  var hour = date.getHours();    // Returns current hour only. ex. 12:33 --> 12

  if ((hour < 6 && hour >= 20)) {

  var timeFrom = Math.floor(date.valueOf()/1000) - 60 * interval;
  var threads = GmailApp.search('is:inbox after:' + timeFrom);
    for (var i = 0; i < threads.length; i++) {

        var messages = threads[i].getMessages();
        var lastMsg = messages.length -1;
        var msgFrom = messages[lastMsg].getFrom();
        var companyAdr = /(admin|boss|accounting|operations)@mycompany.*(.com|.biz|.info|.org|.net)/;

        var labels = threads[i].getLabels();
        var labelName = "_autoRep";
        var labelsList = [];

        for (var j = 0; j < labels.length; j++) {

               labelsList.push(labels[j].getName());
           }

        if (!msgFrom.match(companyAdr) && (labelsList.indexOf(labelName) === -1)) {

            var msgDate = messages[lastMsg].getDate();
            var msgSubject = messages[lastMsg].getSubject();
            var msgTo = messages[lastMsg].getTo();
            var msgCc = messages[lastMsg].getCc();
            var msgBody = messages[lastMsg].getBody();
            var label = GmailApp.getUserLabelByName(labelName);
            var currentTime = date.toLocaleTimeString();

            var e = labelsList.indexOf(labelName);  // For test and verification

            threads[i].reply("", {
              htmlBody: '<br/>Thank you for contacting <b>My Company.</b><br/><br/>\
We will be responding to your inquiry shortly.<br/><br/>\
Please note that our OCC is open all week from <b>6:00 AM to 8:00 PM (local time)</b>.<br/><br/><br/>\
<font color=\"blue\"><b>My Company</b><br/>\
<b>Head Office :<b/> +00 0000 0000<br/>\
<b>FAX :<b/> +00 0000 0001<br/>\
www.mycompany.com</font><br/><br/>\
-------------------------'
+ '<br/><b>From : </b>' + msgFrom
+ '<br/><b>Date : </b>' + msgDate
+ '<br/><b>Subject : </b>' + msgSubject
+ '<br/><b>To : </b>' + msgTo
+ '<br/><b>Cc : </b>' + msgCc
+ '<br/><br/>' + msgBody + '<br/>'
              , cc: "amine@mycompany.com"
            });
            threads[i].addLabel(label);
        }
    }
}
}
