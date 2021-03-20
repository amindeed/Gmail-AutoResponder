/**
 * Name 		  :	Gmail AutoResponder
 * Version 		:	0.1
 * Descriton 	:	Automatic processing of incoming GMail messages
 * Author 		:	Amine Al Kaderi <alkaderi@amindeed.com>
 * License 		:	MIT license
 */
 
 
/** Get default message filters **/
function getDefaultFilters() {
  return {
      "rawContent": ['report-type=disposition-notification'],
      "from": [
        '(^|<)((mailer-daemon|postmaster)@.*)',
        'noreply|no-reply|do-not-reply',
        '.+@.*\\bgoogle\\.com',
        Session.getActiveUser().getEmail()
        ],
      "to": ['undisclosed-recipients']
    }
}


/** Add a new message filter **/
function addFilter(key, content) {

  // 'key': 'rawContent', 'from' or 'to'
  // 'content': regex as a string

  var userProperties = PropertiesService.getUserProperties();
  var filtersString = userProperties.getProperty('filters');
  var filters = JSON.parse(filtersString)
  filters[key].push(content)
  filtersString = JSON.stringify(filters)
  userProperties.setProperty('filters', filtersString)
  
}


/** Filter Gmail Message **/
function filterMessage(gmailMessage, filters) {

  // 'filters': a JSON string
  
  var filterResult = {
    "filterOut": false,
    "appliedFilter": ""
    }

  var messageData = {
    "rawContent": gmailMessage.getRawContent(),
    "from": gmailMessage.getFrom(),
    "to": [gmailMessage.getTo(), gmailMessage.getCc(), gmailMessage.getBcc()].filter(Boolean).join(", ")
  }
  
  var filters = JSON.parse(filters);

  for (var key in filters) {
    for (var i = 0; i < filters[key].length; i++) {
      var filter = new RegExp(filters[key][i],'i');
      if ( messageData[key].match(filter) ) {
        filterResult['filterOut'] = true;
        filterResult['appliedFilter'] = key + ": " + filters[key][i];
        return filterResult
      }
    }
  }

  return filterResult
}