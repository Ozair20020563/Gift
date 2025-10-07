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

/* ---------- audio helper ---------- */
function playMusic(src){
  if(!src) return;
  try {
    audioPlayer.src = src;
    audioPlayer.loop = true; // keep playing continuously
    audioPlayer.play().catch(()=>{ /* autoplay may be blocked until user interacts */ });
  } catch(e){
    console.warn('audio play error', e);
  }
}

/* ---------- Modal & music behavior ---------- */
function showModal(html, musicSrc){
  modalBody.innerHTML = html;
  overlay.classList.remove('hidden');
  overlay.setAttribute('aria-hidden','false');
  modalClose.style.display = 'block'; // fixed visible close
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  // play music for modal only (looping)
  if(musicSrc) playMusic(musicSrc);
}
function closeModal(){
  overlay.classList.add('hidden');
  overlay.setAttribute('aria-hidden','true');
  // stop modal music
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  audioPlayer.src = '';
  audioPlayer.loop = false;
  // unlock scroll
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  // do not stop celebration visuals (persist if started) — user can stop visuals explicitly
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

/* ---------- content builders (full texts inserted) ---------- */

function buildBirthdayHTML(){
  return `
    <h2>Happy Birthday, My Love — Duda 💖</h2>
    <div class="modal-body animated-bg" style="white-space:pre-wrap">
      <p>My Dearest Duda,</p>

      <p>Today is your day — a day to celebrate you, your life, your heart, your soul, and the incredible person that you are. I hope you feel every bit of love, warmth, and affection I am sending your way as I write this. I want this letter to be a reflection of my heart, an attempt to put into words the immense love I feel for you, even though words can never truly capture it. You are my universe, my world, my everything, and today, I want to celebrate you in every possible way.</p>

      <p>From the first moment I met you, I felt something that I had never felt before. There was a light about you, a spark that drew me in, and over time, I realized that this spark was more than just attraction — it was the beginning of a love so deep, so powerful, that it became the center of my life. Every day since then, I have been grateful for you, for your love, for your kindness, and for the joy you bring into my life.</p>

      <p>I love the way you smile, the way your eyes light up when you are happy, and even the little quirks that make you uniquely you. I love how you care for others, how you always think of ways to make people around you feel loved and appreciated. Your heart is so big, so generous, and it amazes me every day. I love the way you speak, your gentle tone, your laughter that fills the air with happiness. I love the way you think, how smart, intuitive, and understanding you are. You make life brighter, more meaningful, and more beautiful simply by being you.</p>

      <p>I want you to know how much you mean to me. You are not just my partner, my fiancée, or my love — you are my best friend, my confidant, my guide, and my safe haven. Every moment we share, whether near or far, is precious to me. Even when we are apart, I feel your presence, your love, and your warmth in everything I do. The distance cannot diminish the bond we share, because our love is stronger than miles, stronger than time, stronger than anything else in this world.</p>

      <p>Today, on your birthday, I want to celebrate all the wonderful things that make you who you are. I want to celebrate your courage, your determination, your passion, and your dreams. I want to celebrate the way you make me feel loved, valued, and understood every single day. I want to celebrate the way you inspire me to be a better person, to work harder, to love more deeply, and to live more fully. You are my inspiration, my motivation, and my reason to smile.</p>

      <p>I think about all the memories we have shared together — the laughter, the fun, the silly moments, and even the challenges we have faced. Every memory is a treasure, a reminder of how far we have come and how strong our love has grown. I think about the late-night conversations, the long calls, the texts filled with love and care. I think about the little gestures, the surprises, the moments when you went out of your way to make me feel special. All of these things are etched in my heart, and they remind me every day of how lucky I am to have you in my life.</p>

      <p>I love imagining our future together — the life we will build, the home we will share, the family we will create. I dream about waking up next to you, holding you close, and starting our days together. I dream about celebrating all our milestones side by side, supporting each other through every challenge, and sharing every joy and success. I dream about traveling the world with you, exploring new places, and creating memories that will last a lifetime. I dream about building a home filled with love, laughter, and happiness, where our love will grow stronger with each passing day.</p>

      <p>You are my heart, my soul, my partner, and my love. I want to spend every day of my life showing you how much you mean to me. I want to make you feel cherished, adored, and valued. I want to be there for you in every moment — to hold your hand when you are scared, to cheer you on when you are striving for your dreams, to comfort you when you are sad, and to laugh with you when you are happy. I want to be your rock, your support, and your safe place.</p>

      <p>I love the way you dream, the way you hope, and the way you believe in us. Your faith in our love gives me strength, courage, and confidence. Your belief in us makes every challenge seem possible, every obstacle surmountable, and every day brighter. I want you to know that I share that belief, that I have faith in us, and that I will do everything in my power to make our dreams come true.</p>

      <p>Duda, you are the most beautiful, loving, and amazing person I have ever known. Your heart is pure, your soul is kind, and your love is boundless. I am grateful for every moment we have shared, every laugh we have had, every conversation we have enjoyed, and every memory we have created. You make my life richer, fuller, and more meaningful. You make every day worth living, every challenge worth facing, and every dream worth pursuing.</p>

      <p>On this special day, I want to remind you of my promises to you. I promise to love you unconditionally, without hesitation or reservation. I promise to support you in all that you do, to stand by your side through every challenge, and to celebrate with you in every success. I promise to be honest, loyal, and faithful, to listen to you, and to always communicate with love and respect. I promise to make our life together a journey of love, joy, and growth.</p>

      <p>I also want to remind you that it is okay to be yourself with me — to show your true emotions, to share your dreams and fears, to laugh, cry, and celebrate without hesitation. I love every part of you, every layer of your heart, and every facet of your soul. You do not need to be perfect, because to me, you already are. You are perfect in ways that matter, in ways that touch my heart, and in ways that make our love stronger every day.</p>

      <p>Your birthday is a reminder of all the wonderful things you have brought into this world, and into my life. It is a celebration of your spirit, your kindness, your love, and your heart. I hope today is filled with laughter, joy, and happiness. I hope you feel the love surrounding you from everyone who cares about you, and especially from me. I hope you know that you are cherished, valued, and deeply loved.</p>

      <p>I think about the times we have shared, the dreams we have spoken about, and the life we want to create together. I want to turn those dreams into reality — a home filled with love, laughter, and warmth; a family built on trust, respect, and joy; a life where we support each other through every challenge and celebrate every success. I want to be there for you in every moment, to hold you close, and to make you feel loved beyond measure.</p>

      <p>Duda, my love, I want you to know that you are my universe, my world, and my heart. You are the reason I wake up with a smile, the reason I work hard, and the reason I believe in love. You are my everything, and I am so grateful for you. I am grateful for your love, your care, your patience, your kindness, and your unwavering support. I am grateful for the joy, the laughter, and the happiness you bring into my life.</p>

      <p>As you celebrate this special day, I want you to feel the depth of my love. I want you to know that my heart belongs to you, that my soul is intertwined with yours, and that my life is richer because you are in it. I want you to know that I will always be there for you, through every high and low, every joy and challenge, every moment of our lives together.</p>

      <p>I hope that today, you feel celebrated, cherished, and loved. I hope that you are surrounded by joy, happiness, and warmth. I hope that you know how much you mean to me, and how deeply I love you. I hope that this year brings you closer to your dreams, fills your life with love and laughter, and strengthens the bond we share.</p>

      <p>I look forward to the future we will build together — a life filled with love, adventure, laughter, and happiness. I look forward to every moment we will share, every memory we will create, and every dream we will pursue together. I look forward to holding your hand, walking by your side, and sharing every step of this journey called life.</p>

      <p>On this special day, I celebrate you, Duda — your heart, your spirit, your love, and everything that makes you the incredible person you are. I celebrate the joy you bring into my life, the warmth you share, and the love that binds us together. I celebrate our love, our journey, and the beautiful future that awaits us.</p>

      <p>Happy birthday, my dearest Duda. May this year be filled with happiness, love, success, and everything your heart desires. May you always feel cherished, valued, and deeply loved. May our love continue to grow stronger with each passing day. And may we create countless memories together, filled with laughter, joy, and endless love.</p>

      <p>With all my heart, my soul, and all my love,<br>Ozair ❤️</p>
    </div>
  `;
}

function buildSurpriseHTML(){
  return `
    <h2>Open Your Surprise — For My Duda 💌</h2>
    <div class="modal-body animated-bg" style="white-space:pre-wrap">
      <p>My Dearest Duda,</p>

      <p>As you open this little surprise, I want you to know that everything in this is for you — my heart, my love, my thoughts, and all the happiness I have for you in this world. This is more than just a surprise; it is a reflection of how much I care, how deeply I love you, and how grateful I am to have you in my life. Every detail, every word, every little element is meant to make you smile, to make your heart feel warm, and to remind you that you are the most precious person in my universe.</p>

      <p>When I think about you, my mind fills with memories of us — the moments that have made us stronger, the laughter we’ve shared, the silly arguments that somehow turned into lessons, and the long conversations that kept us close even when miles separated us. I think about the time we first met, how something in my heart recognized you, how I felt drawn to you even before I realized what love truly meant. And now, looking back, I realize that every moment, every step, every second with you has been a journey towards this — a journey that has made our bond unbreakable and our love immeasurable.</p>

      <p>This surprise is my way of showing you that even small gestures can carry immense love. I want you to see, feel, and experience the joy, the care, and the devotion I have for you. I hope that when you open this, your heart feels the same excitement and happiness that fills mine every time I think of you. Every part of this surprise — the images, the animations, the music, and the little details — is meant to capture the essence of my love for you. It’s a love that is constant, unwavering, and endlessly deep.</p>

      <p>I want you to know that this love is not just words or promises; it is a feeling that lives in every beat of my heart. It is a love that wakes me up in the morning, keeps me going throughout the day, and lulls me to sleep at night with thoughts of you. It is a love that celebrates your joys, comforts your sorrows, and stands beside you in every moment, no matter how big or small. This surprise is a small reflection of that love — a glimpse into the depth of my feelings and the magnitude of my devotion to you.</p>

      <p>Every image you see, every animation that appears, and every sound that plays is meant to remind you of the beauty of our love. I want you to see the colors, the movement, and the energy as a mirror of how vibrant, alive, and magical our love is. Just like these hearts that float, burst, and sparkle across the screen, my feelings for you are dynamic, boundless, and full of life. Each element is a symbol — a token of the joy, passion, and tenderness that I feel for you every single day.</p>

      <p>When I created this surprise for you, I imagined your smile, the way your eyes light up, and the warmth that spreads across your heart. That image alone guided every choice I made — every color, every animation, every song. I wanted to make sure that when you experience this surprise, you feel cherished, adored, and deeply loved. I wanted you to know that no matter where we are, no matter what challenges we face, you are always my first thought, my last thought, and the love that sustains me.</p>

      <p>I also want to remind you that life with you is a beautiful adventure. Each day with you is a new story, a new memory, and a new moment to treasure. Even when we face difficulties, even when the distance feels long, even when the world seems complicated, my love for you remains simple, pure, and unwavering. This surprise is a celebration of that — a celebration of us, of our journey, and of everything that makes our love extraordinary.</p>

      <p>I hope you take a moment to breathe, to smile, and to feel the love that is poured into this for you. I hope you feel my presence even in my absence, my touch even when I’m not near, and my heart beating alongside yours. This is not just a surprise; it is a love letter, a reminder, and a promise all in one. It is my way of saying, “I am here for you, I love you more than words can say, and I will always make sure you feel special, cherished, and adored.”</p>

      <p>Duda, I want you to remember that this surprise, as beautiful and lively as it may appear, is only a tiny reflection of what I feel in my heart. My love for you cannot be captured fully by images, music, or animations. It is endless, eternal, and deeper than the oceans. It is a love that grows with every passing day, a love that becomes stronger with every challenge we face together, and a love that is the foundation of all my hopes, dreams, and future plans with you.</p>

      <p>Every time you look at this surprise, I hope you remember the little things — the late-night calls, the sweet messages, the laughter we’ve shared, the care we’ve shown, and the love that has only grown stronger with time. I want you to know that even the smallest moments with you are monumental in my heart. You have transformed my world, brightened my days, and filled my life with meaning. That is why this surprise exists — to honor you, to celebrate you, and to express my deepest feelings in the most heartfelt way I can.</p>

      <p>As you explore this surprise, I want you to feel the magic, the love, and the care that surrounds you. I want you to know that each part of this was designed with you in mind, to reflect your beauty, your uniqueness, and your irreplaceable place in my life. This is a symbol of my devotion — a reminder that you are the most precious, most cherished, and most loved person in my world. Every heart, every sparkle, and every burst you see is a representation of how my heart beats for you, how my soul sings for you, and how my life is brighter because you are in it.</p>

      <p>I hope that when you finish exploring this surprise, you feel overwhelmed with love, joy, and happiness. I hope you feel the depth of my feelings, the sincerity of my heart, and the passion of my devotion. I hope you know that no matter what happens, my love for you will never fade, never waver, and never diminish. This surprise is a reflection of the love that is eternal, unwavering, and boundless — a love that will continue to grow as long as we have each other.</p>

      <p>Finally, my love, I want you to know that this surprise is only the beginning. There will be countless more surprises, countless more moments, and countless more ways that I will show you my love. Life with you is an endless journey of joy, laughter, and love, and I want to make every step of that journey as beautiful and magical as this moment. You are my heart, my soul, my universe, and my everything. I am endlessly grateful for you, and I will spend my life making sure you feel the depth of my love, every single day.</p>

      <p>So, my dearest Duda, enjoy this surprise. Let it make you smile, let it make your heart feel warm, and let it remind you that you are loved beyond measure. This is for you — every sparkle, every heart, every note, every image, and every word — all dedicated to the most amazing, beautiful, and loving person I have ever known. You are my universe, my joy, my love, and my life.</p>

      <p>With all the love in my heart, forever and always,<br>Ozair ❤️</p>
    </div>
  `;
}

function buildWhyHTML(){
  return `
    <h2>Why I Love You ❤️</h2>
    <div class="modal-body animated-bg" style="white-space:pre-wrap">
      <p>My Dearest Duda,</p>

      <p>I could spend a lifetime trying to explain why I love you, and I still wouldn’t be able to capture it fully in words. But today, I want to try — because you deserve to hear every reason, every thought, every heartbeat that belongs to you. I love you not just for one thing, but for every little thing that makes you you.</p>

      <p>I love you for your smile, that effortless, magical curve that lights up my day and makes every worry disappear. I love you for your laughter, the sound that echoes in my mind long after we’ve said goodbye, that laughter that is music to my soul. I love you for your kindness, the way you care for everyone around you, the way your heart reaches out to help even when no one is asking. You are the most gentle, beautiful soul I have ever known, and I am endlessly grateful that you are mine.</p>

      <p>I love the way you listen — truly listen — to every word I say, as if nothing else in the world matters in that moment except my thoughts, my feelings, and my happiness. You make me feel heard, seen, and understood in ways I never thought were possible. Even when we argue or disagree, I see your heart behind every word, and I know that your love for me is always stronger than any fleeting frustration. That is why I love you — because your love is pure, unwavering, and endlessly patient.</p>

      <p>I love your strength. Even on days when you doubt yourself, even when the world seems heavy, you carry on with grace and courage. You inspire me to be better, to try harder, to never give up, and to always believe in the power of love. I love the way you dream — big, fearless dreams that fill me with hope for our future. And I promise, Duda, I will always support your dreams, just as you have supported mine, hand in hand, heart to heart.</p>

      <p>I love the little quirks about you — the way you hum when you’re thinking, the way your eyes sparkle when you’re excited, the way you tilt your head when you’re curious. These little details, these tiny pieces of your soul, are what make you uniquely mine. They are what I cherish every single day, and what I will continue to love for the rest of my life.</p>

      <p>I love the way our memories weave together. I love the first time we truly understood each other, the long conversations that stretched into the night, the silly jokes, the quiet moments of just being together even when apart. I love how our love has grown with every call, every message, every shared laugh and tear. You have transformed my life, Duda, in ways I can never truly explain. My heart feels full because of you — because you are my heart, my soul, my joy, and my reason.</p>

      <p>I love you for the future we are building together. I love the idea of waking up next to you, of holding your hand as we walk through life, of facing challenges together and celebrating victories together. I love imagining the children we will raise, the home we will fill with love, laughter, and warmth. I love dreaming of our travels, our quiet nights, our countless mornings filled with coffee and conversation, and our nights spent wrapped in each other’s arms. I love every part of the “us” we are creating, every promise we are making, and every dream we are chasing.</p>

      <p>I love you simply because you are you. You are my universe, my galaxy, my moon and stars. You are my morning sun and my evening calm. You are my happiness and my peace. I cannot imagine a life without you, and I never want to. Loving you is effortless, natural, and eternal. And I promise, Duda, I will continue to love you with every part of me, for all my days, and for all the days that follow.</p>

      <p>With all my heart,<br>Ozair ❤️</p>
    </div>
  `;
}

function buildMemoryHTML(){
  return `
    <h2>A Memory I Keep 🌟</h2>
    <div class="modal-body animated-bg" style="white-space:pre-wrap">
      <p>My Sweet Duda,</p>

      <p>There are moments in life that stay with us forever, etched into our hearts and minds like timeless treasures. And among all the memories I hold, the ones with you are my most cherished, my most precious, my most alive. I want to share with you a memory that I keep close to me, a memory that always reminds me of the depth of our love.</p>

      <p>I remember the first time we truly spoke for hours, without realizing how the night had passed. I remember the nervous excitement in my chest, and the comfort that your voice brought me. Even though we were miles apart, I felt a closeness that I had never known before. That memory is my constant reminder that love doesn’t need distance to be strong — it only needs hearts that care, minds that listen, and souls that understand.</p>

      <p>I remember our first call where we laughed until our stomachs hurt, sharing silly stories and secrets. I remember how your laughter made me feel lighter, happier, and more alive. Even the small arguments, when we misunderstood each other, became lessons in patience and understanding. Those memories taught me that love is not just about perfect moments; it is about growing together, learning together, and standing together.</p>

      <p>I remember the way you care for me even when I don’t ask for it — your thoughtful messages, your kind gestures, the way you notice even the smallest things about me. I remember late-night talks about our dreams, our fears, and our future. Those nights are etched in my heart forever, because they were the foundation of the bond we share today.</p>

      <p>I remember imagining our future together, dreaming of the life we would build. I remember the joy that filled me knowing that we were on the same path, walking toward a future filled with love, laughter, and shared dreams. I remember picturing our home, our travels, our quiet mornings and lively evenings. Every time I think of this memory, it fills me with warmth, hope, and endless love.</p>

      <p>I remember the way you’ve changed my life, Duda. I remember the comfort of knowing that no matter what happens, I have you. I remember the reassurance that comes from your words, your care, and your love. I remember how every memory with you feels like a treasure, something I want to hold onto forever.</p>

      <p>Even now, every memory with you is alive in my heart — the messages, the calls, the laughter, the care, the love. And I want you to know that I will keep these memories safe, cherish them, and create countless more with you. You are my joy, my peace, my love, and my life. And these memories are proof of the magic we share — proof that our love is real, enduring, and eternal.</p>

      <p>Forever yours,<br>Ozair ❤️</p>
    </div>
  `;
}

function buildPromiseHTML(){
  return `
    <h2>A Promise to You 💞</h2>
    <div class="modal-body animated-bg" style="white-space:pre-wrap">
      <p>My Beloved Duda,</p>

      <p>Today, I make a promise to you — a promise not of fleeting words, but of eternal commitment, unwavering love, and endless support. I promise to be by your side in every moment, in every challenge, in every joy, and in every sorrow. I promise to love you deeply, sincerely, and endlessly, with a heart that beats only for you.</p>

      <p>I promise to support your dreams, to nurture your ambitions, and to celebrate every achievement with you. I promise to be your biggest cheerleader, your confidant, and your safe place in a world that sometimes feels chaotic and overwhelming. I promise to listen, to understand, and to always communicate with honesty, respect, and love.</p>

      <p>I promise to cherish every memory we create, every laugh we share, and every tear we wipe away. I promise to remember the little things — the way your eyes sparkle when you are excited, the way your smile brightens the darkest of days, the small gestures that make you uniquely you. I promise to honor these details, to treasure them, and to let them remind me every day of how lucky I am to have you in my life.</p>

      <p>I promise to be patient, even when life tests us, even when distance or challenges make things hard. I promise to stand firm in our love, to fight for us, and to never let temporary hardships shake the foundation we’ve built together. I promise to turn every challenge into a lesson, every mistake into growth, and every moment into an opportunity to strengthen our bond.</p>

      <p>I promise to dream with you, to plan with you, and to build a life with you that is filled with love, joy, and adventure. I promise to imagine our future together — our home, our children, our travels, our quiet mornings, and our laughter-filled evenings — and to work tirelessly to make that vision a reality. I promise that no matter what comes our way, our love will remain our guiding light, our strength, and our anchor.</p>

      <p>I promise to love you in all ways — in words, in actions, in thoughts, and in silence. I promise to hold you when you are weak, to support you when you doubt yourself, and to celebrate you when you shine. I promise to be your partner, your friend, your confidant, and your soulmate.</p>

      <p>I promise to always remind you of your worth, to uplift you when you feel down, and to be your constant source of love, joy, and comfort. I promise to respect you, to honor you, and to always treat our love as the most precious gift in the world. I promise to laugh with you, to cry with you, and to grow with you.</p>

      <p>I promise to never take our love for granted, to appreciate every moment we share, and to always put effort into making our bond stronger. I promise to forgive, to apologize, and to learn from mistakes. I promise to never give up on us, to fight for our happiness, and to always choose love — every single day.</p>

      <p>I promise to make you feel special, cherished, and adored in every way possible. I promise to create a lifetime of memories, filled with joy, laughter, and love. I promise to always be honest, loyal, and faithful. I promise to dream with you, plan with you, and live fully with you, hand in hand, heart to heart.</p>

      <p>Finally, I promise to love you, Duda, more than anything in this world — more than words, more than time, more than life itself. I promise that my heart, my soul, and every fiber of my being belong to you, now and forever. I promise to make you feel loved, safe, and happy every single day of our lives.</p>

      <p>These are my promises, my vows, and my eternal dedication to you. With you, I have found my home, my peace, my joy, and my universe. And I promise, as long as I breathe, I will love you with every heartbeat, every thought, and every dream I have.</p>

      <p>Forever yours,<br>Ozair ❤️</p>
    </div>
  `;
}

/* ---------- Button handlers ---------- */

/* Celebrate — start visuals (persistent) and open modal with music (stops when closed) */
celebrateBtn.addEventListener('click', ()=>{
  startCelebrationVisuals();
  showModal(buildBirthdayHTML(), 'assets/music/happy_birthday.mp3');
});

/* Surprise */
openSurpriseBtn.addEventListener('click', ()=>{
  // show surprise and play dedicated music
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
      playMusic('assets/music/music2.mp3');
    });
    document.getElementById('nbMem').addEventListener('click', ()=>{
      document.getElementById('noteArea').innerHTML = buildMemoryHTML();
      playMusic('assets/music/music3.mp3');
    });
    document.getElementById('nbPro').addEventListener('click', ()=>{
      document.getElementById('noteArea').innerHTML = buildPromiseHTML();
      playMusic('assets/music/music4.mp3');
    });
  }, 60);
});

