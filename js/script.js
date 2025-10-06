// Global variables
let currentAudio = null;
let celebrationInterval = null;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    createFloatingHearts();
    createSparkles();
    initializeAudio();
});

// Create floating hearts animation
function createFloatingHearts() {
    const heartsContainer = document.querySelector('.floating-hearts');
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.innerHTML = getRandomHeart();
        heart.style.position = 'absolute';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 10 + 15) + 'px';
        heart.style.opacity = '0.7';
        heart.style.pointerEvents = 'none';
        heart.style.animation = `heartFloat ${Math.random() * 10 + 10}s linear forwards`;
        
        heartsContainer.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 20000);
    }, 500);
}

function getRandomHeart() {
    const hearts = ['💖', '💕', '💗', '🌸', '✨', '💝', '🎀', '🌺', '💐', '🦋'];
    return hearts[Math.floor(Math.random() * hearts.length)];
}

// Create sparkle effects
function createSparkles() {
    const body = document.body;
    
    setInterval(() => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * window.innerWidth + 'px';
        sparkle.style.top = Math.random() * window.innerHeight + 'px';
        sparkle.style.animationDelay = Math.random() * 2 + 's';
        
        body.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 1500);
    }, 300);
}

// Initialize audio elements
function initializeAudio() {
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.volume = 0.5;
        audio.addEventListener('ended', () => {
            currentAudio = null;
        });
    });
}

// Stop current audio
function stopCurrentAudio() {
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
}

// Play audio
function playAudio(audioId) {
    stopCurrentAudio();
    const audio = document.getElementById(audioId);
    if (audio) {
        currentAudio = audio;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
}

// Celebration functions
function startCelebration() {
    const modal = document.getElementById('celebrationModal');
    modal.style.display = 'block';
    
    // Play celebration audio
    playAudio('celebrationAudio');
    
    // Start continuous celebration animation
    startCelebrationAnimation();
    
    // Add celebration effects
    addCelebrationEffects();
}

function startCelebrationAnimation() {
    const celebrationContent = document.querySelector('.celebration-animation');
    
    celebrationInterval = setInterval(() => {
        createCelebrationParticle();
    }, 200);
}

function createCelebrationParticle() {
    const particles = ['🎉', '🎊', '🎂', '🎈', '✨', '🎁', '🌟', '💖'];
    const particle = document.createElement('div');
    particle.innerHTML = particles[Math.floor(Math.random() * particles.length)];
    particle.style.position = 'absolute';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.fontSize = (Math.random() * 20 + 20) + 'px';
    particle.style.pointerEvents = 'none';
    particle.style.animation = 'celebrationFloat 3s ease-out forwards';
    particle.style.zIndex = '1';
    
    const celebrationAnimation = document.querySelector('.celebration-animation');
    if (celebrationAnimation) {
        celebrationAnimation.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 3000);
    }
}

function addCelebrationEffects() {
    const modal = document.querySelector('.celebration-content');
    modal.style.animation = 'celebrationPulse 2s ease-in-out infinite';
}

function closeCelebration() {
    const modal = document.getElementById('celebrationModal');
    modal.style.display = 'none';
    
    // Stop celebration animation
    if (celebrationInterval) {
        clearInterval(celebrationInterval);
        celebrationInterval = null;
    }
    
    // Stop audio
    stopCurrentAudio();
    
    // Clear celebration particles
    const celebrationAnimation = document.querySelector('.celebration-animation');
    if (celebrationAnimation) {
        celebrationAnimation.innerHTML = '';
    }
}

// Surprise functions
function openSurprise() {
    const modal = document.getElementById('surpriseModal');
    modal.style.display = 'block';
    
    // Play surprise audio
    playAudio('surpriseAudio');
    
    // Add surprise animation
    addSurpriseAnimation();
}

