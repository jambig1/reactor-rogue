function renderMusicPCM(track,rate=22050,bars=16){let iterator=renderMusicChunks(track,rate,bars),result;do{result=iterator.next()}while(!result.done);return result.value}
const musicTransport={cache:new Map,pending:new Set,queue:[],worker:null,workerReady:false,working:null,current:null,fading:[],offsets:{},previewUntil:0,status:'',failed:false};
function musicScene(){let menu=state==='menu'||state==='end'||!s||(state==='settings'&&settingsReturn==='menu')||(state==='records'&&['menu','end'].includes(recordsReturn))||(state==='hangar'&&['menu','end'].includes(hangarReturn));if(menu)return 'menu';if(state==='merchant')return 'merchant';if(s.enemies?.some(e=>(e.finalBoss||e.systemOwner)&&e.hp>0))return 'final';return s.enemies?.some(e=>e.boss&&e.hp>0)?'boss':musicTracks.some(t=>t.id===s.sector)?s.sector:(extraSectors[s.sector]?.music||'grid')}
function desiredMusic(){return musicTracks.some(t=>t.id===audioPrefs.soundtrack)?audioPrefs.soundtrack:musicScene()}
function musicIsPaused(){let preview=audioEngine&&musicTransport.previewUntil>audioEngine.ctx.currentTime;if(preview)return false;return audioPrefs.pauseMusic&&s&& !['play','menu','end','merchant'].includes(state)&&musicScene()!=='menu'}
function musicDuck(){return s&&!['play','menu','end'].includes(state)&&musicScene()!=='menu'?.42:1}
function setMusicStatus(message){if(musicTransport.status===message)return;musicTransport.status=message;$('musicStatus').textContent=message}
function queueMusic(id,priority=false){if(!audioEngine||musicTransport.cache.has(id)||musicTransport.pending.has(id)||!musicTracks.some(t=>t.id===id))return;musicTransport.pending.add(id);if(priority)musicTransport.queue.unshift(id);else musicTransport.queue.push(id);processMusicQueue()}
function installMusic(id,pcm){let a=audioEngine;if(!a)return;try{let buffer=a.ctx.createBuffer(1,pcm.length,22050);buffer.getChannelData(0).set(pcm);musicTransport.cache.delete(id);musicTransport.cache.set(id,buffer);while(musicTransport.cache.size>4){let victim=[...musicTransport.cache.keys()].find(k=>k!==musicTransport.current?.id&&k!==id);if(!victim)break;musicTransport.cache.delete(victim)}musicTransport.pending.delete(id);musicTransport.working=null;musicTransport.failed=false;processMusicQueue()}catch(e){musicTransport.pending.delete(id);musicTransport.working=null;musicTransport.failed=true;setMusicStatus('Music could not be prepared here. Sound effects are still available.')}}
function processMusicQueue(){if(musicTransport.working||!musicTransport.queue.length||!audioEngine)return;let id=musicTransport.queue.shift(),track=musicTracks.find(t=>t.id===id);musicTransport.working=id;
 if(!musicTransport.workerReady){musicTransport.workerReady=true;try{if(typeof Worker!=='undefined'&&typeof Blob!=='undefined'&&typeof URL?.createObjectURL==='function'){let script='const renderMusicChunks='+renderMusicChunks.toString()+';const renderMusicPCM='+renderMusicPCM.toString()+';onmessage=e=>{try{let pcm=renderMusicPCM(e.data,22050,16);postMessage({id:e.data.id,pcm},[pcm.buffer])}catch(error){postMessage({id:e.data.id,error:String(error)})}}',url=URL.createObjectURL(new Blob([script],{type:'text/javascript'}));musicTransport.worker=new Worker(url);URL.revokeObjectURL(url);musicTransport.worker.onmessage=e=>{if(e.data.error){musicTransport.pending.delete(e.data.id);musicTransport.working=null;musicTransport.failed=true;setMusicStatus('Music preparation failed; sound effects remain available.');return}installMusic(e.data.id,e.data.pcm)};musicTransport.worker.onerror=()=>{musicTransport.worker?.terminate();musicTransport.worker=null;let retry=musicTransport.working;musicTransport.working=null;if(retry){musicTransport.queue.unshift(retry);processMusicQueue()}}}}catch(e){musicTransport.worker=null}}
 if(musicTransport.worker){musicTransport.worker.postMessage(track);return}
 // Browsers without workers still load lazily, outside the tap handler.
 let iterator=renderMusicChunks(track,22050,16);let pump=()=>{try{let deadline=performance.now()+6,result;do{result=iterator.next()}while(!result.done&&performance.now()<deadline);if(result.done)installMusic(id,result.value);else setTimeout(pump,0)}catch(e){musicTransport.pending.delete(id);musicTransport.working=null;musicTransport.failed=true;setMusicStatus('Music is unavailable here. Sound effects remain available.')}};setTimeout(pump,0);
}
function stopMusic(remember=true){let current=musicTransport.current,a=audioEngine;if(!current||!a)return;let now=a.ctx.currentTime;if(remember)musicTransport.offsets[current.id]=(current.offset+Math.max(0,now-current.started))%current.buffer.duration;try{current.gain.gain.cancelScheduledValues(now);current.gain.gain.setValueAtTime(current.gain.gain.value,now);current.gain.gain.linearRampToValueAtTime(0,now+.18);current.source.stop(now+.2);musicTransport.fading.push(current);while(musicTransport.fading.length>2){let f=musicTransport.fading.shift();try{f.source.stop()}catch(e){}}}catch(e){}musicTransport.current=null}
function playMusic(id,buffer){let a=audioEngine,now=a.ctx.currentTime,old=musicTransport.current;if(old?.id===id)return;if(old){musicTransport.offsets[old.id]=(old.offset+now-old.started)%old.buffer.duration;try{old.gain.gain.cancelScheduledValues(now);old.gain.gain.setValueAtTime(old.gain.gain.value,now);old.gain.gain.linearRampToValueAtTime(0,now+.55);old.source.stop(now+.58);musicTransport.fading.push(old);while(musicTransport.fading.length>2){let f=musicTransport.fading.shift();try{f.source.stop()}catch(e){}}}catch(e){}}
 try{let source=a.ctx.createBufferSource(),gain=a.ctx.createGain(),offset=(musicTransport.offsets[id]||0)%buffer.duration;source.buffer=buffer;source.loop=true;source.connect(gain);gain.connect(a.music);gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(1,now+.55);let item={id,source,gain,buffer,offset,started:now};source.onended=()=>{try{source.disconnect();gain.disconnect()}catch(e){}musicTransport.fading=musicTransport.fading.filter(f=>f!==item)};source.start(now,offset);musicTransport.current=item;let stored=musicTransport.cache.get(id);if(stored){musicTransport.cache.delete(id);musicTransport.cache.set(id,stored)}}catch(e){musicTransport.failed=true;setMusicStatus('Music playback could not start. Try Preview music again.')}
}

