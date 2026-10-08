/* CLOTHIY — scroll-driven storefront. GSAP + ScrollTrigger + Lenis + Three.js */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
gsap.registerPlugin(ScrollTrigger);ScrollTrigger.config({ignoreMobileResize:true});
const MOB=matchMedia('(max-width:820px)').matches,STEP=MOB?2:1;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const lenis=(!reduce&&window.Lenis)?new Lenis({lerp:.08}):null;
if(lenis){lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0)}
let dustT=0;

/* ---------- content ---------- */
const C={
 women:{h:['DRAPED.','REDEFINED.'],t2:'Woven against the years.',p2:'Every saree begins as a single thread. Hand-selected silk, real gold zari and 140 hours at the loom, finished by hand to the last pleat.',pills:['PURE SILK','REAL ZARI','HAND FINISHED'],list:[['Pallu','HAND-WOVEN ZARI'],['Zari border','24K GOLD THREAD'],['Pleats','HAND-FOLDED'],['Body weave','PURE MULBERRY SILK']],t4:'The Kanjivaram Edit.',stats:[[6.3,1,'m','FULL LENGTH'],[24,0,'K','ZARI GOLD'],[140,0,'hrs','HANDLOOM TIME'],[1,0,'/1','EDITION']]},
 men:{h:['TAILORED.','REDEFINED.'],t2:'Stitched for a lifetime.',p2:'Every shirt begins as a single thread. Long-staple cotton, mother-of-pearl buttons and twenty-two stitches to the inch, finished by hand.',pills:['SUPIMA COTTON','MOTHER-OF-PEARL','22 STITCHES / IN'],list:[['Collar','BUTTON-DOWN ROLL'],['Placket','PEARL BUTTONS'],['Yoke','SPLIT, HAND-SET'],['Cuff','TWO-BUTTON']],t4:'The Midnight Oxford.',stats:[[120,0,"'s",'THREAD COUNT'],[22,0,'','STITCHES / IN'],[9,0,'','PIECES / SHIRT'],[1,0,'/1','FIT SESSION']]}
};
function fill(k){const c=C[k];$('#h1a').textContent=c.h[0];$('#h1b').textContent=c.h[1];$('#c2t').textContent=c.t2;$('#c2p').textContent=c.p2;
 $('#c2l').innerHTML=c.pills.map(x=>`<span>${x}</span>`).join('');
 $('#c3l').innerHTML=c.list.map((l,i)=>`<li><div><b>${l[0]}</b><small>${l[1]}</small></div><em>0${i+1}</em></li>`).join('');
 $('#c4t').textContent=c.t4;
 $('#c4s').innerHTML=c.stats.map(s=>`<div><b><span data-v="${s[0]}" data-d="${s[1]}">0</span><u${/^[\/']/.test(s[2])?' class="nb"':''}>${s[2]}</u></b><small>${s[3]}</small></div>`).join('');L3=$$('#c3l li');S4=$$('#c4s span');fu=1}

/* ---------- frame sequences ---------- */
const SEQ={women:{path:'assets/frames/women/',total:240,p:[]},men:{path:'assets/frames/men/',total:240,p:[]}},done={women:[],men:[]};
const pad=n=>String(n).padStart(4,'0');
function load(k,i){if(i%STEP)return Promise.resolve();const s=SEQ[k];return s.p[i]||(s.p[i]=new Promise(r=>{const im=new Image();im.onload=()=>{done[k][i]=im;r()};im.onerror=r;im.src=`batch_${2+Math.floor((k==='men'?i:240+i)/96)}_frames/${s.path}frame_${pad(i+1)}.webp`}))}
async function preload(k,n,cb){let c=0;await Promise.all(Array.from({length:n},(_,i)=>load(k,i).then(()=>cb&&cb(++c/n))))}
async function rest(k){for(let i=30;i<SEQ[k].total;i+=10){await Promise.all(Array.from({length:10},(_,j)=>i+j<SEQ[k].total?load(k,i+j):0));await new Promise(r=>setTimeout(r,40))}}
let key='women',cur=0,target=0,last=-1;
const cv=$('#seq'),cx=cv.getContext('2d');
function size(){const d=Math.min(devicePixelRatio||1,2);cv.width=innerWidth*d;cv.height=innerHeight*d;last=-1}
function draw(i){const a=done[key],W=cv.width,H=cv.height;let f=a[i];for(let o=1;!f&&o<SEQ[key].total;o++)f=a[i-o]||a[i+o];
 if(!f){const g=cx.createLinearGradient(0,0,W,H);g.addColorStop(0,'#060A16');g.addColorStop(1,'#3a2f12');cx.fillStyle=g;cx.fillRect(0,0,W,H);cx.fillStyle='#E6CF94';cx.font=`${W/18}px serif`;cx.fillText(pad(i+1),W*.08,H*.5);return}
 const s=Math.max(W/f.width,H/f.height),w=f.width*s,h=f.height*s;cx.drawImage(f,(W-w)/2,(H-h)/2,w,h)}