function addSurpriseAnimation() {
    const surpriseContent = document.querySelector('.surprise-animation');
    
    // Create magical particles
    setInterval(() => {
        createMagicalParticle();
    }, 300);
    
    // Add bouncing effect
    surpriseContent.style.animation = 'surpriseBounce 3s ease-in-out infinite';
}

function createMagicalParticle() {
    const particles = ['✨', '🌟', '💫', '⭐', '🎭', '🎪', '🎨', '🦄'];
    const particle = document.createElement('div');
    particle.innerHTML = particles[Math.floor(Math.random() * particles.length)];
    particle.style.position = 'absolute';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.fontSize = (Math.random() * 15 + 15) + 'px';
    particle.style.pointerEvents = 'none';
    particle.style.animation = 'sparkle 2s ease-out forwards';
    particle.style.zIndex = '1';
    
    const surpriseModal = document.querySelector('.surprise-content');
    if (surpriseModal) {
        surpriseModal.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 2000);
    }
}

function closeSurprise() {
    const modal = document.getElementById('surpriseModal');
    modal.style.display = 'none';
    stopCurrentAudio();
}

// Scroll to love notes
function scrollToLoveNotes() {
    document.getElementById('love-notes').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Photo functions
function openPhoto(section, index) {
    const modal = document.getElementById('photoModal');
    const modalPhoto = document.getElementById('modalPhoto');
    
    // Different images for different sections
    const morningImages = [
        'https://images.unsplash.com/photo-1502810365585-56ffa361fdde?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1494790108755-2616c9ce71da?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=800&fit=crop'
    ];
    
    const memoryImages = [
        'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=800&fit=crop'
    ];
    
    const images = section === 'morning' ? morningImages : memoryImages;
    modalPhoto.src = images[index];
    
    modal.style.display = 'block';
    
    // Play different audio for each photo
    const audioId = `photoAudio${index + 1}`;
    playAudio(audioId);
    
    // Add photo-specific animation
    addPhotoAnimation(section, index);
}

function addPhotoAnimation(section, index) {
    const photoDisplay = document.querySelector('.photo-display');
    const animationClasses = [
        'bounceIn',
        'slideInLeft',
        'slideInRight',
        'zoomIn'
    ];
    
    photoDisplay.className = 'photo-display ' + animationClasses[index];
    
    // Create hearts around the photo
    createPhotoHearts();
}

function createPhotoHearts() {
    const photoDisplay = document.querySelector('.photo-display');
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '💖';
            heart.style.position = 'absolute';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = Math.random() * 100 + '%';
            heart.style.fontSize = (Math.random() * 10 + 20) + 'px';
            heart.style.pointerEvents = 'none';
            heart.style.animation = 'heartPop 1s ease-out forwards';
            heart.style.zIndex = '10';
            
            photoDisplay.appendChild(heart);
            
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 1000);
        }, i * 100);
    }
}

function closePhoto() {
    const modal = document.getElementById('photoModal');
    modal.style.display = 'none';
    stopCurrentAudio();
    
    // Clear photo hearts
    const photoDisplay = document.querySelector('.photo-display');
    const hearts = photoDisplay.querySelectorAll('div');
    hearts.forEach(heart => {
        if (heart.innerHTML === '💖') {
            heart.remove();
        }
    });
}

