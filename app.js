/**
 * FirstWord AI - Full-Screen Game Engine & Clinical Analytics Studio
 * Interactive Speech Game for Children with Live Telemetry for Parents & SLPs
 */

// Global Game State
const gameState = {
  activeWorld: 'grocery',
  isRecording: false,
  isMituSpeaking: false,
  soundEffectsEnabled: true,
  aiHudVisible: true,
  isSplitScreen: false,
  stars: 12,
  wordsCount: 485,
  streakDays: 7,
  activeChild: {
    name: 'আরিয়ান আহমেদ',
    age: '৪ বছর ৮ মাস',
    level: 2,
    mlu: 3.4
  },
  worlds: {
    grocery: {
      title: '🍎 ফল ও মিষ্টির জাদুর দোকান',
      signboard: '🍎 ফল ও মিষ্টির জাদুর দোকান',
      backdropClass: 'grad-sky',
      initialPrompt: 'আরিয়ান দোস্ত! আমার দোকানে দেখো কত মজার মিষ্টি পাকা আম আর লাল আপেল আছে! তোমার কোনটা বেশি খেতে ইচ্ছে করছে?',
      questHint: '🎯 মিশন: পছন্দের ফলটি বেছে নিয়ে ২-৩ শব্দের বাক্য বলো',
      phrases: [
        'আমাকে একটা লাল আপেল দাও',
        'আমটা অনেক মিষ্টি',
        'গাদি করে বাড়ি যাব (ভুল উচ্চারণ টেস্ট)'
      ]
    },
    jungle: {
      title: '🦜 জাদুর বন ও পাখির ডাক',
      signboard: '🦜 রহস্যময় সুন্দরবন ও পাখির বাসা',
      backdropClass: 'grad-jungle',
      initialPrompt: 'শোনো দোস্ত! গাছের ডালে একটা রঙিন পাখি বসে গান গাইছে! ওই দেখো আকাশে একটা লাল ঘুড়িও উড়ছে! পাখিটা কী করছে?',
      questHint: "🎯 মিশন: 'পাখি', 'উড়ছে', 'ঘুড়ি' শব্দে তাড়নজাত 'ড়' ধ্বনি অনুশীলন",
      phrases: [
        'পাখিটা গাছে গান গাইছে',
        'লাল ঘুড়িটা আকাশে উড়ে',
        'পাখিটা অনেক বড়'
      ]
    },
    emotions: {
      title: '🎭 অনুভূতির গুহা ও মনের কথা',
      signboard: '🎭 মনের আয়না ও অনুভূতির ঘর',
      backdropClass: 'grad-sunset',
      initialPrompt: 'আজ সকালে ছোট্ট বিড়াল ছানাটি তার বল হারিয়ে খুব মন খারাপ করেছিল। তোমার যখন কোনো খেলনা হারিয়ে যায়, কেমন লাগে?',
      questHint: '🎯 মিশন: রাগ, কষ্ট বা আনন্দ ভাষায় প্রকাশ করা',
      phrases: [
        'আমার খুব মন খারাপ লাগে',
        'খেলনা পেলে আমি অনেক খুশি',
        'আমি রাগ করি'
      ]
    },
    riddle: {
      title: '🪄 শব্দ জাদুকরের ধাঁধা',
      signboard: '🪄 শব্দ জাদুকর ও মায়াবী ধাঁধা',
      backdropClass: 'grad-sky',
      initialPrompt: 'আমার কাছে একটা জাদু ধাঁধা আছে! গোলগাল লাল রঙের মিষ্টি রসালো ফল, যার নাম বলতে হবে! বলো তো কী ফল?',
      questHint: '🎯 মিশন: বর্ণনা শুনে সঠিক নতুন শব্দটি চিন্তা করে বলা',
      phrases: [
        'এটা কি লাল আপেল?',
        'মিষ্টি রসালো তরমুজ',
        'আমি জানি না, বলে দাও'
      ]
    }
  }
};

// ============================================================================
// Particle System for Star Bursts & Confetti (Game Joy Effect)
// ============================================================================
const particles = [];
let canvas, ctx;

