const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{JSDOM}=require('jsdom');
const {D,open}=require('./helpers.cjs'),root=path.resolve(__dirname,'..'),context={window:{}};
for(const file of ['map-data.js','map-preview.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),context);
const {point,position}=context.window.FishingSpotMaps,{maps,revision}=context.window.FISHING_MAPS;
test('every fishing spot has a matching map and valid scale-aware pin, including city and 95% maps',()=>{
 assert.equal(revision,D.revisions.teamcraft);assert.equal(Object.keys(maps).length,65);
 for(const s of Object.values(D.spots)){assert.ok(maps[s.map],s.key);assert.ok(point(s.coords,maps[s.map].sizeFactor),s.key);assert.match(maps[s.map].image,/^https:\/\/v2\.xivapi\.com\/api\/asset\/map\//);}
 for(const scale of [95,100,180,200,400]){const p=point({x:1+2050/scale,y:1+2050/scale},scale);assert.ok(Math.abs(p.x-50)<1e-10);assert.ok(Math.abs(p.y-50)<1e-10);}
 assert.equal(point({x:43,y:20},100),null);assert.equal(point(null,100),null);assert.equal(point({x:10,y:10},undefined),null);
});
test('map preview stays in the viewport at every edge on desktop, mobile and short landscape screens',()=>{
 for(const [vw,vh,width,height] of [[1280,720,360,470],[390,844,360,470],[360,640,336,450],[844,390,360,350]]){
  for(const rect of [{left:0,right:100,top:0,bottom:24},{left:vw-100,right:vw,top:vh-24,bottom:vh},{left:vw/2-60,right:vw/2+60,top:vh/2,bottom:vh/2+24}]){
   const p=position(rect,width,height,vw,vh);assert.ok(p.left>=12&&p.top>=12);assert.ok(p.left+width<=vw-12);assert.ok(p.top+height<=vh-12);
  }
 }
});
function setup(){
 const dom=new JSDOM('<div id="fishingPlanner"><div id="planResults"><a data-spot-map="rod:2" href="https://ffxivteamcraft.com/db/ko/fishing-spot/2">잎맥 물줄기</a><button data-spot-map="rod:2">지도</button><button data-spot-map="rod:3">거울못</button></div></div><button id="outside">다른 작업</button>',{url:'https://example.com',runScripts:'outside-only'}),w=dom.window,d=w.document;
 w.eval(fs.readFileSync(path.join(root,'map-preview.js'),'utf8'));w.FishingSpotMaps.mount({data:D,maps});
 const $=s=>d.querySelector(s),event=(target,type,options={})=>target.dispatchEvent(new w.MouseEvent(type,{bubbles:true,...options}));
 return {w,d,$,event,close:()=>w.close()};
}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
test('hover loads only the requested map, allows moving onto it, and dismisses on leave',async()=>{
 const p=setup();try{
  assert.equal(p.$('#fishingSpotMap img'),null);p.event(p.$('a'),'pointerover');await pause(210);
  const panel=p.$('#fishingSpotMap');assert.equal(panel.hidden,false);assert.equal(panel.querySelector('img').src,maps[D.spots['rod:2'].map].image);
  p.event(p.$('a'),'pointerout',{relatedTarget:panel});p.event(panel,'pointerover',{relatedTarget:p.$('a')});await pause(210);assert.equal(panel.hidden,false);
  p.event(panel,'pointerout',{relatedTarget:p.$('#outside')});await pause(210);assert.equal(panel.hidden,true);
 }finally{p.close();}
});
test('tap pins the map, image failures keep coordinates and links, and Escape returns focus without reopening',async()=>{
 const p=setup();try{
  const button=p.$('button[data-spot-map]');button.click();const panel=p.$('#fishingSpotMap');assert.equal(panel.hidden,false);assert.equal(button.getAttribute('aria-expanded'),'true');
  p.event(button,'pointerout',{relatedTarget:p.$('#outside')});await pause(210);assert.equal(panel.hidden,false);
  panel.querySelector('img').dispatchEvent(new p.w.Event('error'));assert.equal(panel.querySelector('[data-map-state]').dataset.mapState,'error');assert.match(panel.textContent,/X:22.9 · Y:22.2/);assert.ok(panel.querySelector('a[href$="/2"]'));
  p.d.activeElement.dispatchEvent(new p.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));assert.equal(panel.hidden,true);assert.equal(button.getAttribute('aria-expanded'),'false');assert.equal(p.d.activeElement,button);
  await pause(210);assert.equal(panel.hidden,true);
 }finally{p.close();}
});
test('pointer-induced focus waits for the completed tap before showing a map over the touch target',()=>{
 const p=setup();try{
  const button=p.$('button[data-spot-map]');p.event(button,'pointerdown');button.focus();assert.equal(p.$('#fishingSpotMap').hidden,true);
  p.event(button,'pointerup');button.click();assert.equal(p.$('#fishingSpotMap').hidden,false);assert.equal(button.getAttribute('aria-expanded'),'true');
 }finally{p.close();}
});
test('late image responses cannot change a new spot and replaced rows or hidden planner close the preview',async()=>{
 const p=setup();try{
  const buttons=p.d.querySelectorAll('button[data-spot-map]');buttons[0].click();const old=p.$('#fishingSpotMap img');buttons[1].click();
  old.dispatchEvent(new p.w.Event('load'));assert.equal(p.$('[data-map-state]').dataset.mapState,'loading');assert.match(p.$('#spotMapTitle').textContent,/거울못/);
  p.$('#fishingSpotMap img').dispatchEvent(new p.w.Event('load'));assert.equal(p.$('[data-map-state]').dataset.mapState,'ready');
  p.$('#fishingPlanner').hidden=true;await pause(0);assert.equal(p.$('#fishingSpotMap').hidden,true);
  p.$('#fishingPlanner').hidden=false;buttons[0].click();p.$('#planResults').replaceChildren();await pause(0);assert.equal(p.$('#fishingSpotMap').hidden,true);
 }finally{p.close();}
});
test('queued focus scroll does not immediately close the map, but moving the anchor does',()=>{
 const p=setup();try{
  const button=p.$('button[data-spot-map]');p.event(button,'focusin');p.w.dispatchEvent(new p.w.Event('scroll'));assert.equal(p.$('#fishingSpotMap').hidden,false);
  button.getBoundingClientRect=()=>({left:0,right:100,top:50,bottom:74});p.w.dispatchEvent(new p.w.Event('scroll'));assert.equal(p.$('#fishingSpotMap').hidden,true);
 }finally{p.close();}
});
test('pinned map survives focus scrolling and viewport adjustments',()=>{
 const p=setup();try{
  const button=p.$('button[data-spot-map]');button.click();const img=p.$('#fishingSpotMap img');button.getBoundingClientRect=()=>({left:0,right:100,top:50,bottom:74});
  p.w.dispatchEvent(new p.w.Event('scroll'));p.w.dispatchEvent(new p.w.Event('resize'));assert.equal(p.$('#fishingSpotMap').hidden,false);assert.equal(p.$('#fishingSpotMap img'),img);
 }finally{p.close();}
});
test('forecast redraw preserves a pinned map for the same fish and spot without fetching the image again',async()=>{
 const p=setup();try{
  const button=p.$('button[data-spot-map]');button.dataset.mapOwner='5001';button.click();const img=p.$('#fishingSpotMap img'),replacement=button.cloneNode(true);
  button.replaceWith(replacement);await pause(0);assert.equal(p.$('#fishingSpotMap').hidden,false);assert.equal(p.$('#fishingSpotMap img'),img);assert.equal(replacement.getAttribute('aria-expanded'),'true');
  const other=replacement.cloneNode(true);other.dataset.mapOwner='5002';replacement.replaceWith(other);await pause(0);assert.equal(p.$('#fishingSpotMap').hidden,true);
 }finally{p.close();}
});
test('real planner exposes map previews for the displayed route independently of the spot filter',()=>{
 const p=open({plan:true});try{
  p.$('#showPlanner').click();const button=p.$('.plan-spot-coords'),key=button.dataset.spotMap,link=p.$('.plan-spot-link');assert.equal(link.dataset.spotMap,key);
  button.click();assert.equal(p.$('#fishingSpotMap').hidden,false);assert.equal(p.$('#spotMapTitle').textContent,D.spots[key].name);assert.equal(p.$('#planActiveFilters').hidden,true);
  assert.equal(p.$('#fishingSpotMap a').href,link.href);p.$('.plan-spot-filter').click();assert.equal(p.$('#fishingSpotMap').hidden,true);assert.equal(p.$('#planActiveFilters').hidden,false);
 }finally{p.close();}
});
