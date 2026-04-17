/* ============================================================
   KEREKES ZSOMBOR PORTFOLIO — script.js
   ============================================================ */

// ── NAV SCROLL EFFECT ──────────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ── HAMBURGER / MOBILE NAV ─────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── SCROLL REVEAL ──────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// ── COUNTER ANIMATION ──────────────────────────────────────
function animateCounter(el) {
  const target  = parseInt(el.dataset.count, 10);
  const suffix  = el.dataset.suffix || '';
  const duration = 1200;
  const step    = 16;
  const steps   = Math.ceil(duration / step);
  let   current = 0;

  const timer = setInterval(() => {
    current++;
    const val = Math.round(target * current / steps);
    el.textContent = val + suffix;
    if (current >= steps) {
      el.textContent = target + suffix;
      clearInterval(timer);
    }
  }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.hero-stats, .about-stats-row').forEach(el => {
  counterObserver.observe(el);
});

// ── FORM HANDLING ──────────────────────────────────────────
const form    = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');
const error   = document.getElementById('formError');
const submitBtn = document.getElementById('contactSubmit');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (submitBtn) {
      submitBtn.textContent = 'Küldés...';
      submitBtn.disabled = true;
    }

    if (success) success.style.display = 'none';
    if (error)   error.style.display   = 'none';

    try {
      const data = new FormData(form);
      const res  = await fetch(form.action, {
        method: 'POST',
        body:   data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok || res.status === 200 || res.redirected) {
        if (success) success.style.display = 'block';
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      if (error) error.style.display = 'block';
    } finally {
      if (submitBtn) {
        submitBtn.textContent = 'Üzenet küldése →';
        submitBtn.disabled    = false;
      }
    }
  });
}

// ── BOOKING CARD INTERACTIVITY ─────────────────────────────
document.querySelectorAll('.bc-day.avail').forEach(day => {
  day.addEventListener('click', () => {
    document.querySelectorAll('.bc-day').forEach(d => {
      d.classList.remove('sel');
    });
    day.classList.add('sel');
  });
});

document.querySelectorAll('.bc-slot.free').forEach(slot => {
  slot.addEventListener('click', () => {
    document.querySelectorAll('.bc-slot').forEach(s => s.classList.remove('picked'));
    slot.classList.add('picked');
    const badge = slot.querySelector('.bc-slot-badge');
    if (badge) badge.textContent = 'Kiválasztva ✓';
  });
});
