(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  // ---------- Dock menu (mobile) ----------
  const dock = document.querySelector('[data-dock]');
  const menuBtn = dock && dock.querySelector('.dock__menu');
  const setMenu = (open) => {
    dock.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  if (menuBtn) {
    menuBtn.addEventListener('click', () => setMenu(!dock.classList.contains('is-open')));
    dock.querySelectorAll('.dock__nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
    document.addEventListener('click', (e) => { if (!dock.contains(e.target)) setMenu(false); });
  }

  // ---------- Current-section highlight ----------
  const navLinks = [...document.querySelectorAll('[data-nav]')];
  if (hasIO && navLinks.length) {
    const map = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navLinks.forEach((a) => a.classList.remove('is-current'));
        const link = map.get(en.target.id);
        if (link) link.classList.add('is-current');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  }

  // ---------- Reveal on scroll ----------
  const reveals = document.querySelectorAll('.reveal, [data-steps]');
  if (!hasIO || reduce) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach((el) => io.observe(el));
  }

  // ---------- Spotlight on service cards ----------
  document.querySelectorAll('.svc').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  // ---------- Glyph field ----------
  const CHARS = 'S$80XS$08X0S';
  document.querySelectorAll('[data-glyphs]').forEach((canvas) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const host = canvas.parentElement;
    let w = 0, h = 0, cols = 0, cells = [], running = false, raf = 0, mx = -9999, my = -9999;
    const fsize = () => (window.innerWidth < 640 ? 13 : 16);
    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const fs = fsize();
      cols = Math.ceil(w / (fs * 0.95));
      const rows = Math.ceil(h / (fs * 1.25));
      cells = Array.from({ length: cols * rows }, () => ({
        ch: CHARS[(Math.random() * CHARS.length) | 0],
        base: Math.random() * 0.2 + 0.04,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.2,
        on: Math.random() > 0.32,
      }));
    };
    const draw = (t) => {
      const fs = fsize(), cw = fs * 0.95, chh = fs * 1.25, time = t / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.font = `500 ${fs}px "Geist Mono", ui-monospace, Menlo, monospace`;
      ctx.textBaseline = 'top';
      const wave = (time * 70) % (h + 400) - 200;
      for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        if (!c.on) continue;
        const x = (i % cols) * cw, y = ((i / cols) | 0) * chh;
        let a = c.base * (0.6 + 0.4 * Math.sin(time * c.speed + c.phase));
        const dw = Math.abs(y - wave);
        if (dw < 140) a += (1 - dw / 140) * 0.16;
        const dx = x - mx, dy = y - my, d2 = dx * dx + dy * dy;
        if (d2 < 36000) a += (1 - d2 / 36000) * 0.6;
        if (a < 0.03) continue;
        ctx.fillStyle = `rgba(160, 196, 255, ${Math.min(a, 0.92).toFixed(3)})`;
        ctx.fillText(c.ch, x, y);
        if (!reduce && Math.random() < 0.0009) c.ch = CHARS[(Math.random() * CHARS.length) | 0];
      }
    };
    const loop = (t) => { draw(t); if (running) raf = requestAnimationFrame(loop); };
    build(); draw(0);
    let rt = 0;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { build(); draw(performance.now()); }, 120); });
    host.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top;
      if (reduce) draw(0);
    });
    host.addEventListener('pointerleave', () => { mx = my = -9999; if (reduce) draw(0); });
    if (reduce || !hasIO) return;
    new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !running) { running = true; raf = requestAnimationFrame(loop); }
      else if (!en.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
    }).observe(canvas);
  });

  // Helper: run an interval only while an element is on screen
  const whileVisible = (el, fn, ms) => {
    if (!el || reduce || !hasIO) return;
    let timer = 0;
    new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !timer) timer = setInterval(fn, ms);
      else if (!en.isIntersecting && timer) { clearInterval(timer); timer = 0; }
    }).observe(el);
  };

  // ---------- Lead tags ----------
  const leads = document.querySelector('[data-leads]');
  if (leads) {
    const rows = [...leads.querySelectorAll('.lead')];
    const state = (t) => (/hot/i.test(t) ? 'hot' : /qualified/i.test(t) ? 'qualified' : 'cold');
    rows.forEach((r) => { const tag = r.querySelector('.tag'); tag.dataset.state = state(tag.textContent); tag.dataset.idx = '0'; });
    let active = 1;
    whileVisible(leads, () => {
      rows[active].classList.remove('is-active');
      active = (active + 1) % rows.length;
      const row = rows[active];
      row.classList.add('is-active');
      const tag = row.querySelector('.tag');
      const opts = tag.dataset.tags.split(',');
      const next = (Number(tag.dataset.idx) + 1) % opts.length;
      tag.classList.add('is-swapping');
      setTimeout(() => {
        tag.textContent = opts[next]; tag.dataset.idx = String(next); tag.dataset.state = state(opts[next]);
        tag.classList.remove('is-swapping');
      }, 250);
    }, 1800);
  }

  // ---------- Website checklist ----------
  const checks = document.querySelector('[data-checks]');
  if (checks) {
    const items = [...checks.children];
    if (reduce) items.forEach((li) => li.classList.add('is-done'));
    let n = 0;
    whileVisible(checks, () => {
      if (n < items.length) { items[n].classList.add('is-done'); n++; }
      else { items.forEach((li) => li.classList.remove('is-done')); n = 0; }
    }, 1100);
  }
})();
