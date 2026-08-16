(()=>{
const q=(s,c=document)=>c.querySelector(s),qa=(s,c=document)=>[...c.querySelectorAll(s)];

function addHead(){
  if(!q('link[href="assets/site-05.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='assets/site-05.css';document.head.appendChild(l)}
  if(!q('link[rel="icon"]')){const l=document.createElement('link');l.rel='icon';l.type='image/svg+xml';l.href='assets/favicon.svg';document.head.appendChild(l)}
  if(!q('meta[name="robots"]')){const m=document.createElement('meta');m.name='robots';m.content='noindex,nofollow';document.head.appendChild(m)}
}

function rebrandPage(root=document){
  document.title=document.title.replace(/\bWAPA\b/g,'WAPAD');
  ['meta[name="description"]','meta[property="og:title"]','meta[property="og:description"]'].forEach(sel=>{const m=q(sel);if(m&&m.content)m.content=m.content.replace(/\bWAPA\b/g,'WAPAD')});
  qa('[aria-label],[title]').forEach(el=>['aria-label','title'].forEach(a=>{if(el.hasAttribute(a))el.setAttribute(a,el.getAttribute(a).replace(/\bWAPA\b/g,'WAPAD'))}));
  const walker=document.createTreeWalker(root.body||root,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement&&['SCRIPT','STYLE','NOSCRIPT'].includes(n.parentElement.tagName)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(n=>{if(/\bWAPA\b/.test(n.nodeValue))n.nodeValue=n.nodeValue.replace(/\bWAPA\b/g,'WAPAD')});
}

function patchPage(){
  rebrandPage();
  const tb=q('.topbar b');if(tb)tb.textContent='Controlled pre-launch';
  const nav=q('.navcta');if(nav){nav.href='#assessment';nav.textContent='Start assessment'}
  const hp=q('.hero-actions .btn.primary');if(hp){hp.href='#assessment';hp.innerHTML='<span>Start an assessment</span><span>↘</span>'}
  const rc=q('.router-copy');if(rc&&!q('#router-assess'))rc.insertAdjacentHTML('beforeend','<a class="router-cta" id="router-assess" href="#assessment"><span>Use this asset type</span><span>→</span></a>');
  const pa=q('.pack-actions');if(pa&&!pa.querySelector('a[href="#assessment"]'))pa.insertAdjacentHTML('afterbegin','<a class="btn primary" href="#assessment"><span>Use this in assessment</span><span>→</span></a>');
  const fe=q('#faq .eyebrow');if(fe)fe.textContent='08 · Questions worth asking';
  const fp=q('.final-actions .btn.primary');if(fp){fp.href='#assessment';fp.innerHTML='<span>Start first-pass assessment</span><span>↑</span>'}
  const fn=q('.final-note');if(fn)fn.textContent='The first-pass assessment creates a private case brief in your browser. A secure submission endpoint and public intake address are the remaining handoff pieces before public launch.';
  const links=q('.footlinks');if(links)links.innerHTML='<a href="#method">Method</a><a href="#trust">Standards</a><a href="#assessment">Assessment</a><a href="privacy.html">Privacy</a><a href="sources.html">Sources</a><a href="#top">Top ↑</a>';
  const fl=q('#float-cta');if(fl){fl.textContent='Start assessment →';fl.onclick=()=>q('#assessment')?.scrollIntoView({behavior:'smooth'})}
  const packCopy=q('#copy-pack');
  if(packCopy)packCopy.addEventListener('click',async e=>{e.preventDefault();e.stopImmediatePropagation();const asset=q('.asset-tab.active strong')?.textContent||'Not selected',checks=qa('.check input'),selected=checks.filter(c=>c.checked).map(c=>'✓ '+c.dataset.line),missing=checks.filter(c=>!c.checked).map(c=>'○ '+c.dataset.line),text=`WAPAD ASSET PREPARATION\nAsset type: ${asset}\n\nREADY\n${selected.join('\n')||'None completed yet'}\n\nTO DO\n${missing.join('\n')||'All preparation steps complete'}\n\nPriority: price / speed / certainty (circle one)`;try{await navigator.clipboard.writeText(text);q('#copy-state').textContent='Copied. Paste this into your notes or enquiry.'}catch{q('#copy-state').textContent='Clipboard blocked by browser. Select the checklist manually.'}},true);
}

const routeRules={
'Gold jewellery':{title:'Separate metal floor from resale value',copy:'Confirm marks, construction and non-gold components first. If the piece is signed, unusual, stone-set or well made, compare the resale route before treating it as scrap.',flags:['HALLMARKS','PURITY','MAKER','STONES']},
'Watch':{title:'Identify the reference before metal value',copy:'Reference, originality, dial, movement, bracelet and service history can dominate melt value. Avoid polishing, opening or dismantling until the watch is properly identified.',flags:['REFERENCE','ORIGINALITY','CONDITION','MARKET']},
'Bullion or coin':{title:'Verify authenticity and liquidity',copy:'Recognised brand, dimensions, packaging and market spread matter alongside fineness. Numismatic coins and natural gold should be routed separately from generic bullion.',flags:['AUTHENTICITY','FINENESS','SPREAD','LIQUIDITY']},
'Estate or mixed lot':{title:'Triage the parcel before separating it',copy:'Keep boxes, papers and family groupings together. Photograph first, then isolate likely watches, signed jewellery, gemstones and true scrap before any refining or stone removal.',flags:['TRIAGE','PROVENANCE','OUTLIERS','NO ALTERATION']},
'Gemstone':{title:'Specialist identification before pricing',copy:'Treatment, species, origin, cut, mounting and laboratory evidence can materially change value. A specialist gemmological pathway may be the correct first route.',flags:['IDENTITY','TREATMENT','QUALITY','SPECIALIST']},
'Other precious asset':{title:'Identify the value mechanism first',copy:'Start by establishing what creates value: precious-metal content, maker, rarity, function, provenance, or a specialist collecting market. Do not assume the metal is the whole story.',flags:['IDENTIFY','DOCUMENT','BENCHMARK','ROUTE']}
};
const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

function initDisclosureA11y(){
  qa('.trust-btn,.faq-q').forEach(btn=>{const item=btn.parentElement;btn.setAttribute('aria-expanded',item.classList.contains('open')?'true':'false');btn.addEventListener('click',()=>requestAnimationFrame(()=>btn.setAttribute('aria-expanded',item.classList.contains('open')?'true':'false')))});
}

function initAssessment(){
  const form=q('#assessment-form');if(!form)return;
  rebrandPage();
  const panels=qa('.ass-panel'),steps=qa('.ass-step'),files=q('#asset-files'),fileList=q('#file-list');let lastBrief='';
  const setStep=n=>{panels.forEach(p=>p.classList.toggle('active',p.dataset.panel===String(n)));steps.forEach(b=>{const active=b.dataset.step===String(n);b.classList.toggle('active',active);b.setAttribute('aria-current',active?'step':'false')});if(n===3)buildCase();q('#assessment').scrollIntoView({behavior:'smooth',block:'start'})};
  qa('.ass-next').forEach(b=>b.addEventListener('click',()=>setStep(+b.dataset.next)));qa('.ass-back').forEach(b=>b.addEventListener('click',()=>setStep(+b.dataset.back)));steps.forEach(b=>b.addEventListener('click',()=>setStep(+b.dataset.step)));
  files?.addEventListener('change',()=>{const names=[...files.files].slice(0,8).map(f=>f.name);fileList.textContent=names.length?names.join(' · '):'No files selected'});
  const fd=()=>Object.fromEntries(new FormData(form).entries());
  function buildCase(){
    const d=fd(),route=routeRules[d.assetType]||routeRules['Other precious asset'],checks=qa('.check input'),ready=checks.filter(c=>c.checked).length,fileNames=files&&files.files.length?[...files.files].map(f=>f.name).join(', '):'No photos selected in browser',id='WA-'+new Date().toISOString().slice(2,10).replaceAll('-','')+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
    q('#case-id').textContent=id;
    const rows=[['Asset',d.assetType||'—'],['Goal',d.goal||'—'],['Priority',d.priority||'—'],['Known information',d.known||'Not provided'],['Marks / reference',d.marks||'Unknown'],['Approx. weight',d.weight||'Unknown'],['Location',d.location||'—'],['Papers / provenance',d.papers||'—'],['Condition / concerns',d.condition||'Not provided'],['Evidence checklist',ready+'/6 ready'],['Local photo list',fileNames]];
    q('#case-summary').innerHTML=rows.map(([k,v])=>`<div class="case-row"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('');q('#route-title').textContent=route.title;q('#route-copy').textContent=route.copy;q('#route-flags').innerHTML=route.flags.map(x=>`<span>${esc(x)}</span>`).join('');
    lastBrief=`WAPAD FIRST-PASS CASE\n${id}\n\n${rows.map(([k,v])=>k+': '+v).join('\n')}\n\nLIKELY FIRST ROUTE\n${route.title}\n${route.copy}\nFlags: ${route.flags.join(' / ')}\n\nDraft only — not a valuation, offer, authentication or gemmological opinion.`;
  }
  q('#copy-brief')?.addEventListener('click',async()=>{if(!lastBrief)buildCase();try{await navigator.clipboard.writeText(lastBrief);q('#handoff-note').textContent='Case brief copied. Paste it into your preferred secure enquiry channel.'}catch{q('#handoff-note').textContent='Clipboard access was blocked. Use Download .txt instead.'}});
  q('#download-brief')?.addEventListener('click',()=>{if(!lastBrief)buildCase();const blob=new Blob([lastBrief],{type:'text/plain;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(q('#case-id').textContent||'WAPAD-case')+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)});
  q('#email-brief')?.addEventListener('click',()=>{if(!lastBrief)buildCase();location.href=`mailto:?subject=${encodeURIComponent('WAPAD first-pass assessment — '+q('#case-id').textContent)}&body=${encodeURIComponent(lastBrief+'\n\nPlease attach the relevant photos before sending.')}`;q('#handoff-note').textContent='Email draft opened without a recipient. A dedicated WAPAD intake address can be connected before launch.'});
  const map={jewellery:'Gold jewellery',watches:'Watch',bullion:'Bullion or coin',estate:'Estate or mixed lot'};
  qa('.asset-tab').forEach(btn=>btn.addEventListener('click',()=>{const r=q(`#assessment-form input[name="assetType"][value="${map[btn.dataset.key]}"]`);if(r)r.checked=true}));
  q('#router-assess')?.addEventListener('click',()=>{const k=q('.asset-tab.active')?.dataset.key,r=q(`#assessment-form input[name="assetType"][value="${map[k]}"]`);if(r)r.checked=true});
  const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.08});qa('#assessment .reveal').forEach(e=>io.observe(e));
  setStep(1);
}

async function boot(){
  addHead();patchPage();initDisclosureA11y();
  const pack=q('#prepare');
  if(pack&&!q('#assessment')){try{const r=await fetch('assessment-fragment.html',{cache:'no-cache'});if(!r.ok)throw new Error('fragment');pack.insertAdjacentHTML('afterend',await r.text())}catch{pack.insertAdjacentHTML('afterend','<section class="assessment-desk" id="assessment"><div class="wrap"><h2>Assessment workspace unavailable.</h2><p>Please use the evidence checklist while this component reloads.</p></div></section>') }}
  rebrandPage();initAssessment();
}
boot();
})();