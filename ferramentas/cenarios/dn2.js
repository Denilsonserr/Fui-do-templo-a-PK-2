
/* ================= v159/v162: cenários com DIA/NOITE e DESTRUIÇÃO em níveis (imagens do dono). Dados por cenário em DNS[chave]:
   L = níveis (inteiro → mais destruído), feet = linha dos pés na imagem, thr = pontos para cada nível, smk = pontos de fumaça por nível, lamps, moon, names = avisos. ================= */
const DNS=__DNS__;let CUP=DNS.cupula;const DN={key:'',ph:.96,lv:0,from:0,k:1,pts:0,pend:0,ult:0,smk:[],deb:[],night:0,sun:0};
const CUPIW=2172,CUPIH=724;function dnSet(k){if(DNS[k])CUP=DNS[k]}
function cupImg(l,k){const L=k==='trees'?(CUP.life&&CUP.life[l]):CUP.L[l];if(!L||!L[k])return null;const c=L['_'+k]||(L['_'+k]=Object.assign(new Image(),{decoding:'async',src:L[k]}));return c.complete&&c.naturalWidth?c:null}
function cupLoad(k){if(k)dnSet(k);const P=[];for(let l=0;l<CUP.L.length;l++)for(const k of ['far','win','stars','skyN','skyS','fire','trees']){const O=k==='trees'?(CUP.life&&CUP.life[l]):CUP.L[l];if(!O||!O[k])continue;cupImg(l,k);const im=O['_'+k];P.push(new Promise(r=>{if(im.complete)return r();im.onload=im.onerror=()=>r()}))}return Promise.all(P)}
function cupFree(k){const D=DNS[k]||CUP;for(const L of D.L)for(const k of ['far','win','stars','skyN','skyS','fire'])L['_'+k]=null;for(const L of (D.life||[]))L._trees=null}
/* paleta do dia: 0 manha, .25 meio-dia, .5 por do sol, .66 noite ... .96 madrugada */
const DNK=[[0,[255,214,196],.18,.25],[.1,[255,255,255],0,0],[.42,[255,252,245],0,0],[.5,[255,196,150],.8,.05],[.57,[170,140,175],.45,.5],[.64,[78,92,150],0,1],[.9,[78,92,150],0,1],[.96,[140,125,170],.25,.6],[1,[255,214,196],.18,.25]];
function dnPal(p){for(let i=1;i<DNK.length;i++){const B=DNK[i];if(p<=B[0]){const A=DNK[i-1],u=(p-A[0])/(B[0]-A[0]);return{m:A[1].map((v,j)=>Math.round(v+(B[1][j]-v)*u)),sun:A[2]+(B[2]-A[2])*u,night:A[3]+(B[3]-A[3])*u}}}return{m:[255,255,255],sun:0,night:0}}
const LTD={day:{rim:'#fff4dc',amb:'#6a98d8',aa:.08,bnc:'#e0bc90',ba:.15},sun:{rim:'#ffb070',amb:'#a05a60',aa:.18,bnc:'#ff9a5a',ba:.2},night:{rim:'#a8c4ff',amb:'#18285a',aa:.32,bnc:'#3a5aa0',ba:.12}};
function dnMixLT(){const P=dnPal(DN.ph),n=P.night,s=P.sun,L=LT[STAGE.key]||LT.cupula;const mix=(a,b,c)=>mixHex(mixHex(a,b,s*(1-n)),c,n);
  const D0=L._d||(L._d={rim:L.rim,amb:L.amb,aa:L.aa,bnc:L.bnc,ba:L.ba});
  L.rim=mix(D0.rim,LTD.sun.rim,LTD.night.rim);L.amb=mix(D0.amb,LTD.sun.amb,LTD.night.amb);L.bnc=mix(D0.bnc,LTD.sun.bnc,LTD.night.bnc);
  L.aa=D0.aa+(LTD.sun.aa-D0.aa)*s*(1-n)+(LTD.night.aa-D0.aa)*n;L.ba=D0.ba+(LTD.sun.ba-D0.ba)*s*(1-n)+(LTD.night.ba-D0.ba)*n;
  STAGE.night=n;STAGE.sunset=s*(1-n);STAGE.lit=.9-.25*n;STAGE.bloom=.35+.25*n;DN.night=n;DN.sun=s;DN.m=P.m}
