import sys
# v202: ninguém pode usar "ADM" no nome; o código ADM vira o jogador "Denilson ADM" com o título; título ADM dá +10% ataque e +10% velocidade (escondido)
P=sys.argv[1];s=open(P).read()
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:80],c);s=s.replace(a,b)
rep("const TWADM='r8iakt';",r"""const TWADM='r8iakt',TWADMN='Denilson ADM';
/* nome proibido: qualquer forma de "ADM" (maiúscula, espaço, ponto, acento, 4DM, @dm...) */
const twBadName=n=>{const t=String(n).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[4@]/g,'a').replace(/[0]/g,'o').replace(/[1!|]/g,'i').replace(/3/g,'e').replace(/[^a-z]/g,'');return t.includes('adm')};
const twIsAdm=()=>twTits().includes('adm');
function twAdmBuff(){if(!twIsAdm()||!G.p)return;const p=G.p[0];if(!p||p.cpu)return;p.tdm=(p.tdm||1)*1.1;p.tsp=(p.tsp||1)*1.1}""")
rep("const twTitTag=k=>k==='adm'?","const twTitTag=(k,nm)=>k==='adm'&&nm!=null&&String(nm).toLowerCase()!==TWADMN.toLowerCase()?'':k==='adm'?")
rep("<span class=\"nm\">${twEsc(e.nome)}${twTitTag(e.tit)}","<span class=\"nm\">${twEsc(e.nome)}${twTitTag(e.tit,e.nome)}")
rep("if(twHash(n.toUpperCase())===TWADM){twGiveTit('adm');twLS.s('tw_titOn','adm');I.value=twLS.g('tw_nome','');E.className='twH ok';E.textContent='👑 Título ADM liberado neste aparelho!';twSfx('powerUp');return}",
    "if(twHash(n.toUpperCase())===TWADM){twGiveTit('adm');twLS.s('tw_titOn','adm');twLS.s('tw_nome',TWADMN);twClaimName(TWADMN);I.value=TWADMN;E.className='twH ok';E.textContent='👑 Bem-vindo, '+TWADMN+'! Título ADM liberado.';twSfx('powerUp');setTimeout(()=>{twModal(null);twRender();cb&&cb()},1200);return}\n    if(twBadName(n)){E.className='twH err';E.textContent='Nome proibido: \"ADM\" não pode ser usado no nome.';I.focus();twSfx('clang');return}")
rep("if(G.gmode==='treino'){G.p[0].sb=6;G.p[0].ki=100}twApply();","if(G.gmode==='treino'){G.p[0].sb=6;G.p[0].ki=100}twApply();twAdmBuff();")
# quem já tinha nome com ADM (sem ser o dono) perde o nome e escolhe outro
rep("twBuild();twRender();twModal(null);showScreen('tower');layoutTw();","if(!twIsAdm()&&twBadName(twLS.g('tw_nome','')))twLS.s('tw_nome','');twBuild();twRender();twModal(null);showScreen('tower');layoutTw();")
open(P,'w').write(s);print('ok')
