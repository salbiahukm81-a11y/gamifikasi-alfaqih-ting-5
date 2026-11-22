/* Gamifikasi Alfaqih – enjin game PAI Tingkatan 5 · @powered by alfaqih */
(function(){
'use strict';
const L = window.LESSON;
const FORM = L.form||5;
document.title = `${L.game} – P${L.no} ${L.title} | Gamifikasi Alfaqih T${FORM}`;
const root = document.documentElement;
if(L.theme){root.style.setProperty('--a',L.theme.a);root.style.setProperty('--b',L.theme.b)}
['https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Amiri:wght@400;700&family=Lexend:wght@400;600;700;800;900&display=swap'].forEach(h=>{const l=document.createElement('link');l.rel='stylesheet';l.href=h;document.head.appendChild(l)});
const TS = window.__TS||1; /* skala masa (ujian sahaja) */

/* ---------- tetapan level (dalaman sahaja) ---------- */
const DIFF={
  1:{time:28,opts:3,lives:4,bubT:15,preview:5000,mult:1,decoy:false},
  2:{time:20,opts:4,lives:3,bubT:11,preview:3000,mult:1.5,decoy:false},
  3:{time:13,opts:4,lives:3,bubT:8,preview:1500,mult:2,decoy:true},
};
const TYPE_LABEL={live:'Live Quiz',connect:'Matching Game',timed:'Timed Challenge',escape:'Escape Room',wheel:'Lucky Wheel',tower:'Tower Defense',collect:'Point Collector',crossword:'Crossword Puzzle',mystery:'Mystery Box',team:'Team Battle',match:'Memory Match',swipe:'True or False',maze:'Maze Challenge',treasure:'Treasure Hunt',wordsearch:'Word Search',spin:'Spin & Answer',ladder:'Leaderboard Challenge',flash:'Flashcard Battle',picture:'Guess the Picture',levelup:'Level Up Mission',
 mcq:'Kuiz Pantas',tf:'Benar / Salah',sort:'Asingkan',order:'Susun Tertib',chain:'Sambung Ayat',bubble:'Pecah Gelembung',pick:'Pilih Tepat',boss:'Pertarungan Bos'};
const TYPE_ICON={live:'📡',connect:'🔗',timed:'⏱️',escape:'🔐',wheel:'🎰',tower:'🏰',collect:'💎',crossword:'✏️',mystery:'🎁',team:'⚔️',match:'🧠',swipe:'👍',maze:'🌀',treasure:'🗺️',wordsearch:'🔎',spin:'🎡',ladder:'📶',flash:'🃏',picture:'🖼️',levelup:'🚀',mcq:'⚡',tf:'✔️',sort:'🗂️',order:'🔢',chain:'⛓️',bubble:'🫧',pick:'🎯',boss:'👹'};
const TYPE_HOW={
 live:'Kuiz langsung! Pilih jawapan berwarna sebelum kiraan tamat. Lebih pantas, lebih banyak mata. Kalahkan 3 pesaing di papan skor.',
 connect:'Sentuh satu kad di kiri, kemudian kad padanannya di kanan.',
 timed:'Jawab sebanyak mungkin soalan sebelum masa tamat. Capai sasaran!',
 escape:'Jawab soalan setiap bilik untuk membuka pintu dan kumpul nombor kod. Masukkan kod untuk melarikan diri sebelum masa tamat. Jawapan salah = masa ditolak!',
 wheel:'Putar roda nasib untuk dapat pengganda mata, kemudian jawab soalan.',
 tower:'Musuh sedang mara! Jawab dengan betul untuk menembak musuh sebelum ia sampai ke menara.',
 collect:'Pilih permata dan jawab soalannya. Kumpul seberapa banyak mata ke dalam bank!',
 crossword:'Sentuh petunjuk, taip jawapan dan tekan SEMAK untuk mengisi silang kata.',
 mystery:'Buka kotak misteri satu demi satu. Ada soalan, bonus, ganda dua… dan perangkap!',
 team:'Dua pasukan bergilir menjawab. Jawapan betul menarik tali ke arah pasukan anda. Jika salah, pasukan lawan boleh CURI!',
 match:'Ingat kedudukan kad, kemudian buka dua kad yang sepadan.',
 swipe:'Tentukan pernyataan BENAR atau SALAH. Leret kad ke kanan (benar) atau kiri (salah).',
 maze:'Setiap jawapan ialah arah. Pilih jawapan betul untuk bergerak ke pintu keluar. Jawapan salah = jalan buntu!',
 treasure:'Ikut petunjuk di peta. Setiap jawapan betul membawa anda lebih dekat kepada harta karun!',
 wordsearch:'Cari perkataan tersembunyi. Sentuh huruf pertama dan huruf terakhir (atau leret).',
 spin:'Putar roda kategori, kemudian jawab soalan daripada kategori yang terpilih.',
 ladder:'Kumpul mata dan panjat papan kedudukan. Potong pesaing untuk ke tempat pertama!',
 flash:'Lawan Bot! Pilih jawapan kad imbas sebelum Bot menjawab dahulu.',
 picture:'Gambar misteri terbuka sedikit demi sedikit. Teka lebih awal untuk mata lebih tinggi!',
 levelup:'Naik tahap daripada REKRUT ke LEGENDA. Setiap tahap lebih mencabar. Kumpul lencana!',
 mcq:'Pilih jawapan yang tepat sebelum masa tamat.',tf:'Tentukan BENAR atau SALAH secepat mungkin.',sort:'Masukkan setiap kad ke kumpulan yang betul.',order:'Sentuh item mengikut tertib yang betul.',chain:'Pilih sambungan bacaan yang betul.',bubble:'Pecahkan gelembung jawapan yang betul sebelum ia terlepas!',pick:'Pilih label yang tepat bagi setiap soalan.',boss:'Jawab dengan tepat untuk menumpaskan bos. Nyawa terhad!'};

/* ---------- keadaan ---------- */
const KEY=`alfaqih_t${FORM}_`+L.id;
const fresh=()=>({name:'',lv:2,st:L.stages.map(()=>({stars:0,score:0}))});
let S=fresh();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const load=()=>{try{const v=JSON.parse(localStorage.getItem(KEY));if(v&&v.st&&v.st.length===L.stages.length)return v}catch(e){}return null};
let sound=true;
let AUTO=null; window.__AUTO=()=>{if(AUTO)AUTO()};

/* ---------- util ---------- */
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const totStars=()=>S.st.reduce((s,x)=>s+x.stars,0);
const totScore=()=>S.st.reduce((s,x)=>s+x.score,0);
const MAXS=L.stages.length*3;
const isAr=s=>/[؀-ۿ]/.test(s)&&!/[a-zA-Z]{3,}/.test(s);
const keys='ABCD';
const txt=s=>isAr(s)?`<span class="ar">${s}</span>`:(String(s).includes('<')?s:esc(s));
const B=k=>typeof k==='string'?(L.bank[k]||[]):(Array.isArray(k)&&k.length&&k.every(x=>typeof x==='string'&&L.bank&&L.bank[x])?k.flatMap(x=>L.bank[x]):(k||[]));
/* soalan aneka pilihan: [soalan,[betul,salah...],penerangan,{tambahan}] atau objek */
const nq=x=>{if(Array.isArray(x)){const[q,o,ex,more]=x;return Object.assign({q,o,a:0,ex},more||{})}return Object.assign({a:0},x)};
const ntf=x=>Array.isArray(x)?{t:x[0],a:!!x[1],ex:x[2]}:x;
const pool=g=>B(g.data).map(nq);
const take=(arr,n)=>shuf(arr).slice(0,Math.min(n,arr.length));
const NQ=()=>({1:8,2:10,3:12}[S.lv]);
function mk(q,n){const idxs=q.o.map((_,k)=>k);const wrong=shuf(idxs.filter(k=>k!==q.a)).slice(0,Math.max(1,Math.min(n,q.o.length)-1));const pick=shuf([q.a,...wrong]);return{...q,opts:pick.map(k=>q.o[k]),ans:pick.indexOf(q.a)}}
const BOTS=['Aisyah','Hakim','Nurul','Irfan','Sofea','Danial','Balqis','Haziq','Alya','Umar','Zara','Firdaus','Iman','Adam','Hana','Rayyan'];

/* ---------- bunyi ---------- */
let AC=null;
function sfx(t){if(!sound)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();
 const N={ok:[[660,.07,'triangle'],[990,.12,'triangle']],no:[[180,.16,'sawtooth'],[120,.2,'sawtooth']],win:[[523,.1,'square'],[659,.1,'square'],[784,.1,'square'],[1046,.35,'triangle']],tap:[[600,.04,'triangle']],star:[[1175,.12,'triangle']],pop:[[1300,.05,'sine'],[900,.06,'sine']],hit:[[150,.1,'sawtooth'],[70,.2,'square']],combo:[[880,.06,'square'],[1320,.12,'square']],tick:[[1500,.02,'square']],spin:[[400,.03,'square'],[500,.03,'square'],[600,.03,'square']],coin:[[988,.06,'square'],[1319,.16,'square']],boom:[[90,.25,'sawtooth'],[50,.3,'square']],door:[[220,.12,'triangle'],[330,.12,'triangle'],[440,.2,'triangle']],lvup:[[523,.08,'square'],[784,.08,'square'],[1046,.08,'square'],[1568,.3,'triangle']]}[t]||[[440,.1,'sine']];
 let at=AC.currentTime;N.forEach(([f,d,w])=>{const o=AC.createOscillator(),g=AC.createGain();o.type=w;o.frequency.value=f;g.gain.setValueAtTime(.14,at);g.gain.exponentialRampToValueAtTime(.001,at+d);o.connect(g);g.connect(AC.destination);o.start(at);o.stop(at+d+.02);at+=d*.9})}catch(e){}}

/* ---------- fx ---------- */
let cv,cx,parts=[];
function confetti(n=140){const cols=['#22D3EE','#A78BFA','#FFC83D','#2EE59D','#FF4D6D','#fff'];const st=!parts.length;
 for(let i=0;i<n;i++)parts.push({x:innerWidth/2,y:innerHeight*.35,vx:(Math.random()-.5)*18,vy:Math.random()*-15-4,r:Math.random()*8+4,c:cols[i%cols.length],a:Math.random()*6,life:110+Math.random()*70});if(st)loop()}
function loop(){cx.clearRect(0,0,cv.width,cv.height);parts.forEach(p=>{p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.a+=.2;p.life--;cx.save();cx.translate(p.x,p.y);cx.rotate(p.a);cx.fillStyle=p.c;cx.fillRect(-p.r/2,-p.r/3,p.r,p.r*.6);cx.restore()});
 parts=parts.filter(p=>p.life>0&&p.y<cv.height+40);if(parts.length)requestAnimationFrame(loop);else cx.clearRect(0,0,cv.width,cv.height)}
function toast(t,c){const e=$('toast');e.textContent=t;e.style.color=c||'var(--a)';e.style.textShadow=`0 0 30px ${c||'var(--a)'}`;e.classList.remove('go');void e.offsetWidth;e.classList.add('go')}
function flash(){const p=$('play');if(!p)return;p.classList.remove('flash');void p.offsetWidth;p.classList.add('flash')}
let tmr=null,bubT=[],autoT=null,GC=null,ivs=[];
const later=(f,ms)=>{const t=setTimeout(f,ms);bubT.push(t);return t};
function startTimer(sec,onEnd){stopTimer();const el=$('tm');const bar=el.querySelector('i');const t0=performance.now();let lastTick=0;
 tmr=setInterval(()=>{const left=sec-(performance.now()-t0)/1000;const p=Math.max(0,left/sec);bar.style.width=(p*100)+'%';el.classList.toggle('warn',p<.3);
  if(p<.3&&left>0&&Math.ceil(left)!==lastTick){lastTick=Math.ceil(left);sfx('tick')}
  if(left<=0){stopTimer();onEnd()}},80);
 return()=>Math.max(0,sec-(performance.now()-t0)/1000)}
function stopTimer(){if(tmr){clearInterval(tmr);tmr=null}}
/* jam global untuk satu misi (Timed/Escape/Word Search) */
function gclock(sec,onEnd,clkId){if(GC)GC.stop();let end=performance.now()+sec*1000;const iv=setInterval(()=>{const left=(end-performance.now())/1000;const p=Math.max(0,left/sec);const el=$('gtm');if(el){el.querySelector('i').style.width=Math.min(100,p*100)+'%';el.classList.toggle('warn',p<.25)}
  const c=clkId&&$(clkId);if(c){const s=Math.max(0,Math.ceil(left));c.textContent=s>=60?`${s/60|0}:${String(s%60).padStart(2,'0')}`:s+'s';c.classList.toggle('warn',p<.25)}
  if(left<=0){clearInterval(iv);GC=null;onEnd()}},100);
 GC={stop(){clearInterval(iv)},add(s){end+=s*1000},left:()=>Math.max(0,(end-performance.now())/1000)};return GC}
function clearAll(){stopTimer();bubT.forEach(clearTimeout);bubT=[];if(autoT){clearTimeout(autoT);autoT=null}if(GC){GC.stop();GC=null}ivs.forEach(clearInterval);ivs=[];AUTO=null}

/* ---------- kerangka ---------- */
const BID={'Al-Quran':'📖','Hadis':'📜','Akidah':'☝️','Fiqh':'🕋','Sirah dan Tamadun Islam':'🏛️','Akhlak Islamiah':'💎'};
document.body.innerHTML=`
<canvas id="fx"></canvas><div class="toast" id="toast"></div>
<div class="wrap">
 <div class="hud glass" id="hud" style="display:none">
  <div class="who"><div class="ava">${L.theme&&L.theme.icon||'🎮'}</div><div><div id="hName" style="line-height:1.1">-</div><div style="font-size:.8rem;color:var(--mut);font-weight:600">P${L.no} · ${esc(L.game)}</div></div></div>
  <div class="pill lv" id="hLv">Level 2</div>
  <div class="pill">⭐ <span id="hStars">0</span>/${MAXS}</div>
  <div class="pill">⚡ <span id="hScore">0</span></div>
  <button class="ibtn" id="sndBtn">🔊</button><button class="ibtn" id="fcTop">🃏 Nota</button><button class="ibtn" id="mapBtn">🗺️ Misi</button>
 </div>

 <section class="scr on" id="sSplash"><div class="glass splash">
  <div class="kicker">${BID[L.bidang]||'🎮'} ${esc(L.bidang)} · Pelajaran ${L.no}</div>
  <div class="emblem">${L.theme&&L.theme.icon||'🎮'}</div>
  <div class="gtitle">${esc(L.game)}</div>
  <div class="gsub">${esc(L.title)}</div>
  ${L.hero&&L.hero.ar?`<div class="ar hero-ar">${L.hero.ar}</div>`:''}
  ${L.hero&&L.hero.ms?`<div class="hero-ms">${esc(L.hero.ms)}</div>`:''}
  <div class="gchips">${L.stages.map(g=>`<span class="gchip">${TYPE_ICON[g.type]} ${TYPE_LABEL[g.type]}</span>`).join('')}</div>
  <div class="namebox"><label for="nameIn">NAMA PEMAIN</label><input id="nameIn" maxlength="22" autocomplete="off" placeholder="Taip nama anda"></div>
  <div class="levels" id="levels">${[1,2,3].map(n=>`<button class="lvl${n===2?' sel':''}" data-l="${n}"><span class="i">${['🥉','🥈','🥇'][n-1]}</span>Level ${n}<div class="bars">${[1,2,3].map(k=>`<i class="${k<=n?'f':''}"></i>`).join('')}</div></button>`).join('')}</div>
  <div class="row"><button class="btn gold" id="startBtn">▶ Mula Main</button><button class="btn ghost" id="fcSplash">🃏 Nota Flash Card</button></div>
  <div class="row mt"><button class="btn ghost sm" id="resumeBtn" style="display:none"></button></div>
  ${L.ref?`<div class="ref">📗 ${esc(L.ref)}</div>`:''}
 </div></section>

 <section class="scr" id="sMap">
  <div class="maphead"><div><h2>${L.theme&&L.theme.icon||'🎮'} Pilih Misi</h2><p>Lengkapkan misi untuk membuka misi seterusnya.</p></div>
   <div class="xpbar"><div class="t"><span>KEMAJUAN</span><span id="xpT">0/${MAXS} ⭐</span></div><div class="bar"><i id="xpB"></i></div></div></div>
  <div class="missions" id="missions"></div>
  <div class="mapbar"><button class="btn ghost sm" id="revBtn">🃏 Nota Flash Card</button><button class="btn gold sm" id="certBtn" style="display:none">🏆 Sijil</button><button class="btn ghost sm" id="lbBtn">🏅 Papan Juara</button></div>
 </section>

 <section class="scr" id="sBrief"><div class="glass brief"><div class="ic" id="bIc"></div><div class="kicker" id="bNo"></div><h2 id="bNm"></h2><p id="bDesc"></p><div class="howto" id="bHow"></div>
  <div class="row"><button class="btn ghost" id="bBack">◀ Kembali</button><button class="btn gold" id="bGo">⚔️ Mula Misi</button></div></div></section>

 <section class="scr" id="sPlay"><div class="glass play" id="play"></div></section>

 <section class="scr" id="sRes"><div class="glass res"><h2 id="rT"></h2><div class="stars" id="rS"><span>★</span><span>★</span><span>★</span></div>
  <div class="bigscore">+<span id="rP">0</span></div><div class="stats" id="rStats"></div><div id="rB"></div><p class="msg" id="rM"></p>
  <div class="row"><button class="btn ghost" id="rRetry">↻ Main Semula</button><button class="btn gold" id="rNext">Teruskan ▶</button></div></div></section>

 <section class="scr" id="sCert"><div class="glass cert"><div class="emblem">🏆</div><div class="kicker">Pelajaran ${L.no} · ${esc(L.title)}</div>
  <h2>${esc(L.cert&&L.cert.title||'SIJIL PENCAPAIAN')}</h2><div style="font-weight:700;color:var(--mut)">Dengan ini diakui bahawa</div><div class="nm" id="cN"></div>
  <div style="font-weight:700;color:var(--mut)">telah menamatkan semua misi <b style="color:var(--txt)">${esc(L.game)}</b></div>
  <div class="rank mt" id="cR"></div><div class="stars" id="cS" style="font-size:2.6rem;letter-spacing:4px"></div><div class="bigscore" id="cP"></div><div id="cB"></div>
  ${L.cert&&L.cert.ar?`<div class="ar" style="font-size:1.8rem;margin-top:10px">${L.cert.ar}</div>`:''}${L.cert&&L.cert.ms?`<p class="msg">${esc(L.cert.ms)}</p>`:''}
  <div class="row mt"><button class="btn ghost" id="cMap">🗺️ Misi</button><button class="btn gold" id="cNew">🔁 Pemain Baharu</button></div></div></section>

 <div class="foot"><a href="../">🏠 Semua Game Tingkatan ${FORM}</a><span class="pw">@powered by alfaqih</span></div>
</div>
<div class="modal" id="mFc"><div class="glass fcbox"><div class="mh"><h2>🃏 Nota Flash Card · P${L.no}</h2><button class="ibtn" data-close="mFc">✖</button></div>
 <div class="fc-meta"><span id="fcN"></span><span id="fcK"></span></div>
 <div class="fc" id="fc"><div class="fc-in"><div class="fc-f"><small>❓ SOALAN / ISTILAH</small><div class="fc-t" id="fcF"></div><em>Sentuh kad untuk lihat jawapan ↻</em></div><div class="fc-b"><small>💡 JAWAPAN</small><div class="fc-t" id="fcB"></div></div></div></div>
 <div class="fc-bar"><i id="fcBar"></i></div>
 <div class="row"><button class="btn ghost sm" id="fcPrev">◀</button><button class="btn ghost sm" id="fcShuf">🔀 Kocok</button><button class="btn gold sm" id="fcKnow">✅ Saya Ingat</button><button class="btn ghost sm" id="fcNext">▶</button></div>
</div></div>
<div class="modal" id="mLb"><div class="glass"><div class="mh"><h2>🏅 Papan Juara</h2><button class="ibtn" data-close="mLb">✖</button></div>
 <table class="lb"><thead><tr><th>#</th><th>Nama</th><th>Level</th><th>⭐</th><th>⚡</th></tr></thead><tbody id="lbBody"></tbody></table><p class="msg" style="font-size:.95rem">Disimpan dalam peranti ini sahaja.</p></div></div>`;
cv=$('fx');cx=cv.getContext('2d');const rs=()=>{cv.width=innerWidth;cv.height=innerHeight};addEventListener('resize',rs);rs();

/* ---------- navigasi ---------- */
function go(id){clearAll();document.querySelectorAll('.scr').forEach(s=>s.classList.remove('on'));$(id).classList.add('on');$('hud').style.display=id==='sSplash'?'none':'flex';if(id==='sMap')renderMap();hud();scrollTo({top:0,behavior:'smooth'})}
function hud(){$('hName').textContent=S.name||'-';$('hLv').textContent='Level '+S.lv;$('hStars').textContent=totStars();$('hScore').textContent=totScore()}
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).classList.remove('on'));
document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('on')}));
document.querySelectorAll('.lvl').forEach(b=>b.onclick=()=>{document.querySelectorAll('.lvl').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');S.lv=+b.dataset.l;sfx('tap')});
$('startBtn').onclick=()=>{const n=$('nameIn').value.trim();if(!n){$('nameIn').classList.add('shake');$('nameIn').focus();sfx('no');setTimeout(()=>$('nameIn').classList.remove('shake'),400);return}const lv=S.lv;S=fresh();S.name=n;S.lv=lv;save();sfx('win');go('sMap')};
$('nameIn').addEventListener('keydown',e=>{if(e.key==='Enter')$('startBtn').click()});
const old=load();if(old&&old.name){$('resumeBtn').style.display='inline-flex';$('resumeBtn').textContent='↻ Sambung sebagai '+old.name+' (Level '+old.lv+')';$('resumeBtn').onclick=()=>{S=old;go('sMap')}}
$('mapBtn').onclick=()=>go('sMap');
$('sndBtn').onclick=()=>{sound=!sound;$('sndBtn').textContent=sound?'🔊':'🔇'};
$('lbBtn').onclick=()=>{renderLb();$('mLb').classList.add('on')};
$('certBtn').onclick=showCert;$('cMap').onclick=()=>go('sMap');$('cNew').onclick=()=>{$('nameIn').value='';go('sSplash')};
$('bBack').onclick=()=>go('sMap');

/* ---------- nota flash card ---------- */
const CARDS=(L.cards||[]);let fcO=CARDS.map((_,k)=>k),fcI=0,known=new Set();
try{(JSON.parse(localStorage.getItem(KEY+'_fc')||'[]')).forEach(k=>known.add(k))}catch(e){}
const fcFmt=s=>{s=String(s);if(isAr(s))return `<span class="ar">${s}</span>`;return s.split('\n').map(l=>l.trim()).join('<br>')};
function fcShow(){if(!CARDS.length)return;const k=fcO[fcI];const c=CARDS[k];$('fc').classList.remove('flip');
 setTimeout(()=>{$('fcF').innerHTML=fcFmt(c[0]);$('fcB').innerHTML=fcFmt(c[1])},120);
 $('fcN').textContent=`Kad ${fcI+1} / ${CARDS.length}`;$('fcK').textContent=`✅ Diingat: ${known.size}/${CARDS.length}`;$('fcBar').style.width=(known.size/CARDS.length*100)+'%';
 $('fcKnow').textContent=known.has(k)?'↩ Belum Ingat':'✅ Saya Ingat';$('fc').classList.toggle('known',known.has(k))}
function fcOpen(){fcI=0;fcShow();$('mFc').classList.add('on')}
$('fc').onclick=()=>{$('fc').classList.toggle('flip');sfx('tap')};
$('fcNext').onclick=()=>{fcI=(fcI+1)%CARDS.length;fcShow()};$('fcPrev').onclick=()=>{fcI=(fcI-1+CARDS.length)%CARDS.length;fcShow()};
$('fcShuf').onclick=()=>{fcO=shuf(fcO);fcI=0;fcShow();sfx('spin')};
$('fcKnow').onclick=()=>{const k=fcO[fcI];if(known.has(k))known.delete(k);else{known.add(k);sfx('ok')}try{localStorage.setItem(KEY+'_fc',JSON.stringify([...known]))}catch(e){}if(!known.has(k)){fcShow();return}fcI=(fcI+1)%CARDS.length;fcShow()};
document.addEventListener('keydown',e=>{if(!$('mFc').classList.contains('on'))return;if(e.key==='ArrowRight')$('fcNext').click();else if(e.key==='ArrowLeft')$('fcPrev').click();else if(e.key===' '){e.preventDefault();$('fc').click()}});
$('revBtn').onclick=fcOpen;$('fcSplash').onclick=fcOpen;$('fcTop').onclick=fcOpen;

/* ---------- peta ---------- */
const unlocked=i=>i===0||S.st[i-1].stars>0||L.stages[i].type==='team';
function renderMap(){
 $('missions').innerHTML=L.stages.map((g,i)=>{const st=S.st[i].stars,u=unlocked(i);return `<button class="mis ${st?'done':u?'open':'lock'}" data-i="${i}">
  ${u?'':'<span class="lockico">🔒</span>'}<div class="no">MISI ${i+1}</div><div class="ic">${g.emo}</div><div class="nm">${esc(g.name)}</div><div class="ty">${TYPE_ICON[g.type]} ${TYPE_LABEL[g.type]}</div>
  <div class="st">${[0,1,2].map(k=>`<span class="${k<st?'':'e'}">★</span>`).join('')}</div></button>`}).join('');
 $('missions').querySelectorAll('.mis').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(!unlocked(i)){b.classList.add('shake');sfx('no');setTimeout(()=>b.classList.remove('shake'),400);return}sfx('tap');brief(i)});
 $('xpT').textContent=`${totStars()}/${MAXS} ⭐`;setTimeout(()=>$('xpB').style.width=(totStars()/MAXS*100)+'%',60);
 $('certBtn').style.display=S.st.every(x=>x.stars>0)?'inline-flex':'none';
}
function brief(i){const g=L.stages[i];$('bIc').textContent=g.emo;$('bNo').textContent=`MISI ${i+1} · ${TYPE_ICON[g.type]} ${TYPE_LABEL[g.type]}`;$('bNm').textContent=g.name;$('bDesc').textContent=g.brief||'';$('bHow').textContent='🎯 '+TYPE_HOW[g.type];$('bGo').onclick=()=>{go('sPlay');RUN[g.type](g,i)};go('sBrief')}

