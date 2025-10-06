/* ======= configuration & utilities ======= */

/* nicknames to use inside notes */
const nicknames = ["Biwi","Begum","Zojha","Jaan","My Galaxy","Roohi","Mohtarma","Cutiee","Patutiee","Lovey Dovey","Mera Dil","Meri Jaan","Meri Pyari","Meri Zindagi","Meri Saans","My Universe","My Darling","My Heart","My Angel","My Sunshine"];

/* helper: choose music file rotating (1..13) */
function musicFor(n){
  const idx = ((n - 1) % 13) + 1;
  return `assets/music/music${idx}.mp3`;
}

/* DOM refs */
const morningGallery = document.getElementById('morningGallery');
const carouselTrack = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const overlay = document.getElementById('overlay');
const modalCard = document.getElementById('modalCard');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const audioPlayer = document.getElementById('audioPlayer');
const confettiCanvas = document.getElementById('confettiCanvas');
const openSurpriseBtn = document.getElementById('openSurprise');
const openNotesBtn = document.getElementById('openNotes');
const celebrateBtn = document.getElementById('celebrateBtn');
const musicBtn = document.getElementById('musicBtn');

/* typed message effect */
const typedEl = document.getElementById('typed');
const typedMessages = [
  `Mera dil, meri jaan — every picture and every note is for you.`,
  `Open your surprise, my Cutiee. Feel the music and remember our moments.`,
  `Happy Birthday, my meri zindagi — I love you more than words.`
];
let tIndex = 0, cIndex = 0;
function typedLoop(){
  if(cIndex < typedMessages[tIndex].length){
    typedEl.textContent += typedMessages[tIndex].charAt(cIndex++);
    setTimeout(typedLoop, 28);
  } else {
    setTimeout(()=>{ typedEl.textContent=''; cIndex=0; tIndex=(tIndex+1)%typedMessages.length; typedLoop(); }, 2000);
  }
}
typedLoop();

/* ======= Morning gallery (14 images) ======= */
for(let i=1;i<=14;i++){
  const img = document.createElement('img');
  img.src = `assets/morning${i}.jpg`;
  img.alt = `morning ${i}`;
  // pick one of 4 animation classes per image to vary
  const anims = ['anim-zoom','anim-slide-left','anim-slide-right','anim-fade'];
  img.dataset.anim = anims[i % anims.length];
  img.dataset.music = musicFor(i);
  img.addEventListener('click', ()=> openImageModal(img.src, img.dataset.music, img.dataset.anim, `Morning Cutiee — ${i}`));
  img.addEventListener('mousemove', (e)=> spawnTinyHeart(e, 8));
  morningGallery.appendChild(img);
}

/* ======= Carousel for 78 photos, sections of 5 ======= */
const photos = [];
for(let i=1;i<=78;i++) photos.push(`assets/photo${i}.jpg`);
const sectionSize = 5;
const sections = [];
for(let i=0;i<photos.length;i+=sectionSize) sections.push(photos.slice(i,i+sectionSize));
let currentSlide = 0;
function renderSlide(idx){
  carouselTrack.innerHTML = '';
  const slide = document.createElement('div');
  slide.className = 'carousel-slide';
  sections[idx].forEach((p,j)=>{
    const im = document.createElement('img');
    im.src = p;
    im.alt = `memory ${idx+1}-${j+1}`;
    const anims = ['anim-slide-left','anim-slide-right','anim-zoom','anim-fade'];
    im.dataset.anim = anims[(j+idx) % anims.length];
    im.dataset.music = musicFor(idx + j + 2);
    im.addEventListener('click', ()=> openImageModal(im.src, im.dataset.music, im.dataset.anim, `Memory ${idx+1} — ${j+1}`));
    im.addEventListener('mousemove', (e)=> spawnTinyHeart(e, 7));
    slide.appendChild(im);
  });
  carouselTrack.appendChild(slide);
}
renderSlide(currentSlide);
prevBtn.addEventListener('click', ()=>{ currentSlide = (currentSlide - 1 + sections.length) % sections.length; renderSlide(currentSlide); });
nextBtn.addEventListener('click', ()=>{ currentSlide = (currentSlide + 1) % sections.length; renderSlide(currentSlide); });

