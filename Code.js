function autoReply() {
    var date = new Date();
    var hour = date.getHours(); // returns only the current hour, ex. 12:33 --> 12

    //if (hour < 6 && hour >= 20) {
    if (hour < 9 && hour >= 21) {
        var threads = GmailApp.search('is:inbox');
        for (var i = 0; i < threads.length; i++) {
			if (threads[i].isUnread()){
				var messages = threads[i].getMessages();
				var lastMsg = messages.length - 1;
				var msgFrom = messages[lastMsg].getFrom();
				var msgDate = messages[lastMsg].getDate();
				var msgSubject = messages[lastMsg].getSubject();
				var msgTo = messages[lastMsg].getTo();
				var msgCc = messages[lastMsg].getCc();
				var msgBody = messages[lastMsg].getBody();
				var label = GmailApp.getUserLabelByName("_autoRep");

				threads[i].reply("", {
					htmlBody: '<br/><h1>some <b>HTML</b> <em>body</em> text</h1>' + '<br/>-------------------------<br/><b>From: </b>' + msgFrom + '<br/> <b> Date: </b>' + msgDate + '<br/><b>Subject : </b>' + msgSubject + '<br/><b>To : </b>' + msgTo + '<br/><b>Cc : </b>' + msgCc + '<br/><br/>' + msgBody + '<br/>',
					cc: "amine@mycompany.com"
				});

				threads[i].markRead();
				threads[i].addLabel(label);
            }
        }
    }
}
