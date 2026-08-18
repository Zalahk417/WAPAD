(() => {
  const grid = document.querySelector('[data-guide-grid]');
  if (!grid) return;

  const escapeHtml = (value = '') => value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const renderCard = (item) => {
    const article = document.createElement('article');
    article.className = 'guide-card guide-card--cms';
    article.dataset.guideCard = '';
    article.dataset.tags = [item.pillar, item.type, item.title].filter(Boolean).join(' ').toLowerCase();

    const label = item.pillar || item.type || 'KNOWLEDGE';
    const date = item.publishDate ? new Date(item.publishDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
    article.innerHTML = `
      <div class="guide-card__meta"><span>${escapeHtml(label.toUpperCase())}</span><b>${escapeHtml(date)}</b></div>
      <h2>${escapeHtml(item.title)}</h2>
      <p>${escapeHtml(item.excerpt || item.body || '')}</p>
      <a class="button button--text" href="/knowledge/${encodeURIComponent(item.slug)}">Read guide <span>↗</span></a>
    `;
    return article;
  };

  fetch('/api/content?type=Article', { headers: { accept: 'application/json' } })
    .then((response) => {
      if (!response.ok) throw new Error('CMS unavailable');
      return response.json();
    })
    .then(({ items = [] }) => {
      items.forEach((item) => grid.prepend(renderCard(item)));
      document.dispatchEvent(new CustomEvent('wapad:cms-loaded'));
    })
    .catch(() => {
      // Existing static articles remain the safe fallback.
    });
})();
