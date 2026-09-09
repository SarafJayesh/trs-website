(function () {
  let autoHideCleanup = null;

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);

  const slugPart = (value) => String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const sectionCategories = (section) => [
    ...new Set(section.items.map((item) => item.group).filter(Boolean))
  ];

  const itemRow = (item, options = {}) => {
    const tags = (item.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
    const description = item.description ? `<div class="concept-item-description">${escapeHtml(item.description)}</div>` : "";
    const tagBlock = tags ? `<div class="concept-tags">${tags}</div>` : "";
    const meta = options.showMeta ? `<div class="concept-item-meta">${description}${tagBlock}</div>` : description;

    return `
      <div class="concept-item">
        <div class="concept-item-name">${escapeHtml(item.name)}</div>
        ${meta}
      </div>
    `;
  };

  const groupedRows = (section, options = {}) => {
    let currentGroup = "";
    return section.items.map((item) => {
      const groupTitle = item.group && item.group !== currentGroup
        ? `<div class="concept-subhead" id="${section.id}-${slugPart(item.group)}">${escapeHtml(item.group)}</div>`
        : "";
      currentGroup = item.group || currentGroup;
      return `${groupTitle}${itemRow(item, options)}`;
    }).join("");
  };

  const categoryChips = (section) => {
    const categories = sectionCategories(section);
    if (!categories.length) return "";
    return `
      <div class="concept-category-strip" aria-label="${escapeHtml(section.title)} categories">
        ${categories.map((category) => `<a href="#${section.id}-${slugPart(category)}">${escapeHtml(category)}</a>`).join("")}
      </div>
    `;
  };

  const sectionBlock = (section, options = {}) => `
    <section class="concept-section" id="${section.id}">
      <div class="concept-section-header">
        <h2>${escapeHtml(section.title)}</h2>
        <p>${escapeHtml(section.copy)}</p>
      </div>
      <div class="concept-list">
        ${groupedRows(section, options)}
      </div>
      ${section.note ? `<p class="concept-note">${escapeHtml(section.note)}</p>` : ""}
    </section>
  `;

  const hero = (title, copy, label) => `
    <section class="concept-hero">
      <div>
        <div class="concept-label">${escapeHtml(label)}</div>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(copy)}</p>
      </div>
      <div class="concept-actions">
        <a href="Reserve.dc.html">Reserve a table</a>
        <a href="Outlets.dc.html#order">Order online</a>
      </div>
    </section>
  `;

  const footerCta = `
    <section class="concept-cta">
      <h2>Hungry yet? Book a table or order from your nearest outlet.</h2>
      <div class="concept-actions">
        <a href="Reserve.dc.html">Reserve a table</a>
        <a href="Outlets.dc.html#order">Order online</a>
      </div>
    </section>
  `;

  const cleanConcept = (menu, sectionLinks, hero, sectionBlock, footerCta) => `
    ${hero(
      "The complete pure-veg menu.",
      "Browse tandoor, North Indian curries, pizza, pasta, Asian favourites, chaat, sizzlers, breads and desserts. Jain preparations are available on request.",
      "Full menu"
    )}
    <nav class="concept-nav">${sectionLinks}</nav>
    ${menu.sections.map((section) => sectionBlock(section)).join("")}
    ${footerCta}
  `;

  const decisionConcept = (menu, sectionLinks, hero, sectionBlock, footerCta) => `
    ${hero(
      "What would you like to eat today?",
      "Start with a craving, then choose the exact dish. Built for families, groups and mixed tables where everyone wants something different.",
      "Choose faster"
    )}
    <section class="concept-paths">
      ${menu.paths.map((path) => `
        <a class="concept-path-card" href="#${path.sections[0]}">
          <span>${escapeHtml(path.title)}</span>
          <p>${escapeHtml(path.copy)}</p>
        </a>
      `).join("")}
    </section>
    <section class="concept-highlights">
      <div class="concept-section-copy">
        <div class="concept-eyebrow">Popular starting points</div>
        <h2>Easy picks for the table.</h2>
      </div>
      <div class="concept-highlight-grid">
        ${menu.highlights.map((item) => `<a href="#menu-start">${escapeHtml(item)}</a>`).join("")}
      </div>
    </section>
    <nav class="concept-nav" id="menu-start">${sectionLinks}</nav>
    ${menu.sections.map((section) => sectionBlock(section, { showMeta: true })).join("")}
    ${footerCta}
  `;

  const explorerConcept = (menu, hero, sectionBlock, footerCta) => `
    ${hero(
      "The complete pure-veg menu.",
      "Browse tandoor, North Indian curries, pizza, pasta, Asian favourites, chaat, sizzlers, breads and desserts. Jain preparations are available on request.",
      "Full menu"
    )}
    <section class="concept-explorer">
      <div class="concept-explorer-main">
        ${menu.sections.map((section) => sectionBlock(section, { showMeta: true })).join("")}
      </div>
    </section>
    ${footerCta}
  `;

  const initAutoHideTopbar = () => {
    if (autoHideCleanup) autoHideCleanup();

    const page = document.querySelector(".concept-page");
    const topbar = document.querySelector(".concept-topbar");
    if (!page || !topbar) return;

    let lastScrollY = window.scrollY;
    let frame = 0;

    const setHeaderHeight = () => {
      page.style.setProperty("--site-header-height", `${Math.round(topbar.offsetHeight)}px`);
    };

    const update = () => {
      frame = 0;
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;

      if (currentY < 80 || delta < -6) {
        page.classList.remove("is-site-header-hidden");
      } else if (delta > 8) {
        page.classList.add("is-site-header-hidden");
      }

      lastScrollY = Math.max(currentY, 0);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    setHeaderHeight();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", setHeaderHeight);

    autoHideCleanup = () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", setHeaderHeight);
      if (frame) window.cancelAnimationFrame(frame);
    };
  };

  const render = () => {
    const menu = window.TRS_MENU;
    const root = document.querySelector("[data-menu-concept-root]");
    const concept = document.body.dataset.menuConcept || "clean";

    if (!menu || !root) return false;

    const sectionLinks = menu.sections.map((section) => (
      `<a href="#${section.id}">${escapeHtml(section.title)}</a>`
    )).join("");

    const sectionBlock = (section, options = {}) => `
      <section class="concept-section" id="${section.id}">
        <div class="concept-section-header">
          <h2>${escapeHtml(section.title)}</h2>
          <p>${escapeHtml(section.copy)}</p>
        </div>
        <div class="concept-list">
          ${groupedRows(section, options)}
        </div>
        ${section.note ? `<p class="concept-note">${escapeHtml(section.note)}</p>` : ""}
      </section>
    `;

    const hero = (title, copy, label) => `
      <section class="concept-hero">
        <div>
          <div class="concept-label">${escapeHtml(label)}</div>
          <h1>${escapeHtml(title)}</h1>
          <p>${escapeHtml(copy)}</p>
        </div>
        <div class="concept-actions">
          <a href="Reserve.dc.html">Reserve a table</a>
          <a href="Outlets.dc.html#order">Order online</a>
        </div>
      </section>
    `;

    const footerCta = `
      <section class="concept-cta">
        <h2>Hungry yet? Book a table or order from your nearest outlet.</h2>
        <div class="concept-actions">
          <a href="Reserve.dc.html">Reserve a table</a>
          <a href="Outlets.dc.html#order">Order online</a>
        </div>
      </section>
    `;

    const renderers = {
      clean: () => cleanConcept(menu, sectionLinks, hero, sectionBlock, footerCta),
      decision: () => decisionConcept(menu, sectionLinks, hero, sectionBlock, footerCta),
      explorer: () => explorerConcept(menu, hero, sectionBlock, footerCta)
    };

    root.innerHTML = (renderers[concept] || renderers.clean)();
    initAutoHideTopbar();
    return true;
  };

  const start = () => {
    if (render()) return;
    [50, 150, 400, 900].forEach((delay) => {
      window.setTimeout(render, delay);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
