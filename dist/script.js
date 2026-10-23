(() => {
  const header = document.querySelector("[data-header]");
  const menuButton = document.querySelector("[data-menu-button]");
  const menu = document.querySelector("[data-menu]");

  if (header && menuButton && menu) {
    const setMenu = (open) => {
      header.classList.toggle("is-menu-open", open);
      menuButton.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    };

    menuButton.addEventListener("click", () => setMenu(!header.classList.contains("is-menu-open")));
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenu(false);
    });
  }

  const priceRange = document.querySelector("[data-profit-range]");
  if (priceRange) {
    const formatRubles = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });
    const priceOutputs = document.querySelectorAll("[data-price-output]");
    const profitOutputs = document.querySelectorAll("[data-profit-output]");
    const marginOutputs = document.querySelectorAll("[data-margin-output]");
    const payoutOutputs = document.querySelectorAll("[data-payout-output]");

    const updateScenario = () => {
      const price = Number(priceRange.value);
      const expenses = 1870;
      const profit = price - expenses;
      const margin = (profit / price) * 100;
      const payout = Math.max(0, profit * 34);

      priceOutputs.forEach((output) => {
        output.textContent = `${formatRubles.format(price)} ₽`;
      });
      profitOutputs.forEach((output) => {
        output.textContent = `${formatRubles.format(profit)} ₽`;
      });
      marginOutputs.forEach((output) => {
        output.textContent = `${margin.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%`;
      });
      payoutOutputs.forEach((output) => {
        output.textContent = `${formatRubles.format(payout)} ₽`;
      });
    };

    priceRange.addEventListener("input", updateScenario);
    updateScenario();
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = [...document.querySelectorAll("[data-reveal]")];
  if (!reducedMotion && "IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    requestAnimationFrame(() => {
      document.documentElement.classList.add("motion-ready");
      revealItems.forEach((item) => observer.observe(item));
    });
  }
})();
