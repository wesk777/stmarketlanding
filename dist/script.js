(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-menu]');

  if (header && menuButton && menu) {
    const setMenu = (open) => {
      header.classList.toggle('is-menu-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };

    menuButton.addEventListener('click', () => setMenu(!header.classList.contains('is-menu-open')));
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenu(false);
    });
  }

  const route = document.querySelector('[data-route]');
  if (route) {
    const range = route.querySelector('[data-route-range]');
    const tabs = [...route.querySelectorAll('[data-route-tab]')];
    const screens = [...route.querySelectorAll('[data-route-screen]')];
    const status = route.querySelector('[data-route-status]');
    const labels = [
      'Возвращаем покупателя в диалог',
      'Защищаем карточку обоснованной жалобой',
      'Проверяем пульс магазина',
      'ИИ ускоряет ответы на отзывы',
    ];

    const setStage = (next) => {
      const stage = Math.max(0, Math.min(labels.length - 1, Number(next)));
      route.dataset.stage = String(stage);
      range.value = String(stage);
      status.textContent = labels[stage];

      tabs.forEach((tab, index) => {
        const selected = index === stage;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });

      screens.forEach((screen, index) => {
        screen.hidden = index !== stage;
      });
    };

    range.addEventListener('input', (event) => setStage(event.target.value));
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => setStage(index));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? tabs.length - 1
            : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        setStage(next);
        tabs[next].focus();
      });
    });

    setStage(range.value);
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = [...document.querySelectorAll('[data-reveal]')];
  if (!reducedMotion && 'IntersectionObserver' in window && revealItems.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );

    requestAnimationFrame(() => {
      document.documentElement.classList.add('motion-ready');
      revealItems.forEach((item) => observer.observe(item));
    });
  }
})();
