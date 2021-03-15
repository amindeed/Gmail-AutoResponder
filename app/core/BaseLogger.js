/**
 * Name 		  :	Gmail AutoResponder
 * Version 		:	0.1
 * Descriton 	:	Automatic processing of incoming GMail messages
 * Author 		:	Amine Al Kaderi <alkaderi@amindeed.com>
 * License 		:	MIT license
 */

/** Base Logger class **/
class BaseLogger {

  constructor(identifiers={}) {
    this.identifiers = identifiers;
  }

  static getDataCollections() {
    const dataCollections = [
        {
          "name": "PROCESSED",
          "index": 0,
          "dataFields" : [
              "LABEL",
              "ORIG_MSG_SENT_DATE",
              "RESPONSE_DATE",
              "MESSAGE_ID",
              "THREAD_ID",
              "FROM",
              "SUBJECT",
              "APPLIED_FILTER"
          ]
        },
        {
          "name": "EXECUTIONS",
          "index": 1,
          "dataFields" : [
              "SEARCH_QUERY",
              "EXECUTION_TIME",
              "NUMBER_THREADS"
          ]
        }
      ];

    return dataCollections;
  }

  /** Check if data in a given array is consistent, **/
  /** i.e. elements are either of primitive types (1D array), **/
  /** or are all non empty arrays of primitive types (2D array) **/
  /** This function will probably be upgraded in the future, by **/
  /** checking whether data map correctly to their respective **/
  /** fields and matches their properties. **/
  static isDatasetConsistent(dataset) {

    const isPrimitive = (element) => element !== Object(element);

    const isValid2DArray = (element, i, arr) => element instanceof Array 
                                            && element.length
                                            && element.length === arr[0].length
                                            && element.every(isPrimitive);

    if ( dataset instanceof Array && dataset.length ) {
      return dataset.every(isPrimitive) || dataset.every(isValid2DArray)

    } else {
      return false
    }
  }

  /** TEMPLATE: Logger identifiers validator **/
  isIdValid() {
    /* Validates 'this.identifiers' keys */
    /* returns true/false, or better an object/array containing invalid keys */
  }
  
  /** TEMPLATE: Given correct logger identifiers, append log entries **/
  /** array to the logs target if it comprises consistent data **/
  append(logEntries, target) {
    var isConsistent = this.constructor.isDatasetConsistent(logEntries);
    var targets = this.constructor.getDataCollections().filter( function(item){return (item.name==target)} );
    var logEntriesTarget = targets[0];
    // ...
  };

  /** TEMPLATE: Initialize logs target **/
  initLogger() {
    /* both identifiers and getDataCollections() are required */
  };
}