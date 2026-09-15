const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {open,memory}=require('./helpers.cjs');
const context={window:{},document:{},Intl};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../planner.js'),'utf8'),context);
const compare=context.window.FishingPlanner.compareRows;
const row=(order,start,nextStart,extras={})=>({fish:{order},start,nextStart,...extras});
test('secondary criterion only breaks primary ties and compares the actual next opening',()=>{
 const rows=[row(1,100,700,{nextGap:600}),row(2,100,900,{nextGap:100}),row(3,90,200),row(4,null,null),row(5,100,null)];
 assert.deepEqual(rows.slice().sort((a,b)=>compare(a,b,'soon','rare')).map(r=>r.fish.order),[3,2,1,5,4]);
 assert.deepEqual(rows.slice().sort((a,b)=>compare(a,b,'rare','soon')).map(r=>r.fish.order),[2,1,3,5,4]);
 assert.deepEqual(rows.slice().sort((a,b)=>compare(a,b,'book','rare')).map(r=>r.fish.order),[1,2,3,4,5]);
 assert.equal(compare(row(1,null,null),row(2,null,null),'soon','rare'),-1);
 assert.ok(compare(row(1,100,null,{always:true}),row(2,200,300),'soon','rare')>0);
 assert.ok(compare(row(1,100,null,{always:true}),row(2,200,300),'soon','rare','collection')<0);
});
test('planner opens first with big fish and only additional controls are collapsed',()=>{
 const p=open({plan:true});try{
 assert.equal(p.$('#fishingPlanner').hidden,false);assert.equal(p.$('#collectionPanel').hidden,true);assert.equal(p.$('#showPlanner').getAttribute('aria-pressed'),'true');assert.equal(p.$('#planBigMode').getAttribute('aria-pressed'),'true');
 assert.equal(p.$('#planOptions').open,false);
 for(const id of ['planExpansions','planStatus','planRegion','planRarity','planAvailability','planSort','planSortSecondary'])assert.equal(p.$('#'+id).closest('details'),null,id);
 for(const id of ['planSearch','notificationScope','playtimeOn','planLead'])assert.ok(p.$('#planOptions').contains(p.$('#'+id)),id);
 p.$('#planOptions').open=true;p.$('#planSearch').value='잘레라';p.$('#planRefresh').click();const before=p.$('#planCount').textContent;
 p.$('#planOptions').open=false;assert.equal(p.$('#planSearch').value,'잘레라');assert.equal(p.$('#planCount').textContent,before);
 p.$('#showBook').click();assert.equal(p.$('#collectionPanel').hidden,false);
 }finally{p.close();}
});
test('sort choices survive reload without enabling notifications and duplicate criteria are prevented',()=>{
 const storage=memory();let p=open({plan:true,storage});try{
 assert.equal(p.$('#planSort').value,'soon');assert.equal(p.$('#planSortSecondary').value,'rare');
 p.change('#planSort','rare');assert.equal(p.$('#planSortSecondary').value,'none');assert.equal(p.$('#planSortSecondary option[value="rare"]').disabled,true);
 p.change('#planSortSecondary','soon');assert.equal(p.planSnapshot().saved,false);
 p.close();p=open({plan:true,storage});assert.equal(p.$('#planSort').value,'rare');assert.equal(p.$('#planSortSecondary').value,'soon');assert.equal(p.planSnapshot().saved,false);
 }finally{p.close();}
});