/* ---------- hero chapters + HUD ---------- */
const ch=$$('.ch');let lc=-1,fu=1,L3=[],S4=[];
function ui(p,i){const f=.04;
 ch.forEach((e,k)=>{const s=k*.25,en=s+.25,a=Math.min(k?clamp((p-(s-f))/(2*f)):1,k<3?clamp((en+f-p)/(2*f)):1);e.style.opacity=a;e.style.transform=(k===0?'translateY(-50%) ':'')+`translateY(${(1-a)*30}px)`;e.style.pointerEvents=a>.5?'auto':'none'});
 L3.forEach((l,j)=>{const a=clamp((p-.5-.012*j-.01)/.03);l.style.opacity=a;l.style.transform=`translateX(${(1-a)*20}px)`});
 const q=clamp((p-.76)/.17);S4.forEach(s=>s.textContent=(+s.dataset.v*q).toFixed(+s.dataset.d));
 const ci=Math.min(3,Math.floor(p*4));$('#cn').textContent='0'+(ci+1);$('#cf').style.width=(p*100)+'%';
 const sec=i/24,mm=String(Math.floor(sec)).padStart(2,'0'),ff=String(i%24).padStart(2,'0');
 $('#hrt').textContent=p<.04?'SCROLL ———':`00:${mm}:${ff}   ·   ${String(i+1).padStart(3,'0')} / ${SEQ[key].total}`}
gsap.ticker.add(()=>{cur+=(target-cur)*.2;if(Math.abs(target-cur)<1e-4)cur=target;const i=Math.round(cur*(SEQ[key].total-1));if(i!==last){last=i;draw(i)}if(cur!==lc||fu){lc=cur;fu=0;ui(cur,i)}});
ScrollTrigger.create({trigger:'#hero',start:'top top',end:'bottom bottom',onUpdate:s=>target=s.progress});

function setSeq(k,keep){if(k===key)return;key=k;document.body.dataset.seq=k;$$('.tg button').forEach(b=>b.classList.toggle('on',b.dataset.k===k));fill(k);renderCards();setTrack(0);ScrollTrigger.refresh();
 gsap.fromTo(cv,{opacity:0},{opacity:1,duration:.7});last=-1;preload(k,30).then(()=>last=-1);rest(k);
 const top=(keep?$('#featured'):$('#hero')).offsetTop;lenis?lenis.scrollTo(top,{immediate:true}):scrollTo(0,top)}
$$('.tg button').forEach(b=>b.onclick=()=>setSeq(b.dataset.k,!!b.closest(".tg2")));

/* ---------- menu ---------- */
$('#burger').onclick=()=>{document.body.classList.toggle('menu');lenis&&(document.body.classList.contains('menu')?lenis.stop():lenis.start())};
$$('#menu a').forEach(a=>a.onclick=e=>{e.preventDefault();document.body.classList.remove('menu');lenis&&lenis.start();const t=$(a.getAttribute('href'));lenis?lenis.scrollTo(t,{duration:1.6}):t.scrollIntoView()});

