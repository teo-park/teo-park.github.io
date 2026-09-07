// Journal's own scheduler. Route order/time slots are game facts, not imported code.
(function(root) {
  'use strict';
  const HOUR = 3600000, DAY = 24 * HOUR, INTERVAL = 2 * HOUR;
  const REFERENCE_DAY = Date.UTC(2026, 8, 6, 15); // 2026-09-07 00:00 KST
  const config = {
    indigo:{count:12,cycle:[7,10,1,4,8,11,2,5,9,12,3,6],phase:6,
      paths:[['Southern','Galadion','Northern'],['Galadion','Southern','Rhotano'],['Cieldalaes','Northern','Bloodbrine'],['Cieldalaes','Rhotano','Rothlyt']],
      times:[['Night','Day','Sunset'],['Day','Sunset','Night'],['Sunset','Night','Day']]},
    ruby:{count:9,cycle:[1,2,1,3,4,5,4,6,7,8,7,9],phase:10,
      paths:[['Unnamed','Sirensong','Thavnair'],['Sirensong','Kugane','One River'],['Sirensong','Kugane','Ruby Sea']],
      times:[['Sunset','Night','Day'],['Night','Day','Sunset'],['Day','Sunset','Night']]}
  };
  const names={Galadion:'갈라디온 만',Southern:'멜토르 해협 남쪽',Northern:'멜토르 해협 북쪽',Rhotano:'로타노 해',Cieldalaes:'시엘달레 제도',Bloodbrine:'붉은물결 바다',Rothlyt:'로들리트 만',Sirensong:'세이렌 해',Kugane:'쿠가네','Ruby Sea':'홍옥해','One River':'무이강',Unnamed:'이름 없는 섬',Thavnair:'사베니어 섬'};
  const periods={Day:'낮',Sunset:'노을',Night:'밤'};
  const mod=(n,m)=>(n%m+m)%m;
  function stops(route, number) {
    const c=config[route]; if(!c || !Number.isInteger(number) || number<1 || number>c.count) return [];
    const index=number-1, path=route==='indigo'?Math.floor(index/3):index%3, time=route==='indigo'?index%3:Math.floor(index/3);
    return c.paths[path].map((stop,i)=>({stop,name:names[stop],time:c.times[time][i]}));
  }
  function at(route, timestamp) {
    if (!config[route] || !Number.isFinite(timestamp)) throw Error('Invalid voyage request');
    const c=config[route], elapsed=timestamp-REFERENCE_DAY, day=Math.floor(elapsed/DAY), slot=Math.floor((mod(elapsed,DAY)-HOUR)/INTERVAL);
    // Twelve departures per KST day, with one extra cycle step at the day boundary.
    const number=c.cycle[mod(day*13+slot+c.phase,12)];
    return {route,number,start:timestamp,close:timestamp+15*60000,stops:stops(route,number)};
  }
  function upcoming(route, now=Date.now(), count=12) {
    const origin=REFERENCE_DAY+HOUR;
    let first=origin+Math.floor((now-origin)/INTERVAL)*INTERVAL;
    if(now>=first+15*60000) first+=INTERVAL;
    return Array.from({length:Math.max(0,Math.min(144,count))},(_,i)=>at(route,first+i*INTERVAL));
  }
  function available(fish, voyage, stopIndex) {
    const stop=voyage.stops[stopIndex];
    return !!stop && fish.Stop===stop.stop && (!fish.spectral || fish['TimeFrame'+stop.time]==='Yes');
  }
  const api={at,upcoming,stops,available,names,periods,INTERVAL};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.JournalVoyages=api;
})(typeof window==='undefined'?globalThis:window);