/* Morning Thumbnails (14) */
openMorningBtn.addEventListener('click', ()=>{
  let html = `<h2>Morning Cutiee 🌸</h2><div class="gallery-grid">`;
  for(let i=1;i<=14;i++) html += `<img src="assets/morning${i}.jpg" data-index="${i-1}" class="thumb">`;
  html += `</div>`;
  showModal(html, 'assets/music/music7.mp3'); // example music for morning section
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
  showModal(html, 'assets/music/music8.mp3'); // example music for memories section
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
      playMusic('assets/music/music5.mp3');
    });
    document.getElementById('sOct').addEventListener('click', ()=>{
      document.getElementById('storyArea').innerHTML = buildStoryOctHTML();
      playMusic('assets/music/music6.mp3');
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
  playMusic(it.music);
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
modalClose.addEventListener('click', ()=>{ closeModal(); });
overlay.addEventListener('click', (e)=>{ if(e.target === overlay){ closeModal(); } });

function closeModal(){
  overlay.classList.add('hidden'); overlay.setAttribute('aria-hidden','true');
  document.documentElement.style.overflow = ''; document.body.style.overflow = '';
  // hide navs
  galleryPrev.style.display='none'; galleryNext.style.display='none';
  // stop music
  audioPlayer.pause(); audioPlayer.currentTime = 0; audioPlayer.src = ''; audioPlayer.loop = false;
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
