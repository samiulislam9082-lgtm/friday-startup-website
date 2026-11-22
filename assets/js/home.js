(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const EMAIL = 'fridaystartup@fridaystartup.cyou';

  const hero = $('.hero');
  requestAnimationFrame(() => requestAnimationFrame(() => hero && hero.classList.add('is-ready')));
  const yr = $('[data-year]'); if (yr) yr.textContent = String(new Date().getFullYear());

  // ---------- Toast ----------
  const toastEl = $('[data-toast]'); let toastT = 0;
  const toast = (m) => { if (!toastEl) return; toastEl.textContent = m; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2200); };

  // ---------- Header ----------
  const top = $('[data-top]'), menu = $('.top__menu');
  const darkSecs = $$('.hero, .marq, .agents, .lab');
  let lastY = window.scrollY;
  const headerState = () => {
    const y = window.scrollY;
    const probe = 44;
    const onDark = darkSecs.some((s) => { const r = s.getBoundingClientRect(); return r.top <= probe && r.bottom >= probe; });
    top.classList.toggle('is-light', !onDark);
    if (!top.classList.contains('is-open')) {
      if (y > 600 && y > lastY + 6) top.classList.add('is-hidden');
      else if (y < lastY - 6 || y < 600) top.classList.remove('is-hidden');
    }
    lastY = y;
  };
  const setMenu = (o) => { top.classList.toggle('is-open', o); menu.setAttribute('aria-expanded', String(o)); menu.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); };
  menu.addEventListener('click', () => setMenu(!top.classList.contains('is-open')));
  $$('.top__nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && top.classList.contains('is-open')) { setMenu(false); menu.focus(); } });
  const navLinks = $$('.top__nav a[href^="#"]:not(.top__navcta)');
  if (hasIO) {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach((a) => { const t = $(a.getAttribute('href')); if (t) io.observe(t); });
  }

  // ---------- Reveal ----------
  $$('.grid, .tenets, .labs, .steps, .stories').forEach((g) => $$('.reveal', g).forEach((el, i) => el.style.setProperty('--i', String(i % 6))));
  const reveals = $$('.reveal');
  let revealIO = null;
  if (!hasIO || reduce) reveals.forEach((el) => el.classList.add('is-in'));
  else {
    revealIO = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); revealIO.unobserve(en.target); } }), { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    reveals.forEach((el) => revealIO.observe(el));
  }

  // ---------- Manifesto: words light up with scroll ----------
  const mani = $('[data-manifesto]');
  let maniWords = [];
  if (mani) {
    const hl = new Set(['next', 'generation', 'real', 'value']);
    mani.innerHTML = mani.textContent.trim().split(/\s+/).map((w) => `<span class="w${hl.has(w.replace(/[^a-z]/gi, '').toLowerCase()) ? ' w--hl' : ''}">${w}</span>`).join(' ');
    maniWords = $$('.w', mani);
    if (reduce) maniWords.forEach((w) => w.classList.add('is-on'));
  }
  const maniUpdate = () => {
    if (!mani || reduce) return;
    const r = mani.getBoundingClientRect(), vh = window.innerHeight;
    const p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
    const n = Math.round(p * maniWords.length);
    maniWords.forEach((w, i) => w.classList.toggle('is-on', i < n));
  };

  // ---------- Steps line ----------
  const steps = $('[data-steps]'), stepCards = steps ? $$('.stepc', steps) : [];
  const stepsUpdate = () => {
    if (!steps) return;
    const r = steps.getBoundingClientRect(), vh = window.innerHeight;
    const p = reduce ? 1 : Math.max(0, Math.min(1, (vh * 0.75 - r.top) / (vh * 0.5)));
    steps.style.setProperty('--p', p.toFixed(3));
    stepCards.forEach((c, i) => c.classList.toggle('is-on', p >= (i + 0.2) / stepCards.length || p === 1));
  };

  let ticking = false;
  const onScroll = () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { ticking = false; headerState(); maniUpdate(); stepsUpdate(); }); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  headerState(); maniUpdate(); stepsUpdate();

  // ---------- Hero orb (canvas particle sphere) ----------
  const cv = $('[data-orb]'), orbit = $('[data-orbit]');
  if (cv && cv.getContext) {
    const ctx = cv.getContext('2d');
    const N = window.innerWidth < 700 ? 650 : 1150;
    const pts = [];
    const ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, rad = Math.sqrt(1 - y * y), th = ga * i;
      pts.push([Math.cos(th) * rad, y, Math.sin(th) * rad]);
    }
    const ring = [];
    for (let i = 0; i < 220; i++) { const a = (i / 220) * Math.PI * 2; ring.push([Math.cos(a) * 1.45, 0, Math.sin(a) * 1.45]); }
    const stops = [[74, 92, 255], [154, 107, 255], [255, 111, 97], [255, 181, 71]];
    const col = (t) => { t = Math.max(0, Math.min(0.999, t)) * (stops.length - 1); const i = Math.floor(t), f = t - i, a = stops[i], b = stops[i + 1]; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]; };
    let W = 0, H = 0, dpr = 1, rot = 0.4, tx = 0, ty = 0, cx = 0, cy = 0, running = true, raf = 0;
    const labels = orbit ? $$('span', orbit) : [];
    const size = () => { const r = cv.getBoundingClientRect(); dpr = Math.min(2, window.devicePixelRatio || 1); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const proj = (p, ry, rx, R) => {
      let [x, y, z] = p;
      const cY = Math.cos(ry), sY = Math.sin(ry); [x, z] = [x * cY - z * sY, x * sY + z * cY];
      const cX = Math.cos(rx), sX = Math.sin(rx); [y, z] = [y * cX - z * sX, y * sX + z * cX];
      const s = 2.6 / (2.6 + z);
      return [W / 2 + x * R * s, H / 2 + y * R * s, z, s];
    };
    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      const R = Math.min(W, H) * 0.3;
      cx += (tx - cx) * 0.05; cy += (ty - cy) * 0.05;
      const ry = rot + cx * 0.6, rx = -0.35 + cy * 0.3;
      const breathe = 1 + Math.sin(t / 1400) * 0.02;
      for (let i = 0; i < pts.length; i++) {
        const [x, y, z, s] = proj(pts[i], ry, rx, R * breathe);
        const depth = (1 - z) / 2;
        const c = col((pts[i][1] + 1) / 2 * 0.85 + Math.sin(i * 0.5 + t / 2000) * 0.06);
        ctx.fillStyle = `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${0.15 + depth * 0.85})`;
        const sz = (0.6 + depth * 1.7) * s;
        ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
      }
      for (let i = 0; i < ring.length; i++) {
        const [x, y, z] = proj(ring[i], ry * 0.5 + t / 9000, rx + 1.15, R);
        ctx.fillStyle = `rgba(255,255,255,${0.08 + (1 - z) * 0.18})`;
        ctx.fillRect(x - 0.7, y - 0.7, 1.4, 1.4);
      }
      if (labels.length && W > 0) {
        const cr = cv.getBoundingClientRect(), hr = hero.getBoundingClientRect();
        labels.forEach((el, i) => {
          const a = (i / labels.length) * Math.PI * 2 + t / 14000;
          const [x, y, z, s] = proj([Math.cos(a) * 1.45, 0, Math.sin(a) * 1.45], ry * 0.5 + t / 9000, rx + 1.15, R);
          const front = (1 - z) / 2;
          el.style.transform = `translate(${(cr.left - hr.left + x).toFixed(1)}px, ${(cr.top - hr.top + y).toFixed(1)}px) translate(-50%, -50%) scale(${(0.8 + front * 0.3).toFixed(3)})`;
          const ax = cr.left - hr.left + x, safe = hr.width * 0.56;
          const fade = hr.width < 960 ? 1 : Math.max(0, Math.min(1, (ax - safe) / 80));
          el.style.opacity = ((0.15 + front * 0.85) * fade).toFixed(2);
          el.style.zIndex = front > 0.5 ? '2' : '0';
        });
      }
    };
    const loop = (t) => { rot += 0.0022; draw(t); if (running) raf = requestAnimationFrame(loop); };
    size(); window.addEventListener('resize', size);
    if (reduce) draw(0);
    else {
      raf = requestAnimationFrame(loop);
      if (hasIO) new IntersectionObserver(([en]) => { const v = en.isIntersecting; if (v && !running) { running = true; raf = requestAnimationFrame(loop); } else if (!v) { running = false; cancelAnimationFrame(raf); } }).observe(hero);
      hero.addEventListener('pointermove', (e) => { tx = (e.clientX / window.innerWidth - 0.5) * 2; ty = (e.clientY / window.innerHeight - 0.5) * 2; });
      hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; });
    }
  }

  // ---------- Assistant simulator ----------
  const SIMS = {
    recept: { t: 'AI Receptionist', a: 'R', s: 'Online 24/7 · replies instantly', d: 'Answers enquiries on your website and channels 24/7, captures details and hands over to your team.', m: [
      ['sys', '11:42 pm · Website chat'], ['in', 'Hi, are you open on Sunday? And do you do teeth whitening?'], ['out', 'Hi! We are open Sunday 10am to 4pm, and yes, we offer whitening. Would you like prices or a booking?'], ['in', 'Prices please'], ['out', 'Whitening starts from our standard package. I have sent the full price list to you and noted your interest for the team.'] ] },
    phone: { t: 'AI Phone Assistant', a: 'P', s: 'On a call', d: 'Picks up every incoming call and makes configured outgoing calls, such as reminders and confirmations.', m: [
      ['sys', 'Incoming call · 09:03'], ['card', '<small>Live call</small><b>Caller asking about delivery</b><div class="wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>'], ['in', '“Hi, I ordered yesterday, when will it arrive?”'], ['out', '“Thanks for calling. Your order is packed and arrives tomorrow before noon. Can I help with anything else?”'], ['sys', 'Call summary sent to your team'] ] },
    book: { t: 'AI Booking Assistant', a: 'B', s: 'Checking your calendar', d: 'Schedules, moves and confirms appointments automatically, synced with your calendar.', m: [
      ['in', 'Can I book a haircut this Thursday after work?'], ['out', 'Of course. Here are the free slots on Thursday:'], ['card', '<small>Thursday</small><b>Choose a time</b><div class="slots"><span>4:30 pm</span><span class="is-pick">5:30 pm</span><span>6:15 pm</span></div>'], ['in', '5:30 works'], ['out', 'Booked for Thursday 5:30 pm. You will get a reminder the day before.'] ] },
    sales: { t: 'AI Sales Assistant', a: 'S', s: 'Qualifying a new lead', d: 'Qualifies every new lead, answers questions and follows up until they are ready to talk to you.', m: [
      ['sys', 'New lead from Facebook ad'], ['out', 'Hi Sara, thanks for your interest. What size is your team, and when are you hoping to start?'], ['in', 'About 12 people, ideally next month'], ['card', '<small>Lead score</small><b>Warm lead · ready for a call</b>'], ['out', 'Great fit. I have shared two times for a quick call with our team. I will check back in 2 days if you are busy.'] ] },
    review: { t: 'AI Review Assistant', a: 'V', s: 'Managing reviews', d: 'Asks happy customers for reviews at the right moment and drafts replies for you to approve.', m: [
      ['sys', 'Visit completed · 2 hours ago'], ['out', 'Thanks for visiting today. If you enjoyed it, would you leave us a quick review?'], ['card', '<small>New review</small><b><span class="stars">★★★★★</span></b>“Friendly staff and quick service.”'], ['out', 'Draft reply ready: “Thank you so much, we are glad you had a great visit.” Approve to post?'], ['sys', 'Approved by owner · posted'] ] },
    wa: { t: 'AI WhatsApp Assistant', a: 'W', s: 'WhatsApp · online', d: 'Runs natural WhatsApp conversations: questions, orders, reminders and updates, any time of day.', m: [
      ['in', 'Hello, is the blue jacket still in stock in medium?'], ['out', 'Yes, medium is in stock. Would you like it delivered or held for pickup?', 'wa'], ['in', 'Delivery please'], ['out', 'Done. Here is your secure payment link. Delivery is 1 to 2 days.', 'wa'], ['sys', 'Order created · team notified'] ] },
  };
  const simRoot = $('[data-sim-root]');
  if (simRoot) {
    const tabs = $$('[data-sim]', simRoot), feed = $('[data-sim-feed]'), title = $('[data-sim-title]'), status = $('[data-sim-status]'), av = $('[data-sim-av]'), desc = $('[data-sim-desc]');
    const screen = $('#sim-screen');
    let timers = [], cur = 0, auto = !reduce, visible = false, started = false;
    const clear = () => { timers.forEach(clearTimeout); timers = []; };
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    const play = (i, fromUser) => {
      clear(); cur = i;
      const key = tabs[i].dataset.sim, sim = SIMS[key];
      tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(j === i)); t.tabIndex = j === i ? 0 : -1; t.classList.remove('is-playing'); });
      screen.setAttribute('aria-labelledby', tabs[i].id);
      title.textContent = sim.t; status.textContent = sim.s; av.textContent = sim.a;
      desc.classList.add('is-swap'); later(() => { desc.textContent = sim.d; desc.classList.remove('is-swap'); }, 220);
      feed.innerHTML = '';
      const step = reduce ? 0 : 1100;
      let tt = 300;
      sim.m.forEach(([type, txt, v]) => {
        if (type === 'out' && !reduce) {
          const at = tt; later(() => { const ty = document.createElement('li'); ty.className = 'msg msg--in msg--typing is-in'; ty.innerHTML = '<i></i><i></i><i></i>'; ty.dataset.typing = '1'; feed.appendChild(ty); }, at);
          tt += 700;
        }
        const at2 = tt;
        later(() => {
          const t = feed.querySelector('[data-typing]'); if (t) t.remove();
          const li = document.createElement('li'); li.className = `msg msg--${type}${v ? ' msg--' + v : ''}${key === 'wa' && type === 'out' ? ' msg--wa' : ''}`;
          if (type === 'card') li.innerHTML = txt; else li.textContent = txt;
          feed.appendChild(li); requestAnimationFrame(() => li.classList.add('is-in'));
        }, at2);
        tt += step;
      });
      if (auto && !fromUser) {
        const dur = tt + 2400;
        tabs[i].style.setProperty('--dur', dur + 'ms');
        void tabs[i].offsetWidth; tabs[i].classList.add('is-playing');
        later(() => { if (auto && visible) play((i + 1) % tabs.length); }, dur);
      }
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => { auto = false; play(i, true); });
      t.addEventListener('keydown', (e) => {
        const k = e.key; let n = -1;
        if (k === 'ArrowDown' || k === 'ArrowRight') n = (i + 1) % tabs.length;
        if (k === 'ArrowUp' || k === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
        if (n > -1) { e.preventDefault(); auto = false; tabs[n].focus(); play(n, true); }
      });
    });
    if (hasIO) new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible && !started) { started = true; play(0); }
      else if (visible && auto && !timers.length) play(cur);
    }, { threshold: 0.35 }).observe(simRoot);
    else play(0);
  }

  // ---------- Services: filter, spotlight, plan ----------
  const grid = $('[data-grid]');
  const plan = new Set();
  const tray = $('[data-tray]'), trayCount = $('[data-tray-count]'), trayNames = $('[data-tray-names]');
  const planList = $('[data-plan-list]'), planEmpty = $('[data-plan-empty]');
  const renderPlan = () => {
    const names = [...plan];
    $$('[data-add]').forEach((b) => { const on = plan.has(b.dataset.add); b.setAttribute('aria-pressed', String(on)); $('.svc__lbl', b).textContent = on ? 'Added' : 'Add to plan'; b.closest('.svc').classList.toggle('is-picked', on); });
    if (tray) {
      tray.hidden = names.length === 0;
      trayCount.textContent = String(names.length);
      trayCount.classList.remove('is-bump'); void trayCount.offsetWidth; trayCount.classList.add('is-bump');
      trayNames.textContent = names.join(', ');
    }
    if (planList) {
      $$('.tag', planList).forEach((t) => t.remove());
      planEmpty.hidden = names.length > 0;
      names.forEach((n) => {
        const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = n;
        const x = document.createElement('button'); x.type = 'button'; x.textContent = '×'; x.setAttribute('aria-label', `Remove ${n}`);
        x.addEventListener('click', () => { plan.delete(n); renderPlan(); });
        tag.appendChild(x); planList.appendChild(tag);
      });
    }
  };
  if (grid) {
    const cards = $$('.svc', grid), chips = $$('[data-filter]');
    const filter = (cat) => {
      chips.forEach((c) => { const on = c.dataset.filter === cat; c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', String(on)); });
      let n = 0;
      cards.forEach((c) => {
        const show = cat === 'all' || c.dataset.cat === cat;
        c.classList.toggle('is-hide', !show);
        if (show) { c.style.setProperty('--i', String(n++ % 6)); if (!reduce) { c.classList.remove('is-in'); requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add('is-in'))); } }
      });
    };
    chips.forEach((c) => c.addEventListener('click', () => filter(c.dataset.filter)));
    $$('[data-jump]').forEach((a) => a.addEventListener('click', () => filter(a.dataset.jump)));
    cards.forEach((card) => card.addEventListener('pointermove', (e) => { const r = card.getBoundingClientRect(); card.style.setProperty('--mx', `${e.clientX - r.left}px`); card.style.setProperty('--my', `${e.clientY - r.top}px`); }));
    $$('[data-add]', grid).forEach((b) => b.addEventListener('click', () => {
      const n = b.dataset.add;
      if (plan.has(n)) plan.delete(n); else { plan.add(n); toast(`${n} added to your plan`); }
      renderPlan();
    }));
  }
  const clearBtn = $('[data-tray-clear]'); if (clearBtn) clearBtn.addEventListener('click', () => { plan.clear(); renderPlan(); });
  $$('a[href="#contact"]').forEach((a) => a.addEventListener('click', () => { if (tray) tray.hidden = true; }));
  // Hide tray while contact is on screen
  const contact = $('#contact');
  if (hasIO && contact && tray) new IntersectionObserver(([en]) => { tray.hidden = en.isIntersecting || plan.size === 0; }, { threshold: 0.2 }).observe(contact);

  // ---------- Search modes ----------
  const scr = $('[data-screen]');
  if (scr) {
    const modes = $$('[data-mode]'), q = $('[data-q]', scr);
    const Q = { seo: 'best dental clinic near me', aeo: 'is there a dentist open today?', geo: 'which clinic nearby can see me this week?' };
    let mt = [], mi = 0, mauto = !reduce, mvis = false;
    const mclear = () => { mt.forEach(clearTimeout); mt = []; };
    const type = (txt) => { if (reduce) { q.textContent = txt; return; } q.textContent = ''; let i = 0; const s = () => { q.textContent = txt.slice(0, ++i); if (i < txt.length) mt.push(setTimeout(s, 32)); }; s(); };
    const show = (i, user) => {
      mclear(); mi = i; const k = modes[i].dataset.mode;
      modes.forEach((m, j) => { m.setAttribute('aria-selected', String(j === i)); m.tabIndex = j === i ? 0 : -1; m.classList.remove('is-playing'); });
      scr.dataset.show = k; type(Q[k]);
      if (mauto && !user) { void modes[i].offsetWidth; modes[i].classList.add('is-playing'); mt.push(setTimeout(() => { if (mauto && mvis) show((i + 1) % modes.length); }, 6000)); }
    };
    modes.forEach((m, i) => {
      m.addEventListener('click', () => { mauto = false; show(i, true); });
      m.addEventListener('keydown', (e) => { let n = -1; if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % modes.length; if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i - 1 + modes.length) % modes.length; if (n > -1) { e.preventDefault(); mauto = false; modes[n].focus(); show(n, true); } });
    });
    if (hasIO) new IntersectionObserver(([en]) => { const was = mvis; mvis = en.isIntersecting; if (mvis && !was && mauto) show(mi); }, { threshold: 0.4 }).observe(scr);
    else show(0, true);
  }

  // ---------- Lab tilt ----------
  if (!reduce && window.matchMedia('(pointer: fine)').matches) {
    $$('[data-tilt]').forEach((c) => {
      c.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; c.style.transform = `rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateZ(0)`; });
      c.addEventListener('pointerleave', () => { c.style.transform = ''; });
    });
  }

  // ---------- Copy email ----------
  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    const v = b.dataset.copy;
    try { await navigator.clipboard.writeText(v); } catch (_) { const t = document.createElement('textarea'); t.value = v; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) {} t.remove(); }
    b.textContent = 'Copied'; b.classList.add('is-done'); toast('Email address copied');
    setTimeout(() => { b.textContent = 'Copy'; b.classList.remove('is-done'); }, 1800);
  }));

  // ---------- Brief -> email ----------
  const brief = $('[data-brief]');
  if (brief) {
    const hint = $('[data-brief-hint]', brief), def = hint.textContent;
    const reset = () => { brief.name.removeAttribute('aria-invalid'); hint.textContent = def; hint.classList.remove('is-error'); };
    brief.name.addEventListener('input', reset);
    brief.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = brief.name.value.trim();
      if (!name) { brief.name.setAttribute('aria-invalid', 'true'); hint.textContent = 'Please add your name so we know who to reply to.'; hint.classList.add('is-error'); brief.name.focus(); return; }
      reset();
      const company = brief.company.value.trim(), msg = brief.msg.value.trim();
      const subject = `New project plan from ${name}${company ? ' (' + company + ')' : ''}`;
      const lines = [`Name: ${name}`];
      if (company) lines.push(`Business: ${company}`);
      lines.push(`Services: ${plan.size ? [...plan].join(', ') : 'Not sure yet'}`, '', msg || '(No extra details)');
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
      toast('Opening your email app…');
    });
  }
  renderPlan();
})();
