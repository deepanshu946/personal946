(function () {
  'use strict';

  /* ── Hero Typewriter ───────────────────────────────────── */
  window.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.getElementById('hero-title');
    if (!heroTitle) return;

    // Preserve the span/em markup so FIVE keeps its styling.
    const originalHTML = heroTitle.innerHTML;
    heroTitle.style.visibility = 'hidden';

    setTimeout(() => {
      heroTitle.innerHTML = originalHTML;
      heroTitle.style.visibility = 'visible';
      heroTitle.classList.add('typing-finished');
    }, 700);
  });

  /* ─── CONFIG — Edit these ─────────────────────────────────────── */
  // Set to your actual relationship start date (year, month-1, day)
  const START_DATE = new Date(2026, 0, 27 , 6 , 19); // 2026-01-26
  // Load memories from hidden HTML instead of storing them in JavaScript.
  const memories = Array.from(
    document.querySelectorAll('#memory-data .memory-item')
  ).map(item => ({
    image: item.dataset.image,
    caption: item.dataset.caption
  }));
  const REASONS = [
    { emoji: '😂', text: "Because you're the only who makes me laugh even on my worst days. "},
    { emoji: '👀', text: "Because the first eyes i ever got lost in were yours.. and they'll be the last."},
    { emoji: '❤️', text: "Because my heart feels full and happy the day i made you mine. " },
    { emoji: '🫂', text: "Because seeing you smile has been my dream since childhood and now i get to be the reason behind it. " },
    { emoji: '✨', text: "Because loving you feels less like a decision or burden and more like destiny. " },
    { emoji: '💌', text: "Because you turned a boy with a silent crush into a man who is now not sfraid to love you loudly." },
    { emoji: '🌙', text: "Because since you I can not imagine my future without your name written all over it." },
    { emoji: '∞', text: "Because you and I were connected long before we realised it. " },
  ];
  const img=document.getElementById("memory-image");
  const cap=document.getElementById("memory-caption");

  let current=0;

  function updateMemory() {
    if (!memories.length) return;

    img.src = memories[current].image;
    cap.textContent = memories[current].caption;
  }

  // Show the first memory on page load.
  updateMemory();

  document.getElementById("next-memory").onclick=()=>{

      current=(current+1)%memories.length;

      updateMemory();

  }

  document.getElementById("prev-memory").onclick=()=>{

      current=(current-1+memories.length)%memories.length;

      updateMemory();

  }

  /* ── Hidden Kiss Memories ── */
  const kisses = Array.from(document.querySelectorAll('.kiss-memory'));
  const popup = document.getElementById('memory-popup');
  const popupCard = popup?.querySelector('.memory-popup-card');
  const popupImg = document.getElementById('popup-memory-image');
  const popupBackdrop = popup?.querySelector('.memory-popup-backdrop');
  let popupTimer = null;

  function closeMemoryPopup() {
    if (!popup) return;
    clearTimeout(popupTimer);
    popup.classList.remove('show');
    setTimeout(() => {
      popup.classList.add('hidden');
      popupImg.src = '';
    }, 350);
  }

  function spawnFloatingHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'flying-heart';
    heart.textContent = '❤️';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1800);
  }

  kisses.forEach(kiss => {
    kiss.addEventListener('click', () => {
      if (!popup || !popupCard || !popupImg) return;
      const rect = kiss.getBoundingClientRect();
      popupImg.src = kiss.dataset.image;
      popup.classList.remove('hidden');
      popupCard.style.transformOrigin = `${rect.left + rect.width/2}px ${rect.top + rect.height/2}px`;
      requestAnimationFrame(() => popup.classList.add('show'));
      spawnFloatingHeart(rect.left + rect.width/2, rect.top + rect.height/2);
      clearTimeout(popupTimer);
      popupTimer = setTimeout(closeMemoryPopup, 4000);
    });
  });

  popup?.addEventListener('mousedown', (e) => {
    if (e.target === popup || e.target.classList.contains('memory-popup-backdrop')) {
      closeMemoryPopup();
    }
  });

  popupCard?.addEventListener('mousedown', (e) => {
    e.stopPropagation();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && popup && popup.classList.contains('show')) {
      closeMemoryPopup();
    }
  });

  /* ── Cursor Trail ───────────────────────────────────────── */
  const cursorTrail = document.getElementById('cursor-trail');
  const PARTICLES = ['❤️','✨','🌸'];
  let lastSpawn = 0;

  document.addEventListener('mousemove', (e) => {
    const now = performance.now();
    if (now - lastSpawn < 35) return;
    lastSpawn = now;

    if (!cursorTrail) return;

    const particle = document.createElement('span');
    particle.className = 'cursor-particle';

    const symbol = PARTICLES[Math.floor(Math.random() * PARTICLES.length)];
    particle.textContent = symbol;

    if (symbol === '❤️') particle.classList.add('heart');
    else if (symbol === '✨') particle.classList.add('sparkle');
    else particle.classList.add('flower');

    particle.style.left = e.clientX + 'px';
    particle.style.top = e.clientY + 'px';
    particle.style.setProperty('--x', (Math.random() * 30 - 15) + 'px');
    particle.style.setProperty('--y', (-35 - Math.random() * 30) + 'px');
    particle.style.setProperty('--r', (Math.random() * 80 - 40) + 'deg');

    cursorTrail.appendChild(particle);

    particle.addEventListener('animationend', () => particle.remove());
  });

  document.querySelectorAll('button, .month-card, .kiss-memory, .collectible').forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.animate([
        { transform: 'translateY(0px) scale(1)' },
        { transform: 'translateY(-3px) scale(1.03)' },
        { transform: 'translateY(0px) scale(1)' }
      ], {
        duration: 350,
        easing: 'ease-out'
      });
    });
  });

  /* ── Hanging Polaroid Mouse Tilt ───────────────────────── */
  document.querySelectorAll('.hanging-photo').forEach(photo => {
    const card = photo.querySelector('.polaroid-frame');
    if (!card) return;

    photo.addEventListener('mousemove', (e) => {
      const rect = photo.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const percentX = (x / rect.width - 0.5) * 2;
      const percentY = (y / rect.height - 0.5) * 2;

      const rotateY = percentX * 5;
      const rotateX = -percentY * 3;

      const baseRotation = photo.classList.contains('left-photo') ? -5 : 5;

      card.style.transform = `perspective(900px) rotateZ(${baseRotation}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });

    photo.addEventListener('mouseleave', () => {
      const baseRotation = photo.classList.contains('left-photo') ? -5 : 5;
      card.style.transform = `perspective(900px) rotateZ(${baseRotation}deg) rotateX(0deg) rotateY(0deg) scale(1)`;
    });
  });
  /* ─────────────────────────────────────────────────────────────── */

  /* ── Floating petals ── */
  const PETAL_CHARS = ['🌸', '🌹', '🌷', '💮', '🪷', '❀', '✿', '❤', '♥', '♡'];
  function spawnPetals() {
    const container = document.getElementById('petals-bg');
    const count = Math.min(30, Math.floor(window.innerWidth / 40));
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'petal';
      el.textContent = PETAL_CHARS[Math.floor(Math.random() * PETAL_CHARS.length)];
      el.style.left = Math.random() * 100 + '%';
      el.style.top = (Math.random() * 120 - 20) + '%';
      el.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
      el.style.opacity = (0.15 + Math.random() * 0.35).toFixed(2);
      const dur = (8 + Math.random() * 12).toFixed(1);
      const delay = (Math.random() * -15).toFixed(1);
      el.style.animationDuration = dur + 's';
      el.style.animationDelay = delay + 's';
      container.appendChild(el);
    }
  }
  spawnPetals();

  /* ── Live timer ── */
  const tDays  = document.getElementById('t-days');
  const tHours = document.getElementById('t-hours');
  const tMins  = document.getElementById('t-mins');
  const tSecs  = document.getElementById('t-secs');

  function pad(n, len = 2) { return String(n).padStart(len, '0'); }

  function updateTimer() {
    const now  = new Date();
    let diff   = Math.max(0, now - START_DATE);
    const days = Math.floor(diff / 864e5); diff -= days * 864e5;
    const hrs  = Math.floor(diff / 36e5);  diff -= hrs  * 36e5;
    const mins = Math.floor(diff / 6e4);   diff -= mins * 6e4;
    const secs = Math.floor(diff / 1e3);

    tDays.textContent  = pad(days, 3);
    tHours.textContent = pad(hrs);
    tMins.textContent  = pad(mins);
    tSecs.textContent  = pad(secs);
  }
  updateTimer();
  setInterval(updateTimer, 1000);

  /* ── Show timeline ── */
  const showBtn    = document.getElementById('show-timeline');
  const timelineEl = document.getElementById('timeline');

  showBtn.addEventListener('click', () => {
    timelineEl.classList.remove('hidden');
    setTimeout(() => timelineEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    showBtn.textContent = 'Journey Unlocked ❤️';
    showBtn.disabled = true;
  });

  /* ── Reasons grid ── */
  const reasonsGrid = document.getElementById('reasons-grid');
  REASONS.forEach(r => {
    const card = document.createElement('div');
    card.className = 'reason-card';
    card.innerHTML = `<span class="reason-emoji">${r.emoji}</span><p class="reason-text">${r.text}</p>`;
    reasonsGrid.appendChild(card);
  });

  /* ── Hints & hidden letter ── */
  const collectibles = Array.from(document.querySelectorAll('.collectible')); 
  const hpEls     = Array.from(document.querySelectorAll('.hp'));
  const modal     = document.getElementById('letter-modal');
  const closeBtn  = document.getElementById('close-modal');
  const backdrop  = document.getElementById('modal-backdrop');
  let   found     = 0;
  let   lastFocus = null;

  function fillHeart(idx) {
    if (hpEls[idx]) {
      hpEls[idx].textContent = '❤';
      hpEls[idx].classList.add('filled');
    }
  }

  function openModal() {
    lastFocus = document.activeElement;
    modal.classList.remove('hidden');
    closeBtn.focus();
    launchConfetti();
  }

  function closeModal() {
    modal.classList.add('hidden');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }
collectibles.forEach((item, i) => {

  function activate() {

    if (item.classList.contains('found')) return;

    item.classList.add('found');

    found++;
    fillHeart(i);

    item.animate(
      [
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(1.5)', opacity: 1 },
        { transform: 'scale(0)', opacity: 0 }
      ],
      {
        duration: 600,
        easing: 'ease-out',
        fill: 'forwards'
      }
    );

    setTimeout(() => {
      item.remove();
    }, 600);

    if (found === collectibles.length) {
      setTimeout(openModal, 700);
    }
  }

  item.addEventListener('click', activate);

});

  closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });

  /* ── Confetti ── */
  const CONFETTI_CHARS = ['❤️', '🌸', '💕', '✨', '🌹', '💖', '🌷', '💗', '🥰', '💝'];
  function launchConfetti() {
    const container = document.getElementById('confetti');
    const count = 50;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.textContent = CONFETTI_CHARS[Math.floor(Math.random() * CONFETTI_CHARS.length)];
      el.style.left   = (10 + Math.random() * 80) + '%';
      el.style.top    = '-40px';
      el.style.fontSize = (0.9 + Math.random() * 1.1) + 'rem';
      el.style.animationDuration = (2.5 + Math.random() * 1.5) + 's';
      el.style.animationDelay   = (Math.random() * 1.2) + 's';
      container.appendChild(el);
      setTimeout(() => el.remove(), 5000);
    }
  }

  /* ── Respawn petals occasionally ── */
  setInterval(() => {
    const container = document.getElementById('petals-bg');
    if (container.children.length < 25) spawnPetals();
  }, 15000);

})();