// Love Notes functions
function openLoveNote(type) {
    const modal = document.getElementById('loveNoteModal');
    const content = document.getElementById('loveNoteContent');
    
    let noteContent = '';
    let audioId = '';
    
    switch(type) {
        case 'why-love':
            noteContent = `
                <h2>Why I Love You ❤️</h2>
                <p>My dearest Doha, where do I even begin to describe why I love you? You are the sunshine that brightens my darkest days and the calm that soothes my restless soul.</p>
                
                <p>I love you because of your incredible kindness. The way you care for everyone around you, how you always think of others before yourself, and how you make everyone feel special and loved. Your heart is pure gold, and it shines through everything you do.</p>
                
                <p>I love your laugh - it's the most beautiful sound in the world to me. When you laugh, really laugh, your whole face lights up and it makes my heart skip a beat every single time. Your smile has the power to change my entire day from ordinary to extraordinary.</p>
                
                <p>I love how passionate you are about your dreams and goals. Watching you work towards what you want, seeing your determination and dedication, inspires me to be better every day. You never give up, and that strength is something I deeply admire.</p>
                
                <p>I love the little things about you - how you scrunch your nose when you're thinking, how you get excited about small surprises, how you remember every little detail about people you care about. These little quirks make you uniquely you, and I wouldn't change a single thing.</p>
                
                <p>Most of all, I love you because you love me for who I am, with all my flaws and imperfections. You see the best in me even when I can't see it myself. You believe in me, support me, and make me want to be the best version of myself.</p>
                
                <p>You are my best friend, my confidant, my partner, and my greatest love. That's why I love you, today and always. 💕</p>
            `;
            audioId = 'loveNoteAudio1';
            break;
            
        case 'memory-keep':
            noteContent = `
                <h2>A Memory I Keep 🌟</h2>
                <p>There's this one memory I treasure more than any precious gem, more than any photograph, more than any gift I've ever received.</p>
                
                <p>It was that evening when we were talking on video call, and you were telling me about your day. The lighting in your room was just perfect, creating this soft glow around you, and you were wearing that shirt you love so much. You were animated, excited about something that had happened, and your eyes were sparkling with joy.</p>
                
                <p>In that moment, as I watched you talk, I realized something profound - I was completely, utterly, and irrevocably in love with you. Not just the butterflies-in-stomach kind of love, but the deep, soul-connecting, this-person-is-my-home kind of love.</p>
                
                <p>You paused mid-sentence and asked me why I was smiling so much, and I couldn't tell you then that it was because I was looking at my future, my happiness, my everything. I just said you looked beautiful, which was true, but it was so much more than that.</p>
                
                <p>What makes this memory so special isn't just that moment of realization, but how natural it felt. How right it felt. There was no dramatic music, no perfect setting, no special occasion - it was just us, being us, and that was perfect.</p>
                
                <p>I keep this memory close to my heart because it reminds me that love isn't always about grand gestures or perfect moments. Sometimes it's about recognizing that the person you're looking at is the one you want to look at for the rest of your life.</p>
                
                <p>That memory taught me that I had found something rare and beautiful with you - a love that feels like coming home. 💫</p>
            `;
            audioId = 'loveNoteAudio2';
            break;
            
        case 'promise':
            noteContent = `
                <h2>A Promise to You 💞</h2>
                <p>My beloved Doha, today I want to make you promises that come from the deepest part of my heart, promises I intend to keep for the rest of my life.</p>
                
                <p>I promise to love you not just on the easy days when everything is perfect, but especially on the difficult days when life gets challenging. I promise to be your safe space, your comfort, and your biggest supporter no matter what comes our way.</p>
                
                <p>I promise to never stop trying to make you smile. Whether it's through silly jokes, unexpected surprises, or just being there when you need me most, I will always do my best to bring joy to your life because your happiness means everything to me.</p>
                
                <p>I promise to respect your dreams and support your goals. I will celebrate your victories as if they were my own and help you get back up when you face setbacks. Your success is my success, and your dreams matter deeply to me.</p>
                
                <p>I promise to be honest with you always, even when it's difficult. I promise to communicate openly, to listen when you speak, and to never let pride or ego come between us. Trust is the foundation of love, and I promise to guard ours carefully.</p>
                
                <p>I promise to grow with you. As we both change and evolve, I promise to embrace those changes and love every version of you that emerges. I promise to never stop learning about you, discovering new things that make me fall in love with you all over again.</p>
                
                <p>I promise to be patient, understanding, and forgiving. I promise to remember that we're on the same team, facing life together, not against each other.</p>
                
                <p>Most importantly, I promise to love you with everything I have, for as long as I live. This isn't just a feeling that might fade - this is a choice I make every day, and I promise to keep choosing you, choosing us, choosing love.</p>
                
                <p>These aren't just words, my darling. They are sacred vows from my heart to yours. 💖</p>
            `;
            audioId = 'loveNoteAudio3';
            break;
    }
    
    content.innerHTML = noteContent;
    modal.style.display = 'block';
    playAudio(audioId);
    
    // Add love note animation
    addLoveNoteAnimation();
}

