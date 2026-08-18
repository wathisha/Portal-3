/**
 * ============================================================================
 * Sathsarani Science Academy LMS - Google Sheets Live Cloud Database Backend
 * ============================================================================
 * This script transforms your Google Sheet into a full real-time database
 * (similar to Microsoft Access tables) accessible from any mobile phone or PC.
 *
 * HOW TO SETUP (Takes 2 minutes):
 * 1. Open Google Sheets (sheets.google.com) and create a new blank sheet.
 * 2. Rename the spreadsheet to: "Science LMS Database"
 * 3. In the top menu, click: Extensions -> Apps Script
 * 4. Delete any code in the editor, paste this entire file, and click Save (Floppy icon).
 * 5. Click "Deploy" (top right) -> "New deployment"
 * 6. Click the Gear icon ⚙️ -> select "Web app"
 *    - Description: "LMS Database API"
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone" (Required so your phone & laptop can connect)
 * 7. Click "Deploy", authorize permissions, and COPY the Web App URL.
 * 8. Paste the URL into the Teacher Dashboard (admin.html -> Database Setup Wizard).
 * ============================================================================
 */

function doGet(e) {
  var action = e && e.parameter ? e.parameter.action : "get_all";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureTablesExist(ss);

  if (action === "get_students") {
    var students = getStudentsFromSheet(ss);
    return jsonResponse({ status: "success", count: students.length, data: students });
  }

  if (action === "get_admin_auth") {
    var auth = getAdminAuthFromSheet(ss);
    return jsonResponse({ status: "success", data: auth });
  }

  // Default: return complete database snapshot
  var allData = {
    students: getStudentsFromSheet(ss),
    adminAuth: getAdminAuthFromSheet(ss),
    settings: getSettingsFromSheet(ss)
  };
  return jsonResponse({ status: "success", data: allData });
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureTablesExist(ss);
  
  try {
    var contents = e.postData.contents;
    var payload = JSON.parse(contents);
    var action = payload.action;

    if (action === "save_students" || action === "update_student" || action === "register_student") {
      saveStudentsToSheet(ss, payload.students);
      return jsonResponse({ status: "success", message: "Students database updated globally!" });
    }

    if (action === "update_admin_auth") {
      saveAdminAuthToSheet(ss, payload.username, payload.password);
      return jsonResponse({ status: "success", message: "Admin credentials updated globally!" });
    }

    if (action === "save_settings") {
      saveSettingsToSheet(ss, payload.settings);
      return jsonResponse({ status: "success", message: "ERP settings updated globally!" });
    }

    if (action === "sync_all") {
      if (payload.data.students) saveStudentsToSheet(ss, payload.data.students);
      if (payload.data.adminAuth) saveAdminAuthToSheet(ss, payload.data.adminAuth.username, payload.data.adminAuth.password);
      if (payload.data.settings) saveSettingsToSheet(ss, payload.data.settings);
      return jsonResponse({ status: "success", message: "Full database synced globally!" });
    }

    return jsonResponse({ status: "error", message: "Unknown action" });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

// Ensure Database Tables (Sheets) Exist
function ensureTablesExist(ss) {
  var studentSheet = ss.getSheetByName("DB_Students");
  if (!studentSheet) {
    studentSheet = ss.insertSheet("DB_Students");
    studentSheet.appendRow(["StudentID", "Name", "Username", "Password", "Grade", "ParentWhatsApp", "Attendance", "AnnualUnitAvg", "JSONData"]);
  }

  var authSheet = ss.getSheetByName("DB_AdminAuth");
  if (!authSheet) {
    authSheet = ss.insertSheet("DB_AdminAuth");
    authSheet.appendRow(["Username", "Password", "LastUpdated"]);
    authSheet.appendRow(["sheshadi", "password123", new Date().toISOString()]);
  }

  var settingsSheet = ss.getSheetByName("DB_Settings");
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet("DB_Settings");
    settingsSheet.appendRow(["Key", "Value"]);
  }
}

function getStudentsFromSheet(ss) {
  var sheet = ss.getSheetByName("DB_Students");
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  var students = [];
  for (var i = 1; i < rows.length; i++) {
    var rawJson = rows[i][8];
    if (rawJson) {
      try {
        students.push(JSON.parse(rawJson));
      } catch (e) {
        students.push({
          student_info: { student_id: rows[i][0], name: rows[i][1], username: rows[i][2], password: rows[i][3], grade_class: rows[i][4], parent_whatsapp: rows[i][5] },
          summary: { attendance: rows[i][6], average_unit_test: rows[i][7] }
        });
      }
    }
  }
  return students;
}

function saveStudentsToSheet(ss, studentsArray) {
  var sheet = ss.getSheetByName("DB_Students");
  sheet.clearContents();
  sheet.appendRow(["StudentID", "Name", "Username", "Password", "Grade", "ParentWhatsApp", "Attendance", "AnnualUnitAvg", "JSONData"]);

  if (!studentsArray || !Array.isArray(studentsArray)) return;

  for (var i = 0; i < studentsArray.length; i++) {
    var st = studentsArray[i];
    var info = st.student_info || {};
    var summary = st.summary || {};
    sheet.appendRow([
      info.student_id || "",
      info.name || "",
      info.username || "",
      info.password || "student123",
      info.grade_class || "06 - Science",
      info.parent_whatsapp || "+94771614260",
      summary.attendance || "95%",
      summary.average_unit_test || 0,
      JSON.stringify(st)
    ]);
  }
}

function getAdminAuthFromSheet(ss) {
  var sheet = ss.getSheetByName("DB_AdminAuth");
  var rows = sheet.getDataRange().getValues();
  if (rows.length > 1) {
    return { username: rows[1][0], password: rows[1][1] };
  }
  return { username: "sheshadi", password: "password123" };
}

function saveAdminAuthToSheet(ss, username, password) {
  var sheet = ss.getSheetByName("DB_AdminAuth");
  sheet.clearContents();
  sheet.appendRow(["Username", "Password", "LastUpdated"]);
  sheet.appendRow([username.toLowerCase(), password, new Date().toISOString()]);
}

function getSettingsFromSheet(ss) {
  var sheet = ss.getSheetByName("DB_Settings");
  var rows = sheet.getDataRange().getValues();
  var settings = {};
  for (var i = 1; i < rows.length; i++) {
    settings[rows[i][0]] = rows[i][1];
  }
  return settings;
}

function saveSettingsToSheet(ss, settingsObj) {
  var sheet = ss.getSheetByName("DB_Settings");
  sheet.clearContents();
  sheet.appendRow(["Key", "Value"]);
  for (var k in settingsObj) {
    sheet.appendRow([k, typeof settingsObj[k] === "object" ? JSON.stringify(settingsObj[k]) : settingsObj[k]]);
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
