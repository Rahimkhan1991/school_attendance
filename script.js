function doGet(e) {
  const action = e.parameter.action;
  const className = e.parameter.className;
  
  if (action === "getStudents") {
    return getStudents(className);
  } else if (action === "submitAttendance") {
    const date = e.parameter.date;
    const body = e.postData?.contents;
    return submitAttendance(className, date, body);
  } else if (action === "getAttendanceReport") {
    return getAttendanceReport(className);
  }
  
  return ContentService.createTextOutput("Invalid request");
}

// ✅ Get students (Roll & Name only)
function getStudents(className) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(className);
  const data = sheet.getDataRange().getValues();
  const students = [];

  for (let i = 1; i < data.length; i++) {
    const roll = data[i][0];
    const name = data[i][1];
    students.push({ roll, name });
  }

  return ContentService.createTextOutput(JSON.stringify(students))
    .setMimeType(ContentService.MimeType.JSON);
}

// ✅ Mark attendance for a specific date
function submitAttendance(className, date, rawData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(className);
  const students = JSON.parse(rawData).data;
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  let dateCol = headers.indexOf(date);

  if (dateCol === -1) {
    dateCol = headers.length;
    sheet.getRange(1, dateCol + 1).setValue(date);
  }

  for (let i = 0; i < students.length; i++) {
    const row = i + 2; // since header is row 1
    const status = students[i].status;
    sheet.getRange(row, dateCol + 1).setValue(status);
  }

  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ✅ Fetch attendance report
function getAttendanceReport(className) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(className);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const report = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const roll = row[0];
    const name = row[1];

    for (let j = 2; j < headers.length; j++) {
      if (row[j]) {
        report.push({
          roll,
          name,
          date: headers[j],
          status: row[j]
        });
      }
    }
  }

  return ContentService.createTextOutput(JSON.stringify(report))
    .setMimeType(ContentService.MimeType.JSON);
}