function addLoveNoteAnimation() {
    const content = document.getElementById('loveNoteContent');
    content.style.animation = 'loveNoteSlide 0.5s ease-out';
    
    // Create floating hearts
    createLoveNoteHearts();
}

function createLoveNoteHearts() {
    const modal = document.querySelector('.love-note-modal-content');
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = getRandomHeart();
            heart.style.position = 'absolute';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = Math.random() * 100 + '%';
            heart.style.fontSize = (Math.random() * 8 + 12) + 'px';
            heart.style.pointerEvents = 'none';
            heart.style.animation = 'heartFloat 4s ease-out forwards';
            heart.style.zIndex = '1';
            heart.style.opacity = '0.7';
            
            modal.appendChild(heart);
            
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 4000);
        }, i * 200);
    }
}

function closeLoveNote() {
    const modal = document.getElementById('loveNoteModal');
    modal.style.display = 'none';
    stopCurrentAudio();
}

// Story functions
function openStory(type) {
    const modal = document.getElementById('storyModal');
    const content = document.getElementById('storyContent');
    
    let storyContent = '';
    let audioId = '';
    
    switch(type) {
        case 'met':
            storyContent = `
                <h2>6 Sep 2023 - The Day We Met 💫</h2>
                <p>September 6th, 2023 - a date that changed everything, though I didn't know it at the time. It was just another ordinary day until it became the most extraordinary day of my life because that's when you walked into my world.</p>
                
                <p>I remember feeling nervous before we first talked. There was something about you that drew me in immediately - maybe it was your profile picture that showed your beautiful smile, or maybe it was just destiny calling. When we started chatting, I felt this instant connection that I'd never experienced before.</p>
                
                <p>Our first conversation lasted for hours. We talked about everything and nothing, sharing stories, dreams, and random thoughts. I found myself laughing more than I had in months, and every message from you made my heart race a little faster. You were funny, intelligent, kind, and so incredibly genuine.</p>
                
                <p>What struck me most was how easy it was to talk to you. There were no awkward silences, no pretending to be someone I wasn't. You made me feel comfortable being myself, and that's something rare and precious. I felt like I could tell you anything, and you'd understand.</p>
                
                <p>By the end of that first day, I knew something special had happened. I went to bed that night with a smile on my face, replaying our conversations in my mind. I couldn't wait to talk to you again the next day, and the day after that, and every day since.</p>
                
                <p>Looking back now, I can see that September 6th wasn't just the day we met - it was the day my life found its missing piece. It was the day I met the person who would become my best friend, my confidant, my love, my everything.</p>
                
                <p>That ordinary Tuesday became the most important day of my year, and I'm so grateful that our paths crossed when they did. From that first "hello" to where we are now, every moment has been building toward something beautiful.</p>
                
                <p>Sometimes I wonder what would have happened if we hadn't met that day, but then I realize that somehow, someway, we were meant to find each other. The universe has a way of bringing the right people together at exactly the right time.</p>
                
                <p>Thank you for saying yes to that first conversation, for taking a chance on someone new, for being open to whatever this connection might become. That day you didn't just meet me - you met someone who would love you more than you ever imagined possible.</p>
                
                <p>September 6th, 2023 - the day our love story began. 💕</p>
            `;
            audioId = 'storyAudio1';
            break;
            
        case 'birthday':
            storyContent = `
                <h2>19 Oct 2023 - My Jaan's Birthday 🎂</h2>
                <p>October 19th, 2023 - your first birthday since we met, and I was determined to make it special even though we were miles apart. I had been planning for weeks, thinking about how to celebrate the most important person in my life.</p>
                
                <p>I remember staying up late the night before, preparing surprises and messages, my heart full of excitement and love. I wanted this day to be perfect for you because you deserved nothing less than pure joy and celebration.</p>
                
                <p>When the clock struck midnight, I was the first to wish you happy birthday. I could see the surprise and happiness in your eyes through our video call, and that moment made all the planning worth it. Your smile lit up my entire world, and I felt so lucky to be part of your special day.</p>
                
                <p>Throughout the day, I kept sending you little surprises - messages, photos, voice notes expressing how much you meant to me. I wanted to be there with you in spirit, to make sure you felt loved and celebrated every moment of your birthday.</p>
                
                <p>What made that day even more special was how it brought us closer together. Sharing in your birthday joy, seeing how happy my efforts made you, feeling the warmth of your gratitude - it all deepened my love for you. I realized that making you happy had become my greatest joy.</p>
                
                <p>I loved hearing about your day - who called you, what gifts you received, how you celebrated with your family. Every detail mattered to me because everything that brought you joy brought me joy too. Your happiness had become intertwined with mine.</p>
                
                <p>That evening, when we talked for hours about your birthday, about us, about our dreams for the future, I knew with absolute certainty that I wanted to celebrate every birthday of yours for the rest of my life. I wanted to be the person who makes each one special, who remembers what makes you smile, who celebrates you not just on your birthday but every single day.</p>
                
                <p>October 19th taught me something beautiful about love - that true love means celebrating the other person's existence, being grateful for every year they've been in this world, and looking forward to creating birthday memories together for years to come.</p>
                
                <p>Your birthday became a celebration of everything wonderful about you - your kindness, your beauty, your dreams, your love. It was a day to honor the incredible person you are and to express gratitude for having you in my life.</p>
                
                <p>Now, as another October 19th arrives, I'm even more grateful, even more in love, even more excited to celebrate you. Each birthday is a reminder of how blessed I am to call you mine, to be part of your story, to love you more deeply with each passing year.</p>
                
                <p>Happy Birthday, my beautiful Doha. Here's to many more birthdays together, each one more special than the last. 🎉💖</p>
            `;
            audioId = 'storyAudio2';
            break;
    }
    
    content.innerHTML = storyContent;
    modal.style.display = 'block';
    playAudio(audioId);
    
    // Add story animation
    addStoryAnimation();
}

