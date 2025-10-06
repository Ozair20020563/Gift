// ================= NICKNAMES =================
const nicknames = ["Biwi","Begum","Zojha","Jaan","My Galaxy","Roohi","Mohtarma","Cutiee","Patutiee","Lovey Dovey","Mera Dil","Meri Jaan","Meri Pyari","Meri Zindagi","Meri Saans","My Universe","My Darling","My Heart","My Angel","My Sunshine"];

// ================= DOM ELEMENTS =================
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const closeBtn = document.querySelector(".close");
const celebrateBtn = document.getElementById("celebrateBtn");
const surpriseBtn = document.getElementById("surpriseBtn");
const notesBtn = document.getElementById("notesBtn");
const morningBtn = document.getElementById("morningBtn");
const memoriesBtn = document.getElementById("memoriesBtn");
const storyBtn = document.getElementById("storyBtn");
const celebrationCanvas = document.getElementById("celebrationCanvas");
let audioPlayer = new Audio();
audioPlayer.loop = true;

// ================= CLOSE MODAL =================
closeBtn.addEventListener("click", () => {
    modal.classList.remove("show");
    modalContent.innerHTML = "";
    stopAudio();
    stopConfetti();
});

// ================= AUDIO CONTROL =================
function playAudio(src){
    audioPlayer.src = src;
    audioPlayer.play();
}
function stopAudio(){
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
}

// ================= CELEBRATION CANVAS =================
let confettiCtx = celebrationCanvas.getContext('2d');
celebrationCanvas.width = window.innerWidth;
celebrationCanvas.height = window.innerHeight;
let confettiParticles = [];

function startConfetti() {
    confettiParticles = [];
    for (let i = 0; i < 150; i++) {
        confettiParticles.push({
            x: Math.random()*celebrationCanvas.width,
            y: Math.random()*celebrationCanvas.height - celebrationCanvas.height,
            r: Math.random()*6 + 4,
            d: Math.random()*50 + 10,
            color: `hsl(${Math.random()*360}, 100%, 50%)`,
            tilt: Math.floor(Math.random()*10)-10,
            tiltAngleIncrement: Math.random()*0.07 + 0.05,
            tiltAngle: 0
        });
    }
    animateConfetti();
}
function animateConfetti(){
    confettiCtx.clearRect(0,0,celebrationCanvas.width,celebrationCanvas.height);
    confettiParticles.forEach((p)=>{
        p.tiltAngle += p.tiltAngleIncrement;
        p.y += (Math.cos(p.d)+3+p.r/2)/2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle) * 12;
        confettiCtx.beginPath();
        confettiCtx.lineWidth = p.r;
        confettiCtx.strokeStyle = p.color;
        confettiCtx.moveTo(p.x + p.tilt + p.r/2, p.y);
        confettiCtx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r/2);
        confettiCtx.stroke();
    });
    confettiAnimation = requestAnimationFrame(animateConfetti);
}
function stopConfetti(){
    cancelAnimationFrame(confettiAnimation);
    confettiCtx.clearRect(0,0,celebrationCanvas.width,celebrationCanvas.height);
}

// ================= CELEBRATE BUTTON =================
celebrateBtn.addEventListener("click", ()=>{
    modal.classList.add("show");
    modalContent.innerHTML = `
        <div class="celebrate-content">
            <h2>Happy Birthday, My Jaan ❤️</h2>
            <p>
                My beloved ${nicknames.join(", ")}, today is the day I celebrate you — every smile, every laugh, every dream we've shared, and every moment that made my heart yours. 
                I remember the first time we spoke, the warmth of your words, the sparkle in your messages, and how effortlessly you became my whole universe. 
                Today, I wish to fill this space with all the love, joy, and gratitude I feel for you. May your heart always feel my presence even from miles away. 
                You are my Biwi, my Begum, my Zojha, my galaxy of stars, my roohi, my mohtarma, my cutiee, my patutiee, my lovey dovey, my mera dil, meri jaan, meri pyari, meri zindagi, meri saans, and my universe.
                <br><br>
                I pray that this birthday brings endless happiness, serenity, success, and moments that make your heart glow. Remember, each beat of my heart whispers your name. 
                May every morning bring you the warmth of sunshine and every night wrap you in the calm of love. Today, candles shine brighter because you exist in this world, and life seems infinitely better with you. 
                <br><br>
                We have journeyed together through laughter, challenges, dreams, and quiet moments of understanding. Every shared secret, every small gesture, every hug and touch, has become a cherished memory. 
                I promise to continue this journey with you, hand in hand, as we explore our universe together. Every day with you is my favorite day.
                <br><br>
                Happy Birthday, my love, my heart, my everything. May this year multiply your joy, fulfill your dreams, and bring us closer to our eternal togetherness. 
                You are my sun and my moon, my reason to smile, my safest place, and my truest love. Celebrate, my darling, for today is all about you and the magic you bring to my life.
            </p>
        </div>`;
    playAudio("assets/music/happy_birthday.mp3");
    startConfetti();
});

