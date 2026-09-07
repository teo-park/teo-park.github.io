(function(root) {
  'use strict';
  const name = value => String(value || '').replace(/^(?:[MITF]!)+/, '').trim();
  const key = value => name(value).normalize('NFKC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu, '');
  const alwaysVisible = row => String(row.TimeFrameDay ?? '').trim() === '' && name(row.FishTranslated || row.Fish).startsWith('유령');
  function dependencies(row) {
    const values = [];
    const html = row.Intuition || '';
    for (const match of html.matchAll(/src=["'][^"']*\/fish\/([^"']+)\.png["']/gi)) {
      values.push(decodeURIComponent(match[1]).replaceAll('_', "'"));
    }
    const bait = row.Bait || {};
    for (const value of [bait.BestBait || row.BestBait, bait.MoochType || row.BaitMoochType]) {
      if (value && /^M!/.test(value)) values.push(name(value));
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
  function plan(rows, catalog, caught, hideCaught, species = '', scoreMode = '') {
    const scoring = ['DH', 'TH'].includes(scoreMode);
    const scoreTargets = new Set();
    if (scoring) {
      // Rank each regular/spectral zone separately, using the minimum haul score.
      for (const spectral of [false, true]) {
        const candidates = rows.filter(row => !!row.TimeFrameDay === spectral && haulScore(row, scoreMode).min > 0)
          .sort((a, b) => haulScore(b, scoreMode).min - haulScore(a, scoreMode).min);
        const threshold = candidates.length ? haulScore(candidates[Math.min(2, candidates.length - 1)], scoreMode).min : Infinity;
        for (const row of candidates) if (haulScore(row, scoreMode).min >= threshold) scoreTargets.add(key(row.Fish));
      }
    }
    const focused = !!species || scoring;
    const matchesGroup = row => scoring ? scoreTargets.has(key(row.Fish)) : row.Species === species;
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
    return rows.filter(row => alwaysVisible(row) || reasons.has(key(row.Fish)) || (focused ? matchesGroup(row) : !hideCaught || !caught(row.Fish))).map(row => ({
      ...row, LocalScore: scoring && matchesGroup(row) ? haulScore(row, scoreMode) : null, LocalGroupMatch: !!species && matchesGroup(row), LocalGroupDependency: focused && !matchesGroup(row) && reasons.has(key(row.Fish)), LocalAlwaysVisible: alwaysVisible(row), LocalCaught: caught(row.Fish), LocalRequiredBy: [...(reasons.get(key(row.Fish)) || [])]
    }));
  }
  function read(storage) {
    try { const data = JSON.parse(storage.getItem('caughtFishLS-combined') || '{}'); return { indigo: data.indigo || {}, ruby: data.ruby || {} }; }
    catch { return { indigo: {}, ruby: {} }; }
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
  function importCaught(storage, text) {
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
  const api = { name, key, alwaysVisible, haulScore, dependencies, createCatalog, plan, read, caught, setCaught, parseImport, importCaught };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.OceanCollection = api;
})(typeof window === 'undefined' ? globalThis : window);
