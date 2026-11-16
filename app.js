'use strict';
const DATA_URL = 'data/products.json';
let products = [];
let activeCategory = 'all';
let compareIds = [];
const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value='') => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const categoryName = (category) => ({speaker:'喇叭',amp:'擴大機',source:'訊源',dac:'DAC'}[category] || '設備');

async function loadProducts() {
  // Prefer the bundled JS database so the site also works when index.html is
  // opened directly with file:// (where fetch() of local JSON is blocked).
  if (Array.isArray(window.HIFI_PRODUCTS) && window.HIFI_PRODUCTS.length) {
    products = window.HIFI_PRODUCTS;
  } else {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`產品資料載入失敗：${response.status}`);
    products = await response.json();
  }
  renderProducts(); populateCompareSelect();
}
function filteredProducts() {
  const query = ($('#product-search')?.value || '').trim().toLowerCase();
  return products.filter(p => (activeCategory === 'all' || p.category === activeCategory) &&
    [p.brand,p.model,p.type,p.summary].join(' ').toLowerCase().includes(query));
}
function renderProducts() {
  const grid = $('#product-grid');
  if (!grid) return;
  const list = filteredProducts();
  grid.innerHTML = list.length ? list.map(p => `
    <article class="product-card">
      <div class="product-image">${p.image ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.brand+' '+p.model)}" loading="lazy" onerror="this.remove()">` : `<span class="placeholder">${escapeHtml(p.brand)}</span>`}</div>
      <div class="product-meta"><span>${escapeHtml(categoryName(p.category))}</span><span>${p.dataStatus === 'official' ? 'OFFICIAL DATA' : 'DATA IN PROGRESS'}</span></div>
      <h3>${escapeHtml(p.brand)} ${escapeHtml(p.model)}</h3><p>${escapeHtml(p.summary)}</p>
      <div class="product-bottom"><span class="product-price">${p.priceTwd ? `NT$ ${Number(p.priceTwd).toLocaleString('zh-TW')}` : '價格待查證'}</span><button type="button" data-add-compare="${escapeHtml(p.id)}">加入比較 ＋</button></div>
    </article>`).join('') : '<div class="empty-state">找不到符合條件的設備。</div>';
  grid.querySelectorAll('[data-add-compare]').forEach(button => button.addEventListener('click', () => addCompare(button.dataset.addCompare)));
}
function populateCompareSelect() {
  $('#compare-select').innerHTML = '<option value="">選擇設備加入比較</option>' + products.map(p => `<option value="${escapeHtml(p.id)}">${escapeHtml(p.brand)} ${escapeHtml(p.model)}</option>`).join('');
}
function addCompare(id) {
  if (!products.some(p => p.id === id)) return;
  if (compareIds.includes(id)) return;
  if (compareIds.length >= 3) { alert('最多比較三項設備。'); return; }
  compareIds.push(id); renderCompare(); $('#compare-select').value = '';
}
function renderCompare() {
  const target = $('#compare-table');
  if (!compareIds.length) { target.innerHTML = '<div class="empty-state">尚未選擇產品。從上方加入設備開始比較。</div>'; return; }
  const chosen = compareIds.map(id => products.find(p => p.id === id)).filter(Boolean);
  const rows = [
    ['類別',p=>categoryName(p.category)],['產品類型',p=>p.type],['價格',p=>p.priceTwd ? `NT$ ${Number(p.priceTwd).toLocaleString('zh-TW')}` : '待查證'],
    ['頻率響應',p=>p.specs.frequencyResponse || '待查證'],['靈敏度',p=>p.specs.sensitivity || '待查證'],['阻抗',p=>p.specs.impedance || p.specs.supportedLoad || '待查證'],
    ['擴大機功率',p=>p.specs.ampPower || p.specs.power || '不適用 / 待查證'],['資料狀態',p=>p.dataStatus === 'official' ? '官方資料已確認' : '部分資料待查證'],['資料來源',p=>`<a href="${escapeHtml(p.source)}" target="_blank" rel="noopener">${escapeHtml(p.sourceLabel)}</a>`]
  ];
  target.innerHTML = `<table><thead><tr><th>比較項目</th>${chosen.map(p=>`<th>${escapeHtml(p.brand)} ${escapeHtml(p.model)} <button type="button" data-remove="${escapeHtml(p.id)}" aria-label="移除">×</button></th>`).join('')}</tr></thead><tbody>${rows.map(([label,get])=>`<tr><td>${label}</td>${chosen.map(p=>`<td>${get(p)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  target.querySelectorAll('[data-remove]').forEach(btn=>btn.addEventListener('click',()=>{compareIds=compareIds.filter(id=>id!==btn.dataset.remove);renderCompare();}));
}
function recommendationReason(profile, speaker) {
  const reasons = [];
  if (profile.room === 'small') reasons.push('以小型空間容易安置的書架喇叭為優先');
  if (profile.room === 'medium') reasons.push('適合一般中型房間的兩聲道起步方向');
  if (profile.room === 'large') reasons.push('較大空間應安排試聽，並評估更大型喇叭');
  if (profile.sound === 'warm') reasons.push('可優先試聽中頻厚度與人聲表現');
  if (profile.sound === 'detail') reasons.push('可優先試聽高頻細節與音像定位');
  if (profile.sound === 'balanced') reasons.push('以均衡、自然與長時間聆聽舒適度為方向');
  if (profile.source === 'vinyl') reasons.push('黑膠系統需另確認唱頭放大器或擴大機 PHONO 輸入');
  if (profile.source === 'cd') reasons.push('CD 播放器需確認數位或類比輸出與擴大機輸入');
  if (profile.source === 'streaming') reasons.push('串流或電腦訊源需確認 DAC 與數位輸入需求');
  return reasons.join('；')+'。';
}
function buildRecommendations(profile) {
  const speaker = products.find(p=>p.id==='dali-sonik-1');
  const speakerCost = profile.speakerBudget || Math.round(profile.budget*0.5);
  const budgetFit = speakerCost <= profile.budget;
  const options = [
    {name:'The Essential',label:'均衡入門',share:.45,amp:'選擇符合 6 Ω 負載、建議功率範圍的綜合擴大機',source:'依訊源配置必要的類比或數位輸入',note:'控制總預算，先建立完整兩聲道系統。'},
    {name:'The Connected',label:'串流優先',share:.55,amp:'選擇具備串流功能且能穩定驅動 6 Ω 喇叭的擴大機',source:'串流平台／電腦；確認 DAC 與輸入規格',note:'適合以數位音樂為主要聆聽來源。'},
    {name:'The Classic',label:'實體媒體',share:.6,amp:'選擇具備合適 PHONO 或線路輸入的綜合擴大機',source:profile.source==='cd'?'CD 播放器；核對輸出端子':'黑膠唱盤＋唱頭放大器（若唱盤未內建）',note:'為唱片與實體媒體保留系統擴充空間。'}
  ];
  return options.map((o,i)=>({ ...o, budget:Math.round(profile.budget*o.share), reason:recommendationReason(profile,speaker),
    compatibility: `喇叭已知：${speaker.specs.impedance}、建議擴大機功率 ${speaker.specs.ampPower}。擴大機尚未指定型號，實際相容性${'需以選定擴大機原廠規格確認'}。`,
    status:budgetFit?'喇叭分項預算未超過總預算；實際價格尚未取得，無法確認整套是否在預算內。':'喇叭分項預算高於總預算，請調整預算配置。'}));
}
function renderRecommendations(results, profile) {
  $('#recommend-results').innerHTML = `<div class="recommend-heading"><p class="eyebrow">THREE SYSTEM DIRECTIONS</p><p class="data-note">以下為搭配方向示範，不是已核實的購物清單；資料不足的型號、價格及相容性不會被假裝成已確認。</p></div>` + results.map((r,i)=>`
    <article class="recommend-card"><span class="rank">OPTION 0${i+1} / ${escapeHtml(r.label)}</span><h3>${escapeHtml(r.name)}</h3><p class="match-desc">${escapeHtml(r.note)}</p>
      <ul><li><b>喇叭：</b>DALI SONIK 1</li><li><b>擴大機：</b>${escapeHtml(r.amp)}</li><li><b>訊源：</b>${escapeHtml(r.source)}</li><li><b>預算方向：</b>約 NT$ ${r.budget.toLocaleString('zh-TW')}（配置比例，不代表產品報價）</li></ul>
      <p class="compat"><b>推薦原因：</b>${escapeHtml(r.reason)}<br><b>相容性：</b>${escapeHtml(r.compatibility)}<br><b>預算檢查：</b>${escapeHtml(r.status)}</p></article>`).join('');
}
function init() {
  $('#category-filters').addEventListener('click',e=>{const btn=e.target.closest('[data-category]');if(!btn)return;activeCategory=btn.dataset.category;$('#category-filters').querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===btn));renderProducts();});
  $('#product-search').addEventListener('input',renderProducts);
  $('#compare-select').addEventListener('change',e=>{if(e.target.value)addCompare(e.target.value);});
  $('#clear-compare').addEventListener('click',()=>{compareIds=[];renderCompare();});
  $('#recommend-form').addEventListener('submit',e=>{e.preventDefault();const profile={budget:Number($('#budget').value),speakerBudget:Number($('#speaker-budget').value),room:$('#room').value,source:$('#source-type').value,sound:$('#sound').value};if(!Number.isFinite(profile.budget)||profile.budget<=0){alert('請輸入有效的總預算。');return;}renderRecommendations(buildRecommendations(profile),profile);});
  $('#menu-toggle').addEventListener('click',()=>{const nav=$('#main-nav');const open=nav.classList.toggle('open');$('#menu-toggle').setAttribute('aria-expanded',String(open));});
  $('#main-nav').querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>$('#main-nav').classList.remove('open')));
  loadProducts().catch(error=>{$('#product-grid').innerHTML=`<div class="empty-state">${escapeHtml(error.message)}。請使用本機伺服器或 GitHub Pages 開啟網站。</div>`;});
}
if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded',init);
if (typeof module !== 'undefined') module.exports={buildRecommendations,filteredProducts,categoryName,setProducts:(items)=>{products=items;}};
