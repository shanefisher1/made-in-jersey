/* Original score: seven melodic themes with room-specific arrangements, generated locally. */
(function(root){
'use strict';
const themes={
 satriales:{title:'Neighborhood Business',bpm:92,root:57,chords:[0,5,3,7],melody:[0,3,7,10,7,3,2,-1,0,5,8,12,10,7,5,3],tone:'triangle'},
 vesuvio:{title:'Last Table at Vesuvio',bpm:84,root:60,chords:[0,5,7,0],melody:[7,12,10,7,3,5,7,-1,8,7,5,3,2,5,3,0],tone:'bell'},
 bing:{title:'Neon on Route 17',bpm:116,root:45,chords:[0,0,5,7],melody:[12,-1,15,12,19,17,15,-1,12,15,19,22,19,-1,17,15],tone:'pulse'},
 docks:{title:'Freight After Midnight',bpm:100,root:43,chords:[0,3,0,7],melody:[0,-1,7,0,1,-1,7,10,0,7,-1,12,10,7,3,-1],tone:'pulse'},
 church:{title:'Candles for the Living',bpm:68,root:60,chords:[0,5,3,7],melody:[7,-1,12,-1,10,7,5,-1,3,-1,7,10,5,-1,2,0],tone:'bell'},
 hotel:{title:'The Last Envelope',bpm:78,root:50,chords:[0,3,5,7],melody:[12,10,7,-1,3,7,10,14,12,-1,10,7,5,3,2,-1],tone:'triangle'}
};
const titleTheme={title:'Turnpike After Dark',bpm:88,root:46,chords:[0,0,5,7],melody:[7,-1,10,6,5,-1,3,0,-1,3,5,-1,6,5,3,-1],tone:'pulse',groove:true};
const rate=22050,TAU=Math.PI*2;
const tables={};for(const kind of ['triangle','pulse','bell','sine']){const table=new Float32Array(2048);for(let i=0;i<table.length;i++){const p=i/table.length*TAU;table[i]=kind==='pulse'?(Math.sin(p)+Math.sin(3*p)/3+Math.sin(5*p)/5)*.65:kind==='triangle'?(Math.sin(p)-Math.sin(3*p)/9+Math.sin(5*p)/25)*.9:kind==='bell'?(Math.sin(p)+.3*Math.sin(2*p)+.12*Math.sin(3*p))*.7:Math.sin(p);}tables[kind]=table;}
function score(location,room='exterior',mood='explore'){
 const theme=location==='title'?titleTheme:themes[location]||themes.satriales,quiet=room==='backroom',inside=room==='interior';
 return {...theme,bpm:mood==='combat'?theme.bpm+20:theme.bpm,room,mood,lead:quiet?.065:inside?.105:.075,drums:location==='title'?.12:location==='church'?0:quiet?.035:inside?.11:.055,title:theme.title+' · '+(location==='title'?'Title Theme':mood==='combat'?'Confrontation':mood==='ending'?'Epilogue':quiet?'After Hours':inside?'Inside':'Street Mix')};
}
function render(config){
 const beat=60/config.bpm,length=Math.round(beat*32*rate),data=new Float32Array(length);
 function note(midi,start,duration,volume,kind='triangle'){
  const table=tables[kind],freq=440*Math.pow(2,(midi-69)/12),offset=Math.round(start*rate),n=Math.round(duration*rate),attack=Math.min(.016,duration*.1)*rate,release=Math.min(.14,duration*.3)*rate;
  for(let i=0;i<n;i++){const envelope=Math.min(1,i/attack,(n-i)/release)*Math.exp(-i/(rate*(kind==='bell'?.4:3)));const sample=table[Math.floor(i*freq/rate*2048)%2048];data[(offset+i)%length]+=sample*envelope*volume;}
 }
 let seed=417;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296*2-1;};
 function drum(start,type,volume){const offset=Math.round(start*rate),n=Math.round(rate*(type==='kick'?.19:type==='snare'?.13:.055));for(let i=0;i<n;i++){const t=i/rate,env=Math.exp(-t*(type==='hat'?80:24));const sample=type==='kick'?Math.sin(TAU*(48*t+4*(1-Math.exp(-t*28)))):random()*(type==='snare'?.7:1);data[(offset+i)%length]+=sample*env*volume;}}
 for(let bar=0;bar<8;bar++){
  const chord=config.root+config.chords[bar%4],start=bar*4*beat;
  for(const pitch of [0,3,7])note(chord+12+pitch,start,beat*3.8,.025,'triangle');
  for(let b=0;b<4;b++){
   note(chord-12+(config.groove?[0,0,7,10][b]:(b===2?7:0)),start+b*beat,beat*.7,.12,'triangle');
   if(config.groove){note(chord-12+[0,3,7,5][b],start+(b+.66)*beat,beat*.22,.075,'triangle');if(b%2)for(const pitch of [0,3,7])note(chord+12+pitch,start+b*beat,beat*.22,.035,'pulse');}
   const m=config.melody[(bar*2+b)%16];if(m>=0)note(config.root+12+m,start+b*beat,beat*.68,config.lead,config.tone);
   if(config.room==='interior')note(chord+24+[0,7,3,7][b],start+(b+.5)*beat,beat*.3,.035,'bell');
   if(config.mood!=='ending'&&config.drums){drum(start+b*beat,b%2?'snare':'kick',config.drums);drum(start+(b+(config.groove?.66:.5))*beat,'hat',config.drums*.28);}
  }
 }
 // Quantize the original mix to signed 16-bit PCM and leave generous headroom.
 for(let i=0;i<length;i++)data[i]=Math.round(Math.max(-.85,Math.min(.85,data[i]))*32767)/32767;
 return {data,sampleRate:rate,duration:length/rate};
}
function create(){
 let context=null,master=null,current=null,enabled=false,key='',selection=score('satriales'),revision=0;const cache=new Map();
 function stop(){if(!current)return;const old=current;current=null;const t=context.currentTime;old.gain.gain.cancelScheduledValues(t);old.gain.gain.setValueAtTime(old.gain.gain.value,t);old.gain.gain.linearRampToValueAtTime(0,t+.25);old.source.stop(t+.3);}
 function play(){if(!enabled||!context||context.state!=='running')return;stop();let buffer=cache.get(key);if(!buffer){const pcm=render(selection);buffer=context.createBuffer(1,pcm.data.length,pcm.sampleRate);buffer.copyToChannel(pcm.data,0);cache.set(key,buffer);if(cache.size>8)cache.delete(cache.keys().next().value);}
  const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;source.loop=true;source.connect(gain);gain.connect(master);gain.gain.setValueAtTime(0,context.currentTime);gain.gain.linearRampToValueAtTime(1,context.currentTime+.4);source.onended=()=>{source.disconnect();gain.disconnect();};source.start();current={source,gain};
 }
 return {select(location,room,mood){const next=[location,room,mood].join(':');if(next===key)return;key=next;selection=score(location,room,mood);play();},async toggle(){const token=++revision;if(enabled){enabled=false;stop();return false;}const AC=root.AudioContext||root.webkitAudioContext;if(!AC)throw new Error('Audio unavailable');if(!context){context=new AC();master=context.createGain();master.gain.value=.38;master.connect(context.destination);}await context.resume();if(token!==revision)return enabled;enabled=true;play();return true;},title:()=>selection.title};
}
const api={themes,titleTheme,score,render,create};root.JerseyMusic=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
