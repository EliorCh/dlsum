const DATA={"rx":[-2.0,-1.789,-1.579,-1.368,-1.158,-0.947,-0.737,-0.526,-0.316,-0.105,0.105,0.316,0.526,0.737,0.947,1.158,1.368,1.579,1.789,2.0],"ry":[-3.999,-3.112,-3.095,-3.122,-2.097,-2.044,-0.403,1.467,0.224,0.685,2.385,2.841,3.179,2.733,4.223,5.537,4.087,5.563,4.709,5.91],"cx":[[-4.84,-3.24],[-4.27,-2.73],[-2.84,-3.19],[-5.52,-3.54],[-3.05,-2.89],[-4.53,-3.48],[-3.98,-3.81],[-1.94,-3.81],[-3.03,-2.12],[-3.58,-3.11],[-2.89,-2.94],[-4.23,-2.92],[-1.64,-4.55],[-2.14,-2.88],[-3.64,-1.0],[-2.24,-4.2],[-2.93,-2.42],[-3.19,-2.32],[-3.07,-2.33],[-1.56,-3.68],[-2.8,-3.46],[-2.87,-4.19],[-3.58,-3.2],[-2.1,-1.85],[-4.32,-3.79],[-2.35,-4.99],[-3.46,-3.1],[-1.74,-2.31],[-3.33,-3.37],[-3.25,-1.48],[-3.43,-3.3],[-2.65,-3.12],[-3.2,-4.11],[-3.01,-3.44],[-1.83,-2.35],[-3.02,-2.33],[-3.34,-1.95],[-3.01,-2.42],[-4.29,-2.65],[-4.69,-5.04],[-3.3,-3.9],[-2.84,-0.76],[-3.83,-3.62],[-2.79,-2.51],[-3.18,-3.21],[-2.3,-2.48],[-4.03,-3.08],[-2.96,-4.05],[-2.74,-3.86],[-2.03,-2.81],[3.09,2.41],[2.88,1.0],[1.87,3.36],[0.87,3.85],[1.25,3.76],[2.15,3.78],[3.13,1.46],[4.25,4.44],[2.93,2.73],[2.84,2.02],[4.1,2.46],[2.95,2.21],[2.37,1.72],[4.26,2.85],[3.97,3.01],[2.31,2.67],[2.44,3.01],[2.62,2.7],[1.62,2.19],[4.65,2.33],[1.95,3.34],[4.41,1.55],[2.79,2.37],[1.24,3.73],[2.98,3.07],[2.25,3.45],[2.46,2.86],[1.89,1.78],[4.34,2.49],[3.29,2.97],[2.56,2.49],[3.63,2.7],[2.85,3.02],[4.18,3.68],[3.38,2.44],[1.62,3.95],[3.97,2.86],[3.54,3.78],[3.83,3.92],[2.54,4.51],[1.75,3.86],[3.49,3.87],[4.88,4.48],[1.85,1.31],[3.82,1.98],[2.99,3.84],[1.36,0.89],[3.26,3.04],[2.75,3.04],[2.14,1.49]],"cy":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],"ctrain":{"0":{"w":[0.4,-0.6],"b":1.5,"loss":0.4383,"acc":0.44,"tp":44,"tn":0,"fp":50,"fn":6},"5":{"w":[0.632,-0.368],"b":1.463,"loss":0.2196,"acc":0.59,"tp":50,"tn":9,"fp":41,"fn":0},"10":{"w":[0.809,-0.176],"b":1.41,"loss":0.0815,"acc":0.9,"tp":50,"tn":40,"fp":10,"fn":0},"15":{"w":[0.901,-0.067],"b":1.378,"loss":0.0399,"acc":0.98,"tp":50,"tn":48,"fp":2,"fn":0},"20":{"w":[0.954,0.001],"b":1.357,"loss":0.0247,"acc":1.0,"tp":50,"tn":50,"fp":0,"fn":0},"30":{"w":[1.017,0.083],"b":1.332,"loss":0.0133,"acc":1.0,"tp":50,"tn":50,"fp":0,"fn":0},"100":{"w":[1.162,0.275],"b":1.27,"loss":0.0028,"acc":1.0,"tp":50,"tn":50,"fp":0,"fn":0}}};

/* ================= Deep-learning living-diagram engine =================
   Same contract as er-engine.js: render(spec) honours spec.show (layer letters),
   spec.prev (layers in prev but not in show get class "fresh"), spec.nt (view).
   A spec = {w,h,label, base:'<svg>', L:{a:'<svg>',b:...}, views:{nt:{base,L}}, ntd:'default view', extra}
   Layers are drawn in the insertion order of L. */
const NS='http://www.w3.org/2000/svg';
const HEB=/[֐-׿]/;
const ALL='abcdefghijklmnopqrstuvwxyz';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
/* text: o = {a:'middle'|'start'|'end', c:class, fs, fw, f:fill, rot} */
function tx(x,y,s,o={}){
  const he=HEB.test(s);let a=o.a||'middle';if(he&&a!=='middle')a=a==='start'?'end':'start';
  const st=[o.fs?`font-size:${o.fs}px`:'',o.fw?`font-weight:${o.fw}`:'',o.f?`fill:${o.f}`:''].filter(Boolean).join(';');
  return `<text x="${x}" y="${y}" text-anchor="${a}" dominant-baseline="central"${he?' direction="rtl"':''}${o.c?` class="${o.c}"`:''}${st?` style="${st}"`:''}${o.rot?` transform="rotate(${o.rot} ${x} ${y})"`:''}>${esc(s)}</text>`;
}
function ln(x1,y1,x2,y2,c='lk',o={}){return `<line class="${c}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${o.d?` stroke-dasharray="${o.d}"`:''}${o.sw?` style="stroke-width:${o.sw}"`:''}/>`;}
/* arrow with a head drawn as a polygon (no marker ids needed) */
function ar(x1,y1,x2,y2,c='lk',o={}){
  const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,h=o.h||9,wd=o.wd||5;
  const bx=x2-ux*h,by=y2-uy*h;
  return `<g class="arw ${c}">${ln(x1,y1,bx,by,c,o)}<polygon points="${x2},${y2} ${bx-uy*wd},${by+ux*wd} ${bx+uy*wd},${by-ux*wd}"/></g>`;
}
/* box: top-left x,y; label may contain \n; o = {c:class, fs, r, mono} */
function bx(x,y,w,h,label,o={}){
  const lines=String(label||'').split('\n'),fs=o.fs||14,lh=fs*1.25,y0=y+h/2-(lines.length-1)*lh/2;
  return `<g class="bx ${o.c||'bk'}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r??7}"/>${lines.map((s,i)=>tx(x+w/2,y0+i*lh,s,{fs,fw:o.fw||700,c:o.mono?'mono':''})).join('')}</g>`;
}
function circ(x,y,r,c='nd',label='',o={}){return `<g class="${c}"><circle cx="${x}" cy="${y}" r="${r}"/>${label?tx(x,y,label,{fs:o.fs||14,fw:700}):''}</g>`;}
/* matrix of values; o = {cs:cell, c:class, hl:Set('i,j'), lab, fs, dark:fn(v)->bool} */
function mat(x,y,rows,o={}){
  const cs=o.cs||34,ch=o.ch||cs,fs=o.fs||13;let s='';
  rows.forEach((r,i)=>r.forEach((v,j)=>{
    const dark=o.dark?o.dark(v,i,j):false, hl=o.hl&&o.hl.has(i+','+j);
    s+=`<rect class="cell${dark?' dk':''}${hl?' hl':''}" x="${x+j*cs}" y="${y+i*ch}" width="${cs}" height="${ch}"/>`;
    if(v!==''&&v!==null&&!o.novals)s+=tx(x+j*cs+cs/2,y+i*ch+ch/2,String(v),{fs,c:'mono'+(dark?' inv':'')});
  }));
  if(o.br){const w=rows[0].length*cs,h=rows.length*ch;s+=`<path class="brk" d="M${x-3},${y} h-5 v${h} h5 M${x+w+3},${y} h5 v${h} h-5"/>`;}
  if(o.lab)s+=tx(x+rows[0].length*cs/2,y-14,o.lab,{fs:13,fw:700,c:o.labc||'lbl'});
  return `<g class="mat ${o.c||''}">${s}</g>`;
}
/* a plot frame: returns {X,Y,svg} ; o = {x,y,w,h,xr,yr,xl,yl,xt,yt,grid} */
function plot(o){
  const X=v=>o.x+(v-o.xr[0])/(o.xr[1]-o.xr[0])*o.w, Y=v=>o.y+o.h-(v-o.yr[0])/(o.yr[1]-o.yr[0])*o.h;
  let s=`<rect class="pbg" x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}"/>`;
  (o.xt||[]).forEach(t=>{s+=ln(X(t),o.y,X(t),o.y+o.h,'pgrid')+tx(X(t),o.y+o.h+12,String(t),{fs:11,c:'tick'});});
  (o.yt||[]).forEach(t=>{s+=ln(o.x,Y(t),o.x+o.w,Y(t),'pgrid')+tx(o.x-6,Y(t),String(t),{fs:11,a:'end',c:'tick'});});
  if(o.xr[0]<0&&o.xr[1]>0)s+=ln(X(0),o.y,X(0),o.y+o.h,'pax');
  if(o.yr[0]<0&&o.yr[1]>0)s+=ln(o.x,Y(0),o.x+o.w,Y(0),'pax');
  s+=`<rect class="pfr" x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}"/>`;
  if(o.xl)s+=tx(o.x+o.w/2,o.y+o.h+28,o.xl,{fs:12,c:'tick'});
  if(o.yl)s+=tx(o.x-34,o.y+o.h/2,o.yl,{fs:12,c:'tick',rot:-90});
  return {X,Y,svg:s,o};
}
/* curve y=f(x) clipped to the plot */
function curve(P,f,c='hyp',o={}){
  const [a,b]=o.dom||P.o.xr,n=o.n||120;let d='',pen=false;
  for(let i=0;i<=n;i++){const x=a+(b-a)*i/n,y=f(x);
    if(!isFinite(y)||y<P.o.yr[0]-1e-9||y>P.o.yr[1]+1e-9){pen=false;continue;}
    d+=(pen?'L':'M')+P.X(x).toFixed(1)+','+P.Y(y).toFixed(1);pen=true;}
  return `<path class="crv ${c}" d="${d}"${o.d?` stroke-dasharray="${o.d}"`:''}/>`;
}
/* line w1*x + w2*y + b = 0 inside plot (decision boundary) */
function bline(P,w1,w2,b,c='hyp',o={}){
  if(Math.abs(w2)>1e-9)return curve(P,x=>-(w1*x+b)/w2,c,o);
  const x=-b/w1;return ln(P.X(x),P.o.y,P.X(x),P.o.y+P.o.h,'crv '+c,o);
}
function dots(P,pts,c='pd',r=4){return pts.map(p=>`<circle class="${c}" cx="${P.X(p[0]).toFixed(1)}" cy="${P.Y(p[1]).toFixed(1)}" r="${r}"/>`).join('');}
function house(x,y,c){return `<path class="hs ${c}" d="M${x-6},${y+5} v-7 l6,-6 l6,6 v7 z"/>`;}
function cross(x,y,c='bad',s=7){return `<path class="xm ${c}" d="M${x-s},${y-s} L${x+s},${y+s} M${x+s},${y-s} L${x-s},${y+s}"/>`;}
function ok(x,y,s=7){return `<path class="okm" d="M${x-s},${y} L${x-s/3},${y+s*.7} L${x+s},${y-s*.7}"/>`;}
/* seeded RNG for reproducible illustration data */
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
function gauss(r){let u=0,v=0;while(!u)u=r();while(!v)v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}