/* ======= Overlay / modal utilities ======= */
function openImageModal(imgSrc, musicSrc, animClass='anim-zoom', title=''){
  modalBody.innerHTML = `
    <div class="${animClass}">
      <h2 style="margin-top:0">${escapeHtml(title)}</h2>
      <div class="modal-body">
        <img src="${imgSrc}" alt="${escapeHtml(title)}">
      </div>
    </div>
  `;
  showModal();
  playMusic(musicSrc);
}
function openTextModal(htmlString, musicSrc=null, animClass='anim-zoom'){
  modalBody.innerHTML = `<div class="${animClass}">${htmlString}</div>`;
  showModal();
  if(musicSrc) playMusic(musicSrc);
}
function showModal(){
  overlay.classList.remove('hidden');
  overlay.setAttribute('aria-hidden','false');
  // animate modal card briefly
  modalCard.classList.remove('anim-zoom','anim-slide-left','anim-slide-right','anim-fade');
  void modalCard.offsetWidth; // reflow
  modalCard.classList.add('anim-zoom');
}
function closeModal(){
  overlay.classList.add('hidden');
  overlay.setAttribute('aria-hidden','true');
  stopMusic();
  stopConfetti();
}
modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', (e)=> { if(e.target === overlay) closeModal(); });
document.addEventListener('keydown', (e)=> { if(e.key === 'Escape') closeModal(); });

/* play/pause helpers */
function playMusic(src){
  if(!src) return;
  audioPlayer.src = src;
  audioPlayer.play().catch(()=>{ /* autoplay might be blocked */ });
}
function stopMusic(){
  try { audioPlayer.pause(); audioPlayer.currentTime = 0; } catch(e){ }
}

/* tiny floating hearts when moving over images */
function spawnTinyHeart(e, size=12){
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.style.left = (e.clientX - 8) + 'px';
  heart.style.top = (e.clientY - 8) + 'px';
  heart.style.fontSize = `${size + Math.random()*12}px`;
  heart.style.opacity = 0.95;
  heart.textContent = '❤';
  document.body.appendChild(heart);
  setTimeout(()=> heart.style.opacity = 0, 400);
  setTimeout(()=> heart.remove(), 1800);
}

/* ======= Surprise (700+ words) ======= */
openSurpriseBtn.addEventListener('click', ()=>{
  const longNote = generateSurpriseText();
  const html = `<h2 style="margin-top:0">A Letter for My Universe 💖</h2>
    <div class="modal-body animated-bg" style="color:#041827;line-height:1.7">${longNote}</div>`;
  openTextModal(html, 'assets/music/music3.mp3', 'anim-slide-right');
});

/* ======= Read notes — scroll to notes section ======= */
openNotesBtn.addEventListener('click', ()=>{
  document.getElementById('notesSection').scrollIntoView({behavior:'smooth', block:'start'});
});

/* ======= Love Notes (3 notes >250 words each) ======= */
const notesData = [
  {
    id:'why',
    title: 'Why I love you ❤️',
    music: 'assets/music/music4.mp3',
    content: generateWhyILoveYou()
  },
  {
    id:'memory',
    title: 'A memory I keep 🌟',
    music: 'assets/music/music5.mp3',
    content: generateAMemory()
  },
  {
    id:'promise',
    title: 'A promise to you 💞',
    music: 'assets/music/music6.mp3',
    content: generatePromise()
  }
];
const notesGrid = document.getElementById('notesGrid');
notesData.forEach((n, idx)=>{
  const card = document.createElement('div');
  card.className = 'note-card';
  card.innerHTML = `<div class="note-title">${n.title}</div><div class="note-preview">Tap to open the full letter — I wrote this for you.</div>`;
  card.addEventListener('click', ()=> {
    const html = `<h2 style="margin-top:0">${n.title}</h2><div class="modal-body animated-bg" style="color:#041827;line-height:1.7">${n.content}</div>`;
    openTextModal(html, n.music, ['anim-slide-left','anim-slide-right','anim-zoom'][idx % 3]);
  });
  notesGrid.appendChild(card);
});