/* ---------- komponen ---------- */
function head(title,{lives=0,max=0,boss=null}={}){return `<div class="phead"><span class="tag">${title}</span><div class="bar"><i id="pg"></i></div>
 ${max?`<span class="hearts" id="hearts">${'❤️'.repeat(lives)}${'🖤'.repeat(max-lives)}</span>`:''}<span class="combo" id="combo"></span><span class="score">⚡ <span id="ps">0</span></span></div>
 ${boss?`<div class="boss"><div class="face" id="bf">${boss.emo||'👹'}</div><div style="flex:1"><div class="nm">${esc(boss.name||'BOS')}</div><div class="hp"><i id="hp"></i></div></div></div>`:''}`}
const setPg=(a,b)=>{const p=$('pg');if(p)p.style.width=(a/b*100)+'%'};
const hearts=(n,m)=>{const h=$('hearts');if(h)h.textContent='❤️'.repeat(Math.max(0,n))+'🖤'.repeat(Math.max(0,m-n))};
function Score(){const d=DIFF[S.lv];return{score:0,ok:0,bad:0,streak:0,best:0,
 win(pts,quiet){this.ok++;this.streak++;this.best=Math.max(this.best,this.streak);const cb=this.streak>=3?40+this.streak*5:0;const g=Math.round(pts+cb*d.mult);this.score+=g;this.ui();
  if(!quiet){if(this.streak>=3){toast('🔥 COMBO x'+this.streak,'#FFC83D');sfx('combo')}else{toast(['HEBAT!','TEPAT!','POWER!','MANTAP!','SYABAS!'][Math.random()*5|0],'#2EE59D');sfx('ok')}}return g},
 hit(left,max,quiet){const tb=Math.round((left||0)/(max||1)*80);return this.win((100+tb)*d.mult,quiet)},
 miss(){this.bad++;this.streak=0;this.ui();sfx('no');flash()},
 ui(){const c=$('combo');if(c)c.textContent=this.streak>=2?'🔥x'+this.streak:'';const p=$('ps');if(p)p.textContent=this.score}}}
function fbShow(good,html,next,label,auto){const f=$('fb');f.className='fb on '+(good?'good':'bad');f.innerHTML=html+`<div class="row mt"><button class="btn gold sm" id="nx">${label||'Seterusnya ▶'}</button></div>`;
 const b=$('nx');let done=false;const fire=()=>{if(done)return;done=true;if(autoT){clearTimeout(autoT);autoT=null}f.className='fb';next()};b.onclick=fire;b.focus({preventScroll:true});if(auto)autoT=setTimeout(fire,auto);f.scrollIntoView({behavior:'smooth',block:'nearest'})}
