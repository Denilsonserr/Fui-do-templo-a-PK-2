
/* ================= v159: CIDADE DAS CÚPULAS — cenário novo do dono: camadas (longe com menos zoom + chão com zoom cheio),
   dia/tarde/noite que passa durante a luta e 3 níveis de destruição (imagens do dono) depois de especiais/ultimates. ================= */
const CUP=__CUP__;const DN={ph:Math.random(),lv:0,from:0,k:1,pts:0,pend:0,ult:0,smk:[],deb:[],night:0,sun:0};
const CUPF0=552,CUPIW=2172,CUPIH=724;
function cupImg(l,k){const L=CUP.L[l];if(!L||!L[k])return null;const c=L['_'+k]||(L['_'+k]=Object.assign(new Image(),{decoding:'async',src:L[k]}));return c.complete&&c.naturalWidth?c:null}
function cupLoad(){const P=[];for(let l=0;l<3;l++)for(const k of ['far','win','stars','skyN','skyS','fire']){if(!CUP.L[l][k])continue;cupImg(l,k);const im=CUP.L[l]['_'+k];P.push(new Promise(r=>{if(im.complete)return r();im.onload=im.onerror=()=>r()}))}return Promise.all(P)}
function cupFree(){for(const L of CUP.L)for(const k of ['far','win','stars','skyN','skyS','fire'])L['_'+k]=null}
/* paleta do dia: 0 manha, .25 meio-dia, .5 por do sol, .66 noite ... .96 madrugada */
const DNK=[[0,[255,214,196],.18,.25],[.1,[255,255,255],0,0],[.42,[255,252,245],0,0],[.5,[255,196,150],.8,.05],[.57,[170,140,175],.45,.5],[.64,[78,92,150],0,1],[.9,[78,92,150],0,1],[.96,[140,125,170],.25,.6],[1,[255,214,196],.18,.25]];
function dnPal(p){for(let i=1;i<DNK.length;i++){const B=DNK[i];if(p<=B[0]){const A=DNK[i-1],u=(p-A[0])/(B[0]-A[0]);return{m:A[1].map((v,j)=>Math.round(v+(B[1][j]-v)*u)),sun:A[2]+(B[2]-A[2])*u,night:A[3]+(B[3]-A[3])*u}}}return{m:[255,255,255],sun:0,night:0}}
const LTD={day:{rim:'#fff4dc',amb:'#6a98d8',aa:.08,bnc:'#e0bc90',ba:.15},sun:{rim:'#ffb070',amb:'#a05a60',aa:.18,bnc:'#ff9a5a',ba:.2},night:{rim:'#a8c4ff',amb:'#18285a',aa:.32,bnc:'#3a5aa0',ba:.12}};
function dnMixLT(){const P=dnPal(DN.ph),n=P.night,s=P.sun,L=LT.cupula;const mix=(a,b,c)=>mixHex(mixHex(a,b,s*(1-n)),c,n);
  L.rim=mix(LTD.day.rim,LTD.sun.rim,LTD.night.rim);L.amb=mix(LTD.day.amb,LTD.sun.amb,LTD.night.amb);L.bnc=mix(LTD.day.bnc,LTD.sun.bnc,LTD.night.bnc);
  L.aa=LTD.day.aa+(LTD.sun.aa-LTD.day.aa)*s*(1-n)+(LTD.night.aa-LTD.day.aa)*n;L.ba=LTD.day.ba+(LTD.sun.ba-LTD.day.ba)*s*(1-n)+(LTD.night.ba-LTD.day.ba)*n;
  STAGE.night=n;STAGE.sunset=s*(1-n);STAGE.lit=.9-.25*n;STAGE.bloom=.35+.25*n;DN.night=n;DN.sun=s;DN.m=P.m}
/* destruição: especiais somam 1, transformação 1, ultimate 3 (aplicado quando o vídeo acaba). Nível 1 com 3 pontos, nível 2 com 7. */
const DNSP={rgc:1,gjc:1,gjc2:1,lfc:1,mdc:1,mdc2:1,rushS:1,comicS:1,super:1,swordRain:1,arkDive:1};
function dnAdd(n){DN.pts+=n;const t=DN.pts>=7?2:DN.pts>=3?1:0;if(t>DN.lv)dnBreak(t)}
function dnBreak(t){DN.from=DN.lv;DN.lv=t;DN.k=0;G.shake=Math.max(G.shake,22);G.flash=Math.max(G.flash,6);G.flashCol='#fff1d8';try{SFX.crater();SFX.boom()}catch(e){}buzz(120);
  banner(t>=2?'CIDADE EM RUÍNAS!':'O CENÁRIO ESTÁ SE DESTRUINDO!','#ffcf7a',80);
  for(let i=0;i<24;i++)DN.deb.push({x:CAM.x+Math.random()*VW/CAM.z,y:-60-Math.random()*300,vy:rand(2,6),vx:rand(-1,1),r:rand(.5,6),s:rand(6,18),l:0});
  for(let i=0;i<18;i++){try{dust(CAM.x+Math.random()*VW/CAM.z,FLOOR,3)}catch(e){}}}
