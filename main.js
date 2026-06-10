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
  document.querySelectorAll('a, button, .btn-primary, .btn-ghost, input, select, textarea, .glass-card').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.style.width = '50px'; ring.style.height = '50px'; ring.style.borderColor = 'rgba(201,168,76,0.8)'; });
    el.addEventListener('mouseleave', () => { ring.style.width = '32px'; ring.style.height = '32px'; ring.style.borderColor = 'rgba(201,168,76,0.5)'; });
  });
}

// Starfield
const canvas = document.getElementById('starfield');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let stars = [];
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  function initStars() {
    stars = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2,
        a: Math.random(),
        speed: Math.random() * 0.003 + 0.001,
        twinkle: Math.random() * Math.PI * 2
      });
    }
  }
  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.twinkle += s.speed;
      const alpha = s.a * (0.5 + 0.5 * Math.sin(s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }
  resize();
  initStars();
  drawStars();
  window.addEventListener('resize', () => { resize(); initStars(); });
}

// Active nav link
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});