// v0.92 adaptive music: the loop is filtered down when the arena is quiet and opens fully as the swarm builds or a boss arrives.
function musicIntensity(){let a=audioEngine;if(!a||!a.musicTone)return;let k=1;if(s&&state==='play'){let n=s.enemies?.length||0,boss=s.enemies?.some(e=>e.boss&&e.hp>0);k=boss?1:Math.min(1,.35+n/90+Math.min(.25,(s.t||0)/600))}let f=k>=1?20000:600*Math.pow(30,k);try{a.musicTone.frequency.setTargetAtTime(f,a.ctx.currentTime,.9)}catch(e){}}
function musicTick(){let a=audioEngine;if(!a)return;let previewLabel=musicTransport.previewUntil>a.ctx.currentTime?'Stop preview':'Preview music ♪';if($('previewMusic').textContent!==previewLabel)$('previewMusic').textContent=previewLabel;if(musicTransport.failed){stopMusic();return;}let muted=audioPrefs.mute||audioPrefs.master<=0||audioPrefs.music<=0,paused=musicIsPaused();if(document.hidden||muted||paused||a.ctx.state!=='running'){stopMusic();setMusicStatus(document.hidden?'Music suspended while the game is hidden.':muted?'Music muted.':paused?'Music paused with combat.':'Tap Preview music to start audio.');return}let id=desiredMusic(),track=musicTracks.find(t=>t.id===id);if(!musicTransport.cache.has(id)){queueMusic(id,true);setMusicStatus('Preparing '+track.name+'…');return}playMusic(id,musicTransport.cache.get(id));setMusicStatus(track.name+' · '+track.genre+' · '+track.bpm+' BPM'+(musicTransport.previewUntil>a.ctx.currentTime?' · preview':''));if(id==='menu')queueMusic('grid');if(!['menu','merchant','boss','final'].includes(id))queueMusic('boss');musicIntensity()}
function previewMusic(){musicTransport.failed=false;unlockAudio();if(!audioEngine){setMusicStatus('Music is unavailable in this browser.');return;}musicTransport.previewUntil=musicTransport.previewUntil>audioEngine.ctx.currentTime?0:audioEngine.ctx.currentTime+20;musicTick();applyAudio()}

