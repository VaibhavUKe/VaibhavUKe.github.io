/* ═══════════════════════════════════════════════════════════
   Vaibhav Uke — Portfolio Script
   ═══════════════════════════════════════════════════════════ */

/* ─── LENIS SMOOTH SCROLL ─────────────────────────────────── */
let lenis;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
  function rafLoop(time) { lenis.raf(time); requestAnimationFrame(rafLoop); }
  requestAnimationFrame(rafLoop);
}

/* ─── PAGE LOADER ─────────────────────────────────────────── */
const loader = document.getElementById('loader');

function hideLoader() {
  loader.classList.add('hide');
  triggerHeroAnimation();
}

if (document.readyState === 'complete') {
  setTimeout(hideLoader, 750);
} else {
  window.addEventListener('load', () => setTimeout(hideLoader, 750));
}

/* ─── SCROLL PROGRESS BAR ─────────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${max > 0 ? scrolled / max : 0})`;
}, { passive: true });

/* ─── CUSTOM CURSOR ───────────────────────────────────────── */
const isFinePointer = window.matchMedia('(pointer: fine)').matches;

if (isFinePointer) {
  const cDot = document.createElement('div');
  const cRing = document.createElement('div');
  cDot.className = 'c-dot';
  cRing.className = 'c-ring';
  document.body.append(cDot, cRing);

  let mx = -200, my = -200, rx = -200, ry = -200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cDot.style.left = mx + 'px';
    cDot.style.top  = my + 'px';
  }, { passive: true });

  // Lerp ring towards cursor
  function animateRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    cRing.style.left = rx + 'px';
    cRing.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state
  const hoverTargets = 'a, button, .proj-card, .about-card, .skill-item, .tl-card, .store-btn, .contact-item, .nav-logo';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => cRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cRing.classList.remove('hover'));
  });

  // Click state
  document.addEventListener('mousedown', () => {
    cDot.classList.add('click');
    cRing.classList.add('click');
  });
  document.addEventListener('mouseup', () => {
    cDot.classList.remove('click');
    cRing.classList.remove('click');
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    cDot.style.opacity = '0';
    cRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cDot.style.opacity = '1';
    cRing.style.opacity = '1';
  });
}

/* ─── HERO ENTRY ANIMATION ────────────────────────────────── */
function triggerHeroAnimation() {
  document.querySelectorAll('.hero-anim').forEach(el => {
    const delay = parseInt(el.dataset.delay, 10) || 0;
    setTimeout(() => el.classList.add('in'), delay);
  });
}

/* ─── NAV ─────────────────────────────────────────────────── */
const nav       = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ─── TYPEWRITER ──────────────────────────────────────────── */
const words = [
  'React Native apps.',
  'Android experiences.',
  'cross-platform magic.',
  'fintech solutions.',
  'AI-powered features.',
  'scalable mobile apps.',
];
const twEl = document.getElementById('typewriter');
let wi = 0, ci = 0, deleting = false;

function type() {
  const word = words[wi];
  if (!deleting) {
    twEl.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; return setTimeout(type, 1800); }
  } else {
    twEl.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; return setTimeout(type, 300); }
  }
  setTimeout(type, deleting ? 40 : 72);
}
// Delay start until hero has animated in
setTimeout(type, 1200);

/* ─── CANVAS GRID BACKGROUND ──────────────────────────────── */
const canvas = document.getElementById('gridCanvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let mouse = { x: -9999, y: -9999 };
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}, { passive: true });

const GRID = 48;
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cols = Math.ceil(canvas.width  / GRID) + 1;
  const rows = Math.ceil(canvas.height / GRID) + 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x    = c * GRID;
      const y    = r * GRID;
      const dist = Math.hypot(x - mouse.x, y - mouse.y);
      const alpha = Math.max(0, 0.14 - dist / 800);
      ctx.beginPath();
      ctx.arc(x, y, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(6,182,212,${alpha + 0.038})`;
      ctx.fill();
    }
  }
  requestAnimationFrame(drawGrid);
}
drawGrid();

/* ─── WORD-SPLIT FOR SECTION TITLES ───────────────────────── */
document.querySelectorAll('.sec-title').forEach(title => {
  const text  = title.textContent.trim();
  const parts = text.split(' ');
  title.innerHTML = parts.map(w =>
    `<span class="word-wrap"><span class="word-inner">${w}</span></span>`
  ).join(' ');

  const wordObs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.word-inner').forEach((span, i) => {
        setTimeout(() => span.classList.add('in'), i * 90);
      });
      wordObs.unobserve(entry.target);
    }
  }, { threshold: 0.6 });
  wordObs.observe(title);
});

/* ─── SCROLL REVEAL ───────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ─── STATS COUNTER ───────────────────────────────────────── */
function animateCount(el) {
  const target = parseFloat(el.dataset.to);
  const suffix = el.dataset.suffix || '';
  const isInt  = Number.isInteger(target);
  const dur    = 1600;
  const start  = performance.now();
  function fmt(v) {
    return (isInt ? Math.round(v) : v.toFixed(1)) + suffix;
  }
  function update(now) {
    const p     = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(target * eased);
    if (p < 1) requestAnimationFrame(update);
    else el.textContent = fmt(target);
  }
  requestAnimationFrame(update);
}

const statsEl  = document.querySelector('.hero-stats');
const statsObs = new IntersectionObserver(([e]) => {
  if (e.isIntersecting) {
    e.target.querySelectorAll('.count').forEach(animateCount);
    statsObs.unobserve(e.target);
  }
}, { threshold: 0.5 });
if (statsEl) statsObs.observe(statsEl);

/* ─── ACTIVE NAV LINK ON SCROLL ───────────────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAnchors.forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`)
  );
}, { passive: true });

/* ─── CARD HOVER TILT ─────────────────────────────────────── */
document.querySelectorAll('.proj-card').forEach(card => {
  card.style.transformStyle = 'preserve-3d';
  card.style.transition     = 'transform 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease';

  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─── MAGNETIC BUTTONS ────────────────────────────────────── */
document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * 0.28;
    const y = (e.clientY - r.top  - r.height / 2) * 0.28;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => { btn.style.transition = ''; }, 500);
  });
});

/* ─── ABOUT CARDS STAGGER ─────────────────────────────────── */
const aboutCards = document.querySelector('.about-cards');
if (aboutCards) {
  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.about-card').forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 100);
      });
      obs.unobserve(e.target);
    }
  }, { threshold: 0.2 });
  aboutCards.querySelectorAll('.about-card').forEach(c => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(20px)';
    c.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  obs.observe(aboutCards);
}

/* ─── SKILL GROUPS STAGGER ────────────────────────────────── */
const skillsGrid = document.querySelector('.skills-grid');
if (skillsGrid) {
  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-group').forEach((g, i) => {
        setTimeout(() => {
          g.style.opacity = '1';
          g.style.transform = 'translateY(0)';
        }, i * 70);
      });
      obs.unobserve(e.target);
    }
  }, { threshold: 0.1 });
  skillsGrid.querySelectorAll('.skill-group').forEach(g => {
    g.style.opacity = '0';
    g.style.transform = 'translateY(18px)';
    g.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  });
  obs.observe(skillsGrid);
}