const arWrap=s=>isAr(s)?`<span class="ar" style="font-size:1.5rem">${s}</span>`:esc(s);
const NXT=(more)=>more?'Seterusnya ▶':'Lihat Keputusan 🏁';
function optHTML(q,deco){const arAll=q.opts.every(isAr);return `<div class="opts ${arAll||q.opts.some(x=>x.length>60)?'one':''}">${q.opts.map((t,j)=>`<button class="opt ${isAr(t)?'ar':''}" data-o="${j}"><span class="k">${deco?deco[j]:keys[j]}</span><span>${isAr(t)?t:esc(t)}</span></button>`).join('')}</div>`}
const SHP=['▲','◆','●','■'];
function shapeHTML(q){return `<div class="shapes">${q.opts.map((t,j)=>`<button class="shp s${j} ${isAr(t)?'ar':''}" data-o="${j}"><span class="k">${SHP[j]}</span><span>${isAr(t)?t:esc(t)}</span></button>`).join('')}</div>`}
function qHTML(q){return `<div class="qcard"><div class="q">${q.q.includes('<')?q.q:esc(q.q)}</div>${q.ar?`<div class="ar qa">${q.ar}</div>`:''}${q.hint&&S.lv<3?`<div class="hint">💡 ${esc(q.hint)}</div>`:''}</div>`}
/* tanya satu soalan aneka pilihan dalam hos */
function ask(host,q,cfg){const n=cfg.n||DIFF[S.lv].opts;let it=mk(q,n);if(cfg.drop){const keep=it.opts.filter(o=>!cfg.drop.includes(o)||o===q.o[q.a]);it={...it,opts:keep,ans:keep.indexOf(q.o[q.a])}}
 const deco=cfg.deco?cfg.deco(it):null;
 host.innerHTML=(cfg.time?'<div class="timer" id="tm"><i></i></div>':'')+(cfg.pre||'')+(cfg.noq?'':qHTML(it))+(cfg.shape?shapeHTML(it):optHTML(it,deco));
 let left=()=>0,done=false;
 const fin=(ch,btn)=>{if(done)return;const right=ch===it.ans;
  if(cfg.retry&&!right&&ch>=0){btn.disabled=true;btn.classList.add('no');if(cfg.onWrong)cfg.onWrong(it.opts[ch]);return}
  done=true;if(cfg.time)stopTimer();AUTO=null;host.querySelectorAll('[data-o]').forEach(b=>{b.disabled=true;const v=+b.dataset.o;if(v===it.ans)b.classList.add('ok');else if(v===ch)b.classList.add('no');else b.classList.add('dim')});
  cfg.onDone(right,left(),ch,it)};
 host.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>fin(+b.dataset.o,b));
 if(cfg.time)left=startTimer(cfg.time,()=>fin(-1));
 AUTO=()=>{const b=host.querySelector(`[data-o="${it.ans}"]`);if(b)b.click()};
 return it}
const exOf=q=>q.ex?'<br>'+q.ex:'';
const ansOf=it=>`Jawapan: <b>${arWrap(it.o[it.a])}</b>`;

/* ---------- enjin soalan generik (gaya T4) ---------- */
function quiz(g,idx,o){
 const d=DIFF[S.lv];const sc=Score();let i=0,lives=o.lives||0,hp=100;const Q=o.qs;const dmg=o.boss?Math.ceil(100/Math.max(6,Math.round(Q.length*.8))):0;
 function draw(){
  const q=Q[i];
  $('play').innerHTML=head(`${g.emo} ${i+1}/${Q.length}`,{lives,max:o.lives||0,boss:o.boss?(g.boss||{}):null})+`<div class="timer" id="tm"><i></i></div>${o.render(q)}<div class="fb" id="fb"></div>`;
  if(o.boss)$('hp').style.width=hp+'%';sc.ui();setPg(i,Q.length);
  const left=startTimer(d.time,()=>ans(-1));
  document.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>ans(+b.dataset.o));
  AUTO=()=>{const b=document.querySelector(`[data-o="${q.ans}"]`);if(b)b.click()};
  function ans(ch){stopTimer();AUTO=null;const right=ch===q.ans;
   document.querySelectorAll('[data-o]').forEach(b=>{b.disabled=true;const v=+b.dataset.o;if(o.ring){if(v===q.ans)b.classList.add('ring');else b.classList.add('dim')}else{if(v===q.ans)b.classList.add('ok');else if(v===ch)b.classList.add('no')}});
   const more=()=>i+1<Q.length&&!(o.lives&&lives<=0)&&!(o.boss&&hp<=0);
   if(right){const gain=sc.hit(left(),d.time);if(o.boss){hp=Math.max(0,hp-dmg-(sc.streak>=3?4:0));$('hp').style.width=hp+'%';const f=$('bf');f.classList.remove('hit');void f.offsetWidth;f.classList.add('hit');sfx('hit');if(hp<=0){f.textContent='💥';toast('BOS TUMPAS!','#FFC83D')}}
    fbShow(true,`✅ <b>Betul! +${gain}</b>${exOf(q)}`,nxt,NXT(more()),q.ex?2600:1200)}
   else{sc.miss();if(o.lives){lives--;hearts(lives,o.lives);if(lives<=0)toast('💔 NYAWA HABIS','#FF4D6D')}
    fbShow(false,`${ch===-1?'⏰ <b>Masa tamat!</b>':'❌ <b>Kurang tepat.</b>'} ${o.reveal?o.reveal(q):''}${exOf(q)}`,nxt,NXT(more()))}
   function nxt(){i++;if(i<Q.length&&!(o.lives&&lives<=0)&&!(o.boss&&hp<=0))draw();else finish()}
  }
 }
 function finish(){const answered=sc.ok+sc.bad;let acc=sc.ok/Q.length;let note='';
  if(o.boss){if(hp<=0){acc=sc.ok/Math.max(answered,1);note='💥 Bos tumpas!'}else if(lives<=0)note='💔 Nyawa habis';else note=`Bos berbaki ${hp}%`}
  else if(o.lives&&lives<=0){note='💔 Nyawa habis'}
  result(idx,sc,acc,note)}
 draw();
}
function mcqItems(list,d){return list.map(q=>mk(q,d.opts))}

/* ---------- roda (Lucky Wheel / Spin & Answer) ---------- */
const WCOL=['#22D3EE','#A78BFA','#FFC83D','#2EE59D','#FF4D6D','#60A5FA','#F472B6','#FB923C'];
function wheelHTML(segs){const n=segs.length;const grad=segs.map((s,k)=>`${WCOL[k%WCOL.length]} ${k*360/n}deg ${(k+1)*360/n}deg`).join(',');
 return `<div class="wheel-wrap"><div class="pointer">▼</div><div class="wheel" id="wheel" style="background:conic-gradient(${grad})">${segs.map((s,k)=>`<div class="wl" style="transform:rotate(${(k+.5)*360/n}deg)"><span>${s.emo?`<b>${s.emo}</b>`:''}${esc(s.t)}</span></div>`).join('')}</div><div class="hub">${L.theme&&L.theme.icon||'🎯'}</div></div>`}
let wrot=0;
function spinTo(k,n,cb){const w=$('wheel');const target=(360-(k+.5)*360/n);const cur=((wrot%360)+360)%360;wrot+=360*5+((target-cur+360)%360);const dur=3.2*TS;w.style.transition=`transform ${dur}s cubic-bezier(.15,.85,.2,1)`;w.style.transform=`rotate(${wrot}deg)`;
 let tk=0;const iv=setInterval(()=>{if(++tk<dur*8)sfx('tick');else clearInterval(iv)},120);ivs.push(iv);later(()=>{sfx('coin');cb(k)},dur*1000+150)}

/* ---------- penjana silang kata ---------- */
function cwBuild(list){let best=null;
 for(let at=0;at<40;at++){const order=at?shuf(list):list.slice().sort((a,b)=>b.w.length-a.w.length);const cells=new Map(),dirs=new Map(),placed=[];
  const get=(x,y)=>cells.get(x+','+y);
  const can=(w,x,y,dr)=>{const dx=dr?0:1,dy=dr?1:0;if(get(x-dx,y-dy)||get(x+dx*w.length,y+dy*w.length))return -1;let it=0;
   for(let k=0;k<w.length;k++){const cx_=x+dx*k,cy=y+dy*k,c=get(cx_,cy);if(c){if(c!==w[k]||(dirs.get(cx_+','+cy)||'').includes(dr))return -1;it++}else if(get(cx_+dy,cy+dx)||get(cx_-dy,cy-dx))return -1}return it};
  const put=(o,x,y,dr)=>{const dx=dr?0:1,dy=dr?1:0;for(let k=0;k<o.w.length;k++){const key=(x+dx*k)+','+(y+dy*k);cells.set(key,o.w[k]);dirs.set(key,(dirs.get(key)||'')+dr)}placed.push({...o,x,y,dr})};
  put(order[0],0,0,0);
  for(const o of order.slice(1)){let cand=null;
   for(const p of placed)for(let k=0;k<p.w.length;k++){const px=p.x+(p.dr?0:k),py=p.y+(p.dr?k:0);const ch=p.w[k];const dr=p.dr?0:1;
    for(let j=0;j<o.w.length;j++){if(o.w[j]!==ch)continue;const x=dr?px:px-j,y=dr?py-j:py;const it=can(o.w,x,y,dr);if(it>0){const sc_=it*10+Math.random();if(!cand||sc_>cand.s)cand={x,y,dr,s:sc_}}}}
   if(cand)put(o,cand.x,cand.y,cand.dr)}
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;cells.forEach((_,k)=>{const[x,y]=k.split(',').map(Number);x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y)});
  const W=x1-x0+1,H=y1-y0+1;const score=placed.length*100-Math.max(W,H)*3-Math.abs(W-H);
  if(!best||score>best.score)best={score,W,H,placed:placed.map(p=>({...p,x:p.x-x0,y:p.y-y0}))};
  if(best.placed.length===list.length&&at>12)break}
 const starts=[...new Set(best.placed.map(p=>p.y*1000+p.x))].sort((a,b)=>a-b);best.placed.forEach(p=>p.n=starts.indexOf(p.y*1000+p.x)+1);return best}

/* ---------- penjana cari kata ---------- */
function wsBuild(words,size,dirs){for(let at=0;at<60;at++){const G=Array.from({length:size},()=>Array(size).fill(null));const pos=[];let ok=true;
  for(const w of words.slice().sort((a,b)=>b.length-a.length)){let done=false;for(let t=0;t<300&&!done;t++){const[dx,dy]=dirs[Math.random()*dirs.length|0];const x=Math.random()*size|0,y=Math.random()*size|0;const ex=x+dx*(w.length-1),ey=y+dy*(w.length-1);if(ex<0||ey<0||ex>=size||ey>=size)continue;
    let fit=true;for(let k=0;k<w.length;k++){const c=G[y+dy*k][x+dx*k];if(c&&c!==w[k]){fit=false;break}}if(!fit)continue;for(let k=0;k<w.length;k++)G[y+dy*k][x+dx*k]=w[k];pos.push({w,x,y,dx,dy});done=true}
   if(!done){ok=false;break}}
  if(!ok)continue;const letters=words.join('')+'ABDEHIKLMNRSTU';for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(!G[y][x])G[y][x]=letters[Math.random()*letters.length|0];return{G,pos}}return null}
const WORD=s=>String(s).toUpperCase().replace(/[^A-Z]/g,'');

