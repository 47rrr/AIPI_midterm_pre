const icons={box:'<path d="m12 3 9 5v9l-9 5-9-5V8l9-5Z"/><path d="m3 8 9 5 9-5M12 13v9M7.5 5.5l9 5"/>',home:'<path d="m3 10 9-7 9 7v10H7v-7h5v7"/>',receipt:'<path d="M5 3h14v19l-3-2-4 2-4-2-3 2V3Z"/><path d="M8 7h8M8 11h8M8 15h4"/>',return:'<path d="M8 7h8a6 6 0 0 1 0 12H8M8 7l4-4M8 7l4 4"/>',plan:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 11h18M8 15h2M14 15h2"/>',settings:'<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="m10 3 1-1h2l1 1 .5 2 2 .8 2-.5 1 1 1 2-1.5 1.5V13l1.5 1.5-1 2-1 1-2-.5-2 .8-.5 2-1 1h-2l-1-1-.5-2-2-.8-2 .5-1-1-1-2L5 13v-2.2L3.5 9.3l1-2 1-1 2 .5 2-.8L10 3Z"/>',plus:'<path d="M12 5v14M5 12h14"/>',arrow:'<path d="M5 12h14M14 7l5 5-5 5"/>',chevron:'<path d="m9 5 7 7-7 7"/>',back:'<path d="m14 6-6 6 6 6"/>',bell:'<path d="M6 9a6 6 0 0 1 12 0v7l2 2H4l2-2V9ZM10 21h4"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v.1"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',money:'<circle cx="12" cy="12" r="9"/><path d="M15 8h-5a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H9M12 6v12"/>',image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 4 4-6 5 7"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',edit:'<path d="m16 3 5 5-12 12-6 1 1-6L16 3Z"/><path d="m13 6 5 5"/>',copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',upload:'<path d="M12 16V3M7 8l5-5 5 5M4 16v5h16v-5"/>',check:'<path d="m5 12 4 4L19 6"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',external:'<path d="M14 3h7v7M21 3 11 13M10 5H3v16h16v-7"/>',location:'<path d="M19 10c0 6-7 12-7 12S5 16 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',headphones:'<path d="M4 14v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="12" width="4" height="9" rx="2"/><rect x="17" y="12" width="4" height="9" rx="2"/>',shirt:'<path d="m8 3-6 4 3 5 3-1v10h8V11l3 1 3-5-6-4c0 4-8 4-8 0Z"/>',phone:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 5h4M11 19h2"/>',shield:'<path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z"/><path d="m8 12 3 3 5-6"/>',file:'<path d="M5 2h9l5 5v15H5V2ZM14 2v5h5M8 12h8M8 16h6"/>',merge:'<path d="M5 3v4c0 4 7 4 7 8v6M19 3v4c0 4-7 4-7 8M8 17l4 4 4-4"/>',bookmark:'<path d="M6 3h12v19l-6-4-6 4V3Z"/>',camera:'<path d="M3 7h4l2-3h6l2 3h4v14H3V7Z"/><circle cx="12" cy="13" r="4"/>'};
// Keep the original hash router, local persistence, upload handling and delegated
// interactions; purchases, plans and tracking now share one source of truth.
const icon=(name,cls='')=>`<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${icons[name]||icons.box}</svg>`;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(Number(v||0));
const date=v=>v?new Date(v+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):'Not confirmed';
const DEMO_DATE='2026-10-14';
const STORAGE_KEY='return-pilot-mvp-v4';
const sampleReceipt={id:'headphones',name:'Wireless Headphones',retailer:'Sample retailer A',price:59.99,purchase:'2026-09-15',delivery:'2026-09-15',order:'RP-1042',photo:'headphones',carrier:'ups',source:'Sample receipt'};
const sampleOrders=[
  {id:'jacket',name:'Fur Jacket',retailer:'Sample retailer B',price:89.99,purchase:'2026-09-14',delivery:'2026-09-16',order:'RP-2018',photo:'jacket',carrier:'usps'},
  {id:'cup',name:'Stanley Cup',retailer:'Sample retailer C',price:35,purchase:'2026-09-24',delivery:'2026-09-26',order:'RP-3024',photo:'cup',carrier:'ups'},
  {id:'boots',name:'Rain Boots',retailer:'Sample retailer B',price:64.99,purchase:'2026-08-26',delivery:'2026-08-29',order:'RP-2026',photo:'boots',carrier:'usps'},
  {id:'case',name:'Phone Case',retailer:'Sample retailer A',price:19.01,purchase:'2026-09-15',delivery:'2026-09-15',order:'RP-1042',photo:'case',carrier:'ups'}
];
const stops={
  usps:{name:'Parcel Point · Downtown',address:'128 Market Street · Sample location'},
  ups:{name:'Parcel Point · City Center',address:'18 Center Avenue · Sample location'}
};
const freshState=()=>({name:'Alex',email:'alex@example.com',tasksAdded:[],purchaseOverrides:{},selectedIds:['jacket','case'],plan:null,stages:{},history:[],checks:{},draft:null});
let state=freshState();
try{
  const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
  if(saved&&Array.isArray(saved.tasksAdded)&&Array.isArray(saved.selectedIds))state={...state,...saved};
}catch{}
function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch{}}
const allPurchases=()=>[...state.tasksAdded,...sampleOrders].map(x=>({...x,...state.purchaseOverrides[x.id]}));
const purchaseById=id=>allPurchases().find(x=>x.id===id);
const addDays=(value,days)=>{const d=new Date(value+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10)};
const deadline=item=>item.delivery?addDays(item.delivery,30):null;
const daysLeft=item=>deadline(item)?Math.round((new Date(deadline(item)+'T12:00:00Z')-new Date(DEMO_DATE+'T12:00:00Z'))/86400000):null;
function eligibility(item){
  if(!item.delivery)return {kind:'ineligible',label:'Not eligible'};
  if(daysLeft(item)<0)return {kind:'expired',label:'Past return window'};
  if(daysLeft(item)<=2)return {kind:'urgent',label:'Return window closes soon'};
  return {kind:'eligible',label:'Return eligible'};
}
const canReturn=item=>['eligible','urgent'].includes(eligibility(item).kind)&&itemStage(item)<4;
const selectedItems=()=>allPurchases().filter(x=>state.selectedIds.includes(x.id)&&canReturn(x));
const total=items=>items.reduce((sum,x)=>sum+Math.round(x.price*100),0)/100;
const itemStage=item=>Number(state.stages[item.id]||0);
const planItems=()=>state.plan?.items||[];
const planSignature=items=>JSON.stringify(items.map(x=>[x.id,x.retailer,x.name,x.price,x.purchase,x.delivery,x.carrier]).sort((a,b)=>a[0].localeCompare(b[0])));
const stageNames=['Ready to drop off','Drop-off completed','In transit to retailer','Refund pending','Refund received'];
const nextActions=['Mark as dropped off','Mark in transit','Mark retailer received','Confirm refund received'];
const pill=(text,kind='')=>`<span class="pill ${kind}">${esc(text)}</span>`;
const brand=()=>`<a class="brand" href="#purchases" aria-label="Return Pilot purchases">${icon('box')}<span>Return Pilot</span></a>`;
const link=(label,route,kind='',symbol='arrow')=>`<a class="btn ${kind}" href="#${route}">${esc(label)}${symbol?icon(symbol):''}</a>`;
const heading=(title,sub,action='')=>`<div class="page-heading"><div><h1>${title}</h1><p>${sub}</p></div>${action}</div>`;
const field=(label,name,value='',type='text',attrs='')=>`<label class="field">${esc(label)}<input name="${name}" type="${type}" value="${esc(value)}" ${attrs}></label>`;
// Use the supplied product photos wherever available; keep the headphone illustration.
const productImages={jacket:'images/fur-jacket.png',cup:'images/cup.png',boots:'images/rain-boots.png',case:'images/phone-case.png'};
const productArt={
  headphones:'<ellipse cx="65" cy="108" rx="38" ry="5" fill="#dce0e5"/><path d="M29 69V55a36 36 0 0 1 72 0v14" fill="none" stroke="#333c49" stroke-width="11"/><path d="M29 55a36 36 0 0 1 72 0" fill="none" stroke="#64707e" stroke-width="4"/><rect x="22" y="59" width="25" height="45" rx="12" fill="#333c49" transform="rotate(-9 34 80)"/><rect x="83" y="59" width="25" height="45" rx="12" fill="#333c49" transform="rotate(9 95 80)"/><rect x="29" y="64" width="14" height="35" rx="7" fill="#5e6876" transform="rotate(-9 36 81)"/><rect x="87" y="64" width="14" height="35" rx="7" fill="#5e6876" transform="rotate(9 94 81)"/>',
};
function thumbnail(item,cls=''){
  if(Object.hasOwn(productImages,item.photo))return `<img class="product-photo ${cls}" src="${productImages[item.photo]}" alt="${esc(item.name)}" width="130" height="130" decoding="async">`;
  if(!(item.photo in productArt))return `<span class="product-photo placeholder ${cls}" role="img" aria-label="${esc(item.name)}">${icon('box')}</span>`;
  return `<svg class="product-photo ${cls}" viewBox="0 0 130 130" role="img" aria-label="${esc(item.name)} illustration">${productArt[item.photo]}</svg>`;
}
function productSummary(item){return `<div class="product-summary">${thumbnail(item)}<div><strong>${esc(item.retailer)}</strong><span>${esc(item.name)}</span><small>${money(item.price)}</small></div></div>`}
let purchaseQuery='',purchaseFilter='all',trackingFilter='all',addMethod='image',editingDraft=false;
let fileURL=null,fileName='',fileType='',previousRoute=null,dialogReturnFocus=null;
const aliases={today:'purchases',setup:'purchases',tasks:'tracking',detail:'tracking',settings:'purchases',upload:'add',manual:'add',review:'add',duplicate:'add',policy:'add'};
const views={login,purchases,add,plan,tracking};
function currentRoute(){const route=location.hash.slice(1)||'login';return aliases[route]||(Object.hasOwn(views,route)?route:'purchases')}
function navigate(route){if(currentRoute()===route)render();else location.hash=route}
function shell(){return `<div id="workspace"><aside class="sidebar">${brand()}<nav class="nav" aria-label="Main navigation">${[['purchases','Purchases','receipt'],['plan','Return Plan','box'],['tracking','Tracking','return']].map(([r,label,i])=>`<a href="#${r}" data-nav="${r}">${icon(i)}<span>${label}</span></a>`).join('')}</nav><div class="sidebar-foot"><div class="workspace-note">Less to remember.<br>A clear way to return.</div><span class="demo-label"><i></i> Interactive demo</span><button class="link reset-link" data-action="reset-demo">Restart demo</button></div></aside><div class="main"><header class="toolbar"><label class="search">${icon('search')}<input id="purchase-search" type="search" value="${esc(purchaseQuery)}" placeholder="Search your purchases, e.g. headphones or retailer" aria-label="Search purchases"></label><div class="toolbar-right"><button class="icon-button notification" data-action="reminders" aria-label="View upcoming reminders">${icon('bell')}<i></i></button><button class="profile" data-action="profile" aria-label="Your profile"><span class="avatar">${esc(state.name.slice(0,1))}</span><span>Hi, ${esc(state.name)}</span>${icon('chevron')}</button></div></header><main id="page-content" class="content"></main><p class="footer-note">Demo · Sample purchases, policies & locations · Status updates are marked by you</p></div></div>`}
function render(){
  const route=currentRoute(),changed=route!==previousRoute;
  const focusKey=document.activeElement?.dataset.focus;
  if(route==='login')document.getElementById('app').innerHTML=login();
  else{
    if(!document.getElementById('workspace'))document.getElementById('app').innerHTML=shell();
    document.getElementById('page-content').innerHTML=views[route]();
    document.querySelectorAll('[data-nav]').forEach(el=>{const active=el.dataset.nav===(route==='add'?'purchases':route);el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current')});
    if(!changed&&focusKey)document.querySelector(`[data-focus="${CSS.escape(focusKey)}"]`)?.focus({preventScroll:true});
  }
  document.title=`${{login:'Welcome',purchases:'Your purchases',add:'Add a purchase',plan:'Return Plan',tracking:'Tracking'}[route]} — Return Pilot`;
  if(changed)window.scrollTo(0,0);
  previousRoute=route;
}
function login(){return `<main class="auth"><section class="auth-story">${brand()}<div class="auth-copy"><span class="eyebrow">YOUR PURCHASES. ONE CLEAR PLAN.</span><h1>Less return chaos.<br>More money back.</h1><p>Bring your purchases together, make one return plan, and follow every refund.</p><div class="auth-journey"><span>${icon('receipt')}Collect</span><i>→</i><span>${icon('box')}Plan</span><i>→</i><span>${icon('check')}Track</span></div></div><small>Return Pilot · Interactive web prototype</small></section><section class="auth-body"><div class="auth-form"><span class="auth-mark">${icon('box')}</span><h2>Welcome back</h2><p>Your next return starts here.</p><form id="login-form">${field('Email address','email',state.email,'email','required autocomplete="email"')}<button class="btn full" type="submit">Enter demo workspace ${icon('arrow')}</button></form><p class="auth-footer">Explore with sample purchases.<br>No account or password needed.</p></div></section></main>`}
function selectionBanner(){
  const items=selectedItems(),retailers=new Set(items.map(x=>x.retailer)).size;
  return `<section class="selection-banner" aria-label="Selected purchases"><span class="selection-symbol">${icon('box')}</span><div class="selection-copy" aria-live="polite"><strong>${items.length?`${items.length} item${items.length===1?'':'s'} selected for return`:'Choose what you want to return'}</strong><p>${items.length?`From ${retailers} ${retailers===1?'retailer':'retailers'} · ${money(total(items))} in purchases`:'Select eligible purchases below. We’ll bring them into one plan.'}</p></div><button class="btn" data-action="build-plan" ${items.length?'':'disabled'}>Build my return plan ${icon('arrow')}</button></section>`;
}
function purchaseFilters(){
  const items=allPurchases();
  return `<div class="filter-tabs" role="group" aria-label="Filter purchases">${[['all','All',items.length],['eligible','Eligible',items.filter(canReturn).length],['ineligible','Not eligible',items.filter(x=>!canReturn(x)).length]].map(([id,label,count])=>`<button class="filter ${purchaseFilter===id?'active':''}" data-action="purchase-filter" data-value="${id}" data-focus="filter-${id}" aria-pressed="${purchaseFilter===id}">${label} <span>(${count})</span></button>`).join('')}</div>`;
}
function purchaseList(){
  const query=purchaseQuery.trim().toLowerCase();
  const items=allPurchases().filter(x=>(!query||`${x.name} ${x.retailer} ${x.order}`.toLowerCase().includes(query))&&(purchaseFilter==='all'||(purchaseFilter==='eligible'?canReturn(x):!canReturn(x))));
  if(!items.length)return `<div class="empty panel">${icon('search')}<h2>No matching purchases</h2><p>Try another search or filter.</p><button class="btn secondary" data-action="clear-search">Show all purchases</button></div>`;
  return items.map(x=>{const status=eligibility(x),completed=itemStage(x)===4;return `<article class="purchase-card ${state.selectedIds.includes(x.id)&&canReturn(x)?'selected':''}"><label class="purchase-check"><input type="checkbox" data-select="${x.id}" data-focus="select-${x.id}" aria-label="Select ${esc(x.name)} for return" ${state.selectedIds.includes(x.id)&&canReturn(x)?'checked':''} ${canReturn(x)?'':'disabled'}></label>${thumbnail(x)}<div class="purchase-copy"><h3>${esc(x.retailer)}</h3><p>${esc(x.name)}</p><div class="purchase-meta"><span>${money(x.price)}</span><span>·</span><span>${icon('plan')}${date(x.purchase)}</span></div></div><div class="purchase-status">${pill(completed?'Refund received':status.label,completed?'eligible':status.kind)}${status.kind==='urgent'?`<small>${daysLeft(x)===0?'Closes today':`Closes in ${daysLeft(x)} day${daysLeft(x)===1?'':'s'}`}</small>`:''}</div><button class="icon-button" data-action="purchase-details" data-id="${x.id}" aria-label="View ${esc(x.name)} details">${icon('chevron')}</button></article>`}).join('');
}
function purchases(){return heading('Your purchases','Everything you bought. A clearer choice about what comes back.',link('Add purchase','add','small','plus'))+selectionBanner()+`<div id="purchase-filters">${purchaseFilters()}</div><div class="list-caption"><span>Select eligible purchases to build your return plan.</span><small>Demo date · October 14, 2026</small></div><div id="purchase-list" class="purchase-list">${purchaseList()}</div>`}
function receiptPreview(){const d=state.draft;
  if(fileURL&&fileType.startsWith('image/'))return `<img class="uploaded-image" src="${esc(fileURL)}" alt="Your uploaded purchase evidence">`;
  if(fileURL&&fileType==='application/pdf')return `<div class="pdf-preview">${icon('file')}<strong>${esc(fileName)}</strong><p>PDF attached as purchase evidence.</p><a class="btn secondary" href="${esc(fileURL)}" target="_blank" rel="noopener">Open PDF ${icon('external')}</a></div>`;
  if(d?.source==='Sample receipt'||d?.source==='Sample forwarded email')return `<div class="receipt-paper"><div class="receipt-brand">${esc(d.retailer)}</div><p class="receipt-order">${d.source==='Sample forwarded email'?'Order confirmation email':'Sample order receipt'}<br>Order # ${esc(d.order)}<br>${date(d.purchase)}</p><div class="receipt-product">${thumbnail(d)}<div><strong>${esc(d.name)}</strong><small>Qty: 1</small><b>${money(d.price)}</b></div></div><dl><div><dt>Item total</dt><dd>${money(d.price)}</dd></div><div><dt>Shipping</dt><dd>$0.00</dd></div><div class="receipt-total"><dt>Total paid</dt><dd>${money(d.price)}</dd></div></dl><p class="receipt-foot">Delivered ${date(d.delivery)}<br>Illustrative receipt · No real order</p></div>`;
  return `<div class="evidence-empty">${icon(addMethod==='manual'?'edit':'file')}<strong>${fileName?esc(fileName):'Your purchase evidence'}</strong><p>${addMethod==='manual'?'Enter the details from your receipt.':'Reselect your file to preview it here.'}</p></div>`;
}
function extractionFields(){const d=state.draft;
  if(!d)return '';
  const editable=editingDraft||!d.name;
  return `<form id="purchase-form"><div class="found-heading"><h3>${icon(editable?'edit':'check')}${editable?'Purchase details':'We found:'}</h3>${editable?'':`<button class="link" type="button" data-action="edit-draft">${icon('edit')}Edit details</button>`}</div>${d.name?`<div class="found-product">${productSummary(d)}</div>`:''}${editable?`<div class="form-grid">${field('Retailer','retailer',d.retailer,'text','required maxlength="80"')}${field('Item','name',d.name,'text','required maxlength="120"')}${field('Amount ($)','price',d.price,'number','required min="0.01" max="99999" step="0.01"')}${field('Purchase date','purchase',d.purchase,'date',`required max="${DEMO_DATE}"`)}${field('Delivery date','delivery',d.delivery,'date',`required max="${DEMO_DATE}"`)}${field('Order ID (optional)','order',d.order,'text','maxlength="80"')}</div>`:`<dl class="extracted-fields">${[['Retailer',d.retailer],['Item',d.name],['Amount',money(d.price)],['Date',date(d.purchase)],['Order ID',d.order||'Not provided'],['Delivered',date(d.delivery)]].map(([label,value])=>`<div><dt>${label}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>`}<label class="save-selection"><input type="checkbox" name="selectForReturn" ${d.selectForReturn===false?'':'checked'}> Select this purchase for return when eligible</label><button class="btn full" type="submit">${purchaseById(d.id)?'Update purchase':'Add to purchases'} ${icon('arrow')}</button><p class="field-note">${icon('shield')}Check the item, amount, and dates before saving.</p></form>`;
}
function add(){
  const methods=[['image','image','Upload image','Receipt photo or screenshot'],['pdf','file','Upload PDF','Receipt or order confirmation'],['email','mail','Forward email','A purchase email'],['manual','edit','Manual entry','Enter the details yourself']];
  return `<a class="back" href="#purchases">${icon('back')}Back to purchases</a>`+heading('Add a purchase','Choose how to add it. Check what we found. Save it to your list.')+`<div class="add-layout"><section class="panel add-panel"><h2>How would you like to add it?</h2><div class="add-methods" role="group" aria-label="Choose an add method">${methods.map(([id,i,label,sub])=>`<button type="button" data-focus="method-${id}" class="add-method ${addMethod===id?'active':''}" data-action="add-method" data-value="${id}" aria-pressed="${addMethod===id}"><span class="method-icon">${icon(i)}</span><span><strong>${label}</strong><small>${sub}</small></span></button>`).join('')}</div>${state.draft?`<div class="extraction-layout"><div class="evidence-pane"><div class="evidence-label"><span>Purchase evidence</span><button class="link" data-action="change-evidence">Change</button></div><div class="receipt-preview">${receiptPreview()}</div></div><div class="found-pane">${extractionFields()}</div></div>`:addMethod==='email'?`<div class="email-entry"><span class="upload-icon">${icon('mail')}</span><h3>Only the email you choose to share.</h3><p>Your dedicated forwarding address</p><div class="code-box">alex@inbox.returnpilot.example<button class="icon-button" data-action="copy" aria-label="Copy example forwarding address">${icon('copy')}</button></div><small>This example inbox isn’t connected. Try the sample confirmation email.</small><button class="btn" data-action="sample-email">Use sample email ${icon('arrow')}</button></div>`:`<div id="drop-zone" class="upload-zone"><span class="upload-icon">${icon(addMethod==='pdf'?'file':'upload')}</span><h3>${addMethod==='pdf'?'Add a receipt PDF':'Drop your receipt or order screenshot'}</h3><p>${addMethod==='pdf'?'PDF':'JPG or PNG'} · Up to 10 MB</p><div class="upload-actions"><label class="btn secondary file-picker">Choose ${addMethod==='pdf'?'PDF':'image'}<input type="file" id="receipt-file" accept="${addMethod==='pdf'?'application/pdf':'image/jpeg,image/png'}"></label><button class="btn" data-action="sample">Try sample receipt ${icon('arrow')}</button></div><small>Sample extraction is prefilled. For your own file, enter and confirm its details.</small></div>`}</section><aside class="panel add-guide"><span class="eyebrow">FROM PURCHASE TO RETURN</span><h2>Keep the evidence.<br>Know the next step.</h2><ol><li><span>1</span><div><strong>Add your purchase</strong><p>Start with a receipt, email, or the details you have.</p></div></li><li><span>2</span><div><strong>Review what we found</strong><p>Check the item, amount, and delivery date.</p></div></li><li><span>3</span><div><strong>Choose what to return</strong><p>Save it to Purchases, then build one plan for your selected items.</p></div></li></ol><p class="guide-note">${icon('shield')}You choose what you share. No access to your entire inbox.</p></aside></div>`;
}
function buildPlan(){
  const items=selectedItems().sort((a,b)=>deadline(a).localeCompare(deadline(b)));
  if(!items.length){toast('Select at least one eligible purchase first.');return false}
  // Snapshot the chosen items so changing a checkbox cannot silently alter a saved plan.
  state.plan={items:items.map(x=>({...x})),createdAt:DEMO_DATE};persist();return true;
}
function groupedStops(items=planItems()){
  const groups=new Map();
  items.forEach(item=>{if(!groups.has(item.carrier))groups.set(item.carrier,[]);groups.get(item.carrier).push(item)});
  return [...groups].map(([carrier,items])=>({carrier,...stops[carrier],items})).sort((a,b)=>deadline(a.items[0]).localeCompare(deadline(b.items[0])));
}
function plan(){
  const items=planItems(),groups=groupedStops(),first=items[0];
  if(!items.length)return heading('Return Plan','Turn your selected purchases into one clear trip.')+`<section class="empty panel">${icon('box')}<h2>Your next trip starts with a selection.</h2><p>Choose eligible items on Purchases, then click “Build my return plan”.</p>${link('Choose purchases','purchases')}</section>`;
  const planChanged=planSignature(items)!==planSignature(selectedItems());
  return heading('Your return plan','Your selected purchases, organized into a trip you can actually do.',link('Track my returns','tracking','small'))+`${planChanged?`<div class="plan-change-note">${icon('info')}Your purchases or selection have changed. This is your saved plan.<button class="link" data-action="build-plan" ${selectedItems().length?'':'disabled'}>Update plan</button></div>`:''}<section class="plan-hero"><div class="plan-pin">${icon('location')}</div><div><h2>${items.length} return${items.length===1?'':'s'} <i>·</i> ${groups.length} ${groups.length===1?'stop':'stops'} <i>·</i> <span>${money(total(items))} protected</span></h2><p>An optimized plan to get all your returns done.</p><div class="plan-benefits"><span>${icon('check')}Nearest deadline first</span><span>${icon('check')}Compatible drop-offs grouped</span><span>${icon('check')}Separate labels, one trip</span></div></div><div class="route-visual" aria-hidden="true">${groups.map((_,i)=>`${i?'<i></i>':''}<b>${i+1}</b>`).join('')}</div></section><section class="priority-block"><span class="priority-icon">${icon('clock')}</span><div class="priority-copy"><h3>Do first</h3><p>${daysLeft(first)<=2?`Return window closes ${daysLeft(first)===0?'today':`in ${daysLeft(first)} day${daysLeft(first)===1?'':'s'}`}`:`Earliest deadline · ${date(deadline(first))}`}</p><small>Start this retailer’s return request before heading out.</small></div>${productSummary(first)}<button class="icon-button" data-action="purchase-details" data-id="${first.id}" aria-label="View urgent item">${icon('chevron')}</button></section><div class="plan-stops">${groups.map((group,index)=>`<section class="stop-card"><div class="stop-heading"><span class="stop-number">${index+1}</span><div><h2>Stop ${index+1} <span>${esc(group.name)}</span></h2><p>${esc(group.address)}</p></div><span class="stop-count">${group.items.length} ${group.items.length===1?'item':'items'}</span></div><div class="stop-items">${group.items.map(x=>`<div class="stop-product">${productSummary(x)}<span class="package-label">${icon('box')}Separate package & label</span></div>`).join('')}</div><label class="check-row"><input type="checkbox" data-check="${group.carrier}" ${state.checks[group.carrier]?'checked':''}> Packages and matching return labels are ready</label></section>`).join('')}</div><div class="plan-bottom"><p>${icon('info')}Sample grouping based on compatible drop-offs; confirm eligibility and opening hours with each retailer.</p>${link('Continue to tracking','tracking')}</div>`;
}
function tracking(){
  const items=planItems(),active=items.filter(x=>itemStage(x)>0&&itemStage(x)<4),done=items.filter(x=>itemStage(x)===4),pending=items.filter(x=>itemStage(x)<4);
  if(!items.length)return heading('Tracking','From your return plan to money back.')+`<section class="empty panel">${icon('return')}<h2>A clear plan comes first.</h2><p>Build your return plan, then follow each item from drop-off to refund.</p>${link('Go to purchases','purchases')}</section>`;
  const visible=items.filter(x=>trackingFilter==='all'||(trackingFilter==='completed'?itemStage(x)===4:itemStage(x)<4));
  const options=[['all','All returns'],['active','Active returns'],['completed','Refund received']];
  return heading('Tracking','Your plan is now a set of clear, trackable next steps.',`<label class="tracking-filter"><span class="sr-only">Filter returns</span><select id="tracking-filter" data-focus="tracking-filter">${options.map(([v,l])=>`<option value="${v}" ${v===trackingFilter?'selected':''}>${l}</option>`).join('')}</select></label>`)+`<section class="tracking-summary"><div>${icon('box')}<span><strong>${items.length}</strong> return${items.length===1?'':'s'}</span></div><div>${icon('clock')}<span><strong>${active.length}</strong> in progress</span></div><div>${icon('money')}<span><strong>${money(total(pending))}</strong> expected</span></div>${done.length?`<div class="received-total">${icon('check')}<span><strong>${money(total(done))}</strong> received</span></div>`:''}</section><div class="tracking-journey" aria-label="Return stages"><span>Drop-off completed</span><i>→</i><span>In transit to retailer</span><i>→</i><span>Refund pending</span><i>→</i><span>Refund received</span></div><section class="tracking-list" aria-label="Return progress">${visible.length?visible.map(x=>{
    const stage=itemStage(x),history=state.history.filter(h=>h.item===x.id).at(-1);
    return `<article class="tracking-item ${stage===4?'complete':''}"><div class="timeline-marker">${stage===4?icon('check'):stage===0?icon('box'):`<span>${stage}</span>`}</div><div class="tracking-item-body"><div class="tracking-item-heading"><div><h2>${stageNames[stage]}</h2><p>${history?`${esc(history.time)} · Updated by you`:`Request by ${date(deadline(x))} · ${esc(stops[x.carrier].name)}`}</p></div>${pill(stage===4?'Completed':stage===3?'Pending':stage===0?'Ready':'In progress',stage===4?'eligible':stage===3?'pending':stage===0?'neutral':'transit')}</div><div class="tracking-product-row">${productSummary(x)}<div class="tracking-actions"><button class="btn secondary small" data-action="tracking-details" data-id="${x.id}">View details</button>${stage<4?`<button class="btn small" data-action="advance" data-id="${x.id}" data-focus="advance-${x.id}">${nextActions[stage]}${icon('arrow')}</button>`:''}</div></div><div class="item-progress" aria-label="${stage} of 4 return steps completed">${[1,2,3,4].map(n=>`<span class="${n<=stage?'done':''}"></span>`).join('')}</div></div></article>`}).join(''):`<div class="empty"><h2>No ${trackingFilter==='completed'?'completed':'active'} returns yet.</h2><p>${trackingFilter==='completed'?'Confirm a refund when the money arrives.':'All refunds have been marked received.'}</p></div>`}</section>${pending.length?`<aside class="reminder-card"><span class="reminder-icon">${icon('bell')}</span><div><h3>Upcoming reminder</h3><p>${pending.some(x=>itemStage(x)===0)?`Start your ${esc(pending.find(x=>itemStage(x)===0).retailer)} return before ${date(deadline(pending.find(x=>itemStage(x)===0)))}.`:'Keep your drop-off receipts and check for refund confirmation.'}</p><small>Demo reminder · No notifications are sent</small></div><button class="btn secondary small" data-action="reminders">Review reminder</button></aside>`:`<aside class="completion-card">${icon('check')}<div><h2>Every return, resolved.</h2><p>${money(total(items))} marked received. You’re all caught up.</p></div>${link('Back to purchases','purchases','secondary')}</aside>`}`;
}
function toast(message){const el=document.getElementById('toast');el.textContent=message;el.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove('show'),3200)}
function modal(title,body){const d=document.getElementById('modal');dialogReturnFocus=document.activeElement;d.innerHTML=`<button class="icon-button modal-close" data-action="close-modal" aria-label="Close dialog">${icon('close')}</button><h2 id="modal-title">${esc(title)}</h2>${body}`;if(!d.open)d.showModal()}
function releaseFile(){if(fileURL)URL.revokeObjectURL(fileURL);fileURL=null;fileName='';fileType=''}
function startDraft(method){releaseFile();addMethod=method;editingDraft=method==='manual';state.draft=method==='manual'?{retailer:'',name:'',price:'',purchase:'',delivery:'',order:'',source:'Manual entry',carrier:'ups'}:null;persist();render()}
function useSample(source='Sample receipt'){releaseFile();state.draft={...sampleReceipt,source};editingDraft=false;persist();render()}
function validatePurchase(d){
  if(!d.retailer.trim()||!d.name.trim())return 'Enter the retailer and item name.';
  if(!Number.isFinite(Number(d.price))||Number(d.price)<=0||Number(d.price)>99999)return 'Enter a valid purchase amount.';
  const validDate=value=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(new Date(value+'T12:00:00Z').valueOf())&&new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value;
  if(!validDate(d.purchase)||d.purchase>DEMO_DATE)return 'Enter a purchase date on or before the demo date.';
  if(!d.delivery)return 'Enter the delivery date before saving this purchase.';
  if(d.delivery&&(!validDate(d.delivery)||d.delivery<d.purchase||d.delivery>DEMO_DATE))return 'Delivery must be between the purchase date and the demo date.';
  return '';
}
function savePurchase(d,select){
  const error=validatePurchase(d);if(error){toast(error);return false}
  const existing=(d.id&&purchaseById(d.id))||(d.order&&allPurchases().find(x=>x.order===d.order.trim()&&x.retailer.toLowerCase()===d.retailer.trim().toLowerCase()&&x.name.toLowerCase()===d.name.trim().toLowerCase()));
  const item={...d,id:existing?.id||d.id||'purchase-'+Date.now(),name:d.name.trim(),retailer:d.retailer.trim(),order:d.order.trim(),price:Math.round(Number(d.price)*100)/100,carrier:d.carrier==='usps'?'usps':'ups'};
  if(existing)state.purchaseOverrides[item.id]={...existing,...item};else state.tasksAdded.unshift(item);
  state.selectedIds=state.selectedIds.filter(id=>id!==item.id);
  if(select&&canReturn(item))state.selectedIds.push(item.id);
  state.draft=null;releaseFile();persist();navigate('purchases');
  toast(existing?'Purchase updated. No duplicate added.':canReturn(item)?'Purchase added. Your selection is ready to plan.':'Purchase saved. This purchase is not eligible for a new return.');return true;
}
function advance(id,confirmRefund=false){
  const item=planItems().find(x=>x.id===id);if(!item)return;
  const stage=itemStage(item);if(stage>=4)return;
  if(stage===3&&!confirmRefund){modal('Confirm refund received',`<p>Has ${money(item.price)} for ${esc(item.name)} arrived in your account?</p><button class="btn full" data-action="confirm-refund" data-id="${id}">Yes, refund received ${icon('check')}</button>`);return}
  state.stages[id]=stage+1;state.history.push({item:id,label:stageNames[stage+1],time:new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})});persist();render();toast(stage===3?'Refund received. One less thing to remember.':'Return progress updated.');
}
function showDetails(id,trackingView=false){const item=(trackingView?planItems():allPurchases()).find(x=>x.id===id);if(!item)return;
  const history=state.history.filter(h=>h.item===id);
  modal(trackingView?'Return details':'Purchase details',`${productSummary(item)}<dl class="detail-fields"><div><dt>Order ID</dt><dd>${esc(item.order||'Not provided')}</dd></div><div><dt>Purchased</dt><dd>${date(item.purchase)}</dd></div><div><dt>Delivered</dt><dd>${date(item.delivery)}</dd></div><div><dt>Return by</dt><dd>${date(deadline(item))}</dd></div><div><dt>Status</dt><dd>${esc(trackingView?stageNames[itemStage(item)]:eligibility(item).label)}</dd></div></dl>${trackingView?`<h3>Updates</h3>${history.length?`<ul class="history-list">${history.map(h=>`<li>${esc(h.label)}<small>${esc(h.time)} · Marked by you</small></li>`).join('')}</ul>`:'<p>No status updates yet. Start by marking your drop-off.</p>'}`:'<p>Sample policy: 30 days from delivery. Check the retailer’s actual return terms before returning.</p>'}`);
}
document.addEventListener('click',async event=>{
  const el=event.target.closest('[data-action]');if(!el)return;
  const action=el.dataset.action,id=el.dataset.id;
  if(action==='close-modal')document.getElementById('modal').close();
  if(action==='purchase-filter'){purchaseFilter=el.dataset.value;render()}
  if(action==='clear-search'){purchaseQuery='';purchaseFilter='all';document.getElementById('purchase-search').value='';render()}
  if(action==='build-plan'&&buildPlan())navigate('plan');
  if(action==='add-method')startDraft(el.dataset.value);
  if(action==='change-evidence')startDraft(addMethod);
  if(action==='sample')useSample();
  if(action==='sample-email')useSample('Sample forwarded email');
  if(action==='edit-draft'){editingDraft=true;render()}
  if(action==='purchase-details')showDetails(id);
  if(action==='tracking-details')showDetails(id,true);
  if(action==='advance')advance(id);
  if(action==='confirm-refund'){document.getElementById('modal').close();advance(id,true)}
  if(action==='copy'){try{await navigator.clipboard.writeText('alex@inbox.returnpilot.example');toast('Example forwarding address copied.')}catch{toast('Example address: alex@inbox.returnpilot.example')}}
  if(action==='profile')modal('Your demo workspace',`<div class="profile-detail"><span class="avatar">${esc(state.name[0])}</span><div><strong>${esc(state.name)}</strong><p>${esc(state.email)}</p></div></div><p>Purchases, your plan, and progress are saved in this browser.</p>${link('Back to login','login','secondary')}`);
  if(action==='reminders'){
    const items=planItems().filter(x=>itemStage(x)<4);
    modal('Upcoming reminders',items.length?`<ul class="reminder-list">${items.map(x=>`<li><strong>${esc(x.name)}</strong><p>${itemStage(x)===0?`Request your return by ${date(deadline(x))}.`:'Keep your drop-off evidence and check the retailer’s refund status.'}</p></li>`).join('')}</ul><p>These are sample reminders. No notifications are sent.</p>`:'<p>No reminders yet. Your return plan will bring the next actions here.</p>');
  }
  if(action==='reset-demo')modal('Restart the demo?',`<p>Restore the starting purchases and clear this demo’s saved selections, plan, and status updates.</p><button class="btn full" data-action="confirm-reset">Restart from login ${icon('arrow')}</button>`);
  if(action==='confirm-reset'){document.getElementById('modal').close();state=freshState();purchaseQuery='';purchaseFilter='all';trackingFilter='all';addMethod='image';editingDraft=false;releaseFile();persist();navigate('login')}
});
document.addEventListener('submit',event=>{
  const form=event.target;if(!['login-form','purchase-form'].includes(form.id))return;event.preventDefault();
  const data=new FormData(form);
  if(form.id==='login-form'){state.email=String(data.get('email')||'').trim();persist();navigate('purchases')}
  if(form.id==='purchase-form'){
    const fields=Object.fromEntries(data);delete fields.selectForReturn;
    savePurchase({...state.draft,...fields},data.has('selectForReturn'));
  }
});
document.addEventListener('change',event=>{
  const el=event.target;
  if(el.dataset.select){const item=purchaseById(el.dataset.select);state.selectedIds=state.selectedIds.filter(id=>id!==el.dataset.select);if(el.checked&&item&&canReturn(item))state.selectedIds.push(item.id);persist();render()}
  if(el.id==='receipt-file')acceptFile(el.files[0]);
  if(el.dataset.check){state.checks[el.dataset.check]=el.checked;persist()}
  if(el.id==='tracking-filter'){trackingFilter=el.value;render()}
  if(el.name==='selectForReturn'&&state.draft){state.draft.selectForReturn=el.checked;persist()}
});
document.addEventListener('input',event=>{
  const el=event.target;
  if(el.id==='purchase-search'){
    purchaseQuery=el.value;
    if(currentRoute()!=='purchases')navigate('purchases');
    else document.getElementById('purchase-list').innerHTML=purchaseList();
  }
  if(el.closest('#purchase-form')&&el.name&&el.type!=='checkbox'&&state.draft){state.draft[el.name]=el.value;persist()}
});
function acceptFile(file){
  if(!file)return;
  if(file.size>10*1024*1024){toast('Choose a file smaller than 10 MB.');return}
  const allowed=addMethod==='pdf'?['application/pdf']:['image/jpeg','image/png'];
  if(!allowed.includes(file.type)){toast(addMethod==='pdf'?'Choose a PDF receipt.':'Choose a JPG or PNG receipt.');return}
  releaseFile();fileURL=URL.createObjectURL(file);fileName=file.name;fileType=file.type;
  state.draft={retailer:'',name:'',price:'',purchase:'',delivery:'',order:'',carrier:'ups',source:'Uploaded file'};
  editingDraft=true;persist();render();toast('Evidence attached. Enter and confirm the purchase details.');
}
document.addEventListener('dragover',event=>{const zone=event.target.closest('#drop-zone');if(zone){event.preventDefault();zone.classList.add('dragging')}});
document.addEventListener('dragleave',event=>event.target.closest('#drop-zone')?.classList.remove('dragging'));
document.addEventListener('drop',event=>{if(event.target.closest('#drop-zone')){event.preventDefault();acceptFile(event.dataTransfer.files[0])}});
document.getElementById('modal').addEventListener('close',()=>{if(dialogReturnFocus?.isConnected)dialogReturnFocus.focus({preventScroll:true})});
window.addEventListener('hashchange',()=>{const dialog=document.getElementById('modal');if(dialog.open)dialog.close();render()});
window.addEventListener('beforeunload',releaseFile);
window.addEventListener('message',event=>{
  if(event.source!==window.parent||event.data?.type!=='return-pilot:navigate')return;
  if(event.origin!==location.origin)return;
  if(['login','purchases','add','plan','tracking'].includes(event.data.route))navigate(event.data.route);
});
render();
