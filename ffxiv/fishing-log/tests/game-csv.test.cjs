const test=require('node:test'),assert=require('node:assert/strict');
test('game CSV accepts both export formats and ignores type rows',async()=>{
 const {parseGameCsv}=await import('../scripts/game-csv.mjs');
 const header='#,Text,Item,IsInLog\r\n',row='1,"line one\nline two, quoted",4776,True\r\n';
 const old=parseGameCsv(header+row,['Item','IsInLog']);
 const current=parseGameCsv('\uFEFFkey,0,1,2\r\n'+header+'int32,str,Row,bit&02\r\n'+row,['Item','IsInLog']);
 assert.deepEqual(current,old);assert.equal(current[0].Item,'4776');assert.equal(current.length,1);
 assert.throws(()=>parseGameCsv('key,0\n#,Unknown\nint32,str\n1,x\n',['Item']));
 assert.throws(()=>parseGameCsv(header,['Item']));
});
