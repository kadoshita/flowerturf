/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];

  var req = JSON.parse(e.postData.contents);
  var date = new Date();

  sheet.appendRow([date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds(), req.rating, req.session_duration, req.message]);
  return ContentService.createTextOutput('OK');
}