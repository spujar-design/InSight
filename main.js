// Custom cursor
const cursor = document.querySelector('.cursor');
const ring = document.querySelector('.cursor-ring');
if (cursor && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`; });
  function animateRing() {
    rx += (mx - rx - 16) * 0.12;
    ry += (my - ry - 16) * 0.12;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();
  document.querySelectorAll('a, button, .btn-primary, .btn-ghost, .btn-glow, input, select, textarea, .glass-card, .feature-card, .feat, .sign-tile, .testimonial, .testi-card').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.style.width = '50px'; ring.style.height = '50px'; ring.style.borderColor = 'rgba(201,168,76,0.8)'; });
    el.addEventListener('mouseleave', () => { ring.style.width = '32px'; ring.style.height = '32px'; ring.style.borderColor = 'rgba(201,168,76,0.5)'; });
  });
}

// Starfield — denser, with slow drift + parallax on scroll
const canvas = document.getElementById('starfield');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let stars = [];
  let scrollOffset = 0;

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }

  function initStars() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 4500); // density scales with screen size
    for (let i = 0; i < count; i++) {
      const layer = Math.random();
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 2, // extra height for parallax scroll
        r: layer < 0.6 ? Math.random() * 1.1 + 0.3 : Math.random() * 2 + 1,
        a: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.004 + 0.0008,
        twinkle: Math.random() * Math.PI * 2,
        depth: layer < 0.6 ? 0.15 : 0.4, // parallax depth
        drift: (Math.random() - 0.5) * 0.02,
        color: Math.random() < 0.15 ? '0,212,180' : Math.random() < 0.3 ? '180,160,255' : '201,168,76'
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.twinkle += s.speed;
      s.x += s.drift;
      if (s.x > canvas.width) s.x = 0;
      if (s.x < 0) s.x = canvas.width;

      const parallaxY = (s.y - scrollOffset * s.depth) % (canvas.height * 2);
      const drawY = parallaxY < 0 ? parallaxY + canvas.height * 2 : parallaxY;

      if (drawY > canvas.height + 10) return;

      const alpha = s.a * (0.4 + 0.6 * Math.sin(s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x, drawY, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color},${alpha})`;
      ctx.fill();

      // glow for larger stars
      if (s.r > 1.3) {
        ctx.beginPath();
        ctx.arc(s.x, drawY, s.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},${alpha * 0.08})`;
        ctx.fill();
      }
    });
    requestAnimationFrame(drawStars);
  }

  resize();
  initStars();
  drawStars();
  window.addEventListener('resize', () => { resize(); initStars(); });
  window.addEventListener('scroll', () => { scrollOffset = window.scrollY; }, { passive: true });
}

// Floating ambient orbs across the whole page
function createAmbientOrbs() {
  if (document.querySelector('.ambient-orbs-layer')) return;
  const layer = document.createElement('div');
  layer.className = 'ambient-orbs-layer';
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;';

  const orbConfigs = [
    { color: '120,60,200', size: 500, top: '5%', left: '70%', dur: '26s' },
    { color: '201,168,76', size: 420, top: '55%', left: '5%', dur: '32s' },
    { color: '0,212,180', size: 380, top: '80%', left: '60%', dur: '24s' },
    { color: '201,168,76', size: 320, top: '30%', left: '40%', dur: '38s' }
  ];

  orbConfigs.forEach((cfg, i) => {
    const orb = document.createElement('div');
    orb.style.cssText = `
      position:absolute;
      width:${cfg.size}px; height:${cfg.size}px;
      top:${cfg.top}; left:${cfg.left};
      background: radial-gradient(circle, rgba(${cfg.color},0.16) 0%, transparent 70%);
      border-radius:50%;
      animation: ambientOrbFloat${i % 2} ${cfg.dur} ease-in-out infinite;
      animation-delay: ${i * 2}s;
    `;
    layer.appendChild(orb);
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes ambientOrbFloat0 {
      0%, 100% { transform: translate(0,0) scale(1); }
      33% { transform: translate(-80px, 60px) scale(1.15); }
      66% { transform: translate(60px, -40px) scale(0.9); }
    }
    @keyframes ambientOrbFloat1 {
      0%, 100% { transform: translate(0,0) scale(1); }
      33% { transform: translate(70px, -50px) scale(1.1); }
      66% { transform: translate(-50px, 70px) scale(0.95); }
    }
  `;
  document.head.appendChild(style);
  document.body.insertBefore(layer, document.body.firstChild);
}
createAmbientOrbs();

// Scroll reveal animations — fade/slide elements in as they enter viewport
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.feature-card, .feat, .glass-card, .testimonial, .testi-card, .how-step, .step, .sign-tile, .value-card, .team-card, .blog-card, .blog-featured, .blog-side-item, .compat-section, .result-section, .terms-section, .preview-card, .mission-inner, .newsletter, .cta-banner, .final-cta'
  );

  if (!targets.length) return;

  targets.forEach(el => {
    if (!el.style.opacity && !el.classList.contains('fade-up')) {
      el.classList.add('scroll-reveal');
    }
  });

  const style = document.createElement('style');
  style.textContent = `
    .scroll-reveal {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
    }
    .scroll-reveal.revealed {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = (i % 6) * 80;
        setTimeout(() => el.classList.add('revealed'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}
initScrollReveal();

// Subtle parallax on hero glow / orbit rings based on mouse position
function initHeroParallax() {
  const heroGlow = document.querySelector('.hero-glow');
  const orbitRing = document.querySelector('.orbit-ring');
  const orbitRing2 = document.querySelector('.orbit-ring-2');
  if (!heroGlow && !orbitRing) return;

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    if (heroGlow) heroGlow.style.transform = `translate(${x * 15}px, ${y * 15}px)`;
    if (orbitRing) orbitRing.style.marginLeft = `${-350 + x * 10}px`;
    if (orbitRing2) orbitRing2.style.marginLeft = `${-260 - x * 8}px`;
  });
}
initHeroParallax();

// Nav bar subtle background change on scroll
function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.style.background = 'rgba(3,2,10,0.92)';
      nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.3)';
    } else {
      nav.style.background = 'rgba(3,2,10,0.7)';
      nav.style.boxShadow = 'none';
    }
  }, { passive: true });
}
initNavScroll();

// Active nav link
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});
