/* Final script.js — responsive modal, swipeable gallery, confetti, audio, etc. */

/* ---------- Setup & DOM refs ---------- */
const overlay = document.getElementById('overlay');
const modalCard = document.getElementById('modalCard');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const audioPlayer = document.getElementById('audioPlayer');
const confettiCanvas = document.getElementById('confettiCanvas');
const ctx = confettiCanvas.getContext('2d');

const openSurprise = document.getElementById('openSurprise') || document.getElementById('surpriseBtn');
const openNotes = document.getElementById('openNotes');
const celebrateBtn = document.getElementById('celebrateBtn');
const musicBtn = document.getElementById('musicBtn');

const morningGalleryEl = document.getElementById('morningGallery');
const carouselTrack = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentGallery = [];      // array of {img, music}
let currentIndex = 0;
let confettiRAF = null;
let confettiPieces = [];
let isDragging = false;
let dragStartX = 0;
let dragDeltaX = 0;

/* nicknames */
const nicknames = ["Biwi","Begum","Zojha","Jaan","My Galaxy","Roohi","Mohtarma","Cutiee","Patutiee","Lovey Dovey","Mera Dil","Meri Jaan","Meri Pyari","Meri Zindagi","Meri Saans","My Universe","My Darling","My Heart","My Angel","My Sunshine"];

/* helper to play audio safely */
function playMusic(src){
  if(!src) return;
  audioPlayer.src = src;
  audioPlayer.play().catch(()=>{ /* autoplay blocked — user interaction required */ });
}
function stopMusic(){
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
}

/* ---------- Utility: open/close modal ---------- */
function showModal(){
  overlay.classList.remove('hidden');
  overlay.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden'; // lock background scroll
  // ensure close button visible (fix for mobile first open)
  modalClose.style.display = 'block';
}
function closeModal(){
  overlay.classList.add('hidden');
  overlay.setAttribute('aria-hidden','true');
  stopMusic();
  stopConfetti();
  document.body.style.overflow = ''; // restore
}

/* overlay click closes when clicking outside modalCard */
overlay.addEventListener('click', (e)=>{
  if(e.target === overlay) closeModal();
});
modalClose.addEventListener('click', closeModal);
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