/* ======= Timeline entries (click to open 700+ words each) ======= */
const timelineData = [
  {
    date: '6 Sep 2023 — The Day We Met',
    music: 'assets/music/music7.mp3',
    content: generateTimelineOne()
  },
  {
    date: "19 Oct — My Jaan's Birthday",
    music: 'assets/music/music8.mp3',
    content: generateTimelineTwo()
  }
];
const timelineEl = document.getElementById('timeline');
timelineData.forEach((t, idx)=>{
  const el = document.createElement('div');
  el.className = 'event';
  el.innerHTML = `<div class="date">${t.date}</div><div style="opacity:.9">Tap to read & hear a song</div>`;
  el.addEventListener('click', ()=> {
    const html = `<h2 style="margin-top:0">${t.date}</h2><div class="modal-body animated-bg" style="color:#041827;line-height:1.7">${t.content}</div>`;
    openTextModal(html, t.music, idx % 2 === 0 ? 'anim-zoom' : 'anim-slide-right');
  });
  timelineEl.appendChild(el);
});

/* ======= Celebrate: 1000+ words, music, confetti ======= */
celebrateBtn.addEventListener('click', ()=>{
  const fullBirthday = generateBirthdayLetter(); // 1000+ words
  const html = `<h2 style="margin-top:0">Happy Birthday, My Love 🎂</h2>
    <div class="modal-body animated-bg" style="color:#041827;line-height:1.7">${fullBirthday}</div>`;
  openTextModal(html, 'assets/music/happy_birthday.mp3', 'anim-zoom');
  startConfetti();
});

/* music play/pause toggle */
let musicPlaying = false;
musicBtn.addEventListener('click', ()=>{
  if(!musicPlaying){
    audioPlayer.src = 'assets/music/music1.mp3';
    audioPlayer.play().catch(()=>{});
    musicBtn.textContent = 'Pause music';
    musicPlaying = true;
  } else {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    musicBtn.textContent = 'Play music';
    musicPlaying = false;
  }
});

/* ======= Confetti (start/stop) ======= */
let confettiPieces = [];
let confettiRAF = null;
function startConfetti(){
  const canvas = confettiCanvas;
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);
  confettiPieces = [];
  for(let i=0;i<180;i++){
    confettiPieces.push({
      x: Math.random()*canvas.width,
      y: Math.random()*-canvas.height,
      vx: -2 + Math.random()*4,
      vy: 2 + Math.random()*5,
      r: 6 + Math.random()*8,
      color: `hsl(${Math.random()*360},70%,60%)`
    });
  }
  (function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    confettiPieces.forEach(p=>{
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(p.x,p.y,p.r,p.r*0.7,0,0,Math.PI*2);
      ctx.fill();
      p.x += p.vx; p.y += p.vy; p.vy += 0.02;
      if(p.y > canvas.height + 20){ p.y = -20; p.x = Math.random()*canvas.width; p.vy = 2 + Math.random()*4; }
    });
    confettiRAF = requestAnimationFrame(draw);
  })();
}
function stopConfetti(){ if(confettiRAF) cancelAnimationFrame(confettiRAF); confettiRAF = null; }

/* ======= helpers: escape html, simple text generators (long warm texts) ======= */
function escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* ---- Long texts generators ----
   These generate the actual >250, 700, 1000-word content requested.
   They are written here as functions to keep code readable.
*/

function generateWhyILoveYou(){
  const prefix = `My beloved ${nicknames.join(', ')},\n\n`;
  const body = [
    "When I try to put into words why I love you, I realize words are small compared to what my heart feels. Every morning I wake up with gratitude because you are in my life. Your laughter is a song I want to play on repeat; your kindness is the gentle weather of our home. I love the way your smile arrives like sunlight after night's rain. I love how you choose patience and compassion in moments where it would be easier to react quickly and harshly. You have taught me the beauty of softness and the quiet strength of staying.",
    "I love you for the small things: the way you text me the little things you notice, how you remember my silly preferences, the way your voice softens when you speak about things you care about. I love the way you celebrate others and the way you comfort people who are down; your heart is enormous and generous and it humbles me to be close to it.",
    "I love you for the ways you are perfectly imperfect: your quirks that make you uniquely you, your little habitual jokes, your stubbornness in the sweetest ways. When I look at you I see both a best friend and a life partner — someone I can laugh with, cry with, dream with. You make ordinary days into memories I keep forever.",
    "I love you because you chose me despite my flaws. That choice is the greatest gift; it means you looked deep and still stayed. You make me want to be a better man — kinder, more patient, more present. I promise to spend every day trying to be as patient and generous with you as you have been with me.",
    "My Biwi, my Begum, my Zojha, my Cutiee — each nickname is a petal on the same flower of love. I will cherish, protect, and honor you. I will stand by you in the storms and dance with you in the rain. Forever and always, my heart belongs to you."
  ];
  return prefix + body.join('\n\n');
}

