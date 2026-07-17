function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
  var data = JSON.parse(e.postData.contents)
  var email = (data.email || '').trim()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: 'Invalid email' })
    ).setMimeType(ContentService.MimeType.JSON)
  }

  sheet.appendRow([new Date(), email])

  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok' })
  ).setMimeType(ContentService.MimeType.JSON)
}