/* ---------- mod permainan ---------- */
const RUN={
 /* ===== warisan T4 ===== */
 mcq(g,i){const d=DIFF[S.lv];quiz(g,i,{qs:mcqItems(take(pool(g),NQ()),d),reveal:q=>ansOf(q),render:q=>qHTML(q)+optHTML(q)})},
 boss(g,i){const d=DIFF[S.lv];quiz(g,i,{boss:true,lives:d.lives,qs:mcqItems(take(pool(g),10),d),reveal:q=>ansOf(q),render:q=>qHTML(q)+optHTML(q)})},
 tf(g,i){quiz(g,i,{ring:true,qs:take(B(g.data).map(ntf),NQ()).map(x=>({...x,ans:x.a?0:1})),render:q=>`<div class="scroll">${esc(q.t)}</div><div class="big2"><button class="bigb t" data-o="0"><span class="e">✔</span>BENAR</button><button class="bigb f" data-o="1"><span class="e">✖</span>SALAH</button></div>`})},
 sort(g,i){const bins=g.bins;const D=B(g.data).map(x=>Array.isArray(x)?{t:x[0],b:x[1],ex:x[2]}:x);quiz(g,i,{ring:true,qs:take(D,NQ()).map(x=>({...x,ans:x.b})),reveal:q=>`Jawapan: <b>${esc(bins[q.ans].name)}</b>`,
  render:q=>`<div class="scroll">${isAr(q.t)?`<span class="ar" style="font-size:2rem">${q.t}</span>`:esc(q.t)}</div><div class="${bins.length===3?'big3':'big2'}">${bins.map((b,j)=>`<button class="bigb c${b.c!==undefined?b.c:j}" data-o="${j}"><span class="e">${b.emo}</span>${esc(b.name)}</button>`).join('')}</div>`})},
 pick(g,i){const labels=g.labels;const D=B(g.data).map(x=>Array.isArray(x)?{q:x[0],a:x[1],ex:x[2]}:x);quiz(g,i,{qs:take(D,NQ()).map(x=>{let opts=S.lv===1&&labels.length>4?shuf([x.a,...shuf(labels.filter(l=>l!==x.a)).slice(0,3)]):labels.slice();return{...x,opts,ans:opts.indexOf(x.a)}}),
  reveal:q=>`Jawapan: <b>${esc(q.opts[q.ans])}</b>`,render:q=>qHTML(q)+`<div class="opts" style="grid-template-columns:repeat(auto-fit,minmax(${labels.some(l=>l.length>14)?'240px':'150px'},1fr))">${q.opts.map((t,j)=>`<button class="opt" style="justify-content:center;text-align:center" data-o="${j}">${esc(t)}</button>`).join('')}</div>`})},
 chain(g,i){const d=DIFF[S.lv];const C=B(g.data);const qs=[];for(let j=1;j<C.length;j++){const right=C[j][0];const pl=shuf(C.filter((c,x)=>x!==j&&x!==j-1).map(c=>c[0])).slice(0,d.opts-1);const o=shuf([right,...pl]);qs.push({prev:C[j-1][0],lbl:C[j-1][1],opts:o,ans:o.indexOf(right),ex:`${C[j][1]?C[j][1]+': ':''}<span class="ar" style="font-size:1.4rem">${right}</span>`})}
  quiz(g,i,{qs,render:q=>`<div class="qcard"><div class="q">Apakah sambungan selepas potongan ini?${q.lbl?` <span style="color:var(--mut)">(${esc(q.lbl)})</span>`:''}</div><div class="ar qa">${q.prev} …</div></div>`+`<div class="opts one">${q.opts.map((t,j)=>`<button class="opt ar" data-o="${j}"><span class="k">${keys[j]}</span><span>${t}</span></button>`).join('')}</div>`})},
 order(g,idx){const d=DIFF[S.lv];const sc=Score();const D=B(g.data);const R=take(D,S.lv===1?Math.min(2,D.length):S.lv===2?Math.min(3,D.length):D.length);let r=0;
  function draw(){const rd0=R[r];const rd=S.lv===1&&rd0.easy?{...rd0,items:rd0.easy}:rd0;const ar=rd.items.every(isAr);let pl=rd.items.concat(d.decoy&&rd.decoy?rd.decoy:[]);pl=shuf(pl);let pos=0;
   $('play').innerHTML=head(`${g.emo} ${r+1}/${R.length}`)+`<div class="qcard"><div class="q">${esc(rd.title)}</div>${rd.hint&&S.lv<3?`<div class="hint">💡 ${esc(rd.hint)}</div>`:''}</div>
    <div class="slots ${ar?'':'ltr'}" id="sl">${rd.items.map((_,k)=>`<div class="slot ${ar?'ar':''}">${ar?'':(k+1)+'.'}</div>`).join('')}</div>
    <div class="pool ${ar?'rtl':''}" id="pl">${pl.map((t,k)=>`<button class="tile ${ar?'ar':''}" data-k="${k}">${ar?t:esc(t)}</button>`).join('')}</div><div class="fb" id="fb"></div>`;
   sc.ui();setPg(r,R.length);const slots=[...$('sl').children];const t0=performance.now();
   AUTO=()=>{const k=pl.findIndex((t,j)=>t===rd.items[pos]&&!$('pl').querySelector(`[data-k="${j}"]`).classList.contains('used'));if(k>=0)$('pl').querySelector(`[data-k="${k}"]`).click()};
   $('pl').querySelectorAll('.tile').forEach(b=>b.onclick=()=>{if(b.classList.contains('used'))return;const t=pl[+b.dataset.k];if(t===rd.items[pos]){slots[pos].innerHTML=(ar?'':`<b style="color:var(--ok);margin-right:8px">${pos+1}.</b>`)+(ar?t:esc(t));slots[pos].classList.add('fill');b.classList.add('used');pos++;sc.ok++;sc.streak++;sc.best=Math.max(sc.best,sc.streak);sc.score+=Math.round(60*d.mult);sc.ui();sfx('ok');
     if(pos===rd.items.length){AUTO=null;const bonus=Math.round(Math.max(0,rd.items.length*6-(performance.now()-t0)/1000)*8*d.mult);sc.score+=bonus;sc.ui();sfx('win');confetti(50);$('pl').style.display='none';
      fbShow(true,`✅ <b>Tertib lengkap!</b> Bonus pantas +${bonus}${rd.note?'<br>'+esc(rd.note):''}`,()=>{r++;r<R.length?draw():result(idx,sc,sc.ok/(sc.ok+sc.bad||1),'')},NXT(r+1<R.length))}}
    else{sc.bad++;sc.streak=0;sc.score=Math.max(0,sc.score-Math.round(20*d.mult));sc.ui();sfx('no');flash();b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),450)}})}
  draw()},
 match(g,idx){const d=DIFF[S.lv];const sc=Score();const P=take(B(g.data),S.lv===1?4:6);let cards=[];P.forEach((p,k)=>{cards.push({k,v:p[0]});cards.push({k,v:p[1]})});cards=shuf(cards);let open=[],found=0,tries=0,lock=true;
  $('play').innerHTML=head(`${g.emo} Padan ${P.length} pasangan`)+`<div class="qcard" style="padding:12px"><div class="q" id="mmsg">👀 Ingat kedudukan kad…</div></div><div class="mgrid">${cards.map((c,j)=>`<button class="mc flip" data-j="${j}"><div class="in"><div class="f">${g.back||'✦'}</div><div class="b ${isAr(c.v)?'ar':''}">${isAr(c.v)?c.v:esc(c.v)}</div></div></button>`).join('')}</div><div class="fb" id="fb"></div>`;
  sc.ui();setPg(0,P.length);
  autoT=setTimeout(()=>{autoT=null;if(!$('mmsg'))return;document.querySelectorAll('.mc').forEach(c=>c.classList.remove('flip'));$('mmsg').textContent='Sentuh dua kad yang berpasangan';lock=false},d.preview*TS);
  const t0=performance.now();
  AUTO=()=>{if(lock)return;const els=[...document.querySelectorAll('.mc')].filter(e=>!e.classList.contains('match'));if(!els.length)return;const a=els[0];const ka=cards[+a.dataset.j].k;const b=els.find(e=>e!==a&&cards[+e.dataset.j].k===ka);a.click();b.click()};
  document.querySelectorAll('.mc').forEach(el=>el.onclick=()=>{if(lock||el.classList.contains('flip'))return;el.classList.add('flip');sfx('tap');open.push(el);
   if(open.length===2){tries++;lock=true;const[a,b]=open.map(e=>cards[+e.dataset.j]);
    if(a.k===b.k){open.forEach(e=>e.classList.add('match'));found++;sc.hit(0,1);setPg(found,P.length);open=[];lock=false;
     if(found===P.length){AUTO=null;const bonus=Math.round(Math.max(0,P.length*9-(performance.now()-t0)/1000)*6*d.mult);sc.score+=bonus;sc.ui();sfx('win');confetti(80);
      later(()=>{sc.bad=tries-P.length;result(idx,sc,Math.min(1,P.length/tries*1.4),`${tries} cubaan · bonus pantas +${bonus}`)},800)}}
    else{sc.streak=0;sc.ui();sfx('no');setTimeout(()=>{open.forEach(e=>e.classList.remove('flip'));open=[];lock=false},850)}}})},
 bubble(g,idx){const d=DIFF[S.lv];const sc=Score();const Q=take(B(g.data),8);let i=0;
  function draw(){bubT.forEach(clearTimeout);bubT=[];const q=Q[i];const nb=S.lv===1?2:S.lv===2?3:4;const words=shuf([q.a,...take(q.o,nb-1)]);const ar=isAr(q.a);
   $('play').innerHTML=head(`${g.emo} ${i+1}/${Q.length}`)+`<div class="qcard" style="margin-bottom:10px"><div class="q">${esc(q.q||'Pecahkan gelembung yang betul:')}</div>${q.pre!==undefined?`<div class="${ar?'ar qa':'q'}" style="${ar?'':'margin-top:8px;color:var(--a)'}">${ar?q.pre:esc(q.pre)} <span class="blank">${ar?'؟':'?'}</span> ${ar?(q.post||''):esc(q.post||'')}</div>`:''}</div><div class="sea" id="sea"></div><div class="fb" id="fb"></div>`;
   sc.ui();setPg(i,Q.length);const sea=$('sea');const W=sea.clientWidth;const T=d.bubT;let done=false;const t0=performance.now();const lanes=shuf(words.map((_,j)=>j));
   words.forEach((w,j)=>{const b=document.createElement('button');b.className='bub'+(isAr(w)?' ar':'');b.textContent=w;const n=words.length;b.style.left=Math.max(4,Math.min(W-152,(W/n)*lanes[j]+((W/n)-148)/2))+'px';b.style.animationDuration=T+'s';b.style.animationDelay=(j*.55)+'s';
    b.onclick=()=>{if(done)return;if(w===q.a)fin(true,b);else{b.classList.add('popno');fin(false,b)}};
    b.addEventListener('animationend',e=>{if(e.animationName==='rise'&&w===q.a&&!done)fin(false,null,true)});sea.appendChild(b)});
   AUTO=()=>{const b=[...sea.querySelectorAll('.bub')].find(x=>x.textContent===q.a);if(b)b.click()};
   const full=q.pre!==undefined?(ar?`<span class="ar" style="font-size:1.5rem">${q.pre} ${q.a} ${q.post||''}</span>`:`<b>${esc(q.pre)} ${esc(q.a)} ${esc(q.post||'')}</b>`):`<b>${arWrap(q.a)}</b>`;
   function fin(right,b,esc_){if(done)return;done=true;AUTO=null;sea.querySelectorAll('.bub').forEach(x=>{x.style.animationPlayState='paused';if(x.textContent===q.a&&x!==b)x.style.boxShadow='0 0 0 6px #2EE59D'});
    const more=i+1<Q.length;const nx=()=>{i++;more?draw():result(idx,sc,sc.ok/Q.length,'')};
    if(right){b.classList.add('popok');sfx('pop');const g2=sc.hit(Math.max(0,T+1.2-(performance.now()-t0)/1000),T);fbShow(true,`✅ <b>+${g2}</b> ${full}${exOf(q)}`,nx,NXT(more),q.ex?2600:1500)}
    else{sc.miss();fbShow(false,`${esc_?'💨 <b>Gelembung betul terlepas!</b>':'❌ <b>Gelembung salah.</b>'} Jawapan: ${full}${exOf(q)}`,nx,NXT(more))}}}
  draw()},

 /* ===== 1. LIVE QUIZ ===== */
 live(g,idx){const d=DIFF[S.lv];const sc=Score();const Q=take(pool(g),NQ());let i=0;const bots=shuf(BOTS).slice(0,3).map(n=>({n,s:0}));const skill={1:.5,2:.65,3:.8}[S.lv];
  const board=(prev)=>{const all=[{n:S.name||'Anda',s:sc.score,me:1},...bots].sort((a,b)=>b.s-a.s);return all.map((p,k)=>`<div class="lv-row ${p.me?'me':''}"><b>${['🥇','🥈','🥉','4'][k]}</b><span>${esc(p.n)}</span><i>${p.s}</i></div>`).join('')};
  const myRank=()=>[{s:sc.score,me:1},...bots].sort((a,b)=>b.s-a.s).findIndex(p=>p.me)+1;
  function draw(){const q=Q[i];$('play').innerHTML=head(`<span class="livedot"></span> LIVE ${i+1}/${Q.length}`)+`<div class="lv-board" id="lvb">${board()}</div><div id="qh"></div><div class="fb" id="fb"></div>`;sc.ui();setPg(i,Q.length);
   ask($('qh'),q,{time:d.time,shape:true,onDone:(r,left,ch,it)=>{bots.forEach(b=>{if(Math.random()<skill)b.s+=Math.round((100+Math.random()*75)*d.mult)});const more=i+1<Q.length;const nx=()=>{i++;more?draw():result(idx,sc,sc.ok/Q.length,`Kedudukan akhir: #${myRank()} daripada 4`)};
    let html;if(r){const gn=sc.hit(left,d.time);html=`✅ <b>Betul! +${gn}</b>`}else{sc.miss();html=`${ch<0?'⏰ <b>Masa tamat!</b>':'❌ <b>Salah.</b>'} ${ansOf(it)}`}
    $('lvb').innerHTML=board();$('lvb').classList.add('bump');fbShow(r,`${html} · Anda di tempat <b>#${myRank()}</b>${exOf(q)}`,nx,NXT(more),r?(q.ex?2600:1500):0)}})}
  draw()},

 /* ===== 2. MATCHING GAME (sambung kiri-kanan) ===== */
 connect(g,idx){const d=DIFF[S.lv];const sc=Score();const D=B(g.data);const P=take(D,{1:5,2:6,3:7}[S.lv]);const extra=S.lv===3?take(D.filter(p=>!P.includes(p)),1):[];
  const left=shuf(P.map((p,k)=>({k,v:p[0]})));const right=shuf([...P.map((p,k)=>({k,v:p[1]})),...extra.map(p=>({k:-1,v:p[1]}))]);let sel=null,found=0,miss=0;const t0=performance.now();
  $('play').innerHTML=head(`${g.emo} Padankan ${P.length} pasangan`)+`<div class="qcard" style="padding:12px"><div class="q">${esc(g.prompt||'Sentuh kad kiri, kemudian padanannya di kanan.')}</div></div>
   <div class="cn"><div class="cn-col" id="cl">${left.map((c,j)=>`<button class="cn-c L ${isAr(c.v)?'ar':''}" data-j="${j}">${txt(c.v)}</button>`).join('')}</div><div class="cn-col" id="cr">${right.map((c,j)=>`<button class="cn-c R ${isAr(c.v)?'ar':''}" data-j="${j}">${txt(c.v)}</button>`).join('')}</div></div><div class="fb" id="fb"></div>`;
  sc.ui();setPg(0,P.length);
  $('cl').querySelectorAll('.cn-c').forEach(b=>b.onclick=()=>{if(b.classList.contains('done'))return;$('cl').querySelectorAll('.cn-c').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');sel=left[+b.dataset.j];sfx('tap')});
  $('cr').querySelectorAll('.cn-c').forEach(b=>b.onclick=()=>{if(b.classList.contains('done')||!sel)return;const R=right[+b.dataset.j];const lb=$('cl').querySelector('.sel');
   if(R.k===sel.k||R.v===P[sel.k][1]){found++;const c=found%6;[lb,b].forEach(x=>{x.classList.remove('sel');x.classList.add('done','k'+c);x.dataset.n=found});sc.hit(0,1);sel=null;setPg(found,P.length);
    if(found===P.length){AUTO=null;const bonus=Math.round(Math.max(0,P.length*8-(performance.now()-t0)/1000)*6*d.mult);sc.score+=bonus;sc.ui();sfx('win');confetti(80);later(()=>result(idx,sc,P.length/(P.length+miss*.6),`${miss} silap · bonus pantas +${bonus}`),700)}}
   else{miss++;sc.miss();[lb,b].forEach(x=>{x.classList.add('shake','bad');setTimeout(()=>x.classList.remove('shake','bad'),450)})}});
  AUTO=()=>{const lb=[...$('cl').querySelectorAll('.cn-c')].find(x=>!x.classList.contains('done'));if(!lb)return;lb.click();const k=left[+lb.dataset.j].k;const j=right.findIndex(r=>r.k===k);$('cr').querySelector(`[data-j="${j}"]`).click()}},

 /* ===== 3. TIMED CHALLENGE ===== */
 timed(g,idx){const sc=Score();const T={1:80,2:65,3:50}[S.lv]*TS;const target={1:8,2:10,3:12}[S.lv];const P=pool(g);let bag=[],ans=0,ended=false;
  $('play').innerHTML=head(`${g.emo} Cabaran Masa`)+`<div class="tc-top"><div class="clock" id="clk">${T|0}s</div><div class="tc-goal">🎯 Sasaran <b>${target}</b> betul<br><span class="okc">✅ <b id="okc">0</b></span> <span class="noc">❌ <b id="noc">0</b></span></div></div><div class="timer big" id="gtm"><i></i></div><div id="qh"></div>`;
  sc.ui();setPg(0,target);gclock(T,end,'clk');
  function next(){if(ended)return;if(!bag.length)bag=shuf(P);const q=bag.pop();ask($('qh'),q,{n:S.lv===1?2:3,onDone:(r,_l,ch,it)=>{ans++;if(r){sc.win(100*DIFF[S.lv].mult);$('okc').textContent=sc.ok;setPg(Math.min(sc.ok,target),target);if(sc.ok===target){toast('🎯 SASARAN DICAPAI!','#FFC83D');sfx('lvup')}}else{sc.miss();$('noc').textContent=sc.bad}
   later(next,r?380:1100)}})}
  function end(){if(ended)return;ended=true;AUTO=null;const acc=Math.min(1,sc.ok/target)*Math.sqrt(sc.ok/Math.max(1,ans));if(sc.ok>=target)sc.score+=200;result(idx,sc,acc,`${sc.ok} betul / ${ans} dijawab${sc.ok>=target?' · 🎯 sasaran dicapai':''}`)}
  next()},

 /* ===== 4. ESCAPE ROOM ===== */
 escape(g,idx){const d=DIFF[S.lv];const sc=Score();const N={1:4,2:5,3:6}[S.lv];const Q=take(pool(g),N);const T={1:240,2:180,3:140}[S.lv]*TS;let r=0,first=0,wrongIn=0,ended=false;const code=Q.map(()=>1+Math.random()*9|0);
  $('play').innerHTML=head(`${g.emo} Escape Room`)+`<div class="esc-top"><div class="doors" id="doors">${Q.map((_,k)=>`<div class="door" id="dr${k}"><span>🚪</span><small>BILIK ${k+1}</small></div>`).join('')}<div class="door exit"><span>🏁</span><small>KELUAR</small></div></div>
   <div class="esc-info"><div class="code" id="code">${Q.map(()=>'<span>?</span>').join('')}</div><div class="clock" id="clk"></div></div></div><div class="timer big" id="gtm"><i></i></div><div id="qh"></div><div class="fb" id="fb"></div>`;
  sc.ui();gclock(T,()=>lose(),'clk');
  function room(){wrongIn=0;document.querySelectorAll('.door').forEach((x,k)=>x.classList.toggle('cur',k===r));setPg(r,N);
   ask($('qh'),Q[r],{retry:true,pre:`<div class="esc-room">🔒 BILIK ${r+1}: Jawab untuk membuka kunci</div>`,onWrong:()=>{wrongIn++;sc.miss();if(GC)GC.add(-15*TS);toast('⏳ −15 SAAT!','#FF4D6D')},onDone:(ok,_l,ch,it)=>{
    if(wrongIn===0)first++;sc.win(wrongIn?60*d.mult:(150*d.mult));const dr=$('dr'+r);dr.classList.add('open');dr.querySelector('span').textContent='🔓';$('code').children[r].textContent=code[r];$('code').children[r].classList.add('got');sfx('door');
    const more=r+1<N;fbShow(true,`🔓 <b>Pintu terbuka!</b> Nombor kod ke-${r+1}: <b class="big">${code[r]}</b>${exOf(Q[r])}`,()=>{r++;more?room():keypad()},more?'Bilik Seterusnya ▶':'Ke Pintu Keluar 🏁',2400)}})}
  function keypad(){setPg(N,N);let pos=0;document.querySelectorAll('.door').forEach(x=>x.classList.remove('cur'));document.querySelector('.door.exit').classList.add('cur');
   $('qh').innerHTML=`<div class="qcard"><div class="q">🔐 Masukkan kod ${N} digit mengikut tertib untuk melarikan diri!</div><div class="kp-show" id="kps">${code.map(()=>'<span>•</span>').join('')}</div></div><div class="keypad">${[1,2,3,4,5,6,7,8,9].map(n=>`<button class="kp" data-n="${n}">${n}</button>`).join('')}</div>`;
   AUTO=()=>{const b=$('qh').querySelector(`[data-n="${code[pos]}"]`);if(b)b.click()};
   $('qh').querySelectorAll('.kp').forEach(b=>b.onclick=()=>{if(ended)return;if(+b.dataset.n===code[pos]){$('kps').children[pos].textContent=code[pos];$('kps').children[pos].classList.add('got');pos++;sfx('tap');if(pos===N)win()}else{sfx('no');flash();if(GC)GC.add(-5*TS);b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),400)}})}
  function win(){ended=true;AUTO=null;const left=GC?GC.left()/TS:0;if(GC){GC.stop();GC=null}const bonus=Math.round(left*4*d.mult);sc.score+=bonus;sc.ui();sfx('win');confetti(160);toast('🏃 BERJAYA KELUAR!','#FFC83D');
   later(()=>result(idx,sc,(first+.55*(N-first))/N,`Berjaya keluar · bonus masa +${bonus}`),1200)}
  function lose(){if(ended)return;ended=true;AUTO=null;toast('⌛ MASA TAMAT – TERPERANGKAP!','#FF4D6D');sfx('boom');later(()=>result(idx,sc,r/N*.6,`Terperangkap di bilik ${Math.min(r+1,N)}`),1200)}
  room()},

 /* ===== 5. LUCKY WHEEL ===== */
 wheel(g,idx){const d=DIFF[S.lv];const sc=Score();const Q=take(pool(g),{1:6,2:8,3:10}[S.lv]);let i=0;
  const segs=[{t:'x1',m:1},{t:'x2',m:2},{t:'+100',m:1,add:100},{t:'x3',m:3},{t:'x1',m:1},{t:'BONUS',emo:'⭐',m:1,add:200},{t:'x2',m:2},S.lv===1?{t:'x2',m:2}:{t:'BOM',emo:'💣',m:.5}];
  function draw(){const q=Q[i];$('play').innerHTML=head(`${g.emo} Pusingan ${i+1}/${Q.length}`)+`<div class="spin-area">${wheelHTML(segs)}<div class="spin-side"><div class="prize" id="prz">Tekan PUTAR!</div><button class="btn gold" id="spinB">🎰 PUTAR</button></div></div><div id="qh"></div><div class="fb" id="fb"></div>`;
   $('wheel').style.transform=`rotate(${wrot}deg)`;sc.ui();setPg(i,Q.length);
   const sp=()=>{$('spinB').disabled=true;AUTO=null;const k=Math.random()*segs.length|0;spinTo(k,segs.length,()=>{const s=segs[k];$('prz').innerHTML=`${s.emo||'🎯'} <b>${esc(s.t)}</b><br><small>${s.add?`+${s.add} jika betul`:s.m<1?'Mata separuh!':`Mata x${s.m}`}</small>`;toast(s.emo?s.emo+' '+s.t:s.t,'#FFC83D');
    ask($('qh'),q,{time:d.time,onDone:(r,left,ch,it)=>{const more=i+1<Q.length;const nx=()=>{i++;more?draw():result(idx,sc,sc.ok/Q.length,'')};
     if(r){const base=(100+Math.round(left/d.time*80))*d.mult;const gn=sc.win(Math.round(base*s.m+(s.add||0)*d.mult));fbShow(true,`✅ <b>Betul! +${gn}</b> (${esc(s.t)})${exOf(q)}`,nx,NXT(more),q.ex?2600:1500)}
     else{sc.miss();fbShow(false,`${ch<0?'⏰ <b>Masa tamat!</b>':'❌ <b>Salah.</b>'} ${ansOf(it)}${exOf(q)}`,nx,NXT(more))}}})})};
   $('spinB').onclick=sp;AUTO=sp}
  draw()},

 /* ===== 16. SPIN & ANSWER (kategori) ===== */
 spin(g,idx){const d=DIFF[S.lv];const sc=Score();const cats=g.cats.map(c=>({...c,bag:shuf(B(c.data).map(nq))}));const N={1:6,2:8,3:10}[S.lv];let i=0;
  const segs=cats.map(c=>({t:c.t,emo:c.emo}));
  function draw(){$('play').innerHTML=head(`${g.emo} Pusingan ${i+1}/${N}`)+`<div class="spin-area">${wheelHTML(segs)}<div class="spin-side"><div class="prize" id="prz">Putar untuk pilih kategori</div><button class="btn gold" id="spinB">🎡 PUTAR</button></div></div><div id="qh"></div><div class="fb" id="fb"></div>`;
   $('wheel').style.transform=`rotate(${wrot}deg)`;sc.ui();setPg(i,N);
   const sp=()=>{$('spinB').disabled=true;AUTO=null;const k=Math.random()*cats.length|0;spinTo(k,cats.length,()=>{const c=cats[k];if(!c.bag.length)c.bag=shuf(B(c.data).map(nq));const q=c.bag.pop();$('prz').innerHTML=`${c.emo} <b>${esc(c.t)}</b>`;toast(c.emo+' '+c.t,WCOL[k%WCOL.length]);
    ask($('qh'),q,{time:d.time,pre:`<div class="catbar" style="--cc:${WCOL[k%WCOL.length]}">${c.emo} KATEGORI: ${esc(c.t)}</div>`,onDone:(r,left,ch,it)=>{const more=i+1<N;const nx=()=>{i++;more?draw():result(idx,sc,sc.ok/N,'')};
     if(r){const gn=sc.hit(left,d.time);fbShow(true,`✅ <b>Betul! +${gn}</b>${exOf(q)}`,nx,NXT(more),q.ex?2600:1500)}else{sc.miss();fbShow(false,`${ch<0?'⏰ <b>Masa tamat!</b>':'❌ <b>Salah.</b>'} ${ansOf(it)}${exOf(q)}`,nx,NXT(more))}}})})};
   $('spinB').onclick=sp;AUTO=sp}
  draw()},

 /* ===== 6. TOWER DEFENSE ===== */
 tower(g,idx){const d=DIFF[S.lv];const sc=Score();const Q=take(pool(g),NQ());let i=0,hp=d.lives;const walk=d.time;const foes=g.foes||['👾','👹','🦂','🐍','👻','🦇'];
  $('play').innerHTML=head(`${g.emo} Gelombang`,{lives:hp,max:d.lives})+`<div class="lane" id="lane"><div class="castle" id="cas">🏰</div><div class="bolt" id="bolt">⚡</div><div class="enemy" id="en">👾</div><div class="lane-lbl" id="wv"></div></div><div id="qh"></div><div class="fb" id="fb"></div>`;
  function draw(){const q=Q[i];const en=$('en');en.textContent=foes[i%foes.length];en.className='enemy';en.style.transition='none';en.style.left='calc(100% - 70px)';void en.offsetWidth;en.style.transition=`left ${walk}s linear`;en.style.left='86px';
   $('wv').textContent=`MUSUH ${i+1}/${Q.length}`;sc.ui();setPg(i,Q.length);
   ask($('qh'),q,{time:walk,onDone:(r,left,ch,it)=>{const x=en.getBoundingClientRect().left-$('lane').getBoundingClientRect().left;en.style.transition='none';en.style.left=x+'px';
    const more=()=>i+1<Q.length&&hp>0;const nx=()=>{i++;more2()?draw():fin()};const more2=()=>i<Q.length&&hp>0;
    if(r){const b=$('bolt');b.style.transition='none';b.style.left='70px';b.style.opacity=1;void b.offsetWidth;b.style.transition='left .3s ease-in';b.style.left=x+'px';
     later(()=>{b.style.opacity=0;en.textContent='💥';en.classList.add('dead');sfx('hit')},300);const gn=sc.hit(left,walk);fbShow(true,`🎯 <b>Musuh ditumpaskan! +${gn}</b>${exOf(q)}`,nx,NXT(more()),q.ex?2600:1500)}
    else{sc.miss();en.style.transition='left .35s ease-in';en.style.left='70px';later(()=>{hp--;hearts(hp,d.lives);const c=$('cas');c.classList.remove('hit');void c.offsetWidth;c.classList.add('hit');sfx('boom');if(hp<=0){c.textContent='🏚️';toast('🏰 MENARA RUNTUH!','#FF4D6D')}},350);
     fbShow(false,`${ch<0?'⏰ <b>Musuh sampai ke menara!</b>':'❌ <b>Tembakan tersasar!</b>'} ${ansOf(it)}${exOf(q)}`,nx,NXT(i+1<Q.length&&hp>1))}}})}
  function fin(){result(idx,sc,sc.ok/Q.length,hp<=0?'🏚️ Menara runtuh':`🏰 Menara selamat (${hp} ❤️)`)}
  draw()},

 /* ===== 7. POINT COLLECTOR ===== */
 collect(g,idx){const d=DIFF[S.lv];const sc=Score();const Q=take(pool(g),{1:9,2:12,3:12}[S.lv]);const vals=shuf(Q.map((_,k)=>[100,200,300,100,200,500,300,200,100,400,300,500][k]));const st=Q.map(()=>0);let bank=0;const gems=['💎','💠','🔷','🔶','💚','💜'];
  function board(){$('play').innerHTML=head(`${g.emo} Kumpul Mata`)+`<div class="vault"><span>🏦 BANK MATA</span><b id="vb">${bank}</b></div><div class="gems">${Q.map((_,k)=>`<button class="gem ${st[k]===1?'got':st[k]===2?'lost':''}" data-k="${k}" ${st[k]?'disabled':''}><span>${st[k]===1?'✅':st[k]===2?'💔':gems[k%gems.length]}</span><b>${vals[k]}</b></button>`).join('')}</div><div id="qh"></div><div class="fb" id="fb"></div>`;
   sc.ui();setPg(st.filter(Boolean).length,Q.length);
   document.querySelectorAll('.gem:not([disabled])').forEach(b=>b.onclick=()=>pick(+b.dataset.k));AUTO=()=>{const b=document.querySelector('.gem:not([disabled])');if(b)b.click()}}
  function pick(k){sfx('tap');AUTO=null;document.querySelectorAll('.gem').forEach(b=>b.disabled=true);document.querySelector(`.gem[data-k="${k}"]`).classList.add('cur');const q=Q[k];
   ask($('qh'),q,{time:d.time,pre:`<div class="catbar" style="--cc:#FFC83D">${gems[k%gems.length]} Permata bernilai ${vals[k]} mata</div>`,onDone:(r,left,ch,it)=>{const done=st.filter(Boolean).length+1;const more=done<Q.length;const nx=()=>more?board():result(idx,sc,sc.ok/Q.length,`🏦 Bank: ${bank} mata`);
    if(r){st[k]=1;const gn=sc.win(Math.round((vals[k]+left/d.time*60)*d.mult));bank+=gn;$('vb').textContent=bank;sfx('coin');fbShow(true,`💰 <b>Dikumpul! +${gn}</b>${exOf(q)}`,nx,more?'Pilih Permata Lain ▶':'Lihat Keputusan 🏁',q.ex?2600:1400)}
    else{st[k]=2;sc.miss();fbShow(false,`💔 <b>Permata pecah!</b> ${ansOf(it)}${exOf(q)}`,nx,more?'Pilih Permata Lain ▶':'Lihat Keputusan 🏁')}}})}
  board()},

 /* ===== 9. MYSTERY BOX ===== */
 mystery(g,idx){const d=DIFF[S.lv];const sc=Score();const nq_={1:7,2:6,3:6}[S.lv];const Q=take(pool(g),nq_);const extras={1:['bonus','bonus'],2:['bonus','double','trap'],3:['double','trap','trap']}[S.lv];
  const boxes=shuf([...Q.map(q=>({k:'q',q})),...extras.map(k=>({k}))]);const st=boxes.map(()=>0);let dbl=false,answered=0;
  function grid(){$('play').innerHTML=head(`${g.emo} Kotak Misteri`)+`<div class="mb-info">${dbl?'<span class="dbl">✖2 AKTIF untuk soalan seterusnya!</span>':'Pilih satu kotak 🎁'}</div><div class="boxes">${boxes.map((b,k)=>`<button class="mbox ${st[k]?'open':''}" data-k="${k}" ${st[k]?'disabled':''}>${st[k]?(st[k]):'🎁'}<small>${k+1}</small></button>`).join('')}</div><div id="qh"></div><div class="fb" id="fb"></div>`;
   sc.ui();setPg(answered,Q.length);document.querySelectorAll('.mbox:not([disabled])').forEach(b=>b.onclick=()=>open(+b.dataset.k));AUTO=()=>{const b=document.querySelector('.mbox:not([disabled])');if(b)b.click()}}
  const left_=()=>st.filter(s=>!s).length;
  function open(k){AUTO=null;const el=document.querySelector(`.mbox[data-k="${k}"]`);document.querySelectorAll('.mbox').forEach(b=>b.disabled=true);el.classList.add('shakebox');sfx('spin');
   later(()=>{el.classList.remove('shakebox');const b=boxes[k];const after=()=>{const any=boxes.some((x,j)=>!st[j]&&x.k==='q');any?grid():result(idx,sc,sc.ok/Q.length,'')};
    if(b.k==='bonus'){st[k]='⭐';el.innerHTML='⭐';sc.score+=Math.round(150*d.mult);sc.ui();sfx('coin');toast('⭐ BONUS +'+Math.round(150*d.mult),'#FFC83D');fbShow(true,'⭐ <b>Kotak BONUS!</b> Mata percuma ditambah.',after,'Teruskan ▶',1400)}
    else if(b.k==='double'){st[k]='✖2';el.innerHTML='✖2';dbl=true;sfx('lvup');toast('✖2 GANDA DUA!','#22D3EE');fbShow(true,'✖2 <b>GANDA DUA!</b> Soalan seterusnya bernilai dua kali ganda.',after,'Teruskan ▶',1400)}
    else if(b.k==='trap'){st[k]='💣';el.innerHTML='💣';const lost=Math.min(sc.score,Math.round(120*d.mult));sc.score-=lost;sc.ui();sfx('boom');flash();toast('💣 PERANGKAP −'+lost,'#FF4D6D');fbShow(false,`💣 <b>Perangkap!</b> Mata ditolak ${lost}.`,after,'Teruskan ▶',1600)}
    else{st[k]='❓';el.innerHTML='❓';const q=b.q;const m=dbl?2:1;dbl=false;
     ask($('qh'),q,{time:d.time,pre:`<div class="catbar" style="--cc:#A78BFA">🎁 Kotak ${k+1}${m>1?' · ✖2':''}</div>`,onDone:(r,left,ch,it)=>{answered++;
      if(r){st[k]='✅';const gn=sc.win(Math.round((100+left/d.time*80)*d.mult*m));fbShow(true,`✅ <b>Betul! +${gn}</b>${exOf(q)}`,after,'Teruskan ▶',q.ex?2600:1400)}
      else{st[k]='❌';sc.miss();fbShow(false,`${ch<0?'⏰ <b>Masa tamat!</b>':'❌ <b>Salah.</b>'} ${ansOf(it)}${exOf(q)}`,after,'Teruskan ▶')}}})}},700*TS+50)}
  grid()},

 /* ===== 10. TEAM BATTLE ===== */
 team(g,idx){const d=DIFF[S.lv];const sc=Score();const Q=take(pool(g),{1:8,2:10,3:12}[S.lv]);const T=[{n:'MERAH',e:'🔴',c:'#FF4D6D',s:0},{n:'BIRU',e:'🔵',c:'#38BDF8',s:0}];let i=0,pos=0;const MAX=Math.ceil(Q.length/2);
  const rope=()=>`<div class="tug"><div class="tm t0">${T[0].e} ${T[0].n}<b id="s0">${T[0].s}</b></div><div class="rope"><div class="mid"></div><div class="knot" id="knot" style="left:${50+pos/MAX*42}%">🎗️</div></div><div class="tm t1"><b id="s1">${T[1].s}</b>${T[1].n} ${T[1].e}</div></div>`;
  function draw(){const t=i%2;const q=Q[i];$('play').innerHTML=head(`${g.emo} Soalan ${i+1}/${Q.length}`)+rope()+`<div class="turn" style="--tc:${T[t].c}">GILIRAN: ${T[t].e} PASUKAN ${T[t].n}</div><div id="qh"></div><div class="fb" id="fb"></div>`;sc.ui();setPg(i,Q.length);
   ask($('qh'),q,{time:d.time,onDone:(r,left,ch,it)=>{if(r){sc.hit(left,d.time);pull(t);fbShow(true,`✅ <b>${T[t].e} ${T[t].n} betul!</b> Tali ditarik!${exOf(q)}`,nxt,NXT(i+1<Q.length),q.ex?2600:1500)}
    else{sc.miss();const o=1-t;if(ch<0||it.opts.length<3){fbShow(false,`${ch<0?'⏰ Masa tamat!':'❌ Salah.'} ${ansOf(it)}${exOf(q)}`,nxt,NXT(i+1<Q.length));return}
     $('fb').className='fb on bad';$('fb').innerHTML=`❌ <b>${T[t].n} salah!</b><div class="row mt"><button class="btn gold sm" id="steal" style="--tc:${T[o].c}">${T[o].e} ${T[o].n} – CURI JAWAPAN!</button><button class="btn ghost sm" id="nosteal">Langkau ▶</button></div>`;
     const doSteal=()=>{$('fb').className='fb';ask($('qh'),q,{time:Math.max(8,d.time-6),drop:[it.opts[ch]],pre:`<div class="turn" style="--tc:${T[o].c}">⚡ CURI: ${T[o].e} PASUKAN ${T[o].n}</div>`,onDone:(r2,l2,c2,it2)=>{if(r2){pull(o);sfx('combo');toast('⚡ CURI BERJAYA!','#FFC83D');fbShow(true,`⚡ <b>${T[o].n} berjaya mencuri!</b>${exOf(q)}`,nxt,NXT(i+1<Q.length),2400)}else{sfx('no');fbShow(false,`❌ Curi gagal. ${ansOf(it2)}${exOf(q)}`,nxt,NXT(i+1<Q.length))}}})};
     $('steal').onclick=doSteal;$('nosteal').onclick=nxt;AUTO=doSteal}}})}
  function pull(t){T[t].s++;pos+=t?1:-1;pos=Math.max(-MAX,Math.min(MAX,pos));$('knot').style.left=(50+pos/MAX*42)+'%';$('s0').textContent=T[0].s;$('s1').textContent=T[1].s;sfx('hit')}
  function nxt(){i++;if(i<Q.length)draw();else{const w=T[0].s===T[1].s?'⚖️ SERI':`🏆 ${T[T[0].s>T[1].s?0:1].e} ${T[T[0].s>T[1].s?0:1].n} MENANG`;confetti(120);result(idx,sc,sc.ok/Q.length,`${w} ${T[0].s}–${T[1].s}`)}}
  draw()},

 /* ===== 12. TRUE OR FALSE (kad leret) ===== */
 swipe(g,idx){const d=DIFF[S.lv];const sc=Score();const Q=take(B(g.data).map(ntf),NQ());let i=0;
  function draw(){const q=Q[i];$('play').innerHTML=head(`${g.emo} ${i+1}/${Q.length}`)+`<div class="timer" id="tm"><i></i></div><div class="sw-stack">${i+1<Q.length?'<div class="sw-card under"></div>':''}<div class="sw-card" id="card"><div class="sw-stamp" id="stp"></div><div class="sw-t">${txt(q.t)}</div></div></div>
    <div class="sw-btns"><button class="bigb f" data-o="0"><span class="e">✖</span>SALAH</button><button class="bigb t" data-o="1"><span class="e">✔</span>BENAR</button></div><div class="sw-tip">⬅️ Leret kiri = SALAH · Leret kanan = BENAR ➡️</div><div class="fb" id="fb"></div>`;
   sc.ui();setPg(i,Q.length);let done=false;const left=startTimer(d.time,()=>ans(-1));const card=$('card');
   function ans(v){if(done)return;done=true;stopTimer();AUTO=null;const right=v===(q.a?1:0);document.querySelectorAll('[data-o]').forEach(b=>b.disabled=true);
    if(v>=0){card.classList.add(v?'goR':'goL');$('stp').textContent=v?'BENAR':'SALAH'}
    const more=i+1<Q.length;const nx=()=>{i++;more?draw():result(idx,sc,sc.ok/Q.length,'')};const truth=`Pernyataan ini <b>${q.a?'BENAR ✔':'SALAH ✖'}</b>.`;
    if(right){const gn=sc.hit(left(),d.time);fbShow(true,`✅ <b>Tepat! +${gn}</b> ${truth}${exOf(q)}`,nx,NXT(more),q.ex?2600:1300)}else{sc.miss();fbShow(false,`${v<0?'⏰ <b>Masa tamat!</b>':'❌ <b>Silap!</b>'} ${truth}${exOf(q)}`,nx,NXT(more))}}
   document.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>ans(+b.dataset.o));AUTO=()=>ans(q.a?1:0);
   let sx=null;card.addEventListener('pointerdown',e=>{sx=e.clientX;card.setPointerCapture(e.pointerId);card.style.transition='none'});
   card.addEventListener('pointermove',e=>{if(sx===null)return;const dx=e.clientX-sx;card.style.transform=`translateX(${dx}px) rotate(${dx/18}deg)`;$('stp').textContent=dx>40?'BENAR':dx<-40?'SALAH':'';$('stp').className='sw-stamp '+(dx>40?'t':dx<-40?'f':'')});
   card.addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx;sx=null;card.style.transition='';if(Math.abs(dx)>90)ans(dx>0?1:0);else{card.style.transform='';$('stp').textContent=''}});
   const kh=e=>{if(!$('card')){removeEventListener('keydown',kh);return}if(e.key==='ArrowRight')ans(1);if(e.key==='ArrowLeft')ans(0)};addEventListener('keydown',kh)}
  draw()},

 /* ===== 13. MAZE CHALLENGE ===== */
 maze(g,idx){const d=DIFF[S.lv];const sc=Score();const N={1:6,2:8,3:10}[S.lv];const W=S.lv===3?6:5;const Q=take(pool(g),N);const n=Q.length;let lives=d.lives;
  let path=null;for(let t=0;t<500&&!path;t++){const p=[[0,0]];const seen=new Set(['0,0']);let ok=true;while(p.length<=n){const[x,y]=p[p.length-1];const nb=shuf([[1,0],[0,1],[-1,0],[0,-1]]).map(([dx,dy])=>[x+dx,y+dy]).filter(([a,b])=>a>=0&&b>=0&&a<W&&b<W&&!seen.has(a+','+b));if(!nb.length){ok=false;break}const nx=nb[0];p.push(nx);seen.add(nx.join(','))}if(ok)path=p}
  const DIRS={'1,0':['➡️','Kanan'],'-1,0':['⬅️','Kiri'],'0,1':['⬇️','Bawah'],'0,-1':['⬆️','Atas']};let step=0;
  function grid(){const on=new Set(path.slice(0,step+1).map(c=>c.join(',')));let h='';for(let y=0;y<W;y++)for(let x=0;x<W;x++){const k=x+','+y;const cur=path[step].join(',')===k;const ex=path[n].join(',')===k;h+=`<div class="mz ${on.has(k)?'path':''} ${cur?'cur':''} ${ex?'exit':''}">${cur?'🧑‍🎓':ex?'🚪':''}</div>`}return `<div class="maze" style="--w:${W}">${h}</div>`}
  function draw(){const q=Q[step];$('play').innerHTML=head(`${g.emo} Langkah ${step+1}/${n}`,{lives,max:d.lives})+`<div class="mz-wrap" id="mzw">${grid()}</div><div id="qh"></div><div class="fb" id="fb"></div>`;sc.ui();setPg(step,n);
   const[x,y]=path[step],[x2,y2]=path[step+1];const dir=(x2-x)+','+(y2-y);let tries=0;
   ask($('qh'),q,{time:d.time+4,pre:`<div class="catbar" style="--cc:var(--a)">🌀 Jawapan betul = arah keluar</div>`,deco:it=>{const others=shuf(Object.keys(DIRS).filter(k=>k!==dir));return it.opts.map((_,j)=>j===it.ans?DIRS[dir][0]:DIRS[others.pop()][0])},retry:true,
    onWrong:()=>{tries++;lives--;hearts(lives,d.lives);sc.miss();toast('🧱 JALAN BUNTU!','#FF4D6D');if(lives<=0){stopTimer();AUTO=null;document.querySelectorAll('[data-o]').forEach(b=>b.disabled=true);fbShow(false,`💔 <b>Nyawa habis – sesat dalam labirin!</b> ${ansOf(q)}`,()=>result(idx,sc,sc.ok/n*.8,`Sesat di langkah ${step+1}/${n}`),'Lihat Keputusan 🏁')}},
    onDone:(r,left,ch,it)=>{if(lives<=0)return;if(r&&!tries)sc.hit(left,d.time+4);else if(r){sc.score+=Math.round(30*d.mult);sc.ui();sfx('ok')}else{lives--;hearts(lives,d.lives);sc.miss()}
     step++;$('mzw').innerHTML=grid();const done=step>=n;const nx=()=>{if(done){sfx('win');confetti(120);result(idx,sc,sc.ok/n,`🚪 Berjaya keluar labirin · ${lives} ❤️ berbaki`)}else if(lives<=0)result(idx,sc,sc.ok/n*.8,'💔 Nyawa habis');else draw()};
     fbShow(r,`${r?(tries?'↪️ <b>Akhirnya jumpa jalan!</b>':'✅ <b>Jalan betul!</b>'):'⏰ <b>Masa tamat!</b> '+ansOf(it)} ${DIRS[dir][0]} ${DIRS[dir][1]}${exOf(q)}`,nx,done?'Keluar Labirin 🏁':'Langkah Seterusnya ▶',r?(q.ex?2600:1300):0)}})}
  draw()},

 /* ===== 14. TREASURE HUNT ===== */
 treasure(g,idx){const d=DIFF[S.lv];const sc=Score();const Q=take(pool(g),{1:6,2:8,3:10}[S.lv]);const n=Q.length;const res=Q.map(()=>0);let i=0;
  const pts=Q.map((_,k)=>{const cols=4;const row=k/cols|0;const c=k%cols;return{x:8+(row%2?(cols-1-c):c)*26,y:14+row*30}});const fin_={x:pts[n-1].x,y:pts[n-1].y+24};
  function map(){return `<div class="tmap" style="height:${(Math.ceil(n/4))*30+30}%"><svg viewBox="0 0 100 ${Math.ceil(n/4)*30+30}" preserveAspectRatio="none"><polyline points="${[...pts,fin_].map(p=>(p.x+4)+','+(p.y+4)).join(' ')}" fill="none" stroke="#8a5a2b" stroke-width=".8" stroke-dasharray="2 1.5"/></svg>
   ${pts.map((p,k)=>`<div class="spot ${k===i?'cur':''} ${res[k]===1?'ok':res[k]===2?'no':''}" style="left:${p.x}%;top:${p.y/(Math.ceil(n/4)*30+30)*100}%">${res[k]===1?'💰':res[k]===2?'🪨':k===i?'🧭':'❓'}<small>${k+1}</small></div>`).join('')}
   <div class="spot chest ${i>=n?'cur':''}" style="left:${fin_.x}%;top:${fin_.y/(Math.ceil(n/4)*30+30)*100}%">${i>=n?'💎':'🧰'}</div></div>`}
  function draw(){const q=Q[i];$('play').innerHTML=head(`${g.emo} Petunjuk ${i+1}/${n}`)+`<div class="tmap-wrap" id="tmw">${map()}</div><div id="qh"></div><div class="fb" id="fb"></div>`;sc.ui();setPg(i,n);
   ask($('qh'),q,{time:d.time,pre:`<div class="clue">📜 PETUNJUK #${i+1}</div>`,onDone:(r,left,ch,it)=>{res[i]=r?1:2;if(r){sc.hit(left,d.time);sfx('coin')}else sc.miss();i++;$('tmw').innerHTML=map();const done=i>=n;
    const nx=()=>{if(done){const gold=res.filter(x=>x===1).length;sfx('win');confetti(180);toast(`💎 HARTA DITEMUI! ${gold} 💰`,'#FFC83D');sc.score+=gold*Math.round(30*d.mult);sc.ui();later(()=>result(idx,sc,sc.ok/n,`💎 Harta karun ditemui · ${gold}/${n} 💰`),1100)}else draw()};
    fbShow(r,`${r?'💰 <b>Betul! Jejak ditemui.</b>':(ch<0?'⏰ <b>Masa tamat!</b> ':'🪨 <b>Salah jejak.</b> ')+ansOf(it)}${exOf(q)}`,nx,done?'Buka Peti Harta 🧰':'Petunjuk Seterusnya ▶',r?(q.ex?2600:1300):0)}})}
  draw()},

 /* ===== 17. LEADERBOARD CHALLENGE ===== */
 ladder(g,idx){const d=DIFF[S.lv];const sc=Score();const Q=take(pool(g),NQ());const n=Q.length;let i=0;const max=n*170*d.mult;const rivals=shuf(BOTS).slice(0,9).map((nm,k)=>({n:nm,s:Math.round(max*(.1+k*.095)/10)*10}));let lastRank=10;
  const rows=()=>[...rivals,{n:S.name||'Anda',s:sc.score,me:1}].sort((a,b)=>b.s-a.s||(a.me?-1:1));
  const rank=()=>rows().findIndex(r=>r.me)+1;
  const board=()=>`<div class="ladder">${rows().map((r,k)=>`<div class="ld ${r.me?'me':''}"><b>${k<3?['🥇','🥈','🥉'][k]:k+1}</b><span>${esc(r.n)}</span><i>${r.s}</i></div>`).join('')}</div>`;
  function draw(){const q=Q[i];$('play').innerHTML=head(`${g.emo} ${i+1}/${n}`)+`<div class="ld-wrap"><div id="lb">${board()}</div><div id="qh"></div></div><div class="fb" id="fb"></div>`;sc.ui();setPg(i,n);
   ask($('qh'),q,{time:d.time,onDone:(r,left,ch,it)=>{if(r)sc.hit(left,d.time,true);else sc.miss();const rk=rank();$('lb').innerHTML=board();if(rk<lastRank){toast(`⬆️ NAIK KE TEMPAT #${rk}!`,'#2EE59D');sfx('lvup')}else if(r)sfx('ok');lastRank=rk;
    const more=i+1<n;const nx=()=>{i++;more?draw():result(idx,sc,sc.ok/n,`🏁 Kedudukan akhir #${rank()} / 10`)};
    fbShow(r,`${r?'✅ <b>Betul!</b>':(ch<0?'⏰ <b>Masa tamat!</b> ':'❌ <b>Salah.</b> ')+ansOf(it)} Kedudukan anda: <b>#${rk}</b>${exOf(q)}`,nx,NXT(more),r?(q.ex?2600:1400):0)}})}
  draw()},

 /* ===== 18. FLASHCARD BATTLE ===== */
 flash(g,idx){const d=DIFF[S.lv];const sc=Score();const D=B(g.data);const R=take(D,{1:6,2:8,3:10}[S.lv]);let i=0,me=0,bot=0;const bt={1:[10,14],2:[7,10],3:[4.5,7]}[S.lv];const bacc={1:.6,2:.7,3:.82}[S.lv];
  function draw(){const c=R[i];const wrong=shuf([...new Set(D.filter(x=>x[1]!==c[1]).map(x=>x[1]))]).slice(0,d.opts-1);const opts=shuf([c[1],...wrong]);const ans=opts.indexOf(c[1]);let done=false;const T=bt[0]+Math.random()*(bt[1]-bt[0]);const t0=performance.now();
   $('play').innerHTML=head(`${g.emo} Kad ${i+1}/${R.length}`)+`<div class="fb-score"><div class="me">🧑‍🎓 ANDA <b id="cm">${me}</b> 🃏</div><div class="vs">VS</div><div class="bt">🃏 <b id="cb">${bot}</b> BOT 🤖</div></div>
    <div class="fb-card" id="fcard"><div class="in"><div class="f"><small>KAD IMBAS</small>${txt(c[0])}</div><div class="b"><small>JAWAPAN</small>${txt(c[1])}</div></div></div>
    <div class="botbar"><span>🤖 Bot sedang berfikir…</span><div class="bar"><i id="bbar"></i></div></div>
    <div class="fb-opts">${opts.map((t,j)=>`<button class="fbo ${isAr(t)?'ar':''}" data-o="${j}">${txt(t)}</button>`).join('')}</div><div class="fb" id="fb"></div>`;
   sc.ui();setPg(i,R.length);
   const iv=setInterval(()=>{const p=(performance.now()-t0)/1000/T;$('bbar')&&($('bbar').style.width=Math.min(100,p*100)+'%');if(p>=1){clearInterval(iv);botMove()}},80);ivs.push(iv);
   function end(win,html,good){done=true;clearInterval(iv);AUTO=null;document.querySelectorAll('.fbo').forEach((b,j)=>{b.disabled=true;if(j===ans)b.classList.add('ok')});$('fcard').classList.add('flip');
    if(win===1){me++;$('cm').textContent=me}else if(win===2){bot++;$('cb').textContent=bot}const more=i+1<R.length;
    fbShow(good,html,()=>{i++;more?draw():result(idx,sc,sc.ok/R.length,`🃏 Anda ${me} – ${bot} Bot ${me>bot?'· 🏆 MENANG':me===bot?'· ⚖️ SERI':'· 🤖 Bot menang'}`)},NXT(more),good?1600:0)}
   function botMove(){if(done)return;if(Math.random()<bacc){sc.miss();end(2,`🤖 <b>Bot menjawab dahulu dan betul!</b> Kad milik Bot.`,false)}else{toast('🤖 Bot tersilap!','#FFC83D');$('play').querySelector('.botbar span').textContent='🤖 Bot tersilap – peluang anda!'}}
   document.querySelectorAll('.fbo').forEach(b=>b.onclick=()=>{if(done)return;const j=+b.dataset.o;if(j===ans){const gn=sc.win(Math.round((100+Math.max(0,1-(performance.now()-t0)/1000/T)*100)*d.mult));end(1,`⚡ <b>Anda lebih pantas! +${gn}</b> Kad milik anda.`,true)}else{b.classList.add('no');sc.miss();end(2,`❌ <b>Salah!</b> Kad diambil Bot.`,false)}});
   AUTO=()=>{const b=document.querySelector(`.fbo[data-o="${ans}"]`);if(b)b.click()}}
  draw()},

 /* ===== 19. GUESS THE PICTURE ===== */
 picture(g,idx){const d=DIFF[S.lv];const sc=Score();const Q=take(pool(g),{1:6,2:8,3:8}[S.lv]);let i=0;const NT=16;
  function draw(){const q=Q[i];const T=d.time+6;$('play').innerHTML=head(`${g.emo} Gambar ${i+1}/${Q.length}`)+`<div class="pic"><div class="pic-img">${q.pic||'❓'}</div><div class="pic-cover" id="pcv">${Array.from({length:NT},(_,k)=>`<i data-k="${k}">?</i>`).join('')}</div></div><div id="qh"></div><div class="fb" id="fb"></div>`;sc.ui();setPg(i,Q.length);
   const order=shuf([...Array(NT).keys()]);let shown=S.lv===1?3:S.lv===2?2:1;const reveal=()=>{const t=document.querySelector(`#pcv i[data-k="${order[shown-1]}"]`);if(t)t.classList.add('off')};for(let k=1;k<=shown;k++){const t=document.querySelector(`#pcv i[data-k="${order[k-1]}"]`);t&&t.classList.add('off')}
   const iv=setInterval(()=>{if(shown<NT){shown++;reveal()}},T*1000/NT);ivs.push(iv);
   ask($('qh'),q,{time:T,onDone:(r,left,ch,it)=>{clearInterval(iv);const hid=NT-shown;document.querySelectorAll('#pcv i').forEach(x=>x.classList.add('off'));const more=i+1<Q.length;const nx=()=>{i++;more?draw():result(idx,sc,sc.ok/Q.length,'')};
    if(r){const gn=sc.win(Math.round((100+hid*12)*d.mult));fbShow(true,`🖼️ <b>Tekaan tepat! +${gn}</b> (${hid} jubin masih tertutup)${exOf(q)}`,nx,NXT(more),q.ex?2800:1600)}else{sc.miss();fbShow(false,`${ch<0?'⏰ <b>Masa tamat!</b>':'❌ <b>Tekaan salah.</b>'} ${ansOf(it)}${exOf(q)}`,nx,NXT(more))}}})}
  draw()},

 /* ===== 20. LEVEL UP MISSION ===== */
 levelup(g,idx){const d=DIFF[S.lv];const sc=Score();const P=shuf(pool(g));const tiers=[{n:'REKRUT',e:'🥉',o:2,t:d.time+6},{n:'PAHLAWAN',e:'🥈',o:3,t:d.time},{n:'LEGENDA',e:'🥇',o:4,t:Math.max(9,d.time-4)}];const per=4,need=S.lv===1?2:3;let t=0,k=0,ok=0,qi=0,badges=0;
  const lad=()=>`<div class="tiers">${tiers.map((x,j)=>`<div class="tier ${j<badges?'won':''} ${j===t?'cur':''}"><span>${j<badges?x.e:j===t?'🚀':'🔒'}</span><b>TAHAP ${j+1}</b><small>${x.n}</small></div>`).join('')}</div>`;
  function draw(){const tr=tiers[t];const q=P[qi++%P.length];$('play').innerHTML=head(`${g.emo} Tahap ${t+1} · ${k+1}/${per}`)+lad()+`<div class="xp"><span>XP ${tr.n}</span><div class="bar"><i style="width:${ok/per*100}%"></i></div><b>${ok}/${need} untuk naik</b></div><div id="qh"></div><div class="fb" id="fb"></div>`;sc.ui();setPg(t*per+k,per*3);
   ask($('qh'),q,{time:tr.t,n:Math.min(tr.o,q.o.length),onDone:(r,left,ch,it)=>{if(r){ok++;sc.hit(left,tr.t)}else sc.miss();k++;
    const tierEnd=k>=per;const nx=()=>{if(!tierEnd)return draw();if(ok>=need){badges++;sfx('lvup');confetti(120);toast(`${tr.e} LEVEL UP! ${tr.n}`,'#FFC83D');sc.score+=Math.round(150*(t+1)*d.mult);sc.ui();
      if(t===2)return later(()=>result(idx,sc,sc.ok/(per*3),`🏅 ${badges}/3 lencana · LEGENDA!`),900);t++;k=0;ok=0;later(draw,900)}else{toast('💀 Tahap gagal','#FF4D6D');result(idx,sc,sc.ok/(per*3),`🏅 ${badges}/3 lencana · tersekat di Tahap ${t+1}`)}};
    fbShow(r,`${r?'✅ <b>Betul!</b>':(ch<0?'⏰ <b>Masa tamat!</b> ':'❌ <b>Salah.</b> ')+ansOf(it)}${exOf(q)}`,nx,tierEnd?(ok>=need?'🚀 Naik Tahap!':'Lihat Keputusan'):'Seterusnya ▶',r?(q.ex?2600:1200):0)}})}
  draw()},

 /* ===== 8. CROSSWORD ===== */
 crossword(g,idx){const d=DIFF[S.lv];const sc=Score();const D=B(g.data).map(([w,c])=>({w:WORD(w),c,raw:w}));const pick=take(D,{1:5,2:7,3:9}[S.lv]);const X=cwBuild(pick);const P=X.placed;const st=P.map(()=>({ok:false,miss:0,hint:0,give:false}));let cur=0;
  const cellMap=new Map();P.forEach((p,k)=>{for(let j=0;j<p.w.length;j++){const key=(p.x+(p.dr?0:j))+','+(p.y+(p.dr?j:0));const o=cellMap.get(key)||{ch:p.w[j],w:[]};o.w.push(k);cellMap.set(key,o)}});
  const shownLetter=(key)=>{const o=cellMap.get(key);for(const k of o.w){const p=P[k];if(st[k].ok||st[k].give)return o.ch;const j=p.dr?(+key.split(',')[1]-p.y):(+key.split(',')[0]-p.x);if(j<st[k].hint)return o.ch}return ''};
  function gridHTML(){let h='';for(let y=0;y<X.H;y++)for(let x=0;x<X.W;x++){const key=x+','+y;const o=cellMap.get(key);if(!o){h+='<div class="cw-x"></div>';continue}const num=P.find(p=>p.x===x&&p.y===y);const act=o.w.includes(cur);const solved=o.w.some(k=>st[k].ok);
   h+=`<div class="cw-c ${act?'act':''} ${solved?'ok':''}" data-w="${o.w[0]}">${num?`<sup>${num.n}</sup>`:''}${shownLetter(key)}</div>`}return `<div class="cw" style="--cw:${X.W}">${h}</div>`}
  const clue=(p,k)=>`<button class="cl ${k===cur?'act':''} ${st[k].ok?'ok':st[k].give?'give':''}" data-k="${k}"><b>${p.n}</b> ${esc(p.c)} <small>(${p.w.length})</small></button>`;
  function draw(){const p=P[cur];$('play').innerHTML=head(`${g.emo} Silang Kata`)+`<div class="cw-wrap"><div class="cw-grid">${gridHTML()}</div><div class="cw-clues"><h4>➡️ MENDATAR</h4>${P.map((p,k)=>[p,k]).filter(([p])=>!p.dr).sort((a,b)=>a[0].n-b[0].n).map(([p,k])=>clue(p,k)).join('')}<h4>⬇️ MENEGAK</h4>${P.map((p,k)=>[p,k]).filter(([p])=>p.dr).sort((a,b)=>a[0].n-b[0].n).map(([p,k])=>clue(p,k)).join('')}</div></div>
    <div class="cw-in"><div class="cw-q"><b>${p.n} ${p.dr?'Menegak':'Mendatar'}</b> · ${esc(p.c)} <small>(${p.w.length} huruf)</small></div><div class="cw-row"><input id="cwI" maxlength="${p.w.length+4}" autocomplete="off" autocapitalize="characters" placeholder="${S.lv===1?p.w[0]+'…':'Taip jawapan'}"><button class="btn gold sm" id="cwOk">SEMAK</button></div>
    <div class="row">${S.lv<3?'<button class="btn ghost sm" id="cwH">💡 Beri Huruf</button>':''}<button class="btn ghost sm" id="cwG">🏳️ Lihat Jawapan</button></div></div><div class="fb" id="fb"></div>`;
   sc.ui();setPg(st.filter(s=>s.ok||s.give).length,P.length);
   document.querySelectorAll('.cl').forEach(b=>b.onclick=()=>{cur=+b.dataset.k;draw()});document.querySelectorAll('.cw-c').forEach(b=>b.onclick=()=>{const ws=cellMap.get([...b.parentNode.children].indexOf(b)%X.W+','+([...b.parentNode.children].indexOf(b)/X.W|0)).w;cur=ws.includes(cur)&&ws.length>1?ws.find(k=>k!==cur):ws[0];draw()});
   const inp=$('cwI');if(!st[cur].ok&&!st[cur].give){inp.focus({preventScroll:true})}else{inp.disabled=true;$('cwOk').disabled=true}
   inp.addEventListener('keydown',e=>{if(e.key==='Enter')check()});$('cwOk').onclick=check;
   if($('cwH'))$('cwH').onclick=()=>{if(st[cur].ok||st[cur].give)return;st[cur].hint=Math.min(p.w.length-1,st[cur].hint+1);sc.score=Math.max(0,sc.score-Math.round(25*d.mult));sfx('tap');draw()};
   $('cwG').onclick=()=>{if(st[cur].ok||st[cur].give)return;st[cur].give=true;sc.miss();toast(p.w,'#FF4D6D');nextOpen()};
   AUTO=()=>{if(st[cur].ok||st[cur].give){nextOpen();return}$('cwI').value=P[cur].w;check()}}
  function check(){const p=P[cur];const v=WORD($('cwI').value);if(!v)return;if(v===p.w){st[cur].ok=true;const pen=st[cur].miss*.15+st[cur].hint*.1;sc.win(Math.round((80+p.w.length*12)*(1-Math.min(.6,pen))*d.mult));nextOpen()}else{st[cur].miss++;sc.miss();const i_=$('cwI');i_.classList.add('shake');setTimeout(()=>i_.classList.remove('shake'),400)}}
  function nextOpen(){const k=P.findIndex((_,j)=>!st[j].ok&&!st[j].give);if(k<0){AUTO=null;sfx('win');confetti(140);const acc=st.reduce((a,s)=>a+(s.ok?(s.miss||s.hint?.75:1):0),0)/P.length;draw();document.querySelectorAll('.cw-in input,.cw-in button').forEach(b=>b.disabled=true);later(()=>result(idx,sc,acc,`✏️ ${st.filter(s=>s.ok).length}/${P.length} perkataan`),1200);return}cur=k;draw()}
  draw()},

 /* ===== 15. WORD SEARCH ===== */
 wordsearch(g,idx){const d=DIFF[S.lv];const sc=Score();const D=B(g.data).map(([w,c])=>({w:WORD(w),c}));const pick=take(D.filter(x=>x.w.length<=12),{1:5,2:7,3:8}[S.lv]);
  const dirs={1:[[1,0],[0,1]],2:[[1,0],[0,1],[1,1]],3:[[1,0],[0,1],[1,1],[-1,0],[0,-1],[1,-1]]}[S.lv];const size=Math.max(Math.max(...pick.map(p=>p.w.length))+1,{1:9,2:10,3:11}[S.lv]);
  const X=wsBuild(pick.map(p=>p.w),size,dirs);const found=new Set();let wrong=0,ended=false,a=null;const T={1:240,2:200,3:180}[S.lv]*TS;const cols=['#22D3EE','#A78BFA','#FFC83D','#2EE59D','#FF4D6D','#60A5FA','#F472B6','#FB923C'];
  $('play').innerHTML=head(`${g.emo} Cari Kata`)+`<div class="tc-top"><div class="clock" id="clk"></div><div class="tc-goal">Ditemui <b id="wf">0</b>/${pick.length}</div></div><div class="timer big" id="gtm"><i></i></div>
   <div class="ws-wrap"><div class="ws" id="ws" style="--n:${size}">${X.G.map((r,y)=>r.map((c,x)=>`<div class="wc" data-x="${x}" data-y="${y}">${c}</div>`).join('')).join('')}</div>
   <div class="ws-list" id="wl">${pick.map((p,k)=>`<div class="wi" data-k="${k}">${S.lv===3?`💡 ${esc(p.c)}`:`<b>${p.w}</b>${S.lv===1?`<small>${esc(p.c)}</small>`:''}`}</div>`).join('')}</div></div><div class="fb" id="fb"></div>`;
  sc.ui();setPg(0,pick.length);gclock(T,()=>end(false),'clk');
  const cell=(x,y)=>document.querySelector(`.wc[data-x="${x}"][data-y="${y}"]`);
  const line=(x0,y0,x1,y1)=>{const dx=Math.sign(x1-x0),dy=Math.sign(y1-y0);const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));if(!(x0===x1||y0===y1||Math.abs(x1-x0)===Math.abs(y1-y0)))return null;return Array.from({length:n+1},(_,k)=>[x0+dx*k,y0+dy*k])};
  function evalSel(c0,c1){document.querySelectorAll('.wc.sel').forEach(e=>e.classList.remove('sel'));const ln=line(c0[0],c0[1],c1[0],c1[1]);if(!ln||ln.length<2)return;const s=ln.map(([x,y])=>X.G[y][x]).join('');
   const k=pick.findIndex((p,j)=>!found.has(j)&&(p.w===s||p.w===[...s].reverse().join('')));
   if(k>=0){found.add(k);const col=cols[found.size%cols.length];ln.forEach(([x,y])=>{const e=cell(x,y);e.classList.add('fd');e.style.setProperty('--fc',col)});const wi=document.querySelector(`.wi[data-k="${k}"]`);wi.classList.add('got');wi.style.setProperty('--fc',col);if(S.lv===3)wi.innerHTML=`<b>${pick[k].w}</b><small>${esc(pick[k].c)}</small>`;
    sc.win(Math.round((60+pick[k].w.length*10)*d.mult));$('wf').textContent=found.size;setPg(found.size,pick.length);if(found.size===pick.length)end(true)}
   else{wrong++;sc.streak=0;sc.ui();sfx('no');ln.forEach(([x,y])=>{const e=cell(x,y);e.classList.add('bad');setTimeout(()=>e.classList.remove('bad'),400)})}}
  const ws=$('ws');let down=null,moved=false;const at=e=>{const el=document.elementFromPoint(e.clientX,e.clientY);return el&&el.classList.contains('wc')?[+el.dataset.x,+el.dataset.y]:null};
  ws.addEventListener('pointerdown',e=>{const c=at(e);if(!c)return;e.preventDefault();down=c;moved=false});
  ws.addEventListener('pointermove',e=>{if(!down)return;const c=at(e);if(!c)return;if(c[0]!==down[0]||c[1]!==down[1])moved=true;document.querySelectorAll('.wc.sel').forEach(x=>x.classList.remove('sel'));const ln=line(down[0],down[1],c[0],c[1]);(ln||[down]).forEach(([x,y])=>cell(x,y).classList.add('sel'))});
  addEventListener('pointerup',e=>{if(!down||ended)return;const c=at(e)||down;const d0=down;down=null;if(moved){a=null;evalSel(d0,c);return}
   if(a&&(a[0]!==c[0]||a[1]!==c[1])){const s=a;a=null;evalSel(s,c)}else{a=c;document.querySelectorAll('.wc.sel').forEach(x=>x.classList.remove('sel'));cell(c[0],c[1]).classList.add('sel');sfx('tap')}});
  AUTO=()=>{const k=pick.findIndex((_,j)=>!found.has(j));if(k<0)return;const p=X.pos.find(q=>q.w===pick[k].w);evalSel([p.x,p.y],[p.x+p.dx*(p.w.length-1),p.y+p.dy*(p.w.length-1)])};
  function end(all){if(ended)return;ended=true;AUTO=null;if(GC){GC.stop();GC=null}if(all){sfx('win');confetti(140)}else toast('⌛ MASA TAMAT','#FF4D6D');
   pick.forEach((p,k)=>{if(!found.has(k)){const q=X.pos.find(z=>z.w===p.w);for(let j=0;j<p.w.length;j++)cell(q.x+q.dx*j,q.y+q.dy*j).classList.add('miss')}});
   later(()=>result(idx,sc,Math.max(0,found.size/pick.length-wrong*.02),`🔎 ${found.size}/${pick.length} perkataan ditemui`),1300)}},
};