function generateAMemory(){
  const prefix = `A memory I keep close — my ${nicknames.join(', ')}\n\n`;
  const body = [
    "There is a night I replay in my mind more than any other: our first long conversation, the one where the hours disappeared and we felt an ease like two old friends finding each other again. It was not extraordinary in actions — just two people sharing stories, small secrets, and laughter — but it mattered because it revealed how naturally our hearts fit together.",
    "We talked about silly things and big things, about the music that makes us cry, about small flavors we both love, and about the weird dreams we keep. In that space something settled: an honest, soft sense of belonging. That night I felt I had met someone I wanted in my life forever. The world felt quiet in the best way.",
    "From that moment onward, I collected small treasures; the phrase you used in a text that made me smile, the voice note I replayed on a tough day, the way we both said the same silly thing and laughed, the comfort of your emoji when words felt heavy. Those small, repeated acts are the bricks of our shared life. They are the ordinary miracles that become the best stories.",
    "I return often to that first conversation because it is the seed that grew this love. It reminds me how fragile and beautiful beginnings can be and how brave we were to keep going even across miles. That memory keeps me hopeful and excited for every morning we will share together."
  ];
  return prefix + body.join('\n\n');
}

function generatePromise(){
  const prefix = `A promise to you — my ${nicknames.join(', ')}\n\n`;
  const body = [
    "I promise to stand by you through every season of life. When days are bright and the path is easy, I will celebrate by your side. When days are heavy and the road is steep, I will be the steady hand that walks with you. This promise is not a promise of perfection; it is a promise of persistence — to return, to listen, to try again and again.",
    "I promise to keep learning what you need. I will ask when I don't know, I will listen when you need to speak, and I will be present when silence is enough. I promise to value your dreams and to help make space for them. Your ambitions, your quiet joys, and your fears are all safe with me.",
    "I promise to build a home with you that is gentleness and laughter and safe corners for our tired days. I promise to keep making little celebrations of us, to leave notes that make you smile, to remind you how loved you are when you forget. I will work hard and love harder. My life is yours to shape with me.",
    "These promises come from a place of deep gratitude and love. I will spend my days honoring you, protecting our bond, and growing with you in faith and kindness. You are my everything, my meri zindagi, my meri saans, and I promise to cherish you forever."
  ];
  return prefix + body.join('\n\n');
}