function dnTick(){if(!STAGE.dn)return;if(G.mode==='fight'&&!G.paused&&G.phase!=='intro')DN.ph=(DN.ph+1/(60*120))%1;dnMixLT();
  if(DN.k<1)DN.k=Math.min(1,DN.k+1/50);
  if(G.mode!=='fight')return;
  const ult=!!(G.ws||G.wfs||G.xu||G.sr||G.as);if(ult&&!DN.ult){DN.ult=1;DN.pend+=3}if(!ult&&DN.ult){DN.ult=0;const p=DN.pend;DN.pend=0;dnAdd(p)}
  if(G.trans&&!DN.tr){DN.tr=1;DN.pend+=1}if(!G.trans&&DN.tr){DN.tr=0;if(!DN.ult){const p=DN.pend;DN.pend=0;dnAdd(p)}}
  for(const f of G.p){if(!f)continue;if(DNSP[f.state]&&f._dnS!==f.state)dnAdd(1);f._dnS=f.state}
  for(const d of DN.deb){d.l++;d.vy+=.35;d.y+=d.vy;d.x+=d.vx;d.r+=.1;if(d.y>FLOOR-4&&!d.done){d.done=1;try{dust(d.x,FLOOR,1)}catch(e){}}}DN.deb=DN.deb.filter(d=>!d.done&&d.l<200);
  // fumaça subindo dos pontos do cenário destruído
  const SP=DN.lv>=2?[[450,300],[1700,150],[1250,380],[640,420],[1520,360]]:DN.lv>=1?[[500,330],[820,330],[1880,280]]:[];
  if(SP.length&&G.frame%7===0){const q=SP[(Math.random()*SP.length)|0];DN.smk.push({u:q[0]+rand(-14,14),v:q[1],vu:rand(-.2,.6),vv:-rand(.5,.9),s:rand(30,55),l:0,m:rand(160,240)})}
  for(const p of DN.smk){p.l++;p.u+=p.vu;p.v+=p.vv;p.s+=.35}DN.smk=DN.smk.filter(p=>p.l<p.m)}
