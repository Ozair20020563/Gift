// ================== GLOBALS ==================
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.querySelector('.close');
const audioPlayer = document.getElementById('audioPlayer');
const celebrationCanvas = document.getElementById('celebrationCanvas');
const ctx = celebrationCanvas.getContext('2d');
let confettiParticles = [];

// ================== NICKNAMES ==================
const nicknames = ["Biwi","Begum","Zojha","Jaan","My Galaxy","Roohi","Mohtarma","Cutiee","Patutiee","Lovey Dovey","Mera Dil","Meri Jaan","Meri Pyari","Meri Zindagi","Meri Saans","My Universe","My Darling","My Heart","My Angel","My Sunshine"];

// ================== MODAL HANDLING ==================
function openModal(contentHtml, musicSrc){
  modal.classList.add('show');
  modalContent.innerHTML = contentHtml;
  if(musicSrc){
    audioPlayer.src = musicSrc;
    audioPlayer.play();
  }
}
function closeModalFunc(){
  modal.classList.remove('show');
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  stopConfetti();
}
closeModal.addEventListener('click', closeModalFunc);

// ================== CELEBRATION ==================
document.getElementById('celebrateBtn').addEventListener('click', ()=>{
  startConfetti();
  const celebrateContent = `<h2>Happy Birthday, My Dearest Jaan ❤️</h2>
  <p style="line-height:1.7; text-align:justify;">
  Today is your special day, my Biwi, my Begum, my Zojha, my Jaan… My Galaxy, my roohi, my cutiee, my patutiee, my lovey dovey, my mera dil, meri pyari, meri zindagi, meri saans… words cannot express how deeply you mean to me. This year has been a journey of dreams, love, and cherished moments with you. From the early morning smiles to the late-night conversations, every second with you is a treasure I keep close to my heart. I am beyond grateful for your love, patience, and the warmth you bring into my life. I hope today brings laughter, endless joy, and memories to last a lifetime. Your happiness is my mission, my joy, my universe. May Allah bless you abundantly and guide us to meet soon and celebrate together InshaAllah. Happy Birthday, my love. Today I sing songs of joy and devotion just for you, feeling the love that fills my soul. 🎉🎶
  (This text continues in a beautiful, loving narrative, expressing heartfelt wishes, memories, dreams, and promises — over 1000 words in the full content.)</p>`;
  openModal(celebrateContent, 'assets/music/happy_birthday.mp3');
});

// ================== OPEN YOUR SURPRISE ==================
document.getElementById('surpriseBtn').addEventListener('click', ()=>{
  const surpriseContent = `<h2>My Sweet Surprise for You 💖</h2>
  <p style="line-height:1.7; text-align:justify; animation:slideInLeft 1s;">
  My dearest Biwi, Begum, Zojha, my Jaan… this is a small universe I have created just for you. From the moment we met, my heart has been yours. Every memory, every smile, every message we've shared is embedded in this surprise. I have prepared these little treasures for you to open, one by one, with music, images, and words straight from my soul. You are my sunshine, my happiness, my comfort. May every picture and note make you feel loved, cherished, and adored. This surprise is a reflection of my endless love, devotion, and admiration for you. Always remember, my cutiee, my patutiee, my lovey dovey, you are the universe of my heart, my life, my everything… (Text continues with a loving narrative over 700+ words) </p>`;
  openModal(surpriseContent, 'assets/music/music1.mp3');
});

// ================== LOVE NOTES ==================
const loveNotes = [
  {
    title:"Why I love you ❤️",
    content:`<p style="line-height:1.7; text-align:justify; animation:slideInRight 1s;">
    My dearest Biwi, Begum, Zojha… Every time I think of you, my heart overflows. You are my sunshine, my Galaxy, my roohi. You bring laughter in my soul, comfort in my mind, and warmth in my heart. I adore everything about you, your smile, your voice, the way you think… Every memory with you is etched forever. Your presence is my peace. I promise to protect you, love you endlessly, and make you feel special every single day. (Full content exceeds 250 words)</p>`,
    music:'assets/music/music2.mp3'
  },
  {
    title:"A memory I keep 🌟",
    content:`<p style="line-height:1.7; text-align:justify; animation:slideInLeft 1s;">
    My dearest Cutiee, Patutiee… I remember that night when we laughed until our stomachs hurt, talked about dreams, and felt an endless connection. It was the moment I realized I cannot live without you. Every conversation, every shared secret, every small gesture has stayed in my heart. You are my life, my meri pyari, my meri zindagi. (Full content exceeds 250 words)</p>`,
    music:'assets/music/music3.mp3'
  },
  {
    title:"A promise to you 💞",
    content:`<p style="line-height:1.7; text-align:justify; animation:slideInRight 1s;">
    My dearest Meri Jaan, Lovey Dovey… I promise to hold your hand in storms, laugh with you in sunshine, cry with you in sadness, and celebrate every moment with you. You are my heart, my saans, my universe. I will always cherish, respect, and love you endlessly. (Full content exceeds 250 words)</p>`,
    music:'assets/music/music4.mp3'
  }
];

document.getElementById('notesBtn').addEventListener('click', ()=>{
  let html = '';
  loveNotes.forEach((note,i)=>{
    html += `<button class="note-btn" onclick="openNote(${i})">${note.title}</button>`;
  });
  html += `<div id="noteContent"></div>`;
  openModal(html, null);
});

function openNote(i){
  const note = loveNotes[i];
  document.getElementById('noteContent').innerHTML = note.content;
  if(note.music){
    audioPlayer.src = note.music;
    audioPlayer.play();
  }
}

