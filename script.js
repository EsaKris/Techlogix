/* =========================================
   Techlogix eBus Services — Main Script
   ========================================= */

'use strict';

/* ── Copyright year ── */
const yrEl = document.getElementById('yr');
if (yrEl) yrEl.textContent = new Date().getFullYear();

/* ── Navbar: scroll state ── */
const nav = document.getElementById('nav');

function onScroll() {
  // Solid background after scrolling 40px
  nav.classList.toggle('scrolled', window.scrollY > 40);

  // Active link highlight
  const sections = document.querySelectorAll('section[id]');
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id);
      });
    }
  });

  // Back-to-top visibility
  const btt = document.getElementById('btt');
  if (btt) btt.classList.toggle('vis', window.scrollY > 500);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

/* ── Hamburger / mobile drawer ── */
const ham    = document.getElementById('ham');
const drawer = document.getElementById('drawer');

if (ham && drawer) {
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    drawer.classList.toggle('open');
    ham.setAttribute('aria-expanded', ham.classList.contains('open'));
  });

  // Close drawer when any link inside it is clicked
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('open');
      drawer.classList.remove('open');
      ham.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
    }
  });
});

/* ── Back-to-top button ── */
const bttBtn = document.getElementById('btt');
if (bttBtn) {
  bttBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Scroll-triggered fade-up animations ── */
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('vis');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

/* ── Toast notification helper ── */
function toast(msg, isError = false) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    t.setAttribute('role', 'alert');
    t.setAttribute('aria-live', 'polite');
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.borderLeftColor = isError ? '#e53e3e' : 'var(--orange)';
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 4000);
}

/* ── Trip search form ── */
const searchForm = document.getElementById('searchForm');
if (searchForm) {
  // Set minimum selectable date to today
  const dateInput = searchForm.querySelector('[name="date"]');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

  searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const from = searchForm.querySelector('[name="from"]').value;
    const to   = searchForm.querySelector('[name="to"]').value;
    const date = searchForm.querySelector('[name="date"]').value;
    const pax  = searchForm.querySelector('[name="passengers"]').value;

    if (!from || !to || !date) {
      toast('Please fill in all fields.', true);
      return;
    }
    if (from === to) {
      toast('Departure and destination cannot be the same.', true);
      return;
    }

    toast(`Searching trips: ${from} → ${to} (${pax} passenger${pax > 1 ? 's' : ''})…`);
    // TODO: Integrate booking API here
  });
}

/* ── Contact form ── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = contactForm.querySelector('.cf-submit');
    const orig = btn.innerHTML;

    btn.innerHTML = 'Sending…';
    btn.disabled  = true;

    setTimeout(() => {
      contactForm.reset();
      btn.innerHTML = orig;
      btn.disabled  = false;
      toast("Message sent! We'll get back to you shortly ✓");
    }, 1800);
  });
}

/* ── Route "Book Now" buttons ── */
document.querySelectorAll('[data-route]').forEach(btn => {
  btn.addEventListener('click', () => {
    const heroSection = document.querySelector('#hero');
    if (heroSection) {
      window.scrollTo({ top: heroSection.offsetTop - 70, behavior: 'smooth' });
    }
    setTimeout(() => toast(`Book ${btn.dataset.route} — Select your date above`), 600);
  });
});
