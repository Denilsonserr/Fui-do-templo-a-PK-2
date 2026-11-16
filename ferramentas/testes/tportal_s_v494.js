// v494: evento — rank S garantido a cada 30 min (mede em 6 h) e 2x sorte do Igris
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore|workers\.dev\/fs/,r=>r.abort());
await p.goto(process.env.URL||'http://localhost:8790/');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
const r=await p.evaluate(()=>{const t0=Date.UTC(2026,10,16,12,0),out=[];let last=-1,maxGap=0,lastS=null;for(let t=t0;t<t0+6*36e5;t+=6e4){const N=__pt.now(t);if(N.st!=='aberto'||N.i===last)continue;last=N.i;const S=N.L.some(x=>x.r===5);if(S){if(lastS!=null)maxGap=Math.max(maxGap,(N.ini-lastS)/6e4);lastS=N.ini;out.push(new Date(N.ini-3*36e5).toISOString().slice(11,16))}}
  const off=(()=>{let n=0,c=0,l=-1;const t1=Date.UTC(2026,10,18,12);for(let t=t1;t<t1+6*36e5;t+=6e4){const N=__pt.now(t);if(N.st!=='aberto'||N.i===l)continue;l=N.i;c++;if(N.L.some(x=>x.r===5))n++}return n+'/'+c})();
  return {sAbre:out,maxGapMin:Math.round(maxGap),foraDoEvento:off}});
console.log(JSON.stringify(r),errs.slice(0,3));await b.close()})();
