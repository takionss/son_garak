/**
 * ============================================================
 * [참고용] Google Apps Script 코드
 * ============================================================
 * 
 * 이 코드를 Google Apps Script 에디터에 붙여넣으세요.
 * (https://script.google.com/u/0/home/projects/1zf18fxft9hu0YZvyp595_Ax-mWfkhI3lxzA9gr7UWsKN8pW1yqy-KiSg/edit)
 * 
 * 변경사항:
 * - page_source 필드를 받아서 Google Sheets에 기록
 * - 이메일 알림에 유입 페이지 정보 포함
 * 
 * Google Sheets 컬럼 순서:
 * A: 접수시각 | B: 성함 | C: 연락처 | D: 상담분야 | E: 문의내용 | F: 유입페이지
 * 
 * ⚠️ 코드 수정 후 반드시 '새 배포' 또는 '배포 관리 > 버전 수정'을 해주세요.
 * ============================================================
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById('1vpLka7zh2jlICBr6Gx7VGQopnACg7OXqZhlSrgY9I-0').getActiveSheet();
    
    var name = e.parameter.name || '';
    var phone = e.parameter.phone || '';
    var category = e.parameter.category || '';
    var message = e.parameter.message || '';
    var pageSource = e.parameter.page_source || '메인페이지';
    var timestamp = new Date();
    
    // 시트에 행 추가
    sheet.appendRow([
      Utilities.formatDate(timestamp, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss'),
      name,
      phone,
      category,
      message,
      pageSource
    ]);
    
    // 이메일 알림 발송
    var emailBody = '━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
      '🔔 새로운 보험 상담 신청\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '📅 접수시각: ' + Utilities.formatDate(timestamp, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss') + '\n' +
      '👤 성함: ' + name + '\n' +
      '📞 연락처: ' + phone + '\n' +
      '📋 상담분야: ' + category + '\n' +
      '💬 문의내용: ' + (message || '(없음)') + '\n' +
      '🌐 유입페이지: ' + pageSource + '\n\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    
    MailApp.sendEmail({
      to: Session.getActiveUser().getEmail(),
      subject: '[보험상담] ' + name + '님 신규 상담 신청 (' + pageSource + ')',
      body: emailBody
    });
    
    // CORS 대응: 성공 응답
    return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET 요청도 처리 (테스트용)
function doGet(e) {
  return ContentService.createTextOutput('보험 상담 API가 정상 작동 중입니다.')
    .setMimeType(ContentService.MimeType.TEXT);
}
