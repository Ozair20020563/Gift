/* Final script.js - handles visuals, modals, music, gallery, swipe, keyboard, and fixes */

/* ---------- DOM refs ---------- */
const overlay = document.getElementById('overlay');
const modalCard = document.getElementById('modalCard');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const audioPlayer = document.getElementById('audioPlayer');

const bgHeartsCanvas = document.getElementById('bgHeartsCanvas');
const confettiCanvas = document.getElementById('confettiCanvas');
const stopVisualBtn = document.getElementById('stopVisualBtn');

const celebrateBtn = document.getElementById('celebrateBtn');
const openSurpriseBtn = document.getElementById('openSurprise');
const openNotesBtn = document.getElementById('openNotes');
const openMorningBtn = document.getElementById('openMorning');
const openMemoriesBtn = document.getElementById('openMemories');
const openStoryBtn = document.getElementById('openStory');

const galleryPrev = document.getElementById('galleryPrev');
const galleryNext = document.getElementById('galleryNext');

let heartsCtx = bgHeartsCanvas.getContext('2d');
let confettiCtx = confettiCanvas.getContext('2d');

let width = window.innerWidth, height = window.innerHeight;
bgHeartsCanvas.width = width; bgHeartsCanvas.height = height;
confettiCanvas.width = width; confettiCanvas.height = height;

window.addEventListener('resize', ()=>{
  width = window.innerWidth; height = window.innerHeight;
  bgHeartsCanvas.width = width; bgHeartsCanvas.height = height;
  confettiCanvas.width = width; confettiCanvas.height = height;
});

/* ---------- nicknames (used only if you generate programmatic placeholders) ---------- */
const nicknames = ["Biwi","Begum","Zojha","Jaan","My Galaxy","Roohi","Mohtarma","Cutiee","Patutiee","Lovey Dovey","Mera Dil","Meri Jaan","Meri Pyari","Meri Zindagi","Meri Saans","My Universe","My Darling","My Heart","My Angel","My Sunshine"];

/* ---------- Visual state ---------- */
let hearts = [];    // floating hearts + small particles
let bursts = [];    // periodic big heart pop -> spawns small hearts
let confetti = [];  // confetti pieces (for celebrate)
let celebrationActive = false;
let animId = null;
let confettiAnimId = null;
let burstTimer = null;

/* ---------- helpers ---------- */
const rand = (a,b) => Math.random()*(b-a)+a;
const clamp = (v,min,max) => Math.max(min,Math.min(max,v));

/* ---------- hearts & bursts logic (always running) ---------- */
function spawnHeart(x = rand(0,width), y = rand(height*0.6, height), r = rand(6,20), color){
  hearts.push({
    x, y, r,
    vx: rand(-0.3,0.3),
    vy: rand(-0.7,-1.4),
    alpha: 1,
    life: 220 + Math.floor(rand(0,260)),
    color: color || `hsl(${rand(320,360)},85%,${rand(60,74)}%)`
  });
}
function spawnBurst(x = width/2, y = height/2){
  bursts.push({x,y,age:0,life:60 + Math.floor(rand(20,40)), r: rand(64,110)});
  const smallCount = 18 + Math.floor(rand(10,28));
  for(let i=0;i<smallCount;i++){
    const angle = rand(0,Math.PI*2);
    const speed = rand(1.8,4.8);
    hearts.push({
      x, y,
      vx: Math.cos(angle)*speed*rand(0.6,1.2),
      vy: Math.sin(angle)*speed*rand(0.6,1.2),
      r: rand(4,10),
      alpha:1,
      life: 80 + Math.floor(rand(0,120)),
      color:`hsl(${rand(320,360)},88%,${rand(60,74)}%)`
    });
  }
}
/* seed a few hearts */
for(let i=0;i<18;i++) spawnHeart();