/* ---------- featured carousel ---------- */
let CARDS=[],CC=[];function renderCC(){CARDS=[...trk.children];CC=CARDS.map(c=>[c.offsetLeft+c.offsetWidth/2,c.offsetWidth])}
const GEN=p=>/saree|silk|zari|drape|tissue|kanjivaram|banarasi|chanderi/i.test(p[1])?"women":"men";
const P=[['KANCHIPURAM','Midnight Silk Saree','KP-1204','₹ 48,500','Available','p_saree1'],['CLOTHIY MEN','Midnight Oxford Shirt','MO-3101','₹ 3,490','Available','p_shirt1'],['BANARAS','Gold Zari Katan Saree','BN-2217','₹ 36,900','Reserved','p_saree3'],['CLOTHIY MEN','Pearl Button Shirt','PB-3112','₹ 2,990','Available','p_shirt2'],['MYSORE','Silk Zari Drape','MY-0931','₹ 18,900','Last one','p_saree2'],['CLOTHIY MEN','The Signature Shirt','SG-3140','₹ 4,290','Last one','p_shirt3'],['CHANDERI','Gold Tissue Edit','CH-0418','₹ 12,400','On enquiry','p_saree4'],['CLOTHIY MEN','Classic Fit Oxford','CF-3177','₹ 3,190','Reserved','p_shirt4'],
['KANCHIPURAM','Royal Red Kanjivaram','KP-1310','₹ 52,500','Available','p_red_saree2'],['KANCHIPURAM','Crimson Zari Silk Drape','KP-1322','₹ 41,900','Available','p_red_saree'],['CLOTHIY MEN','Royal Red Oxford Shirt','RR-3201','₹ 3,590','Available','p_red_shirt'],
['BANARAS','Emerald Banarasi Saree','BN-2301','₹ 44,800','Available','p_green_saree2'],['BANARAS','Emerald Peacock Zari Drape','BN-2318','₹ 38,500','Last one','p_green_saree'],['CLOTHIY MEN','Emerald Linen Shirt','EL-3215','₹ 3,290','Available','p_green_shirt'],
['CHANDERI','Peach Chanderi Saree','CH-0502','₹ 14,900','Available','p_peach_saree2'],['CHANDERI','Peach Gold Tissue Drape','CH-0519','₹ 16,500','Reserved','p_peach_saree'],['CLOTHIY MEN','Peach Cream Shirt','PC-3230','₹ 2,890','Available','p_peach_shirt'],
['KANCHIPURAM','Coal Black Kanjivaram','KP-1401','₹ 49,500','Available','p_black_saree2'],['MYSORE','Black Zari Border Drape','MY-1012','₹ 39,900','On enquiry','p_black_saree'],['CLOTHIY MEN','Coal Black Oxford Shirt','CB-3244','₹ 3,690','Available','p_black_shirt'],['CLOTHIY MEN','Pleated Wool Trousers','PT-4101','₹ 4,290','Available','p_black_pants']];
const SC={Available:'#4caf7a',Reserved:'#C8A24A','Last one':'#fff','On enquiry':'#888'};
const trk=$('#trk');function renderCards(){const L=P.map((p,i)=>[p,i]).filter(([p])=>GEN(p)===key);trk.innerHTML=L.map(([p,i],n)=>`<article class="card" data-i="${i}"><div class="im"><img src="assets/img/${p[5]}.jpg" alt="${p[1]}" loading="lazy"><span class="ix">${String(n+1).padStart(2,"0")}</span></div><b>${p[0]}</b><h3>${p[1]}</h3><div class="rf">${p[2]} · <span class="st">${p[4]}<i style="--c:${SC[p[4]]}"></i></span></div><div class="ft"><span class="pr">${p[3]}</span><button class="add" data-add="${i}" aria-label="Add to bag — ${p[1]}">Add to bag</button></div></article>`).join('');$('#featured').style.height=Math.max(350,L.length*28)+'vh';$('#featured h2 i').textContent=key==='women'?'FEATURED SAREES':'FEATURED MENSWEAR';trk.style.transform='';renderCC();gsap.fromTo(trk,{opacity:0},{opacity:1,duration:.6})}
renderCards();
function setTrack(p){p=clamp(p/.88);const max=Math.max(0,trk.scrollWidth-innerWidth);trk.style.transform=`translateX(${-p*max}px)`;$('#pl i').style.width=p*100+'%';const m=innerWidth/2,tx=p*max;CARDS.forEach((c,k)=>c.classList.toggle('mid',Math.abs(CC[k][0]-tx-m)<CC[k][1]*.55))}
ScrollTrigger.create({trigger:'#featured',start:'top top',end:'bottom bottom',onUpdate:s=>setTrack(s.progress)});setTrack(0);
/* ---------- search + bag ---------- */
const num=s=>+s.replace(/[^\d]/g,''),inr=n=>'₹ '+n.toLocaleString('en-IN'),IM=p=>window.IMG?IMG[p[5]]:`assets/img/${p[5]}.jpg`;
const TAGS=p=>(GEN(p)==='women'?'saree women silk zari weave traditional':/trouser|pant/i.test(p[1])?'pants trousers men wool tailored menswear':'shirt men cotton oxford tailored menswear')+(/emerald/i.test(p[1])?' green':'')+(/red|crimson/i.test(p[1])?' red maroon':'')+(/peach/i.test(p[1])?' peach white cream':'')+(/black/i.test(p[1])?' black coal':'')+(/midnight/i.test(p[1])?' navy blue':'');
let bag={};try{bag=JSON.parse(localStorage.getItem('clothiy_bag')||'{}')}catch(e){}
const count=()=>Object.values(bag).reduce((a,b)=>a+b,0);
function renderBag(){const ids=Object.keys(bag).filter(i=>P[i]);$('#cc').textContent=count();$('#bbtn').setAttribute('aria-label','Bag, '+count()+' items');$('#cn2').textContent=`(${count()})`;
 $('#ci').innerHTML=ids.length?ids.map(i=>{const p=P[i];return `<div class="it"><img src="${IM(p)}" alt=""><div><b>${p[0]}</b><div class="nm">${p[1]}</div><div class="pr">${p[3]}</div><div class="qty"><button data-q="${i}" data-d="-1" aria-label="Less">−</button><span>${bag[i]}</span><button data-q="${i}" data-d="1" aria-label="More">+</button></div></div><button class="rm" data-rm="${i}">Remove</button></div>`}).join(''):'<p class="empty">Your bag is empty.</p>';
 $('#ct').textContent=inr(ids.reduce((a,i)=>a+num(P[i][3])*bag[i],0));$('#cm').textContent='';try{localStorage.setItem('clothiy_bag',JSON.stringify(bag))}catch(e){}}
