const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const G=require('../engine.js');
const sandbox={};sandbox.window=sandbox;
vm.runInNewContext(fs.readFileSync(require.resolve('../graphics.js'),'utf8'),sandbox);
const art=sandbox.CharacterArt;
function render(id,options){
 const commands=[];
 const c=new Proxy({}, {get:(_,method)=>(...args)=>{for(const arg of args)if(typeof arg==='number')assert.ok(Number.isFinite(arg),`${id}: ${method}`);commands.push([method,...args]);},set:(_,key,value)=>{commands.push([key,value]);return true;}});
 art.draw(c,50,70,id,options);return commands;
}
test('All story and background characters render with finite geometry',()=>{for(const id of ['player',...Object.keys(G.people)])assert.ok(render(id,{time:7,moving:true}).length>50,id);});
test('Walking and idle cycles animate, while reduced motion produces stable sprites',()=>{
 assert.notDeepEqual(render('player',{time:0,moving:true}),render('player',{time:.15,moving:true}));
 assert.notDeepEqual(render('tony',{time:0}),render('tony',{time:1}));
 assert.deepEqual(render('player',{time:0,moving:true,reducedMotion:true}),render('player',{time:9,moving:true,reducedMotion:true}));
});
test('Facing direction mirrors artwork without changing its anchor',()=>{
 const left=render('player',{facing:-1}),right=render('player',{facing:1});
 assert.deepEqual(left.find(x=>x[0]==='translate'),right.find(x=>x[0]==='translate'));
 assert.deepEqual(left.find(x=>x[0]==='scale'),['scale',-1,1]);
});
test('High-resolution cast closeups render distinct artwork with finite geometry',()=>{
 const signatures=new Set();for(const id of ['tony','paulie','silvio','chris','artie','player','anna','enforcer']){const commands=[];const c=new Proxy({createLinearGradient:()=>({addColorStop(){}})},{get:(t,k)=>t[k]||((...args)=>{for(const n of args)if(typeof n==='number')assert.ok(Number.isFinite(n));commands.push([k,...args]);}),set:(_,k,v)=>{commands.push([k,v]);return true;}});art.closeup({width:640,height:720,getContext:()=>c},id,{battle:true});assert.ok(commands.length>100);signatures.add(JSON.stringify(commands));}assert.equal(signatures.size,8);
});
test('Actor assets load into portraits and late downloads cannot replace a different speaker',()=>{
 const images=[];class Img{constructor(){this.naturalWidth=1122;this.naturalHeight=1402;images.push(this);}}
 const s={Image:Img};s.window=s;vm.runInNewContext(fs.readFileSync(require.resolve('../graphics.js'),'utf8'),s);
 const draws=[];const c=new Proxy({createLinearGradient:()=>({addColorStop(){}}),drawImage:(img)=>draws.push(img.src)},{get:(t,k)=>t[k]||(()=>{}),set:(t,k,v)=>(t[k]=v,true)});
 const canvas={width:640,height:720,getContext:()=>c,setAttribute(){}};
 s.CharacterArt.closeup(canvas,'tony');s.CharacterArt.closeup(canvas,'paulie');images[0].onload();assert.equal(draws.length,0);images[1].onload();assert.deepEqual(draws,['assets/portraits/paulie.png']);
 s.CharacterArt.portrait(canvas,'tony');assert.equal(draws.at(-1),'assets/portraits/tony.png');
 s.CharacterArt.closeup(canvas,'chris');s.CharacterArt.closeup(canvas,'player');images[2].onload();assert.equal(draws.at(-1),'assets/portraits/tony.png');
 for(const id of ['tony','paulie','silvio','chris','artie'])assert.ok(fs.statSync(require('node:path').join(__dirname,'../assets/portraits',id+'.png')).size>10000);
});
test('Every character, opponent and performer has a unique high-resolution portrait asset',()=>{
 const ids=['player',...Object.keys(G.people),'enforcer','hitman','bodyguard','jade','ruby'];
 assert.deepEqual([...art.portraitIds].sort(),ids.sort());
 const hashes=new Set();for(const id of ids){const png=fs.readFileSync(require('node:path').join(__dirname,'../assets/portraits',id+'.png'));assert.equal(png.subarray(1,4).toString(),'PNG');assert.ok(png.readUInt32BE(16)>=640,id);assert.ok(png.readUInt32BE(20)>=720,id);hashes.add(require('node:crypto').createHash('sha256').update(png).digest('hex'));}assert.equal(hashes.size,ids.length);
});
test('Portrait cache evicts old images and reloads them without losing speaker identity',()=>{
 const images=[];class Img{constructor(){this.naturalWidth=1122;this.naturalHeight=1402;images.push(this);}}
 const s={Image:Img};s.window=s;vm.runInNewContext(fs.readFileSync(require.resolve('../graphics.js'),'utf8'),s);
 const c=new Proxy({createLinearGradient:()=>({addColorStop(){}})},{get:(t,k)=>t[k]||(()=>{}),set:(t,k,v)=>(t[k]=v,true)});
 let shown;const canvas={width:640,height:720,getContext:()=>c,setAttribute:(k,v)=>shown=v};
 for(const id of s.CharacterArt.portraitIds){s.CharacterArt.closeup(canvas,id);images.at(-1).onload();assert.equal(shown,id);}
 const count=images.length;s.CharacterArt.closeup(canvas,'tony');assert.equal(images.length,count+1);images.at(-1).onload();assert.equal(shown,'tony');
});
