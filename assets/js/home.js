(() => {
  const doc = document.documentElement;
  doc.classList.add('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Hero entrance
  requestAnimationFrame(() => requestAnimationFrame(() => $('.hero') && $('.hero').classList.add('is-ready')));

  // ---------- Header ----------
  const top = $('[data-top]');
  const onScroll = () => top && top.classList.toggle('is-stuck', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const menu = $('.top__menu');
  const setMenu = (open) => {
    top.classList.toggle('is-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.textContent = open ? 'Close' : 'Menu';
  };
  if (menu) {
    menu.addEventListener('click', () => setMenu(!top.classList.contains('is-open')));
    $$('.top__nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && top.classList.contains('is-open')) { setMenu(false); menu.focus(); } });
  }

  // Current section underline
  const links = $$('.top__nav a[href^="#"]');
  if (hasIO) {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    links.forEach((a) => { const el = $(a.getAttribute('href')); if (el) io.observe(el); });
  }

  // Local clock in the header, and today's date on the masthead
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const clock = $('[data-clock]');
  const tick = () => {
    const d = new Date();
    const t = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const day = d.getDay();
    const note = day === 5 ? 'it’s Friday, agents on duty' : day === 0 || day === 6 ? 'agents on duty all weekend' : 'agents on duty';
    if (clock) clock.textContent = `${days[day].slice(0, 3)} ${t} · ${note}`;
  };
  tick(); setInterval(tick, 30000);
  const today = $('[data-today]');
  if (today) today.textContent = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  // ---------- Reveal ----------
  $$('.index li, .paper article, .fridays li, details, .contact__grid > *').forEach((el, i, arr) => {
    el.classList.add('rv');
    const sib = [...el.parentElement.children].indexOf(el);
    el.style.setProperty('--i', String(sib));
  });
  const revealables = $$('.split, .rv');
  if (!hasIO || reduce) revealables.forEach((el) => el.classList.add('is-in'));
  else {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (!en.isIntersecting) return;
      const t = en.target._rv || en.target;
      t.classList.add('is-in'); io.unobserve(en.target);
    }), { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
    // clip-path hides .split from IntersectionObserver, so watch its parent instead
    revealables.forEach((el) => {
      const w = el.classList.contains('split') ? el.parentElement : el;
      if (w !== el) w._rv = el;
      io.observe(w);
    });
  }

  // ---------- Week board ----------
  const board = $('[data-board]');
  if (board) {
    const tasks = $$('.task', board);
    const dayEls = $$('.board__day', board);
    const nowLine = $('.board__now', board);
    const counter = $('[data-done]', board);
    const total = tasks.length;
    const setProgress = (p) => {
      // p: 0..4 across Mon-Thu, 4 = start of Friday
      let done = 0;
      tasks.forEach((t) => { const on = p > Number(t.dataset.day) + 0.55; t.classList.toggle('is-done', on); if (on) done++; });
      if (counter) counter.textContent = String(done);
      const i = Math.min(Math.floor(p), 3);
      const a = dayEls[i], b = dayEls[i + 1];
      const x = a.offsetLeft + (b.offsetLeft - a.offsetLeft) * Math.min(p - i, 1);
      nowLine.style.setProperty('--x', `${x}px`);
      board.classList.toggle('is-friday', p >= 4);
    };
    if (reduce) { setProgress(4); }
    else {
      const RUN = 9000, HOLD = 2800, GAP = 700, CYCLE = RUN + HOLD + GAP;
      let start = 0, raf = 0, running = false;
      const loop = (now) => {
        if (!start) start = now;
        const t = (now - start) % CYCLE;
        if (t < RUN) { board.classList.add('is-running'); setProgress((t / RUN) * 4); }
        else if (t < RUN + HOLD) { setProgress(4); }
        else { board.classList.remove('is-running'); setProgress(0); }
        if (running) raf = requestAnimationFrame(loop);
      };
      setProgress(0);
      if (hasIO) new IntersectionObserver(([en]) => {
        if (en.isIntersecting && !running) { running = true; raf = requestAnimationFrame(loop); }
        else if (!en.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
      }).observe(board);
      else setProgress(4);
    }
  }

  // ---------- Agent roster + log ----------
  const LOGS = {
    mkt: { name: 'Marketing Agent', color: 'var(--c-mkt)', lines: [
      ['08:02', 'Drafted this week’s newsletter from your latest offers'],
      ['09:15', 'Scheduled blog post “Five questions to ask before you hire”'],
      ['11:40', 'Offer email ready for 2,400 subscribers', true],
      ['14:05', 'Updated next week’s campaign calendar'],
      ['16:30', 'Sent you a short summary of what went out today'],
    ] },
    web: { name: 'Website Agent', color: 'var(--c-web)', lines: [
      ['07:30', 'Checked page speed on your top 10 pages'],
      ['08:10', 'Fixed 3 broken links on the services page'],
      ['10:45', 'Holiday opening hours drafted for the contact page', true],
      ['13:20', 'Compressed new gallery images'],
      ['23:00', 'Nightly backup completed'],
    ] },
    soc: { name: 'Social Media Agent', color: 'var(--c-soc)', lines: [
      ['08:30', 'Prepared posts for Facebook, Instagram and X'],
      ['09:00', 'Queued 3 posts for the best times this week'],
      ['12:15', 'Customer question on Instagram needs a personal reply', true],
      ['15:40', 'Replied to 6 routine comments using your saved answers'],
      ['18:00', 'Published the evening post'],
    ] },
    grw: { name: 'Growth Agent', color: 'var(--c-grw)', lines: [
      ['08:00', 'Scored 14 new enquiries from the website and social'],
      ['08:05', 'Sent 3 hot leads to your sales inbox'],
      ['11:00', 'Follow-up sequence for quiet leads drafted', true],
      ['15:00', 'Compared this week with last week across channels'],
      ['17:30', 'Weekly growth report ready'],
    ] },
  };
  const tabs = $$('[role="tab"]');
  const log = $('[data-log]');
  if (tabs.length && log) {
    const title = $('[data-log-title]', log);
    const list = $('[data-log-lines]', log);
    const render = (key) => {
      const data = LOGS[key];
      title.textContent = data.name;
      log.style.setProperty('--a', data.color);
      list.innerHTML = '';
      data.lines.forEach(([t, text, ask], n) => {
        const li = document.createElement('li');
        li.style.setProperty('--n', String(n));
        if (ask) li.classList.add('is-ask');
        const time = document.createElement('time'); time.textContent = t;
        const span = document.createElement('span'); span.textContent = text + (ask ? ', waiting for your approval' : '');
        if (ask) {
          const btn = document.createElement('button');
          btn.type = 'button'; btn.className = 'log__approve'; btn.textContent = 'Approve';
          btn.addEventListener('click', () => {
            li.classList.remove('is-ask'); li.classList.add('is-approved');
            span.textContent = text + ', approved by you';
          });
          span.appendChild(btn);
        }
        li.append(time, span);
        list.appendChild(li);
      });
    };
    const select = (tab, focus) => {
      tabs.forEach((t) => { const on = t === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      log.setAttribute('aria-labelledby', tab.id);
      render(tab.dataset.agent);
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        let j = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') j = (i + 1) % tabs.length;
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') j = 0;
        if (e.key === 'End') j = tabs.length - 1;
        if (j !== null) { e.preventDefault(); select(tabs[j], true); }
      });
    });
    render('mkt');
  }

  // ---------- Four Fridays progress (scroll-linked) ----------
  const fridays = $('[data-fridays]');
  const bar = $('[data-fridays-bar]');
  if (fridays && bar) {
    const items = $$('li', fridays);
    const update = () => {
      const r = fridays.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = reduce ? 1 : Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      bar.style.setProperty('--p', p.toFixed(3));
      items.forEach((li, i) => li.classList.toggle('is-lit', p >= (i + 0.5) / items.length));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }
})();
