document.addEventListener('DOMContentLoaded', () => {

  // ─── Theme Toggle with circle animation ───
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  const isInitiallyLight = saved === 'light';
  if (isInitiallyLight) {
    document.documentElement.setAttribute('data-theme', 'light');
    toggle.textContent = '\u2600';
  } else {
    toggle.textContent = '\u263E';
  }

  toggle.addEventListener('click', (e) => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const targetBg = isLight ? '#0a0a0f' : '#f8f9fc';

    const rect = toggle.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed;inset:0;z-index:9999;pointer-events:none;background:${targetBg};clip-path:circle(0 at ${cx}px ${cy}px)`;
    document.body.appendChild(overlay);
    overlay.offsetHeight;

    overlay.style.transition = 'clip-path .65s cubic-bezier(.65,0,.35,1)';
    overlay.style.clipPath = `circle(150% at ${cx}px ${cy}px)`;

    setTimeout(() => {
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        toggle.textContent = '\u263E';
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        toggle.textContent = '\u2600';
      }
    }, 580);

    setTimeout(() => overlay.remove(), 700);
  });

  // ─── Custom Cursor ───
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * .15;
    ringY += (mouseY - ringY) * .15;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width = '16px';
      dot.style.height = '16px';
      dot.style.background = '#ec4899';
      ring.style.width = '56px';
      ring.style.height = '56px';
      ring.style.borderColor = 'rgba(236,72,153,.5)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width = '8px';
      dot.style.height = '8px';
      dot.style.background = '#a855f7';
      ring.style.width = '40px';
      ring.style.height = '40px';
      ring.style.borderColor = 'rgba(168,85,247,.4)';
    });
  });

  // ─── Typing Effect ───
  const roles = [
    'Web Developer',
    'UI/UX App Designer',
    'Information Systems Graduate',
    'Problem Solver'
  ];
  let roleIdx = 0, charIdx = 0, isDeleting = false;
  const typedEl = document.getElementById('typedText');

  function typeLoop() {
    const current = roles[roleIdx];
    if (!isDeleting) {
      typedEl.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        setTimeout(() => { isDeleting = true; typeLoop(); }, 2000);
        return;
      }
      setTimeout(typeLoop, 80);
    } else {
      typedEl.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(typeLoop, 400);
        return;
      }
      setTimeout(typeLoop, 40);
    }
  }
  typeLoop();

  // ─── Particles ───
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseParticle = { x: -9999, y: -9999 };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.8 + .6;
      this.speedX = (Math.random() - .5) * .4;
      this.speedY = (Math.random() - .5) * .4;
      this.opacity = Math.random() * .4 + .1;
    }
    update() {
      const dx = mouseParticle.x - this.x;
      const dy = mouseParticle.y - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 200) {
        const force = (200 - dist) / 200 * .02;
        this.x -= dx * force;
        this.y -= dy * force;
        this.opacity = Math.min(this.opacity + .01, .8);
      } else {
        this.opacity = Math.max(this.opacity - .002, .1);
      }
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 85, 247, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  let frameSkip = 0;

  function drawConnections() {
    frameSkip = (frameSkip + 1) % 2;
    if (frameSkip !== 0) return;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(200, 220, 255, ${.02 * (1 - dist / 120)})`;
          ctx.lineWidth = .3;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  document.addEventListener('mousemove', e => {
    mouseParticle.x = e.clientX;
    mouseParticle.y = e.clientY;
  });
  document.addEventListener('mouseleave', () => {
    mouseParticle.x = -9999;
    mouseParticle.y = -9999;
  });

  // ─── Scroll Reveal ───
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-center');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: .15 });
  revealEls.forEach(el => observer.observe(el));

  // ─── Skill bars on scroll ───
  const skillBars = document.querySelectorAll('.skill-card .fill');
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const w = entry.target.getAttribute('data-width');
        setTimeout(() => { entry.target.style.width = w + '%'; }, 300);
      }
    });
  }, { threshold: .3 });
  skillBars.forEach(bar => barObserver.observe(bar));

  // ─── Tilt effect on cards ───
  document.querySelectorAll('.skill-card, .service-card, .info-item').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      card.style.transform =
        `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0)';
    });
  });

  // ─── Mobile Menu ───
  window.toggleMenu = function () {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('open');
  };
  document.querySelectorAll('#navMenu a').forEach(a => {
    a.addEventListener('click', () => document.getElementById('navMenu').classList.remove('open'));
  });

  // ─── Nav hide/show on scroll ───
  let lastScroll = 0;
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > lastScroll && current > 100) {
      nav.classList.add('nav-hidden');
    } else {
      nav.classList.remove('nav-hidden');
    }
    lastScroll = current;
  });

  function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // ─── Form ───
  document.getElementById('contactForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    data.append('_captcha', 'false');
    const btn = form.querySelector('button');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    try {
      const res = await fetch('https://formsubmit.co/ajax/samuelwondmnew21@gmail.com', {
        method: 'POST',
        body: data,
      });
      if (res.ok) {
        showToast("Thanks for reaching out! I'll get back to you soon.");
        form.reset();
      } else {
        showToast('Something went wrong. Please try again later.');
      }
    } catch {
      showToast('Something went wrong. Please try again later.');
    }
    btn.textContent = 'Send Message';
    btn.disabled = false;
  });

  // ─── Background Scroll Animation ───
  const bgCanvas = document.getElementById('bg-anim-canvas');
  if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d');
    const totalFrames = 299;
    const cache = {};
    let currentFrame = -1;
    let rafId = null;

    function resizeCanvas() {
      bgCanvas.width = window.innerWidth;
      bgCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function getFrameIndex() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      return Math.floor(Math.min(progress, 1) * (totalFrames - 1));
    }

    function preloadAdjacent(idx) {
      for (let i = -10; i <= 10; i++) {
        const target = idx + i;
        if (target >= 0 && target < totalFrames && !cache[target]) {
          const num = (target + 2).toString().padStart(3, '0');
          const img = new Image();
          img.onload = () => { cache[target] = img; };
          img.src = `Picturess/ezgif-frame-${num}.jpg`;
        }
      }
    }

    function loadAndDraw(idx) {
      if (idx === currentFrame) return;
      currentFrame = idx;
      if (cache[idx]) {
        drawImage(cache[idx]);
        preloadAdjacent(idx);
        return;
      }
      const num = (idx + 2).toString().padStart(3, '0');
      const img = new Image();
      img.onload = () => {
        if (currentFrame === idx) {
          img.decode().then(() => {
            cache[idx] = img;
            drawImage(img);
            preloadAdjacent(idx);
          }).catch(() => {
            cache[idx] = img;
            drawImage(img);
            preloadAdjacent(idx);
          });
        }
      };
      img.src = `Picturess/ezgif-frame-${num}.jpg`;
    }

    function drawImage(img) {
      ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      const cw = bgCanvas.width;
      const ch = bgCanvas.height;
      const srcAspect = iw / ih;
      const dstAspect = cw / ch;
      let sx, sy, sw, sh;
      if (srcAspect > dstAspect) {
        sw = ih * dstAspect;
        sh = ih;
        sx = (iw - sw) / 2;
        sy = 0;
      } else {
        sw = iw;
        sh = iw / dstAspect;
        sx = 0;
        sy = (ih - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    }

    function onScroll() {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        loadAndDraw(getFrameIndex());
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

});
