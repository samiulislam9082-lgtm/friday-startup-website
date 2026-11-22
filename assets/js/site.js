(() => {
  document.documentElement.classList.add('js-ready');

  // 1. Mobile Menu Drawer Navigation
  const headers = document.querySelectorAll('[data-site-header]');
  const closeMenu = (header) => {
    const button = header.querySelector('.menu-toggle');
    if (!button) return;
    header.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Open navigation');
    document.body.style.overflow = '';
  };

  const closeAllMenus = () => headers.forEach(closeMenu);

  headers.forEach((header) => {
    const button = header.querySelector('.menu-toggle');
    const nav = header.querySelector('.site-nav');
    if (!button || !nav) return;

    button.addEventListener('click', () => {
      const open = !header.classList.contains('is-open');
      closeAllMenus();
      if (open) {
        header.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeMenu(header));
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const openHeader = [...headers].find((header) => header.classList.contains('is-open'));
      closeAllMenus();
      if (openHeader) openHeader.querySelector('.menu-toggle')?.focus();
    }
  });

  // 2. Scroll Reveal Animations
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('[data-word]').forEach((w) => w.classList.add('is-active'));
  } else {
    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach((el) => sectionObserver.observe(el));

    // Tagline word reveal on scroll
    const wordObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-active');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '-20% 0px -30% 0px', threshold: 0.05 });

    document.querySelectorAll('[data-word]').forEach((w) => wordObserver.observe(w));
  }

  // 3. News Filtering (on news.html)
  const filterBtns = document.querySelectorAll('.news-filter-btn');
  const newsCards = document.querySelectorAll('.news-card');

  if (filterBtns.length > 0 && newsCards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const category = btn.getAttribute('data-filter');

        newsCards.forEach((card) => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
            card.classList.add('is-visible');
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 4. Help Center Instant Search (on help/index.html)
  const helpSearch = document.getElementById('help-search-input');
  if (helpSearch) {
    const faqItems = document.querySelectorAll('.faq-item');
    const helpCategories = document.querySelectorAll('.help-category');

    helpSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      faqItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (!query || text.includes(query)) {
          item.style.display = 'block';
          if (query) item.setAttribute('open', 'true');
        } else {
          item.style.display = 'none';
          item.removeAttribute('open');
        }
      });

      // Show/hide category containers if all items inside are hidden
      helpCategories.forEach((cat) => {
        const visibleInCat = cat.querySelectorAll('.faq-item:not([style*="display: none"])');
        cat.style.display = (!query || visibleInCat.length > 0) ? 'grid' : 'none';
      });
    });
  }

  // 5. Smooth Scroll for Anchor Links with Header Offset
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#main') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  // 6. Premium motion: header state, scroll progress, spotlight, magnetic buttons
  const header = document.querySelector('[data-site-header]');
  const progress = document.querySelector('[data-scroll-progress]');
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.setProperty('--progress', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (finePointer) {
    document.querySelectorAll('.spotlight').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
    if (!reduceMotion) {
      document.querySelectorAll('.magnetic').forEach((el) => {
        el.addEventListener('pointermove', (e) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty('--tx', `${((e.clientX - r.left) / r.width - 0.5) * 10}px`);
          el.style.setProperty('--ty', `${((e.clientY - r.top) / r.height - 0.5) * 8}px`);
        });
        el.addEventListener('pointerleave', () => {
          el.style.setProperty('--tx', '0px');
          el.style.setProperty('--ty', '0px');
        });
      });
    }
  }

  // Steps progress line
  const steps = document.querySelector('[data-steps]');
  if (steps) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      steps.classList.add('is-visible');
    } else {
      new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { steps.classList.add('is-visible'); obs.disconnect(); }
        });
      }, { threshold: 0.3 }).observe(steps);
    }
  }

  // 7. Business Agents interactive orbit + tabs (auto-cycles until the visitor interacts)
  const agents = document.querySelector('[data-agents]');
  if (agents) {
    const tabs = [...agents.querySelectorAll('[data-agent-tab]')];
    const panels = [...agents.querySelectorAll('[data-agent-panel]')];
    const nodes = [...agents.querySelectorAll('[data-agent-node]')];
    const links = [...agents.querySelectorAll('[data-link]')];
    const CYCLE = 6000;
    let current = 0;
    let timer = null;
    let userPaused = false;
    let inView = false;

    panels.forEach((panel) => {
      const bar = document.createElement('span');
      bar.className = 'agent-progress';
      bar.setAttribute('aria-hidden', 'true');
      bar.style.setProperty('--cycle', `${CYCLE}ms`);
      panel.appendChild(bar);
    });

    const select = (index, focus = false) => {
      current = index;
      tabs.forEach((tab, i) => {
        const on = i === index;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        if (on && focus) tab.focus();
      });
      panels.forEach((panel, i) => {
        const on = i === index;
        panel.hidden = !on;
        panel.classList.toggle('is-active', on);
        const bar = panel.querySelector('.agent-progress');
        if (bar) {
          bar.classList.remove('is-running');
          if (on && !userPaused && !reduceMotion && inView) { void bar.offsetWidth; bar.classList.add('is-running'); }
        }
      });
      nodes.forEach((node, i) => node.classList.toggle('is-active', i === index));
      links.forEach((link, i) => link.classList.toggle('is-active', i === index));
    };

    const stop = () => { clearInterval(timer); timer = null; };
    const start = () => {
      stop();
      if (userPaused || reduceMotion || !inView) return;
      timer = setInterval(() => select((current + 1) % tabs.length), CYCLE);
      select(current);
    };
    const userSelect = (i, focus) => { userPaused = true; stop(); select(i, focus); };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => userSelect(i));
      tab.addEventListener('keydown', (e) => {
        const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        if (e.key in keys) {
          e.preventDefault();
          userSelect((i + keys[e.key] + tabs.length) % tabs.length, true);
        } else if (e.key === 'Home') { e.preventDefault(); userSelect(0, true); }
        else if (e.key === 'End') { e.preventDefault(); userSelect(tabs.length - 1, true); }
      });
    });
    nodes.forEach((node, i) => node.addEventListener('click', () => userSelect(i)));

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => { inView = entry.isIntersecting; inView ? start() : stop(); });
      }, { threshold: 0.35 }).observe(agents);
    }
    select(0);
  }

  // Glyph field: drifting monospace characters with a cursor spotlight
  (() => {
    const canvases = document.querySelectorAll('[data-glyph-field]');
    if (!canvases.length) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const CHARS = 'S$80X0S$S8X0';
    canvases.forEach((canvas) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const host = canvas.parentElement;
      let w = 0, h = 0, cols = 0, rows = 0, cells = [], dpr = 1, running = false, raf = 0;
      const size = () => (window.innerWidth < 760 ? 13 : 16);
      let mx = -9999, my = -9999;
      const build = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.clientWidth; h = canvas.clientHeight;
        canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const fs = size();
        cols = Math.ceil(w / (fs * 0.95)); rows = Math.ceil(h / (fs * 1.25));
        cells = [];
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            cells.push({
              ch: CHARS[(Math.random() * CHARS.length) | 0],
              base: Math.random() * 0.22 + 0.04,
              phase: Math.random() * Math.PI * 2,
              speed: 0.4 + Math.random() * 1.2,
              on: Math.random() > 0.35,
            });
          }
        }
      };
      const draw = (t) => {
        const fs = size();
        const cw = fs * 0.95, ch = fs * 1.25;
        ctx.clearRect(0, 0, w, h);
        ctx.font = `500 ${fs}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx.textBaseline = 'top';
        const time = t / 1000;
        const wave = (time * 60) % (h + 300) - 150;
        for (let i = 0; i < cells.length; i++) {
          const cell = cells[i];
          if (!cell.on) continue;
          const x = (i % cols) * cw, y = ((i / cols) | 0) * ch;
          let a = cell.base * (0.6 + 0.4 * Math.sin(time * cell.speed + cell.phase));
          const dy = Math.abs(y - wave);
          if (dy < 120) a += (1 - dy / 120) * 0.18;
          const dx = x - mx, dyy = y - my, d2 = dx * dx + dyy * dyy;
          if (d2 < 32000) a += (1 - d2 / 32000) * 0.55;
          if (a < 0.03) continue;
          ctx.fillStyle = `rgba(147, 197, 253, ${Math.min(a, 0.9).toFixed(3)})`;
          ctx.fillText(cell.ch, x, y);
          if (!reduce && Math.random() < 0.0009) cell.ch = CHARS[(Math.random() * CHARS.length) | 0];
        }
      };
      const loop = (t) => { draw(t); if (running) raf = requestAnimationFrame(loop); };
      build(); draw(0);
      window.addEventListener('resize', () => { build(); draw(performance.now()); });
      host.addEventListener('pointermove', (e) => {
        const r = canvas.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top;
        if (reduce) draw(performance.now());
      });
      host.addEventListener('pointerleave', () => { mx = my = -9999; if (reduce) draw(0); });
      if (reduce || !('IntersectionObserver' in window)) return;
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !running) { running = true; raf = requestAnimationFrame(loop); }
        else if (!entry.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
      }).observe(canvas);
    });
  })();

  // Workflow lead tags cycle, with a moving highlight
  (() => {
    const list = document.querySelector('.wf-leads');
    if (!list) return;
    const rows = [...list.querySelectorAll('.wf-lead')];
    const state = (txt) => (/hot/i.test(txt) ? 'hot' : /qualified/i.test(txt) ? 'qualified' : 'cold');
    rows.forEach((row) => { const tag = row.querySelector('.wf-tag'); tag.dataset.state = state(tag.textContent); tag.dataset.idx = '0'; });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let active = 1, timer = 0;
    const step = () => {
      rows[active].classList.remove('is-active');
      active = (active + 1) % rows.length;
      const row = rows[active];
      row.classList.add('is-active');
      const tag = row.querySelector('.wf-tag');
      const opts = tag.dataset.tags.split(',');
      const next = (Number(tag.dataset.idx) + 1) % opts.length;
      tag.classList.add('is-swapping');
      setTimeout(() => {
        tag.textContent = opts[next]; tag.dataset.idx = String(next); tag.dataset.state = state(opts[next]);
        tag.classList.remove('is-swapping');
      }, 250);
    };
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !timer) timer = setInterval(step, 1800);
      else if (!e.isIntersecting && timer) { clearInterval(timer); timer = 0; }
    }).observe(list);
  })();
})();