function initParticlesCanvas() {
  canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  requestAnimationFrame(updateParticles);
}

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function spawnStarShower(originX, originY, count = 25) {
  const colors = ['#FFD54F', '#FFA000', '#FF5252', '#4FC3F7', '#69F0AE', '#FF4081'];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 3;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      gravity: 0.28,
      size: Math.random() * 10 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRot: Math.random() * 10 - 5
    });
  }
}

function updateParticles() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.alpha -= 0.016;
    p.rotation += p.vRot;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;

    // Draw 5-pointed star
    ctx.beginPath();
    for (let s = 0; s < 5; s++) {
      ctx.lineTo(Math.cos(((18 + s * 72) * Math.PI) / 180) * p.size, -Math.sin(((18 + s * 72) * Math.PI) / 180) * p.size);
      ctx.lineTo(Math.cos(((54 + s * 72) * Math.PI) / 180) * (p.size / 2), -Math.sin(((54 + s * 72) * Math.PI) / 180) * (p.size / 2));
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  requestAnimationFrame(updateParticles);
}

// ============================================================================
// Web Audio API Synthesizer (Realistic Game Sounds)
// ============================================================================
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(type) {
  if (!gameState.soundEffectsEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'pop') {
      // Gentle bubble pop when tapping toys
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'star-chime') {
      // Golden star reward chime
      const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.15, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.35);
      });
    } else if (type === 'mic-start') {
      // Arcade Mic Beep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'giggle') {
      // Playful tiger chirp
      const freqs = [350, 480, 420, 560];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.06);
        gain.gain.setValueAtTime(0.12, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.15);
      });
    }
  } catch (e) {
    console.warn('Audio tone note:', e);
  }
}

// ============================================================================
// DOM Initialization & Event Wire-Up
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();

  initParticlesCanvas();
  setupGameWorldNav();
  setupArcadeMic();
  setupHUDButtons();
  initDashboardCharts();
});

// Setup World Stage Switcher
function setupGameWorldNav() {
  const portalBtns = document.querySelectorAll('.portal-btn');
  portalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const worldKey = btn.getAttribute('data-world');
      switchGameWorld(worldKey);
    });
  });

  // Replay speech button
  const replayBtn = document.getElementById('balloon-replay-btn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      const text = document.getElementById('mitu-dialogue-text').innerText;
      speakMituVoice(text);
    });
  }
}

function switchGameWorld(worldKey) {
  if (!gameState.worlds[worldKey]) return;
  playSound('pop');

  gameState.activeWorld = worldKey;
  const world = gameState.worlds[worldKey];

  // Update Portal Buttons UI
  document.querySelectorAll('.portal-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-world') === worldKey);
  });

  // Update Signboard & Balloon
  document.getElementById('game-quest-title').innerText = world.signboard;
  document.getElementById('mitu-dialogue-text').innerText = `"${world.initialPrompt}"`;
  document.getElementById('balloon-quest-hint').innerText = world.questHint;

  // Change background style
  const viewport = document.getElementById('game-viewport');
  if (worldKey === 'jungle') {
    viewport.style.background = 'var(--grad-jungle)';
  } else if (worldKey === 'emotions') {
    viewport.style.background = 'var(--grad-sunset)';
  } else {
    viewport.style.background = 'var(--grad-sky)';
  }

  // Update Quick Phrases
  const bar = document.getElementById('game-quick-phrases');
  bar.innerHTML = '';
  world.phrases.forEach(phrase => {
    const pill = document.createElement('button');
    pill.className = 'game-speech-pill';
    pill.innerText = `"${phrase}"`;
    pill.onclick = () => sendChildVoiceSimulation(phrase);
    bar.appendChild(pill);
  });

  speakMituVoice(world.initialPrompt);
}

