(() => {
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];

  if(!document.querySelector('link[href="assets/paid.css"]')){
    const link=document.createElement('link');link.rel='stylesheet';link.href='assets/paid.css';document.head.appendChild(link);
  }

  const stepData={
    route:{eyebrow:'STEP 01 / AVAILABLE NOW · A$0',title:'Get the evidence usable before you ask for a price.',copy:'The Route Check guides you through asset-specific photographs and checks basic resolution, lighting, glare and likely blur on your device. You do not need to know how to photograph valuables professionally.',bullets:['Guided shot-by-shot capture','Evidence Ready gate before any paid pathway','Photos stay on your device in the current pilot'],cta:['Run Route Check','assessment.html']},
    brief:{eyebrow:'STEP 02 / PAID PILOT · A$69',title:'Turn one Evidence Ready asset into a human-reviewed Decision Brief.',copy:'WAPAD starts from a structured case rather than a random photo dump, researches the relevant market routes, separates known from uncertain evidence and gives you a concise written recommendation on what deserves attention next.',bullets:['Machine-prepared case + human review','Comparable-market context where useful and available','Confidence notes + evidence gaps + written next step'],cta:['See the A$69 Decision Brief','services.html#decision-brief']},
    expert:{eyebrow:'STEP 03 / SPECIALIST ONLY WHEN WARRANTED',title:'Take the right unanswered question to the right specialist.',copy:'If the Decision Brief shows that a physical or credentialled answer could materially change the outcome, the next step may be a watchmaker, registered valuer, gemmologist, auction house, bullion specialist or another suitable professional.',bullets:['External specialist fees are separate','Escalate only when value-at-risk justifies it','WAPAD does not relabel third-party expertise as its own'],cta:['Compare all services','services.html']}
  };
  const panel=$('[data-step-panel]');
  $$('[data-step-tab]').forEach(btn=>btn.addEventListener('click',()=>{
    const d=stepData[btn.dataset.stepTab]; if(!d||!panel)return;
    $$('[data-step-tab]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-selected',String(b===btn))});
    panel.animate([{opacity:.25,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:260,easing:'ease-out'});
    panel.innerHTML=`<div><small>${d.eyebrow}</small><h3>${d.title}</h3><p>${d.copy}</p><ul>${d.bullets.map(x=>`<li>${x}</li>`).join('')}</ul><a class="button button--gold" href="${d.cta[1]}">${d.cta[0]} <span>↗</span></a></div>`;
  }));

  const serviceSection=$('#services');
  const serviceGrid=serviceSection?.querySelector('.customer-service-grid');
  if(serviceGrid && !serviceSection.querySelector('.paid-ladder')){
    const ladder=document.createElement('div');
    ladder.className='paid-ladder reveal is-visible';
    ladder.innerHTML=`<div class="paid-ladder__live"><small>Available now</small><strong>Route Check</strong><p>Guided evidence capture, photo-quality gate and first route.</p><b>A$0</b></div><div><small>Paid pilot</small><strong>Decision Brief</strong><p>Human-reviewed research and route comparison for one Evidence Ready asset.</p><b>A$69 pilot price</b></div><div><small>Paid pilot</small><strong>Estate Triage</strong><p>Prioritise a mixed collection before paying to examine everything.</p><b>A$249 pilot price</b></div>`;
    serviceGrid.parentNode.insertBefore(ladder,serviceGrid);
  }

  $$('[data-service-card]').forEach(card=>{
    const title=card.querySelector('h3')?.textContent.trim().toLowerCase()||'';
    if(card.querySelector('.paid-card-link')) return;
    let href='',label='';
    if(title.includes('decision brief')){href='services.html#decision-brief';label='View A$69 Decision Brief';}
    else if(title.includes('estate triage')){href='services.html#estate-triage';label='View A$249 Estate Triage';}
    else if(title.includes('route check')){href='assessment.html';label='Run free Route Check';}
    else if(title.includes('expert')||title.includes('specialist')){href='services.html';label='See specialist boundary';}
    if(href){
      const a=document.createElement('a');a.className='paid-card-link';a.href=href;a.innerHTML=`<span>${label}</span><span>↗</span>`;
      const toggle=card.querySelector('[data-service-toggle]');
      if(toggle)card.insertBefore(a,toggle);else card.appendChild(a);
    }
  });

  const nav=$('.main-nav');
  if(nav && !nav.querySelector('a[href="services.html"]')){
    const a=document.createElement('a');a.href='services.html';a.textContent='Services & pricing';
    const cta=nav.querySelector('.nav-cta');nav.insertBefore(a,cta||null);
  }

  $$('[data-service-toggle]').forEach(btn=>btn.addEventListener('click',()=>{
    const card=btn.closest('[data-service-card]'), detail=card?.querySelector('.customer-service-card__detail'); if(!detail)return;
    const open=detail.hidden; detail.hidden=!open; const mark=btn.querySelector('span');if(mark)mark.textContent=open?'−':'＋';
  }));

  const chat=$('[data-chat-panel]'), openBtn=$('[data-chat-open]'), closeBtn=$('[data-chat-close]'), form=$('[data-chat-form]'), input=$('[data-chat-input]'), messages=$('[data-chat-messages]');
  function setChat(open){if(!chat)return;chat.classList.toggle('is-open',open);chat.setAttribute('aria-hidden',String(!open));openBtn?.setAttribute('aria-expanded',String(open));if(open)setTimeout(()=>input?.focus(),80)}
  openBtn?.addEventListener('click',()=>setChat(!chat.classList.contains('is-open'))); closeBtn?.addEventListener('click',()=>setChat(false));

  const answers=[
    {m:/decision brief|69/i,a:'The Decision Brief is the planned A$69 paid single-asset service. First the free Route Check must pass Evidence Ready. WAPAD would then machine-prepare the case, human-review the evidence, research the relevant routes and comparable context where useful, separate known/inferred/unknown evidence, and give you a concise written next-step recommendation. It is not a formal valuation or authentication certificate.'},
    {m:/estate triage|249/i,a:'Estate Triage is the planned A$249 paid collection service. The pilot scope is up to 10 items, with a priority map showing what deserves deeper research, what should stay together, what may need a specialist and what can follow a simpler route. It is not a bundle of 10 formal valuations.'},
    {m:/outside|interstate|location|where|travel|remote|nsw|vic|queensland|perth|geraldton/i,a:'The free Route Check and planned Decision Brief / Estate Triage are designed for remote delivery. WAPAD was founded in Western Australia, but physical inspections, named referrals or regulated services depend on your location and specialist availability.'},
    {m:/watch|rolex|omega|seiko|movement|reference/i,a:'Yes. Watches are a core category. The Route Check now guides the exact watch photographs and checks basic image quality before a paid case can proceed. Authentication or physical condition work may still require a watch specialist.'},
    {m:/gold|jewell|ring|chain|bracelet|necklace|karat|carat|hallmark/i,a:'Yes. Gold and jewellery are core categories. The Route Check guides the whole-item, reverse, hallmark and condition photographs before deeper research. The A$69 Decision Brief is the paid research layer for one Evidence Ready item.'},
    {m:/buy|purchase|offer|cash|sell to you|do you pay/i,a:'Not in the controlled digital pilot. WAPAD sells decision support and research, not a purchase offer. That separation is deliberate so the first output is about the route rather than closing a sale.'},
    {m:/valuation|appraisal|certificate|insurance value|formal/i,a:'WAPAD is not a registered valuation service. The Route Check and paid Decision Brief can help decide whether a formal valuation is actually the right next step and what evidence to prepare. Formal credentialled work remains with an appropriately qualified professional.'},
    {m:/price|cost|fee|how much|paid|service/i,a:'The product ladder is: Free Route Check — A$0; Decision Brief — A$69 pilot price for one Evidence Ready asset; Estate Triage — A$249 pilot price for a mixed collection of up to 10 items. Paid checkout is not active yet.'},
    {m:/estate|inherit|collection|box|deceased|family/i,a:'Yes. Start with the free Estate Route Check. The planned paid Estate Triage is A$249 for up to 10 items and is designed to preserve groupings, papers and provenance while identifying which pieces deserve specialist work, deeper market research or a simple route.'},
    {m:/photo|upload|privacy|image|pictures|blurry|dark|glare/i,a:'The Route Check now guides each required shot and checks basic resolution, lighting, severe glare and likely blur on your device before you can continue. In the current pilot the photos are not uploaded to WAPAD.'},
    {m:/bullion|coin|bar|sovereign|mint/i,a:'Yes. For bullion and coins, the Route Check guides front, reverse, edge and serial/packaging shots and focuses on exact product identity, specifications and the difference between authenticity evidence, premium and liquidity.'},
    {m:/gem|diamond|sapphire|ruby|stone/i,a:'Yes, with a clear boundary. WAPAD can organise the evidence and research the route, but it does not identify treatment, origin or grading from a browser alone. Those questions can trigger a gemmological referral.'},
    {m:/hello|hi|hey|help|question/i,a:'Hi. Ask me about the Evidence Ready photo check, pricing, the A$69 Decision Brief, the A$249 Estate Triage, an asset type, location, privacy, or WAPAD scope.'}
  ];
  function getAnswer(q){const found=answers.find(x=>x.m.test(q));return found?.a||'I can’t answer that reliably from the current pilot FAQ. Try the free Route Check if it is about an asset, or open Services & Pricing to see the paid products.'}
  function addMsg(text,type){if(!messages)return;const d=document.createElement('div');d.className=`chat-msg chat-msg--${type}`;d.textContent=text;messages.appendChild(d);messages.scrollTop=messages.scrollHeight}
  function ask(q){const text=(q||'').trim();if(!text)return;setChat(true);addMsg(text,'user');window.setTimeout(()=>addMsg(getAnswer(text),'bot'),220)}
  form?.addEventListener('submit',e=>{e.preventDefault();const q=input.value;input.value='';ask(q)});
  $$('[data-chat-chip]').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.chatChip)));
  $$('[data-chat-topic]').forEach(b=>b.addEventListener('click',()=>{const topic=b.dataset.chatTopic;ask(topic==='location'?'I am located somewhere else. Can I still use WAPAD?':'What paid services does WAPAD offer?')}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&chat?.classList.contains('is-open'))setChat(false)});
})();