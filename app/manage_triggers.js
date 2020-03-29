function manage_triggers() {
  
  ScriptApp.newTrigger('autoReply')
  .timeBased()
  .everyMinutes(10) // Better, custom time interval as a sript user property value.
  .create();
  
  ScriptApp.newTrigger('archive_log')
  .timeBased()
  .onMonthDay(1)
  .atHour(5)
  .create();
  
  // Disable App by simply deleting all time-driven triggers.
  /*
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  */

}