function R(spec){
  const nt=spec.nt||spec.ntd||'';
  const v=(spec.views&&spec.views[nt])?{...spec,...spec.views[nt]}:spec;
  const show=spec.show||ALL, prev=spec.prev;
  let out=v.base||'';
  for(const [k,svg] of Object.entries(v.L||{})){
    if(!show.includes(k))continue;
    const f=(prev!==undefined&&!prev.includes(k))?' fresh':'';
    out+=`<g class="lay${f}">${svg}</g>`;
  }
  return `<svg xmlns="${NS}" viewBox="0 0 ${spec.w} ${spec.h}" width="${spec.w}" height="${spec.h}" style="max-width:${spec.w}px" role="img" aria-label="${spec.label||'תרשים'}">${out}${v.extra||''}</svg>`;
}
const SPECS={};
function renderAll(){document.querySelectorAll('div[data-spec]:not(.step)').forEach(el=>{const sp=SPECS[el.dataset.spec];if(sp)el.innerHTML=R({...sp,show:el.dataset.show||ALL,nt:el.dataset.nt||sp.ntd});});}

/* Call once, AFTER all SPECS are defined. */
function initGuide(){
  renderAll();
  /* ---- view toggle ---- */
  document.querySelectorAll('.ntbar').forEach(bar=>bar.addEventListener('click',ev=>{
    const b=ev.target.closest('button');if(!b)return;
    bar.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));
    const el=bar.dataset.for?document.getElementById(bar.dataset.for):bar.parentElement.querySelector('.mainfig');el.dataset.nt=b.dataset.nt;
    if(el._draw)el._draw(b.dataset.nt);else if(el.dataset.spec&&SPECS[el.dataset.spec])el.innerHTML=R({...SPECS[el.dataset.spec],show:el.dataset.show||ALL,nt:b.dataset.nt});
  }));
  /* ---------- stepped solutions: one living diagram in a fixed "notebook page" ---------- */
  document.querySelectorAll('.ex.stepped').forEach(ex=>{
    const steps=[...ex.querySelectorAll('.step')],fig=ex.querySelector('.mainfig'),cap=ex.querySelector('.livecap');
    const prevB=ex.querySelector('.prevBtn'),nextB=ex.querySelector('.nextBtn'),allB=ex.querySelector('.allBtn'),prog=ex.querySelector('.prog');
    const stepsBox=ex.querySelector('.steps');
    const used=[...new Set(steps.map(s=>s.dataset.spec).filter(k=>k&&SPECS[k]))];
    const W=Math.max(400,...used.map(k=>SPECS[k].w)),H=Math.max(200,...used.map(k=>SPECS[k].h));
    let cur=0,prevShow;
    fig._draw=nt=>{
      if(nt)fig.dataset.nt=nt;
      const spec=fig.dataset.spec,sp=SPECS[spec];
      const inner=sp?R({...sp,show:fig.dataset.show,nt:fig.dataset.nt||sp.ntd,prev:prevShow}).replace('<svg ',`<svg style="width:${(sp.w/W*100).toFixed(3)}%" `):'<div class="emptyfig">התרשים ייבנה כאן שלב אחרי שלב</div>';
      fig.innerHTML=`<div class="frame" data-w="${W}" style="--fw:${W}px;aspect-ratio:${W}/${H}">${inner}</div>`;
      prevShow=undefined;
    };
    function go(i,forward){
      cur=Math.max(0,Math.min(steps.length-1,i));
      steps.forEach((st,j)=>st.hidden=j!==cur);
      const st=steps[cur],spec=st.dataset.spec;
      prevShow=(forward&&cur>0&&steps[cur-1].dataset.spec===spec)?(steps[cur-1].dataset.show||ALL):undefined;
      fig.dataset.spec=spec;fig.dataset.show=st.dataset.show||ALL;
      fig._draw();
      cap.textContent=st.dataset.cap||'';
      cap.classList.toggle('hasfresh',!!fig.querySelector('.fresh'));
      prog.textContent=`שלב ${cur+1} מתוך ${steps.length}`;
      prevB.disabled=cur===0;nextB.disabled=cur===steps.length-1;allB.disabled=cur===steps.length-1;
      if(forward)st.classList.add('new');
    }
    function lock(){
      cap.style.minHeight='';stepsBox.style.minHeight='';
      let hc=0,hs=0;const keep=cur;
      steps.forEach((st,j)=>{steps.forEach((x,k)=>x.hidden=k!==j);
        cap.textContent=st.dataset.cap||'';cap.classList.add('hasfresh');
        hc=Math.max(hc,cap.offsetHeight);hs=Math.max(hs,stepsBox.offsetHeight);});
      cap.style.minHeight=hc+'px';stepsBox.style.minHeight=hs+'px';
      go(keep,false);
    }
    prevB.addEventListener('click',()=>go(cur-1,false));
    nextB.addEventListener('click',()=>go(cur+1,true));
    allB.addEventListener('click',()=>go(steps.length-1,false));
    go(0,false);lock();
    let t;window.addEventListener('resize',()=>{clearTimeout(t);t=setTimeout(lock,150);});
    if(document.fonts)document.fonts.ready.then(lock);
  });
  /* ---------- nav active state (chapter rail) ---------- */
  const subs=[...document.querySelectorAll('nav.side .secs a')],chs=[...document.querySelectorAll('nav.side a.ch')];
  const secs=subs.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  function mark(id){const a=subs.find(l=>l.getAttribute('href')==='#'+id);if(!a)return;
    subs.forEach(l=>l.classList.toggle('on',l===a));if(window.innerWidth>900)a.scrollIntoView({block:'nearest'});chs.forEach(c=>c.classList.toggle('active',c.dataset.g===a.dataset.g));}
  const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)mark(e.target.id);});},{rootMargin:'-15% 0px -75% 0px'});
  secs.forEach(s=>io.observe(s));
  /* ---------- chapter views (hash routed) ---------- */
  const views=[...document.querySelectorAll('.view')];
  function route(){if(!views.length)return;
    const id=decodeURIComponent(location.hash.slice(1));
    let t=id&&document.getElementById(id);if(!t||!t.closest('.view'))t=views[0];
    const v=t.classList.contains('view')?t:t.closest('.view');
    const changed=v.hidden;
    views.forEach(x=>x.hidden=x!==v);
    if(changed)window.dispatchEvent(new Event('resize'));
    const first=v.querySelector('section');
    if(t===v||t===first)window.scrollTo(0,0);else t.scrollIntoView();
    const s=t.closest('section')||first;if(s)mark(s.id);
  }
  window.addEventListener('hashchange',route);route();
  /* ---------- fit-to-width + zoom ---------- */
  (function(){
    const figs=[...document.querySelectorAll('figure.fig')];
    figs.forEach(f=>{const b=document.createElement('button');b.type='button';b.className='zoombtn';b.textContent='הגדל';
      b.addEventListener('click',()=>{const z=f.classList.toggle('zoomed');b.textContent=z?'התאם לרוחב':'הגדל';});f.prepend(b);});
    function refresh(){figs.forEach(f=>{const s=f.querySelector('svg'),b=f.querySelector('.zoombtn');
      const fr=f.querySelector('.frame');const w=fr?+fr.dataset.w:(s?+s.getAttribute('width')||0:0);b.hidden=!(w>f.clientWidth-24)&&!f.classList.contains('zoomed');});}
    refresh();window.addEventListener('resize',refresh);
    document.addEventListener('click',()=>setTimeout(refresh,0));
  })();
  /* ---------- collapsible menu ---------- */
  (function(){
    const nav=document.querySelector('nav.side');if(!nav)return;
    const b=document.createElement('button');b.type='button';b.className='menubtn';b.setAttribute('aria-expanded','false');b.textContent='☰ פרקים';
    const sc=document.createElement('div');sc.className='scrim';
    document.body.append(b,sc);
    const set=o=>{document.body.classList.toggle('menu-open',o);b.setAttribute('aria-expanded',o);b.textContent=o?'✕ סגור':'☰ פרקים';};
    b.addEventListener('click',()=>set(!document.body.classList.contains('menu-open')));
    sc.addEventListener('click',()=>set(false));
    nav.addEventListener('click',e=>{if(e.target.closest('a'))set(false);});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')set(false);});
  })();
}


