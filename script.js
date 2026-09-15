document.addEventListener('DOMContentLoaded', () => {

  // ─── Welcome Screen ───
  const welcomeScreen = document.getElementById('welcomeScreen');
  const welcomeClick = document.getElementById('welcomeClick');
  const pageContent = document.getElementById('pageContent');

  function dismissWelcome(e) {
    const x = e.clientX;
    const y = e.clientY;
    welcomeClick.style.pointerEvents = 'none';
    pageContent.style.clipPath = `circle(0% at ${x}px ${y}px)`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        pageContent.style.clipPath = `circle(150vw at ${x}px ${y}px)`;
        welcomeScreen.classList.add('fade-out');
        setTimeout(() => {
          pageContent.classList.add('revealed');
          pageContent.style.clipPath = '';
          pageContent.style.pointerEvents = 'auto';
        }, 1800);
        setTimeout(() => {
          welcomeScreen.style.display = 'none';
        }, 1200);
      });
    });
  }

  welcomeClick.addEventListener('click', dismissWelcome);

  // Fallback: dismiss after 5s even without click
  setTimeout(() => {
    if (!welcomeScreen.classList.contains('fade-out')) {
      pageContent.style.clipPath = `circle(0% at 50% 50%)`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          pageContent.style.clipPath = `circle(150vw at 50% 50%)`;
          welcomeScreen.classList.add('fade-out');
          setTimeout(() => {
            pageContent.classList.add('revealed');
            pageContent.style.clipPath = '';
            pageContent.style.pointerEvents = 'auto';
          }, 1800);
          setTimeout(() => {
            welcomeScreen.style.display = 'none';
          }, 1200);
        });
      });
    }
  }, 5000);

  // ─── Scroll Progress Bar ───
  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  });

  // ─── Back to Top Button ───
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── Smooth Scroll for Nav Links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── Active Nav Link Tracking ───
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#navMenu a');
  let activeId = '';
  function updateActiveNav() {
    const scrollY = window.scrollY + 200;
    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = section.getAttribute('id');
      }
    });
    if (currentId === activeId) return;
    activeId = currentId;
    navLinks.forEach(link => {
      if (link.getAttribute('href') === '#' + currentId) {
        link.style.color = 'var(--text)';
      } else {
        link.style.color = '';
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav);

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
      dot.style.width = '14px';
      dot.style.height = '14px';
      dot.style.background = '#999';
      ring.style.width = '50px';
      ring.style.height = '50px';
      ring.style.borderColor = 'rgba(153,153,153,.4)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width = '6px';
      dot.style.height = '6px';
      dot.style.background = '';
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = '';
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

  // ─── Scroll Reveal ───
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-center');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
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
    const btn = document.getElementById('hamburger');
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('active', isOpen);
  };
  document.querySelectorAll('#navMenu a').forEach(a => {
    a.addEventListener('click', () => {
      document.getElementById('navMenu').classList.remove('open');
      document.getElementById('hamburger').classList.remove('active');
    });
  });
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('navMenu');
    const btn = document.getElementById('hamburger');
    if (menu.classList.contains('open') && !menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.remove('open');
      btn.classList.remove('active');
    }
  });

  // ─── Nav hide/show on scroll ───
  let lastScroll = 0;
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > lastScroll && current > 100) {
      nav.classList.add('nav-hidden');
      const menu = document.getElementById('navMenu');
      if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        document.getElementById('hamburger').classList.remove('active');
      }
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

  // ─── Magnetic Button Hover ───
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * .2}px, ${y * .3}px) scale(1.02)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ─── Text Scramble on Section Titles ───
  const scrambleChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const sectionTitles = document.querySelectorAll('.section-title');

  function scrambleText(el) {
    const original = el.getAttribute('data-original-text') || el.textContent;
    el.setAttribute('data-original-text', original);
    const chars = original.split('');
    const scrambled = chars.map(() => scrambleChars[Math.floor(Math.random() * scrambleChars.length)]);
    el.textContent = scrambled.join('');
    el.classList.add('scrambling');

    let iteration = 0;
    const interval = setInterval(() => {
      el.textContent = chars.map((ch, i) => {
        if (i < iteration) return ch;
        return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
      }).join('');
      iteration += 1 / 2;
      if (iteration > chars.length) {
        clearInterval(interval);
        el.textContent = original;
        el.classList.remove('scrambling');
      }
    }, 35);
  }

  const titleObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('scrambled')) {
        entry.target.classList.add('scrambled');
        scrambleText(entry.target);
      }
    });
  }, { threshold: .5 });
  sectionTitles.forEach(t => titleObserver.observe(t));

  // ─── Glow Aura Mouse Tracking on Cards ───
  document.querySelectorAll('.skill-card, .service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100) + '%';
      const y = ((e.clientY - rect.top) / rect.height * 100) + '%';
      card.style.setProperty('--glow-x', x);
      card.style.setProperty('--glow-y', y);
    });
  });

  // ─── Background Scroll Animation ───
  const bgCanvas = document.getElementById('bg-anim-canvas');
  if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d');
    const totalFrames = 299;
    const cache = {};
    let currentFrame = -1;
    let rafId = null;
    let scrollTimeout = null;
    let isScrolling = false;
    let qualityAnimId = null;
    const SCROLL_QUALITY = 0.85;
    const QUALITY_FADE_MS = 300;

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
      const quality = isScrolling ? SCROLL_QUALITY : 1;
      if (cache[idx]) {
        drawImage(cache[idx], quality);
        preloadAdjacent(idx);
        return;
      }
      const num = (idx + 2).toString().padStart(3, '0');
      const img = new Image();
      img.onload = () => {
        if (currentFrame === idx) {
          img.decode().then(() => {
            cache[idx] = img;
            drawImage(img, quality);
            preloadAdjacent(idx);
          }).catch(() => {
            cache[idx] = img;
            drawImage(img, quality);
            preloadAdjacent(idx);
          });
        }
      };
      img.src = `Picturess/ezgif-frame-${num}.jpg`;
    }

    function drawImage(img, quality) {
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
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = quality >= 1 ? 'high' : 'medium';
      ctx.globalAlpha = quality;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
      ctx.globalAlpha = 1;
    }

    function onScroll() {
      if (!isScrolling) {
        isScrolling = true;
      }
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (qualityAnimId) cancelAnimationFrame(qualityAnimId);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        const img = cache[currentFrame];
        if (!img) return;
        const start = performance.now();
        function animate(now) {
          const elapsed = now - start;
          const t = Math.min(elapsed / QUALITY_FADE_MS, 1);
          const eased = t * t * (3 - 2 * t);
          const quality = SCROLL_QUALITY + (1 - SCROLL_QUALITY) * eased;
          drawImage(img, quality);
          if (t < 1) {
            qualityAnimId = requestAnimationFrame(animate);
          }
        }
        qualityAnimId = requestAnimationFrame(animate);
      }, 100);
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        loadAndDraw(getFrameIndex());
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    loadAndDraw(getFrameIndex());
  }

});
