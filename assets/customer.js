(() => {
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];

  const stepData={
    route:{eyebrow:'STEP 01 / AVAILABLE NOW',title:'Organise the evidence before you ask for a price.',copy:'The Route Check captures what you can actually observe: photos, marks, papers, condition, provenance and what decision you are trying to make. It then shows the evidence gaps and likely next route.',bullets:['2–5 minute browser-based intake','Photos stay on your device in the current pilot','No purchase offer and no custody'],cta:['Run Route Check','assessment.html']},
    brief:{eyebrow:'STEP 02 / PLANNED PILOT',title:'Add deeper market research only when it can change the decision.',copy:'A Decision Brief is intended for pieces where sold-market context, maker or reference research, route comparison and explicit confidence notes are useful — without pretending the result is a registered valuation or authentication certificate.',bullets:['Human-reviewed route research','Comparable-market context where available','Known / inferred / unknown kept separate'],cta:['See planned services','#services']},
    expert:{eyebrow:'STEP 03 / WHEN WARRANTED',title:'Take the right question to the right specialist or market.',copy:'Some questions need a physical inspection or formal credentials. The useful part is knowing whether you need a watchmaker, registered valuer, gemmologist, auction house, bullion specialist or simply a competitive buyer market.',bullets:['Escalate when value-at-risk justifies it','Do not pay for expertise that answers the wrong question','Keep the original evidence and context together'],cta:['See why this matters','#trust']}
  };
  const panel=$('[data-step-panel]');
  $$('[data-step-tab]').forEach(btn=>btn.addEventListener('click',()=>{
    const d=stepData[btn.dataset.stepTab]; if(!d||!panel)return;
    $$('[data-step-tab]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-selected',String(b===btn))});
    panel.animate([{opacity:.25,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:260,easing:'ease-out'});
    panel.innerHTML=`<div><small>${d.eyebrow}</small><h3>${d.title}</h3><p>${d.copy}</p><ul>${d.bullets.map(x=>`<li>${x}</li>`).join('')}</ul><a class="button button--gold" href="${d.cta[1]}">${d.cta[0]} <span>↗</span></a></div>`;
  }));

  $$('[data-service-toggle]').forEach(btn=>btn.addEventListener('click',()=>{
    const card=btn.closest('[data-service-card]'), detail=card?.querySelector('.customer-service-card__detail'); if(!detail)return;
    const open=detail.hidden; detail.hidden=!open; btn.querySelector('span').textContent=open?'−':'＋';
  }));

  const chat=$('[data-chat-panel]'), openBtn=$('[data-chat-open]'), closeBtn=$('[data-chat-close]'), form=$('[data-chat-form]'), input=$('[data-chat-input]'), messages=$('[data-chat-messages]');
  function setChat(open){if(!chat)return;chat.classList.toggle('is-open',open);chat.setAttribute('aria-hidden',String(!open));openBtn?.setAttribute('aria-expanded',String(open));if(open)setTimeout(()=>input?.focus(),80)}
  openBtn?.addEventListener('click',()=>setChat(!chat.classList.contains('is-open'))); closeBtn?.addEventListener('click',()=>setChat(false));

  const answers=[
    {m:/outside|interstate|location|where|travel|remote|nsw|vic|queensland|perth|geraldton/i,a:'The free Route Check is digital and can be used from anywhere. WAPAD was founded in Western Australia, but the digital service is designed to travel. Physical inspections, named referrals or regulated services depend on your location and specialist availability.'},
    {m:/watch|rolex|omega|seiko|movement|reference/i,a:'Yes. Watches are one of the core Route Check categories. WAPAD can help you organise reference, serial, dial, case, bracelet, papers, originality and condition questions. It cannot authenticate a watch from photos alone, and higher-risk pieces may need a watch specialist or physical inspection.'},
    {m:/gold|jewell|ring|chain|bracelet|necklace|karat|carat|hallmark/i,a:'Yes. Gold and jewellery are core categories. The Route Check helps separate the recoverable-metal floor from possible maker, design, stone, age or intact-market value before anything is tested destructively or sold as scrap.'},
    {m:/buy|purchase|offer|cash|sell to you|do you pay/i,a:'Not in the controlled digital pilot. WAPAD currently provides decision support and preparation, not a purchase offer. That separation is deliberate so the first output is about the route rather than closing a sale.'},
    {m:/valuation|appraisal|certificate|insurance value|formal/i,a:'WAPAD is not a registered valuation service. The Route Check can help decide whether a formal valuation is actually the right next step and what evidence to prepare. Formal jewellery valuation or other credentialled work should be provided by an appropriately qualified professional.'},
    {m:/price|cost|fee|how much|49|249/i,a:'The Free Route Check is $0 and available now. A $49 Decision Brief and $249 Estate Triage are displayed as planned pilot target prices, not live paid services yet.'},
    {m:/estate|inherit|collection|box|deceased|family/i,a:'Yes. Estate or mixed-collection triage is a core use case. The first goal is to preserve groupings, papers and provenance while identifying which items deserve specialist work, market research or a simple metal route.'},
    {m:/photo|upload|privacy|image|pictures/i,a:'In the current free Route Check, selected photos are previewed locally in your browser and are not uploaded to WAPAD. Refreshing or closing the page removes those previews.'},
    {m:/bullion|coin|bar|sovereign|mint/i,a:'Yes. For bullion and coins, the Route Check focuses on exact product identity, mint, weight, dimensions, packaging, serial information and the difference between authenticity evidence, premium and liquidity.'},
    {m:/gem|diamond|sapphire|ruby|stone/i,a:'Yes, with a clear boundary. WAPAD can organise the evidence and decide whether gemmological work is warranted, but it does not identify treatment, origin or grading from a browser alone.'},
    {m:/hello|hi|hey|help|question/i,a:'Hi. Ask me something simple about an asset type, location, pricing, the Route Check, privacy, or whether WAPAD buys or values items.'}
  ];
  function getAnswer(q){const found=answers.find(x=>x.m.test(q));return found?.a||'I can’t answer that reliably from the current pilot FAQ. Try the free Route Check if it is about an asset, or open the Knowledge Desk for preparation guidance. A real AI/human escalation channel can be connected later without changing this interface.'}
  function addMsg(text,type){if(!messages)return;const d=document.createElement('div');d.className=`chat-msg chat-msg--${type}`;d.textContent=text;messages.appendChild(d);messages.scrollTop=messages.scrollHeight}
  function ask(q){const text=(q||'').trim();if(!text)return;setChat(true);addMsg(text,'user');window.setTimeout(()=>addMsg(getAnswer(text),'bot'),220)}
  form?.addEventListener('submit',e=>{e.preventDefault();const q=input.value;input.value='';ask(q)});
  $$('[data-chat-chip]').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.chatChip)));
  $$('[data-chat-topic]').forEach(b=>b.addEventListener('click',()=>{const topic=b.dataset.chatTopic;ask(topic==='location'?'I am located somewhere else. Can I still use WAPAD?':'What can WAPAD help me with?')}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&chat?.classList.contains('is-open'))setChat(false)});
})();