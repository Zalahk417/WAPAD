(() => {
  const root = document.querySelector('[data-evidence-engine]');
  if (!root) return;

  const recipes = {
    jewellery: [
      {id:'front', title:'Whole item — front', tip:'Lay it flat on a plain background. Fill most of the frame.', required:true},
      {id:'back', title:'Whole item — back', tip:'Show the reverse, clasp and construction.', required:true},
      {id:'mark', title:'Hallmark / maker mark', tip:'Move close enough that the stamp is readable. Avoid flash glare.', required:true, detail:true},
      {id:'condition', title:'Condition detail', tip:'Show wear, repair, damage, missing stones or unusual joins.', required:true, detail:true},
      {id:'papers', title:'Box / papers / receipt', tip:'Photograph any documents or original packaging if present.', required:false}
    ],
    watches: [
      {id:'dial', title:'Dial — straight on', tip:'Lay the watch flat. Keep the phone parallel to the dial.', required:true},
      {id:'back', title:'Case back', tip:'Capture all engraving, reference and service marks you can see.', required:true},
      {id:'crown', title:'Crown side', tip:'Show crown, pushers, case profile and lugs.', required:true},
      {id:'opposite', title:'Opposite side / lugs', tip:'Show the other case side and lug geometry.', required:true},
      {id:'clasp', title:'Bracelet / clasp', tip:'Open the clasp if safe. Photograph logos, codes and links.', required:true},
      {id:'serial', title:'Reference / serial close-up', tip:'Fill the frame with the visible code. Do not force the case open.', required:true, detail:true},
      {id:'papers', title:'Box / papers', tip:'Photograph warranty card, receipts, service papers and spare links if present.', required:false}
    ],
    bullion: [
      {id:'front', title:'Front', tip:'Show the complete bar or coin, including mint and stated weight/fineness.', required:true},
      {id:'reverse', title:'Reverse', tip:'Capture the entire reverse surface.', required:true},
      {id:'edge', title:'Edge / thickness', tip:'Show the edge, rim, reeding or cast profile.', required:true, detail:true},
      {id:'serial', title:'Serial / packaging', tip:'Capture serial numbers and sealed packaging clearly if present.', required:true, detail:true},
      {id:'scale', title:'Scale / dimensions', tip:'Optional: show the item on a scale or beside a ruler/caliper readout.', required:false}
    ],
    gemstones: [
      {id:'front', title:'Stone / setting — front', tip:'Use soft daylight. Avoid direct flash and heavy reflections.', required:true},
      {id:'profile', title:'Profile / side', tip:'Show the stone height, setting and pavilion if visible.', required:true},
      {id:'back', title:'Back / underside', tip:'Show the reverse of the stone or setting where accessible.', required:true},
      {id:'marks', title:'Metal / setting marks', tip:'Capture hallmarks or maker marks separately from the stone.', required:true, detail:true},
      {id:'report', title:'Laboratory report', tip:'Photograph any certificate/report and report number if present.', required:false}
    ],
    estate: [
      {id:'overview', title:'As-found overview', tip:'Photograph the whole group before sorting or cleaning anything.', required:true},
      {id:'groups', title:'Natural groupings', tip:'Show matched sets, boxes, labels and pieces that were stored together.', required:true},
      {id:'priority', title:'Potential priority item', tip:'Choose the piece that looks most important and photograph it clearly.', required:true},
      {id:'marks', title:'Marks / signatures', tip:'Capture the clearest hallmark, signature, serial or mint mark you can find.', required:true, detail:true},
      {id:'papers', title:'Documents / provenance', tip:'Photograph receipts, valuation papers, certificates, notes or labels.', required:false}
    ],
    unknown: [
      {id:'front', title:'Whole object — front', tip:'Plain background. Fill most of the frame.', required:true},
      {id:'back', title:'Whole object — reverse', tip:'Show the opposite side and construction.', required:true},
      {id:'marks', title:'Any marks / labels', tip:'Capture stamps, signatures, serials, logos or labels.', required:true, detail:true},
      {id:'condition', title:'Condition / joins', tip:'Show damage, wear, repairs, clasps, hinges or unusual construction.', required:true, detail:true},
      {id:'context', title:'Packaging / context', tip:'Optional: show box, papers, grouping or where it was found.', required:false}
    ]
  };

  let asset = null;
  let slots = {};

  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const esc=s=>String(s ?? '').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));

  function chosenAsset(){
    return document.querySelector('input[name="asset"]:checked')?.value || 'unknown';
  }

  function ensureRecipe(){
    const nextAsset = chosenAsset();
    if (asset !== nextAsset) {
      asset = nextAsset;
      slots = {};
      render();
    }
  }

  function render(){
    const recipe = recipes[asset] || recipes.unknown;
    root.innerHTML = `
      <div class="evidence-ready" data-evidence-ready>
        <div><span>EVIDENCE READY</span><strong data-evidence-score>0%</strong></div>
        <div class="evidence-ready__bar"><i data-evidence-bar></i></div>
        <p data-evidence-summary>Complete the required shots below. The check runs on this device.</p>
      </div>
      <div class="evidence-note"><strong>What v1 checks automatically:</strong> image resolution, light level, severe glare and likely blur. It does not yet prove that a photographed code is genuine or that the requested object is actually in frame.</div>
      <div class="capture-list">
        ${recipe.map((shot,i)=>cardMarkup(shot,i)).join('')}
      </div>`;
    bindCards();
    updateReady();
  }

  function cardMarkup(shot,i){
    return `<article class="capture-card" data-shot="${shot.id}" data-state="empty">
      <div class="capture-card__number">${String(i+1).padStart(2,'0')}</div>
      <div class="capture-card__copy"><span>${shot.required?'REQUIRED':'OPTIONAL'}</span><h3>${esc(shot.title)}</h3><p>${esc(shot.tip)}</p><div class="capture-card__status" data-shot-status>Not captured yet</div><button type="button" class="capture-use-anyway" data-use-anyway hidden>Use this image with a limitation</button></div>
      <label class="capture-card__button"><input type="file" accept="image/*" capture="environment" data-shot-input><span data-shot-button>Take photo</span></label>
      <div class="capture-card__preview" data-shot-preview><span>${shot.detail?'DETAIL':'PHOTO'}</span></div>
    </article>`;
  }

  function bindCards(){
    root.querySelectorAll('[data-shot]').forEach(card=>{
      const id=card.dataset.shot;
      const input=card.querySelector('[data-shot-input]');
      input?.addEventListener('change', async()=>{
        const file=input.files?.[0];
        if(!file) return;
        const shot=(recipes[asset]||recipes.unknown).find(x=>x.id===id);
        const previous=slots[id]||{attempts:0};
        previous.attempts += 1;
        slots[id]=previous;
        card.dataset.state='checking';
        card.querySelector('[data-shot-status]').textContent='Checking light, focus and glare…';
        card.querySelector('[data-shot-button]').textContent='Checking…';
        try{
          const result=await analyse(file, shot);
          const url=URL.createObjectURL(file);
          if(previous.url) URL.revokeObjectURL(previous.url);
          Object.assign(previous,result,{fileName:file.name,url,status:result.pass?'pass':'fail'});
          showResult(card, previous);
        }catch(err){
          Object.assign(previous,{score:0,status:'fail',issues:['Could not read this image. Try another photo.']});
          showResult(card, previous);
        }
        updateReady();
      });
      card.querySelector('[data-use-anyway]')?.addEventListener('click',()=>{
        const s=slots[id]; if(!s) return;
        s.status='limited';
        s.score=Math.max(45,Math.min(s.score||45,65));
        s.issues=['Accepted with limited evidence. The final route will keep this uncertainty visible.'];
        showResult(card,s);
        updateReady();
      });
    });
  }

  function showResult(card,s){
    const preview=card.querySelector('[data-shot-preview]');
    preview.innerHTML=s.url?`<img src="${s.url}" alt="Local evidence preview">`:'<span>PHOTO</span>';
    const status=card.querySelector('[data-shot-status]');
    const button=card.querySelector('[data-shot-button]');
    const use=card.querySelector('[data-use-anyway]');
    card.dataset.state=s.status;
    if(s.status==='pass'){
      status.innerHTML=`<strong>Pass · ${Math.round(s.score)}%</strong><small>${esc(s.metricsLabel||'Image quality looks usable.')}</small>`;
      button.textContent='Retake';
      use.hidden=true;
    }else if(s.status==='limited'){
      status.innerHTML=`<strong>Limited evidence</strong><small>${esc((s.issues||[])[0]||'Accepted with a limitation.')}</small>`;
      button.textContent='Retake';
      use.hidden=true;
    }else{
      status.innerHTML=`<strong>Retake recommended · ${Math.round(s.score||0)}%</strong><small>${(s.issues||[]).map(esc).join(' · ')}</small>`;
      button.textContent='Retake';
      use.hidden=(s.attempts||0)<2;
    }
  }

  async function loadImage(file){
    if('createImageBitmap' in window){
      try{return await createImageBitmap(file)}catch{}
    }
    return await new Promise((resolve,reject)=>{
      const img=new Image(), url=URL.createObjectURL(file);
      img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};
      img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('image'))};
      img.src=url;
    });
  }

  async function analyse(file, shot){
    const img=await loadImage(file);
    const width=img.width||img.naturalWidth, height=img.height||img.naturalHeight;
    const longSide=Math.max(width,height), scale=Math.min(1,320/longSide);
    const w=Math.max(32,Math.round(width*scale)), h=Math.max(32,Math.round(height*scale));
    const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0,w,h);
    const data=ctx.getImageData(0,0,w,h).data;
    const gray=new Float32Array(w*h);
    let sum=0, bright=0, dark=0;
    for(let i=0,p=0;i<data.length;i+=4,p++){
      const y=.2126*data[i]+.7152*data[i+1]+.0722*data[i+2];
      gray[p]=y;sum+=y;if(y>247)bright++;if(y<18)dark++;
    }
    const avg=sum/gray.length;
    let lapSum=0, lapSq=0, n=0;
    for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
      const p=y*w+x;
      const lap=4*gray[p]-gray[p-1]-gray[p+1]-gray[p-w]-gray[p+w];
      lapSum+=lap;lapSq+=lap*lap;n++;
    }
    const mean=lapSum/Math.max(1,n), sharp=Math.max(0,lapSq/Math.max(1,n)-mean*mean);
    const glare=bright/gray.length, crushed=dark/gray.length;
    let score=100;const issues=[];
    const minSide=Math.min(width,height);
    if(minSide<700){score-=30;issues.push('Image is too small — move closer or use the original camera photo.');}
    else if(minSide<1000){score-=10;}
    if(avg<48){score-=28;issues.push('Too dark — move beside a window or add soft room light.');}
    else if(avg>220){score-=24;issues.push('Too bright — reduce direct light or move away from the window.');}
    if(glare>.12){score-=24;issues.push('Glare is hiding detail — tilt the item or phone slightly and avoid flash.');}
    if(crushed>.30){score-=14;issues.push('Too much of the item is lost in shadow — add soft light from the side.');}
    const sharpThreshold=shot?.detail?90:55;
    if(sharp<sharpThreshold){score-=30;issues.push('Focus looks soft — move slightly farther back, tap the detail on screen, then retake.');}
    score=clamp(score,0,100);
    const pass=score>=70 && issues.length<=1 && minSide>=700;
    const labels=[];
    labels.push(`${width}×${height}px`);
    labels.push(avg<80?'low light':avg>195?'bright light':'light OK');
    labels.push(sharp<sharpThreshold?'focus uncertain':'focus OK');
    if(glare>.12)labels.push('glare high');else labels.push('glare OK');
    return {score,pass,issues,metrics:{width,height,avg,sharp,glare},metricsLabel:labels.join(' · ')};
  }

  function readiness(){
    const recipe=recipes[asset]||recipes.unknown;
    const required=recipe.filter(x=>x.required);
    const completed=required.filter(x=>['pass','limited'].includes(slots[x.id]?.status));
    const scores=completed.map(x=>slots[x.id]?.score||45);
    const score=required.length?Math.round(scores.reduce((a,b)=>a+b,0)/required.length):0;
    return {required:required.length,completed:completed.length,score,ready:completed.length===required.length};
  }

  function updateReady(){
    const r=readiness();
    root.querySelector('[data-evidence-score]').textContent=`${r.score}%`;
    root.querySelector('[data-evidence-bar]').style.width=`${r.ready?Math.max(72,r.score):(r.completed/r.required*70)}%`;
    root.querySelector('[data-evidence-summary]').textContent=r.ready
      ? `Evidence Ready. ${r.completed}/${r.required} required shots accepted. You can continue.`
      : `${r.completed}/${r.required} required shots accepted. Finish these before moving to the paid pathway.`;
    root.querySelector('[data-evidence-ready]').dataset.ready=String(r.ready);
  }

  function getSummary(){
    ensureRecipe();
    const r=readiness();
    const recipe=recipes[asset]||recipes.unknown;
    return {
      asset,
      ready:r.ready,
      score:r.score,
      completed:r.completed,
      required:r.required,
      shots:recipe.map(s=>({id:s.id,title:s.title,required:s.required,status:slots[s.id]?.status||'missing',score:slots[s.id]?.score||0,fileName:slots[s.id]?.fileName||''}))
    };
  }

  window.WAPADEvidence={
    isReady(){ensureRecipe();return readiness().ready;},
    getSummary,
    getMessage(){const r=readiness();return r.ready?'':`Finish the Evidence Ready capture first (${r.completed}/${r.required} required shots accepted).`;},
    refresh:ensureRecipe
  };

  document.querySelectorAll('input[name="asset"]').forEach(r=>r.addEventListener('change',ensureRecipe));
  asset=chosenAsset();
  render();
})();