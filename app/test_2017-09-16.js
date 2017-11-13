/** Check work log, entry '2017-09-16', for context **/

function myFunction() {

  // in:anywhere rfc822msgid:CAPaJ7a3cDR5bc3e0PpUBG6PJBu6SJKKDoj634+2gj58jwFdNiw@mail.gmail.com

  var threads = GmailApp.search("in:anywhere rfc822msgid:CAPaJ7a3cDR5bc3e0PpUBG6PJBu6SJKKDoj634+2gj58jwFdNiw@mail.gmail.com");

  var msgId = threads[0].getMessages()[0].getId();
  var msgDate = threads[0].getMessages()[0].getDate();
  var msgSubject = threads[0].getMessages()[0].getSubject();
  var msgFrom = threads[0].getMessages()[0].getFrom();
  var msgTo = threads[0].getMessages()[0].getTo();
  var msgCc = threads[0].getMessages()[0].getCc();

  Logger.log(msgId);
  Logger.log(msgDate);
  Logger.log(msgSubject);
  Logger.log(msgFrom);
  Logger.log(msgTo);
  Logger.log(msgCc);

}