// ================= SURPRISE BUTTON =================
surpriseBtn.addEventListener("click", ()=>{
    modal.classList.add("show");
    modalContent.innerHTML = `
        <div class="surprise-content">
            <h2>My Sweet Surprise 💌</h2>
            <p>
                My ${nicknames.join(", ")}, today I want to give you a universe of love in words. From the moment we first spoke to today, every memory shines brightly in my heart. 
                You are my Biwi, my Begum, my Zojha, my Jaan, my My Galaxy, my Roohi, my Mohtarma, my Cutiee, my Patutiee, my Lovey Dovey, my Mera Dil, my Meri Jaan, my Meri Pyari, my Meri Zindagi, my Meri Saans, and my Universe. 
                <br><br>
                Each morning, I wake up thinking of your smile, the warmth of your words, and the dreams we've built together. I remember our conversations that stretched into the night, 
                the laughter we shared, the tiny secrets exchanged, and the moments where silence spoke louder than words. You are my comfort, my joy, and the love that makes my world whole. 
                <br><br>
                I have prepared this little universe of memories for you. From Morning Cutiee pictures to Our Memories gallery, every photo, every song, and every note is a reflection of my endless love for you. 
                May you feel my presence in each word and my heartbeat in every song that plays as you explore this surprise. Today, I celebrate you, my love, my heart, my reason to smile. 
                Let this note remind you that across miles and moments, I am forever yours.
            </p>
        </div>`;
    playAudio("assets/music/music1.mp3");
});

// ================= LOVE NOTES BUTTON =================
notesBtn.addEventListener("click", ()=>{
    modal.classList.add("show");
    modalContent.innerHTML = `
        <div class="notes-container">
            <button class="note-btn" onclick="openNote('why')">Why I love you ❤️</button>
            <button class="note-btn" onclick="openNote('memory')">A memory I keep 🌟</button>
            <button class="note-btn" onclick="openNote('promise')">A promise to you 💞</button>
            <div id="noteContent"></div>
        </div>`;
});
function openNote(type){
    const noteContent = document.getElementById("noteContent");
    if(type==="why"){
        noteContent.innerHTML = `<p>
        My ${nicknames.join(", ")}, the reason I love you is endless and infinite. From the warmth of your smile to the depth of your heart, 
        you have become my entire world. Every glance, every word, every touch has left imprints of love on my soul. 
        I cherish your strength, your kindness, your laughter, and even your little quirks that make you uniquely you. 
        You are my morning sun, my soothing night, my confidant, my joy, my heart, my lifeline, and my everything. 
        Each day with you reminds me of why I am the luckiest to have you as my Biwi, my Begum, my Zojha, my Cutiee, my Patutiee, and my universe.
        </p>`;
        playAudio("assets/music/music2.mp3");
    }else if(type==="memory"){
        noteContent.innerHTML = `<p>
        My dearest ${nicknames.join(", ")}, I remember countless moments that shaped our journey. From our first chat to our first shared laughter, 
        every memory sparkles like a constellation in my heart. I remember late nights when our conversations deepened our bond, 
        times when silence was comforting, and the small gestures that spoke louder than words. 
        Every memory with you feels sacred, a chapter in the epic of our love. I relive those moments every day, cherishing you as my Biwi, my Begum, my Zojha, my Roohi, and my Universe.
        </p>`;
        playAudio("assets/music/music3.mp3");
    }else if(type==="promise"){
        noteContent.innerHTML = `<p>
        My darling ${nicknames.join(", ")}, I promise to love you endlessly, to hold your hand through all storms, 
        to laugh with you in the sunshine, and to stay beside you through every journey. 
        I vow to be your confidant, your protector, your solace, your joy, and your partner in life. 
        Today, tomorrow, and for all the days to come, I will remain devoted to you as my Biwi, my Begum, my Zojha, my Cutiee, my Patutiee, and my Universe.
        </p>`;
        playAudio("assets/music/music4.mp3");
    }
}