let tt;function toast(m,view){const t=$('#toast');t.innerHTML=`<span>${m}</span>`+(view?'<button id="tv">View bag</button>':'');t.classList.add('on');if(view)$('#tv').onclick=()=>{t.classList.remove('on');openCart()};clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2800)}
function add(i,btn){bag[i]=(bag[i]||0)+1;renderBag();const s=$('#cc');s.classList.remove('pop');void s.offsetWidth;s.classList.add('pop');toast(`${P[i][1]} added to bag`,1);if(btn){const o=btn.textContent;btn.classList.add('ok');btn.textContent='✓';setTimeout(()=>{btn.classList.remove('ok');btn.textContent=o},1200)}}
const lock=on=>lenis&&(on?lenis.stop():lenis.start());
function openCart(){closeSearch();$('#toast').classList.remove('on');$('#cart').classList.add('on');$('#shade2').classList.add('on');lock(1)}
function closeCart(){$('#cart').classList.remove('on');$('#shade2').classList.remove('on');if(!$('#search').classList.contains('on'))lock(0)}
function openSearch(){closeCart();$('#search').classList.add('on');lock(1);runSearch();setTimeout(()=>$('#sq').focus(),350)}
function closeSearch(){$('#search').classList.remove('on');if(!$('#cart').classList.contains('on'))lock(0)}
function runSearch(){const raw=$('#sq').value.trim(),w=raw.toLowerCase().split(/\s+/).filter(Boolean).map(x=>x.length>3?x.replace(/s$/,''):x);
 const r=P.map((p,i)=>[p,i]).filter(([p])=>{const h=(p.slice(0,3).join(' ')+' '+TAGS(p)+' '+p[4]).toLowerCase();return w.every(x=>new RegExp('\\b'+x.replace(/[^a-z0-9]/g,'')).test(h))});
 $('#sr').innerHTML=r.length?r.map(([p,i])=>`<article class="sres"><div class="im" data-go="${i}"><img src="${IM(p)}" alt="${p[1]}"></div><b>${p[0]}</b><h3>${p[1]}</h3><div class="row2"><span class="pr">${p[3]}</span><button class="add" data-add="${i}">Add to bag</button></div></article>`).join(''):`<p class="none">No pieces match “${raw.replace(/[<>&]/g,'')}”. Try saree, shirt, silk or zari.</p>`}