// Interactive Tap on Scene Toys/Items
function tapGameItem(itemName, itemKey) {
  playSound('pop');

  // Find item element and animate wobble
  const target = event.currentTarget;
  if (target) {
    target.style.transform = 'scale(1.35) rotate(-10deg)';
    setTimeout(() => {
      target.style.transform = '';
    }, 300);

    const rect = target.getBoundingClientRect();
    spawnStarShower(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);
  }

  let speech = '';
  let hint = '';

  if (itemKey === 'apple') {
    speech = 'আরে তাজা লাল আপেল! আপেল খেলে শক্তি বাড়ে দোস্ত! তুমি কি বলতে পারো— "মিথু, আমাকে একটা লাল আপেল দাও"?';
    hint = '🎯 মিশন: ২-৩ শব্দের বাক্য সম্প্রসারণ ও প্রয়োজন প্রকাশ';
  } else if (itemKey === 'mango') {
    speech = 'পাকা হলুদ আম তো দারুণ মিষ্টি! তুমি কি আম খেতে ভালোবাসো? বলো তো— "আমি আম খাবো"!';
    hint = '🎯 মিশন: ক্রিয়াপদ ও পছন্দ প্রকাশ';
  } else if (itemKey === 'banana') {
    speech = 'হলুদ মিষ্টি কলা! বানরও তো কলা খুব পছন্দ করে! তোমার কি একটা কলা লাগবে দোস্ত?';
    hint = '🎯 মিশন: প্রশ্ন করা ও উত্তর দেওয়া';
  } else if (itemKey === 'car') {
    speech = 'ভ্রম ভ্রম! লাল দ্রুত গাড়িটা রাস্তায় চলছে! গাড়িটা নিয়ে কি আমরা নানার বাড়ি যাব?';
    hint = "🎯 মিশন: 'গাড়ি' শব্দে 'ড়' ধ্বনি সঠিক উচ্চারণ অনুশীলন";
  } else if (itemKey === 'bird') {
    speech = 'টুই টুই! রঙিন পাখিটা ডানা মেলে আকাশে উড়ছে! পাখিটা কী সুন্দর না?';
    hint = "🎯 মিশন: 'পাখি' ও 'উড়ছে' শব্দ বলা";
  }

  document.getElementById('mitu-dialogue-text').innerText = `"${speech}"`;
  document.getElementById('balloon-quest-hint').innerText = hint;

  speakMituVoice(speech);
}

// Poke Mitu (Playful reaction)
function pokeMituCharacter() {
  playSound('giggle');
  const mitu = document.getElementById('mitu-character');
  mitu.style.transform = 'scale(1.15) translateY(-14px)';
  setTimeout(() => { mitu.style.transform = ''; }, 300);

  const rect = mitu.getBoundingClientRect();
  spawnStarShower(rect.left + rect.width / 2, rect.top + 80, 15);

  const giggles = [
    'হিহিহি! আমাকে সুড়সুড়ি দিচ্ছো কেন দোস্ত? চলো গল্প করি!',
    'আরে আরে! আমি তো একদম লাফিয়ে উঠলাম! তুমি অনেক চটপটে!',
    'তুমি আমার সেরা বন্ধু আরিয়ান! চলো একটা নতুন গল্প বলি!'
  ];
  const chosen = giggles[Math.floor(Math.random() * giggles.length)];
  document.getElementById('mitu-dialogue-text').innerText = `"${chosen}"`;
  speakMituVoice(chosen);
}

// Setup Arcade Mic
function setupArcadeMic() {
  const micBtn = document.getElementById('arcade-mic-btn');
  const label = document.getElementById('arcade-mic-label');

  micBtn.addEventListener('click', () => {
    if (!gameState.isRecording) {
      // Start recording simulation
      gameState.isRecording = true;
      playSound('mic-start');
      micBtn.classList.add('recording');
      label.innerText = 'মিথু শুনছে... 👂';

      setTimeout(() => {
        if (gameState.isRecording) {
          stopRecordingSimulation('আমাকে একটা লাল আপেল দাও');
        }
      }, 3500);
    } else {
      stopRecordingSimulation('আমাকে একটা লাল আপেল দাও');
    }
  });
}

