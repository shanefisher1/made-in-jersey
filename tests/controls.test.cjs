const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const G=require('../engine.js');
function app(){
 const nodes=new Map(),listeners={},stored=new Map();let pending=null;
 const node=selector=>{if(!nodes.has(selector))nodes.set(selector,{open:false,hidden:false,dataset:{},style:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},removeAttribute(){},addEventListener(){},scrollIntoView(){},showModal(){this.open=true;},close(){this.open=false;},contains(b){return !!b.inModal;}});return nodes.get(selector);};
 const sandbox={JerseyMusic:{create:()=>({select(){},title:()=>'',toggle:async()=>true})},Game:G,structuredClone,document:{querySelector:node,querySelectorAll:()=>[],addEventListener:(event,fn)=>listeners[event]=fn},localStorage:{getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,v)},setTimeout:()=>0,clearTimeout(){},requestAnimationFrame:fn=>fn(),scrollTo(){}};
 sandbox.window=sandbox;
 sandbox.Scene={set(){},portrait(){},closeup(){},hotspotPositions:()=>[],doorPositions:()=>[],inspections:()=>[],approach(id,done){pending=done;return true;},cancelApproach(){pending=null;sandbox.onWalkCancel?.();}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../app.js'),'utf8'),sandbox);
 const click=(dataset,inModal=false)=>{const b={dataset,inModal,matches:()=>false};listeners.click({target:{closest:()=>b},stopPropagation(){}});};
 click({action:'begin'},true);
 return {click,node,arrive(){const done=pending;pending=null;done?.();},pending:()=>!!pending,canWalk:()=>sandbox.canWalk(),key:key=>listeners.keydown({key,target:{tagName:'BODY'},preventDefault(){}})};
}
test('Talk selection shows walking feedback, then reveals the conversation on arrival',()=>{
 const a=app();a.click({talk:'tony'});assert.ok(a.pending());assert.match(a.node('#scene-status').textContent,/Walking to/);assert.equal(a.node('#scene-control-action').dataset.action,'cancel-walk');a.arrive();assert.match(a.node('#scene-status').textContent,/Talking with Tony/);assert.match(a.node('#interaction').innerHTML,/data-choice/);assert.equal(a.canWalk(),false);
});
test('Cancel and every utility menu discard a pending talk rather than resuming it later',()=>{
 for(const action of ['cancel-walk','help','settings','morality-help','travel-open']){const a=app();a.click({talk:'tony'});a.click({action});assert.equal(a.pending(),false,action);if(action!=='cancel-walk')a.click({action:'close'},true);a.arrive();assert.equal(a.canWalk(),true,action);assert.equal(a.node('#scene-controls').hidden,true,action);}
});
test('Room navigation, journal and Escape cancel earlier walk commands',()=>{
 for(const change of [a=>a.click({room:'interior'}),a=>a.click({view:'journal'}),a=>a.key('Escape')]){const a=app();a.click({talk:'tony'});change(a);assert.equal(a.pending(),false);a.arrive();assert.doesNotMatch(a.node('#interaction').innerHTML,/data-choice/);}
});
test('An open modal rejects world controls while accepting its own buttons',()=>{
 const a=app();a.click({action:'help'});a.click({room:'interior'});a.click({talk:'tony'});assert.equal(a.pending(),false);assert.match(a.node('#interaction').innerHTML,/The street/);a.click({action:'close'},true);a.click({talk:'tony'});assert.ok(a.pending());
});