/* ---------- confetti (celebration) ---------- */
function spawnConfetti(n=160){
  confetti = [];
  for(let i=0;i<n;i++){
    confetti.push({
      x: rand(0,width),
      y: rand(-height, 0),
      r: rand(6,12),
      vx: rand(-2.2,2.2),
      vy: rand(1.8,5.5),
      rot: rand(0,Math.PI*2),
      color: `hsl(${rand(0,360)},85%,${rand(55,72)}%)`
    });
  }
}

/* ---------- draw frame ---------- */
function drawFrame(){
  // hearts canvas
  heartsCtx.clearRect(0,0,width,height);
  // draw hearts
  for(let i=hearts.length-1;i>=0;i--){
    const p = hearts[i];
    p.x += p.vx; p.y += p.vy; p.vy -= 0.004;
    p.alpha = clamp(p.alpha - 0.0012, 0, 1);
    heartsCtx.globalAlpha = clamp(Math.max(0.08, p.alpha), 0, 1);
    heartsCtx.fillStyle = p.color;
    // simple heart path (approx)
    const x = p.x, y = p.y, r = p.r;
    heartsCtx.beginPath();
    heartsCtx.moveTo(x, y);
    heartsCtx.bezierCurveTo(x, y-r/1.4, x-r, y-r/1.4, x-r, y);
    heartsCtx.bezierCurveTo(x-r, y+r/2, x, y+r, x, y+r*1.6);
    heartsCtx.bezierCurveTo(x, y+r, x+r, y+r/2, x+r, y);
    heartsCtx.bezierCurveTo(x+r, y-r/1.4, x, y-r/1.4, x, y);
    heartsCtx.fill();
    heartsCtx.globalAlpha = 1;
    p.life--;
    if(p.life <= 0 || p.y < -120 || p.x < -160 || p.x > width+160) hearts.splice(i,1);
  }
  // draw bursts (big hearts)
  for(let i=bursts.length-1;i>=0;i--){
    const b = bursts[i];
    b.age++;
    const t = b.age / b.life;
    const r = b.r * (1 - t*0.8);
    heartsCtx.save();
    heartsCtx.globalAlpha = 1 - t;
    heartsCtx.fillStyle = `rgba(255,107,129,${0.25 + (1-t)*0.6})`;
    // big heart path
    const x = b.x, y = b.y;
    heartsCtx.beginPath();
    heartsCtx.moveTo(x, y);
    heartsCtx.bezierCurveTo(x, y - r/1.4, x - r, y - r/1.4, x - r, y);
    heartsCtx.bezierCurveTo(x - r, y + r/2, x, y + r, x, y + r*1.6);
    heartsCtx.bezierCurveTo(x, y + r, x + r, y + r/2, x + r, y);
    heartsCtx.bezierCurveTo(x + r, y - r/1.4, x, y - r/1.4, x, y);
    heartsCtx.fill();
    heartsCtx.restore();
    if(b.age > b.life) bursts.splice(i,1);
  }

  // confetti on separate canvas
  confettiCtx.clearRect(0,0,width,height);
  if(celebrationActive){
    for(let i=0;i<confetti.length;i++){
      const p = confetti[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.rot += 0.06;
      confettiCtx.save();
      confettiCtx.translate(p.x,p.y);
      confettiCtx.rotate(p.rot);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.r/2,-p.r/2,p.r,p.r*0.6);
      confettiCtx.restore();
      if(p.y > height + 60) {
        confetti[i] = { ...confetti[i], x: rand(0,width), y: -60 };
      }
    }
  }
  requestAnimationFrame(drawFrame);
}
requestAnimationFrame(drawFrame);

/* ---------- celebration control ---------- */
function startCelebrationVisuals(){
  if(celebrationActive) return;
  celebrationActive = true;
  spawnConfetti(200);
  stopVisualBtn.hidden = false;
  scheduleBurst();
}
function stopCelebrationVisuals(){
  celebrationActive = false;
  confetti = [];
  stopVisualBtn.hidden = true;
  if(burstTimer) { clearTimeout(burstTimer); burstTimer = null; }
}
stopVisualBtn.addEventListener('click', stopCelebrationVisuals);

