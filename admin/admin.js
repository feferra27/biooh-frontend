let API='http://localhost:4000';
let data = { clinic:'default', brand:{name:'BiOOH'}, qrUrl:'https://biooh.link/checkin', ticker:['Use o QR para check‑in','Anote 3 dúvidas','Hidrate-se'], items: [] };

function el(tag, attrs={}, children=[]) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=> e.setAttribute(k,v));
  (Array.isArray(children)?children:[children]).forEach(c=> e.append(c.nodeType?c:document.createTextNode(c)));
  return e;
}

function load(){
  API = document.getElementById('api').value;
  data.clinic = document.getElementById('clinic').value;
  fetch(`${API}/api/playlist?clinic=${encodeURIComponent(data.clinic)}`)
    .then(r=>r.json())
    .then(json=>{ data = json; render(); })
    .catch(()=>{ render(); });
}

function render(){
  document.getElementById('brandName').value = data.brand?.name||'';
  document.getElementById('qrUrl').value = data.qrUrl||'';
  document.getElementById('ticker').value = (data.ticker||[]).join('|');
  const items = document.getElementById('items');
  items.innerHTML='';
  (data.items||[]).forEach((it, i)=> items.append(renderItem(it, i)));
}

function renderItem(it, i){
  const card = el('div', {class:'card'});
  card.append(el('div',{},`#${i+1} — ${it.type}`));
  const fields = [];
  const cfg = {
    imageText: ['title','lead','image','alt','badge','duration','bullets'],
    video: ['title','lead','src','duration','bullets'],
    quiz: ['question','options','answer','explain','image','duration','revealMs']
  }[it.type];
  cfg.forEach(k=>{
    const label = el('label',{},k);
    const inp = el('input',{class:'inp'});
    if(k==='bullets' || k==='options') inp.value = (it[k]||[]).join('|');
    else inp.value = it[k]||'';
    inp.oninput = ()=>{
      if(k==='bullets' || k==='options') it[k] = inp.value.split('|').filter(Boolean);
      else if(['duration','revealMs'].includes(k)) it[k] = Number(inp.value||0);
      else it[k] = inp.value;
    };
    card.append(label, inp);
  });
  const row = el('div',{class:'row'},[
    el('button',{class:'btn'},'↑'),
    el('button',{class:'btn'},'↓'),
    el('button',{class:'btn'},'Excluir')
  ]);
  row.children[0].onclick = ()=>{ if(i>0){ [data.items[i-1], data.items[i]] = [data.items[i], data.items[i-1]]; render(); } };
  row.children[1].onclick = ()=>{ if(i<data.items.length-1){ [data.items[i+1], data.items[i]] = [data.items[i], data.items[i+1]]; render(); } };
  row.children[2].onclick = ()=>{ data.items.splice(i,1); render(); };
  card.append(row);
  return card;
}

function add(type){
  const base = { type, duration: 16000 };
  if(type==='quiz') Object.assign(base,{ question:'', options:['Sim','Não'], answer:'Não', revealMs:6000 });
  data.items = data.items||[]; data.items.push(base); render();
}

async function applyTemplate(name){
  const r = await fetch(`../../content/templates/${name}.json`);
  const tpl = await r.json();
  data.items = tpl.items; data.brand = tpl.brand || data.brand; data.qrUrl = tpl.qrUrl || data.qrUrl; data.ticker = tpl.ticker || data.ticker; render();
}

function save(){
  data.brand = { name: document.getElementById('brandName').value };
  data.qrUrl = document.getElementById('qrUrl').value;
  data.ticker = document.getElementById('ticker').value.split('|').filter(Boolean);
  alert('Salvo localmente (lembre de Publicar).');
}

function publish(){
  fetch(`${API}/api/playlist`,{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) })
    .then(()=>alert('Publicado!'))
    .catch(()=>alert('Falha ao publicar'));
}

window.addEventListener('load', load);
