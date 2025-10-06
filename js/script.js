const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const closeBtn = document.querySelector(".close");
const canvas = document.getElementById("celebrationCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let currentAudio = null;
function playMusic(file) {
  if (currentAudio) currentAudio.pause();
  currentAudio = new Audio(`assets/music/${file}`);
  currentAudio.loop = true;
  currentAudio.play();
}

function stopMusic() {
  if (currentAudio) currentAudio.pause();
  currentAudio = null;
}

// ❤️ Close modal
closeBtn.onclick = function() {
  modal.style.display = "none";
  modalContent.innerHTML = "";
  stopMusic();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// 🧁 Celebrate Button
document.getElementById("celebrateBtn").onclick = function() {
  modal.style.display = "flex";
  modalContent.innerHTML = `
    <h2>🎉 Happy Birthday My Galaxy, My Biwi, My Jaan 💖</h2>
    <p style="background:rgba(255,255,255,0.1);padding:20px;border-radius:15px;">
      ${"🌸 ".repeat(100)}<br>
      My dearest Begum, today is your day — the day my world got its color, the day my Zojha came to life like poetry in motion...
      [Your full 1000-word love letter continues here — paste your long text in this <p> tag]
    </p>`;
  playMusic("happybirthday.mp3");
  startCelebration();
};

// 💌 Surprise Button
document.getElementById("surpriseBtn").onclick = function() {
  modal.style.display = "flex";
  modalContent.innerHTML = `
    <h2>💌 A Little Universe For You 💌</h2>
    <p>[700+ word poetic love message here about how much you love her]</p>`;
  playMusic("music1.mp3");
};

// 💞 Notes Button
document.getElementById("notesBtn").onclick = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
};

// 🌸 Morning Cutiee
document.getElementById("morningBtn").onclick = function() {
  modal.style.display = "flex";
  let galleryHTML = `
    <div class="gallery">
      ${Array.from({length: 14}, (_,i)=>`<img class='gallery-img' src='assets/morning${i+1}.jpg'>`).join('')}
    </div>`;
  modalContent.innerHTML = galleryHTML;
  playMusic("music2.mp3");
};

// ❤️ Our Memories
document.getElementById("memoriesBtn").onclick = function() {
  modal.style.display = "flex";
  let galleryHTML = `
    <div class="gallery">
      ${Array.from({length: 20}, (_,i)=>`<img class='gallery-img' src='assets/photo${i+1}.jpg'>`).join('')}
    </div>`;
  modalContent.innerHTML = galleryHTML;
  playMusic("music3.mp3");
};

// 📖 Our Story
document.getElementById("storyBtn").onclick = function() {
  modal.style.display = "flex";
  modalContent.innerHTML = `
    <h2>📖 Our Story</h2>
    <p>[Your full 700-word story for 6 Sep 2023 here]</p>
    <p>[Your full 700-word story for 19 Oct 2023 here]</p>`;
  playMusic("music4.mp3");
};

// 🎆 Celebration Animation
let particles = [];
function startCelebration() {
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 6 + 2,
      dx: (Math.random() - 0.5) * 4,
      dy: (Math.random() - 0.5) * 4,
      color: `hsl(${Math.random()*360},100%,70%)`
    });
  }
  animate();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
  }
  requestAnimationFrame(animate);
}
