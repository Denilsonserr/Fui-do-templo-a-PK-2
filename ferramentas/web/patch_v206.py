import sys
# v206: CÓDIGOS de uso único (digitados no ✏️ NOME). O 1º a usar cria o documento torre/cupom_<hash> no Firestore; depois disso o código não vale para mais ninguém.
P=sys.argv[1];s=open(P).read()
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:80],c);s=s.replace(a,b)
rep("function twAdmBuff(){",r"""const TWCUP={'1polqg8':{nm:'TODOS OS EQUIPAMENTOS MÍTICOS',it:[{t:'esp',r:'mit',v:10},{t:'arm',r:'mit',v:10},{t:'bot',r:'mit',v:10}],eq:1}};
async function twCupom(code,E){const h=twHash(code.toUpperCase()),C=TWCUP[h];if(!C)return false;const used=twLS.g('tw_cup',{});
  if(used[h]){E.className='twH err';E.textContent='Você já usou esse código.';return true}
  E.className='twH';E.textContent='Conferindo o código...';const IV=v=>({integerValue:String(v)});
  const f={nome:{stringValue:String(twLS.g('tw_nome','')||'?').slice(0,16)},andar:IV(0),tempo:IV(0),uid:{stringValue:twUid()},cupom:{stringValue:h},v:IV(206)};
  let r;try{r=await twFetchT(TWURL+'/torre?documentId=cupom_'+h+'&key='+TWFB.apiKey,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:f})})}catch(e){E.className='twH err';E.textContent='Precisa de internet para usar o código.';return true}
  if(!r.ok){E.className='twH err';E.textContent=r.status===409||r.status===403?'❌ Esse código já foi usado por outro jogador.':'Erro ao conferir o código ('+r.status+'). Tente de novo.';twSfx('clang');return true}
  used[h]=1;twLS.s('tw_cup',used);const I=twInv(),Q=twEqp();
  for(const x of C.it){const it={id:'cp'+h+x.t,t:x.t,r:x.r,v:x.v};if(!I.some(y=>y.id===it.id))I.push(it);if(C.eq)Q[x.t]=it.id}twLS.s('tw_inv',I);twLS.s('tw_eqp',Q);
  E.className='twH ok';E.textContent='🎁 Código aceito! Você ganhou: '+C.nm+' (já equipados).';twSfx('powerUp');setTimeout(()=>twSfx('boom'),300);return true}
function twAdmBuff(){""")
rep("    if(twBadName(n)){","    if(await twCupom(n,E)){I.value=twLS.g('tw_nome','');return}\n    if(twBadName(n)){")
open(P,'w').write(s);print('ok')
