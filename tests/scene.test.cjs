const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const G=require('../engine.js');
const I=require('../interiors.js');
function scene(){
 let tick,clock=0;const events={};const noop=()=>{};
 const ctx=new Proxy({createRadialGradient:()=>({addColorStop:noop}),createLinearGradient:()=>({addColorStop:noop})},{get:(t,k)=>k in t?t[k]:noop,set:(t,k,v)=>(t[k]=v,true)});
 const canvas={getContext:()=>ctx,addEventListener:(e,fn)=>events[e]=fn,getBoundingClientRect:()=>({left:0,top:0,width:1100,height:570})};
 const sandbox={Game:G,AmbientNPCs:G.ambient,Interiors:I,document:{getElementById:()=>canvas},requestAnimationFrame:fn=>{tick=fn;},canWalk:()=>true};sandbox.window=sandbox;
 vm.runInNewContext(fs.readFileSync(require.resolve('../graphics.js'),'utf8'),sandbox);
 vm.runInNewContext(fs.readFileSync(require.resolve('../scene.js'),'utf8'),sandbox);
 return {api:sandbox.Scene,step:(count=500)=>{for(let n=1;n<=count;n++)tick(clock+=34);},events,sandbox};
}
test('Approaching a distant outdoor NPC walks first, then starts exactly one conversation',()=>{const s=scene();s.api.set('satriales','exterior',['tony','lou','mara']);let calls=0;assert.ok(s.api.approach('lou',()=>calls++));assert.equal(calls,0);s.step();assert.equal(calls,1);s.step();assert.equal(calls,1);});
test('Every indoor background NPC can be approached without teleporting',()=>{for(const [id,npc]of Object.entries(G.ambient)){if(npc.room==='exterior')continue;const s=scene();s.api.set(npc.location,npc.room,[id]);let calls=0;assert.ok(s.api.approach(id,()=>calls++),id);s.step();assert.equal(calls,1,id);}});
test('Changing rooms or choosing a ground destination cancels pending conversation',()=>{const s=scene();let calls=0;s.api.set('satriales','exterior',['lou']);s.api.approach('lou',()=>calls++);s.api.set('satriales','interior',['paulie']);s.step();assert.equal(calls,0);s.api.set('satriales','exterior',['lou']);s.api.approach('lou',()=>calls++);s.events.click({clientX:640,clientY:430});s.step();assert.equal(calls,0);});
test('Menu and dialogue pauses prevent movement from firing conversations',()=>{const s=scene();s.api.set('satriales','exterior',['lou']);let calls=0;s.api.approach('lou',()=>calls++);s.sandbox.canWalk=()=>false;s.step();assert.equal(calls,0);s.sandbox.canWalk=()=>true;s.step();assert.equal(calls,1);});
test('A second approach replaces the first and absent characters cannot be approached',()=>{const s=scene();s.api.set('satriales','exterior',['lou','mara']);let first=0,second=0;s.api.approach('lou',()=>first++);s.api.approach('mara',()=>second++);s.step();assert.equal(first,0);assert.equal(second,1);assert.equal(s.api.approach('silvio',()=>{}),false);});
test('Every campaign character remains reachable with proximity-based conversation',()=>{for(const [location,loc]of Object.entries(G.locations))for(const id of loc.people){const state=G.fresh();state.stage=7;const room=G.npcRoom(state,id),s=scene();s.api.set(location,room,[id]);let calls=0;assert.ok(s.api.approach(id,()=>calls++),id);s.step();assert.equal(calls,1,id);}});
