const {test}=require('node:test');
const assert=require('node:assert/strict');
const M=require('../music.js');
test('All 18 location/room arrangements generate bounded, non-silent 16-bit audio',()=>{
 const signatures=new Set();for(const location of Object.keys(M.themes))for(const room of ['exterior','interior','backroom']){const p=M.render(M.score(location,room));assert.equal(p.sampleRate,22050);assert.ok(p.duration>15&&p.duration<30);assert.ok(p.data.every(n=>Number.isFinite(n)&&Math.abs(n)<=.851));assert.ok(p.data.some(n=>Math.abs(n)>.05));signatures.add(p.data.slice(0,20000).reduce((s,n,i)=>s+n*(i%31),0).toFixed(5));}
 assert.equal(signatures.size,18);
});
test('Composition is deterministic and combat and epilogue arrangements differ',()=>{
 assert.deepEqual(M.render(M.score('bing')).data,M.render(M.score('bing')).data);
 assert.notEqual(M.score('bing','interior','combat').bpm,M.score('bing','interior').bpm);
 assert.notDeepEqual(M.render(M.score('bing','interior','ending')).data,M.render(M.score('bing','interior')).data);
});
test('Playback waits for consent, loops, changes scenes once and fades on mute',async()=>{
 const sources=[];let resumes=0;
 class AC{constructor(){this.currentTime=0;this.state='suspended';this.destination={};}async resume(){resumes++;this.state='running';}createGain(){return{gain:{value:0,setValueAtTime(){},linearRampToValueAtTime(){},cancelScheduledValues(){}},connect(){},disconnect(){}};}createBuffer(){return{copyToChannel(){}};}createBufferSource(){const s={connect(){},disconnect(){},start(){this.started=true;},stop(){this.stopped=true;}};sources.push(s);return s;}}
 const previous=global.AudioContext;global.AudioContext=AC;
 try{const music=M.create();music.select('bing','interior','explore');assert.equal(sources.length,0);assert.equal(await music.toggle(),true);assert.equal(resumes,1);assert.equal(sources[0].loop,true);music.select('bing','interior','explore');assert.equal(sources.length,1);music.select('church','interior','explore');assert.equal(sources.length,2);assert.ok(sources[0].stopped);assert.equal(await music.toggle(),false);assert.ok(sources[1].stopped);music.select('hotel','backroom','explore');assert.equal(sources.length,2);}finally{global.AudioContext=previous;}
});
test('Original title theme renders a distinct bounded shuffle loop',()=>{
 const config=M.score('title');assert.match(config.title,/Turnpike After Dark.*Title Theme/);assert.equal(config.groove,true);
 const pcm=M.render(config);assert.ok(pcm.data.every(n=>Number.isFinite(n)&&Math.abs(n)<=.851));assert.ok(pcm.data.some(n=>Math.abs(n)>.1));assert.ok(pcm.duration>20&&pcm.duration<25);assert.notDeepEqual(pcm.data,M.render(M.score('satriales')).data);
});
