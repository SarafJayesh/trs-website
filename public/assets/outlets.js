(() => {
  const encode = (value) => encodeURIComponent(value || '');
  const text = (value) => String(value ?? '');
  const escapeHtml = (value) => text(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const isUsableUrl = (value) => /^https?:\/\//.test(value || '') || /^tel:/.test(value || '');
  const mapsUrl = (outlet) => outlet.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encode(outlet.mapsQuery || outlet.address || outlet.name)}`;
  const swiggyUrl = (outlet) => outlet.swiggyUrl || `https://www.swiggy.com/search?query=${encode(outlet.swiggyQuery || outlet.fullName || outlet.name)}`;
  const zomatoUrl = (outlet) => outlet.zomatoUrl || `https://www.zomato.com/bangalore/restaurants?q=${encode(outlet.zomatoQuery || outlet.fullName || outlet.name)}`;
  const outletPhrase = (count) => `${count} Bengaluru outlet${count === 1 ? '' : 's'}`;

  const action = ({ href, label, variant = 'outline', external = false }) => {
    const className = `button-link button-link--${variant}`;
    if (!isUsableUrl(href)) return `<span class="${className} button-link--muted" aria-disabled="true">${escapeHtml(label)}</span>`;
    const target = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${escapeHtml(href)}"${target} class="${className}">${escapeHtml(label)}</a>`;
  };

  const optionalAction = (args) => (isUsableUrl(args.href) ? action(args) : '');

  const outletActions = (outlet) => `
    <div class="outlet-actions">
      ${action({ href: mapsUrl(outlet), label: 'Directions', variant: 'outline', external: true })}
      ${action({ href: 'Reserve.dc.html', label: 'Reserve', variant: 'solid' })}
      ${optionalAction({ href: outlet.phoneHref, label: outlet.phone || 'Call', variant: 'outline' })}
      ${optionalAction({ href: outlet.whatsappUrl, label: outlet.whatsappLabel || 'WhatsApp', variant: 'outline', external: true })}
    </div>
  `;

  const orderActions = (outlet) => `
    <div class="outlet-actions outlet-actions--compact">
      ${action({ href: swiggyUrl(outlet), label: 'Swiggy', variant: 'solid', external: true })}
      ${action({ href: zomatoUrl(outlet), label: 'Zomato', variant: 'outline', external: true })}
    </div>
  `;

  const renderCounts = (outlets) => {
    const count = outlets.length;
    document.querySelectorAll('[data-outlet-count]').forEach((node) => {
      node.textContent = String(count);
    });
    document.querySelectorAll('[data-outlet-count-label]').forEach((node) => {
      node.textContent = `BENGALURU | ${outletPhrase(count).toUpperCase()}`;
    });
    document.querySelectorAll('[data-outlet-count-copy]').forEach((node) => {
      node.textContent = outletPhrase(count);
    });
  };

  const renderHomeFinderCard = (container, outlet) => {
    if (!outlet) {
      container.innerHTML = `
        <div class="outlet-finder-empty">
          Choose an outlet to see directions, reservations, delivery links and contact options.
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <article class="outlet-finder-card">
        <div>
          <div class="outlet-card-name">${escapeHtml(outlet.name)}</div>
          <div class="outlet-card-meta">${escapeHtml(outlet.shortAddress || outlet.address)}<br>${escapeHtml(outlet.shortTimings || outlet.timings)}</div>
        </div>
        <div>
          ${outletActions(outlet)}
          ${orderActions(outlet)}
        </div>
      </article>
    `;
  };

  const renderHomeFinder = (outlets) => {
    document.querySelectorAll('[data-home-outlet-finder]').forEach((finder) => {
      const select = finder.querySelector('[data-home-outlet-select]');
      const result = finder.querySelector('[data-home-outlet-result]');
      if (!select || !result) return;

      if (select.dataset.outletsLoaded !== String(outlets.length)) {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Choose an outlet</option>' + outlets.map((outlet) => (
          `<option value="${escapeHtml(outlet.id)}">${escapeHtml(outlet.name)}</option>`
        )).join('');
        select.value = currentValue;
        select.dataset.outletsLoaded = String(outlets.length);
      }

      const selected = outlets.find((outlet) => outlet.id === select.value);
      renderHomeFinderCard(result, selected);

      if (!select.dataset.finderBound) {
        select.addEventListener('change', () => {
          renderHomeFinderCard(result, outlets.find((outlet) => outlet.id === select.value));
        });
        select.dataset.finderBound = 'true';
      }
    });
  };

  const renderHomeGrid = (outlets) => {
    document.querySelectorAll('[data-outlet-preview-grid]').forEach((grid) => {
      if (grid.dataset.outletsRendered === String(outlets.length)) return;
      grid.innerHTML = outlets.map((outlet) => `
        <a href="Outlets.dc.html#${escapeHtml(outlet.id)}" class="outlet-preview-card">
          <div class="outlet-card-name">${escapeHtml(outlet.name)}</div>
          <div class="outlet-card-meta">Since ${escapeHtml(outlet.opened)}<br>${escapeHtml(outlet.shortAddress || outlet.address)}<br>${escapeHtml(outlet.shortTimings || outlet.timings)}</div>
        </a>
      `).join('');
      const firstCard = grid.querySelector('.outlet-preview-card');
      if (firstCard) firstCard.classList.add('is-featured');
      grid.dataset.outletsRendered = String(outlets.length);
    });
  };

  const renderOutletCards = (outlets) => {
    document.querySelectorAll('[data-outlet-card-grid]').forEach((grid) => {
      if (grid.dataset.outletsRendered === String(outlets.length)) return;
      grid.innerHTML = outlets.map((outlet) => `
        <article id="${escapeHtml(outlet.id)}" class="outlet-detail-card">
          <div class="ph outlet-photo-placeholder">The Rasoiya Street ${escapeHtml(outlet.name)}</div>
          <div class="outlet-detail-body">
            <div class="outlet-detail-name">${escapeHtml(outlet.name)}</div>
            <div class="outlet-detail-meta">Since ${escapeHtml(outlet.opened)}</div>
            <div class="outlet-detail-info">${escapeHtml(outlet.address)}<br>${escapeHtml(outlet.timings)}${outlet.phone ? `<br>${escapeHtml(outlet.phone)}` : ''}</div>
            ${outletActions(outlet)}
          </div>
        </article>
      `).join('');
      grid.dataset.outletsRendered = String(outlets.length);
    });
  };

  const renderOrderGrid = (outlets) => {
    document.querySelectorAll('[data-outlet-order-grid]').forEach((grid) => {
      if (grid.dataset.outletsRendered === String(outlets.length)) return;
      grid.innerHTML = outlets.map((outlet) => `
        <div class="order-outlet-card">
          <div class="order-outlet-name">${escapeHtml(outlet.name)}</div>
          <a href="${escapeHtml(swiggyUrl(outlet))}" target="_blank" rel="noopener noreferrer" class="order-link order-link--primary">Swiggy</a>
          <a href="${escapeHtml(zomatoUrl(outlet))}" target="_blank" rel="noopener noreferrer" class="order-link">Zomato</a>
        </div>
      `).join('');
      grid.dataset.outletsRendered = String(outlets.length);
    });
  };

  const renderGoogleReviewGrid = (outlets) => {
    document.querySelectorAll('[data-google-review-grid]').forEach((grid) => {
      if (grid.dataset.outletsRendered === String(outlets.length)) return;
      grid.innerHTML = outlets.map((outlet) => `
        <a href="${escapeHtml(mapsUrl(outlet))}" target="_blank" rel="noopener noreferrer" class="google-review-card">
          <div class="google-review-label">Google Reviews</div>
          <div class="google-review-name">${escapeHtml(outlet.name)}</div>
          <div class="google-review-copy">Read recent guest reviews, ratings and location details for this outlet on Google.</div>
          <div class="google-review-link">Read Google reviews -></div>
        </a>
      `).join('');
      grid.dataset.outletsRendered = String(outlets.length);
    });
  };

  const renderOutletSelects = (outlets) => {
    document.querySelectorAll('[data-outlet-select]').forEach((select) => {
      if (select.dataset.outletsLoaded === String(outlets.length)) return;
      const currentValue = select.value;
      select.innerHTML = '<option value="">Choose an outlet</option>' + outlets.map((outlet) => (
        `<option value="${escapeHtml(outlet.name)}">${escapeHtml(outlet.name)}</option>`
      )).join('');
      select.value = currentValue;
      select.dataset.outletsLoaded = String(outlets.length);
    });
  };

  const renderStoryTimeline = (outlets) => {
    document.querySelectorAll('[data-outlet-timeline]').forEach((container) => {
      if (container.dataset.outletsRendered === String(outlets.length)) return;
      container.innerHTML = outlets.map((outlet, index) => {
        const description = index === 0
          ? `The first Rasoiya Street opens in ${outlet.name} - the promise becomes a restaurant.`
          : `${outlet.name} opens - the same standard of care reaches another Bengaluru location.`;
        return `
          <div class="timeline-item">
            <div class="timeline-year">${escapeHtml(outlet.opened)}</div>
            <p>${escapeHtml(description)}</p>
          </div>
        `;
      }).join('');
      container.dataset.outletsRendered = String(outlets.length);
    });
  };

  const renderAll = (outlets) => {
    renderCounts(outlets);
    renderHomeFinder(outlets);
    renderHomeGrid(outlets);
    renderOutletCards(outlets);
    renderOrderGrid(outlets);
    renderGoogleReviewGrid(outlets);
    renderOutletSelects(outlets);
    renderStoryTimeline(outlets);
  };

  const loadOutlets = () => {
    try {
      const outlets = window.TRS_OUTLETS;
      if (!Array.isArray(outlets) || outlets.length === 0) {
        throw new Error('Outlet data is not available.');
      }
      renderAll(outlets);
      [50, 200, 600, 1200].forEach((delay) => {
        setTimeout(() => renderAll(outlets), delay);
      });
      document.addEventListener('focusin', (event) => {
        if (event.target?.matches?.('[data-outlet-select]')) renderOutletSelects(outlets);
      });
    } catch (error) {
      console.error(error);
      document.querySelectorAll('[data-outlet-error]').forEach((node) => {
        node.hidden = false;
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadOutlets);
  } else {
    loadOutlets();
  }
})();