function addStoryAnimation() {
    const content = document.getElementById('storyContent');
    content.style.animation = 'storyFade 0.5s ease-out';
    
    // Create story particles
    createStoryParticles();
}

function createStoryParticles() {
    const modal = document.querySelector('.story-modal-content');
    const particles = ['⭐', '✨', '🌟', '💫', '🌙', '☄️', '🎭', '📖'];
    
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.innerHTML = particles[Math.floor(Math.random() * particles.length)];
            particle.style.position = 'absolute';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.fontSize = (Math.random() * 10 + 15) + 'px';
            particle.style.pointerEvents = 'none';
            particle.style.animation = 'sparkle 3s ease-out forwards';
            particle.style.zIndex = '1';
            particle.style.opacity = '0.8';
            
            modal.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 3000);
        }, i * 250);
    }
}

function closeStory() {
    const modal = document.getElementById('storyModal');
    modal.style.display = 'none';
    stopCurrentAudio();
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            stopCurrentAudio();
            
            // Stop celebration animation if closing celebration modal
            if (modal.id === 'celebrationModal' && celebrationInterval) {
                clearInterval(celebrationInterval);
                celebrationInterval = null;
            }
        }
    });
}

// Smooth scrolling for navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes celebrationPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
    }
    
    @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes slideInLeft {
        0% { transform: translateX(-100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideInRight {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes zoomIn {
        0% { transform: scale(0); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(style);