function stopRecordingSimulation(text) {
  const micBtn = document.getElementById('arcade-mic-btn');
  const label = document.getElementById('arcade-mic-label');
  gameState.isRecording = false;
  micBtn.classList.remove('recording');
  label.innerText = 'কথা বলতে চাপো!';

  sendChildVoiceSimulation(text);
}

// Send child voice simulation & trigger game reactions + AI loop
function sendChildVoiceSimulation(text) {
  playSound('pop');

  const isShort = text.length <= 8;
  const hasRhoticError = text.includes('গাদি');
  const hasEmotion = text.includes('মন খারাপ') || text.includes('রাগ') || text.includes('খুশি');

  // 1. Update AI Telemetry HUD
  updateAiHudTelemetry(text, isShort, hasRhoticError, hasEmotion);

  // 2. Formulate Game Character Response
  setTimeout(() => {
    let response = '';
    let mood = 'খুশি 🥳';

    if (hasRhoticError) {
      response = 'বাহ! লাল রঙের গাড়িটা তো খুব দ্রুত ছুটে চলে! গাড়িটা চালিয়ে আমরা নানার বাড়ি যাব দোস্ত?';
      mood = 'খেলায় মডেলিং 🚗';
    } else if (isShort) {
      response = 'আম তো অনেক রসালো! তুমি কি আম্মুকে বলবে— "আম্মু, আমাকে একটা পাকা আম দাও"? বলো তো দেখি!';
      mood = 'উৎসাহিত করছে 🌟';
    } else if (hasEmotion) {
      response = 'আমি বুঝতে পারছি দোস্ত। মন খারাপ হলে আমরা দুজন একসাথে জোরে একটা লম্বা শ্বাস নেব, ঠিক আছে?';
      mood = 'সহানুভূতিশীল 🤗';
    } else {
      response = 'দারুণ বলেছো আরিয়ান! একদম বড়দের মতো স্পষ্ট সুন্দর বাক্য! এই নাও তোমার জন্য একটা সোনালী তারা!';
      mood = 'উল্লসিত 🎉';
      rewardPlayerStar();
    }

    document.getElementById('mitu-dialogue-text').innerText = `"${response}"`;
    document.getElementById('mitu-mood-bubble').querySelector('span').innerText = mood;

    speakMituVoice(response);
  }, 400);
}

// Reward Player Star (Star Burst Animation)
function rewardPlayerStar() {
  gameState.stars++;
  const starsEl = document.getElementById('hud-stars');
  if (starsEl) starsEl.innerText = gameState.stars;

  playSound('star-chime');

  const mitu = document.getElementById('mitu-character');
  const rect = mitu.getBoundingClientRect();
  spawnStarShower(rect.left + rect.width / 2, rect.top + 60, 35);

  showToast('⭐ লেভেল আপ! আরিয়ান নতুন একটি তারা অর্জন করেছে!');
}

// Voice synthesis & mouth talking
function speakMituVoice(text) {
  const avatar = document.getElementById('mitu-avatar');
  const mouthPath = document.getElementById('mouth-path');
  const mouthTalking = document.getElementById('mouth-talking');
  const wave = document.getElementById('game-voice-wave');

  if (avatar) avatar.classList.add('talking');
  if (mouthPath) mouthPath.style.display = 'none';
  if (mouthTalking) mouthTalking.style.display = 'block';
  if (wave) wave.classList.add('active');

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.95;
    utterance.pitch = 1.25;

    utterance.onend = () => stopMituSpeaking();
    utterance.onerror = () => stopMituSpeaking();

    window.speechSynthesis.speak(utterance);
  } else {
    setTimeout(stopMituSpeaking, 2800);
  }
}

function stopMituSpeaking() {
  const avatar = document.getElementById('mitu-avatar');
  const mouthPath = document.getElementById('mouth-path');
  const mouthTalking = document.getElementById('mouth-talking');
  const wave = document.getElementById('game-voice-wave');

  if (avatar) avatar.classList.remove('talking');
  if (mouthPath) mouthPath.style.display = 'block';
  if (mouthTalking) mouthTalking.style.display = 'none';
  if (wave) wave.classList.remove('active');
}

