// ============================================================
// Bewerbungsportfolio — Interaktionen
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile-Navigation ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Portfolio-Akkordeon ---------- */
  document.querySelectorAll('.project-item').forEach(item => {
    const trigger = item.querySelector('.project-summary');
    const details = item.querySelector('.project-details-wrap');
    if (!trigger || !details) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      item.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ---------- Portfolio-Filter ---------- */
  const filterBar = document.querySelector('.filter-bar');
  if (filterBar) {
    const chips = filterBar.querySelectorAll('.filter-chip');
    const items = document.querySelectorAll('.project-item');

    filterBar.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;

      chips.forEach(c => c.classList.toggle('is-active', c === chip));
      const filter = chip.dataset.filter;

      items.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.hidden = !match;
        if (!match) item.classList.remove('is-open');
      });
    });
  }

  /* ---------- Skills: animierte Balken ---------- */
  const skillBars = document.querySelectorAll('.skill-bar');
  if (skillBars.length) {
    const animateBar = (bar) => {
      const fill = bar.querySelector('.skill-bar-fill');
      const percent = bar.dataset.percent || 0;
      if (fill) fill.style.width = percent + '%';
    };

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateBar(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      skillBars.forEach(bar => observer.observe(bar));
    } else {
      // Kein IntersectionObserver oder reduzierte Bewegung gewünscht: sofort anzeigen
      skillBars.forEach(animateBar);
    }
  }

  /* ---------- Karussell (Portfolio-Vorschau) ---------- */
  document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dotsWrap = carousel.querySelector('.carousel-dots');
    if (!track || slides.length <= 1) return;

    let index = 0;
    let timer = null;
    const delay = parseInt(carousel.dataset.autoplay, 10) || 3500;

    // Punkte erzeugen
    const dots = [];
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Bild ${i + 1} anzeigen`);
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => goTo(i, true));
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    function goTo(i, userTriggered) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle('is-active', di === index));
      if (userTriggered) restart();
    }

    function next() { goTo(index + 1, false); }

    function start() {
      if (prefersReducedMotion) return;
      timer = window.setInterval(next, delay);
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }
    function restart() { stop(); start(); }

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);

    const prevBtn = carousel.querySelector('.carousel-arrow--prev');
    const nextBtn = carousel.querySelector('.carousel-arrow--next');
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(index - 1, true));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(index + 1, true));

    start();
  });

});