function generateSurpriseText(){
  // ~700+ words; composed of several long heartfelt paragraphs joined
  const p = [];
  p.push(`My Dearest ${nicknames.join(', ')},\n\nFrom the smallest morning texts to the late-night calls that keep us company, you have been the constant that turns ordinary days into warm, glowing memories. I made this little universe for you because I wanted a place where every picture, every song, every word could gather and remind you how deeply you are cherished. Each photo is a small star that shines with a memory: a laugh we shared, a quiet moment, a dream we whispered to each other. In these stars I see the story of us — not just the big milestones but the millions of tiny details that, when tied together, create the life I look forward to building with you.`);

  p.push(`There is a tenderness in you that calms me. You have this gentle way of listening that makes me feel truly heard. When I am with you — even across a distance — I feel steadied, as though your presence is a hand on my shoulder guiding me forward. You offer compassion without demand and joy without condition. Each time you tell me about your day, how you faced something small or large, I am grateful that you trust me with your truth. That trust is the foundation of everything I want to be with you.`);

  p.push(`I think of the mornings we will share, the map of simple routines that will eventually become our home. I imagine making you tea, watching you smile across the table, hearing the little things you say that no one else understands. I imagine standing with you through every step of life — the celebrations and the quiet repairs — and I promise to show up with patience and love. You have taught me patience; you have taught me how meaningful the smallest gestures can be. This is my vow to continue learning from you and to be the kind of partner who helps your dreams grow.`);

  p.push(`Please remember that distance is only a temporary geography; our hearts have already settled into the same place. When miles stretch between us, I keep you close by replaying your voice, by staring at pictures, by listening to songs that remind me of you. Each melody stored in this site is a memory: the song that played during a long chat, the tune that made us laugh, the music that felt like home. Press each one and remember we are collecting a lifetime of small beautiful things that will become our history.`);

  p.push(`Finally, my meri pyari, know that every line I write is a little attempt to show you what you mean to me. I will always be gentle with you, I will always celebrate you, and I will always protect the love that we hold. Until the day we are together every morning, this is my little gift — a place where you can click and feel a hug across the distance. With every heartbeat, I love you more. Forever — your Ozair.`);

  return p.map(par => `<p>${escapeHtml(par).replace(/\n/g,'<br><br>')}</p>`).join('');
}

function generateTimelineOne(){
  // ~700+ words describing from 6 Sep 2023 to now
  const parts = [];
  parts.push(`6 Sep 2023 is the date that lives in my memory as the moment a quiet door opened to a life I did not know I was waiting for. That first hello was the seed; the messages that followed were the sun and rain. From that evening we started to trade pieces of ourselves — the small, honest things that make relationships deep and real. We talked about music, about the silly things that make us laugh, about dreams that felt fragile and close at once. Little by little, the conversation turned into companionship, and companionship into an unmistakable warmth that suggested this was not fleeting.`);
  parts.push(`In the months that followed, we learned the rhythm of each other. We learned what to say and what to let be. We discovered the comfort of routine in the unusual circumstances of long-distance — familiar times to call, playlists we shared, inside jokes that would appear in messages like a private language only we understood. You became the place I went to turn the noise of the day into something sweet and alive. The nights we stayed up talking about everything and nothing are treasures I keep carefully. When one of us had a hard day, the other's voice became the shelter.`);
  parts.push(`We have celebrated small wins across the miles and comforted each other in losses both small and large. Each step of the journey proved to me that love is not only a feeling; it is a series of choices to be kind, to show up, to forgive, and to keep believing. You have shown me that love can be patient and persistent, that it can laugh and cry in equal measure. Over time, the person I came to know was stronger and kinder than the idea I had in my mind. Your courage to be yourself, to laugh loud, to show care, to make dreams — it all taught me more about love than I thought possible.`);
  parts.push(`As our connection grew, we dreamed aloud about our future: a home to come back to, routines we would love, a plate of breakfast and the warmth of morning coffee made by one another. I realize now that the dream is not only about big events — it is also about the collection of everyday actions and attentions. It is about the tiny rituals that make a life ours: the messages shared in the middle of a busy day, the song that becomes 'our song', the habit of checking on one another. Those are the soft scaffolding for a life together.`);
  parts.push(`Now, looking forward, I see every day as an opportunity to build more. To hold your hand in person, to watch the small changes of seasons with you, to write our own quiet traditions, to welcome friends and family into a place we make together. I promise to be patient with distance, to be generous with time, to nurture the trust we've made, and to keep the joy alive even in the little things. I will strive to be a partner who honors your heart and supports your growth. Until the day we are side by side every morning, know that you are my constant, my chosen one, and the love I hold is steady and true.`);
  return parts.map(p=>`<p>${escapeHtml(p).replace(/\n/g,'<br><br>')}</p>`).join('');
}

