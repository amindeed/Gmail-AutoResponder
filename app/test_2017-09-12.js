// ** 2019/06/08 **
// Test script to check whether or not messages retrieved from other
// email accounts are being given IDs (threads and underlying messages)
// in a way that could be correctly handled by the application.

function myFunction() {
  var threads = GmailApp.search('in:all to:operations@OldMailServer.com after:2019-01-01');

for (i = 0; i < threads.length; i++) {
	var messages = threads[i].getMessages();
	var lastMsg = messages.length -1;

	Logger.log("Thread ID : " + threads[i].getId());
	Logger.log("Last Msg ID : " + messages[lastMsg].getId());
	Logger.log("********************");
}
}