/* ============ helpers specific to this guide ============ */
const f2=v=>(Math.round(v*100)/100).toString().replace('-','−');
const f3=v=>(Math.round(v*1000)/1000).toString().replace('-','−');
/* half-plane polygon inside a plot: points where w1*x+w2*y+b has sign s */
function halfPoly(P,w1,w2,b,s,c){
  const [x0,x1]=P.o.xr,[y0,y1]=P.o.yr;let poly=[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
  const v=p=>s*(w1*p[0]+w2*p[1]+b);const out=[];
  for(let i=0;i<poly.length;i++){const A=poly[i],B=poly[(i+1)%poly.length],va=v(A),vb=v(B);
    if(va>=0)out.push(A);
    if((va>=0)!==(vb>=0)){const t=va/(va-vb);out.push([A[0]+t*(B[0]-A[0]),A[1]+t*(B[1]-A[1])]);}}
  return out.length?`<polygon class="${c}" points="${out.map(p=>P.X(p[0]).toFixed(1)+','+P.Y(p[1]).toFixed(1)).join(' ')}"/>`:'';
}
const sig=z=>1/(1+Math.exp(-z));

/* ============ hero: the learning model (4 components) ============ */
SPECS.model4={w:780,h:300,label:'מודל הלמידה',
 base:
  `<ellipse cx="150" cy="160" rx="132" ry="118" class="famov"/>`+
  tx(150,58,'משפחת היפותזות H',{fs:14,fw:800,c:'thyp'})+
  [[95,100,'h₁'],[175,95,'h₂'],[80,160,'h₃'],[160,150,'h₄'],[110,215,'h₅'],[200,205,'h₆'],[230,140,'…']].map(([x,y,s])=>bx(x-22,y-14,44,28,s,{c:'bhyp',fs:13})).join('')+
  bx(380,10,160,38,'DATA  (xᵢ, yᵢ)',{c:'bdat',fs:14})+ar(460,48,460,70,'sdat')+
  `<rect x="320" y="72" width="280" height="150" rx="10" class="algbox"/>`+
  tx(460,90,'אלגוריתם למידה',{fs:14,fw:800,c:'topt'})+
  bx(340,100,240,44,'פונקציית טעות\ne : Y × Y → ℝ',{c:'blos',fs:13})+
  bx(340,152,240,54,'בעיית אופטימיזציה\nminₕ (1/N) Σ e(yᵢ, h(xᵢ))',{c:'bopt',fs:13})+
  ar(283,160,318,160,'shyp')+ar(460,222,460,246,'smod')+
  bx(360,246,200,46,'h*\nהפונקציה שנבחרה = המודל',{c:'bmod',fs:13})+
  bx(625,110,140,58,'פונקציית מטרה\n(לא ידועה)\nf : X → Y',{c:'bgh',fs:12})+
  `<line x1="625" y1="139" x2="600" y2="139" class="lk" stroke-dasharray="4 4"/>`};

/* ============ AI history timeline ============ */
(function(){
 const X=y=>40+(y-1940)/(2026-1940)*740;let s='';
 s+=`<rect x="${X(1969)}" y="70" width="${X(1980)-X(1969)}" height="26" class="winter"/><rect x="${X(1990)}" y="70" width="${X(2006)-X(1990)}" height="26" class="winter"/>`;
 s+=tx((X(1969)+X(1980))/2,83,'חורף',{fs:11,c:'tmut'})+tx((X(1990)+X(2006))/2,83,'חורף',{fs:11,c:'tmut'});
 s+=ln(40,83,780,83,'lk',{sw:2});
 [1940,1960,1980,2000,2020].forEach(y=>{s+=ln(X(y),78,X(y),88,'lk')+tx(X(y),102,String(y),{fs:11,c:'tick'});});
 const ev=[[1943,'נוירון MCP',1],[1950,'מבחן טיורינג',-1],[1957,'פרספטרון',1],[1969,'בעיית XOR',-1],[1986,'Backprop',1],[1998,'CNN',-1],[2012,'AlexNet',1],[2017,'Transformer',-1],[2020,'GPT-3',1],[2022,'ChatGPT',-1],[2025,'DeepSeek-R1',1]];
 ev.forEach(([y,t,u],i)=>{const yy=u>0?40:130,lift=(i%4===2||i%4===3)?(u>0?-16:16):0;
   s+=ln(X(y),83,X(y),yy+lift+(u>0?8:-8),'lk')+`<circle cx="${X(y)}" cy="83" r="4" class="${y===2012?'p1':'pd'}"/>`+tx(X(y),yy+lift,t,{fs:12,fw:700,c:y===2012?'thyp':''})+tx(X(y),yy+lift+(u>0?-14:14),String(y),{fs:10,c:'tick'});});
 SPECS.hist={w:820,h:170,label:'ציר זמן',base:s};
})();

/* ============ Rosenblatt-style perceptron on 3x3 images ============ */
const PW=[-0.5,-0.1,0.4,0.1,0.2,0.2,0.8,-0.3,-0.4],PB=0.2;
function percSpec(img,label){
  const x=img.flat(),prod=PW.map((w,i)=>w*x[i]),dot=prod.reduce((a,b)=>a+b,0),z=dot+PB;
  const L={};
  L.a=tx(90,40,'התמונה (3×3)',{fs:13,fw:700})+mat(30,55,img,{cs:40,novals:true,dark:v=>v===0});
  L.b=ar(165,115,200,115,'ink')+mat(210,55,img,{cs:40,fs:15})+tx(270,40,'מטריצה: שחור הוא 0, לבן הוא 1',{fs:12,c:'lbl'});
  L.c=ar(270,182,190,236,'ink')+mat(30,250,[x],{cs:34,fs:14,c:'mdat'})+tx(183,302,'וקטור קלט x — 9 מספרים',{fs:12,c:'tdat',fw:700});
  L.d=mat(430,55,[['?','?','?'],['?','?','?'],['?','?','?']],{cs:44,c:'mghost',fs:15})+tx(496,40,'משקולות w (לא ידועות)',{fs:12,c:'lbl'})+bx(584,82,56,36,'b = ?',{c:'bgh',fs:13})+
      ar(345,267,600,267,'ink')+circ(632,267,30,'nd','Σ',{fs:20})+ar(496,196,615,243,'shyp')+
      ar(662,267,690,267,'ink')+bx(692,250,64,34,'sign',{c:'bhyp',fs:14})+
      tx(470,250,'sign(w₁x₁ + … + w₉x₉ + b)',{fs:13,c:'thyp',fw:700});
  L.e=mat(430,55,[PW.slice(0,3),PW.slice(3,6),PW.slice(6,9)].map(r=>r.map(f2)),{cs:44,c:'mhyp',fs:13})+
      `<rect x="420" y="26" width="160" height="22" class="pbg"/>`+tx(496,40,'המשקולות שנמצאו',{fs:12,c:'thyp',fw:700})+bx(584,82,56,36,'b = 0.2',{c:'bhyp',fs:13});
  const hl=new Set(x.map((v,i)=>v===1?'0,'+i:'').filter(Boolean));
  const terms=PW.map((w,i)=>(i?(w<0?' − ':' + '):(w<0?'−':''))+Math.abs(w)+'·'+x[i]).join('');
  const res=z>0?'Main diagonal':'cross';
  L.f=mat(30,250,[x],{cs:34,fs:14,c:'mdat',hl})+
      tx(30,328,terms+'  =  '+f2(dot),{a:'start',fs:13,c:'mono'})+
      tx(30,354,`w·x + b = ${f2(dot)} + 0.2 = ${f2(z)}  ${z>0?'>':'<'}  0`,{a:'start',fs:13,c:'mono',fw:700})+
      ar(724,284,724,306,'smod')+bx(650,308,150,38,res,{c:z>0?'bmod':'bopt',fs:15});
  return {w:820,h:370,label,L};
}
const IMG_MAIN=[[0,1,1],[1,0,1],[1,1,0]], IMG_ANTI=[[1,1,0],[1,0,1],[0,1,1]];
SPECS.perc=percSpec(IMG_MAIN,'פרספטרון: אלכסון ראשי');
SPECS.perc2=percSpec(IMG_ANTI,'פרספטרון: אלכסון משני');

/* ============ regression with one neuron (synthetic data, lr=0.01, 500 epochs) ============ */
function gdReg(xs,ys,w,b,lr,ep){const N=xs.length,hist=[];for(let e=0;e<=ep;e++){let L=0,gw=0,gb=0;
  for(let i=0;i<N;i++){const p=w*xs[i]+b,r=ys[i]-p;L+=r*r;gw+=xs[i]*r;gb+=r;}L/=N;hist.push({w,b,L});
  w-=lr*(-2/N)*gw;b-=lr*(-2/N)*gb;}return hist;}
(function(){
 const xs=DATA.rx,ys=DATA.ry,H=gdReg(xs,ys,0.3367,0.1288,0.01,500);
 const P=plot({x:55,y:20,w:470,h:300,xr:[-2.3,2.3],yr:[-7,9],xt:[-2,-1,0,1,2],yt:[-6,-3,0,3,6,9],xl:'x',yl:'y'});
 const pts=xs.map((x,i)=>[x,ys[i]]),line=(w,b,c,o)=>curve(P,x=>w*x+b,c,o);
 const L={};
 L.a=dots(P,pts,'pd',4.5)+tx(P.X(-1.55),P.Y(8.45),'20 נקודות',{fs:12,c:'tdat',fw:700});
 L.b=[[-1,2],[0.5,-3],[3.2,0],[1.4,4],[-2,-1],[0,5]].map(([w,b])=>line(w,b,'faint')).join('')+tx(P.X(1.25),P.Y(-5.8),'המשפחה: כל הישרים y = w·x + b',{fs:12,c:'thyp',fw:700});
 const h0=H[0];
 L.c=line(h0.w,h0.b,'hyp')+tx(P.X(1.35),P.Y(-1.1),'אתחול אקראי',{fs:12,c:'thyp',fw:700})+tx(P.X(1.35),P.Y(-2.0),'w=0.3367, b=0.1288',{fs:11,c:'thyp mono'});
 L.d=pts.map(p=>ln(P.X(p[0]),P.Y(p[1]),P.X(p[0]),P.Y(h0.w*p[0]+h0.b),'res')).join('')+bx(P.X(-2.2),P.Y(7.7),112,28,'MSE = '+f2(h0.L),{c:'blos',fs:13});
 const gw=-6.642,gb=-2.31;
 L.e=bx(545,30,165,92,'dw = −6.642\ndb = −2.310\nw := w − lr·dw\nb := b − lr·db',{c:'bopt',fs:13,mono:true})+
     `<path class="crv opt" d="M${P.X(1.9)},${P.Y(h0.w*1.9+h0.b)} Q ${P.X(2.15)},${P.Y(2.5)} ${P.X(1.95)},${P.Y(4.6)}"/>`+ar(P.X(1.98),P.Y(4.2),P.X(1.94),P.Y(4.9),'sopt');
 L.f=[10,30,100].map(e=>line(H[e].w,H[e].b,'hyp thin')+tx(P.X(2.12),P.Y(H[e].w*2.12+H[e].b)-2,String(e),{fs:11,c:'thyp',fw:800})).join('')+tx(P.X(-1.3),P.Y(-6.3),'מספרי האפוקים ליד הקווים',{fs:11,c:'thyp'});
 const hN=H[500];
 L.g=line(2.8,1.6,'true')+line(hN.w,hN.b,'mod')+bx(545,140,165,62,'אחרי 500 אפוקים\nw = '+f3(hN.w)+'   b = '+f3(hN.b),{c:'bmod',fs:13})+
     tx(627,214,'מקווקו: הפונקציה האמיתית',{fs:11,c:'tmut'});
 const Q=plot({x:575,y:240,w:135,h:90,xr:[0,500],yr:[0,10],xt:[0,250,500],yt:[0,5,10]});
 L.h=Q.svg+curve(Q,e=>H[Math.round(e)].L,'los',{n:250})+tx(642,232,'Loss לאורך האימון',{fs:11,c:'tlos',fw:700});
 SPECS.reg={w:720,h:350,label:'רגרסיה עם נוירון יחיד',base:P.svg,L};
 SPECS._regH=H;
})();

/* ============ California housing — shapes view and network view ============ */
(function(){
 const S={},N={};
 const R_=(x,y,w,h,c,lab,dim,o={})=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" class="shp ${c}"/>`+(lab?tx(o.lx??x+w/2,o.ly??y-12,lab,{fs:13,fw:800,c:'t'+c.slice(1)}):'')+(dim?tx(o.dx??x+w/2,o.dy??y+h+13,dim,{fs:11,c:'mono tmut'}):'');
 S.a=R_(30,50,80,240,'sdat','X','(20640, 8)')+tx(70,170,'8 תכונות',{fs:12,c:'tdat',rot:-90});
 S.b=tx(125,170,'@',{fs:20,fw:800})+R_(140,130,26,80,'shyp','W','(8, 1)')+tx(182,170,'=',{fs:20,fw:800})+R_(196,50,26,240,'shyp','X@W','(20640, 1)');
 S.c=ar(228,90,264,84,'ink')+tx(246,74,'ᵀ',{fs:16,fw:800})+R_(270,70,250,28,'smod','preds = (X@W)ᵀ + b','(1, 20640)',{dx:395,dy:110})+
     R_(548,70,28,28,'shyp','b','(1,)')+ar(546,84,524,84,'shyp')+tx(600,55,'broadcasting',{fs:11,c:'tmut'});
 S.d=R_(270,145,250,28,'sdat','Y.reshape(1, N)','(1, 20640)',{dx:395,dy:185})+R_(270,214,250,28,'slos','Y − preds','',{})+ar(524,228,556,228,'slos')+
     bx(560,206,150,44,'MSE\nמספר אחד',{c:'blos',fs:13});
 S.e=tx(270,268,'(Y − preds) @ X  →',{a:'start',fs:12,c:'mono'})+R_(410,256,96,24,'sopt','','(1, 8)',{dx:458,dy:292})+ar(512,268,548,268,'sopt')+tx(530,256,'.view',{fs:11,c:'mono tmut'})+
     R_(556,252,24,84,'sopt','','(8, 1)',{dx:568,dy:346})+tx(616,294,'dw',{fs:14,fw:800,c:'topt'});
 S.f=bx(600,140,150,58,'W −= lr · dw\nb −= lr · db\nlr = 1e-7',{c:'bopt',fs:12,mono:true});
 const F=['MedInc','HouseAge','AveRooms','AveBedrms','Population','AveOccup','Latitude','Longitude'];
 N.a=F.map((f,i)=>circ(150,40+i*37,13,'ndi','x'+'₁₂₃₄₅₆₇₈'[i],{fs:11})+tx(128,40+i*37,f,{a:'end',fs:12,c:'mono'})).join('')+tx(150,14,'קלט: 8 תכונות',{fs:12,c:'tdat',fw:700});
 N.b=F.map((f,i)=>ln(164,40+i*37,392,170,'lk')).join('')+circ(420,170,30,'nd','Σ',{fs:20})+tx(280,95,'w₁ … w₈',{fs:14,fw:800,c:'thyp'});
 N.c=ar(420,90,420,138,'shyp')+tx(420,80,'+ b',{fs:14,fw:800,c:'thyp'})+ar(450,170,520,170,'smod')+circ(552,170,30,'ndo','ŷ',{fs:18})+tx(552,122,'מחיר משוער',{fs:12,c:'tmod',fw:700});
 N.d=circ(552,290,26,'ndi','y',{fs:16})+tx(552,330,'מחיר אמיתי',{fs:12,c:'tdat',fw:700})+bx(620,212,120,36,'(ŷ − y)²',{c:'blos',fs:14})+ln(582,180,620,222,'lk')+ln(576,282,620,240,'lk');
 N.e=`<path class="crv opt" d="M620,240 C 520,330 330,300 250,220" stroke-dasharray="6 4"/>`+ar(262,232,248,218,'sopt')+tx(330,318,'∂L/∂wᵢ',{fs:13,c:'topt mono',fw:700})+tx(470,318,'נגזרת לכל אחד מ-8 המשקלים',{fs:12,c:'topt',fw:700});
 N.f=bx(600,30,150,58,'W −= lr · dw\nb −= lr · db\nlr = 1e-7',{c:'bopt',fs:12,mono:true});
 SPECS.house={w:760,h:360,label:'California housing',ntd:'shapes',views:{shapes:{L:S},net:{L:N}},L:S};
})();

/* ============ learning-rate and epochs (values read from the slides) ============ */
(function(){
 const P=plot({x:60,y:30,w:300,h:240,xr:[0,100],yr:[0,1],xt:[0,25,50,75,100],xl:'Epochs',yl:'Loss'});
 const L={};
 L.a=tx(210,16,'Loss בכל האימון (צורה סכמטית)',{fs:12,fw:700,c:'tmut'});
 L.b=`<path class="crv opt" d="M${P.X(0)},${P.Y(0.01)} L${P.X(36)},${P.Y(0.01)} L${P.X(37)},${P.Y(0.95)}"/>`+tx(P.X(38),P.Y(0.88),'1e-3',{a:'start',fs:12,c:'topt mono',fw:700})+tx(P.X(42),P.Y(0.78),'מתפוצץ (1e296)',{a:'start',fs:11,c:'topt'});
 L.c=`<path class="crv los" d="M${P.X(0)},${P.Y(0.02)} L${P.X(79)},${P.Y(0.02)} L${P.X(80)},${P.Y(0.95)}"/>`+tx(P.X(78),P.Y(0.62),'1e-5',{a:'end',fs:12,c:'tlos mono',fw:700})+tx(P.X(78),P.Y(0.52),'מתפוצץ ב-~80',{a:'end',fs:11,c:'tlos'});
 L.d=curve(P,e=>0.04+0.9*Math.exp(-e/1.6),'mod',{dom:[0,100],n:200})+tx(P.X(55),P.Y(0.27),'1e-7',{fs:12,c:'tmod mono',fw:700})+tx(P.X(55),P.Y(0.18),'יורד מ-800,000 לכ-1,900',{fs:11,c:'tmod',fw:700});
 const Z=(x,y,lab,a,b,c,note)=>bx(x,y,330,46,'',{c:'bk'})+`<line class="crv ${c}" x1="${x+14}" y1="${y+12}" x2="${x+70}" y2="${y+34}" style="stroke-width:3"/>`+tx(x+84,y+15,lab,{a:'start',fs:12,c:'mono',fw:700})+tx(x+84,y+33,a+' → '+b,{a:'start',fs:12,c:'mono'})+tx(x+320,y+33,note,{a:'end',fs:11,c:'tmut'});
 L.e=tx(575,16,'10 האפוקים האחרונים (זום)',{fs:12,fw:700,c:'tmut'})+Z(410,30,'lr=1e-7, 100 ep','1910','1867','mod','')+Z(410,84,'lr=1e-8, 100 ep','2353','2346','los','איטי מדי');
 L.f=Z(410,150,'lr=1e-7, 1,000 ep','215','212','mod','ממשיך לרדת')+Z(410,204,'lr=1e-7, 10,000 ep','25.218','25.212','mod','כמעט התכנס')+tx(575,272,'יותר אפוקים ← Loss נמוך יותר',{fs:12,fw:700,c:'tmod'});
 SPECS.lr={w:760,h:300,label:'השפעת learning rate',base:P.svg,L};
})();

/* ============ binary classification with a sigmoid neuron ============ */
(function(){
 const X=DATA.cx,Y=DATA.cy,T=DATA.ctrain,W0=T['0'],W10=T['10'],W5=T['5'],W100=T['100'];
 const pts0=X.filter((p,i)=>!Y[i]),pts1=X.filter((p,i)=>Y[i]);
 const right={};
 right.b=bx(420,24,300,40,'z = w₁x₁ + w₂x₂ + b   ∈ (−∞, ∞)',{c:'bhyp',fs:13});
 right.c=bx(420,72,300,50,'sign(z)\nנגזרת 0 כמעט בכל מקום ✗',{c:'bopt',fs:13});
 right.d=bx(420,130,300,40,'σ(z) = 1 / (1 + e⁻ᶻ)  ∈ (0, 1)',{c:'bmod',fs:13});
 const conf=(x,y,r,title)=>`<rect x="${x-10}" y="${y-34}" width="320" height="180" class="pbg"/>`+tx(x+150,y-20,title,{fs:13,fw:800})+
   tx(x+165,y-2,'חזוי 0',{fs:11,c:'tmut'})+tx(x+235,y-2,'חזוי 1',{fs:11,c:'tmut'})+tx(x+90,y+30,'אמיתי 0',{fs:11,c:'tmut',a:'end'})+tx(x+90,y+92,'אמיתי 1',{fs:11,c:'tmut',a:'end'})+
   mat(x+130,y+8,[[r.tn,r.fp],[r.fn,r.tp]],{cs:70,ch:56,fs:16,hl:new Set(['0,0','1,1'])})+
   tx(x+130,y+136,`TN=${r.tn} FP=${r.fp} FN=${r.fn} TP=${r.tp}`,{a:'start',fs:11,c:'mono tmut'});
 right.e=conf(420,214,W10,'אפוק 10 — דיוק '+Math.round(W10.acc*100)+'%');
 right.f=conf(420,214,W100,'אפוק 100 — דיוק '+Math.round(W100.acc*100)+'%');
 /* plane view */
 const P=plot({x:50,y:24,w:310,h:310,xr:[-6.5,6.5],yr:[-6.5,6.5],xt:[-6,-3,0,3,6],yt:[-6,-3,0,3,6],xl:'x₁'});
 const bl=(r,c,o)=>bline(P,r.w[0],r.w[1],r.b,c,o);
 const pl={};
 pl.a=dots(P,pts0,'p0',4)+dots(P,pts1,'p1',4)+tx(P.X(-1.0),P.Y(-5.7),'מחלקה 0',{fs:12,c:'tlos',fw:700})+tx(P.X(3),P.Y(5.7),'מחלקה 1',{fs:12,fw:700,f:'var(--c1)'});
 pl.b=bl(W0,'hyp')+tx(P.X(-5.4),P.Y(0.3),'z = 0',{fs:12,c:'thyp mono',fw:700})+right.b;
 pl.c=halfPoly(P,W0.w[0],W0.w[1],W0.b,1,'shade1')+halfPoly(P,W0.w[0],W0.w[1],W0.b,-1,'shade0')+right.c;
 pl.d=[-2.197,2.197].map(k=>bline(P,W0.w[0],W0.w[1],W0.b-k,'hyp thin',{d:'4 4'})).join('')+tx(P.X(3.4),P.Y(-5.9),'p = 0.1 / 0.5 / 0.9',{fs:11,c:'thyp mono'})+right.d;
 pl.e=bl(W5,'faint')+bl(W10,'hyp thin')+tx(P.X(-(W10.w[1]*5.4+W10.b)/W10.w[0])+12,P.Y(5.4),'10',{fs:11,c:'thyp',fw:800})+right.e;
 pl.f=bl(W100,'mod')+tx(P.X(-(W100.w[1]*5.4+W100.b)/W100.w[0])+14,P.Y(5.4),'100',{fs:11,c:'tmod',fw:800})+right.f;
 /* sigmoid view: x-axis z, y-axis p */
 const S=plot({x:50,y:24,w:310,h:310,xr:[-12,12],yr:[-0.15,1.15],xt:[-10,-5,0,5,10],yt:[0,0.5,1],xl:'z = w·x + b'});
 const zs=(r)=>X.map((p,i)=>[r.w[0]*p[0]+r.w[1]*p[1]+r.b,Y[i]]);
 const onSig=(r,c)=>zs(r).map(([z,y])=>`<circle class="${y?'p1':'p0'}${c?' '+c:''}" cx="${S.X(Math.max(-12,Math.min(12,z))).toFixed(1)}" cy="${S.Y(sig(z)).toFixed(1)}" r="4"/>`).join('');
 const sv={};
 sv.a=zs(W0).map(([z,y])=>`<circle class="${y?'p1':'p0'}" cx="${S.X(Math.max(-12,Math.min(12,z))).toFixed(1)}" cy="${S.Y(y).toFixed(1)}" r="4"/>`).join('')+tx(S.X(-6),S.Y(1.08),'y = התגית האמיתית',{fs:11,c:'tmut'});
 sv.b=curve(S,z=>z/10+0.5,'hyp')+tx(S.X(7.5),S.Y(1.08),'פלט לינארי',{fs:11,c:'thyp',fw:700})+right.b;
 sv.c=`<path class="crv opt" d="M${S.X(-12)},${S.Y(0)} L${S.X(0)},${S.Y(0)} L${S.X(0)},${S.Y(1)} L${S.X(12)},${S.Y(1)}"/>`+right.c;
 sv.d=curve(S,sig,'mod')+onSig(W0,'')+right.d;
 sv.e=`<rect x="50" y="24" width="310" height="310" class="pbg" opacity=".55"/>`+curve(S,sig,'mod')+onSig(W10,'')+tx(S.X(-7),S.Y(0.55),'אפוק 10',{fs:12,fw:700})+right.e;
 sv.f=`<rect x="50" y="24" width="310" height="310" class="pbg"/>`+S.svg+curve(S,sig,'mod')+onSig(W100,'')+tx(S.X(-7),S.Y(0.55),'אפוק 100',{fs:12,fw:700})+right.f;
 SPECS.cls={w:740,h:370,label:'סיווג בינארי',ntd:'plane',views:{plane:{base:P.svg,L:pl},sig:{base:S.svg,L:sv}},L:pl};
})();

/* ============ from one neuron to a network ============ */
(function(){
 const right={
  a:bx(400,30,330,40,'s₁ = sign(x₁ + x₂ − 1)',{c:'bhyp',fs:14}),
  b:bx(400,80,330,40,'s₂ = sign(x₁ − x₂ + 1)',{c:'bhyp',fs:14}),
  c:bx(400,130,330,40,'ŷ = sign(1·s₁ + 1·s₂ − 1.5)',{c:'bmod',fs:14})+tx(565,188,'פלט חיובי רק כששני הנוירונים חיוביים',{fs:12,c:'tmod',fw:700}),
  d:bx(400,220,330,64,'sign → θ / ReLU\nגבול חלק, ואפשר לגזור',{c:'bopt',fs:13})};
 const n={};
 n.a=circ(60,110,20,'ndi','x₁')+circ(60,230,20,'ndi','x₂')+ln(80,110,180,100,'lk')+ln(80,230,180,100,'lk')+circ(205,100,26,'nd','s₁')+tx(130,88,'1',{fs:12,c:'thyp'})+tx(130,160,'1',{fs:12,c:'thyp'})+right.a;
 n.b=ln(80,110,180,240,'lk')+ln(80,230,180,240,'lk')+circ(205,240,26,'nd','s₂')+tx(130,196,'1',{fs:12,c:'thyp'})+tx(130,250,'−1',{fs:12,c:'thyp'})+right.b;
 n.c=ln(231,100,300,170,'lk')+ln(231,240,300,170,'lk')+circ(326,170,26,'ndo','ŷ')+tx(265,124,'1',{fs:12,c:'tmod'})+tx(265,214,'1',{fs:12,c:'tmod'})+tx(326,128,'−1.5',{fs:12,c:'tmod'})+tx(205,300,'שכבה נסתרת',{fs:12,c:'tmut'})+right.c;
 n.d=right.d;
 const P=plot({x:40,y:24,w:300,h:300,xr:[-3,3],yr:[-3,3],xt:[-2,0,2],yt:[-2,0,2],xl:'x₁'});
 const g={};
 g.a=halfPoly(P,1,1,-1,1,'shadeh')+bline(P,1,1,-1,'hyp')+tx(P.X(-2.2),P.Y(2.7),'s₁=+1',{fs:12,c:'thyp',fw:700})+right.a;
 g.b=halfPoly(P,1,-1,1,1,'shadeh')+bline(P,1,-1,1,'hyp')+tx(P.X(2.2),P.Y(-2.6),'s₂=+1',{fs:12,c:'thyp',fw:700})+right.b;
 g.c=`<polygon class="shadem" points="${P.X(0)},${P.Y(1)} ${P.X(2)},${P.Y(3)} ${P.X(3)},${P.Y(3)} ${P.X(3)},${P.Y(-2)}"/>`+tx(P.X(1.9),P.Y(0.6),'ŷ = +1',{fs:14,c:'tmod',fw:800})+right.c;
 let d='';for(let i=0;i<=120;i++)for(let j=0;j<=120;j++){const x=-3+6*i/120,y=-3+6*j/120,v=sig(3*(x+y-1))+sig(3*(x-y+1))-1.5;if(Math.abs(v)<0.02)d+=`<circle cx="${P.X(x).toFixed(1)}" cy="${P.Y(y).toFixed(1)}" r="1.4" class="cdot"/>`;}
 g.d=d+tx(P.X(-1.4),P.Y(-2.6),'עם θ: הגבול מתעגל',{fs:12,c:'topt',fw:700})+right.d;
 SPECS.nn={w:750,h:350,label:'מנוירון לרשת',ntd:'net',views:{net:{L:n},plane:{base:P.svg,L:g}},L:n};
})();

/* ============ generalization: line between two cities ============ */
(function(){
 const r=rng(11),cx=380,cy=165,su=230,sv=125,S=(u,v)=>[cx+u*su,cy+v*sv];
 const red=[],blue=[];
 while(red.length<20){const u=r()*2-1,v=r()*2-1,d=Math.hypot(u,v);if(d<0.6)red.push([u,v]);}
 while(blue.length<30){const u=r()*2.4-1.2,v=r()*2.2-1.1,d=Math.hypot(u,v);if(d>0.85&&d<1.12)blue.push([u,v]);}
 const noiseB=[[0.22,0.25],[-0.32,-0.18]],noiseR=[[0.86,-0.36]];
 const R0=0.72,pol=p=>[Math.atan2(p[1],p[0]),Math.hypot(p[0],p[1])];
 const bumps=[...noiseB.map(p=>{const [t,d]=pol(p);return [t,d-R0-0.1];}),...noiseR.map(p=>{const [t,d]=pol(p);return [t,d-R0+0.1];})];
 const rad=t=>R0+bumps.reduce((s,[tk,a])=>{let dt=Math.atan2(Math.sin(t-tk),Math.cos(t-tk));return s+a*Math.exp(-dt*dt/(2*0.16*0.16));},0);
 let d='';for(let i=0;i<=360;i++){const t=i/360*2*Math.PI,q=S(rad(t)*Math.cos(t),rad(t)*Math.sin(t));d+=(i?'L':'M')+q[0].toFixed(1)+','+q[1].toFixed(1);}
 const Hs=(arr,c)=>arr.map(p=>{const q=S(...p);return house(q[0],q[1],c);}).join('');
 const L={};
 L.a=Hs(red,'r')+Hs(noiseR,'r')+Hs(blue,'b')+Hs(noiseB,'b')+tx(660,30,'עיר אדומה בתוך עיר כחולה',{fs:12,c:'tmut'});
 L.b=ln(S(0.05,-1.3)[0],S(0,-1.3)[1],S(0.35,1.3)[0],S(0,1.3)[1],'bad')+tx(S(0.42,-1.2)[0],S(0,-1.2)[1],'אפשרות 1: קו ישר',{a:'start',fs:13,c:'topt',fw:700})+
     red.filter(p=>p[0]<0.05+0.3*(p[1]+1.3)/2.6).slice(0,6).map(p=>{const q=S(...p);return cross(q[0],q[1]+3,'bad',5);}).join('');
 const e1=S(0,0);L.c=`<ellipse cx="${e1[0]}" cy="${e1[1]}" rx="${R0*su}" ry="${R0*sv}" class="crv mod" style="fill:none"/>`+tx(S(-1.05,-1.2)[0],S(0,-1.2)[1],'אפשרות 2: אליפסה',{a:'start',fs:13,c:'tmod',fw:700});
 L.d=`<path d="${d}Z" class="crv opt" stroke-dasharray="5 3" style="fill:none"/>`+tx(S(-1.05,1.22)[0],S(0,1.22)[1],'אפשרות 3: גבול שעוקף כל נקודה',{a:'start',fs:13,c:'topt',fw:700});
 const tR=S(...[0.22*1.9,0.25*1.9]),tB=S(0.86*1.07,-0.36*1.07);
 L.e=`<g>${house(tR[0],tR[1],'r t')}${house(tB[0],tB[1],'b t')}</g>`+tx(tR[0]+12,tR[1]-12,'חדש',{a:'start',fs:11,fw:800})+tx(tB[0]+12,tB[1]-12,'חדש',{a:'start',fs:11,fw:800})+
     bx(560,250,190,56,'בית חדש: האליפסה צודקת,\nהגבול המפותל טועה',{c:'bmod',fs:12});
 SPECS.gen={w:760,h:330,label:'הכללה',base:`<rect x="10" y="10" width="740" height="310" rx="10" class="pbg"/>`,L};
})();

/* ============ representation inside an LLM (values from the slides) ============ */
(function(){
 const L={},tk=['how','is','the','data'],ids=[1068,318,262,3748];
 L.a=bx(20,60,150,70,'"how is the data I\nenter in the prompt…"',{c:'bdat',fs:12})+tx(95,40,'טקסט = מחרוזת תווים',{fs:12,c:'tdat',fw:700});
 L.b=ar(172,95,205,95,'ink')+tk.map((t,i)=>bx(210,30+i*38,64,30,t,{c:'bk',fs:13,mono:true})).join('')+tx(242,14,'טוקנים',{fs:12,fw:700});
 L.c=tk.map((t,i)=>ar(276,45+i*38,300,45+i*38,'lk',{h:6,wd:4})+bx(304,30+i*38,64,30,String(ids[i]),{c:'bhyp',fs:13,mono:true})).join('')+tx(336,14,'Token IDs',{fs:12,fw:700,c:'thyp'});
 const em=['[0.01, −0.22, 0.05, …, 0.87]','[−0.12, 0.41, 0.03, …, −0.09]','[ … ]','[ … ]'];
 L.d=em.map((v,i)=>ar(370,45+i*38,392,45+i*38,'lk',{h:6,wd:4})+bx(396,30+i*38,214,30,v,{c:'bdat',fs:11,mono:true})).join('')+tx(503,14,'Embedding: וקטור לכל טוקן',{fs:12,fw:700,c:'tdat'});
 L.e=ar(612,95,640,95,'ink')+bx(644,30,196,130,'Transformer\nself-attention\nfeed-forward\nresidual',{c:'bhyp',fs:13})+tx(742,174,'ייצוג תלוי-הקשר לכל טוקן',{fs:11,c:'thyp'});
 const pr=[['token_0',0.0002],['token_1',0.13],['token_2',0.45],['…',0.06],['…',0.03]];
 L.f=ar(742,180,742,206,'smod')+tx(530,214,'התפלגות על כל אוצר המילים (~50,000 טוקנים)',{fs:12,fw:700,c:'tmod'})+
   pr.map(([t,p],i)=>{const x=440+i*80,h=Math.max(2,p*180);return `<rect class="bar ${i===2?'mod':'mut'}" x="${x}" y="${312-h}" width="44" height="${h}"/>`+tx(x+22,322,t,{fs:10,c:'mono'})+tx(x+22,304-h,String(p),{fs:10,c:'mono'});}).join('')+
   bx(40,236,300,52,'הטוקן הבא = הסביר ביותר\n(או דגימה מההתפלגות)',{c:'bmod',fs:13});
 SPECS.llm={w:860,h:335,label:'ייצוג ב-LLM',L};
 /* image + one-hot (static) */
 let s=mat(30,50,[[171,85,137],[255,199,18]],{cs:52,ch:40,fs:14})+tx(108,30,'תמונה = מטריצת עוצמות',{fs:12,fw:700});
 [[171,85,137],[255,199,18]].forEach((r,i)=>r.forEach((v,j)=>{s+=`<rect x="${210+j*40}" y="${50+i*40}" width="40" height="40" style="fill:rgb(${v},${v},${v})"/>`;}));
 s+=tx(270,30,'גווני אפור',{fs:12,fw:700});
 s+=tx(500,30,'One-hot לטקסט (פרימיטיבי)',{fs:12,fw:700})+[['Cats','[1, 0, 0]'],['chase','[0, 1, 0]'],['mice','[0, 0, 1]']].map(([w,v],i)=>tx(440,62+i*24,w,{a:'end',fs:13,c:'mono'})+tx(460,62+i*24,v,{a:'start',fs:13,c:'mono thyp'})).join('');
 SPECS.repr={w:640,h:150,label:'ייצוג תמונה וטקסט',base:s};
})();

/* ============ fastai pipeline: bird or forest ============ */
(function(){
 const L={},B=(x,y,t,code,c)=>bx(x,y,190,40,t,{c,fs:13})+code.map((l,i)=>tx(x+4,y+56+i*15,l,{a:'start',fs:10.5,c:'mono tmut'})).join('');
 L.a=B(20,30,'1. חיפוש תמונות',['search_images("bird photos")','→ list of URLs'],'bdat')+ar(212,50,228,50,'ink')+
     B(232,30,'2. הורדה + שינוי גודל',["download_images(dest, urls=…)","resize_images(path, max_size=400)"],'bdat');
 L.b=ar(424,50,440,50,'ink')+B(444,30,'3. ניקוי קבצים שבורים',['failed = verify_images(…)','failed.map(Path.unlink)'],'bopt');
 L.c=`<path class="lk" d="M634,70 C 700,120 700,150 640,160 L130,160 C 100,160 100,175 115,185"/>`+ar(108,180,115,188,'ink')+
     bx(20,190,250,126,'',{c:'bhyp'})+tx(145,206,'4. DataBlock',{fs:14,fw:800,c:'thyp'})+
     ['blocks=(ImageBlock, CategoryBlock)','get_items=get_image_files','splitter=RandomSplitter(0.2, seed=42)','get_y=parent_label','item_tfms=[Resize(192, "squish")]'].map((l,i)=>tx(30,226+i*18,l,{a:'start',fs:10.5,c:'mono'})).join('');
 L.d=ar(272,250,290,250,'ink')+B(294,230,'5. DataLoaders',['.dataloaders(path)','dls.show_batch(max_n=6)'],'bdat');
 L.e=ar(486,250,502,250,'ink')+B(506,190,'6. מודל + אימון',['vision_learner(dls, resnet18,','   metrics=error_rate)','learn.fine_tune(3)'],'bmod');
 L.f=B(506,300,'7. שימוש במודל',['learn.predict(PILImage.create(…))'],'bmod')+ar(600,276,600,298,'smod');
 SPECS.fa={w:760,h:380,label:'צינור fastai',L};
})();

/* ============ DataBlock anatomy (cats vs dogs, slides 37-45) ============ */
(function(){
 const L={},slot=(i,k,v,c)=>bx(30,62+i*50,290,40,'',{c})+tx(42,82+i*50,k,{a:'start',fs:12.5,fw:800,c:'mono'})+tx(310,82+i*50,v,{a:'end',fs:11,c:'mono'});
 const out=(lines,title,c='bk')=>bx(360,40,385,150,'',{c})+tx(552,58,title,{fs:13,fw:800})+lines.map((l,i)=>tx(372,84+i*20,l,{a:'start',fs:11,c:'mono'})).join('');
 const base=bx(20,20,310,320,'',{c:'bgh'})+tx(175,40,'dblock = DataBlock( … )',{fs:13,fw:800,c:'mono'});
 L.a=out(["(Path('…/staffordshire_bull_terrier_133.jpg'),"," Path('…/staffordshire_bull_terrier_133.jpg'))"],'DataBlock() ריק: x ו-y אותו קובץ');
 L.b=slot(0,'get_items','get_image_files','bdat')+out(["dsets = dblock.datasets(path/'images')","dsets.train[0]","→ (Path('…/samoyed_38.jpg'),","   Path('…/samoyed_38.jpg'))"],'get_items: מאיפה מביאים פריטים');
 L.c=slot(1,'get_y','label_func','blos')+out(["def label_func(fname):","  return 'cat' if fname.name[0].isupper() else 'dog'","→ (Path('…/german_shorthaired_199.jpg'), 'dog')"],'get_y: מאיפה התגית');
 L.d=slot(2,'blocks','(ImageBlock, CategoryBlock)','bhyp')+out(["→ (PILImage mode=RGB size=424x500,","   TensorCategory(1))","dsets.vocab → ['cat', 'dog']"],'blocks: מה סוג הקלט ומה סוג הפלט');
 L.e=slot(3,'splitter','RandomSplitter()','bopt')+out(["dsets.train[0], dsets.valid[1]","→ (… TensorCategory(1)), (… TensorCategory(0))"],'splitter: אימון מול ולידציה')+
     `<rect x="372" y="150" width="290" height="20" class="bar"/><rect x="590" y="150" width="72" height="20" class="bar opt"/>`+tx(480,160,'train 80%',{fs:11,f:'var(--surface)',fw:700})+tx(626,160,'valid 20%',{fs:11,f:'var(--surface)',fw:700});
 L.f=slot(4,'item_tfms','Resize(224)','bmod')+out(["dls = dblock.dataloaders(path/'images')","dls.show_batch(max_n=4)"],'item_tfms + dataloaders: אצוות מוכנות')+
     ['dog','dog','dog','cat'].map((t,i)=>`<rect x="${380+i*90}" y="128" width="78" height="54" rx="4" class="thumb"/>`+tx(419+i*90,155,t,{fs:12,fw:800})).join('');
 SPECS.db={w:760,h:350,label:'DataBlock',base,L};
})();

/* ============ broadcasting ============ */
(function(){
 const A=[[1,2,3,4],[5,6,7,8],[9,10,11,12]],b=[1,-1,2,-2];
 const L={},cs=36;
 L.a=mat(30,50,A,{cs,c:'mdat',lab:'A  (3, 4)',fs:14});
 L.b=tx(190,104,'+',{fs:22,fw:800})+mat(210,50,[[100,'','',''],['','','',''],['','','','']],{cs,c:'mhyp',fs:12})+mat(210,50,[['',100,100,100],[100,100,100,100],[100,100,100,100]],{cs,c:'mghost',fs:12})+
     tx(282,30,'הסקלר 100 נמתח לכל התאים',{fs:12,c:'thyp',fw:700})+tx(370,104,'=',{fs:22,fw:800})+mat(392,50,A.map(r=>r.map(v=>v+100)),{cs,c:'mmod',fs:13})+tx(464,30,'A + 100',{fs:12,fw:800,c:'tmod mono'});
 L.c=`<rect x="200" y="22" width="355" height="170" class="pbg"/>`+tx(190,104,'+',{fs:22,fw:800})+mat(210,50,[b],{cs,c:'mhyp',fs:13})+mat(210,50+cs,[b,b],{cs,c:'mghost',fs:13})+
     tx(282,30,'הווקטור b משוכפל לכל שורה',{fs:12,c:'thyp',fw:700})+tx(370,104,'=',{fs:22,fw:800})+mat(392,50,A.map(r=>r.map((v,j)=>v+b[j])),{cs,c:'mmod',fs:13})+tx(464,30,'A + b',{fs:12,fw:800,c:'tmod mono'});
 L.d=tx(30,200,'אותו דבר, במפורש',{a:'start',fs:12,fw:700})+mat(30,220,[[1],[1],[1]],{cs:30,c:'mghost',fs:12})+tx(76,265,'@',{fs:18,fw:800})+mat(92,250,[b],{cs:30,c:'mhyp',fs:12})+tx(222,265,'=',{fs:18,fw:800})+
     mat(240,220,[b,b,b],{cs:30,c:'mhyp',fs:12})+tx(170,316,'np.ones((3,1)) @ b.reshape(1,−1)',{fs:11,c:'mono tmut'})+
     tx(420,265,'A + (…)  =  A + b',{a:'start',fs:13,c:'mono',fw:700})+ok(612,262);
 SPECS.bc={w:640,h:330,label:'Broadcasting',L};
})();
/* ============ numpy vectors: rank-1 vs row/column ============ */
(function(){
 const L={};
 L.a=tx(30,30,'x = np.array([1, 2, 3])',{a:'start',fs:13,c:'mono'})+tx(30,54,'shape = (3,)',{a:'start',fs:12,c:'mono topt',fw:700})+tx(140,54,'לא שורה ולא עמודה!',{a:'start',fs:12,c:'topt',fw:700})+tx(30,78,'y = np.array([4, 5, 6])',{a:'start',fs:13,c:'mono'});
 L.b=bx(380,18,350,74,'x.T@x = 14     x@x.T = 14\nx@y = 32       y@x = 32\nהפעולה T לא משנה וקטור חד-ממדי',{c:'bopt',fs:12.5,mono:true});
 const one=(x,y,code,res,m,c='mmod')=>tx(x,y,code,{a:'start',fs:12.5,c:'mono',fw:700})+mat(x+8,y+16,m,{cs:24,c,fs:11})+tx(x+8+m[0].length*24+10,y+16+m.length*12,res,{a:'start',fs:11,c:'mono tmut'});
 L.c=tx(30,118,'a = [[1,2,3]]  (1,3)   b = [[4],[5],[6]]  (3,1)',{a:'start',fs:12,c:'mono thyp',fw:700})+
     one(30,140,'a.T @ a',"(3,3)",[[1,2,3],[2,4,6],[3,6,9]])+one(210,140,'a @ a.T',"(1,1)",[[14]]);
 L.d=one(390,140,'a @ b',"(1,1)",[[32]])+one(540,140,'b @ a',"(3,3)",[[4,8,12],[5,10,15],[6,12,18]]);
 L.e=bx(30,250,300,58,'a @ b.T  →  ValueError\n(1,3) @ (1,3): 3 ≠ 1',{c:'bopt',fs:12.5,mono:true})+cross(316,262,'bad',7);
 L.f=one(390,240,'a + b  (broadcasting)',"(3,3)",[[5,6,7],[6,7,8],[7,8,9]]);
 SPECS.r1={w:760,h:330,label:'וקטורים ב-NumPy',L};
})();
/* ============ speedups (static) ============ */
(function(){
 const rows=[['c = a + b  (n=10⁶)',207.4],['1/(1+exp(−a−b−c))',85.3],['np.where(a>0.5, b, c)',81.1],['c = a @ b  (לולאה משולשת)',7335]];
 const X=v=>300+Math.log10(v)/4*400;let s='';
 [1,10,100,1000,10000].forEach(v=>{s+=ln(X(v),20,X(v),190,'pgrid')+tx(X(v),202,'×'+v.toLocaleString('en'),{fs:11,c:'tick'});});
 rows.forEach(([t,v],i)=>{const y=30+i*40;s+=tx(290,y+13,t,{a:'end',fs:12,c:'mono'})+`<rect x="300" y="${y}" width="${X(v)-300}" height="26" class="bar ${i===3?'mod':''}"/>`+tx(X(v)+6,y+13,'×'+Math.round(v).toLocaleString('en'),{a:'start',fs:12,fw:800});});
 SPECS.speed={w:780,h:215,label:'האצה של וקטוריזציה',base:s};
})();

/* ============ the four views of one model (static minis) ============ */
(function(){
 const net=(ins,hid,lab)=>{let s='';const H=130,yi=ins.map((t,i)=>H/2+(i-(ins.length-1)/2)*Math.min(26,110/ins.length));
  const yh=hid?[45,85]:[];
  ins.forEach((t,i)=>{s+=circ(24,yi[i],ins.length>4?7:12,'ndi',ins.length>4?'':t,{fs:10});});
  if(hid){yh.forEach(y=>{yi.forEach(v=>s+=ln(36,v,92,y,'lk'));s+=circ(104,y,13,'nd','θ',{fs:11});});yh.forEach(y=>s+=ln(117,y,160,65,'lk'));}
  else yi.forEach(v=>s+=ln(ins.length>4?31:36,v,148,65,'lk'));
  s+=circ(172,65,22,lab==='σ'?'ndo':'nd',lab,{fs:14})+ar(194,65,214,65,'smod');return s;};
 const V=(k,base)=>SPECS[k]={w:220,h:130,label:k,base};
 V('v1n',net(['x'],0,'Σ'));V('v8n',net(['','','','','','','',''],0,'Σ'));V('vcn',net(['x₁','x₂'],0,'σ'));V('vnn',net(['x₁','x₂'],1,'θ'));
 const sh=(parts)=>{let s='',x=6;parts.forEach(([w,h,c,t])=>{if(c==='op'){s+=tx(x+6,65,t,{fs:15,fw:800});x+=14;}else{s+=`<rect x="${x}" y="${65-h/2}" width="${w}" height="${h}" rx="3" class="shp ${c}"/>`+tx(x+w/2,65+h/2+11,t,{fs:9,c:'mono tmut'});x+=w+4;}});return s;};
 V('v1s',sh([[16,70,'sdat','(N,)'],[4,0,'op','·'],[14,14,'shyp','w'],[4,0,'op','+'],[14,14,'shyp','b'],[4,0,'op','='],[16,70,'smod','(N,)']]));
 V('v8s',sh([[40,80,'sdat','(N,8)'],[4,0,'op','@'],[12,40,'shyp','(8,1)'],[4,0,'op','+'],[12,12,'shyp','b'],[4,0,'op','='],[12,80,'smod','(N,1)']]));
 V('vcs',sh([[20,80,'sdat','(N,2)'],[4,0,'op','@'],[12,20,'shyp','(2,1)'],[4,0,'op','+'],[12,12,'shyp','b'],[6,0,'op','→σ'],[14,0,'op',''],[12,80,'smod','(N,1)']]));
 V('vns',sh([[20,80,'sdat','(N,2)'],[4,0,'op','@'],[20,20,'shyp','(2,2)'],[6,0,'op','θ'],[4,0,'op','@'],[12,20,'shyp','(2,1)'],[4,0,'op','='],[12,80,'smod','(N,1)']]));
})();

/* ============ practice: pass / fail from study and sleep hours ============ */
(function(){
 const r=rng(5),pts=[];
 for(let i=0;i<60;i++){const s=r()*10,h=3+r()*6,z=0.9*s+0.8*h-9.5+gauss(r)*1.2;pts.push([s,h,z>0?1:0]);}
 const P=plot({x:50,y:24,w:330,h:280,xr:[0,10],yr:[3,9],xt:[0,2,4,6,8,10],yt:[3,5,7,9],xl:'שעות לימוד',yl:'שעות שינה'});
 const Xs=pts.map(p=>[(p[0]-5)/3,(p[1]-6)/2]),Ys=pts.map(p=>p[2]);
 let w=[0.1,-0.1],b=0,snap={};
 for(let e=0;e<=300;e++){let gw=[0,0],gb=0,Lo=0,ac=0;Xs.forEach((x,i)=>{const p=sig(w[0]*x[0]+w[1]*x[1]+b),g=(-2/Xs.length)*(Ys[i]-p)*p*(1-p);gw[0]+=g*x[0];gw[1]+=g*x[1];gb+=g;Lo+=(p-Ys[i])**2;ac+=((p>0.5)===(Ys[i]===1))?1:0;});
   if(e===0||e===300)snap[e]={w:[...w],b,L:Lo/Xs.length,acc:ac/Xs.length};w[0]-=1*gw[0];w[1]-=1*gw[1];b-=1*gb;}
 const toRaw=s=>({w1:s.w[0]/3,w2:s.w[1]/2,b:s.b-s.w[0]*5/3-s.w[1]*6/2});
 const L={},r0=toRaw(snap[0]),r1=toRaw(snap[300]);
 L.a=dots(P,pts.filter(p=>!p[2]),'p0',4.5)+dots(P,pts.filter(p=>p[2]),'p1',4.5)+tx(P.X(0.9),P.Y(3.3),'נכשל',{fs:12,c:'tlos',fw:700})+tx(P.X(9.0),P.Y(3.5),'עבר',{fs:12,fw:700,f:'var(--c1)'});
 L.b=bx(410,24,320,58,'X: (60, 2)    Y: (60, 1) ∈ {0, 1}\nx := (x − mean) / scale',{c:'bdat',fs:13});
 L.c=bline(P,r0.w1,r0.w2,r0.b,'hyp',{})+bx(410,92,320,40,'h(x) = σ(w₁x₁ + w₂x₂ + b)',{c:'bhyp',fs:14});
 L.d=bx(410,142,320,40,'MSE = mean((σ(z) − y)²) = '+f3(snap[0].L),{c:'blos',fs:13});
 L.e=bx(410,192,320,58,'g = −2/N · (y − p) · p · (1 − p)\ndw = Xᵀ g     db = Σ g',{c:'bopt',fs:13,mono:true});
 L.f=bline(P,r1.w1,r1.w2,r1.b,'mod')+bx(410,260,320,66,'אחרי 300 אפוקים\nlr = 1    MSE = '+f3(snap[300].L)+'\nדיוק: '+Math.round(snap[300].acc*100)+'%',{c:'bmod',fs:13});
 SPECS.prac={w:750,h:340,label:'תרגול',base:P.svg,L};
})();

/* ============ PyTorch: tensor dimensions 0D..4D ============ */
(function(){
 const L={},lab=(x,t,s)=>tx(x,236,t,{fs:13,fw:800})+tx(x,258,s,{fs:12,c:'mono tmut'});
 const RGB=['rgba(220,38,38,.28)','rgba(22,163,74,.28)','rgba(37,99,235,.28)'],STK=['#dc2626','#16a34a','#2563eb'];
 const stack=(x,y,s,k)=>RGB.map((f,i)=>`<rect x="${x+i*k}" y="${y-i*k}" width="${s}" height="${s}" rx="3" style="fill:${f};stroke:${STK[i]};stroke-width:1.4"/>`).join('');
 L.a=mat(30,110,[['3.14']],{cs:56,ch:40,fs:14,c:'mhyp'})+lab(58,'0D · סקלר','shape = ()');
 L.b=mat(120,110,[[1,2,3,4]],{cs:30,ch:40,fs:13,c:'mhyp'})+lab(180,'1D · וקטור','shape = (4,)');
 L.c=mat(282,70,[[1,2,3,4],[5,6,7,8],[9,10,11,12]],{cs:26,ch:30,fs:11,c:'mhyp'})+lab(334,'2D · מטריצה','shape = (3, 4)');
 L.d=stack(428,92,72,14)+tx(464,58,'R G B',{fs:11,c:'mono tmut'})+lab(478,'3D · תמונה צבעונית','(C, H, W)');
 L.e=[0,1,2,3].map(i=>stack(560+i*44,112-i*4,34,7)).join('')+tx(650,52,'B = 4',{fs:12,c:'mono',fw:700})+lab(650,'4D · אצווה של תמונות','(B, C, H, W)')+
     tx(650,282,'torch.rand(4, 3, 32, 32)',{fs:11,c:'mono thyp'});
 SPECS.tdim={w:760,h:300,label:'ממדים של טנזור',L};
})();

/* ============ PyTorch: autograd computational graph, y = (a·b·c)² ============ */
(function(){
 const L={},N=(x,y,t,v,c)=>`<g class="${c}"><circle cx="${x}" cy="${y}" r="30"/>${tx(x,y-7,t,{fs:15,fw:800})}${tx(x,y+11,v,{fs:11,c:'mono'})}</g>`;
 const A=[90,70],B=[90,170],C=[90,280],X=[270,120],Z=[450,200],Y=[640,200];
 L.a=N(...A,'a','= 2','ndi')+N(...B,'b','= 3','ndi')+N(...C,'c','= 4','ndi')+tx(90,22,'requires_grad=True',{fs:11,c:'mono tdat',fw:700});
 L.b=ar(118,80,242,112,'ink')+ar(118,162,242,130,'ink')+N(...X,'×','x = 6','nd')+tx(270,72,'x = a·b',{fs:12,c:'mono'});
 L.c=ar(118,276,422,212,'ink')+ar(298,132,422,190,'ink')+N(...Z,'×','z = 24','nd')+tx(450,152,'z = x·c',{fs:12,c:'mono'});
 L.d=ar(480,200,608,200,'ink')+N(...Y,'²','y = 576','ndo')+tx(640,152,'y = z²',{fs:12,c:'mono'});
 const g=(x1,y1,x2,y2,t,lx,ly)=>`<path class="crv opt thin" d="M${x1},${y1} L${x2},${y2}" stroke-dasharray="5 4"/>`+ar(x1+(x2-x1)*.8,y1+(y2-y1)*.8,x2,y2,'sopt')+tx(lx,ly,t,{fs:11.5,c:'mono topt',fw:700});
 L.e=g(612,222,478,222,'∂y/∂z = 2z = 48',545,240)+tx(640,262,'y.backward()',{fs:12,c:'mono topt',fw:800});
 L.f=g(424,216,300,140,'∂y/∂x = 48·c = 192',330,190)+g(428,222,120,286,'∂y/∂c = 48·x = 288',300,272);
 L.g=g(244,104,120,76,'192·b = 576',190,62)+g(244,134,120,166,'192·a = 384',170,176)+
     bx(560,40,190,82,'a.grad = 576\nb.grad = 384\nc.grad = 288',{c:'bopt',fs:13,mono:true});
 SPECS.graph={w:760,h:320,label:'גרף חישוב',L};
})();


/* ---- hero: mark the four components in the text ---- */
(function(){const b=document.getElementById('markBtn'),r=document.getElementById('demoReq');if(!b)return;
 b.addEventListener('click',()=>{const on=r.classList.toggle('on');b.setAttribute('aria-pressed',on);b.textContent=on?'הסר סימון':'סמן את הטקסט';});})();

/* ---- gradient-descent playground ---- */
(function(){
 const box=document.getElementById('gdtool');if(!box)return;
 const xs=DATA.rx,ys=DATA.ry;let lr=0.01,ep=500;
 const segs=[['gdLr',v=>lr=v],['gdEp',v=>ep=v]];
 segs.forEach(([id,set])=>{const s=document.getElementById(id);s.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
   s.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));set(+b.dataset.v);draw();});});
 function draw(){
  const H=gdReg(xs,ys,0.3367,0.1288,lr,ep),last=H[H.length-1];
  const blown=!isFinite(last.L)||last.L>1e6;
  const P=plot({x:50,y:16,w:400,h:250,xr:[-2.3,2.3],yr:[-7,9],xt:[-2,-1,0,1,2],yt:[-6,-3,0,3,6,9],xl:'x'});
  let s=P.svg+dots(P,xs.map((x,i)=>[x,ys[i]]),'pd',4)+curve(P,x=>2.8*x+1.6,'true');
  if(!blown)s+=curve(P,x=>last.w*x+last.b,'mod');
  const finite=H.filter(h=>isFinite(h.L));const top=Math.min(Math.max(...finite.map(h=>h.L)),1e6);
  const Q=plot({x:520,y:16,w:220,h:250,xr:[0,ep],yr:[0,blown?top:Math.max(10,top)],xt:[0,ep],xl:'epoch'});
  s+=Q.svg+curve(Q,e=>{const h=H[Math.round(e)];return h&&isFinite(h.L)?Math.min(h.L,Q.o.yr[1]):NaN;},'los',{n:Math.min(ep,300)})+tx(630,8,'Loss',{fs:12,fw:700,c:'tlos'});
  if(blown)s+=tx(250,140,'הישר ״ברח״ — האימון התפוצץ',{fs:16,fw:800,c:'topt'});
  document.getElementById('gdFig').innerHTML=`<svg viewBox="0 0 760 300" role="img" aria-label="gradient descent">${s}</svg>`;
  const L=last.L,ok=!blown&&L<0.53,slow=!blown&&!ok;
  document.getElementById('gdStat').innerHTML=
   (blown?'':`<span>w = <b>${last.w.toFixed(4)}</b></span><span>b = <b>${last.b.toFixed(4)}</b></span>`)+
   `<span>Loss סופי = <b>${blown?'∞ / nan':L.toFixed(4)}</b></span>`+
   `<span class="verdict ${ok?'good':'bad'}">${blown?'lr גדול מדי: כל צעד מגדיל את השגיאה':ok?'התכנס לישר הטוב ביותר (Loss ≈ 0.515)':'עדיין לא התכנס: lr קטן מדי או מעט אפוקים'}</span>`;
 }
 draw();
})();