function goCard(i){closeSearch();if(GEN(P[i])!==key)setSeq(GEN(P[i]),true);const c=$('.card[data-i="'+i+'"]'),f=$('#featured'),mx=Math.max(1,trk.scrollWidth-innerWidth),p=clamp((c.offsetLeft-(innerWidth-c.offsetWidth)/2)/mx),y=f.offsetTop+p*.88*(f.offsetHeight-innerHeight);lenis?lenis.scrollTo(y,{duration:1.8}):scrollTo(0,y)}
$('#sbtn').onclick=openSearch;$('#bbtn').onclick=openCart;$('#sx').onclick=closeSearch;$('#cx').onclick=closeCart;$('#shade2').onclick=closeCart;$('#sq').addEventListener('input',runSearch);
$$('.chips button').forEach(b=>b.onclick=()=>{$('#sq').value=b.textContent;runSearch()});
addEventListener('keydown',e=>{if(e.key==='Escape'){closeSearch();closeCart()}});
document.addEventListener('click',e=>{const a=e.target.closest('[data-add]');if(a)return add(+a.dataset.add,a);const g=e.target.closest('[data-go]');if(g)return goCard(+g.dataset.go);const q=e.target.closest('[data-q]');if(q){const i=q.dataset.q;bag[i]+=+q.dataset.d;if(bag[i]<=0)delete bag[i];return renderBag()}const r=e.target.closest('[data-rm]');if(r){delete bag[r.dataset.rm];renderBag()}});
document.fonts&&document.fonts.ready.then(renderCC);
$('#co').onclick=()=>{$('#cm').textContent=count()?'Demo checkout: connect Razorpay / UPI to take real orders.':'Add a piece to your bag first.'};
renderBag();


/* ---------- world tiles ---------- */
$$('.tile:not(.img)').forEach(t=>['mouseenter','click'].forEach(ev=>t.addEventListener(ev,()=>{$$('.tile').forEach(x=>x.classList.remove('on'));t.classList.add('on')})));

/* ---------- reveals ---------- */
$$('[data-rv]').forEach(h=>gsap.from($$('.ln i',h),{yPercent:110,duration:.9,ease:'power3.out',stagger:.08,scrollTrigger:{trigger:h,start:'top 88%'}}));
gsap.set('.rv,.stg>*',{opacity:0,y:24});
ScrollTrigger.batch('.rv,.stg>*',{start:'top 92%',onEnter:b=>gsap.to(b,{opacity:1,y:0,duration:.9,stagger:.1,ease:'power3.out',overwrite:true})});
gsap.to('.tr svg,.tr svg *',{strokeDashoffset:0,duration:1.6,stagger:.04,ease:'power2.inOut',scrollTrigger:{trigger:'#trust',start:'top 80%'}});
gsap.fromTo('#cream',{borderTopLeftRadius:'70vw 40vh'},{borderTopLeftRadius:'0vw 0vh',ease:'none',scrollTrigger:{trigger:'#cream',start:'top 95%',end:'top 10%',scrub:true}});
const dz={},dset=(k,v)=>{dz[k]=v;dustT=Object.values(dz).some(Boolean)?0:.55};
[['h','#hero','top 60%','bottom 40%'],['s','#story','top 70%','bottom 30%'],['c','#cream','top 60%','bottom 40%']].forEach(([k,t,a,b])=>ScrollTrigger.create({trigger:t,start:a,end:b,onToggle:s=>dset(k,s.isActive)}));

/* ---------- story: statement -> atelier ---------- */
const rows=$$('.sb li');
ScrollTrigger.create({trigger:'#story',start:'top top',end:'bottom bottom',onUpdate:s=>{const p=s.progress;
 $('#simg').style.transform=`scale(${1.15-.15*clamp(p/.5)})`;$('.dk').style.opacity=.75+.25*clamp((p-.4)/.2);
 const a=clamp(1-(p-.36)/.1),b=clamp((p-.5)/.1);$('.sa').style.opacity=a;$('.sa').style.transform=`translateY(calc(-50% - ${(1-a)*30}px))`;$('.sa').style.pointerEvents=a>.5?'auto':'none';
 $('.sb').style.opacity=b;$('.sb').style.transform=`translateY(calc(-50% + ${(1-b)*30}px))`;rows.forEach((r,j)=>{const x=clamp((p-.62-.08*j)/.08);r.style.opacity=x;r.style.transform=`translateY(${(1-x)*16}px)`})}});

/* ---------- magnetic buttons ---------- */
if(!reduce)$$('.mag').forEach(b=>{const c=gsap.utils.clamp(-8,8);b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();gsap.to(b,{x:c((e.clientX-r.left-r.width/2)*.25),y:c((e.clientY-r.top-r.height/2)*.25),duration:.3,overwrite:true})});b.addEventListener('mouseleave',()=>gsap.to(b,{x:0,y:0,duration:.5,ease:'power3.out'}))});