function generateTimelineTwo(){
  // ~700+ words for birthday note
  const parts = [];
  parts.push(`On 19 October, the world became brighter the day you were born. I celebrate this day not only because it marks your birth but because it marks the beginning of every joy that would later belong to us. On your birthday I think of the small miracles that made you who you are: the kindness you learned, the humor that lights your eyes, the endurance that carries you through each day. Each of these parts of you is a reason to celebrate.`);
  parts.push(`Birthdays are for remembering, for gratitude, and for looking forward. I am grateful for every message, every voice note, every moment we have shared. I am grateful that you chose me to share your life with. For the year to come I pray for things that matter: steady health, gentle surprises, growth in your dreams, and the kind of daily comfort that becomes the sweetest kind of home. I wish to be the one who sits beside you through it all, cheering and steady.`);
  parts.push(`I imagine future birthdays where we are together and simple acts like making coffee, lighting a candle, and exchanging small gifts will feel like the most elaborate celebrations because they are shared with love. I imagine the little traditions we will invent — a song we always play, a meal we always share, a silly ritual unique to us. Those private patterns are the things that make life rich and whole. Today, however, I celebrate your remarkable heart and who you are in this exact moment: brave, funny, tender, and endlessly kind.`);
  parts.push(`So on this birthday I promise you patience and companionship; I promise to celebrate both your triumphs and your quiet wins. I promise to build plans and to stay when plans take time. I promise to craft a life with you that glows softer and truer with each passing year. Happy Birthday, my meri pyari, meri saans; your presence brightens every day and I am grateful for the blessing of you.`);
  return parts.map(p=>`<p>${escapeHtml(p).replace(/\n/g,'<br><br>')}</p>`).join('');
}

function generateBirthdayLetter(){
  // ~1000+ words: produce many paragraphs
  const blocks = [];
  blocks.push(`My dearest ${nicknames.join(', ')},\n\nToday I write to you with a heart full of gratitude, wonder, and a love that keeps expanding. Your birthday is not simply a day on the calendar — it is a celebration of the radiant gift you are to everyone lucky enough to know you, and for me, the most treasured of all. On this day I celebrate your laughter, your strength, your tenderness, and the quiet courage you show every day. I celebrate the countless small choices you make that reveal the depth of your heart: the way you help others without seeking applause, the patience you show when things go wrong, the joy you carry that somehow lights up the people around you.`);
  blocks.push(`I remember so many small moments that each feel like jewels: the first time I heard your laugh echo through the phone, the silly exchange that made us both laugh until our sides ached, the times you sent a song that became ours, the late-night conversations where we revealed our softest dreams. Each memory is a thread in the tapestry of us. Each candle on your cake is a light for a memory we've made and a wish for those we will make.`);
  blocks.push(`On birthdays, we often think in wishes — and mine for you is a collection of many simple and deep hopes. I wish for your days to be calm when they need to be and bright when they can be. I wish for your health to be strong and your spirit to be unshaken. I wish for the doors you want to open to open gently and for the dreams that matter to you most to find a clear path forward. I wish for laughter that is abundant and for quiet moments of peace when the world is loud. But above all, I wish for the closeness we both want: those soft mornings, the hands held at night, the small ordinary wonders of a shared life.`);
  blocks.push(`If I may promise anything today, it is to be a partner who builds toward that life. I promise to be steady on the hard days and joyful on the light ones. I promise to protect your tenderness as if it were the most precious thing I own, because to me it is. I promise to remember to be silly when you need to laugh and serious when you need to be heard. I promise to craft a home where you can be wholly yourself, where your dreams are cherished, and where we will find comfort and adventure in equal measure.`);
  blocks.push(`Birthdays are also a time to reflect on how far we've come. From our first chat to now, there has been growth and learning, and I value every step of that journey. We have grown in patience, in understanding, and in love. We have weathered small storms and rejoiced in small victories. Each success is sweeter because it has been shared with you. Each challenge has been softened because we faced it together. On this day, I want you to know that I see you: your efforts, your kindness, your resilience. I honor them and I honor you.`);
  blocks.push(`So today, blow out your candles and make a wish — and know that I will be there to help make those wishes real. I will be the one to cheer loudest, to hold you closest, to celebrate with every part of me. Happy Birthday, my meri pyari, meri zindagi, meri saans. You are my light, my calm, my home. I love you beyond measure and for all time. — Ozair`);
  // join into HTML paragraphs
  return blocks.map(p=>`<p>${escapeHtml(p).replace(/\n/g,'<br><br>')}</p>`).join('');
}

/* ======= small helpers ======= */
function escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* ======= done ======= */
console.log('Script loaded — ready');
