(() => {
  const api = window.OceanCollection;
  let undoTimer;
  const storageGet = key => { try { return localStorage.getItem(key); } catch { return null; } };
  function preserveScroll(action) {
    const x = window.scrollX, y = window.scrollY;
    action();
    window.scrollTo(x, y);
  }
  function notice(text, undo) {
    let box = document.getElementById('actionNotice');
    if (!box) {
      box = document.createElement('div'); box.id = 'actionNotice'; box.className = 'action-notice';
      const message = document.createElement('span'); message.id = 'actionMessage'; message.setAttribute('role', 'status');
      const button = document.createElement('button'); button.id = 'undoCatch'; button.type = 'button'; button.className = 'btn btn-light'; button.textContent = '실행 취소';
      const close = document.createElement('button'); close.type = 'button'; close.className = 'btn btn-light'; close.textContent = '닫기'; close.onclick = () => { box.hidden = true; };
      box.append(message, button, close); document.body.append(box);
    }
    clearTimeout(undoTimer); box.hidden = false;
    document.getElementById('actionMessage').textContent = text;
    const button = document.getElementById('undoCatch'); button.hidden = !undo;
    button.onclick = () => {
      try { preserveScroll(undo); notice('체크 변경을 되돌렸어요.'); }
      catch { notice('저장하지 못했어요. 다시 시도해 주세요.'); }
    };
    // Leave the action available while the user is interacting with it.
    undoTimer = setTimeout(() => { if (!box.contains(document.activeElement)) box.hidden = true; }, 12000);
  }
  function catchChanged(route, fish, previous, next, label, refresh) {
    notice(`${label} · ${next ? '잡음 처리' : '잡음 해제'}`, () => {
      api.setCaught(localStorage, route, fish, previous);
      refresh();
    });
  }
  function updateBackupLabel() {
    const last = storageGet('ocean:last-export');
    const date = last ? new Date(last) : null;
    document.querySelectorAll('[data-backup-status]').forEach(el => {
      el.textContent = date && !Number.isNaN(date.getTime()) ? '마지막 내보내기: ' + date.toLocaleString('ko-KR') : '아직 내보낸 기록이 없어요.';
    });
  }
  function exportRecords() {
    const blob = new Blob([JSON.stringify(api.read(localStorage), null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = 'checklist-export.json'; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    try { localStorage.setItem('ocean:last-export', new Date().toISOString()); } catch {}
    updateBackupLabel();
  }
  const normalize = text => String(text).normalize('NFKC').toLowerCase().replace(/\s/g, '');
  function matchesName(name, query) {
    const initials = [...String(name)].map(c => {
      const n = c.charCodeAt(0) - 0xac00;
      return n >= 0 && n < 11172 ? 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'[Math.floor(n / 588)] : c;
    }).join('');
    return normalize(name).includes(normalize(query)) || normalize(initials).includes(normalize(query));
  }
  function importMessage(result) {
    if (result.format !== 'teamcraft') return `${result.imported}종의 잡은 기록을 합쳤어요. 기존 기록도 유지했어요.`;
    const message = result.imported ? `먼바다 ${result.imported}종 확인 · 새로 ${result.added}종 반영 · 이미 잡음 ${result.imported - result.added}종.` : '일치하는 먼바다 물고기가 없어요. 기존 기록은 그대로예요.';
    return message + ` 대상 외·미지원 ID ${result.ignored}개 제외` + (result.duplicates ? ` · 중복 ${result.duplicates}개 제외` : '') + '.';
  }
  document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector('.record-content');
    if (!content) return;
    const form = document.createElement('div'); form.className = 'teamcraft-import';
    form.innerHTML = '<label for="teamcraftImportText">Teamcraft 기록 붙여넣기</label><p><a href="https://ffxivteamcraft.com/log-tracker/FSH" target="_blank" rel="noopener noreferrer">Teamcraft 어류도감</a>에서 내보낸 숫자 배열을 붙여넣으세요. 먼바다 물고기만 반영해요.</p><textarea id="teamcraftImportText" class="form-control" rows="3" maxlength="2097152" placeholder="[29717, 29718, …]" spellcheck="false"></textarea><button id="importTeamcraftText" type="button" class="btn btn-outline-primary">붙여넣은 기록 가져오기</button><p id="teamcraftImportStatus" role="status" aria-live="polite"></p>';
    content.append(form);
    const output = document.createElement('div'); output.className = 'teamcraft-import';
    output.innerHTML = '<strong>Teamcraft로 기록 옮기기</strong><p>근해·원양에서 잡음 체크한 물고기를 함께 내보내요. Teamcraft 어류도감의 <b>CarbunclePlushy에서 가져오기 (Import from CarbunclePlushy)</b> 메뉴에 붙여넣으세요.</p><p>잡은 기록만 추가해요. 여기서 체크를 해제해도 Teamcraft의 기존 기록은 지워지지 않아요.</p><button id="exportTeamcraftText" type="button" class="btn btn-outline-primary mt-2">Teamcraft용 기록 복사</button><div id="teamcraftExportResult" hidden><label for="teamcraftExportText">Teamcraft에 붙여넣을 기록</label><textarea id="teamcraftExportText" class="form-control" rows="3" readonly spellcheck="false"></textarea></div><p id="teamcraftExportStatus" role="status" aria-live="polite"></p>';
    content.append(output);
    document.getElementById('exportTeamcraftText').addEventListener('click', async () => {
      const payload = api.exportTeamcraft(localStorage);
      const text = JSON.stringify(payload);
      const field = document.getElementById('teamcraftExportText');
      const status = document.getElementById('teamcraftExportStatus');
      document.getElementById('teamcraftExportResult').hidden = false;
      field.value = text;
      if (!payload.completed.length) {
        status.textContent = '아직 잡음 체크한 먼바다 물고기가 없어요.';
        return;
      }
      try {
        await navigator.clipboard.writeText(text);
        status.textContent = `먼바다 ${payload.completed.length}종을 복사했어요. Teamcraft의 가져오기 창에 붙여넣으세요.`;
      } catch {
        field.focus(); field.select();
        status.textContent = `먼바다 ${payload.completed.length}종 준비 완료. 자동 복사가 안 되면 선택된 내용을 Ctrl+C 또는 길게 눌러 복사하세요.`;
      }
    });
    document.getElementById('importTeamcraftText').addEventListener('click', () => {
      const text = document.getElementById('teamcraftImportText').value.trim();
      const status = document.getElementById('teamcraftImportStatus');
      try {
        if (!text) throw new Error('복사한 JSON 배열을 먼저 붙여넣어 주세요.');
        const result = api.importCaught(localStorage, text);
        document.dispatchEvent(new Event('ocean-records-imported'));
        status.textContent = importMessage(result); notice(status.textContent);
      } catch (error) {
        status.textContent = '가져오지 못했어요. ' + (error instanceof SyntaxError ? '복사한 JSON 배열 전체를 붙여넣어 주세요.' : error.message);
      }
    });
  });
  window.OceanUX = {preserveScroll, catchChanged, notice, updateBackupLabel, exportRecords, matchesName, importMessage};
  document.addEventListener('DOMContentLoaded', updateBackupLabel);
})();