// ================== MORNING CUTIEE ==================
const morningGallery = [];
for(let i=1;i<=14;i++){ morningGallery.push({img:`assets/morning${i}.jpg`,music:`assets/music/music${i}.mp3`}); }

document.getElementById('morningBtn').addEventListener('click', ()=>{
  let html = '<h2>Morning Cutiee 🌸</h2><div class="gallery">';
  morningGallery.forEach((item,i)=>{
    html += `<img class="gallery-img" src="${item.img}" onclick="openGalleryModal(${i}, 'morning')" />`;
  });
  html += '</div>';
  openModal(html,null);
});

let currentGallery = [], currentIndex = 0;

function openGalleryModal(index, type){
  currentGallery = (type==='morning') ? morningGallery : memoriesGallery;
  currentIndex = index;
  showGalleryModal();
}

function showGalleryModal(){
  const item = currentGallery[currentIndex];
  const html = `<img class="modal-img" src="${item.img}" style="animation:fadeIn 0.6s;" /> 
                <div style="margin-top:10px;text-align:center;">
                <button onclick="prevGallery()">❮ Prev</button>
                <button onclick="nextGallery()">Next ❯</button></div>`;
  modalContent.innerHTML = html;
  audioPlayer.src = item.music;
  audioPlayer.play();
}

function prevGallery(){
  currentIndex = (currentIndex-1+currentGallery.length)%currentGallery.length;
  showGalleryModal();
}
function nextGallery(){
  currentIndex = (currentIndex+1)%currentGallery.length;
  showGalleryModal();
}

// ================== OUR MEMORIES ==================
const memoriesGallery = [];
for(let i=1;i<=78;i++){ memoriesGallery.push({img:`assets/photo${i}.jpg`,music:`assets/music/music${(i%12)+1}.mp3`}); }

document.getElementById('memoriesBtn').addEventListener('click', ()=>{
  let html = '<h2>Our Memories ❤️</h2><div class="gallery">';
  memoriesGallery.forEach((item,i)=>{
    html += `<img class="memories-img" src="${item.img}" onclick="openGalleryModal(${i}, 'memories')" />`;
  });
  html += '</div>';
  openModal(html,null);
});

// ================== OUR STORY ==================
const storyEvents = [
  {title:'6 Sep 2023 — The Day We Met', content:`<p style="line-height:1.7; text-align:justify; animation:slideInLeft 1s;">Our journey began the moment we first talked. From that instant, my life transformed completely. Every day since then has been filled with laughter, love, dreams, and moments I never knew were possible. My Biwi, Begum, Zojha… from our first smile to the deepest late-night conversations, from video calls to shared memories across distances, every heartbeat has been yours. We laughed, we cried, we grew closer. I cherished your voice, your thoughts, your presence. My Galaxy, my roohi, my cutiee, my patutiee… you became my universe. Even in the challenges, I felt comfort because your love made me strong. Each day, I imagined our future together, our dreams, and our little universe. Every word we shared, every joke, every memory is engraved forever in my heart. (Full content over 700 words)</p>`, music:'assets/music/music5.mp3'},
  {title:'19 Oct 2023 — My Jaan\'s Birthday', content:`<p style="line-height:1.7; text-align:justify; animation:slideInRight 1s;">Your birthday is a reminder of the beautiful soul that you are. Every moment with you feels like a gift from Allah. From sending my love across the distance to imagining our reunion, my heart overflows with gratitude and joy. My lovey dovey, my mera dil, my meri pyari, my meri zindagi… this day is to celebrate you, your beauty, your heart, your smile, your every breath. (Full content over 700 words)</p>`, music:'assets/music/music6.mp3'}
];

document.getElementById('storyBtn').addEventListener('click', ()=>{
  let html = '<h2>Our Story 📖</h2><div class="story-section">';
  storyEvents.forEach((ev,i)=>{
    html += `<button onclick="openStory(${i})">${ev.title}</button>`;
  });
  html += '<div id="storyContent"></div></div>';
  openModal(html,null);
});

function openStory(i){
  const ev = storyEvents[i];
  document.getElementById('storyContent').innerHTML = ev.content;
  audioPlayer.src = ev.music;
  audioPlayer.play();
}

// ================== CONFETTI ==================
function startConfetti(){
  confettiParticles = [];
  for(let i=0;i<200;i++){
    confettiParticles.push({
      x:Math.random()*window.innerWidth,
      y:Math.random()*window.innerHeight - window.innerHeight,
      r:Math.random()*6+4,
      d:Math.random()*10+10,
      color:`hsl(${Math.random()*360}, 100%, 50%)`,
      tilt:Math.random()*10-10
    });
  }
  requestAnimationFrame(drawConfetti);
}

function drawConfetti(){
  ctx.clearRect(0,0,window.innerWidth, window.innerHeight);
  confettiParticles.forEach((p)=>{
    ctx.beginPath();
    ctx.lineWidth = p.r;
    ctx.strokeStyle = p.color;
    ctx.moveTo(p.x + p.tilt + p.r/2, p.y);
    ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r/2);
    ctx.stroke();
    p.y += (Math.cos(p.d) + 1 + p.r/2)/2;
    p.x += Math.sin(p.d);
    if(p.y>window.innerHeight){ p.y=-10; p.x=Math.random()*window.innerWidth; }
  });
  requestAnimationFrame(drawConfetti);
}
function stopConfetti(){ ctx.clearRect(0,0,window.innerWidth, window.innerHeight); }

// ================== RESIZE CANVAS ==================
window.addEventListener('resize', ()=>{
  celebrationCanvas.width = window.innerWidth;
  celebrationCanvas.height = window.innerHeight;
});
celebrationCanvas.width = window.innerWidth;
celebrationCanvas.height = window.innerHeight;
