// v296: aviso de atualização (precisa de servidor local na pasta www: python3 -m http.server 8765)
const {chromium}=require('playwright');const fs=require('fs');const VF='/home/claude/fui-do-templo-a-pk-2/www/versao.txt';const orig=fs.readFileSync(VF,'utf8');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:915,height:412}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\.g|firestore/,r=>r.abort());
await p.goto('http://localhost:8765/index.html');await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});
await p.waitForTimeout(21000);const igual=await p.$('#updB');fs.writeFileSync(VF,'aaaaaaaaaaaa\n');
await p.evaluate(()=>{Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'));Object.defineProperty(document,'hidden',{value:false,configurable:true});document.dispatchEvent(new Event('visibilitychange'))});await p.waitForTimeout(3000);
const nova=await p.$eval('#updB',e=>e.textContent).catch(()=>null);await p.screenshot({path:'shots/u96.png'});fs.writeFileSync(VF,orig);
await p.click('#updB',{force:true});await p.waitForTimeout(2500);await p.waitForFunction(()=>!document.getElementById('goSelect').disabled,null,{timeout:120000});const depois=await p.$('#updB');
console.log({semAviso:!igual,aviso:nova,recarregou:!depois},'erros',errs);await b.close()})();
