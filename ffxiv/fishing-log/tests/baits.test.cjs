const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {D,open}=require('./helpers.cjs');
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../bait-data.js'),'utf8'),context);const B=context.window.FISHING_BAITS;
test('bait snapshot has valid vendors, costs and recipes, without mistaking folklore for tackle',()=>{
 const books=new Set(D.fishes.map(f=>f.folklore));assert.equal(B.revision,D.revisions.teamcraft);
 for(const [id,b] of Object.entries(B.baits)){assert.equal(D.related[id].fish,false);assert.ok(!books.has(+id));assert.ok(b.offers.length||b.recipes.length,`acquisition missing: ${id}`);for(const o of b.offers){assert.ok(B.vendors[o.npc].name);assert.ok(o.quantity>0);assert.ok(o.costs.every(c=>c.amount>0&&c.name));}for(const r of b.recipes)assert.ok(r.id>0&&r.level>0&&r.quantity>0);}
 assert.ok(B.baits[29717].offers.some(o=>o.npc===1005422&&o.costs.length===1&&o.costs[0].id===1&&o.costs[0].amount===300));
 assert.ok(!B.baits[2617].offers.length&&B.baits[2617].recipes.some(r=>r.job===11&&r.level===34));
});
test('primary/alternate/preparation baits open an icon and vendor dialog without collecting fish',()=>{
 const p=open({plan:true});try{
 p.$('#showPlanner').click();p.$('#planCollectionMode').click();p.$('#planSearch').value='멜토르 망둥이';p.$('#planRefresh').click();
 const before=p.storage.getItem('teo-ffxiv.fishing.collection.v2'),primary=p.$('.plan-bait [data-bait-detail]');assert.ok(primary);primary.click();
 assert.equal(p.$('#baitDialog').open,true);assert.equal(p.$('#baitTitle').textContent,D.related[primary.dataset.baitDetail].name);assert.ok(p.$('.bait-heading img').src.startsWith('https://'));assert.ok(p.$('.bait-offer a').href.includes('/db/ko/npc/'));
 p.$('[data-bait-close]').click();assert.equal(p.$('#baitDialog').open,false);assert.equal(p.d.activeElement,primary);
 p.$('.plan-versatile [data-bait-detail]').click();assert.equal(p.$('#baitTitle').textContent,'만능 루어');assert.match(p.$('.bait-offer').textContent,/300길/);p.$('[data-bait-close]').click();
 const alternate=p.$('.plan-alternate-bait [data-bait-detail]');if(alternate){alternate.click();assert.equal(p.$('#baitTitle').textContent,D.related[alternate.dataset.baitDetail].name);p.$('[data-bait-close]').click();}
 p.$('#planPrep [data-bait-detail]').click();assert.equal(p.$('#baitDialog').open,true);assert.equal(p.storage.getItem('teo-ffxiv.fishing.collection.v2'),before);
 }finally{p.close();}
});
test('mooch fish still open fish details, and craft-only bait displays its recipe',()=>{
 const p=open({plan:true});try{
 p.$('#showPlanner').click();p.$('#planSearch').value='홍룡';p.$('#planRefresh').click();const mooch=p.$('.plan-mooch [data-fish-detail="24214"]');assert.ok(mooch);mooch.click();assert.equal(p.$('#detailDialog').open,true);assert.equal(p.$('#baitDialog').open,false);p.$('#closeDetail').click();
 const button=p.d.createElement('button');button.dataset.baitDetail='2617';p.d.body.append(button);button.click();assert.equal(p.$('#baitTitle').textContent,'가라앉는 피라미');assert.match(p.$('.bait-craft').textContent,/보석공예가 Lv.34/);assert.ok(p.$('.bait-craft a').href.endsWith('/recipe/1443'));assert.ok(p.$('.bait-empty'));
 }finally{p.close();}
});
