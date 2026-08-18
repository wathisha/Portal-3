/**
 * ============================================================================
 * Sathsarani Science Academy LMS - Google Sheets Live Cloud Database Backend
 * ============================================================================
 * Universal Cloud Database for Google Sheets (Supports both Standalone & Container-Bound)
 */

// OPTIONAL: If using a Standalone Script (at script.google.com), paste your Google Sheet ID or URL here.
// Example: var SPREADSHEET_ID = "1X8TSZcUAJjKj49q6BrL8M2IELx8SVK3L";
// If you opened Apps Script from inside Google Sheets (Extensions -> Apps Script), leave it empty ("").
var SPREADSHEET_ID = "";

function getTargetSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
    var cleanId = SPREADSHEET_ID.trim();
    if (cleanId.includes("/d/")) {
      cleanId = cleanId.split("/d/")[1].split("/")[0];
    }
    return SpreadsheetApp.openById(cleanId);
  }
  
  // If opened directly from inside Google Sheet
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}

  // If standalone, check stored property
  var propId = PropertiesService.getScriptProperties().getProperty("LMS_SHEET_ID");
  if (propId) {
    try {
      return SpreadsheetApp.openById(propId);
    } catch (e) {}
  }

  // Auto-create a new Google Sheet if none is linked yet
  var newSheet = SpreadsheetApp.create("Science LMS Database");
  PropertiesService.getScriptProperties().setProperty("LMS_SHEET_ID", newSheet.getId());
  return newSheet;
}

function doGet(e) {
  var action = e && e.parameter ? e.parameter.action : "get_all";
  var ss = getTargetSpreadsheet();
  ensureTablesExist(ss);

  // Allow handling write actions via GET as well for maximum cross-device compatibility
  if (e && e.parameter && e.parameter.payload) {
    try {
      var payload = JSON.parse(decodeURIComponent(e.parameter.payload));
      return handleDatabaseAction(ss, payload);
    } catch (err) {
      return jsonResponse({ status: "error", message: err.toString() });
    }
  }

  if (action === "get_students") {
    var students = getStudentsFromSheet(ss);
    return jsonResponse({ status: "success", count: students.length, data: students, spreadsheetUrl: ss.getUrl() });
  }

  if (action === "get_admin_auth") {
    var auth = getAdminAuthFromSheet(ss);
    return jsonResponse({ status: "success", data: auth });
  }

  // Default: return complete database snapshot
  var allData = {
    students: getStudentsFromSheet(ss),
    adminAuth: getAdminAuthFromSheet(ss),
    settings: getSettingsFromSheet(ss),
    spreadsheetUrl: ss.getUrl()
  };
  return jsonResponse({ status: "success", data: allData, spreadsheetUrl: ss.getUrl() });
}

function doPost(e) {
  var ss = getTargetSpreadsheet();
  ensureTablesExist(ss);
  
  try {
    var contents = e.postData.contents;
    var payload = JSON.parse(contents);
    return handleDatabaseAction(ss, payload);
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

function handleDatabaseAction(ss, payload) {
  var action = payload.action;

  if (action === "save_students" || action === "update_student" || action === "register_student") {
    saveStudentsToSheet(ss, payload.students || payload.data);
    return jsonResponse({ status: "success", message: "Students table updated in Google Sheet!", spreadsheetUrl: ss.getUrl() });
  }

  if (action === "update_admin_auth") {
    saveAdminAuthToSheet(ss, payload.username, payload.password);
    return jsonResponse({ status: "success", message: "Admin credentials updated in Google Sheet!", spreadsheetUrl: ss.getUrl() });
  }

  if (action === "save_settings") {
    saveSettingsToSheet(ss, payload.settings || payload.data);
    return jsonResponse({ status: "success", message: "ERP settings updated in Google Sheet!", spreadsheetUrl: ss.getUrl() });
  }

  if (action === "sync_all") {
    if (payload.data.students) saveStudentsToSheet(ss, payload.data.students);
    if (payload.data.adminAuth) saveAdminAuthToSheet(ss, payload.data.adminAuth.username, payload.data.adminAuth.password);
    if (payload.data.settings) saveSettingsToSheet(ss, payload.data.settings);
    return jsonResponse({ status: "success", message: "Full database synced to Google Sheet!", spreadsheetUrl: ss.getUrl() });
  }

  return jsonResponse({ status: "error", message: "Unknown action: " + action });
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
  if (!sheet) return [];
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
  if (!sheet) {
    sheet = ss.insertSheet("DB_Students");
  }
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
  if (!sheet) return { username: "sheshadi", password: "password123" };
  var rows = sheet.getDataRange().getValues();
  if (rows.length > 1) {
    return { username: rows[1][0], password: rows[1][1] };
  }
  return { username: "sheshadi", password: "password123" };
}

function saveAdminAuthToSheet(ss, username, password) {
  var sheet = ss.getSheetByName("DB_AdminAuth");
  if (!sheet) sheet = ss.insertSheet("DB_AdminAuth");
  sheet.clearContents();
  sheet.appendRow(["Username", "Password", "LastUpdated"]);
  sheet.appendRow([username.toLowerCase(), password, new Date().toISOString()]);
}

function getSettingsFromSheet(ss) {
  var sheet = ss.getSheetByName("DB_Settings");
  if (!sheet) return {};
  var rows = sheet.getDataRange().getValues();
  var settings = {};
  for (var i = 1; i < rows.length; i++) {
    settings[rows[i][0]] = rows[i][1];
  }
  return settings;
}

function saveSettingsToSheet(ss, settingsObj) {
  var sheet = ss.getSheetByName("DB_Settings");
  if (!sheet) sheet = ss.insertSheet("DB_Settings");
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