// Update AI HUD
function updateAiHudTelemetry(childText, isShort, hasRhoticError, hasEmotion) {
  const mluVal = document.getElementById('hud-mlu-val');
  const phonemeVal = document.getElementById('hud-target-phoneme');
  const strategyVal = document.getElementById('hud-strategy-val');
  const expText = document.getElementById('hud-explanation-text');

  if (isShort) {
    mluVal.innerText = '১.০ শব্দ';
    phonemeVal.innerText = 'স্বাভাবিক স্পষ্টতা';
    phonemeVal.className = 'val green';
    strategyVal.innerText = 'Expansion (বাক্য সম্প্রসারণ)';
    expText.innerText = 'শিশু সংক্ষিপ্ত ১-শব্দের উত্তর দিয়েছে। এআই কোনো ভুল না ধরে বাক্যের অংশটি জুড়ে দিয়ে ফিরিয়ে দিয়েছে।';
  } else if (hasRhoticError) {
    mluVal.innerText = '২.৫ শব্দ';
    phonemeVal.innerText = "‘ড়’ সাবস্টিটিউশন (/d/ for /ɽ/)";
    phonemeVal.className = 'val warning';
    strategyVal.innerText = 'Recasting (সঠিক রূপ মডেলিং)';
    expText.innerText = "শিশু 'গাড়ি' কে 'গাদি' বলেছে। এআই 'গাড়ি' শব্দটি স্বাভাবিক আলাপের মাঝে ফিরিয়ে দিয়ে সাবলীল করেছে।";
  } else {
    mluVal.innerText = '৩.৪ শব্দ';
    phonemeVal.innerText = 'সব ধ্বনি নির্ভুল (৯৬%)';
    phonemeVal.className = 'val green';
    strategyVal.innerText = 'Positive Reinforcement';
    expText.innerText = 'পূর্ণাঙ্গ অর্থপূর্ণ বাক্য! এআই গেম রিওয়ার্ড ও তারার মাধ্যমে আত্মবিশ্বাস বাড়াচ্ছে।';
  }
}

// Preset simulation shortcuts
function simulateSpeechPreset(type) {
  if (type === 'short_answer') {
    switchGameWorld('grocery');
    setTimeout(() => sendChildVoiceSimulation('আম'), 400);
  } else if (type === 'rhotic_mispronounce') {
    switchGameWorld('grocery');
    setTimeout(() => sendChildVoiceSimulation('গাদি করে বাড়ি যাব'), 400);
  } else if (type === 'hesitant_emotion') {
    switchGameWorld('emotions');
    setTimeout(() => sendChildVoiceSimulation('আমার অনেক মন খারাপ লাগে'), 400);
  } else if (type === 'complex_success') {
    switchGameWorld('grocery');
    setTimeout(() => sendChildVoiceSimulation('দোকানদার ভাই, আমাকে একটা লাল মিষ্টি আপেল দাও'), 400);
  }
}

// ============================================================================
// Top Game HUD Actions (Sound, Fullscreen, AI HUD, Parent Gateway)
// ============================================================================
function setupHUDButtons() {
  // Sound FX Toggle
  const sfxBtn = document.getElementById('sfx-toggle-btn');
  sfxBtn.addEventListener('click', () => {
    gameState.soundEffectsEnabled = !gameState.soundEffectsEnabled;
    sfxBtn.innerHTML = gameState.soundEffectsEnabled
      ? '<i data-lucide="volume-2"></i>'
      : '<i data-lucide="volume-x"></i>';
    if (window.lucide) window.lucide.createIcons();
    showToast(gameState.soundEffectsEnabled ? '🔊 গেম সাউন্ড অন' : '🔇 গেম সাউন্ড মিউট');
  });

  // Fullscreen Button
  const fsBtn = document.getElementById('fullscreen-btn');
  fsBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen error:', err);
      });
      fsBtn.innerHTML = '<i data-lucide="minimize"></i>';
    } else {
      document.exitFullscreen();
      fsBtn.innerHTML = '<i data-lucide="maximize"></i>';
    }
    if (window.lucide) window.lucide.createIcons();
  });

  // Live AI HUD Toggle
  const aiHudBtn = document.getElementById('hud-inspector-btn');
  const closeAiHudBtn = document.getElementById('close-ai-hud-btn');
  const aiHud = document.getElementById('floating-ai-hud');

  aiHudBtn.addEventListener('click', () => {
    playSound('pop');
    gameState.aiHudVisible = !gameState.aiHudVisible;
    aiHud.classList.toggle('hidden', !gameState.aiHudVisible);
  });

  closeAiHudBtn.addEventListener('click', () => {
    playSound('pop');
    gameState.aiHudVisible = false;
    aiHud.classList.add('hidden');
  });

  // Open Parent Gate Modal
  const openGateBtn = document.getElementById('open-parent-gate-btn');
  openGateBtn.addEventListener('click', () => {
    playSound('pop');
    document.getElementById('parent-gate-modal').style.display = 'flex';
  });
}

