/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];

  sheet.appendRow(['data', e]);
  return ContentService.createTextOutput('OK');
}