/* ---------- Confetti ---------- */
function resizeCanvas(){ confettiCanvas.width = window.innerWidth; confettiCanvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function startConfetti(){
  stopConfetti();
  confettiPieces = [];
  for(let i=0;i<180;i++){
    confettiPieces.push({
      x: Math.random()*confettiCanvas.width,
      y: Math.random()*-confettiCanvas.height,
      vx: -2 + Math.random()*4,
      vy: 2 + Math.random()*6,
      w: 6 + Math.random()*10,
      h: 8 + Math.random()*12,
      color: `hsl(${Math.random()*360},70%,60%)`,
      angle: Math.random()*Math.PI*2
    });
  }
  (function loop(){ 
    ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
    confettiPieces.forEach(p=>{
      p.x += p.vx; p.y += p.vy; p.vy += 0.05;
      ctx.save();
      ctx.translate(p.x,p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });
    confettiRAF = requestAnimationFrame(loop);
  })();
}
function stopConfetti(){ if(confettiRAF) cancelAnimationFrame(confettiRAF); ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height); }

/* ---------- Typed headline (small effect) ---------- */
const typedEl = document.getElementById('typed');
const typedMessages = [
  `You are my Galaxy, my safe place, my future — even oceans couldn't hide what our hearts found.`,
  `Open your surprise. I made this for you — every photo, note and memory is a piece of my heart.`,
  `Happy Birthday, my jaan. — Ozair`
];
let tIdx = 0, tPos = 0;
function typeLoop(){
  if(!typedEl) return;
  const msg = typedMessages[tIdx];
  if(tPos < msg.length){ typedEl.textContent += msg.charAt(tPos++); setTimeout(typeLoop, 30); }
  else { setTimeout(()=>{ typedEl.textContent=''; tPos=0; tIdx=(tIdx+1)%typedMessages.length; typeLoop(); }, 2000); }
}
typeLoop();

/* ---------- Build Morning gallery (14) ---------- */
for(let i=1;i<=14;i++){
  const img = document.createElement('img');
  img.src = `assets/morning${i}.jpg`;
  img.alt = `morning ${i}`;
  img.addEventListener('click', ()=> openGalleryAtIndex(i-1,'morning'));
  img.addEventListener('touchstart', (e)=> spawnHeart(e.touches[0].clientX, e.touches[0].clientY));
  morningGalleryEl.appendChild(img);
}

/* ---------- Build Memories carousel (78, 5 per slide) ---------- */
const photos = [];
for(let i=1;i<=78;i++) photos.push(`assets/photo${i}.jpg`);
const sectionSize = 5;
const sections = [];
for(let i=0;i<photos.length;i+=sectionSize) sections.push(photos.slice(i,i+sectionSize));

let carouselSlideIndex = 0;
function renderCarousel(){
  carouselTrack.innerHTML = '';
  const slide = document.createElement('div');
  slide.className = 'carousel-slide';
  const items = sections[carouselSlideIndex];
  items.forEach((src,idx)=>{
    const im = document.createElement('img');
    im.src = src;
    im.alt = `memory ${carouselSlideIndex+1}-${idx+1}`;
    im.addEventListener('click', ()=> openGalleryAtIndex(carouselSlideIndex*sectionSize + idx, 'memories'));
    im.addEventListener('touchstart', (e)=> spawnHeart(e.touches[0].clientX, e.touches[0].clientY));
    slide.appendChild(im);
  });
  carouselTrack.appendChild(slide);
}
renderCarousel();
prevBtn.addEventListener('click', ()=>{ carouselSlideIndex = (carouselSlideIndex-1+sections.length)%sections.length; renderCarousel(); });
nextBtn.addEventListener('click', ()=>{ carouselSlideIndex = (carouselSlideIndex+1)%sections.length; renderCarousel(); });

/* ---------- Notes & Timeline content ---------- */
const notesData = [
  {title:'Why I love you ❤️', music:'assets/music/music2.mp3', text: `My beloved ${nicknames.join(', ')},\n\n` + `When I try to put into words why I love you... `.repeat(30)},
  {title:'A memory I keep 🌟', music:'assets/music/music3.mp3', text: `I remember the night when... `.repeat(30)},
  {title:'A promise to you 💞', music:'assets/music/music4.mp3', text: `I promise to hold your hand... `.repeat(30)}
];
const notesGrid = document.getElementById('notesGrid');
notesData.forEach((n, idx)=>{
  const card = document.createElement('div');
  card.className = 'note-card';
  card.innerHTML = `<div class="note-title">${n.title}</div><div class="note-preview">Tap to open the full letter — I wrote this for you.</div>`;
  card.addEventListener('click', ()=> {
    modalBody.innerHTML = `<h2>${n.title}</h2><div class="modal-body animated-bg">${n.text.replace(/\n/g,'<br><br>')}</div>`;
    playMusic(n.music);
    showModal();
  });
  notesGrid.appendChild(card);
});

const timelineData = [
  {date:'6 Sep 2023 — The Day We Met', music:'assets/music/music5.mp3', text: `From 6 Sep 2023... `.repeat(80)},
  {date:"19 Oct — My Jaan's Birthday", music:'assets/music/music6.mp3', text: `On 19 Oct... `.repeat(80)}
];
const timelineEl = document.getElementById('timeline');
timelineData.forEach((ev)=>{
  const e = document.createElement('div');
  e.className = 'event';
  e.innerHTML = `<div class="date">${ev.date}</div><div style="opacity:.9">Tap to read & hear a song</div>`;
  e.addEventListener('click', ()=> {
    modalBody.innerHTML = `<h2>${ev.date}</h2><div class="modal-body animated-bg">${ev.text.replace(/\n/g,'<br><br>')}</div>`;
    playMusic(ev.music);
    showModal();
  });
  timelineEl.appendChild(e);
});

/* ---------- Surprise button ---------- */
const openSurpriseBtn = document.getElementById('openSurprise');
openSurpriseBtn.addEventListener('click', ()=>{
  const text = `
    <h2>A Letter for My Universe 💖</h2>
    <div class="modal-body animated-bg">${generateSurpriseText().replace(/\n/g,'<br><br>')}</div>
  `;
  modalBody.innerHTML = text;
  playMusic('assets/music/music1.mp3');
  showModal();
});

/* ---------- Celebrate button ---------- */
celebrateBtn.addEventListener('click', ()=>{
  modalBody.innerHTML = `<h2>Happy Birthday My Jaan 🎂</h2><div class="modal-body animated-bg">${generateBirthdayLetter().replace(/\n/g,'<br><br>')}</div>`;
  // play birthday music
  playMusic('assets/music/happy_birthday.mp3');
  showModal();
  startConfetti();
});

/* ---------- Read notes scroll helper ---------- */
openNotes.addEventListener('click', ()=>{ document.getElementById('notesSection').scrollIntoView({behavior:'smooth'}); });

/* ---------- Gallery modal: support prev/next, swipe ---------- */
const galleryPrevBtn = document.getElementById('galleryPrev');
const galleryNextBtn = document.getElementById('galleryNext');

function openGalleryAtIndex(i, type){
  // build gallery array depending on type
  if(type === 'morning'){
    currentGallery = [];
    for(let j=1;j<=14;j++) currentGallery.push({img:`assets/morning${j}.jpg`, music:`assets/music/music${j}.mp3`});
  } else {
    currentGallery = [];
    for(let j=1;j<=78;j++) currentGallery.push({img:`assets/photo${j}.jpg`, music:`assets/music/music${(j%12)+1}.mp3`});
  }
  currentIndex = i;
  showGalleryItem();
  showModal();
}

function showGalleryItem(){
  const item = currentGallery[currentIndex];
  modalBody.innerHTML = `<div style="text-align:center"><img class="modal-img" src="${item.img}" alt="image"></div>`;
  playMusic(item.music);
  // make prev/next visible
  galleryPrevBtn.style.display = 'block';
  galleryNextBtn.style.display = 'block';
}

/* Prev/Next handlers */
galleryPrevBtn.addEventListener('click', ()=>{ currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length; showGalleryItem(); });
galleryNextBtn.addEventListener('click', ()=>{ currentIndex = (currentIndex + 1) % currentGallery.length; showGalleryItem(); });

/* keyboard navigation for gallery */
document.addEventListener('keydown', (e)=>{
  if(overlay.classList.contains('hidden')) return;
  if(['ArrowLeft','ArrowRight'].includes(e.key)){
    // if gallery visible (galleryPrevBtn displayed), navigate
    if(galleryPrevBtn.style.display === 'block'){
      if(e.key==='ArrowLeft') galleryPrevBtn.click();
      else galleryNextBtn.click();
    }
  }
});

/* Swipe / drag support on modalBody */
let touchStartX = 0, touchEndX = 0;
modalBody.addEventListener('touchstart', (e)=>{ if(e.touches && e.touches[0]) touchStartX = e.touches[0].clientX; });
modalBody.addEventListener('touchend', (e)=>{ touchEndX = e.changedTouches[0].clientX; handleSwipe(); });

/* pointer drag for desktop */
modalBody.addEventListener('pointerdown', (e)=>{ isDragging=true; dragStartX = e.clientX; });
modalBody.addEventListener('pointermove', (e)=>{ if(!isDragging) return; dragDeltaX = e.clientX - dragStartX; });
modalBody.addEventListener('pointerup', (e)=>{ if(!isDragging) return; isDragging=false; if(Math.abs(dragDeltaX) > 60){ if(dragDeltaX < 0) galleryNextBtn.click(); else galleryPrevBtn.click(); } dragDeltaX = 0; });

function handleSwipe(){
  const delta = touchEndX - touchStartX;
  if(Math.abs(delta) < 50) return;
  if(delta < 0) galleryNextBtn.click();
  else galleryPrevBtn.click();
}

/* When modal closes hide gallery nav */
overlay.addEventListener('transitionend', ()=>{ if(overlay.classList.contains('hidden')){ galleryPrevBtn.style.display='none'; galleryNextBtn.style.display='none'; } });

/* ---------- small heart spawn for touch interactions ---------- */
function spawnHeart(x,y){
  const h = document.createElement('div');
  h.className = 'heart';
  h.style.left = (x - 10) + 'px';
  h.style.top = (y - 10) + 'px';
  h.style.position = 'fixed';
  h.style.fontSize = '18px';
  h.style.zIndex = 10002;
  h.textContent = '❤';
  document.body.appendChild(h);
  h.animate([{transform:'translateY(0) scale(1)', opacity:1},{transform:'translateY(-120px) scale(.6)', opacity:0}], {duration:1400, easing:'linear'});
  setTimeout(()=>h.remove(),1500);
}

/* ---------- Confetti control wrappers ---------- */
function startConfetti(){ startConfettiInternal(); }
function stopConfetti(){ stopConfettiInternal(); }

/* Instead of duplicating confetti code above, use these wrappers to call the earlier functions */
let confettiRunning = false;
let confettiTimer = null;
function startConfettiInternal(){
  if(confettiRunning) return;
  confettiRunning = true;
  confettiPieces = [];
  for(let i=0;i<200;i++){
    confettiPieces.push({
      x: Math.random()*confettiCanvas.width,
      y: Math.random()*-confettiCanvas.height,
      vx: -3 + Math.random()*6,
      vy: 2 + Math.random()*6,
      w: 6 + Math.random()*10,
      h: 8 + Math.random()*12,
      color: `hsl(${Math.random()*360},70%,60%)`,
      angle: Math.random()*Math.PI*2
    });
  }
  (function frame(){
    ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
    confettiPieces.forEach(p=>{
      p.x += p.vx; p.y += p.vy; p.vy += 0.03;
      ctx.save();
      ctx.translate(p.x,p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      ctx.restore();
      if(p.y > confettiCanvas.height + 20){ p.y = -20; p.x = Math.random()*confettiCanvas.width; }
    });
    confettiRAF = requestAnimationFrame(frame);
  })();
  // auto-stop after some time (but keep if user wants)
  if(confettiTimer) clearTimeout(confettiTimer);
  confettiTimer = setTimeout(()=>{ stopConfettiInternal(); }, 14000);
}
function stopConfettiInternal(){
  if(confettiRAF) cancelAnimationFrame(confettiRAF);
  confettiRAF = null;
  ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
  confettiRunning = false;
  if(confettiTimer) clearTimeout(confettiTimer);
}

/* ---------- helper generators for long text (kept compact here but large in content) ---------- */
function generateSurpriseText(){
  // a long 700+ word letter assembled from repeated paragraphs (you can replace with your custom text)
  const p = [];
  p.push(`My Dearest ${nicknames.join(', ')},`);
  p.push(`From the first time our words met to this moment, you have been the steady north of my heart. Every picture here is a star, every song a memory. I wrote this surprise to wrap my love around your day and remind you I am always with you across miles...`.repeat(20));
  return p.join('\n\n');
}
function generateBirthdayLetter(){
  const p = [];
  p.push(`My sweetest ${nicknames.join(', ')},`);
  p.push(`Today is the day I celebrate you — your laugh, your eyes, your kindness, the way you make everything better just by existing. I hope these words reach you like a hug across the distance...`.repeat(40));
  return p.join('\n\n');
}

/* ---------- init: hide gallery navs ---------- */
document.getElementById('galleryPrev').style.display='none';
document.getElementById('galleryNext').style.display='none';

/* ---------- small helpers ---------- */
function playMusic(src){ if(!src) return; audioPlayer.src = src; audioPlayer.play().catch(()=>{}); }
function stopMusic(){ audioPlayer.pause(); audioPlayer.currentTime = 0; }

/* ---------- end of file ---------- */