/* destruição: especiais somam 1, transformação 1, ultimate 3 (aplicado quando o vídeo acaba). Nível 1 com 3 pontos, nível 2 com 7. */
const DNSP={rgc:1,gjc:1,gjc2:1,lfc:1,mdc:1,mdc2:1,rushS:1,comicS:1,super:1,swordRain:1,arkDive:1};
function dnAdd(n){if(G.phase!=='fight'&&G.phase!=='ko')return;DN.pts+=n;let t=0;CUP.thr.forEach((v,i)=>{if(DN.pts>=v&&(DN.ults||0)>=((CUP.ug||[])[i]||0))t=i});if(t>DN.lv)dnBreak(t)}
function dnBreak(t){DN.from=DN.lv;DN.lv=t;DN.k=0;G.shake=Math.max(G.shake,22);G.flash=Math.max(G.flash,6);G.flashCol='#fff1d8';try{SFX.crater();SFX.boom()}catch(e){}buzz(120);
  banner(CUP.names[Math.min(t,CUP.names.length-1)],'#ffcf7a',70);
  for(let i=0;i<14+t*4;i++)DN.deb.push({x:CAM.x+Math.random()*VW/CAM.z,y:-60-Math.random()*300,vy:rand(2,6),vx:rand(-1,1),r:rand(.5,6),s:rand(6,18),l:0});
  for(let i=0;i<18;i++){try{dust(CAM.x+Math.random()*VW/CAM.z,FLOOR,3)}catch(e){}}}
function dnTick(){if(!STAGE.dn)return;if(G.mode==='fight'&&!G.paused&&G.phase!=='intro')DN.ph=(DN.ph+1/(60*CUP.day))%1;dnMixLT();
  if(DN.k<1)DN.k=Math.min(1,DN.k+1/50);
  if(G.mode!=='fight')return;
  const ult=!!(G.ws||G.wfs||G.xu||G.sr||G.as);if(ult&&!DN.ult){DN.ult=1;DN.pend+=5}if(!ult&&DN.ult){DN.ult=0;DN.ults=(DN.ults||0)+1;const p=DN.pend;DN.pend=0;dnAdd(p)}
  if(G.trans&&!DN.tr){DN.tr=1;DN.pend+=2}if(!G.trans&&DN.tr){DN.tr=0;if(!DN.ult){const p=DN.pend;DN.pend=0;dnAdd(p)}}
  for(const f of G.p){if(!f)continue;if(DNSP[f.state]&&f._dnS!==f.state)dnAdd(2);f._dnS=f.state}
  for(const d of DN.deb){d.l++;d.vy+=.35;d.y+=d.vy;d.x+=d.vx;d.r+=.1;if(d.y>FLOOR-4&&!d.done){d.done=1;try{dust(d.x,FLOOR,1)}catch(e){}}}DN.deb=DN.deb.filter(d=>!d.done&&d.l<200);
  // fumaça subindo dos pontos do cenário destruído
  const SP=CUP.smk[DN.lv]||[];
  if(SP.length&&G.frame%7===0){const q=SP[(Math.random()*SP.length)|0];DN.smk.push({u:q[0]+rand(-14,14),v:q[1],vu:rand(-.2,.6),vv:-rand(.5,.9),s:rand(30,55),l:0,m:rand(160,240)})}
  for(const p of DN.smk){p.l++;p.u+=p.vu;p.v+=p.vv;p.s+=.35}DN.smk=DN.smk.filter(p=>p.l<p.m)}
