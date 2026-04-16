// ============================================
// KEREKES ZSOMBOR – SHARED JS
// ============================================

// ── NAVBAR ──
const navbar = document.getElementById('navbar');
const mobileBtn = document.getElementById('mobileBtn');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 20) navbar.classList.add('solid');
    else navbar.classList.remove('solid');
});

if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
}

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu a').forEach(a => {
    a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// ── ACTIVE NAV LINK ──
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
    }
});

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
    const ro = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                ro.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    reveals.forEach((el, i) => {
        el.style.transitionDelay = (i % 4) * 0.1 + 's';
        ro.observe(el);
    });
}

// ── ANIMATE STAGGER CHILDREN ──
document.querySelectorAll('.services-grid > *, .portfolio-grid > *, .hp-grid > *, .industries-grid > *').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.1) + 's';
    el.classList.add('reveal');
});
// re-observe new reveals
reveals.forEach && document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    const ro2 = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('visible'); ro2.unobserve(entry.target); }
        });
    }, { threshold: 0.08 });
    ro2.observe(el);
});

// ── CONTACT FORM ──
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        
        const btn = contactForm.querySelector('.form-submit');
        const originalText = btn.textContent;
        const formData = new FormData(contactForm);

        btn.textContent = 'Küldés folyamatban...';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        // Real submission to FormSubmit
        fetch(contactForm.action, {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                btn.textContent = '✓ Elküldve!';
                btn.style.opacity = '1';
                btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                document.getElementById('formSuccess').classList.add('show');
                contactForm.reset();
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                    document.getElementById('formSuccess').classList.remove('show');
                }, 5000);
            } else {
                throw new Error('Hiba történt');
            }
        })
        .catch(error => {
            btn.textContent = 'Hiba történt!';
            btn.style.background = '#ef4444';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        });
    });
}

// ── COUNTER ANIMATIONS ──
document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let start = 0; const dur = 1400;
                const t0 = performance.now();
                function run(t) {
                    const p = Math.min((t - t0) / dur, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    el.textContent = Math.floor(eased * target) + suffix;
                    if (p < 1) requestAnimationFrame(run);
                    else el.textContent = target + suffix;
                }
                requestAnimationFrame(run);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    obs.observe(el);
});
