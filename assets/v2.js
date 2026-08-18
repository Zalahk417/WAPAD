(() => {
  const $ = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => [...c.querySelectorAll(s)];

  $('[data-year]') && ($('[data-year]').textContent = new Date().getFullYear());

  const menuBtn = $('[data-menu-btn]');
  const menu = $('[data-menu]');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    $$('a', menu).forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded','false');
    }));
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }});
  }, {threshold:.08, rootMargin:'0px 0px -35px'});
  $$('.reveal').forEach(el => observer.observe(el));

  const consoleData = {
    jewellery:{title:'Gold jewellery',sub:'Hallmark · construction · stones · maker',score:'04',route:'Is the piece worth more intact than as recoverable metal?',bars:['78%','56%','68%']},
    watches:{title:'Watch',sub:'Reference · originality · movement · condition',score:'06',route:'Does originality or reference value dominate material value?',bars:['22%','86%','74%']},
    bullion:{title:'Bullion / coin',sub:'Mint · dimensions · weight · liquidity',score:'03',route:'Do independent checks support authenticity before liquidity is assumed?',bars:['94%','72%','82%']},
    estate:{title:'Estate parcel',sub:'Triage · grouping · provenance · outliers',score:'08',route:'Which items deserve separation, and which evidence must stay together?',bars:['46%','61%','39%']}
  };
  $$('[data-console]').forEach(btn => btn.addEventListener('click', () => {
    const d = consoleData[btn.dataset.console]; if (!d) return;
    $$('[data-console]').forEach(b => {b.classList.remove('active');b.setAttribute('aria-selected','false')});
    btn.classList.add('active'); btn.setAttribute('aria-selected','true');
    $('[data-console-title]').textContent=d.title; $('[data-console-subtitle]').textContent=d.sub; $('[data-console-score]').textContent=d.score; $('[data-console-route]').textContent=d.route;
    $$('.console__bars i').forEach((bar,i)=>bar.style.setProperty('--p',d.bars[i]));
  }));

  const search = $('[data-knowledge-search]');
  const filterButtons = $$('[data-filter]');
  const cards = $$('[data-guide-card]');
  let activeFilter='all';
  function applyKnowledgeFilter(){
    const q=(search?.value||'').trim().toLowerCase();
    cards.forEach(card=>{
      const tags=(card.dataset.tags||'').toLowerCase();
      const text=card.textContent.toLowerCase();
      const matchesFilter=activeFilter==='all'||tags.includes(activeFilter);
      const matchesSearch=!q||tags.includes(q)||text.includes(q);
      card.hidden=!(matchesFilter&&matchesSearch);
    });
  }
  if(search) search.addEventListener('input',applyKnowledgeFilter);
  filterButtons.forEach(btn=>btn.addEventListener('click',()=>{
    activeFilter=btn.dataset.filter;
    filterButtons.forEach(b=>b.classList.toggle('active',b===btn));
    applyKnowledgeFilter();
  }));

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(()=>{}));
  }
})();