// ================= MORNING CUTIEE GALLERY =================
morningBtn.addEventListener("click", ()=>{
    modal.classList.add("show");
    let content = `<div class="gallery">`;
    for(let i=1;i<=14;i++){
        content += `<img src="assets/morning${i}.jpg" class="gallery-img" onclick="openImage('assets/morning${i}.jpg','assets/music/music${i}.mp3')" />`;
    }
    content += `</div>`;
    modalContent.innerHTML = content;
});
function openImage(src,music){
    modalContent.innerHTML = `<img src="${src}" class="modal-img" />`;
    playAudio(music);
    // add animation
}

// ================= MEMORIES GALLERY =================
memoriesBtn.addEventListener("click", ()=>{
    modal.classList.add("show");
    let content = `<div class="memories-slider">`;
    for(let i=1;i<=78;i++){
        content += `<img src="assets/photo${i}.jpg" class="memories-img" onclick="openImage('assets/photo${i}.jpg','assets/music/music${(i%12)+1}.mp3')" />`;
    }
    content += `</div>`;
    modalContent.innerHTML = content;
});

// ================= OUR STORY =================
storyBtn.addEventListener("click", ()=>{
    modal.classList.add("show");
    modalContent.innerHTML = `
        <div class="story-section">
            <button onclick="openStory('sep')">6 Sep 2023 — The Day We Met</button>
            <button onclick="openStory('oct')">19 Oct 2023 — My Jaan's Birthday</button>
            <div id="storyContent"></div>
        </div>`;
});
function openStory(type){
    const storyContent = document.getElementById("storyContent");
    if(type==="sep"){
        storyContent.innerHTML = `<p>
        My dearest ${nicknames.join(", ")}, on 6 September 2023, our journey began. That day, every word we exchanged, every smile, every laughter became a memory 
        that would be etched into my heart forever. Since then, we have shared countless moments, countless dreams, countless promises. 
        You became my Biwi, my Begum, my Zojha, my Cutiee, my Patutiee, my Lovey Dovey, my Mera Dil, my Meri Jaan, my Meri Pyari, my Meri Zindagi, my Meri Saans, and my Universe. 
        From our first chats to our late-night conversations, from moments of laughter to moments of silence where our hearts spoke, 
        every day with you has been a blessing. You are my sun, my moon, my reason to smile, my heartbeat, and the one I want to spend eternity with. 
        Even through miles apart, your love fills my soul and gives me strength. I promise to honor, cherish, and love you in every way possible for all my life.
        </p>`;
        playAudio("assets/music/music5.mp3");
    }else if(type==="oct"){
        storyContent.innerHTML = `<p>
        Today, 19 October 2023, we celebrate your beautiful existence, my love, my Biwi, my Begum, my Zojha, my Cutiee, my Patutiee, my Lovey Dovey, my Mera Dil, my Meri Jaan, my Meri Pyari, my Meri Zindagi, my Meri Saans, and my Universe. 
        Your birthday is not only a celebration of the day you came into this world but also of the endless joy and love you bring into my life. 
        Every song, every note, every memory we have crafted together is a testament to the universe we share. 
        May this day and every day ahead be filled with happiness, laughter, love, and all the blessings your heart desires. 
        I will continue to hold your hand, to walk beside you, and to love you beyond measure.
        </p>`;
        playAudio("assets/music/music6.mp3");
    }
}
