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
bgHeartsCanvas.width = width; confettiCanvas.width = width;
bgHeartsCanvas.height = height; confettiCanvas.height = height;

window.addEventListener('resize', () => {
  width = window.innerWidth; height = window.innerHeight;
  bgHeartsCanvas.width = width; bgHeartsCanvas.height = height;
  confettiCanvas.width = width; confettiCanvas.height = height;
});

/* ---------- Visuals ---------- */
let hearts = [];
let bursts = [];
let confetti = [];
let celebrationActive = false;
let burstTimer = null;

/* ---------- Helpers ---------- */
const rand = (a,b) => Math.random()*(b-a)+a;
const clamp = (v,min,max) => Math.max(min,Math.min(max,v));

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

for(let i=0;i<18;i++) spawnHeart();

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

function drawFrame(){
  heartsCtx.clearRect(0,0,width,height);
  for(let i=hearts.length-1;i>=0;i--){
    const p = hearts[i];
    p.x += p.vx; p.y += p.vy; p.vy -= 0.004;
    p.alpha = clamp(p.alpha - 0.0012, 0, 1);
    heartsCtx.globalAlpha = clamp(Math.max(0.08, p.alpha), 0, 1);
    heartsCtx.fillStyle = p.color;
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

  for(let i=bursts.length-1;i>=0;i--){
    const b = bursts[i];
    b.age++;
    const t = b.age / b.life;
    const r = b.r * (1 - t*0.8);
    heartsCtx.save();
    heartsCtx.globalAlpha = 1 - t;
    heartsCtx.fillStyle = `rgba(255,107,129,${0.25 + (1-t)*0.6})`;
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
  spawnBurst(rand(width*0.2, width*0.8), rand(height*0.2, height*0.6));
  for(let i=0;i<6;i++) spawnHeart(rand(40,width-40), height - rand(20,60), rand(6,18));
  burstTimer = setTimeout(scheduleBurst, 2200 + Math.random()*2800);
}

/* ---------- Modal & music ---------- */
function showModal(html, musicSrc){
  modalBody.innerHTML = html;
  overlay.classList.remove('hidden');
  overlay.setAttribute('aria-hidden','false');
  modalClose.style.display = 'block';
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  if(musicSrc){
    audioPlayer.src = musicSrc;
    audioPlayer.play().catch(()=>{});
  }
}
function closeModal(){
  overlay.classList.add('hidden');
  overlay.setAttribute('aria-hidden','true');
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
}
modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', (e)=>{ if(e.target === overlay) closeModal(); });
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

/* ---------- Full birthday letter ---------- */
function buildBirthdayHTML(){
  return `
  <h2>Happy Birthday, My Love — Duda 💖</h2>
  <div class="modal-body" style="max-height:70vh;overflow-y:auto;padding:10px;">
    <p>My Dearest Duda,</p>
    <p>Today is your day — a day to celebrate you, your life, your heart, your soul, and the incredible person that you are. I hope you feel every bit of love, warmth, and affection I am sending your way as I write this.</p>
    <p>Every moment with you is a treasure I hold close to my heart. From the day we met to now, every smile, every laugh, every shared dream has made my life infinitely better. Your presence is the light that brightens my days, the melody that soothes my soul, and the warmth that fills my heart.</p>
    <p>On this special day, I want you to know how profoundly you are loved, how deeply you are cherished, and how important you are to me. You are my heart, my soul, my everything, and I am endlessly grateful for every second we share together.</p>
    <p>May your birthday be filled with joy, laughter, and love, just as you have filled my life with endless happiness. I wish for all your dreams to come true, for every step you take to be blessed, and for your life to overflow with the beauty and wonder you bring to mine.</p>
    <p>Happy Birthday, my love. I love you more than words could ever express, more than the stars love the night sky, and more than life itself. Always and forever, you are my one and only.</p>
    <p>With all my heart, my soul, and all my love,<br><strong>Ozair ❤️</strong></p>
  </div>
  `;
}

/* ---------- Button actions ---------- */
celebrateBtn.addEventListener('click', ()=>{
  startCelebrationVisuals();
  showModal(buildBirthdayHTML(), 'assets/music/happy_birthday.mp3');
});