const DNPUF=(()=>{const c=document.createElement('canvas');c.width=c.height=96;const g=c.getContext('2d');for(let i=0;i<9;i++){const x=30+Math.random()*36,y=30+Math.random()*36,r=16+Math.random()*20,gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(40,38,44,.55)');gr.addColorStop(1,'rgba(40,38,44,0)');g.fillStyle=gr;g.fillRect(0,0,96,96)}return c})();
function drawDN(S){const K=S.dw/CUPIW,X0=-(S.dw-S.ww)/2,dy=S.dy,z=CAM.z,zf=.9,r=zf/z,cxf=WW/2+(CAM.cx-WW/2)*.8;
  // cenario inteiro com MENOS zoom (zf) que os lutadores, preso na linha dos pes (FLOOR) e com paralaxe
  const FX=CAM.cx+(X0-cxf)*r,FY=FLOOR+(dy-FLOOR)*r,FW=S.dw*r,FH=S.dh*r,fu=u=>FX+u*K*r,fv=v=>FY+v*K*r,GY=FY+CUPF0*K*r;
  const top=H-H/z-60;if(FY>top){ctx.fillStyle=CUP.top;ctx.fillRect(CAM.x-50,top-200,VW/z+100,FY-top+204)}
  const lv=DN.lv,k=DN.k,A=DN.from;
  const pair=(key,fn)=>{if(k<1){const a=cupImg(A,key);if(a)fn(a,1)}const b=cupImg(lv,key);if(b)fn(b,k<1?k:1)};
  pair('far',(im,a)=>{ctx.globalAlpha=a;ctx.drawImage(im,FX,FY,FW,FH);ctx.globalAlpha=1});
  const n=DN.night,sn=DN.sun*(1-n),t=G.frame;
  if(sn>.01)pair('skyS',(im,a)=>{ctx.globalAlpha=a*sn*.6;ctx.drawImage(im,FX,FY,FW,FH);ctx.globalAlpha=1});
  if(n>.01){pair('skyN',(im,a)=>{ctx.globalAlpha=a*n*.88;ctx.drawImage(im,FX,FY,FW,FH);ctx.globalAlpha=1});
    ctx.save();ctx.globalCompositeOperation='lighter';pair('stars',(im,a)=>{ctx.globalAlpha=a*n*(.75+.25*Math.sin(t*.05));ctx.drawImage(im,FX,FY,FW,FH)});
    const mx=fu(1720),my=fv(110),mr=26*K*r,g=ctx.createRadialGradient(mx,my,mr*.2,mx,my,mr*5);g.addColorStop(0,`rgba(235,240,255,${.9*n})`);g.addColorStop(.2,`rgba(200,215,255,${.35*n})`);g.addColorStop(1,'rgba(150,170,255,0)');ctx.fillStyle=g;ctx.fillRect(mx-mr*5,my-mr*5,mr*10,mr*10);ctx.restore()}
  // fumaça (atrás do chão)
  if(DN.smk.length){ctx.save();for(const p of DN.smk){const a=Math.min(1,p.l/25,(p.m-p.l)/60);ctx.globalAlpha=a*.85;const s=p.s*K*r;ctx.drawImage(DNPUF,fu(p.u)-s/2,fv(p.v)-s/2,s,s)}ctx.restore()}
  // chão: zoom cheio (os lutadores pisam aqui)
  pair('far',(im,a)=>{ctx.globalAlpha=a;const ih=im.naturalHeight,iw=im.naturalWidth;ctx.drawImage(im,0,ih-6,iw,6,FX,FY+FH-2,FW,260);ctx.globalAlpha=1});
  // luz do dia (multiplica) e luzes da noite por cima
  const M=DN.m||[255,255,255];if(M[0]<254||M[1]<254||M[2]<254){ctx.save();ctx.globalCompositeOperation='multiply';ctx.fillStyle=`rgb(${M[0]},${M[1]},${M[2]})`;ctx.fillRect(CAM.x-60,top-260,VW/z+120,H*3);ctx.restore()}
  ctx.save();ctx.globalCompositeOperation='lighter';
  if(n>.05){pair('win',(im,a)=>{ctx.globalAlpha=a*n*.85;ctx.drawImage(im,FX,FY,FW,FH)});
    for(const [u,v] of [[442,370],[1794,370]]){const x=fu(u),y=fv(v),R=90*K*r,g=ctx.createRadialGradient(x,y,0,x,y,R);g.addColorStop(0,`rgba(255,240,200,${.95*n})`);g.addColorStop(.25,`rgba(255,210,140,${.35*n})`);g.addColorStop(1,'rgba(255,190,120,0)');ctx.globalAlpha=1;ctx.fillStyle=g;ctx.fillRect(x-R,y-R,R*2,R*2);
      const gx=x,gy=GY+20*r,g2=ctx.createRadialGradient(gx,gy,0,gx,gy,200*K*r);g2.addColorStop(0,`rgba(255,210,150,${.22*n})`);g2.addColorStop(1,'rgba(255,200,140,0)');ctx.fillStyle=g2;ctx.save();ctx.translate(gx,gy);ctx.scale(1,.3);ctx.translate(-gx,-gy);ctx.fillRect(gx-200*K*r,gy-200*K*r,400*K*r,400*K*r);ctx.restore()}}
  pair('fire',(im,a)=>{ctx.globalAlpha=a*(.35+.25*Math.sin(t*.4)+.1*Math.sin(t*1.3))*(1+.6*n);ctx.drawImage(im,FX,FY-2*Math.sin(t*.3),FW,FH)});
  ctx.restore();
  const FP=CUP.L[lv].fp;if(FP&&FP.length&&G.mode==='fight'&&t%3===0&&G.hitstop<=0){const q=FP[(Math.random()*FP.length)|0];addP({x:fu(q[0]),y:fv(q[1]),vx:rand(-.3,.3),vy:-rand(.6,1.4),life:30,max:30,c:pick(['#ff7a20','#ffb040','#ffd070']),type:'glow',sz:rand(2,4),g:0})}
  // pedaços caindo quando o cenário quebra
  if(DN.deb.length){ctx.save();ctx.fillStyle='#6a625a';for(const d of DN.deb){ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.r);ctx.fillRect(-d.s/2,-d.s/2,d.s,d.s*.7);ctx.restore()}ctx.restore()}}