/* ---------- THREE.JS layer 1: gold dust ---------- */
(function(){if(reduce||MOB||!window.THREE)return;let r;try{r=new THREE.WebGLRenderer({canvas:$('#dust'),alpha:true})}catch(e){return}
 r.setPixelRatio(Math.min(devicePixelRatio,1.5));const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(60,1,.1,100);cam.position.z=30;
 const N=innerWidth<768?600:1800,pos=new Float32Array(N*3),spd=new Float32Array(N);
 for(let i=0;i<N;i++){pos[i*3]=(Math.random()-.5)*80;pos[i*3+1]=(Math.random()-.5)*50;pos[i*3+2]=(Math.random()-.5)*40;spd[i]=.2+Math.random()}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));
 const t=document.createElement('canvas');t.width=t.height=32;const x=t.getContext('2d'),gr=x.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,'#fff');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(0,0,32,32);
 const m=new THREE.PointsMaterial({color:0xE6CF94,size:.4,map:new THREE.CanvasTexture(t),transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}),pts=new THREE.Points(g,m);sc.add(pts);
 let mx=0,my=0;addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
 const rs=()=>{r.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()};rs();addEventListener('resize',rs);
 gsap.ticker.add((tm,dt)=>{const v=lenis?lenis.velocity:0,a=g.attributes.position.array;for(let i=0;i<N;i++){a[i*3+1]+=spd[i]*.012*(1+Math.min(Math.abs(v),30)*.3)*(dt/16);if(a[i*3+1]>25)a[i*3+1]=-25}
  g.attributes.position.needsUpdate=true;pts.position.x+=(mx*-3-pts.position.x)*.05;pts.position.y+=(my*2-pts.position.y)*.05;m.opacity+=(dustT-m.opacity)*.06;r.render(sc,cam)})})();

/* ---------- THREE.JS layer 2: fabric ripple on New Collection cards ---------- */
function ripple(box){if(reduce||MOB||!window.THREE)return;box.addEventListener('mouseenter',function f(){box.removeEventListener('mouseenter',f);ripple2(box);box.dispatchEvent(new Event('mouseenter'))})}
function ripple2(box){let r;try{r=new THREE.WebGLRenderer({alpha:true})}catch(e){return}
 const cvs=r.domElement;cvs.className='rp';box.appendChild(cvs);const sc=new THREE.Scene(),cam=new THREE.OrthographicCamera(-.5,.5,.5,-.5,0,1),u={t:{value:0},h:{value:0},tx:{value:null}};
 new THREE.TextureLoader().load($('img',box).src,tx=>u.tx.value=tx);
 sc.add(new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.ShaderMaterial({uniforms:u,vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=vec4(position.xy*2.,0.,1.);}',fragmentShader:'uniform sampler2D tx;uniform float t,h;varying vec2 v;void main(){vec2 p=v;p+=vec2(sin(p.y*9.+t*1.6),cos(p.x*7.+t*1.3))*h*.014;p=(p-.5)/(1.+.06*h)+.5;gl_FragColor=texture2D(tx,p);}'})));
 const rs=()=>{r.setPixelRatio(Math.min(devicePixelRatio,1.5));r.setSize(box.clientWidth,box.clientHeight,false)};rs();addEventListener('resize',rs);
 let run=false;const loop=t=>{u.t.value=t/1000;r.render(sc,cam);if(run||u.h.value>.01)requestAnimationFrame(loop)};
 box.addEventListener('mouseenter',()=>{if(!u.tx.value)return;run=true;cvs.style.opacity=1;gsap.to(u.h,{value:1,duration:.6});requestAnimationFrame(loop)});
 box.addEventListener('mouseleave',()=>{run=false;gsap.to(u.h,{value:0,duration:.6,onComplete:()=>cvs.style.opacity=0})})}
$$('.rb').forEach(ripple);

/* ---------- boot ---------- */
fill('women');size();let lw=innerWidth;addEventListener('resize',()=>{if(innerWidth===lw)return;lw=innerWidth;size();renderCC();ScrollTrigger.refresh()});
preload('women',30,p=>{$('#lp').style.width=p*100+'%';$('#lt').textContent=Math.round(p*100)+'%'}).then(()=>{last=-1;$('#loader').classList.add('off');ScrollTrigger.refresh();rest('women');setTimeout(()=>preload('men',30).then(()=>rest('men')),2500)});