function saveAudio(){try{profileStorage.setItem('ns_audio',JSON.stringify(audioPrefs))}catch(e){}applyAudio()}
function applyAudio(){if(!audioEngine)return;let a=audioEngine,t=a.ctx.currentTime,signature=[audioPrefs.mute,document.hidden,audioPrefs.master,audioPrefs.effects,audioPrefs.music,musicDuck()].join('|');if(a.lastMix===signature)return;a.lastMix=signature;try{a.master.gain.setTargetAtTime(audioPrefs.mute||document.hidden?0:audioPrefs.master,t,.025);a.effects.gain.setTargetAtTime(audioPrefs.effects,t,.025);a.music.gain.setTargetAtTime(audioPrefs.music*musicDuck(),t,.06)}catch(e){}}
function syncAudioUI(){for(let [name,key] of [['Master','master'],['Effects','effects'],['Music','music']]){$('volume'+name).value=Math.round(audioPrefs[key]*100);$('value'+name).textContent=Math.round(audioPrefs[key]*100)+'%'}$('audioMute').checked=audioPrefs.mute;$('musicTrack').value=audioPrefs.soundtrack;$('pauseMusic').checked=audioPrefs.pauseMusic}
function unlockAudio(){try{if(!audioEngine){let Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Audio){audioUnavailable=true;$('audioStatus').textContent='Audio is unavailable in this browser. The game remains playable.';return}let ctx=new Audio(),master=ctx.createGain(),effects=ctx.createGain(),music=ctx.createGain(),limiter=ctx.createDynamicsCompressor(),musicTone=ctx.createBiquadFilter?ctx.createBiquadFilter():null;limiter.threshold.value=-16;limiter.ratio.value=8;effects.connect(master);if(musicTone){musicTone.type='lowpass';musicTone.Q.value=.7;musicTone.frequency.value=20000;music.connect(musicTone);musicTone.connect(master)}else music.connect(master);master.connect(limiter);limiter.connect(ctx.destination);let noise=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*.5),ctx.sampleRate),data=noise.getChannelData(0);let noiseSeed=0x52ea179;for(let i=0;i<data.length;i++){noiseSeed=(Math.imul(noiseSeed,1664525)+1013904223)>>>0;data[i]=noiseSeed/2147483648-1}audioEngine={ctx,master,effects,music,musicTone,noise,voices:0,last:{}};setTimeout(sfxPrewarm,50)}if(!['running','closed'].includes(audioEngine.ctx.state)){let promise=audioEngine.ctx.resume();if(promise&&promise.catch)promise.catch(()=>{})}applyAudio()}catch(e){audioUnavailable=true;$('audioStatus').textContent='Audio could not start here. You can keep playing and try Test sound again.'}}
function tone(freq,end,duration=.12,type='sine',gain=.1,when,bus='effects'){let a=audioEngine;if(!a||a.ctx.state!=='running'||a.voices>=40)return;try{let t=when===undefined?a.ctx.currentTime:when,o=a.ctx.createOscillator(),g=a.ctx.createGain();o.type=type;o.frequency.setValueAtTime(Math.max(20,freq),t);o.frequency.exponentialRampToValueAtTime(Math.max(20,end),t+duration);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,gain),t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(a[bus]);a.voices++;o.onended=()=>{a.voices=Math.max(0,a.voices-1);o.disconnect();g.disconnect()};o.start(t);o.stop(t+duration+.02)}catch(e){}}
function noiseSound(duration=.2,gain=.13,cutoff=1000){let a=audioEngine;if(!a||a.ctx.state!=='running'||a.voices>=40)return;try{let t=a.ctx.currentTime,n=a.ctx.createBufferSource(),filter=a.ctx.createBiquadFilter(),g=a.ctx.createGain();n.buffer=a.noise;filter.type='lowpass';filter.frequency.value=cutoff;g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+duration);n.connect(filter);filter.connect(g);g.connect(a.effects);a.voices++;n.onended=()=>{a.voices=Math.max(0,a.voices-1);n.disconnect();filter.disconnect();g.disconnect()};n.start();n.stop(t+duration)}catch(e){}}
const evoStyles={
bolt:{color:'#9ffff2',accent:'#aac8ff',freq:880,end:260,wave:'triangle'},
rapid:{color:'#e4faff',accent:'#70c9ff',freq:1700,end:650,wave:'sawtooth'},
cannon:{color:'#ffe19a',accent:'#ff8675',freq:110,end:28,wave:'sawtooth'},
scatter:{color:'#fff0a9',accent:'#ff9b56',freq:200,end:45,wave:'square'},
arc:{color:'#c6cfff',accent:'#83f2ff',freq:720,end:1450,wave:'sine'},
frost:{color:'#d5ffff',accent:'#99baff',freq:2400,end:850,wave:'sine'},
laser:{color:'#ffe9aa',accent:'#ff9c64',freq:1200,end:90,wave:'sawtooth'},
rocket:{color:'#ffd3b0',accent:'#fff7bf',freq:240,end:55,wave:'square'},
seeker:{color:'#9efff2',accent:'#beafff',freq:600,end:1500,wave:'triangle'},
chain:{color:'#edb6ff',accent:'#fff4bb',freq:2100,end:200,wave:'sawtooth'},
toxic:{color:'#b3ff8c',accent:'#dcb4ff',freq:135,end:55,wave:'sine'},
blade:{color:'#ffe9bb',accent:'#a8e8ff',freq:1300,end:480,wave:'triangle'},
nova:{color:'#9ee6ff',accent:'#fff4c3',freq:90,end:600,wave:'sine'},
mines:{color:'#ffc0d7',accent:'#ffdf9b',freq:150,end:65,wave:'triangle'},
gravity:{color:'#d0b4ff',accent:'#fff1ab',freq:65,end:170,wave:'sine'},
singularity:{color:'#edc1ff',accent:'#fff4e2',freq:55,end:320,wave:'sawtooth'}
};
for(let [i,w] of extraWeapons.entries())evoStyles[w[0]]={color:w[3],accent:['#efffff','#ffe6af','#f7d6ff'][i%3],freq:160+i*115,end:70+i*35,wave:i%2?'triangle':'sawtooth'};
function evolvedSound(id){let a=audioEngine,d=evoStyles[id];if(!a||!d||audioPrefs.mute||audioPrefs.master<=0||audioPrefs.effects<=0||document.hidden||a.ctx.state!=='running')return;let now=a.ctx.currentTime,key='evo_'+id,interval=id==='rapid'?.11:id==='blade'?.55:.16;if(now-(a.last[key]===undefined?-999:a.last[key])<interval)return;a.last[key]=now;let duration=['cannon','nova','gravity','singularity'].includes(id)?.34:.15;tone(d.freq,d.end,duration,d.wave,.075);tone(d.freq*.5,Math.max(25,d.end*.75),duration*1.2,'sine',.055,now+.012);if(['cannon','scatter','rocket','chain','toxic','mines'].includes(id))noiseSound(.12,.065,id==='toxic'?550:2400);if(['bolt','arc','frost','seeker'].includes(id))tone(d.freq*1.5,d.end*1.5,.13,'sine',.045,now+.05)}
function celebrateEvolution(id){let e=evolutions.find(e=>e.id===id),style=evoStyles[id];if(!e||!style)return;$('evolutionReveal').style.setProperty('--evo',style.color);$('evolutionRevealName').textContent=e.name.toUpperCase();$('evolutionRevealEffect').textContent=evolutionSignatures[id]?.desc||e.desc;signatureState().clock[id]=0;$('evolutionReveal').classList.remove('reveal');void $('evolutionReveal').offsetWidth;$('evolutionReveal').classList.add('reveal');sound('evolve');s.fx.push({type:'ring',x:s.p.x,y:s.p.y,r:100,c:style.color,life:.7,max:.7});emit(s.p.x,s.p.y,style.color,32,220)}
// v0.90 Sound pass. Effects are generated with ZzFX's sample builder (MIT, Frank Force — vendor/zzfx-1.4.0/LICENSE),
// pre-rendered once into AudioBuffers, then played through the effects bus with stereo position, small pitch
// variation and per-sound voice limits. Anything without a ZzFX entry still uses the older synth below.
function zzfxBuild(rate,volume=1,randomness=.05,frequency=220,attack=0,sustain=0,release=.1,shape=0,shapeCurve=1,slide=0,deltaSlide=0,pitchJump=0,pitchJumpTime=0,repeatTime=0,noise=0,modulation=0,bitCrush=0,delay=0,sustainVolume=1,decay=0,tremolo=0,filter=0){
 let sampleRate=rate,PI2=Math.PI*2,abs=Math.abs,sign=v=>v<0?-1:1,startSlide=slide*=500*PI2/sampleRate/sampleRate,startFrequency=frequency*=PI2/sampleRate,modOffset=0,repeat=0,crush=0,jump=1,length,b,t=0,i=0,s=0,f,
 quality=2,w=PI2*abs(filter)*2/sampleRate,cos=Math.cos(w),alpha=Math.sin(w)/2/quality,a0=1+alpha,a1=-2*cos/a0,a2=(1-alpha)/a0,b0=(1+sign(filter)*cos)/2/a0,b1=-(sign(filter)+cos)/a0,b2=b0,x2=0,x1=0,y2=0,y1=0;
 attack=attack*sampleRate||9;decay*=sampleRate;sustain*=sampleRate;release*=sampleRate;delay*=sampleRate;deltaSlide*=500*PI2/sampleRate**3;modulation*=PI2/sampleRate;pitchJump*=PI2/sampleRate;pitchJumpTime*=sampleRate;repeatTime=repeatTime*sampleRate|0;
 length=attack+decay+sustain+release+delay|0;b=new Float32Array(length>0?length:0);let ns=0x2f6e2b1;const rnd=()=>{ns=(Math.imul(ns,1664525)+1013904223)>>>0;return ns/4294967296};
 for(;i<length;b[i++]=s*volume){
  if(!(++crush%(bitCrush*100|0))){
   s=shape?shape>1?shape>2?shape>3?shape>4?(t/PI2%1<shapeCurve/2?1:-1):Math.sin(t**3):Math.max(Math.min(Math.tan(t),1),-1):1-(2*t/PI2%2+2)%2:1-4*abs(Math.round(t/PI2)-t/PI2):Math.sin(t);
   s=(repeatTime?1-tremolo+tremolo*Math.sin(PI2*i/repeatTime):1)*(shape>4?s:sign(s)*abs(s)**shapeCurve)*(i<attack?i/attack:i<attack+decay?1-((i-attack)/decay)*(1-sustainVolume):i<attack+decay+sustain?sustainVolume:i<length-delay?(length-i-delay)/release*sustainVolume:0);
   s=delay?s/2+(delay>i?0:(i<length-delay?1:(length-i)/delay)*b[i-delay|0]/2/volume):s;
   if(filter)s=y1=b2*x2+b1*(x2=x1)+b0*(x1=s)-a2*y2-a1*(y2=y1)}
  f=(frequency+=slide+=deltaSlide)*Math.cos(modulation*modOffset++);t+=f+f*noise*(rnd()*2-1);
  if(jump&&++jump>pitchJumpTime){frequency+=pitchJump;startFrequency+=pitchJump;jump=0}
  if(repeatTime&&!(++repeat%repeatTime)){frequency=startFrequency;slide=startSlide;jump||=1}}
 return b}
