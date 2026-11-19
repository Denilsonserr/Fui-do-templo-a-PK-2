// v560: RANK GERAL (XP) — 1 por jogador, último doc que TEM rp (docs de dano/torre sem rp não atrapalham)
(async()=>{const W='http://localhost:8790/fs/v1/projects/furia-do-templo/databases/(default)/documents';let ok=1;const chk=(c,m)=>{console.log((c?'OK  ':'FALHA ')+m);if(!c)ok=0};
  const post=async(id,f)=>{const F={};for(const k in f)F[k]=typeof f[k]==='number'?{integerValue:String(f[k])}:{stringValue:f[k]};await fetch(W+'/torre?documentId='+id,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:F})})};
  for(let i=0;i<200;i++)await post('rkx_br_'+i,{rk:'1',nome:'BrenoX',uid:'b',rp:1000000+i});for(let i=0;i<200;i++)await post('rkx_ho_'+i,{rk:'1',nome:'HonX',uid:'h',rp:900000+i});
  await post('rkx_vi_1',{rk:'1',nome:'ViniX',uid:'v',rp:500000});await post('rkx_vi_2',{rk:'1',nome:'ViniX',uid:'v',rp:526000});await post('rkx_vi_3',{rk:'1',nome:'ViniX',uid:'v',dmg:999});
  const q={structuredQuery:{from:[{collectionId:'torre'}],where:{fieldFilter:{field:{fieldPath:'rk'},op:'EQUAL',value:{stringValue:'1'}}},orderBy:[{field:{fieldPath:'rp'},direction:'DESCENDING'}],limit:300,latestBy:'nome'}};
  const j=await (await fetch(W+':runQuery',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(q)})).json();
  const L=j.filter(x=>x.document).map(x=>x.document.fields.nome.stringValue+':'+(x.document.fields.rp||{}).integerValue);console.log(L.join(', '));
  chk(L.includes('ViniX:526000')&&L.includes('BrenoX:1000199')&&L.filter(x=>x.startsWith('BrenoX')).length===1,'XP: 1 por jogador, último com XP (Vini aparece)');console.log(ok?'TUDO OK':'FALHOU')})();