/* ---- perceptron playground (weights from slide 29) ---- */
(function(){
 const g=document.getElementById('pgrid');if(!g)return;
 const MAIN=[0,1,1,1,0,1,1,1,0],ANTI=[1,1,0,1,0,1,0,1,1];
 let img=MAIN.slice();
 const f=v=>{const r=Math.round(v*100)/100;return (r<0?'−':'')+Math.abs(r).toFixed(2);};
 const fs=v=>{const r=Math.round(v*100)/100;return r===0?'0':(r<0?'−':'+')+Math.abs(r).toFixed(1);};
 const btns=img.map((v,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','משבצת '+(i+1));
   b.addEventListener('click',()=>{img[i]=1-img[i];out();});g.append(b);return b;});
 document.getElementById('pw').innerHTML=PW.map(w=>`<div class="pc ${w>0?'pos':'neg'}">${fs(w)}</div>`).join('');
 document.getElementById('ppre').addEventListener('click',e=>{const b=e.target.closest('button[data-p]');if(!b)return;img=b.dataset.p.split(',').map(Number);out();});
 function out(){
  btns.forEach((b,i)=>b.setAttribute('aria-pressed',img[i]===0));
  const c=PW.map((w,i)=>w*img[i]),dot=c.reduce((a,b)=>a+b,0),z=dot+PB;
  document.getElementById('pc').innerHTML=c.map((v,i)=>`<div class="pc ${img[i]?(v>0?'pos':'neg'):'zero'}">${img[i]?fs(v):'0'}</div>`).join('');
  const same=a=>a.every((v,i)=>v===img[i]);
  const kind=same(MAIN)?'main':same(ANTI)?'anti':'other';
  const terms=c.map((v,i)=>img[i]?fs(v):null).filter(Boolean);
  document.getElementById('pout').innerHTML=
   `<div class="ph" style="margin-top:14px">4. מחברים את כל התרומות ומוסיפים את ההטיה b</div>`+
   `<div class="fx">${terms.length?terms.join(' ').replace(/^\+/,''):'0'} = ${f(dot)}</div>`+
   `<div class="fx">w·x + b = ${f(dot)} + 0.20 = ${f(z)}</div>`+
   `<div class="ph">5. ההחלטה</div>`+
   `<p>הכלל: אם הציון חיובי התשובה <code>main</code>, ואם הוא שלילי התשובה <code>cross</code>. הציון כאן ${z>0?'חיובי':'שלילי'}, ולכן: <span class="verdict ${z>0?'good':'bad'}">${z>0?'main':'cross'}</span></p>`+
   (kind==='main'?`<div class="box tip"><p><strong>למה זה עובד:</strong> באלכסון הראשי הפינה השמאלית-עליונה והימנית-תחתונה שחורות, ולכן המשקולות השליליות שלהן (−0.5 ו-−0.4) לא נספרות. נשארות בעיקר תרומות חיוביות, למשל +0.8 של הפינה השמאלית-תחתונה.</p></div>`:
    kind==='anti'?`<div class="box tip"><p><strong>למה זה עובד:</strong> באלכסון המשני הפינה השמאלית-תחתונה שחורה, ולכן התרומה הכי חיובית (+0.8) נעלמת. במקומה נספרות −0.5 של הפינה השמאלית-עליונה ו-−0.4 של הימנית-תחתונה, והציון יורד מתחת ל-0.</p></div>`:
    `<div class="box warn"><p><strong>שים לב:</strong> התמונה הזו היא לא אלכסון ראשי ולא אלכסון משני. הנוירון בכל זאת חייב לבחור אחת משתי התשובות, ולכן התשובה כאן לא אומרת כלום על התמונה. זו המגבלה משקף 104: המודל יודע רק את מה שהיה בדאטה שעליו אומן.</p></div>`);
 }
 out();
})();

