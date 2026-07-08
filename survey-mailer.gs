/**
 * ORBIT 企業經營診斷 — Google Apps Script 備援
 * 部署：新增試算表 → 擴充功能 → 貼上此檔 → 部署 Web App（任何人可存取）
 * 將部署網址填入 survey-endpoint.js 的 SURVEY_MAIL_URL
 */
var NOTIFY_EMAIL = 'hello@obarai.com';
var SHEET_NAME = 'SurveyResponses';

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    if (payload.type && payload.type !== 'orbit-survey') {
      return jsonOut({ success: false, error: 'invalid_type' });
    }

    appendSheet(payload);
    sendNotify(payload);

    return jsonOut({ success: true });
  } catch (err) {
    return jsonOut({ success: false, error: err.message });
  }
}

function appendSheet(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'submittedAt', 'company', 'contact', 'email', 'phone', 'industry', 'headcount',
      'phase1', 'phase2', 'custom', 'note', 'assumptions'
    ]);
  }
  var d = payload.data || {};
  var rec = payload.recommendation || {};
  var c = d.contact || {};
  sheet.appendRow([
    payload.submittedAt || new Date().toISOString(),
    c.company || '',
    c.name || '',
    c.email || '',
    c.phone || '',
    (rec.industry && rec.industry.name) || d.industryId || '',
    d.headcount || '',
    (rec.phase1 || []).join(', '),
    (rec.phase2 || []).join(', '),
    (rec.custom || []).join(', '),
    d.note || '',
    payload.assumptions || ''
  ]);
}

function sendNotify(payload) {
  var d = payload.data || {};
  var rec = payload.recommendation || {};
  var c = d.contact || {};
  var company = c.company || '未填公司';
  var industry = (rec.industry && rec.industry.name) || d.industryId || '';
  var subject = '【ORBIT 診斷】' + company + (industry ? ' · ' + industry : '');
  var body = (payload.assumptions || '') + '\n\n──── 完整 JSON ────\n' + JSON.stringify(payload, null, 2);
  GmailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}