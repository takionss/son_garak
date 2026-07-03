/* ============================================================
   보험 상담 랜딩 페이지 - 공통 폼 핸들러
   ============================================================
   사용법: HTML 하단에서 initConsultForm() 호출
   ============================================================ */

(function () {
  'use strict';

  /* ── 개인정보 처리방침 모달 HTML ── */
  const PRIVACY_HTML = `
    <div class="privacy-modal-overlay" id="privacyModal">
      <div class="privacy-modal-content">
        <h3 style="color:#1e293b; margin-bottom:10px; font-size:1.2rem;">개인정보 처리방침</h3>
        <div class="privacy-body">
          <h4>▶ 개인정보 수집 및 이용 동의</h4>
          <p>개인정보는 보험문의 상담 목적으로만 사용되며 동의를 거부하실 수 있으나 보험설계 및 상담이 불가능합니다.</p>
          <ul>
            <li>• 수집항목: 이름, 연락처, 카카오톡아이디</li>
            <li>• 수집목적: 함일상회 보험 설계, 상담, 리모델링 안내 및 서비스 제공</li>
            <li>• 보유기간: 수집 및 동의일로부터 3개월</li>
          </ul>
          <h4>▶ 개인정보 제 3자 제공 동의</h4>
          <p>개인정보는 보험문의 상담 목적으로만 사용되며 동의를 거부하실 수 있으나 보험설계 및 상담이 불가능합니다.</p>
          <ul>
            <li>• 제공받는 자: 함일상회와 위탁계약을 체결한 보험설계사</li>
            <li>• 이용목적: 전화, 문자, 카카오톡을 통한 보험상품 설계 및 상담</li>
            <li>• 제공항목: 이름, 연락처, 카카오톡아이디</li>
            <li>• 보유기간: 수집 및 동의일로부터 3개월</li>
          </ul>
        </div>
        <button class="close-modal-btn" onclick="closePrivacyModal()">확인</button>
      </div>
    </div>
  `;

  /* ── 개인정보 모달 열기/닫기 ── */
  window.openPrivacyModal = function () {
    const modal = document.getElementById('privacyModal');
    if (modal) modal.classList.add('active');
  };

  window.closePrivacyModal = function () {
    const modal = document.getElementById('privacyModal');
    if (modal) modal.classList.remove('active');
  };

  /* ── 성공 모달 표시 ── */
  function showSuccessModal() {
    const overlay = document.createElement('div');
    overlay.className = 'success-modal-overlay';
    overlay.innerHTML = `
      <div class="success-modal-content">
        <div class="success-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h3>신청이 완료되었습니다!</h3>
        <p>전문 상담사가 빠른 시일 내에<br>연락드리겠습니다.</p>
        <button class="success-close-btn" onclick="this.closest('.success-modal-overlay').remove()">확인</button>
      </div>
    `;
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);
  }

  /* ── 전화번호 자동 포맷 ── */
  function formatPhoneNumber(input) {
    input.addEventListener('input', function (e) {
      let val = e.target.value.replace(/[^0-9]/g, '');
      if (val.length > 3 && val.length <= 7) {
        val = val.slice(0, 3) + '-' + val.slice(3);
      } else if (val.length > 7) {
        val = val.slice(0, 3) + '-' + val.slice(3, 7) + '-' + val.slice(7, 11);
      }
      e.target.value = val;
    });
  }

  /* ── 폼 초기화 ── */
  window.initConsultForm = function (formId) {
    // 개인정보 모달 삽입
    if (!document.getElementById('privacyModal')) {
      document.body.insertAdjacentHTML('beforeend', PRIVACY_HTML);
    }

    // 모달 외부 클릭으로 닫기
    document.addEventListener('click', function (e) {
      const modal = document.getElementById('privacyModal');
      if (e.target === modal) closePrivacyModal();
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePrivacyModal();
    });

    const form = document.getElementById(formId || 'consultationForm');
    if (!form) return;

    // page_source 자동 설정 (히든 필드에 값이 없으면 URL 경로에서 추출)
    const pageSourceInput = form.querySelector('input[name="page_source"]');
    if (pageSourceInput && !pageSourceInput.value) {
      const path = window.location.pathname;
      pageSourceInput.value = path || 'main';
    }

    // 전화번호 포맷
    const phoneInput = form.querySelector('input[name="phone"]');
    if (phoneInput) formatPhoneNumber(phoneInput);

    // 폼 제출 처리
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const privacyCheckbox = document.getElementById('privacyAgree');
      if (privacyCheckbox && !privacyCheckbox.checked) {
        alert('개인정보 동의에 체크해 주세요.');
        return;
      }

      const btn = form.querySelector('[type="submit"]');
      const originalText = btn.innerText;
      btn.innerText = '접수 중...';
      btn.disabled = true;

      fetch(form.action, { method: 'POST', body: new FormData(form) })
        .then(function () {
          showSuccessModal();
          form.reset();
          btn.innerText = originalText;
          btn.disabled = false;
        })
        .catch(function () {
          alert('오류가 발생했습니다. 다시 시도해 주세요.');
          btn.innerText = originalText;
          btn.disabled = false;
        });
    });
  };

  /* ── DOM 로드 시 자동 초기화 및 공통 푸터 적용 ── */
  document.addEventListener('DOMContentLoaded', function () {
    // 공통 푸터 텍스트 설정
    const footerText = '© 2026 보험 상담센터. 본 서비스는 보험 가입을 강제하지 않으며, 무료 상담 후 가입 여부는 자유롭게 결정하실 수 있습니다.';
    
    // footer 태그 또는 .footer, .site-footer 클래스를 가진 모든 요소를 찾아 텍스트 업데이트
    const footers = document.querySelectorAll('footer, .footer, .site-footer');
    footers.forEach(function (footer) {
      // 내부에 p 태그가 있으면 p 태그 안에 넣고, 없으면 innerHTML로 주입
      const p = footer.querySelector('p');
      if (p) {
        p.innerHTML = footerText;
      } else {
        footer.innerHTML = `<p style="margin: 0;">${footerText}</p>`;
      }
    });

    const autoForm = document.querySelector('form[data-auto-init]');
    if (autoForm) {
      initConsultForm(autoForm.id);
    }
  });
})();
