/* Original, show-inspired cutaway interiors and furniture-aware walking. */
(function(root){
'use strict';
const item=(type,x,y,w,d,extra={})=>({type,x,y,w,d,...extra});
const layouts={
 satriales:{
  interior:{floor:['#9c9c83','#6a7666'],wall:'#bac0a0',trim:'#60745d',style:'tile',sign:'SATRIALE’S • FINE ITALIAN MEATS',npc:{paulie:[12.5,8.5]},objects:[item('deli',4,5,8,1.5,{label:'The meat counter',detail:'Cold cuts behind curved glass, handwritten prices, and a roll of butcher paper. Out front, Satriale’s is still a neighborhood pork store.'}),item('shelf',3,2.2,5,1,{kind:'salami'}),item('fridge',9,2.2,3,1),item('register',12.5,5,1.3,1.5),item('table',5,9,2,1.7,{cloth:'check'}),item('chair',4,9.5,.7,.7),item('chair',7.5,9.5,.7,.7),item('coffee',3,5,1,1.4),item('shelf',17,7,1,3)]},
  backroom:{floor:['#75634c','#6e5b45'],wall:'#63503d',trim:'#382f25',style:'wood',sign:'PRIVATE • FAMILY ONLY',npc:{tony:[12,7.5]},objects:[item('table',7,6,4,2.8,{cloth:'check',label:'The family table',detail:'A green-and-white checkered cloth. Paper plates, espresso cups and an envelope pushed underneath a newspaper. Lunch and business share a table here.'}),item('chair',6,6.8,.8,.8),item('chair',11.5,6.8,.8,.8),item('chair',8,9.3,.8,.8),item('chair',9.5,4.8,.8,.8),item('tv',3,3.2,2,1.2,{label:'The television',detail:'The little television murmurs over the refrigerator. The room is arranged around a meal, not an office meeting.'}),item('shelf',7,2.2,5,1,{kind:'pantry'}),item('fridge',3,6,1.8,1.3),item('sofa',14,9,3,1.5),item('pendant',9,7.4,0,0,{solid:false})]}
 },
 vesuvio:{
  interior:{floor:['#73634f','#6a5a46'],wall:'#a18d6a',trim:'#304e42',style:'wood',sign:'NUOVO VESUVIO',mural:true,npc:{rosa:[13,11.5]},objects:[item('table',5,6,2.3,2,{cloth:'white'}),item('chair',4,6.5,.7,.7),item('chair',7.7,6.5,.7,.7),item('table',10,6,2.3,2,{cloth:'white'}),item('chair',9,6.5,.7,.7),item('chair',12.7,6.5,.7,.7),item('table',7.5,10,2.3,2,{cloth:'white',label:'A table for the family',detail:'White linen, wine glasses and a candle, set beneath a view of the Bay of Naples. A comfortable dinner can turn into a quiet negotiation.'}),item('bar',3,2.3,4,1.4),item('shelf',8,2.2,4,1,{kind:'wine'}),item('column',3,5,.6,.6),item('column',16,5,.6,.6),item('plant',16,11,1,1),item('pendant',10,8,0,0,{solid:false})]},
  backroom:{floor:['#b3b3a0','#777f73'],wall:'#a5afa0',trim:'#546961',style:'tile',sign:'CUCINA • ORDERS UP',npc:{artie:[11.5,8.5]},objects:[item('stove',3,2.2,6,1.6),item('fridge',10,2.2,2.5,1.4),item('prep',7,6,3,2,{label:'The prep table',detail:'Tomatoes, flour, a chopping board and a pan waiting for the pass. Artie measures his day in dinner covers, not envelopes.'}),item('shelf',3,6,1.4,4,{kind:'pantry'}),item('sink',14,7,3,1.5),item('crate',14,11,1.4,1.2),item('pendant',8.5,7,0,0,{solid:false})]}
 },
 bing:{
  interior:{floor:['#342b3b','#302736'],wall:'#413044',trim:'#221f2e',style:'carpet',sign:'BADA BING!',neon:true,npc:{chris:[13,10.5]},objects:[item('stage',4,3.5,8,2.8,{label:'The stage show',detail:'Two adult performers, Jade and Ruby, dance under the pink and blue spotlights in sequined tops, matching shorts and tall boots. The club beat carries as far as the office door.'}),item('bar',15,5,2,6),item('shelf',7,2.2,4,1,{kind:'bottles'}),item('cocktail',5,9,1.3,1.3),item('chair',4.4,10.5,.7,.7),item('cocktail',9,10,1.3,1.3),item('chair',8.4,11.5,.7,.7),item('sofa',3,6.7,1.2,2),item('stool',13.5,6,.6,.6),item('stool',13.5,8,.6,.6)]},
  backroom:{floor:['#687164','#60695e'],wall:'#6a644f',trim:'#3b4337',style:'concrete',sign:'THE BACK ROOM',glass:true,npc:{silvio:[14,6.5]},objects:[item('pool',6,6,5,2.8,{label:'The pool table',detail:'Green felt, chalk on the rail and a cue left across the table. The pool room doubles as an office; conversations stop when the club door opens.'}),item('desk',12,3.2,3,1.8,{label:'Silvio’s desk',detail:'A telephone, adding machine and neat piles of receipts. The desk looks ordinary until you remember whose accounts Silvio keeps.'}),item('chair',13,2.2,.8,.8),item('poker',4,3,2,1.7),item('bag',3.3,7.5,1,1),item('keg',16,9,1,1),item('crate',14,11,2,1.2),item('cabinet',16,3.3,1.4,1),item('pendant',8.5,7.4,0,0,{solid:false,shade:'#468467'})]}
 },
 docks:{
  interior:{floor:['#787f72','#72796d'],wall:'#7a8674',trim:'#4e5c4b',style:'concrete',sign:'PORT NEWARK • RECEIVING',npc:{vinnie:[11,8.5]},objects:[item('crate',3,3,3,2,{stack:2}),item('crate',7,3,3,2),item('crate',3,8,2,3),item('crate',14,8,3,3,{stack:2}),item('pallet',8,6,2,1.5,{label:'The shipment',detail:'The freight is ordinary. The names on the paperwork are not. Vinnie has the manifest the family is looking for.'}),item('desk',11,3,2,1.4),item('pendant',10,8,0,0,{solid:false})]},
  backroom:{floor:['#757866','#6b705f'],wall:'#8e9581',trim:'#525d4c',style:'concrete',sign:'DISPATCH',npc:{},objects:[item('desk',7,5,4,2,{label:'Dispatch sheets',detail:'Carbon copies, truck numbers and yesterday’s schedules. None of these duplicates replaces the manifest Vinnie is holding in the warehouse.'}),item('chair',8,3.7,.8,.8),item('cabinet',3,3,2,1.2),item('cabinet',5.3,3,1,1.2),item('sofa',14,8,3,1.5),item('tv',12,3,1.5,1),item('crate',4,8,2,1.5)]}
 },
 church:{
  interior:{floor:['#9b9980','#757c68'],wall:'#b3af92',trim:'#625c44',style:'tile',sign:'ST. ELZEAR’S',stained:true,npc:{father:[13,5.7]},objects:[item('altar',8,3.4,4,1.8),...[6.5,9,11.5].flatMap(y=>[item('pew',4,y,4,1),item('pew',11,y,4,1)]),item('candles',3,3.5,1.5,1.3,{label:'Votive candles',detail:'Rows of small flames carry the private hopes of the neighborhood. Father Matteo offers rest without asking who sent you.'})]},
  backroom:{floor:['#746950','#6e6149'],wall:'#a69d81',trim:'#6d644e',style:'wood',sign:'PARISH OUTREACH',npc:{},objects:[item('desk',7,4,3,1.6),item('sofa',13,7,3,1.5,{label:'A place to stay',detail:'A worn sofa, a clean blanket and a door that locks. The parish can offer Anna shelter if you support its emergency fund.'}),item('shelf',3,3,3,1,{kind:'pantry'}),item('crate',4,7,2,1.5),item('table',8,9,2,1.5,{cloth:'white'})]}
 },
 hotel:{
  interior:{floor:['#633932','#59322d'],wall:'#afa082',trim:'#655b40',style:'carpet',sign:'THE ESSEX HOUSE',npc:{},objects:[item('reception',7,3.5,6,1.8,{label:'The reception book',detail:'A quiet lobby, a discreet clerk and a room upstairs reserved under somebody else’s name. Rinaldi is waiting in the suite.'}),item('sofa',4,8,3,1.5),item('sofa',13,8,3,1.5),item('cocktail',8.5,8,2,1.5),item('plant',3,3,1,1),item('plant',16,3,1,1),item('column',3,6,.7,.7),item('column',16,6,.7,.7),item('pendant',10,8,0,0,{solid:false})]},
  backroom:{floor:['#626f60','#566352'],wall:'#8c886e',trim:'#584b39',style:'carpet',sign:'THE PRIVATE SUITE',window:true,npc:{rinaldi:[14,8.5]},objects:[item('desk',11,5,4,2,{label:'Rinaldi’s papers',detail:'A closed ledger rests beside a drink. It is the original, and Rinaldi is not ready to part with it. Talk to him to settle the matter.'}),item('sofa',5,6,3.2,1.7),item('cocktail',6,9,2,1.4),item('bar',3,2.4,4,1.3),item('bed',4,10.5,3,2),item('plant',16,4,1,1),item('cabinet',16,10,1,1)]}
 }
};
function layout(place,room){return layouts[place]?.[room];}
function walkable(data,x,y){return x>=2.6&&x<=17.4&&y>=2.7&&y<=13.4&&!data.objects.some(o=>o.solid!==false&&x>o.x-.32&&x<o.x+o.w+.32&&y>o.y-.32&&y<o.y+o.d+.32);}
// Breadth-first search on a half-tile grid. Every segment stays off solid furniture.
function route(data,from,to){
 const key=(x,y)=>x+','+y,grid=[];for(let x=6;x<=34;x++)for(let y=6;y<=26;y++)if(walkable(data,x/2,y/2))grid.push({x,y});
 const nearest=p=>grid.reduce((best,n)=>!best||Math.hypot(n.x/2-p.x,n.y/2-p.y)<Math.hypot(best.x/2-p.x,best.y/2-p.y)?n:best,null);
 const a=nearest(from),b=nearest(to);if(!a||!b)return[];const available=new Set(grid.map(n=>key(n.x,n.y))),seen=new Map([[key(a.x,a.y),null]]),queue=[a];let goal=null;
 for(let i=0;i<queue.length;i++){const n=queue[i];if(n.x===b.x&&n.y===b.y){goal=n;break;}for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const v={x:n.x+dx,y:n.y+dy},k=key(v.x,v.y);if(available.has(k)&&!seen.has(k)){seen.set(k,n);queue.push(v);}}}
 if(!goal)return[];const path=[];for(let n=goal;n;n=seen.get(key(n.x,n.y)))path.unshift({x:n.x/2,y:n.y/2});return path;
}
function draw(c,h,place,room,walker,ids){
 const data=layout(place,room),{P,poly,quad,box,front,textFront,line,ellipse,person,time=0,reducedMotion=false}=h;
 c.fillStyle='#202b3b';c.fillRect(0,0,1100,570);
 const backdrop=c.createRadialGradient(540,290,30,540,290,590);backdrop.addColorStop(0,'#566176');backdrop.addColorStop(1,'#1a2434');c.fillStyle=backdrop;c.fillRect(0,0,1100,570);
 // Cut away the front walls so furniture and doors remain visible.
 quad(1.8,1.8,16.4,12.4,-6,'#111b13');
 for(let x=2;x<18;x++)for(let y=2;y<14;y++)quad(x,y,.985,.985,0,data.floor[(x+y)%2],data.style==='carpet'?undefined:'#1e2c1d25');
 // Material details stay fixed in world coordinates, avoiding crawling noise.
 for(let x=2;x<18;x++)for(let y=2;y<14;y++){
  if(data.style==='wood'){for(let k=0;k<3;k++)line(P(x+.12+k*.23,y+.08),P(x+.12+k*.23,y+.83),'#e6c49522',.7);}
  else if(data.style==='tile'){line(P(x+.08,y+.06),P(x+.86,y+.06),'#fff6d53a',1);quad(x+.4,y+.4,.14,.14,.1,'#34465244');}
  else if(data.style==='carpet'){quad(x+.43,y+.43,.12,.12,.1,place==='bing'?'#bc72964a':'#d5b47a44');}
 }
 if(data.style==='carpet'){quad(8.2,3,3.6,10,.2,place==='bing'?'#9e49672b':'#c5a77516');line(P(8.2,3,.3),P(8.2,13,.3),'#cfac7366');line(P(11.8,3,.3),P(11.8,13,.3),'#cfac7366');}
 if(data.style==='wood')for(let x=2;x<18;x+=.25)line(P(x,2),P(x,14),'#45392525',.5);
 poly([P(2,2),P(18,2),P(18,2,112),P(2,2,112)],data.wall);
 poly([P(2,2),P(2,14),P(2,14,112),P(2,2,112)],data.trim);
 front(2,2.01,16,0,28,data.trim);front(2,2.02,16,28,3,'#d2bc8155');front(2,2.02,16,108,5,'#d4c39677');
 for(let x=2;x<18;x+=.7)front(x,2.03,.025,0,28,'#121c1755');
 if(data.style==='tile')for(let x=2;x<18;x+=.5){front(x,2.04,.02,31,73,'#52655033');for(let z=32;z<110;z+=14)front(2,2.04,16,z,.5,'#52655033');}
 // Wall molding and soft highlights give the cutaway a miniature-set finish.
 line(P(2,2,112),P(18,2,112),'#fff0ca99',2);line(P(2,2,112),P(2,14,112),'#bdc5c066',2);
 for(let x=3;x<14;x+=3){
  if(data.style!=='tile'){front(x,2.05,2.3,38,39,'#20273322');front(x+.06,2.06,2.18,40,35,'#f1dcb210');}
 }
 // Back-wall windows, glass blocks and the painted Vesuvio view.
 if(data.glass){for(let x=3;x<9;x+=.55)for(let z=38;z<104;z+=15)front(x,2.08,.48,z,13,'#9eaea97a');}
 if(data.mural){front(7.5,2.07,5,43,60,'#594b34');front(7.65,2.09,4.7,46,54,'#a0aaa0');front(7.65,2.10,4.7,46,16,'#5a8282');poly([P(8,2.12,62),P(9.7,2.12,97),P(10.4,2.12,85),P(12.2,2.12,62)],'#777b64');front(7.65,2.13,4.7,45,2,'#c5b17b');}
 if(data.window){front(8,2.07,5,35,72,'#302f2b');front(8.2,2.09,4.6,39,64,'#283e3c');for(let i=0;i<13;i++){front(8.4+i*.32,2.11,.22,40,10+(i*17)%32,'#596b5d');front(8.43+i*.32,2.12,.07,44+(i*7)%18,3,'#c8b371');}front(10.4,2.13,.12,38,65,'#c0aa73');front(7.8,2.14,.5,30,80,'#6b473b');front(12.7,2.14,.5,30,80,'#6b473b');}
 if(data.stained){for(let k=0;k<3;k++){let x=3.2+k*4;front(x,2.07,2.2,42,62,'#4b4b36');for(let j=0;j<3;j++)for(let z=0;z<3;z++)front(x+.15+j*.65,2.09,.56,47+z*17,15,['#aab585','#b18269','#758f93'][(j+z)%3]);}}
 // The actual interior doorway is always in the same clear aisle.
 if(room==='interior'){front(15,2.18,2,0,79,'#262d23');front(15.12,2.19,1.76,0,75,'#665c40');front(15.28,2.20,1.45,7,58,'#454c37');front(16.65,2.21,.08,31,4,'#d7bd7e');}else{front(15.2,2.18,1.5,53,36,'#594a34');front(15.35,2.19,1.2,57,28,'#aaab8d');front(15.5,2.20,.9,67,1,'#555f46');}
 textFront(data.sign,3,2.24,92,data.sign.length>25?10:13,data.neon?'#e88dc0':'#e0d2aa');
 // A second threshold, on the cutaway front edge, leads back out.
 quad(3,13.65,2.5,.35,1,'#b49c62');line(P(3,13.7),P(3,13.7,38),'#887647',3);line(P(5.5,13.7),P(5.5,13.7,38),'#887647',3);
 const bottle=(x,y,z,col='#485e38')=>{box(x,y,.16,.15,8,col,'#283d2a',col,z);box(x+.045,y+.045,.06,.06,4,col,col,col,z+8);};
 const plate=(x,y,z)=>{const p=P(x,y,z);ellipse(p.x,p.y,9,4,'#ddd9bd');ellipse(p.x,p.y,5,2,'#adad95');};
 function furniture(o){const{x,y,w,d,type}=o;
 if(type!=='pendant'){quad(x+.15,y+.15,w+.22,d+.22,.2,'#14203135');}
 const top=(z,col)=>quad(x+.1,y+.1,w-.2,d-.2,z,col);switch(type){
 case 'chair':case 'stool':box(x,y,w,d,17,'#584638','#342f26','#795c40');if(type==='chair')box(x,y,w,.12,18,'#65523a','#3a3427','#856c47',17);break;
 case 'table':case 'prep':case 'desk':case 'reception':case 'cocktail':case 'poker':case 'pool':{
 const height=type==='reception'?48:type==='pool'?32:29;for(const xx of[x+.15,x+w-.3])for(const yy of[y+.15,y+d-.3])box(xx,yy,.17,.17,height,'#473a2d','#2b3023','#756346');
 box(x,y,w,d,5,type==='prep'?'#969f93':'#755a3c','#3d3e2d',type==='prep'?'#b4beb3':type==='pool'||type==='poker'?'#745334':'#8c714d',height);
 if(o.cloth){top(height+5.1,o.cloth==='white'?'#dfdcca':'#d1d1af');if(o.cloth==='check')for(let a=0;a<w-.2;a+=.35)for(let b=0;b<d-.2;b+=.35)if((Math.round(a/.35)+Math.round(b/.35))%2===0)quad(x+.1+a,y+.1+b,Math.min(.35,w-.2-a),Math.min(.35,d-.2-b),height+5.2,'#618069');plate(x+.6,y+.4,height+6);plate(x+w-.55,y+d-.45,height+6);bottle(x+w/2,y+d/2,height+6);}
 if(type==='pool'||type==='poker'){top(height+5.1,'#347660');if(type==='pool'){for(const xx of[x+.17,x+w-.17])for(const yy of[y+.17,y+d-.17]){const p=P(xx,yy,height+6);ellipse(p.x,p.y,5,3,'#132b20');}line(P(x+.4,y+.6,height+7),P(x+w-.5,y+d-.4,height+7),'#d2ba7e',2);for(let i=0;i<4;i++){const p=P(x+1+i*.7,y+1.2+(i%2)*.4,height+8);ellipse(p.x,p.y,3,3,['#e4dfc6','#ce884b','#d3c664','#9c5144'][i]);}}}
 if(type==='desk'||type==='reception'){quad(x+.4,y+.4,.9,.7,height+6,'#dcd7b5');box(x+w-1.2,y+.3,.7,.5,7,'#242d23','#19241c','#394434',height+5);box(x+.7,y+d-.6,.7,.3,3,'#695033','#4a3a26','#a18a60',height+5);}
 if(type==='prep'){quad(x+.5,y+.5,1.1,.8,height+6,'#ad9669');for(let i=0;i<3;i++){const p=P(x+.65+i*.22,y+.7,height+8);ellipse(p.x,p.y,4,4,'#ad5743');}plate(x+w-.5,y+d-.4,height+6);}
 if(type==='cocktail')bottle(x+w/2,y+d/2,height+6);break;}
 case 'deli':box(x,y,w,d,28,'#e0d6b0','#7d8e7a','#c5cdb0');front(x,y+d+.01,w,12,15,'#536958');box(x+.08,y+.08,w-.16,d-.16,21,'#91bcb55e','#91bcb544','#c7ddca55',28);for(let a=.3;a<w-.2;a+=1.1){quad(x+a,y+.3,.8,.8,30,['#af6b54','#bb8b63','#b68369'][Math.floor(a)%3]);front(x+a,y+d+.04,.7,33,7,'#e0d9b3');}line(P(x,y+d,50),P(x+w,y+d,50),'#d2d8bc',2);break;
 case 'register':box(x,y,w,d,38,'#a5aa95','#6b7c68','#c2c5ab');box(x+.2,y+.2,w-.4,d-.4,16,'#515e4b','#354630','#859079',38);front(x+.3,y+d-.1,.6,44,5,'#d0c688');break;
 case 'fridge':box(x,y,w,d,77,'#abb5a2','#5f7466','#c1c9b4');front(x+.12,y+d+.01,w-.24,9,57,'#738c80');front(x+w*.5,y+d+.02,.055,8,59,'#c2c7aa');front(x+w*.5-.18,y+d+.03,.07,35,14,'#dfe0c4');break;
 case 'shelf':box(x,y,w,d,72,'#695b40','#494835','#887556');for(let z=12;z<70;z+=20){front(x+.12,y+d+.01,w-.24,z,15,'#363e2b');front(x,y+d+.02,w,z-2,3,'#af9764');for(let a=.35;a<w-.2;a+=.45){if(o.kind==='salami'){const p=P(x+a,y+d+.06,z+12);ellipse(p.x,p.y,4,8,'#ad7b56');}else bottle(x+a,y+d+.03,z,o.kind==='pantry'?'#b49c61':'#4e7450');}}break;
 case 'bar':box(x,y,w,d,42,'#714834','#382e25','#9f7650');top(43,'#9d8561');for(let i=0;i<Math.max(w,d)-.5;i+=.7)bottle(x+.3+(w>d?i:0),y+.3+(d>w?i:0),44);break;
 case 'sofa':box(x,y,w,d,18,'#6b4036','#40362b','#875a45');box(x,y,w,.3,22,'#765246','#4b3b30','#96694e',18);box(x,y,.25,d,10,'#775443','#4d3e2f','#996e51',18);box(x+w-.25,y,.25,d,10,'#775443','#4d3e2f','#996e51',18);
 for(let a=.35;a<w-.4;a+=.85){quad(x+a,y+.4,Math.min(.75,w-a-.25),d-.52,19,'#b884633b');line(P(x+a,y+.35,19),P(x+a,y+d-.1,19),'#352d354f');}break;
 case 'tv':box(x,y,w,d,28,'#675b3f','#403f2d','#857251');box(x+.15,y+.1,w-.3,d-.2,30,'#3a4235','#263629','#58644f',28);front(x+.3,y+d-.08,w-.7,33,19,'#87bdc5');for(let z=34;z<51;z+=3)front(x+.3,y+d-.07,w-.7,z,1,'#e2f2dc44');front(x+.35+(reducedMotion?0:Math.sin(time)*.12),y+d-.06,(w-.8)*.4,34,13,'#41698d');line(P(x+.5,y+.5,58),P(x+.1,y+.4,76),'#727f65',1);break;
 case 'coffee':box(x,y,w,d,37,'#746248','#4b4733','#9a8460');box(x+.15,y+.2,.6,.6,23,'#b5bda9','#798d80','#d4d5b8',37);break;
 case 'plant':box(x,y,w,d,13,'#8a6645','#564f35','#a38758');for(let i=0;i<5;i++){const p=P(x+w/2+Math.sin(i)*.4,y+d/2+Math.cos(i)*.35,28+(i%3)*7);ellipse(p.x,p.y,14,9,['#667c4b','#496e44','#7b8f54'][i%3]);}break;
 case 'column':box(x,y,w,d,104,'#668475','#344f45','#8ca18a');for(let z=10;z<99;z+=19)front(x,y+d+.01,w,z,2,'#a0b5a15c');box(x-.12,y-.12,w+.24,d+.24,6,'#b7b79a','#8f9b83','#d5cfaa',103);break;
 case 'stage':box(x,y,w,d,16,'#763959','#3b283f','#8c5173');for(const xx of[x+2,x+6]){line(P(xx,y+1.5,17),P(xx,y+1.5,105),'#c5a2b1',3);}front(x,y+d+.02,w,7,2,'#e88ebe');
 // Adult performers in opaque two-piece stage outfits; stylized, non-explicit choreography.
 for(let k=0;k<2;k++){
  const phase=reducedMotion?0:time*2.7+k*2,step=Math.sin(phase),p=P(x+2+k*4,y+1.8,17),skin=k?'#bd835f':'#e5b08a',costume=k?'#55bad6':'#d65e9f';
  c.save();c.translate(p.x+step*3,p.y);
  const glow=c.createRadialGradient(0,-40,4,0,-40,67);glow.addColorStop(0,k?'#6fbbff25':'#ff80c02b');glow.addColorStop(1,'#ffffff00');c.fillStyle=glow;c.fillRect(-70,-110,140,140);
  const limb=(points,col,width)=>{c.beginPath();points.forEach(([a,b],i)=>i?c.lineTo(a,b):c.moveTo(a,b));c.strokeStyle='#292333';c.lineWidth=width+2;c.lineCap='round';c.lineJoin='round';c.stroke();c.strokeStyle=col;c.lineWidth=width;c.stroke();};
  ellipse(1,1,14,5,'#24203388');
  limb([[-5,-33],[-7-step*2,-19],[-8-step*2,-3]],skin,5);limb([[5,-33],[7+step*2,-18],[8+step*2,-3]],skin,5);
  limb([[-7-step*2,-18],[-8-step*2,-3],[-5-step*2,-2]],'#393149',6);limb([[7+step*2,-18],[8+step*2,-3],[11+step*2,-2]],'#393149',6);
  limb([[-7,-56],[-15,-46+step*4],[-20,-58+step*5]],skin,4);limb([[7,-56],[16,-65-step*4],[12,-77-step*3]],skin,4);
  c.fillStyle=skin;c.fillRect(-6,-58,12,27);c.fillStyle=costume;c.fillRect(-8,-59,16,13);c.fillRect(-8,-37,16,9);c.fillStyle='#fff2d0';c.fillRect(-7,-47,14,2);c.fillRect(-7,-37,14,2);
  c.fillStyle=k?'#4b2834':'#dbb669';c.fillRect(-8,-76,17,20);c.fillStyle=skin;c.fillRect(-5,-72,11,12);c.fillStyle=k?'#4b2834':'#dbb669';c.fillRect(-6,-75,13,5);c.fillStyle='#2e2b39';c.fillRect(-3,-67,2,2);c.fillRect(3,-67,2,2);
  c.fillStyle='#ffebcf';for(let q=0;q<3;q++)c.fillRect(-5+q*4,-55+(q%2)*3,2,2);
  c.restore();
 }break;
 case 'bag':line(P(x+.5,y+.5,115),P(x+.5,y+.5,70),'#848a71',2);box(x+.2,y+.2,.6,.6,44,'#5b4036','#382e28','#775644',27);break;
 case 'keg':box(x,y,w,d,31,'#8a9685','#5b7061','#abb49d');for(let z=7;z<30;z+=15)front(x,y+d+.01,w,z,3,'#c1c4a8');break;
 case 'cabinet':box(x,y,w,d,57,'#768170','#4b6150','#8b9580');for(let z=8;z<50;z+=16){front(x+.1,y+d+.01,w-.2,z,13,'#909a81');front(x+w*.4,y+d+.02,.25,z+7,2,'#d4d1aa');}break;
 case 'crate':for(let i=0;i<(o.stack||1);i++){box(x,y,w,d,24,'#988054','#655c3c','#b09a69',i*25);for(let xx=x+.15;xx<x+w;xx+=.5)front(xx,y+d+.02,.04,i*25,23,'#655431');line(P(x+.1,y+d+.03,i*25+1),P(x+w-.1,y+d+.03,i*25+23),'#bda777',2);}break;
 case 'pallet':box(x,y,w,d,6,'#8f784d','#4e5134','#b09964');for(let i=0;i<3;i++)box(x+.2+i*.55,y+.2,.5,d-.4,13,'#bdad81','#877c51','#d0bf8e',6);break;
 case 'stove':box(x,y,w,d,36,'#9fa898','#687f70','#c0c4ad');for(let xx=x+.5;xx<x+w;xx+=1){const p=P(xx,y+.7,37);ellipse(p.x,p.y,10,5,'#344637');box(xx-.2,y+.4,.4,.5,7,'#7e9182','#50695b','#a6b6a0',37);}box(x,y,w,d,10,'#b1b7a1','#748879','#cbd1b6',84);break;
 case 'sink':box(x,y,w,d,36,'#9fa898','#687f70','#c0c4ad');quad(x+.4,y+.3,w-.8,d-.6,37,'#536e61');line(P(x+w/2,y+.2,37),P(x+w/2,y+.2,51),'#d2d2b9',3);break;
 case 'pew':box(x,y,w,d,15,'#8f734b','#554f31','#ab8c58');box(x,y,w,.18,21,'#866840','#4b432b','#ba9a62',15);break;
 case 'altar':box(x,y,w,d,36,'#9e8d61','#6c7351','#d9d1ac');quad(x-.05,y-.05,w+.1,d+.1,37,'#e7e0c1');const p=P(x+w/2,y+.25,82);line(p,P(x+w/2,y+.25,38),'#d2b879',4);line({x:p.x-12,y:p.y+12},{x:p.x+12,y:p.y+12},'#d2b879',4);break;
 case 'candles':box(x,y,w,d,26,'#765e3b','#47472d','#9c8856');for(let a=.25;a<w;a+=.35){const p=P(x+a,y+.5,34);line(p,P(x+a,y+.5,26),'#d3c291',3);ellipse(p.x,p.y-2,2,4,'#ffe5a1');}break;
 case 'bed':box(x,y,w,d,18,'#826950','#514d3a','#c4c4a8');quad(x+.1,y+.2,w-.2,d-.35,19,'#e0d7b5');quad(x+.2,y+.15,w-.4,.5,21,'#ece2c2');break;
 case 'pendant':{const p=P(x,y,109);line(P(x,y,153),p,'#575d47',2);poly([{x:p.x-28,y:p.y+12},{x:p.x+28,y:p.y+12},{x:p.x+12,y:p.y-7},{x:p.x-12,y:p.y-7}],o.shade||'#bfab76');ellipse(p.x,p.y+13,27,5,'#f0d7a0');break;}
 }}
 // Local light pools are painted onto the floor before people and furnishings.
 for(const o of data.objects.filter(o=>o.type==='pendant'||o.type==='candles')){const p=P(o.x+(o.w||0)/2,o.y+(o.d||0)/2);const g=c.createRadialGradient(p.x,p.y,4,p.x,p.y,125);g.addColorStop(0,place==='bing'?'#ed91c031':'#ffdb8f38');g.addColorStop(1,'#ffdfab00');c.save();c.translate(p.x,p.y);c.scale(1,.5);c.translate(-p.x,-p.y);c.fillStyle=g;c.fillRect(p.x-125,p.y-125,250,250);c.restore();}
 if(data.stained){for(let i=0;i<3;i++)quad(5+i*3,4.5,1.5,6,.3,['#d8936633','#6ebce133','#d3cb8033'][i]);}
 const solids=data.objects.filter(o=>o.type!=='pendant').map(o=>({depth:o.x+o.y+(o.w+o.d)/2,draw:()=>furniture(o)}));
 ids.forEach(id=>{const p=data.npc[id]||root.AmbientNPCs?.[id]?.position||[12,9];solids.push({depth:p[0]+p[1],draw:()=>person(p[0],p[1],id)});});solids.push({depth:walker.x+walker.y,draw:()=>person(walker.x,walker.y,'player',true)});solids.sort((a,b)=>a.depth-b.depth).forEach(o=>o.draw());data.objects.filter(o=>o.type==='pendant').forEach(furniture);
 const glow=c.createRadialGradient(560,310,40,560,310,490);glow.addColorStop(0,data.neon?'#bd6ba712':'#ffe2ac0d');glow.addColorStop(1,'#101b383d');c.fillStyle=glow;c.fillRect(0,0,1100,570);
}
const API={layouts,layout,walkable,route,draw};if(typeof module!=='undefined')module.exports=API;root.Interiors=API;
})(typeof window!=='undefined'?window:globalThis);
