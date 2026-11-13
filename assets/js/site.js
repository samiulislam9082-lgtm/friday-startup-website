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
})();
