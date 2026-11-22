(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  requestAnimationFrame(() => requestAnimationFrame(() => { const h = $('.hero'); if (h) h.classList.add('is-ready'); }));

  // ---------- Toast ----------
  const toastEl = $('[data-toast]');
  let toastT = 0;
  const toast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2200);
  };

  // ---------- Nav: scrolled state, hide on scroll down, mobile menu, current link ----------
  const nav = $('[data-nav]');
  const menuBtn = $('.nav__menu');
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 12);
    if (!nav.classList.contains('is-open')) nav.classList.toggle('is-hidden', y > 500 && y > lastY + 4);
    if (y < lastY - 4) nav.classList.remove('is-hidden');
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  if (menuBtn) {
    menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
    $$('.nav__links a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); } });
  }
  const links = $$('.nav__links a[href^="#"]');
  if (hasIO) {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === '#' + en.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    links.forEach((a) => { const el = $(a.getAttribute('href')); if (el) io.observe(el); });
  }

  // ---------- Reveal ----------
  $$('.bento, .cards').forEach((g) => $$('.reveal', g).forEach((el, i) => el.style.setProperty('--i', String(i))));
  const reveals = $$('.reveal');
  if (!hasIO || reduce) reveals.forEach((el) => el.classList.add('is-in'));
  else {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach((el) => io.observe(el));
  }

  // ---------- Hero glow follows pointer ----------
  const hero = $('.hero'), glow = $('.hero__glow');
  if (hero && glow && !reduce && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      glow.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
      glow.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 70}%`);
    });
  }

  // ---------- Agent console demo ----------
  const PLANS = {
    mkt: { name: 'Marketing Agent', letter: 'M', color: 'var(--lime)', steps: ['Read your latest offers and past emails', 'Drafted this week’s newsletter in your tone', 'Picked the best send time for your list', { ask: 'Newsletter ready to send' }] },
    web: { name: 'Website Agent', letter: 'W', color: 'var(--sky)', steps: ['Checked speed on your key pages', 'Found and fixed 3 broken links', 'Backed up the site', { ask: 'New opening hours ready to publish' }] },
    soc: { name: 'Social Media Agent', letter: 'S', color: 'var(--violet)', steps: ['Planned 3 posts for Facebook, Instagram and X', 'Wrote captions and picked images', 'Scheduled posts for the best times', { ask: 'One customer reply needs your personal touch' }] },
    grw: { name: 'Growth Agent', letter: 'G', color: 'var(--peach)', steps: ['Collected new enquiries from website and social', 'Scored and sorted leads by fit', 'Drafted follow-ups for each lead', { ask: 'Follow-up emails ready to send' }] },
  };
  const pick = (text) => {
    const t = text.toLowerCase();
    if (/newsletter|e-?mail|campaign|blog|content|offer|promo/.test(t)) return 'mkt';
    if (/insta|facebook|social|post|tiktok|reel|comment|twitter|\bx\b|linkedin/.test(t)) return 'soc';
    if (/web|site|page|seo|speed|link|backup|domain|hosting/.test(t)) return 'web';
    if (/lead|sale|grow|report|customer|crm|enquir|follow/.test(t)) return 'grw';
    return 'mkt';
  };
  const cons = $('[data-console]');
  if (cons) {
    const form = $('[data-ask]', cons), input = $('#ask-input'), chips = $$('[data-chip]', cons);
    const avatar = $('[data-avatar]', cons), agentName = $('[data-agent-name]', cons), taskEl = $('[data-task]', cons);
    const stateEl = $('[data-state]', cons), stepsEl = $('[data-steps]', cons), out = $('[data-out]', cons);
    let run = 0, auto = true, timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, reduce ? 0 : ms));
    const clear = () => { timers.forEach(clearTimeout); timers = []; };
    const setState = (cls, txt) => { stateEl.className = 'plan__state ' + cls; stateEl.textContent = txt; };

    const plan = (text) => {
      clear(); const id = ++run;
      const key = pick(text), p = PLANS[key];
      out.style.setProperty('--a', p.color);
      avatar.textContent = p.letter; agentName.textContent = p.name; taskEl.textContent = '“' + text + '”';
      chips.forEach((c) => c.classList.toggle('is-active', c.dataset.chip === text));
      setState('is-busy', 'Planning');
      stepsEl.innerHTML = '';
      const items = p.steps.map((s) => {
        const li = document.createElement('li');
        const ico = document.createElement('span'); ico.className = 'plan__ico'; ico.setAttribute('aria-hidden', 'true');
        const body = document.createElement('div');
        const label = document.createElement('span'); label.textContent = typeof s === 'string' ? s : s.ask;
        const bar = document.createElement('span'); bar.className = 'plan__bar'; bar.innerHTML = '<i></i>';
        body.append(label, bar); li.append(ico, body); stepsEl.appendChild(li);
        return { li, ico, body, ask: typeof s !== 'string' };
      });
      items.forEach((it, i) => {
        later(() => { if (id !== run) return; it.li.classList.add('is-in', 'is-run'); }, 250 + i * 900);
        later(() => {
          if (id !== run) return;
          it.li.classList.remove('is-run');
          if (!it.ask) { it.li.classList.add('is-ok'); it.ico.textContent = '✓'; return; }
          it.li.classList.add('is-wait'); it.ico.textContent = '!';
          it.body.querySelector('.plan__bar').remove();
          setState('is-ask', 'Needs you');
          const wrap = document.createElement('div'); wrap.className = 'plan__approve';
          const ok = document.createElement('button'); ok.type = 'button'; ok.textContent = 'Approve';
          const edit = document.createElement('button'); edit.type = 'button'; edit.textContent = 'Request changes';
          ok.addEventListener('click', () => {
            auto = false; wrap.remove(); it.li.classList.remove('is-wait'); it.li.classList.add('is-ok'); it.ico.textContent = '✓';
            it.body.firstChild.textContent += ' · approved by you'; setState('is-done', 'Done');
          });
          edit.addEventListener('click', () => { auto = false; wrap.remove(); it.body.firstChild.textContent += ' · sent back with your notes'; setState('', 'Revising'); });
          wrap.append(ok, edit); it.body.appendChild(wrap);
          if (auto) later(() => { if (id === run && auto) cycle(); }, 4200);
        }, 250 + i * 900 + 750);
      });
    };

    // Type a chip's text into the input, then plan it
    const typeIn = (text, then) => {
      if (reduce) { input.value = text; then(); return; }
      input.value = ''; let i = 0; const id = run;
      const step = () => { if (id !== run || !auto) return; input.value = text.slice(0, ++i); if (i < text.length) later(step, 28); else later(then, 300); };
      step();
    };
    let ci = 0;
    const cycle = () => { const text = chips[ci % chips.length].dataset.chip; ci++; typeIn(text, () => plan(text)); };

    const stopAuto = () => { auto = false; };
    chips.forEach((c) => c.addEventListener('click', () => { stopAuto(); input.value = c.dataset.chip; plan(c.dataset.chip); }));
    form.addEventListener('submit', (e) => { e.preventDefault(); stopAuto(); const v = input.value.trim(); if (!v) { input.focus(); return; } plan(v); });
    input.addEventListener('focus', () => { if (auto) { stopAuto(); clear(); run++; input.value = ''; } });

    if (hasIO) {
      let started = false;
      new IntersectionObserver(([en]) => { if (en.isIntersecting && !started) { started = true; setTimeout(cycle, reduce ? 0 : 900); } }, { threshold: 0.4 }).observe(cons);
    } else cycle();
  }

  // ---------- How it works: horizontal scroll ----------
  const how = $('[data-how]'), track = $('[data-how-track]'), howBar = $('[data-how-bar]');
  if (how && track) {
    const steps = $$('.step', track);
    const wide = () => window.matchMedia('(min-width: 861px)').matches && !reduce;
    const update = () => {
      const r = how.getBoundingClientRect();
      const total = how.offsetHeight - window.innerHeight;
      let p;
      if (wide()) {
        p = Math.max(0, Math.min(1, -r.top / Math.max(1, total)));
        const dist = Math.max(0, track.scrollWidth - window.innerWidth);
        track.style.setProperty('--tx', `${(-dist * p).toFixed(1)}px`);
      } else {
        p = Math.max(0, Math.min(1, (window.innerHeight * 0.7 - r.top) / r.height));
      }
      if (howBar) howBar.style.setProperty('--p', p.toFixed(3));
      const active = Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999));
      steps.forEach((s, i) => s.classList.toggle('is-on', i <= active));
    };
    let ticking = false;
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; update(); }); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // ---------- Service cards spotlight ----------
  $$('[data-spot] .card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  // ---------- News carousel ----------
  const news = $('[data-news]');
  if (news) {
    const prev = $('[data-news-prev]'), next = $('[data-news-next]');
    const stepW = () => { const c = news.firstElementChild; return c ? c.getBoundingClientRect().width + 16 : 300; };
    const sync = () => {
      prev.disabled = news.scrollLeft < 4;
      next.disabled = news.scrollLeft + news.clientWidth >= news.scrollWidth - 4;
      prev.parentElement.style.visibility = news.scrollWidth - news.clientWidth > 24 ? '' : 'hidden';
    };
    prev.addEventListener('click', () => news.scrollBy({ left: -stepW(), behavior: reduce ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => news.scrollBy({ left: stepW(), behavior: reduce ? 'auto' : 'smooth' }));
    news.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  }

  // ---------- Copy email ----------
  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    const v = b.dataset.copy;
    try { await navigator.clipboard.writeText(v); }
    catch (_) { const t = document.createElement('textarea'); t.value = v; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) {} t.remove(); }
    b.textContent = 'Copied'; b.classList.add('is-done'); toast('Email address copied');
    setTimeout(() => { b.textContent = 'Copy'; b.classList.remove('is-done'); }, 1800);
  }));

  // ---------- Project brief -> email ----------
  const brief = $('[data-brief]');
  if (brief) {
    const hint = $('[data-brief-hint]', brief);
    const defaultHint = hint.textContent;
    brief.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = brief.name.value.trim();
      if (!name) { brief.name.setAttribute('aria-invalid', 'true'); hint.textContent = 'Please add your name so we know who to reply to.'; hint.classList.add('is-error'); brief.name.focus(); return; }
      brief.name.removeAttribute('aria-invalid'); hint.textContent = defaultHint; hint.classList.remove('is-error');
      const needs = $$('input[name="need"]:checked', brief).map((i) => i.value);
      const company = brief.company.value.trim(), msg = brief.msg.value.trim();
      const subject = `Project brief from ${name}${company ? ' (' + company + ')' : ''}`;
      const body = [`Name: ${name}`, company && `Company: ${company}`, `Agents needed: ${needs.length ? needs.join(', ') : 'Not sure yet'}`, '', msg || '(No extra details)'].filter((l) => l !== '' || true).filter(Boolean).join('\n');
      window.location.href = `mailto:fridaystartup@fridaystartup.cyou?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      toast('Opening your email app…');
    });
    brief.name.addEventListener('input', () => { brief.name.removeAttribute('aria-invalid'); hint.textContent = defaultHint; hint.classList.remove('is-error'); });
  }

  // ---------- Back to top ----------
  const topBtn = $('[data-top]');
  if (topBtn) topBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); $('.nav__brand').focus(); });

  // ---------- Command palette ----------
  const pal = $('[data-palette]');
  if (pal && typeof pal.showModal === 'function') {
    const input = $('[data-palette-input]', pal), list = $('[data-palette-list]', pal), empty = $('[data-palette-empty]', pal);
    const items = $$('li', list);
    items.forEach((li, i) => { li.id = 'pal-' + i; });
    let visible = items, idx = 0;
    const mark = () => {
      items.forEach((li) => li.setAttribute('aria-selected', 'false'));
      if (visible[idx]) { visible[idx].setAttribute('aria-selected', 'true'); input.setAttribute('aria-activedescendant', visible[idx].id); visible[idx].scrollIntoView({ block: 'nearest' }); }
      else input.removeAttribute('aria-activedescendant');
    };
    const filter = () => {
      const q = input.value.trim().toLowerCase();
      visible = items.filter((li) => { const on = !q || (li.textContent + ' ' + li.dataset.group).toLowerCase().includes(q); li.hidden = !on; return on; });
      empty.hidden = visible.length > 0; idx = 0; mark();
    };
    const go = (li) => {
      if (!li) return;
      const href = li.dataset.href;
      pal.close();
      if (href.startsWith('#')) { const el = $(href); if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); history.replaceState(null, '', href); }
      else if (/^https?:/.test(href)) window.open(href, '_blank', 'noopener');
      else window.location.href = href;
    };
    const open = () => { input.value = ''; filter(); pal.showModal(); input.focus(); };
    $$('[data-palette-open]').forEach((b) => b.addEventListener('click', open));
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.open ? pal.close() : open(); }
    });
    input.addEventListener('input', filter);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); idx = Math.min(visible.length - 1, idx + 1); mark(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); idx = Math.max(0, idx - 1); mark(); }
      else if (e.key === 'Enter') { e.preventDefault(); go(visible[idx]); }
    });
    items.forEach((li) => {
      li.addEventListener('click', () => go(li));
      li.addEventListener('pointermove', () => { const j = visible.indexOf(li); if (j !== idx) { idx = j; mark(); } });
    });
    pal.addEventListener('click', (e) => { if (e.target === pal) pal.close(); });
  } else {
    $$('[data-palette-open]').forEach((b) => { b.hidden = true; });
  }
})();