/* ---------- keputusan ---------- */
function result(i,sc,acc,note){clearAll();acc=Math.max(0,Math.min(1,acc||0));const stars=acc>=.9?3:acc>=.7?2:acc>=.5?1:0;const g=L.stages[i];const prev=S.st[i];const first=stars>0&&!prev.stars;
 if(stars>prev.stars||(stars===prev.stars&&sc.score>prev.score))S.st[i]={stars:Math.max(stars,prev.stars),score:Math.max(sc.score,prev.score)};save();go('sRes');
 $('rT').textContent=stars===3?'🔥 SEMPURNA!':stars===2?'⚡ HEBAT!':stars===1?'✅ MISI LULUS':'💀 MISI GAGAL';
 $('rP').textContent=sc.score;
 $('rStats').innerHTML=`<div class="stat">${Math.round(acc*100)}%<small>Ketepatan</small></div><div class="stat">${sc.ok}<small>Betul</small></div><div class="stat">🔥 ${sc.best}<small>Combo terbaik</small></div>${note?`<div class="stat">${esc(note)}<small>Status</small></div>`:''}`;
 [...$('rS').children].forEach((s,k)=>{s.classList.remove('on');if(k<stars)setTimeout(()=>{s.classList.add('on');sfx('star')},350+k*380)});
 $('rB').innerHTML=stars?`<div class="badge"><span class="e">${g.emo}</span>Lencana: ${esc(g.badge||g.name)}${first?' · BAHARU!':''}</div>`:'';
 $('rM').textContent=stars===3?'Luar biasa! Anda menguasai misi ini sepenuhnya.':stars===2?'Sedikit lagi untuk 3 bintang. Cuba lagi!':stars===1?'Misi seterusnya telah dibuka. Ulang untuk bintang penuh!':'Perlukan sekurang-kurangnya 50% betul. Buka Nota Flash Card, kemudian cuba lagi.';
 if(stars)setTimeout(()=>confetti(stars*60),300);
 $('rRetry').onclick=()=>brief(i);const all=S.st.every(x=>x.stars>0);const nextI=i+1<L.stages.length&&unlocked(i+1)?i+1:-1;
 $('rNext').textContent=all&&first?'🏆 Lihat Sijil':nextI>=0&&stars?'Misi Seterusnya ▶':'🗺️ Ke Peta Misi';
 $('rNext').onclick=()=>all&&first?showCert():nextI>=0&&stars?brief(nextI):go('sMap');hud()}