function scheduleBurst(){
  if(!celebrationActive) return;
  // spawn burst at random position
  spawnBurst(rand(width*0.2, width*0.8), rand(height*0.2, height*0.6));
  // spawn some small hearts near bottom
  for(let i=0;i<6;i++) spawnHeart(rand(40,width-40), height - rand(20,60), rand(6,18));
  burstTimer = setTimeout(scheduleBurst, 2200 + Math.random()*2800);
}

/* ---------- Modal & music behavior ---------- */
function showModal(html, musicSrc){
  modalBody.innerHTML = html;
  overlay.classList.remove('hidden');
  overlay.setAttribute('aria-hidden','false');
  modalClose.style.display = 'block'; // fixed visible close
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  // play music for modal only
  if(musicSrc){
    audioPlayer.src = musicSrc;
    audioPlayer.play().catch(()=>{ /* autoplay blocked until user interacts - but user already clicked a button so should play */ });
  }
}
function closeModal(){
  overlay.classList.add('hidden');
  overlay.setAttribute('aria-hidden','true');
  // stop modal music
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  // unlock scroll
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  // do not stop celebration visuals (persist if started)
}
modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', (e)=>{ if(e.target === overlay) closeModal(); });
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

/* ---------- typed hero snippet ---------- */
const typedEl = document.getElementById('typed');
const msgs = [
  `You are my Galaxy, my safe place, my future.`,
  `Open your surprise — every photo and song is a piece of my heart.`,
  `Happy Birthday, my jaan. — Ozair`
];
let ti=0, tp=0;
function typeLoop(){
  if(!typedEl) return;
  const m = msgs[ti];
  if(tp < m.length){ typedEl.textContent += m[tp++]; setTimeout(typeLoop, 30); }
  else { setTimeout(()=>{ typedEl.textContent=''; tp=0; ti=(ti+1)%msgs.length; typeLoop(); }, 2000); }
}
typeLoop();

/* ---------- content builders (placeholders for you to paste real letters) ---------- */
function buildBirthdayHTML(){
  // PUT YOUR 1000+ WORD BIRTHDAY LETTER HERE by replacing the placeholder text below
  return `<h2>Happy Birthday — (Your Title)</h2><div class="modal-body animated-bg"><p><!-- ✨ Paste long birthday text here ✨ --></p></div>`;
}
function buildSurpriseHTML(){
  return `<h2>Your Surprise</h2><div class="modal-body animated-bg"><p><!-- ✨ Paste your surprise letter here ✨ --></p></div>`;
}
function buildWhyHTML(){
  return `<h2>Why I love you ❤️</h2><div class="modal-body animated-bg"><p><!-- ✨ Paste long 'Why I love you' text here ✨ --></p></div>`;
}
function buildMemoryHTML(){
  return `<h2>A memory I keep 🌟</h2><div class="modal-body animated-bg"><p><!-- ✨ Paste long memory text here ✨ --></p></div>`;
}
function buildPromiseHTML(){
  return `<h2>A promise to you 💞</h2><div class="modal-body animated-bg"><p><!-- ✨ Paste long promise text here ✨ --></p></div>`;
}
function buildStorySepHTML(){
  return `<h2>6 Sep 2023 — The Day We Met</h2><div class="modal-body animated-bg"><p><!-- ✨ Paste long story (700+ words) for 6 Sep here ✨ --></p></div>`;
}
function buildStoryOctHTML(){
  return `<h2>19 Oct — My Jaan's Birthday</h2><div class="modal-body animated-bg"><p><!-- ✨ Paste long story (700+ words) for 19 Oct here ✨ --></p></div>`;
}

/* ---------- Button handlers ---------- */