const DNPUF=(()=>{const c=document.createElement('canvas');c.width=c.height=96;const g=c.getContext('2d');for(let i=0;i<9;i++){const x=30+Math.random()*36,y=30+Math.random()*36,r=16+Math.random()*20,gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(40,38,44,.55)');gr.addColorStop(1,'rgba(40,38,44,0)');g.fillStyle=gr;g.fillRect(0,0,96,96)}return c})();
const DNB=[];
const DNF=[];
function dnLife(lv,k,A,fu,fv,sc,n,t){if(CUP.snow){if(DNF.length<70&&G.hitstop<=0)DNF.push({x:CAM.x+Math.random()*VW/CAM.z,y:CAM.y-H/CAM.z-20+(H-H/CAM.z),s:rand(1.2,3.4),vy:rand(.6,1.6),ph:Math.random()*6});
    ctx.save();ctx.fillStyle='#ffffff';for(const f of DNF){if(G.hitstop<=0){f.y+=f.vy;f.x+=Math.sin(t*.02+f.ph)*.5-.25}ctx.globalAlpha=.75;ctx.beginPath();ctx.arc(f.x,f.y,f.s,0,TAU);ctx.fill()}ctx.restore();for(let i=DNF.length-1;i>=0;i--)if(DNF[i].y>FLOOR+60)DNF.splice(i,1)}
  if(CUP.rain&&DN.lv===CUP.L.length-1){const k2=DN.lv===DN.from?1:DN.k;if(!DN.rn)DN.rn=[];const R=DN.rn;while(R.length<70)R.push({x:Math.random(),y:Math.random(),v:rand(.012,.02),l:rand(14,26)});
    ctx.save();ctx.strokeStyle='rgba(200,215,240,1)';ctx.lineWidth=1.1;ctx.globalAlpha=.28*k2;const x0=CAM.x,w=VW/CAM.z,y0=H-H/CAM.z,hh=H/CAM.z;ctx.beginPath();
    for(const d of R){if(G.hitstop<=0){d.y+=d.v;d.x-=d.v*.25;if(d.y>1){d.y=0;d.x=Math.random()}if(d.x<0)d.x+=1}const x=x0+d.x*w,y=y0+d.y*hh;ctx.moveTo(x,y);ctx.lineTo(x-d.l*.25,y+d.l)}ctx.stroke();ctx.restore()}
  const LF=CUP.life;if(!LF)return;
  const trees=(l,a)=>{const L=LF[l],im=cupImg(l,'trees');if(!L||!im||a<=0)return;ctx.save();ctx.globalAlpha=a;
    for(let i=0;i<L.tr.length;i++){const q=L.tr[i],w=q[6]*sc,h=q[7]*sc,px=fu(q[4]+q[6]/2),py=fv(q[5]+q[7]),gust=Math.max(0,Math.sin(t*.004+1))*.5;
      const an=(Math.sin(t*.022+i*1.37)*.022+Math.sin(t*.051+i*.7)*.008)*(1+gust);ctx.save();ctx.translate(px,py);ctx.rotate(an);ctx.scale(1.045,1.045);ctx.drawImage(im,q[0],q[1],q[2],q[3],-w/2,-h,w,h);ctx.restore()}ctx.restore()};
  if(k<1)trees(A,1-k);trees(lv,k<1?k:1);
  const L=LF[lv];
  if(L&&L.wp&&L.wp.length&&n<.9){ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle='#ffffff';
    for(let i=0;i<L.wp.length;i++){const p=L.wp[i],s=Math.sin(t*.045+i*2.3);if(s<.75)continue;const a=(s-.75)*4*(1-n*.8);ctx.globalAlpha=a*.8;const x=fu(p[0]+Math.sin(t*.01+i)*4),y=fv(p[1]);ctx.fillRect(x-5*sc,y-.6*sc,10*sc,1.4*sc)}ctx.restore()}
  // fogo desenhado com movimento: chamas do GIF de fogo nos focos de incendio
  const FP=CUP.L[lv].fp;if(FP&&FP.length&&RGAU.img.complete&&RGAU.img.naturalWidth){const C=CUP.L[lv]._fc||(CUP.L[lv]._fc=(()=>{const B={};for(const p of FP){const kk=Math.round(p[0]/70)+','+Math.round(p[1]/50);(B[kk]=B[kk]||[]).push(p)}return Object.values(B).map(g=>[g.reduce((a,p)=>a+p[0],0)/g.length,Math.max(...g.map(p=>p[1])),g.length])})());
    ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<C.length;i++){const c=C[i],fr=Math.floor(t/4+i)%RGAU.n,h=(26+Math.min(5,c[2])*7)*sc*(1+.12*Math.sin(t*.3+i)),w=h*RGAU.w/RGAU.h;
      ctx.globalAlpha=.42+.15*Math.sin(t*.5+i*2);ctx.drawImage(RGAU.img,0,fr*RGAU.h,RGAU.w,RGAU.h,fu(c[0])-w/2,fv(c[1])-h*.86,w,h)}ctx.restore()}
  // passaros de dia
  if(n<.4&&G.mode==='fight'){if(DNB.length<4&&Math.random()<.004)DNB.push({u:Math.random()<.5?-40:CUPIW+40,v:rand(120,300),d:0,n:3+(Math.random()*4|0),l:0});
    ctx.save();ctx.strokeStyle=`rgba(20,30,30,${.55*(1-n*2)})`;ctx.lineWidth=Math.max(1,1.4*sc);for(const b of DNB){if(!b.d)b.d=b.u<0?1:-1;b.l++;b.u+=b.d*.9;b.v+=Math.sin(b.l*.05)*.15;
      for(let j=0;j<b.n;j++){const x=fu(b.u-b.d*j*14),y=fv(b.v+(j%2)*8+j*3),f=Math.sin(b.l*.3+j)*3*sc;ctx.beginPath();ctx.moveTo(x-6*sc,y-f);ctx.lineTo(x,y);ctx.lineTo(x+6*sc,y-f);ctx.stroke()}}ctx.restore();
    for(let i=DNB.length-1;i>=0;i--)if(DNB[i].u<-80||DNB[i].u>CUPIW+80)DNB.splice(i,1)}}
function drawDN(S){dnSet(S.key);const K=S.dw/CUPIW,X0=-(S.dw-S.ww)/2,dy=S.dy,z=CAM.z,zf=.9,r=zf/z,cxf=WW/2+(CAM.cx-WW/2)*.8;
  // cenario inteiro com MENOS zoom (zf) que os lutadores, preso na linha dos pes (FLOOR) e com paralaxe
  const FX=CAM.cx+(X0-cxf)*r,FY=FLOOR+(dy-FLOOR)*r,FW=S.dw*r,FH=S.dh*r,fu=u=>FX+u*K*r,fv=v=>FY+v*K*r,GY=FY+CUP.feet*K*r;
  const top=H-H/z-60;if(FY>top){ctx.fillStyle=CUP.top;ctx.fillRect(CAM.x-50,top-200,VW/z+100,FY-top+204)}
  const lv=DN.lv,k=DN.k,A=DN.from;
  const pair=(key,fn)=>{if(k<1){const a=cupImg(A,key);if(a)fn(a,1)}const b=cupImg(lv,key);if(b)fn(b,k<1?k:1)};
  pair('far',(im,a)=>{ctx.globalAlpha=a;ctx.drawImage(im,FX,FY,FW,FH);ctx.globalAlpha=1});
  const n=DN.night,sn=DN.sun*(1-n),t=G.frame;
  if(sn>.01)pair('skyS',(im,a)=>{ctx.globalAlpha=a*sn*.6;ctx.drawImage(im,FX,FY,FW,FH);ctx.globalAlpha=1});
  if(n>.01){pair('skyN',(im,a)=>{ctx.globalAlpha=a*n*.88;ctx.drawImage(im,FX,FY,FW,FH);ctx.globalAlpha=1});
    ctx.save();ctx.globalCompositeOperation='lighter';pair('stars',(im,a)=>{ctx.globalAlpha=a*n*(.75+.25*Math.sin(t*.05));ctx.drawImage(im,FX,FY,FW,FH)});
    const mx=fu(CUP.moon[0]),my=fv(CUP.moon[1]),mr=26*K*r,g=ctx.createRadialGradient(mx,my,mr*.2,mx,my,mr*5);g.addColorStop(0,`rgba(235,240,255,${.9*n})`);g.addColorStop(.2,`rgba(200,215,255,${.35*n})`);g.addColorStop(1,'rgba(150,170,255,0)');ctx.fillStyle=g;ctx.fillRect(mx-mr*5,my-mr*5,mr*10,mr*10);ctx.restore()}
  dnLife(lv,k,A,fu,fv,K*r,n,t);
  // fumaça (atrás do chão)
  if(DN.smk.length){ctx.save();for(const p of DN.smk){const a=Math.min(1,p.l/25,(p.m-p.l)/60);ctx.globalAlpha=a*.85;const s=p.s*K*r;ctx.drawImage(DNPUF,fu(p.u)-s/2,fv(p.v)-s/2,s,s)}ctx.restore()}
  // chão: zoom cheio (os lutadores pisam aqui)
  pair('far',(im,a)=>{ctx.globalAlpha=a;const ih=im.naturalHeight,iw=im.naturalWidth;ctx.drawImage(im,0,ih-6,iw,6,FX,FY+FH-2,FW,260);ctx.globalAlpha=1});
  // luz do dia (multiplica) e luzes da noite por cima
  const M=DN.m||[255,255,255];if(M[0]<254||M[1]<254||M[2]<254){ctx.save();ctx.globalCompositeOperation='multiply';ctx.fillStyle=`rgb(${M[0]},${M[1]},${M[2]})`;ctx.fillRect(CAM.x-60,top-260,VW/z+120,H*3);ctx.restore()}
  ctx.save();ctx.globalCompositeOperation='lighter';
  if(n>.05){if(CUP.L[0].win)pair('win',(im,a)=>{ctx.globalAlpha=a*n*.85;ctx.drawImage(im,FX,FY,FW,FH)});
    for(const [u,v] of CUP.lamps){const x=fu(u),y=fv(v),R=90*K*r,g=ctx.createRadialGradient(x,y,0,x,y,R);g.addColorStop(0,`rgba(255,240,200,${.95*n})`);g.addColorStop(.25,`rgba(255,210,140,${.35*n})`);g.addColorStop(1,'rgba(255,190,120,0)');ctx.globalAlpha=1;ctx.fillStyle=g;ctx.fillRect(x-R,y-R,R*2,R*2);
      const gx=x,gy=GY+20*r,g2=ctx.createRadialGradient(gx,gy,0,gx,gy,200*K*r);g2.addColorStop(0,`rgba(255,210,150,${.22*n})`);g2.addColorStop(1,'rgba(255,200,140,0)');ctx.fillStyle=g2;ctx.save();ctx.translate(gx,gy);ctx.scale(1,.3);ctx.translate(-gx,-gy);ctx.fillRect(gx-200*K*r,gy-200*K*r,400*K*r,400*K*r);ctx.restore()}}
  pair('fire',(im,a)=>{ctx.globalAlpha=a*(.35+.25*Math.sin(t*.4)+.1*Math.sin(t*1.3))*(1+.6*n);ctx.drawImage(im,FX,FY-2*Math.sin(t*.3),FW,FH)});
  ctx.restore();
  const FP=CUP.L[lv].fp;if(FP&&FP.length&&G.mode==='fight'&&t%3===0&&G.hitstop<=0){const q=FP[(Math.random()*FP.length)|0];addP({x:fu(q[0]),y:fv(q[1]),vx:rand(-.3,.3),vy:-rand(.6,1.4),life:30,max:30,c:pick(['#ff7a20','#ffb040','#ffd070']),type:'glow',sz:rand(2,4),g:0})}
  // pedaços caindo quando o cenário quebra
  if(DN.deb.length){ctx.save();ctx.fillStyle='#6a625a';for(const d of DN.deb){ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.r);ctx.fillRect(-d.s/2,-d.s/2,d.s,d.s*.7);ctx.restore()}ctx.restore()}}
