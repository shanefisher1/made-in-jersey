/* Original handheld-inspired sprite artwork, drawn locally without external assets. */
(function(root){
'use strict';
const castPortraits=Object.fromEntries('tony paulie silvio chris artie player rosa vinnie eddie father anna rinaldi enforcer hitman bodyguard lou mara nicky sal gina aldo bruno val dana mickey ray leon irene pete denise oscar elsie tom bea joey evan doris felix vera jade ruby'.split(' ').map(id=>[id,'assets/portraits/'+id+'.png']));
const portraitImages=new Map(),portraitTargets=new WeakMap();
function trimPortraitCache(){
 for(const [id,entry] of portraitImages){if(portraitImages.size<=12)break;if(entry.ready||entry.failed)portraitImages.delete(id);}
}
function castPortrait(canvas,id){
 // Track even fallback drawings, so a late image cannot overwrite a new speaker.
 portraitTargets.set(canvas,id);
 if(!castPortraits[id]||!root.Image)return false;
 let entry=portraitImages.get(id);
 if(!entry){
  entry={image:new root.Image(),ready:false,failed:false,waiting:new Set()};portraitImages.set(id,entry);
  entry.image.onload=()=>{entry.ready=true;for(const target of entry.waiting)if(portraitTargets.get(target)===id&&target.isConnected!==false)castPortrait(target,id);entry.waiting.clear();trimPortraitCache();};
  entry.image.onerror=()=>{entry.failed=true;entry.waiting.clear();trimPortraitCache();};
  entry.image.src=castPortraits[id];
 }
 if(entry.ready){portraitImages.delete(id);portraitImages.set(id,entry);}
 if(!entry.ready){if(!entry.failed)entry.waiting.add(canvas);return false;}
 const c=canvas.getContext('2d'),img=entry.image,sourceWidth=img.naturalWidth,sourceHeight=Math.min(img.naturalHeight,sourceWidth*canvas.height/canvas.width);
 c.clearRect(0,0,canvas.width,canvas.height);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
 c.drawImage(img,0,0,sourceWidth,sourceHeight,0,0,canvas.width,canvas.height);
 canvas.setAttribute?.('data-cast-portrait',id);return true;
}
const palettes=[['#527f96','#314a65'],['#b65f62','#743e53'],['#709564','#435e50'],['#c19a57','#826448'],['#8e7ba7','#5a526f'],['#5d9990','#365e66']];
function appearance(id){
 const hash=[...id].reduce((n,ch)=>n+ch.charCodeAt(0),0),colors=palettes[hash%palettes.length];
 const women=['anna','rosa','mara','gina','dana','irene','denise','elsie','bea','doris','vera'];
 const skin=['#e4b38b','#d49a74','#bd845f','#f0c19a'][hash%4];
 const special={tony:['#bf9061','#866347'],paulie:['#6c7e8c','#404a64'],artie:['#f0e4ca','#9baca9'],silvio:['#587085','#303d58'],chris:['#9a5254','#613a47'],father:['#505467','#2c3045'],player:['#79a0ac','#465f7c']};
 return {hash,skin,light: (special[id]||colors)[0],dark:(special[id]||colors)[1],hair:id==='paulie'||['sal','elsie','doris'].includes(id)?'#c3c7ca':hash%3===0?'#694131':'#2d2937',woman:women.includes(id),wide:id==='tony'};
}
function draw(c,x,y,id,{time=0,moving=false,facing=1,reducedMotion=false}={}){
 const a=appearance(id),ink='#202335',phase=time*11,step=moving&&!reducedMotion?Math.sin(phase)*3:0;
 const bob=reducedMotion?0:moving?Math.abs(Math.sin(phase))*1.5:Math.sin(time*2+a.hash)*.6;
 c.save();c.translate(x,y);c.scale(facing,1);
 // Pixel-aligned, inked silhouettes with three-tone shading.
 const rect=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h);};
 function shape(points,fill){c.beginPath();points.forEach(([xx,yy],i)=>i?c.lineTo(xx,yy):c.moveTo(xx,yy));c.closePath();c.fillStyle=fill;c.fill();c.strokeStyle=ink;c.lineWidth=1.5;c.lineJoin='round';c.stroke();}
 // Shoes and alternating legs.
 for(const [lx,s] of [[-7,step],[2,-step]]){rect(lx-1,-21+s,7,19,ink);rect(lx,-20+s,4,15,a.dark);rect(lx+1,-18+s,1,10,'#a0a9bd55');rect(lx-2,-4+s,10,4,ink);rect(lx-1,-4+s,6,1,'#7e8391');}
 c.translate(0,-bob);
 const width=a.wide?12:10;
 shape([[-width+2,-43],[width-2,-43],[width+1,-36],[width,-20],[-width,-20],[-width-1,-36]],a.light);
 rect(4,-39,width-4,18,a.dark);rect(-width+2,-39,3,16,'#ffebc528');
 // Arms sway opposite the legs; cuffs and hands remain readable at game scale.
 for(const [side,s] of [[-1,-step],[1,step]]){const xx=side===-1?-width-5:width-1;shape([[xx+1,-40+s],[xx+5,-39+s],[xx+6,-25+s],[xx,-25+s]],side===-1?a.light:a.dark);rect(xx+1,-26+s,5,6,ink);rect(xx+2,-26+s,3,4,a.skin);}
 rect(-4,-47,9,9,ink);rect(-3,-46,7,7,a.skin);
 if(['silvio','chris','player'].includes(id)){shape([[-6,-42],[-1,-36],[0,-23],[-5,-30]],'#c8d9d4');shape([[5,-42],[1,-36],[0,-23],[6,-31]],a.dark);rect(-1,-36,2,12,'#c09b65');}
 else {rect(-3,-41,6,3,'#eee1c5');rect(-1,-38,2,7,a.dark);rect(1,-32,1,1,'#eee3c4');}
 if(['artie','bruno','nicky'].includes(id)){rect(-6,-37,13,16,'#e9dfc6');rect(-4,-29,9,5,'#c2c3b5');rect(-5,-41,2,5,'#e9dfc6');rect(5,-41,2,5,'#e9dfc6');}
 if(id==='father'){rect(-2,-41,5,3,'#fff0d2');}
 if(id==='mara'){rect(10,-23,9,12,ink);rect(11,-22,7,10,'#c6a271');rect(12,-26,5,2,'#e2c18c');}
 rect(-width,-22,width*2,2,ink);rect(-1,-22,3,2,'#d9b774');
 // Ears, rounded head, jaw and asymmetric facial shading.
 rect(-10,-56,20,9,ink);rect(-9,-55,18,7,a.skin);
 shape([[-8,-61],[-5,-65],[5,-65],[9,-61],[9,-49],[5,-44],[-4,-44],[-8,-49]],a.skin);
 rect(6,-57,2,9,'#9e644f');rect(-6,-59,3,8,'#ffe0b244');rect(-3,-47,8,2,'#c18967');
 if(id==='tony'){rect(-8,-62,3,9,a.hair);rect(6,-62,3,6,a.hair);rect(-6,-65,11,2,a.hair);}
 else {rect(-8,-63,16,5,a.hair);rect(-6,-66,11,3,a.hair);rect(-9,-59,3,a.woman?17:8,a.hair);rect(7,-59,3,a.woman?18:6,a.hair);rect(-5,-63,8,1,'#ffffff25');}
 if(id==='paulie'){rect(-8,-57,3,8,'#e0e0d1');rect(6,-57,3,8,'#e0e0d1');rect(-5,-64,10,4,'#363442');}
 const blink=!reducedMotion&&(time+a.hash*.137)%5.7>5.52;
 rect(-5,-56,4,1,a.hair);rect(3,-56,4,1,a.hair);
 rect(-4,-54,2,blink?1:2,ink);rect(4,-54,2,blink?1:2,ink);
 rect(1,-53,2,4,'#b57959');rect(-2,-47,6,1,'#795047');
 if(id==='artie')rect(-2,-49,6,2,'#645044');
 if(['lou','pete','oscar','bruno'].includes(id)){rect(-9,-65,19,5,id==='bruno'?'#f0e5cc':a.dark);rect(-7,-68,14,3,id==='bruno'?'#f7eed7':a.light);rect(4,-61,9,2,ink);}

 c.restore();
}
function portrait(canvas,id){
 if(castPortrait(canvas,id))return;
 const c=canvas.getContext('2d'),a=appearance(id);c.clearRect(0,0,canvas.width,canvas.height);c.save();c.scale(canvas.width/64,canvas.height/72);
 const g=c.createLinearGradient(0,0,64,72);g.addColorStop(0,a.dark);g.addColorStop(1,'#192638');c.fillStyle=g;c.fillRect(0,0,64,72);
 c.fillStyle='#ffffff0c';for(let y=0;y<72;y+=6)c.fillRect(0,y,64,1);
 c.translate(32,135);c.scale(1.85,1.85);draw(c,0,0,id,{reducedMotion:true});c.restore();
}
// Larger, original illustrated likenesses; shared by conversations and battles.
function closeup(canvas,id,{battle=false}={}){
 if(castPortrait(canvas,id))return;
 const c=canvas.getContext('2d'),a=appearance(id),w=canvas.width,h=canvas.height;
 c.clearRect(0,0,w,h);c.save();c.scale(w/320,h/360);
 const ink='#212232',skin=a.skin;
 const shape=(points,fill,stroke=ink)=>{c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.lineJoin='round';c.stroke();}};
 const ellipse=(x,y,rx,ry,fill)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();};
 const line=(points,color,width=2)=>{c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.stroke();};
 const bg=c.createLinearGradient(0,0,320,360);bg.addColorStop(0,battle?'#61383c':'#526675');bg.addColorStop(1,'#171e30');c.fillStyle=bg;c.fillRect(0,0,320,360);
 for(let i=0;i<8;i++){c.fillStyle=i%2?'#ffffff06':'#0000000a';c.fillRect(i*45-30,0,24,360);}
 const tony=id==='tony',paulie=id==='paulie',silvio=id==='silvio',chris=id==='chris',artie=id==='artie',woman=a.woman;
 const wide=tony?12:0,faceBottom=tony?236:225,coat=artie?'#e5dfca':a.light;
 // Shoulders, tailored clothing and shirt collar.
 shape([[8,360],[18,295],[54,270],[115,251],[204,251],[268,274],[302,301],[315,360]],a.dark);
 shape([[29,360],[40,294],[114,263],[158,282],[204,261],[278,298],[291,360]],coat);
 shape([[121,220],[118,268],[156,295],[202,265],[196,214]],skin);
 shape([[123,230],[196,225],[190,259],[165,279],[127,257]],'#a57057',null);
 shape([[113,252],[156,284],[141,314],[99,271]],artie?'#fff5df':'#e9e4cf');
 shape([[204,251],[157,284],[179,312],[219,274]],artie?'#fff5df':'#b7c8c9');
 if(tony){shape([[147,285],[159,286],[171,360],[149,360]],'#9e784e');line([[155,301],[157,347]],'#edd0a0',2);}
 else if(!woman&&!artie){shape([[151,287],[166,287],[170,302],[163,316],[177,360],[149,360],[156,315],[147,302]],silvio?'#bc795e':'#77869c');}
 if(artie){line([[209,282],[217,354]],'#8d9994',2);for(let i=0;i<3;i++)ellipse(221,300+i*20,3,3,'#757f7b');}
 else{line([[74,286],[103,324],[89,338],[111,360]],a.dark,3);line([[247,287],[220,328],[235,337],[214,360]],a.dark,3);}
 // Ears, jaw, cheek planes and neck shadows give the cast distinct silhouettes.
 ellipse(98-wide,157,13,23,'#b78162');ellipse(219+wide,157,12,23,'#b78162');
 shape([[104-wide,90],[126,68],[180,64],[210+wide,88],[223+wide,139],[217+wide,192],[194,faceBottom],[156,faceBottom+8],[119,faceBottom-7],[96-wide,183],[95-wide,128]],skin);
 shape([[200,89],[215+wide,126],[212+wide,188],[191,faceBottom-3],[164,faceBottom+5],[190,202],[200,170]],'#b0795d',null);
 shape([[108-wide,125],[130,99],[155,92],[150,137],[120,166],[109-wide,179]],'#ffe0b532',null);
 shape([[111,180],[133,187],[145,206],[172,212],[194,202],[185,227],[153,232],[125,217]],tony?'#c18b68':'#b8856940',null);
 // Hair: Tony's receding crown, Paulie's silver wings, Silvio's sculpted pompadour.
 if(tony||artie){shape([[98-wide,148],[91-wide,121],[98-wide,91],[119,72],[145,66],[173,65],[195,71],[217,91],[226,126],[218,151],[209,118],[200,95],[172,83],[140,82],[116,99],[108,133]],artie?'#5a4437':'#3a3031');ellipse(157,91,40,20,skin);}
 else if(silvio){shape([[96,150],[87,120],[88,83],[109,70],[113,53],[144,43],[196,47],[221,65],[235,94],[229,136],[218,156],[207,113],[181,91],[140,96],[110,112],[107,150]],'#252735');line([[104,82],[138,64],[182,66],[214,81]],'#6c6370',5);line([[109,91],[146,77],[188,80]],'#55515f',3);}
 else{shape([[97,153],[87,120],[96,83],[115,62],[149,54],[194,60],[218,79],[228,118],[219,153],[210,117],[195,100],[153,89],[119,105],[108,135]],a.hair);line([[111,85],[146,70],[182,74],[202,85]],'#ffffff24',4);}
 if(paulie){shape([[95,98],[112,107],[107,146],[111,167],[96,161],[90,134]],'#e1e1d6');shape([[210,103],[225,99],[228,136],[217,163],[208,157]],'#d1d5d2');}
 if(woman){shape([[92,105],[104,141],[101,211],[117,242],[99,256],[78,216],[80,148]],a.hair);shape([[216,105],[229,136],[237,223],[216,248],[204,225],[218,185]],a.hair);}
 const brow=chris?5:tony?4:3;
 line([[113,140],[128,135],[141,139]],a.hair,brow);line([[174,138],[190,134],[204,138]],a.hair,brow);
 ellipse(128,150,13,5,'#ede6d3');ellipse(189,149,13,5,'#ede6d3');ellipse(130,150,4,5,'#413b34');ellipse(187,149,4,5,'#413b34');ellipse(131,148,1,1,'#ffffff');ellipse(188,147,1,1,'#ffffff');
 line([[113,155],[130,159],[142,155]],'#a36f58',1.5);line([[175,155],[190,158],[204,153]],'#a36f58',1.5);
 line([[158,147],[153,173],[160,180],[171,175]],'#a46d50',2);line([[152,181],[160,183],[173,179]],'#845c48',1.5);
 line([[137,201],[151,198],[166,200],[181,197]],'#704b42',2);line([[145,209],[164,212],[176,206]],'#f0bf9855',2);
 if(tony){line([[122,180],[117,194],[126,207]],'#ac765b',2);line([[194,178],[199,195]],'#9e6c55',2);line([[126,117],[159,114],[185,117]],'#ba866666',1.5);}
 if(chris){line([[126,187],[130,208],[149,224],[177,224],[192,206]],'#59463955',4);line([[142,194],[163,193],[177,194]],'#5b493c66',3);}
 if(artie){shape([[145,212],[152,219],[174,212],[171,230],[153,235],[145,228]],'#604d3d');line([[140,194],[151,191],[162,193],[175,190]],'#574536',3);}
 if(silvio){
  shape([[111,174],[123,185],[137,186],[131,200],[119,195]],'#b27b61',null);shape([[187,184],[203,171],[205,193],[188,207]],'#95684f55',null);
  line([[112,143],[126,145],[141,143]],'#634737',3);line([[176,142],[190,144],[205,141]],'#634737',3);
  line([[135,199],[149,196],[164,198],[183,196]],'#633e3b',3);line([[144,204],[168,206],[178,202]],'#b17b65',4);
  line([[123,174],[118,187],[130,210]],'#9c674e',2);line([[192,173],[201,190],[189,211]],'#875d48',2);
  line([[126,123],[153,120],[179,122]],'#9b715655',1.5);
 }
 if(paulie){for(const y of [111,118,125])line([[119,y],[149,y-3],[180,y]],'#986f5555',1.4);line([[110,158],[101,166]],'#9d7057',2);line([[207,157],[213,166]],'#916750',2);line([[125,172],[119,193],[132,213]],'#a06f53',2);line([[193,172],[201,190],[185,216]],'#92664b',2);line([[140,217],[164,221],[180,214]],'#996f54',2);}
 if(chris){shape([[156,146],[150,175],[160,186],[177,178],[165,174]],'#be8463',null);line([[150,177],[160,183],[175,177]],'#79503e',2.5);line([[109,138],[126,132],[143,137]],'#30252b',5);line([[174,136],[190,130],[205,136]],'#30252b',5);}
 // Handheld-style rim light, inked shoulders and subtle screen texture.
 line([[22,347],[35,304],[64,284]],'#ffdec653',3);line([[221,107],[228,143],[220,180]],'#eaa88955',2);
 for(let y=0;y<360;y+=4){c.fillStyle='#0d15200a';c.fillRect(0,y,320,1);}
 c.restore();
}

root.CharacterArt={draw,portrait,appearance,closeup,portraitIds:Object.freeze(Object.keys(castPortraits))};
})(typeof window!=='undefined'?window:globalThis);