/* Celebrate — start visuals (persistent) and open modal with music (stops when closed) */
celebrateBtn.addEventListener('click', ()=>{
  startCelebrationVisuals();
  showModal(buildBirthdayHTML(), 'assets/music/happy_birthday.mp3');
});

/* Surprise */
openSurpriseBtn.addEventListener('click', ()=>{
  showModal(buildSurpriseHTML(), 'assets/music/music1.mp3');
});

/* Love Notes - show three options; each plays own music while open */
openNotesBtn.addEventListener('click', ()=>{
  const html = `<h2>Love Notes</h2>
    <div style="margin-top:8px">
      <button class="note-btn" id="nbWhy">Why I love you ❤️</button>
      <button class="note-btn" id="nbMem">A memory I keep 🌟</button>
      <button class="note-btn" id="nbPro">A promise to you 💞</button>
    </div>
    <div id="noteArea" style="margin-top:12px"></div>`;
  showModal(html, null);
  setTimeout(()=>{
    document.getElementById('nbWhy').addEventListener('click', ()=>{
      document.getElementById('noteArea').innerHTML = buildWhyHTML();
      audioPlayer.src = 'assets/music/music2.mp3';
      audioPlayer.play().catch(()=>{});
    });
    document.getElementById('nbMem').addEventListener('click', ()=>{
      document.getElementById('noteArea').innerHTML = buildMemoryHTML();
      audioPlayer.src = 'assets/music/music3.mp3';
      audioPlayer.play().catch(()=>{});
    });
    document.getElementById('nbPro').addEventListener('click', ()=>{
      document.getElementById('noteArea').innerHTML = buildPromiseHTML();
      audioPlayer.src = 'assets/music/music4.mp3';
      audioPlayer.play().catch(()=>{});
    });
  }, 60);
});

/* Morning Thumbnails (14) */
openMorningBtn.addEventListener('click', ()=>{
  let html = `<h2>Morning Cutiee 🌸</h2><div class="gallery-grid">`;
  for(let i=1;i<=14;i++) html += `<img src="assets/morning${i}.jpg" data-index="${i-1}" class="thumb">`;
  html += `</div>`;
  showModal(html, null);
  setTimeout(()=>{
    document.querySelectorAll('.thumb').forEach(el=>{
      el.addEventListener('click', (e)=> openGallery('morning', Number(e.currentTarget.dataset.index)));
    });
  }, 60);
});

/* Memories thumbnails (78) */
openMemoriesBtn.addEventListener('click', ()=>{
  let html = `<h2>Our Memories ❤️</h2><div class="memories-grid">`;
  for(let i=1;i<=78;i++) html += `<img src="assets/photo${i}.jpg" data-index="${i-1}" class="thumb">`;
  html += `</div>`;
  showModal(html, null);
  setTimeout(()=>{
    document.querySelectorAll('.thumb').forEach(el=>{
      el.addEventListener('click', (e)=> openGallery('memories', Number(e.currentTarget.dataset.index)));
    });
  }, 80);
});

/* Story */
openStoryBtn.addEventListener('click', ()=>{
  const html = `<h2>Our Story</h2>
    <div>
      <button class="story-btn" id="sSep">6 Sep 2023 — The Day We Met</button>
      <button class="story-btn" id="sOct">19 Oct — My Jaan's Birthday</button>
      <div id="storyArea" style="margin-top:12px"></div>
    </div>`;
  showModal(html, null);
  setTimeout(()=>{
    document.getElementById('sSep').addEventListener('click', ()=>{
      document.getElementById('storyArea').innerHTML = buildStorySepHTML();
      audioPlayer.src = 'assets/music/music5.mp3'; audioPlayer.play().catch(()=>{});
    });
    document.getElementById('sOct').addEventListener('click', ()=>{
      document.getElementById('storyArea').innerHTML = buildStoryOctHTML();
      audioPlayer.src = 'assets/music/music6.mp3'; audioPlayer.play().catch(()=>{});
    });
  }, 60);
});