// [volume, randomness, frequency, attack, sustain, release, shape, shapeCurve, slide, deltaSlide, pitchJump, pitchJumpTime, repeatTime, noise, modulation, bitCrush, delay, sustainVolume, decay, tremolo, filter]
const sfxBank={
 pew:[.55,0,880,0,.02,.07,2,1.5,-30,0,0,0,0,0,0,0,0,.7,.01,0,2600],
 needle:[.32,0,1500,0,.01,.035,1,1,-60,0,0,0,0,0,0,0,0,.6,.005,0,0],
 shotgun:[.85,0,95,0,.04,.22,3,2,-4,0,0,0,0,.6,0,0,0,.5,.03,0,1800],
 missile:[.55,0,300,.02,.08,.26,4,1,8,0,0,0,0,.8,0,0,0,.4,.05,0,2200],
 zap:[.45,0,1200,0,.03,.12,2,1,0,0,0,0,.02,.3,8,0,0,.6,.02,.4,0],
 laser:[.42,0,1800,.005,.08,.18,2,2,-40,0,0,0,0,0,0,0,.04,.7,.02,0,4000],
 ice:[.42,0,2200,0,.02,.3,1,1,-8,0,600,.04,0,0,0,0,.05,.6,.02,0,0],
 goo:[.5,0,140,.01,.1,.25,0,1,-2,0,0,0,.05,.4,0,0,0,.6,.03,.6,600],
 pulse:[.8,0,60,.02,.12,.45,0,1.5,3,0,0,0,0,.1,0,0,0,.7,.08,0,700],
 thunk:[.5,0,180,0,.02,.12,1,1,-5,0,0,0,0,.2,0,0,0,.6,.01,0,1200],
 comet:[.5,0,220,.03,.1,.3,4,1,-3,0,0,0,0,1,0,0,0,.5,.05,0,1500],
 gem:[.38,0,1500,0,.01,.08,0,1,0,0,500,.02,0,0,0,0,0,.8,.01,0,0],
 coin:[.45,0,1600,0,.02,.18,1,1,0,0,700,.05,0,0,0,0,0,.8,.01,0,0],
 kill:[.55,0,110,0,.03,.22,4,1.4,-2,0,0,0,0,1,0,0,0,.5,.05,0,1300],
 killBig:[.85,0,70,0,.08,.45,4,1.3,-1,0,0,0,0,1,0,0,.03,.5,.08,0,1000],
 explosion:[.95,0,70,0,.06,.42,4,1.5,-1,0,0,0,0,1,0,0,0,.5,.1,0,900],
 reactorBlast:[1,0,40,0,.3,1.2,4,1.2,-.5,0,0,0,0,1,0,0,.1,.4,.2,0,500],
 shipBurst:[.8,0,90,0,.05,.3,4,1.4,-2,0,0,0,0,1,0,0,0,.5,.06,0,1100],
 hurt:[.75,0,220,0,.03,.2,3,2,-15,0,0,0,0,.4,0,.2,0,.6,.02,0,0],
 dash:[.55,0,400,.02,.05,.15,4,1,30,0,0,0,0,1,0,0,0,.5,.03,0,3000],
 boss:[1,0,55,.2,.6,.8,2,1.5,0,0,0,0,0,.1,2,0,.2,.8,.2,.3,400],
 bossFire:[.65,0,160,0,.04,.2,2,2,-6,0,0,0,0,.3,0,0,0,.6,.02,0,900],
 ui:[.22,0,900,0,.005,.03,1,1,0,0,0,0,0,0,0,0,0,.5,.005,0,0]
};
function sfxRender(rate,p){let pcm=zzfxBuild(rate,...p),peak=0;for(let i=0;i<pcm.length;i++)peak=Math.max(peak,Math.abs(pcm[i]));let k=peak>p[0]?p[0]/peak:1;if(k<1)for(let i=0;i<pcm.length;i++)pcm[i]*=k;return pcm}
const sfxFamily={bolt:'pew',crossfire:'pew',prismTrace:'pew',twinWisps:'pew',rapid:'needle',nanite:'needle',scatter:'shotgun',cannon:'shotgun',flak:'shotgun',mortar:'shotgun',scrap:'shotgun',rocket:'missile',seeker:'missile',harpoon:'missile',phaseTorp:'missile',arc:'zap',chain:'zap',prism:'zap',echoRing:'zap',ionGuard:'zap',buoy:'zap',laser:'laser',rail:'laser',sails:'laser',fence:'laser',spire:'laser',ionCurtain:'laser',plasmaWhip:'laser',leech:'laser',frost:'ice',cryoCharge:'ice',stasisNet:'ice',toxic:'goo',plasmaRain:'goo',voidSeed:'goo',ember:'goo',nova:'pulse',gravity:'pulse',singularity:'pulse',sonic:'pulse',ram:'pulse',rupture:'pulse',corona:'pulse',mines:'thunk',saw:'thunk',blade:'zap',cometAxe:'comet',crescent:'comet'};
const sfxLimits={kill:5,gem:4,coin:3,needle:3,pew:4,explosion:4,killBig:3,hurt:2,zap:3,laser:3,shotgun:3,missile:3};
const sfxBuffers=new Map,sfxPlaying=new Map;let sfxGemStreak={n:0,at:-9};
function sfxBuffer(name){let a=audioEngine;if(!a||!sfxBank[name])return null;let b=sfxBuffers.get(name);if(b)return b;try{let rate=a.ctx.sampleRate,pcm=sfxRender(rate,sfxBank[name]);b=a.ctx.createBuffer(1,Math.max(1,pcm.length),rate);b.getChannelData(0).set(pcm);sfxBuffers.set(name,b);return b}catch(e){return null}}
function sfxPrewarm(){let names=Object.keys(sfxBank),i=0;let step=()=>{if(!audioEngine||i>=names.length)return;sfxBuffer(names[i++]);setTimeout(step,12)};step()}
function playSfx(name,x,opts={}){let a=audioEngine,buf=sfxBuffer(name);if(!a||!buf)return false;let live=sfxPlaying.get(name)||0;if(live>=(sfxLimits[name]||4)||a.voices>=40)return true;
 try{let src=a.ctx.createBufferSource(),g=a.ctx.createGain(),out=g;src.buffer=buf;src.playbackRate.value=(opts.rate||1)*(.96+Math.random()*.08);let vol=(opts.vol??1)*.42;
  if(x!==undefined&&s&&s.p){let dx=(x-s.p.x)/Math.max(200,W*.6);vol*=Math.max(.25,1-Math.max(0,Math.abs(dx)-.8)*.6);if(a.ctx.createStereoPanner){let p=a.ctx.createStereoPanner();p.pan.value=Math.max(-.85,Math.min(.85,dx));g.connect(p);out=p}}
  g.gain.value=vol;src.connect(g);out.connect(a.effects);sfxPlaying.set(name,live+1);a.voices++;src.onended=()=>{a.voices=Math.max(0,a.voices-1);sfxPlaying.set(name,Math.max(0,(sfxPlaying.get(name)||1)-1))};src.start()}catch(e){return false}return true}