// Parent Gate PIN Verification
function closeParentGateModal() {
  playSound('pop');
  document.getElementById('parent-gate-modal').style.display = 'none';
}

function verifyParentGatePin(bypass = false) {
  playSound('pop');
  document.getElementById('parent-gate-modal').style.display = 'none';
  openParentDashboard();
}

function openParentDashboard() {
  const overlay = document.getElementById('parent-dashboard-overlay');
  overlay.style.display = 'flex';
  setTimeout(renderOrUpdateCharts, 120);
}

function closeParentDashboard() {
  playSound('pop');
  if (gameState.isSplitScreen) {
    toggleSplitScreenMode();
  }
  document.getElementById('parent-dashboard-overlay').style.display = 'none';
}

// Split Screen Mode for Investor Pitches / Presentations
function toggleSplitScreenMode() {
  playSound('pop');
  gameState.isSplitScreen = !gameState.isSplitScreen;
  document.body.classList.toggle('split-mode-active', gameState.isSplitScreen);

  const btnText = document.getElementById('split-btn-text');
  if (gameState.isSplitScreen) {
    btnText.innerText = 'ফুলস্ক্রিন ড্যাশবোর্ড';
    showToast('📺 স্প্লিট-স্ক্রিন মোড সক্রিয়: বামে গেম ও ডানে লাইভ ড্যাশবোর্ড');
  } else {
    btnText.innerText = 'স্প্লিট স্ক্রিন মোড (গেম + ড্যাশবোর্ড)';
  }

  setTimeout(renderOrUpdateCharts, 200);
}

// ============================================================================
// Clinical Charts & Export Integrations
// ============================================================================
let radarChartInstance = null;
let trendChartInstance = null;

function initDashboardCharts() {
  renderRadarChart();
  renderGrowthChart();
}

function renderOrUpdateCharts() {
  if (radarChartInstance) radarChartInstance.resize();
  if (trendChartInstance) trendChartInstance.resize();
}