/* ---------- Gallery slider (opens larger view, first image shows correctly) ---------- */
let galleryArr = [], galleryIdx = 0;
function openGallery(type, startIdx=0){
  galleryArr = [];
  if(type === 'morning'){
    for(let i=1;i<=14;i++) galleryArr.push({img:`assets/morning${i}.jpg`, music:`assets/music/music${((i-1)%12)+1}.mp3`});
  } else {
    for(let i=1;i<=78;i++) galleryArr.push({img:`assets/photo${i}.jpg`, music:`assets/music/music${((i-1)%12)+1}.mp3`});
  }
  galleryIdx = startIdx;
  showGalleryItem();
  // make sure modal visible
  overlay.classList.remove('hidden');
  overlay.setAttribute('aria-hidden','false');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}
function showGalleryItem(){
  if(!galleryArr.length) return;
  const it = galleryArr[galleryIdx];
  // set modal contents (image must be set immediately)
  modalBody.innerHTML = `<div style="text-align:center"><img class="modal-img" src="${it.img}" alt="gallery"></div>`;
  // make nav buttons visible
  galleryPrev.style.display = 'block'; galleryNext.style.display = 'block';
  // play this item's music while modal open
  audioPlayer.src = it.music; audioPlayer.play().catch(()=>{});
}
/* prev/next handlers */
galleryPrev.addEventListener('click', ()=>{ if(!galleryArr.length) return; galleryIdx = (galleryIdx-1+galleryArr.length)%galleryArr.length; showGalleryItem(); });
galleryNext.addEventListener('click', ()=>{ if(!galleryArr.length) return; galleryIdx = (galleryIdx+1)%galleryArr.length; showGalleryItem(); });

/* keyboard */
document.addEventListener('keydown', (e)=>{
  if(overlay.classList.contains('hidden')) return;
  if(e.key === 'ArrowLeft') galleryPrev.click();
  if(e.key === 'ArrowRight') galleryNext.click();
});

/* swipe support on modalBody */
let tStartX = 0, tEndX = 0;
modalBody.addEventListener('touchstart', (e)=>{ if(e.touches && e.touches[0]) tStartX = e.touches[0].clientX; }, {passive:true});
modalBody.addEventListener('touchend', (e)=>{ if(e.changedTouches && e.changedTouches[0]) { tEndX = e.changedTouches[0].clientX; handleSwipe(); } }, {passive:true});
function handleSwipe(){ const d = tEndX - tStartX; if(Math.abs(d) < 50) return; if(d < 0) galleryNext.click(); else galleryPrev.click(); }

/* hide gallery nav on overlay hide */
overlay.addEventListener('transitionend', ()=>{ if(overlay.classList.contains('hidden')){ galleryPrev.style.display='none'; galleryNext.style.display='none'; } });

/* ensure close stops modal music */
modalClose.addEventListener('click', ()=>{ audioPlayer.pause(); audioPlayer.currentTime = 0; closeModal(); });
overlay.addEventListener('click', (e)=>{ if(e.target === overlay){ audioPlayer.pause(); audioPlayer.currentTime = 0; closeModal(); } });

function closeModal(){
  overlay.classList.add('hidden'); overlay.setAttribute('aria-hidden','true');
  document.documentElement.style.overflow = ''; document.body.style.overflow = '';
  // hide navs
  galleryPrev.style.display='none'; galleryNext.style.display='none';
}

/* ---------- small interactive bursts when clicking thumbnails / menu */
document.addEventListener('click', (e)=>{
  if(e.target && (e.target.matches('.thumb') || e.target.matches('.menu-btn'))){
    const r = e.target.getBoundingClientRect();
    spawnBurst(r.left + r.width/2, r.top + r.height/2 - 20);
  }
});

/* ---------- initial state ---------- */
galleryPrev.style.display='none'; galleryNext.style.display='none';
overlay.classList.add('hidden');
stopVisualBtn.hidden = true;

/* ---------- End of file ---------- */
