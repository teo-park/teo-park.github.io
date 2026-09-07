(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const records = document.getElementById('recordsDialog');
    let opener;
    document.querySelectorAll('[data-open-records]').forEach(button => button.addEventListener('click', () => {
      opener = button; records.showModal();
    }));
    records?.querySelector('[data-close-records]').addEventListener('click', () => records.close());
    records?.addEventListener('close', () => opener?.focus());
    records?.addEventListener('click', event => {
      if (event.target !== records) return;
      const rect = records.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) records.close();
    });
    function updateProgress() {
      const status = document.getElementById('collectionStatus');
      const text = status?.textContent || '';
      const count = text.match(/(\d+)\s*\/\s*(\d+)/);
      if (!count) return;
      const value = Number(count[1]), total = Number(count[2]);
      document.getElementById('journalCount').textContent = value.toLocaleString('ko-KR');
      document.getElementById('journalTotal').textContent = '/ ' + total.toLocaleString('ko-KR') + '종';
      const progress = document.getElementById('journalProgress');
      progress.max = total || 1; progress.value = value;
      progress.setAttribute('aria-label', `물고기 수집 ${value} / ${total}종`);
    }
    const status = document.getElementById('collectionStatus');
    if (status) { new MutationObserver(updateProgress).observe(status, {childList: true, subtree: true}); updateProgress(); }
    const purpose = () => {
      document.body.dataset.purpose = document.querySelector('[name="fishingPurpose"]:checked')?.value || 'all';
    };
    document.querySelectorAll('[name="fishingPurpose"]').forEach(input => input.addEventListener('change', purpose));
    purpose();
    const failure = document.getElementById('dataLoadError');
    function showLoadFailure() { if (failure) failure.hidden = false; }
    document.addEventListener('ocean-data-error', showLoadFailure);
    window.addEventListener('error', event => { if (event.target?.tagName === 'SCRIPT') showLoadFailure(); }, true);
    document.getElementById('reloadJournal')?.addEventListener('click', () => location.reload());
  });
})();
