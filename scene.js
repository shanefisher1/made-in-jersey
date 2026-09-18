/* Original canvas scenery. No external artwork or game assets. */
(function(){
const canvas=document.getElementById('scene'),c=canvas.getContext('2d');const W=1100,H=570;
let place='satriales',room='exterior',activePeople=['tony'],pendingTalk=null,path=[],walker={x:14,y:12},target={x:14,y:12},hover=null,last=0,frame=0,artTime=0,moving=false,facing=1;
const reducedMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;
const P=(x,y,z=0)=>({x:495+(x-y)*29,y:80+(x+y)*13-z});
function poly(points,fill,stroke){c.beginPath();points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=.7;c.stroke();}}
function quad(x,y,w,d,z,color,stroke){poly([P(x,y,z),P(x+w,y,z),P(x+w,y+d,z),P(x,y+d,z)],color,stroke);}
function box(x,y,w,d,h,color,side,roof,z=0){
 const edge='#172332a0';
 poly([P(x,y+d,z),P(x+w,y+d,z),P(x+w,y+d,h+z),P(x,y+d,h+z)],color,edge);
 poly([P(x+w,y,z),P(x+w,y+d,z),P(x+w,y+d,h+z),P(x+w,y,h+z)],side,edge);
 quad(x,y,w,d,h+z,roof,edge);
 line(P(x,y+d,h+z),P(x+w,y+d,h+z),'#fff3d344',1.3);
}
function front(x,y,w,z,h,col){poly([P(x,y,z),P(x+w,y,z),P(x+w,y,z+h),P(x,y,z+h)],col);}
function textFront(text,x,y,z,size,color){const p=P(x,y,z);c.save();c.translate(p.x,p.y);c.transform(1,13/29,0,1,0,0);c.fillStyle=color;c.font=`bold ${size}px Georgia`;c.fillText(text,0,0);c.restore();}
function line(a,b,col,width=1){c.strokeStyle=col;c.lineWidth=width;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();}
function ellipse(x,y,rx,ry,col){c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
function lamp(x,y){const p=P(x,y);ellipse(p.x+10,p.y+8,63,28,'#d7b75a0b');line(p,P(x,y,116),'#171f1a',4);line(P(x,y,115),{x:p.x+21,y:p.y-121},'#151e19',4);ellipse(p.x+23,p.y-118,9,3,'#ffdaa1');const g=c.createRadialGradient(p.x+23,p.y-110,0,p.x+23,p.y-110,67);g.addColorStop(0,'#ffd27935');g.addColorStop(1,'#ffd27900');c.fillStyle=g;c.fillRect(p.x-44,p.y-176,135,135);}
function tree(x,y){const p=P(x,y);ellipse(p.x+12,p.y+5,29,12,'#090f0c66');line(p,P(x,y,60),'#343529',6);for(let i=0;i<7;i++){let angle=i*2.4;const sway=reducedMotion?0:Math.sin(artTime*1.3+i)*1.7;ellipse(p.x+sway+Math.sin(angle)*16,p.y-67+Math.cos(angle)*14,23,20,i%2?'#263e2a':'#30472e');}ellipse(p.x-8,p.y-83,19,15,'#3b5034');}
function person(x,y,id,isPlayer=false){
 const p=P(x,y);ellipse(p.x+3,p.y+2,14,6,'#10142666');ellipse(p.x,p.y,8,3,'#10142655');
 if(isPlayer){c.strokeStyle='#ffdf8b';c.lineWidth=1.5;c.beginPath();c.ellipse(p.x,p.y+1,18,8,0,0,Math.PI*2);c.stroke();}
 CharacterArt.draw(c,Math.round(p.x),Math.round(p.y),id,{time:artTime,moving:isPlayer&&moving,facing:isPlayer?facing:1,reducedMotion});
}
function car(x,y,col){box(x,y,3.8,1.7,13,col,'#202c29','#44564a');box(x+.7,y+.1,2.1,1.5,17,'#35443d','#1b302c','#738077',13);front(x+.8,y+1.62,1.8,17,10,'#243c36');const a=P(x+.5,y+1.73),b=P(x+3.2,y+1.73);ellipse(a.x,a.y-2,6,9,'#101713');ellipse(b.x,b.y-2,6,9,'#101713');ellipse(a.x,a.y-2,3,5,'#778176');ellipse(b.x,b.y-2,3,5,'#778176');front(x+3.55,y+1.71,.2,8,5,'#e96659');
 front(x+.88,y+1.63,.8,18,9,'#8ca7b266');front(x+1.85,y+1.64,.65,18,9,'#68859e');front(x+1.75,y+1.65,.08,15,14,'#c0c1ad');
 front(x+.2,y+1.74,3.3,9,1,'#a9b0a0');front(x+1.4,y+1.75,.3,12,1.5,'#ded7b6');front(x+2.3,y+1.75,.3,12,1.5,'#ded7b6');
 front(x+.05,y+1.75,.23,7,5,'#ffdf9b');line(P(x+.1,y+1.7,3),P(x+.6,y+1.7,3),'#aab3ae',2);
 }
function benches(){box(5,10.5,2,.5,14,'#654f35','#453b29','#7b6240');box(5,10.9,2,.1,13,'#634c32','#453b29','#876946',14);box(15,9.5,.7,.7,20,'#333f30','#1d2c23','#536044');}
function shop(label,wall,roof,accent){
 box(3,2,12,6,128,wall,'#303e33',roof);
 for(let i=0;i<30;i++){let x=3+(i%12);let z=12+Math.floor(i/12)*37;front(x,8.002,.85,z,1,'#111b1522');}
 for(let z=5;z<127;z+=8){front(3,8.015,12,z,.55,'#463b4044');for(let x=3+(z%16?0:.5);x<15;x+=1)front(x,8.02,.025,z,8,'#433d3b44');}
 for(let j=0;j<3;j++)box(3.45+j*3.55,8,3.05,.25,4,'#b5aa91','#807967','#d6c7a6',9);
 front(3.25,8.04,11.5,86,31,'#243528');textFront(label,3.65,8.07,95,label.length>17?14:20,'#e8dabc');
 for(let j=0;j<3;j++){const x=3.6+j*3.55;front(x,8.06,2.9,12,57,'#172820');front(x+.12,8.065,2.65,16,47,'#b99a64');front(x+.2,8.066,.8,17,44,'#efc88b');front(x+1.6,8.067,.65,18,43,'#ffdfa64a');front(x+.19,8.07,1.05,18,44,'#bba1634a');front(x+1.4,8.075,.08,15,49,'#777457');front(x+.1,8.08,2.7,33,1.5,'#5b6549');}
 front(7.8,8.1,1.6,0,71,'#242e24');front(8,8.11,1.2,12,53,'#aa976746');front(9.1,8.13,.1,22,3,'#d0bf8f');
 for(let i=0;i<20;i++){const x=3+i*.6;poly([P(x,8,79),P(x+.6,8,79),P(x+.6,9.1,72),P(x,9.1,72)],i%2?'#bba58a':accent);front(x,9.1,.6,65,7,i%2?'#978a72':accent);}
 box(2.8,1.8,12.4,6.4,4,'#66705a','#465443','#777963',128);for(let a=3.4;a<15;a+=2.8)line(P(a,2.2,132.1),P(a,7.8,132.1),'#4e555333',1);
 quad(10,4,2.2,1.5,132.1,'#444f4c33');
 box(5,3,2,1.5,16,'#85908a','#4e6063','#a6aea1',132);for(let i=0;i<5;i++)line(P(5.2+i*.3,3.1,149),P(5.2+i*.3,4.3,149),'#39463b',1);
 box(12,3.4,.6,.6,23,'#666553','#404e40','#787866',132);
 for(let i=0;i<5;i++){const rise=reducedMotion?i*12:(artTime*13+i*14)%70;const p=P(12.3,3.7,157+rise);ellipse(p.x+Math.sin(rise*.05)*9,p.y,5+rise*.15,3+rise*.1,`rgba(204,201,202,${.16*(1-rise/70)})`);}
 box(3.1,2.2,11.8,.15,12,'#6f705c','#5a6551','#7a7c65',132);
 const light=P(8.6,9.7,15);const g=c.createRadialGradient(light.x,light.y,1,light.x,light.y,120);g.addColorStop(0,'#d7b46312');g.addColorStop(1,'#d7b46300');c.fillStyle=g;c.fillRect(light.x-120,light.y-120,240,240);
}
function dock(){
 for(let i=0;i<2;i++){box(3+i*6,2,5,5,63,i?'#775444':'#53665a','#2b3c32',i?'#886653':'#6b7c68');for(let j=0;j<11;j++)front(3+i*6+j*.45,7.01,.04,3,57,'#1c291e66');textFront(i?'PN 042':'NEWARK',3.7+i*6,7.03,34,13,'#c0bea0');}
 box(4,2,5,4,57,'#6a5741','#403e30','#7a7153',63);textFront('CARGO',4.7,6.05,91,17,'#c5b88e');
 for(let i=0;i<3;i++)box(14+i*.6,5+i*.7,1,1.2,20,'#756447','#4b4a33','#8b7e58');
 const a=P(16,1,0);line(a,P(16,1,215),'#7c7650',7);line(P(16,1,208),P(9,1,220),'#7c7650',6);line(P(9,1,220),P(9,1,123),'#505944',2);line(P(16,1,145),P(9,1,220),'#737250',2);
}
function church(){shop('ST. ELZEAR’S', '#696b55','#6c6c52','#4b5d46');box(3,2,2,3,196,'#72735b','#4c5945','#7c7b61');const p=P(4,3.5,231);line({x:p.x,y:p.y+30},p,'#b5af82',4);line({x:p.x-10,y:p.y+10},{x:p.x+10,y:p.y+10},'#b5af82',4);front(3.5,5.05,1,139,33,'#273c2b');tree(2,10);tree(17,6);}
function scene(){
 if(room!=='exterior'){Interiors.draw(c,{P,poly,quad,box,front,textFront,line,ellipse,person,time:artTime,reducedMotion},place,room,walker,activePeople);return;}
 c.clearRect(0,0,W,H);c.fillStyle='#22352f';c.fillRect(0,0,W,H);
 const sky=c.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#536580');sky.addColorStop(.6,'#525e70');sky.addColorStop(1,'#243444');c.fillStyle=sky;c.fillRect(0,0,W,H);
 const sun=c.createRadialGradient(800,88,4,800,88,240);sun.addColorStop(0,'#ffc28d66');sun.addColorStop(1,'#ffc28d00');c.fillStyle=sun;c.fillRect(560,0,480,280);
 for(let i=0;i<6;i++){const drift=reducedMotion?0:Math.sin(artTime*.04+i)*8;ellipse(130+i*182+drift,38+(i%3)*17,95,9,'#c1afb517');}
 c.globalAlpha=.55;for(let i=0;i<24;i++){let xx=i*54-35,hh=35+(i*71)%80;c.fillStyle=i%2?'#12271e':'#193025';c.fillRect(xx,128-hh,43,hh+80);for(let j=0;j<5;j++){c.fillStyle='#b4aa743d';c.fillRect(xx+8+(j%3)*9,139-hh+Math.floor(j/3)*15,4,6);}}c.globalAlpha=1;
 quad(-5,-2,33,25,-4,'#3d5551');quad(-3,12,30,6,0,'#344250');quad(-3,18,30,2,0,'#4d5942');
 for(let x=-2;x<26;x+=2.5){quad(x,14.85,1.2,.055,1,'#a293554f');quad(x,16.45,1.2,.055,1,'#9b8e4a39');}
 for(let x=-2;x<24;x++){for(let y=8;y<12;y++){quad(x,y,1,.97,1,(x+y)%3?'#92978b':'#838e87','#89927625');}}
 quad(-2,11.93,25,.12,3,'#889075');quad(-2,12.06,25,.15,1,'#151f18');
 for(let i=0;i<150;i++){let x=(i*127)%W,y=270+(i*43)%300;c.fillStyle=i%2?'#c3c3a008':'#07180c18';c.fillRect(x,y,3+(i%13),1);}
 // Rear structures and location-specific architecture.
 box(15,0,5,6,103,'#42513e','#293c2e','#59654d');for(let i=0;i<4;i++)front(15.4+i*1.1,6.02,.65,38,35,'#172c20');
 if(place==='docks')dock();else if(place==='church')church();else if(place==='bing'){shop('BADA BING!', '#554c45','#585849','#733954');front(4,8.2,10,89,23,'#402e39');c.save();c.shadowColor='#f18abb';c.shadowBlur=reducedMotion?9:9+Math.sin(artTime*1.8)*2;textFront('BADA BING!',4.8,8.25,95,21,'#ffc2e4');c.restore();}else if(place==='vesuvio'){shop('NUOVO VESUVIO','#cfac79','#9d947a','#357765');for(let x=4;x<15;x+=5){box(x,10,1.1,1,20,'#78715a','#5b5d46','#bcaa7b');}}else if(place==='hotel'){shop('THE ESSEX HOUSE','#787461','#6b6f56','#474c38');box(3,2,12,6,68,'#777562','#4e5b48','#8a876e',128);for(let x=3.6;x<15;x+=2)front(x,8.02,1.1,146,32,'#bac08c48');}else shop('SATRIALE’S PORK STORE','#b88968','#9d9b8a','#a3433e');
 if(place!=='church'&&place!=='docks'){tree(1,7);tree(18,8);}benches();
 // Street furniture stays outside the walking lane.
 box(16.8,9,.6,.55,29,'#ae4545','#663740','#d77b64');front(16.87,9.56,.45,16,9,'#e4d4a8');
 for(let i=0;i<12;i++)line(P(11+i*.09,12.3,1),P(11+i*.09,12.75,1),'#182833',1);
 for(let i=0;i<18;i++){const p=P(2+i*.95,11.6+(i%3)*.08,3);ellipse(p.x,p.y,2.4,1.2,i%2?'#c99052':'#ab6948');}

 const npcs=activePeople;const coords=npcs.map(id=>({id,x:npcCoords(id)[0],y:npcCoords(id)[1]}));const figures=[...coords,{id:'player',...walker}].sort((a,b)=>(a.x+a.y)-(b.x+b.y));figures.forEach(p=>person(p.x,p.y,p.id,p.id==='player'));
 car(17,14,'#3c4d40');car(2,15,'#71664e');lamp(1,11.5);lamp(19,11.5);
 // Telephone wires, leaf litter and soft atmospheric grain.
 c.beginPath();c.moveTo(65,76);c.quadraticCurveTo(430,155,920,60);c.strokeStyle='#10231bb0';c.lineWidth=1.4;c.stroke();
 const vignette=c.createRadialGradient(W*.51,H*.48,150,W*.51,H*.48,620);vignette.addColorStop(0,'#09171000');vignette.addColorStop(1,'#13213966');c.fillStyle=vignette;c.fillRect(0,0,W,H);
 for(let i=0;i<850;i++){c.fillStyle=i%2?'#f4e6af05':'#06110a10';c.fillRect((i*137)%W,(i*73)%H,1,1);}
}
function position(x,y,z=0){const p=P(x,y,z);return {x:p.x/W*100,y:p.y/H*100};}
function npcCoords(id){return room==='exterior'?(AmbientNPCs[id]?.position||[8,10.25]):Interiors.layout(place,room).npc[id]||AmbientNPCs[id]?.position||[12,9];}
function hotspotPositions(){return activePeople.map(id=>{const coords=npcCoords(id);return {id,...position(coords[0],coords[1],64)};});}
function cancelApproach(){pendingTalk=null;path=[];target={...walker};window.onWalkCancel?.();}
function approach(id,onArrival){if(!activePeople.includes(id))return false;cancelApproach();const [x,y]=npcCoords(id);if(Math.hypot(walker.x-x,walker.y-y)<=1.6){onArrival();return true;}const destination={x,y:y+1};if(room==='exterior'){target={x:Math.max(3,Math.min(18,x)),y:Math.max(9.7,Math.min(12.6,y+1))};}else{path=Interiors.route(Interiors.layout(place,room),walker,destination);const end=path[path.length-1];if(!end||Math.hypot(end.x-x,end.y-y)>1.6){path=[];return false;}}pendingTalk={id,onArrival};return true;}
function doorPositions(){if(room==='exterior')return[{room:'interior',...position(8.6,8.1,55)}];if(room==='interior')return[{room:'exterior',...position(4.25,13.75,9)},{room:'backroom',...position(16,2.2,84)}];return[{room:'interior',...position(4.25,13.75,9)}];}
function inspections(){if(room==='exterior')return[];return Interiors.layout(place,room).objects.filter(o=>o.label).map((o,i)=>({id:i,label:o.label,detail:o.detail,...position(o.x+o.w/2,o.y+o.d/2,45)}));}
function animate(t){
 if(t-last>32){
  const canMove=!window.canWalk||window.canWalk();const before={...walker};moving=false;
  if(canMove){
   if(path.length){const next=path[0],dx=next.x-walker.x,dy=next.y-walker.y,dist=Math.hypot(dx,dy);if(dist<.13){walker={...next};path.shift();}else{walker.x+=dx/dist*.13;walker.y+=dy/dist*.13;}}
   else if(room==='exterior'&&Math.abs(target.x-walker.x)+Math.abs(target.y-walker.y)>.005){walker.x+=(target.x-walker.x)*.1;walker.y+=(target.y-walker.y)*.1;}
   moving=Math.hypot(walker.x-before.x,walker.y-before.y)>.003;
   if(moving)facing=(walker.x-before.x)-(walker.y-before.y)>=0?1:-1;
   if(pendingTalk&&!path.length){const [nx,ny]=npcCoords(pendingTalk.id);if(Math.hypot(walker.x-nx,walker.y-ny)<=1.6){const done=pendingTalk.onArrival;pendingTalk=null;target={...walker};moving=false;done();}}
  }
  if(!reducedMotion)artTime=t/1000;
  if(!document.hidden)scene();last=t;
 }
 frame=requestAnimationFrame(animate);
}
canvas.addEventListener('click',e=>{if(window.canWalk&&!window.canWalk())return;cancelApproach();const r=canvas.getBoundingClientRect();const x=(e.clientX-r.left)*W/r.width,y=(e.clientY-r.top)*H/r.height;const a=(x-495)/29,b=(y-80)/13;if(room!=='exterior'){path=Interiors.route(Interiors.layout(place,room),walker,{x:(a+b)/2,y:(b-a)/2});return;}target.x=Math.max(3,Math.min(18,(a+b)/2));target.y=Math.max(9.7,Math.min(12.6,(b-a)/2));});
function portrait(canvas,id){if(canvas)CharacterArt.portrait(canvas,id);}
window.Scene={set(id,nextRoom='exterior',ids=[]){if(place!==id||room!==nextRoom){place=id;room=nextRoom;walker=room==='exterior'?{x:14,y:12}:{x:9.5,y:13};target={...walker};path=[];pendingTalk=null;window.onWalkCancel?.();}activePeople=ids;scene();},hotspotPositions,doorPositions,inspections,portrait,closeup:CharacterArt.closeup,approach,cancelApproach};requestAnimationFrame(animate);
})();
