/* Butang kongsi pautan · Gamifikasi Alfaqih · @powered by alfaqih */
(function(){
'use strict';
const clean=u=>{try{const x=new URL(u,location.href);x.hash='';x.search='';return x.href.replace(/index\.html$/,'')}catch(e){return u}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function copy(text,btn){
  const done=ok=>{if(!btn)return;const o=btn.dataset.lbl||btn.innerHTML;btn.dataset.lbl=o;btn.innerHTML=ok?'✅ Disalin!':'⚠️ Salin manual';btn.classList.toggle('copied',ok);setTimeout(()=>{btn.innerHTML=o;btn.classList.remove('copied')},1800)};
  const fallback=()=>{const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}ta.remove();done(ok);const i=document.getElementById('shUrl');if(!ok&&i){i.focus();i.select()}};
  try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(()=>done(true),fallback)}else fallback()}catch(e){fallback()}
}
window.alfaqihCopy=copy;
function openShare(url,title){
  const m=document.getElementById('shModal');const msg=`🎮 Jom main "${title}"!\n${url}\n\n@powered by alfaqih`;
  document.getElementById('shTitle').textContent=title;document.getElementById('shUrl').value=url;
  document.getElementById('shWa').href='https://wa.me/?text='+encodeURIComponent(msg);
  document.getElementById('shTg').href='https://t.me/share/url?url='+encodeURIComponent(url)+'&text='+encodeURIComponent('🎮 Jom main "'+title+'"!');
  document.getElementById('shCopy').onclick=e=>copy(url,e.currentTarget);
  document.getElementById('shCopyMsg').onclick=e=>copy(msg,e.currentTarget);
  m.classList.add('on');
}
window.alfaqihShare=openShare;
function init(){
  const title=document.body.dataset.shareTitle||(window.LESSON?`P${LESSON.no} · ${LESSON.game}`:'Gamifikasi Alfaqih – Tingkatan 4');
  const wrap=document.createElement('div');
  wrap.innerHTML=`<button class="shFab" id="shFab" title="Kongsi pautan game"><span class="i">🔗</span><span class="t">Kongsi <br>Link</span></button>
  <div class="modal" id="shModal"><div class="glass shBox">
   <div class="mh"><h2>🔗 Kongsi dengan Murid</h2><button class="ibtn" id="shClose">✖</button></div>
   <div class="shTitle" id="shTitle"></div>
   <label class="shLbl" for="shUrl">PAUTAN GAME</label>
   <div class="shRow"><input id="shUrl" readonly><button class="btn sm" id="shCopy">📋 Salin Link</button></div>
   <div class="shBtns"><button class="btn ghost sm" id="shCopyMsg">💬 Salin Mesej + Link</button>
    <a class="btn sm shWa" id="shWa" target="_blank" rel="noopener">WhatsApp</a><a class="btn sm shTg" id="shTg" target="_blank" rel="noopener">Telegram</a></div>
   <p class="shNote">Tampal pautan di Google Classroom, WhatsApp atau Telegram kelas. Murid hanya perlu tekan pautan untuk mula bermain.</p>
  </div></div>`;
  document.body.appendChild(wrap);
  document.getElementById('shFab').onclick=()=>openShare(clean(location.href),title);
  document.getElementById('shClose').onclick=()=>document.getElementById('shModal').classList.remove('on');
  document.getElementById('shModal').addEventListener('click',e=>{if(e.target.id==='shModal')e.target.classList.remove('on')});
  document.getElementById('shUrl').addEventListener('focus',e=>e.target.select());
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