// Vampire Survivors style: quick runs of gem pickups climb in pitch.
function sfxGem(){let a=audioEngine;if(!a)return false;let now=a.ctx.currentTime;sfxGemStreak.n=now-sfxGemStreak.at<.55?Math.min(16,sfxGemStreak.n+1):0;sfxGemStreak.at=now;return playSfx('gem',undefined,{rate:1+sfxGemStreak.n*.045,vol:.8})}

function sound(id,x){let fam=sfxFamily[id];let a=audioEngine;if(!a||audioPrefs.mute||audioPrefs.master===0||audioPrefs.effects===0||a.ctx.state!=='running'||document.hidden)return;let now=a.ctx.currentTime,gap=id==='gem'?.03:id==='kill'?.035:id==='rapid'||fam==='needle'?.07:id==='explosion'?.07:.06;if(now-(a.last[id]===undefined?-999:a.last[id])<gap)return;a.last[id]=now;
if(id==='gem'&&sfxGem())return;if(fam&&playSfx(fam,x))return;if(sfxBank[id]&&playSfx(id,x))return;id=({scatter:'cannon',arc:'laser',mines:'pickup',gravity:'nova',singularity:'laser'})[id]||id;
if(id==='abilityReady'){tone(620,820,.06,'sine',.02)}
else if(id==='reelTick')tone(1500,1350,.025,'square',.01);
else if(id==='cacheOpen'){noiseSound(.14,.03,2600);tone(180,620,.18,'sine',.035)}
else if(id==='jackpotBonus'){tone(660,990,.14,'triangle',.035);tone(880,1320,.2,'sine',.026,a.ctx.currentTime+.08)}
else if(id==='jackpot'){tone(523,1046,.2,'triangle',.04);tone(659,1318,.24,'triangle',.034,a.ctx.currentTime+.1);tone(784,1568,.34,'sine',.032,a.ctx.currentTime+.2);noiseSound(.25,.02,5000)}
else if(id==='contactKinetic')tone(520,190,.035,'triangle',.024);
else if(id==='contactArmour'){tone(1100,360,.065,'triangle',.025);noiseSound(.035,.018,3200)}
else if(id==='contactEnergy')tone(950,450,.055,'sine',.021);
else if(id==='contactHeavy'){tone(125,42,.12,'sine',.048);noiseSound(.05,.027,1700)}
else if(id==='contactCritical'){tone(1550,660,.07,'triangle',.035);tone(310,100,.08,'sine',.024)}
else if(id==='purgeWave'){tone(42,24,1.1,'sine',.15);tone(180,38,.85,'triangle',.08);noiseSound(.7,.1,900)}
else if(id==='cryoWave'){tone(1900,430,.8,'triangle',.06);tone(620,2100,.5,'sine',.045);noiseSound(.3,.045,6000)}
else if(id==='evolve'){for(let i=0;i<5;i++)tone([196,294,392,494,784][i],[220,330,440,554,880][i],.5,'triangle',.07,now+i*.09);noiseSound(.35,.06,1800)}
else if(id==='bolt')tone(850,250,.09,'square',.045);
else if(id==='rapid')tone(1400,550,.055,'triangle',.085);
else if(id==='cannon'||id==='rocket'){tone(170,35,.24,'sawtooth',.1);noiseSound(.14,.12,850)}
else if(id==='shipBurst'){tone(180,42,.15,'triangle',.07);tone(720,190,.05,'triangle',.025);noiseSound(.1,.055,1800)}
else if(id==='reactorBlast'){tone(65,22,.85,'sine',.13);noiseSound(.55,.11,1100)}
else if(id==='explosion'){tone(100,25,.32,'sine',.17);tone(650,130,.055,'triangle',.025);noiseSound(.3,.17,1400)}
else if(id==='chain'){tone(1800,180,.15,'sawtooth',.055);noiseSound(.1,.06,4500)}
else if(id==='frost')tone(2200,700,.15,'triangle',.07);
else if(id==='laser')tone(950,80,.25,'sawtooth',.06);
else if(id==='seeker')tone(450,1300,.16,'sine',.08);
else if(id==='toxic'){tone(160,70,.25,'sine',.08);noiseSound(.18,.07,400)}
else if(id==='nova'){tone(90,420,.32,'triangle',.1);noiseSound(.2,.06,1700)}
else if(id==='blade')tone(1100,400,.07,'triangle',.04);
else if(id==='gem')tone(1100,1600,.07,'sine',.065);
else if(id==='pickup'||id==='cache'){for(let i=0;i<3;i++)tone([523,659,784][i],[523,659,784][i],.14,'sine',.09,now+i*.065)}
else if(id==='dash'){noiseSound(.17,.08,2800);tone(230,950,.16,'triangle',.065)}
else if(id==='hurt'){tone(180,55,.2,'square',.065);noiseSound(.12,.08,1600)}
else if(id==='boss'){for(let i=0;i<3;i++)tone(90+i*30,70+i*20,.45,'sawtooth',.065,now+i*.23)}
else if(id==='bossFire')tone(260,90,.2,'square',.07);
else if(id==='reward'||id==='level'||id==='win'){for(let i=0;i<4;i++)tone([392,494,587,784][i],[392,494,587,784][i],.3,'triangle',.09,now+i*.09)}
else if(id==='lose')tone(300,40,.65,'triangle',.13)}