function renderRadarChart() {
  const ctx = document.getElementById('developmentRadarChart');
  if (!ctx) return;

  radarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: [
        'উচ্চারণ ও ধ্বনি (Phonology)',
        'শব্দভাণ্ডার (Vocabulary)',
        'বাক্য গঠন ও MLU (Syntax)',
        'ব্যাকরণ ও ক্রিয়া (Grammar)',
        'মনোযোগ ও শ্রবণ (Listening)',
        'আবেগ ও সামাজিক (Social/Emotion)'
      ],
      datasets: [
        {
          label: 'আরিয়ান আহমেদ (বর্তমান স্কোর)',
          data: [69, 88, 78, 74, 85, 82],
          fill: true,
          backgroundColor: 'rgba(255, 107, 74, 0.25)',
          borderColor: '#FF6B4A',
          pointBackgroundColor: '#FF6B4A',
          pointBorderColor: '#fff',
          borderWidth: 2.5
        },
        {
          label: 'বয়সোপযোগী গড় বেঞ্চমার্ক (৪.৫ বছর)',
          data: [82, 80, 75, 75, 80, 75],
          fill: true,
          backgroundColor: 'rgba(148, 163, 184, 0.15)',
          borderColor: '#94A3B8',
          borderDash: [5, 5],
          pointBackgroundColor: '#94A3B8',
          borderWidth: 1.8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: '#E2E8F0' },
          grid: { color: '#F1F5F9' },
          suggestedMin: 30,
          suggestedMax: 100,
          ticks: { backdropColor: 'transparent', font: { size: 10 } },
          pointLabels: {
            font: { family: "'Baloo Da 2', sans-serif", size: 11, weight: '700' },
            color: '#334155'
          }
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}

function renderGrowthChart() {
  const ctx = document.getElementById('growthTrendChart');
  if (!ctx) return;

  trendChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['সপ্তাহ ১', 'সপ্তাহ ২', 'সপ্তাহ ৩', 'সপ্তাহ ৪', 'সপ্তাহ ৫', 'সপ্তাহ ৬', 'সপ্তাহ ৭', 'সপ্তাহ ৮'],
      datasets: [
        {
          label: 'MLU (গড় বাক্যের দৈর্ঘ্য - শব্দ)',
          data: [1.3, 1.4, 1.8, 2.1, 2.6, 2.9, 3.2, 3.4],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          tension: 0.35,
          fill: true,
          yAxisID: 'y'
        },
        {
          label: 'নতুন অর্জিত শব্দভাণ্ডার',
          data: [320, 345, 370, 395, 420, 448, 468, 485],
          borderColor: '#4F46E5',
          borderDash: [4, 4],
          tension: 0.35,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { color: '#F1F5F9' },
          ticks: { font: { family: "'Baloo Da 2', sans-serif", size: 11 } }
        },
        y: {
          type: 'linear',
          position: 'left',
          title: { display: true, text: 'MLU (শব্দ সংখ্যা)', font: { size: 11, weight: '700' } },
          min: 1.0,
          max: 4.5
        },
        y1: {
          type: 'linear',
          position: 'right',
          title: { display: true, text: 'মোট শব্দভাণ্ডার', font: { size: 11, weight: '700' } },
          grid: { drawOnChartArea: false },
          min: 250,
          max: 550
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { family: "'Baloo Da 2', sans-serif", size: 11, weight: '700' } }
        }
      }
    }
  });
}

function simulatePlayAcousticSample() {
  playSound('pop');
  showToast('🔊 অডিও নমুনা প্লে হচ্ছে: সেশন #৩ ("গাদি যাবো") ➔ সেশন #১৮ ("গাড়িতে উঠবো")');
}

function openTherapistShareModal() {
  playSound('pop');
  document.getElementById('clinical-modal').style.display = 'flex';
}

function closeTherapistShareModal() {
  playSound('pop');
  document.getElementById('clinical-modal').style.display = 'none';
}

function printClinicalReport() {
  openTherapistShareModal();
}

function filterSessionTranscript() {
  showToast('🔍 ফিল্টার করা হয়েছে: শুধুমাত্র ফনোলজিক্যাল ফ্ল্যাগড ডায়ালগ');
}

function exportFullTranscriptJSON() {
  const exportData = {
    patient: { name: 'Aryan Ahmed', ageYears: 4.67, assessedLanguage: 'Bangla (Bengali)', date: '2026-10-17' },
    metricsSummary: {
      mluScore: 3.4,
      targetPhonemes: { 'ɽ': { accuracy: 0.58, status: 'Substituted with /d/' }, 'r': { accuracy: 0.72 } },
      activeTurnsPercentage: 84
    }
  };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'FirstWord_AI_Clinical_Data_Aryan_Ahmed.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 ক্লিনিকাল ডেটাসেট ডাউনলোড সম্পন্ন হয়েছে (.JSON)');
}

function showToast(message) {
  const toast = document.getElementById('app-toast');
  const msg = document.getElementById('toast-msg');
  if (!toast || !msg) return;
  msg.innerText = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}
