(() => {
  document.documentElement.classList.add('js-v3');
  const $$ = (s,c=document) => [...c.querySelectorAll(s)];
  const $ = (s,c=document) => c.querySelector(s);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animated = $$('[data-reveal],[data-pop]');
  if (reduced || !('IntersectionObserver' in window)) {
    animated.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = Number(el.dataset.delay || 0);
        window.setTimeout(() => el.classList.add('is-in'), delay);
        io.unobserve(el);
      });
    }, {threshold: .10, rootMargin: '0px 0px -7%'});
    animated.forEach(el => io.observe(el));
  }

  const header = $('[data-header]');
  const flow = $('[data-flow]');
  const flowLine = $('[data-flow-line]');
  const parallax = $$('[data-parallax]');
  let ticking = false;
  function renderScroll(){
    ticking = false;
    const y = window.scrollY || 0;
    if (header) header.classList.toggle('is-scrolled', y > 50);
    if (!reduced) parallax.forEach(el => {
      const speed = Number(el.dataset.parallax || 0);
      const rect = el.getBoundingClientRect();
      const centre = rect.top + rect.height / 2 - innerHeight / 2;
      el.style.transform = `translate3d(0,${Math.max(-80, Math.min(80, -centre * speed))}px,0)`;
    });
    if (flow && flowLine) {
      const r = flow.getBoundingClientRect();
      const start = innerHeight * .68;
      const total = r.height + start - innerHeight * .2;
      const progress = Math.max(0, Math.min(1, (start - r.top) / Math.max(1,total)));
      flowLine.style.height = `${progress * 100}%`;
    }
  }
  function onScroll(){ if (!ticking) { ticking = true; requestAnimationFrame(renderScroll); } }
  addEventListener('scroll', onScroll, {passive:true}); addEventListener('resize', onScroll); renderScroll();

  const demoData = {
    estate: {title:'Sort an inherited box without destroying optionality.',copy:'Separate likely precious metal, signed/collectable pieces, obvious costume material and items that need professional identification before the family splits or disposes of anything.',routes:[['A','Triage','first'],['B','Formal value','selected pieces'],['C','Auction / resale','where premium exists'],['D','Metal route','where it doesn’t']]},
    watch: {title:'Work out whether the watch is a reference, a parts problem or just metal.',copy:'Photograph the dial, case, caseback, bracelet, clasp, serial/reference and papers. Compare the intact secondary market before any irreversible testing or disposal decision.',routes:[['A','Identify','reference'],['B','Originality','parts + condition'],['C','Specialist','if risk is high'],['D','Market / metal','compare both']]},
    gold: {title:'Separate a recoverable floor from everything that may sit above it.',copy:'Start with hallmarks, construction, stones, maker and weight. The gold floor matters, but it should not silently erase a signed, antique or commercially desirable object.',routes:[['A','Metal floor','baseline'],['B','Maker / age','premium check'],['C','Stone path','if material'],['D','Sell route','after comparison']]},
    bullion: {title:'Liquidity only works after authenticity risk is controlled.',copy:'Mint, dimensions, weight, packaging, serialisation and market spread matter. A familiar-looking bar is not the same thing as an independently verified liquid asset.',routes:[['A','Identity','mint + product'],['B','Verify','weight + dimensions'],['C','Premium','coin / scarcity'],['D','Liquidity','buyer spread']]}
  };
  const demoTitle = $('[data-demo-title]'); const demoCopy = $('[data-demo-copy]'); const demoRoutes = $('[data-demo-routes]');
  $$('[data-demo]').forEach(btn => btn.addEventListener('click', () => {
    const d = demoData[btn.dataset.demo]; if (!d) return;
    $$('[data-demo]').forEach(b => b.classList.toggle('active', b === btn));
    if (demoTitle) demoTitle.textContent = d.title; if (demoCopy) demoCopy.textContent = d.copy;
    if (demoRoutes) {
      demoRoutes.animate([{opacity:.2,transform:'translateY(7px)'},{opacity:1,transform:'none'}],{duration:280,easing:'ease-out'});
      demoRoutes.innerHTML = d.routes.map(r => `<div><span>${r[0]}</span><strong>${r[1]}</strong><small>${r[2]}</small></div>`).join('');
    }
  }));

  const counters = $$('[data-count]');
  if (counters.length) {
    const countUp = el => {
      const end = Number(el.dataset.count || 0), t0 = performance.now(), dur = reduced ? 0 : 900;
      const frame = t => { const p = dur ? Math.min(1,(t-t0)/dur) : 1; const eased = 1-Math.pow(1-p,3); el.textContent = String(Math.round(end*eased)); if(p<1) requestAnimationFrame(frame); };
      requestAnimationFrame(frame);
    };
    if ('IntersectionObserver' in window && !reduced) {
      const ci = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ countUp(e.target); ci.unobserve(e.target); }}),{threshold:.6}); counters.forEach(c=>ci.observe(c));
    } else counters.forEach(countUp);
  }
})();