/* ---- term tooltips: hover on desktop, tap on touch ---- */
(function(){
 const tip=document.createElement('div');tip.className='gtip';tip.setAttribute('role','tooltip');tip.hidden=true;tip.dir='rtl';document.body.append(tip);
 let cur=null,at=0;
 const fmt=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/[A-Za-z][A-Za-z0-9 .,'’\-_()\/=+*σ⁻ᶻ]*[A-Za-z0-9)ᶻ]|[A-Za-z]/g,m=>`<bdi dir="ltr">${m}</bdi>`);
 function show(el){if(cur!==el)at=Date.now();cur=el;tip.innerHTML=`<b>${el.textContent}</b> ${fmt(el.dataset.tip)}`;tip.hidden=false;
   const r=el.getBoundingClientRect(),w=Math.min(320,window.innerWidth-24);tip.style.maxWidth=w+'px';
   const tw=tip.offsetWidth,th=tip.offsetHeight;const vw=window.innerWidth,rb=(function(){var m=document.querySelector('.mta-menu'),q=m&&m.getBoundingClientRect();return q&&q.width&&q.left>r.right?Math.min(q.left,vw):vw})();let x=r.left+r.width/2-tw/2;x=Math.max(12,Math.min(x,rb-tw-12));
   let y=r.top-th-8;tip.classList.toggle('below',y<8);if(y<8)y=r.bottom+8;
   tip.style.left=x+'px';tip.style.top=y+'px';}
 function hide(){cur=null;tip.hidden=true;}
 document.addEventListener('pointerover',e=>{if(e.pointerType!=='mouse')return;const g=e.target.closest('.gt');if(g&&g!==cur)show(g);else if(!g&&cur&&!e.target.closest('.gtip'))hide();});
 document.addEventListener('focusin',e=>{const g=e.target.closest('.gt');if(g)show(g);});
 document.addEventListener('focusout',e=>{if(e.target.closest('.gt'))hide();});
 document.addEventListener('click',e=>{const g=e.target.closest('.gt');if(g){if(cur===g&&Date.now()-at>350)hide();else show(g);}else if(!e.target.closest('.gtip'))hide();});
 window.addEventListener('scroll',hide,{passive:true});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')hide();});
})();

initGuide();
