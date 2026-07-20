
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── MOBILE MENU ─────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
  }

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('open', open);
  });

  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ─── REVEAL ON SCROLL ────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    revealEls.forEach(el => el.classList.add('in-view'));
  } else {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
  }

  /* ─── SCROLL-SPY NAV ──────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const spyObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  sections.forEach(sec => spyObs.observe(sec));

  /* ─── ANIMATED STAT COUNTERS ──────────────────────────────── */
  const statEls = document.querySelectorAll('.stat-num');

  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const isDecimal = String(target).includes('.');
    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1100;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => statObs.observe(el));

  /* ─── STICKY NAV: HIDE ON SCROLL DOWN, SHOW ON SCROLL UP ─── */
  const nav = document.getElementById('nav');
  let lastY = window.scrollY;
  let navTicking = false;

  function handleNavScroll() {
    const y = window.scrollY;
    if (y > 140 && y > lastY && !mobileMenu.classList.contains('open')) {
      nav.classList.add('nav-hidden');
    } else {
      nav.classList.remove('nav-hidden');
    }
    lastY = y;
    navTicking = false;
  }

  /* ─── BACK TO TOP ─────────────────────────────────────────── */
  const backToTop = document.getElementById('backToTop');

  function handleBackToTop() {
    backToTop.classList.toggle('visible', window.scrollY > 700);
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ─── SUBTLE HERO PARALLAX (desktop, motion allowed) ──────── */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  const canParallax = !reduceMotion && window.matchMedia('(min-width: 901px)').matches && parallaxEls.length;

  function handleParallax() {
    const y = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax);
      el.style.transform = `translateY(${y * speed}px)`;
    });
  }

  /* ─── SINGLE RAF-THROTTLED SCROLL LISTENER ────────────────── */
  let scheduled = false;
  function onScroll() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      handleNavScroll();
      handleBackToTop();
      if (canParallax) handleParallax();
      scheduled = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  handleBackToTop();

  /* ─── EMAIL LINKS: COPY-TO-CLIPBOARD FALLBACK ─────────────── */

  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    const email = link.getAttribute('href').replace('mailto:', '').split('?')[0];
    const originalHTML = link.innerHTML;

    link.addEventListener('click', () => {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(email).then(() => {
        link.innerHTML = link.classList.contains('btn-say-hello')
          ? 'Copied ✓ ' + email
          : 'Copied ✓';
        link.classList.add('copied');
        clearTimeout(link._copyTimeout);
        link._copyTimeout = setTimeout(() => {
          link.innerHTML = originalHTML;
          link.classList.remove('copied');
        }, 2000);
      }).catch(() => {});
    });
  });
})();
