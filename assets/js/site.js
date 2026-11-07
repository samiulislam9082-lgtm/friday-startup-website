(() => {
  document.documentElement.classList.add('js-ready');

  const headers = document.querySelectorAll('[data-site-header]');
  const closeMenu = (header) => {
    const button = header.querySelector('.menu-toggle');
    if (!button) return;
    header.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Open navigation');
  };

  const closeAllMenus = () => headers.forEach(closeMenu);

  headers.forEach((header) => {
    const button = header.querySelector('.menu-toggle');
    const nav = header.querySelector('.site-nav');
    if (!button || !nav) return;

    button.addEventListener('click', () => {
      const open = !header.classList.contains('is-open');
      closeAllMenus();
      if (open) header.classList.add('is-open');
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });

    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu(header)));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const openHeader = [...headers].find((header) => header.classList.contains('is-open'));
    closeAllMenus();
    if (openHeader) openHeader.querySelector('.menu-toggle')?.focus();
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
    document.querySelectorAll('[data-word]').forEach((word) => word.classList.add('is-active'));
    return;
  }

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach((element) => sectionObserver.observe(element));

  const wordObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-active');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '-32% 0px -48% 0px', threshold: 0.01 });

  document.querySelectorAll('[data-word]').forEach((word) => wordObserver.observe(word));
})();