function rank(){const p=totStars()/MAXS;const R=L.ranks||['Legenda','Pahlawan','Pejuang','Perintis'];return p>=.93?'👑 '+R[0]:p>=.73?'🥇 '+R[1]:p>=.53?'🥈 '+R[2]:'🥉 '+R[3]}
function showCert(){go('sCert');$('cN').textContent=S.name;$('cR').textContent=rank()+' · Level '+S.lv;$('cP').textContent='⚡ '+totScore();
 $('cS').innerHTML='<span class="on">★</span>'.repeat(totStars())+'<span>★</span>'.repeat(MAXS-totStars());
 $('cB').innerHTML=L.stages.map((g,i)=>`<div class="badge ${S.st[i].stars?'':'lock'}"><span class="e">${g.emo}</span>${esc(g.badge||g.name)}</div>`).join('');
 try{const k=KEY+'_lb';const lb=JSON.parse(localStorage.getItem(k)||'[]');const rec={n:S.name,l:S.lv,s:totStars(),p:totScore()};const j=lb.findIndex(r=>r.n===rec.n&&r.l===rec.l);if(j>=0){if(rec.p>lb[j].p)lb[j]=rec}else lb.push(rec);lb.sort((a,b)=>b.p-a.p);localStorage.setItem(k,JSON.stringify(lb.slice(0,20)))}catch(e){}
 confetti(240);sfx('win')}
function renderLb(){let lb=[];try{lb=JSON.parse(localStorage.getItem(KEY+'_lb')||'[]')}catch(e){}
 $('lbBody').innerHTML=lb.length?lb.map((r,i)=>`<tr><td>${['🥇','🥈','🥉'][i]||i+1}</td><td><b>${esc(r.n)}</b></td><td>Level ${r.l}</td><td>${r.s}</td><td><b>${r.p}</b></td></tr>`).join(''):'<tr><td colspan="5">Belum ada juara. Tamatkan semua misi untuk tersenarai!</td></tr>'}
window.__G={go,S:()=>S,setS:v=>{S=v},showCert,renderMap,RUN,result};
const me=document.currentScript&&document.currentScript.src;const shs=document.createElement('script');shs.src=me?me.replace(/engine\.js.*$/,'share.js?v=1795311519'):'../assets/share.js';document.body.appendChild(shs);
})();
