(function(root) {
  'use strict';
  const name = value => String(value || '').replace(/^(?:[MITF]!)+/, '').trim();
  const key = value => name(value).normalize('NFKC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu, '');
  const alwaysVisible = row => String(row.TimeFrameDay ?? '').trim() === '' && name(row.FishTranslated || row.Fish).startsWith('유령');
  function dependencies(row) {
    if (Array.isArray(row.Dependencies)) return [...new Set(row.Dependencies.map(key))];
    const values = [];
    const html = row.Intuition || '';
    for (const match of html.matchAll(/src=["'][^"']*\/fish\/([^"']+)\.png["']/gi)) {
      values.push(decodeURIComponent(match[1]).replaceAll('_', "'"));
    }
    const bait = row.Bait || {};
    for (const value of [bait.BestBait || row.BestBait, bait.MoochType || row.BaitMoochType]) {
      if (value && /^M!/.test(value)) values.push(name(value));
    }
    for (const value of String(bait.MoochAlternatives || row.BaitMoochAlternatives || '').split('|')) {
      if (value.trim()) values.push(name(value));
    }
    return [...new Set(values.map(key))];
  }
  function createCatalog(rows) {
    const entries = new Map();
    for (const row of rows) {
      const id = key(row.Fish);
      if (!entries.has(id)) entries.set(id, { name: name(row.Fish), label: name(row.FishTranslated || row.Fish), dependencies: new Set() });
      for (const dep of dependencies(row)) if (dep !== id) entries.get(id).dependencies.add(dep);
    }
    return entries;
  }
  function haulScore(row, mode) {
    const raw = Array.isArray(row[mode]) ? row[mode][0] : row[mode];
    const counts = String(raw || (mode === 'DH' ? '3 - 4' : '5 - 7')).match(/\d+(?:\.\d+)?/g)?.map(Number) || [];
    const points = Number(row.Points) || 0;
    return { min: points * (counts[0] || 0), max: points * (counts.at(-1) || 0) };
  }
  function numberRange(value) {
    const raw = Array.isArray(value) ? value[0] : value;
    const match = String(raw ?? '').trim().match(/^(\d+(?:\.\d+)?)(?:\s*[-–]\s*(\d+(?:\.\d+)?))?$/);
    if (!match) return null;
    const min = Number(match[1]), max = Number(match[2] ?? match[1]);
    return min <= max ? { min, max } : null;
  }
  const present = value => !!String(value ?? '').trim() && !/^(null|undefined)$/i.test(String(value).trim());
  function biteTimeText(value) {
    const raw = String(value ?? '').trim();
    if (!present(raw)) return '시간 미확인';
    return raw.replace(/^~\s*/, '약 ').replace(/\s*[-–]\s*/g, '–').replace(/\+$/, '') + '초' + (raw.endsWith('+') ? ' 이상' : '');
  }
  function baitInfo(row) {
    const bait = row.Bait || {}, best = bait.BestBait ?? row.BestBait ?? '';
    const mooch = /^M!/.test(best);
    const standard = { ragworm: 'Ragworm', krill: 'Krill', plumpworm: 'PlumpWorm', versatilelure: 'VersatileLure' }[key(best)];
    const field = mooch ? 'Mooch' : standard || 'Special';
    const identity = mooch ? key(bait.MoochType || row.BaitMoochType || best) : key(best);
    const readTime = field => {
      const value = bait[field] ?? row['Bait' + field];
      return String((Array.isArray(value) ? value[0] : value) ?? '').trim();
    };
    const any = bait.Any === true || row.BaitAny === 'Yes';
    let rawTime = readTime(field);
    if (any) {
      const times = ['Ragworm', 'Krill', 'PlumpWorm'].map(readTime);
      // Only report a shared observed window. Do not fabricate an average across baits.
      rawTime = times.every(time => numberRange(time) && JSON.stringify(numberRange(time)) === JSON.stringify(numberRange(times[0]))) ? times[0] : '';
    }
    return { field, identity, any, label: any ? '기본 미끼 3종 모두 가능' : name(bait.BestBaitTranslated || row.BestBaitTranslated || best), rawTime, window: numberRange(rawTime) };
  }
  function targetHints(row, peers) {
    const bait = baitInfo(row), conditions = [];
    if (present(row.Intuition)) conditions.push('직감');
    if (bait.field === 'Mooch') conditions.push('생미끼');
    const overlaps = new Set();
    let unknown = !bait.window || !bait.identity || !present(row.Bite);
    for (const peer of peers) {
      if (key(peer.Fish) === key(row.Fish) || peer.Stop !== row.Stop || !!peer.TimeFrameDay !== !!row.TimeFrameDay || peer.Bite !== row.Bite) continue;
      if (bait.field === 'Mooch' && key(peer.Bait?.MoochType ?? peer.BaitMoochType) !== bait.identity) {
        const alternatives = String(peer.Bait?.MoochAlternatives ?? peer.BaitMoochAlternatives ?? '').split('|').map(key);
        if (alternatives.includes(bait.identity)) unknown = true;
        continue;
      }
      if (bait.field === 'Special' && key(peer.Bait?.SpecialType ?? peer.BaitSpecialType) !== bait.identity) continue;
      const raw = peer.Bait?.[bait.field] ?? peer['Bait' + bait.field];
      if (!present(Array.isArray(raw) ? raw[0] : raw)) { unknown = true; continue; }
      const window = numberRange(raw);
      if (!window) { unknown = true; continue; }
      if (bait.window && window.min <= bait.window.max && window.max >= bait.window.min) overlaps.add(name(peer.FishTranslated || peer.Fish));
    }
    return { ...bait, bite: row.Bite || '', conditions, overlaps: [...overlaps], unknown };
  }
  function recommend(rows, { gp = 700, objective = 'efficiency', allowTriple = true } = {}) {
    gp = Number(gp);
    if (!Number.isFinite(gp) || gp < 0) gp = 0;
    const burst = objective === 'burst';
    const metric = option => burst ? option.total.min : option.efficiency;
    const result = new Map(), pools = new Map();
    for (const row of rows) {
      const hints = targetHints(row, rows), base = Number(row.Points);
      const options = [];
      for (const [action, cost] of [['DH', 400], ...(allowTriple ? [['TH', 700]] : [])]) {
        // Missing CSV counts are replaced for display by the original site. Do not rank those guesses.
        if (row[action + 'Known'] === false || !Number.isFinite(base) || base <= 0) continue;
        const count = numberRange(row[action]);
        if (!count || count.min < 1 || !Number.isInteger(count.min) || !Number.isInteger(count.max)) continue;
        const total = { min: base * count.min, max: base * count.max };
        const extra = { min: total.min - base, max: total.max - base };
        options.push({ action, cost, count, total, extra, efficiency: extra.min / cost * 100, affordable: cost <= gp });
      }
      const affordable = options.filter(option => option.affordable && option.extra.min > 0)
        .sort((a, b) => metric(b) - metric(a) || a.cost - b.cost || b.total.min - a.total.min);
      const best = affordable[0] || null;
      const entry = { label: name(row.FishTranslated || row.Fish), hints, options, best, rank: null,
        conditional: hints.conditions.length > 0,
        reason: best ? '' : !options.length ? '수량 자료 없음' : !options.some(option => option.extra.min > 0) ? '일반 낚아채기로 GP 보존' : 'GP 부족 · 일반 낚아채기로 GP 보존' };
      result.set(row, entry);
      if (!best) continue;
      const pool = JSON.stringify([row.Stop || '', !!row.TimeFrameDay, entry.conditional]);
      if (!pools.has(pool)) pools.set(pool, []);
      pools.get(pool).push(entry);
    }
    for (const candidates of pools.values()) {
      candidates.sort((a, b) => metric(b.best) - metric(a.best) || a.label.localeCompare(b.label, 'ko'));
      candidates.forEach((entry, index) => {
        entry.rank = index && Math.abs(metric(entry.best) - metric(candidates[index - 1].best)) < 1e-9 ? candidates[index - 1].rank : index + 1;
      });
    }
    return result;
  }
  function plan(rows, catalog, caught, hideCaught, species = '', scoreMode = '', strategy = null) {
    const groupFiltering = Array.isArray(species) || !!species;
    const selectedGroups = new Set(Array.isArray(species) ? species : species ? [species] : []);
    const scoring = ['DH', 'TH'].includes(scoreMode);
    const recommendations = scoring && strategy ? recommend(rows, { ...strategy, allowTriple: scoreMode === 'TH' }) : null;
    const scoreTargets = new Set();
    if (scoring) {
      // Older callers can still request the original haul-only comparison.
      if (recommendations) {
        for (const [row, entry] of recommendations) if (entry.rank && entry.rank <= 3) scoreTargets.add(key(row.Fish));
      } else {
        for (const spectral of [false, true]) {
          const candidates = rows.filter(row => !!row.TimeFrameDay === spectral && haulScore(row, scoreMode).min > 0)
            .sort((a, b) => haulScore(b, scoreMode).min - haulScore(a, scoreMode).min);
          const threshold = candidates.length ? haulScore(candidates[Math.min(2, candidates.length - 1)], scoreMode).min : Infinity;
          for (const row of candidates) if (haulScore(row, scoreMode).min >= threshold) scoreTargets.add(key(row.Fish));
        }
      }
    }
    const focused = groupFiltering || scoring;
    const matchesGroup = row => scoring ? scoreTargets.has(key(row.Fish)) : selectedGroups.has(row.Species);
    const reasons = new Map();
    for (const target of rows) {
      const targetId = key(target.Fish);
      if (focused ? !matchesGroup(target) : caught(target.Fish)) continue;
      const visited = new Set([targetId]);
      function walk(id) {
        for (const dep of catalog.get(id)?.dependencies || []) {
          if (visited.has(dep)) continue;
          visited.add(dep);
          if (!reasons.has(dep)) reasons.set(dep, new Set());
          reasons.get(dep).add(catalog.get(targetId)?.label || name(target.Fish));
          walk(dep);
        }
      }
      walk(targetId);
    }
    return rows.filter(row => scoring || alwaysVisible(row) || reasons.has(key(row.Fish)) || (focused ? matchesGroup(row) : !hideCaught || !caught(row.Fish))).map(row => ({
      ...row, LocalRecommendation: recommendations?.get(row) || null, LocalScore: scoring && matchesGroup(row) ? (recommendations?.get(row)?.best?.total || haulScore(row, scoreMode)) : null, LocalGroupMatch: groupFiltering && matchesGroup(row), LocalGroupDependency: focused && !matchesGroup(row) && reasons.has(key(row.Fish)), LocalAlwaysVisible: alwaysVisible(row), LocalCaught: caught(row.Fish), LocalRequiredBy: [...(reasons.get(key(row.Fish)) || [])]
    }));
  }
  function read(storage) {
    try { const data = JSON.parse(storage.getItem('caughtFishLS-combined') || '{}'); return { indigo: data.indigo || {}, ruby: data.ruby || {} }; }
    catch { return { indigo: {}, ruby: {} }; }
  }
  function routeAchievements(rows, stops) {
    if (!Array.isArray(stops) || stops.length !== 3 || stops.some(stop => !stop.stop || !['Day', 'Sunset', 'Night'].includes(stop.time))) return [];
    const groupsByStop = stops.map(stop => {
      const groups = new Map();
      // The original route configuration abbreviates the CSV's Bloodbrine stop.
      const stopName = stop.stop === 'Blood' ? 'Bloodbrine' : stop.stop;
      for (const row of rows) {
        if (row.Stop !== stopName || !present(row.Species)) continue;
        const spectral = present(row.TimeFrameDay);
        if (spectral && row['TimeFrame' + stop.time] !== 'Yes') continue;
        if (!groups.has(row.Species)) groups.set(row.Species, { label: row.SpeciesTranslated || row.Species, regular: false, spectral: false });
        groups.get(row.Species)[spectral ? 'spectral' : 'regular'] = true;
      }
      return groups;
    });
    return [...groupsByStop[0]].filter(([id]) => groupsByStop.every(groups => groups.has(id))).map(([id, group]) => {
      const appearances = groupsByStop.map((groups, index) => ({ ...stops[index], ...groups.get(id) }));
      return { id, label: group.label, stops: appearances, requiresSpectral: appearances.some(stop => !stop.regular) };
    }).sort((a, b) => a.label.localeCompare(b.label, 'ko'));
  }
  function caught(state, route, fish) {
    const id = key(fish);
    return Object.entries(state[route] || {}).some(([entry, value]) => value === true && key(entry.split('|')[0]) === id);
  }
  function setCaught(storage, route, fish, value) {
    const state = read(storage), id = key(fish);
    for (const entry of Object.keys(state[route])) if (key(entry.split('|')[0]) === id) state[route][entry] = value;
    state[route][name(fish)] = value;
    storage.setItem('caughtFishLS-combined', JSON.stringify(state));
    return state;
  }
  function parseImport(text) {
    const data = JSON.parse(String(text).replace(/^\uFEFF/, ''));
    const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
    if (!object(data) || !['indigo', 'ruby'].some(route => Object.hasOwn(data, route))) throw new Error('체크리스트 JSON 형식이 아니에요.');
    const result = { indigo: {}, ruby: {} };
    for (const route of ['indigo', 'ruby']) {
      if (!Object.hasOwn(data, route)) continue;
      if (!object(data[route])) throw new Error('항로별 기록 형식이 올바르지 않아요.');
      for (const [fish, value] of Object.entries(data[route])) {
        if (typeof value !== 'boolean' || !key(fish.split('|')[0]) || fish.length > 1000 || ['__proto__', 'prototype', 'constructor'].includes(fish)) throw new Error('물고기 체크 기록 형식이 올바르지 않아요.');
        result[route][fish] = value;
      }
    }
    return result;
  }
  function importTeamcraft(storage, ids, idMap) {
    if (!Array.isArray(ids) || ids.some(id => !Number.isSafeInteger(id) || id <= 0)) throw new Error('Teamcraft 기록은 양의 정수 ID 배열이어야 해요. 예: [29717, 29718]');
    const unique = [...new Set(ids)], state = read(storage);
    let imported = 0, added = 0, ignored = 0;
    const matched = [];
    for (const id of unique) {
      const entries = idMap?.[id];
      if (!entries?.length) { ignored++; continue; }
      for (const entry of entries) {
        if (!caught(state, entry.route, entry.name)) added++;
        state[entry.route][entry.name] = true;
        imported++;
        matched.push({id, route: entry.route, name: entry.name, label: entry.label});
      }
    }
    // No matching fish: leave the user's saved data byte-for-byte unchanged.
    if (imported) storage.setItem('caughtFishLS-combined', JSON.stringify(state));
    return {state, imported, added, ignored, duplicates: ids.length - unique.length, matched, format: 'teamcraft'};
  }
  function importCaught(storage, text, idMap = root.OceanTeamcraftIds) {
    const input = JSON.parse(String(text).replace(/^\uFEFF/, ''));
    if (Array.isArray(input)) return importTeamcraft(storage, input, idMap);
    if (input && Object.hasOwn(input, 'completed')) return importTeamcraft(storage, input.completed, idMap);
    const incoming = parseImport(text);
    const state = read(storage);
    let imported = 0;
    for (const route of ['indigo', 'ruby']) {
      const seen = new Set();
      for (const [fish, value] of Object.entries(incoming[route])) {
        if (!value) continue;
        // Original exports use both fish names and fish|location|time|bait keys.
        state[route][fish] = true;
        const id = key(fish.split('|')[0]);
        if (!seen.has(id)) { seen.add(id); imported++; }
      }
    }
    storage.setItem('caughtFishLS-combined', JSON.stringify(state));
    return { state, imported };
  }
  function exportTeamcraft(storage, idMap = root.OceanTeamcraftIds) {
    const state = read(storage);
    const completed = Object.entries(idMap || {})
      .filter(([, entries]) => entries.some(entry => caught(state, entry.route, entry.name)))
      .map(([id]) => Number(id)).sort((a, b) => a - b);
    return { completed };
  }
  const api = { name, key, alwaysVisible, haulScore, numberRange, baitInfo, biteTimeText, recommend, dependencies, createCatalog, plan, routeAchievements, read, caught, setCaught, parseImport, importCaught, importTeamcraft, exportTeamcraft };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.OceanCollection = api;
})(typeof window === 'undefined' ? globalThis : window);
