import sys
# v209: poções mais fortes (transformação + DANO + CRÍTICO) e mais caras na loja
P=sys.argv[1];s=open(P).read()
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:80],c);s=s.replace(a,b)
rep("const TWPOR=[{k:'comum',n:'COMUM',c:'#c3c8d2',w:60,v:1},{k:'rara',n:'RARA',c:'#3d9bff',w:30,v:4},{k:'epica',n:'ÉPICA',c:'#b25bff',w:7.5,v:5},{k:'lend',n:'LENDÁRIA',c:'#ffc531',w:2,v:7},{k:'mit',n:'MÍTICA',c:'#ff2e63',w:.5,v:10}];",
r"""const TWPOR=[{k:'comum',n:'COMUM',c:'#c3c8d2',w:60,v:5},{k:'rara',n:'RARA',c:'#3d9bff',w:30,v:7},{k:'epica',n:'ÉPICA',c:'#b25bff',w:7.5,v:10},{k:'lend',n:'LENDÁRIA',c:'#ffc531',w:2,v:15},{k:'mit',n:'MÍTICA',c:'#ff2e63',w:.5,v:20}];
/* efeito da poção por raridade: [transformação %, dano %, crítico %] */
const TWPOE={comum:[5,5,3],rara:[7,7,5],epica:[10,10,10],lend:[15,15,15],mit:[20,20,20]};const twPoE=r=>TWPOE[r]||TWPOE.comum;
const twPoTxt=r=>{const e=twPoE(r);return 'Transformação +'+e[0]+'% · Dano +'+e[1]+'% · Crítico +'+e[2]+'%'};
(function(){try{for(const k of ['tw_poc']){const L=twLS.g(k,[]);let ch=0;for(const x of L){const v=twPoE(x.r)[0];if(x.v!==v){x.v=v;ch=1}}if(ch)twLS.s(k,L)}const o=twLS.g('tw_pocOn',null);if(o&&o.v!==twPoE(o.r)[0]){o.v=twPoE(o.r)[0];twLS.s('tw_pocOn',o)}}catch(e){}})();""")
rep("const TWPOC={k:'poc',n:'POÇÃO',i:'🧪',d:'Transforma mais rápido · uso único (próxima luta)'};","const TWPOC={k:'poc',n:'POÇÃO',i:'🧪',d:'Transformação, dano e crítico · uso único (próxima luta)'};")
rep("const TWSHOP=[100,200,300,500,2000];","const TWSHOP=[400,600,700,1000,3000];")
rep("<b>POÇÃO +${R.v}%</b><span class=\"ds\">Transformação · uso único</span>","<b>POÇÃO ${R.n}</b><span class=\"ds\">⚡ Transf. +${twPoE(R.k)[0]}%<br>⚔️ Dano +${twPoE(R.k)[1]}%<br>💥 Crítico +${twPoE(R.k)[2]}%<br><i>uso único · próxima luta</i></span>")
rep("x.t==='poc'?'Transformação +'+x.v+'% (uso único, próxima luta)'","x.t==='poc'?twPoTxt(x.r)+' (uso único, próxima luta)'")
rep("const pon=twPocOn(),trf=(TW.pas.trf||0)+(pon?pon.v:0)+twEqB('trf');","const pon=twPocOn(),poE=pon?twPoE(pon.r):[0,0,0],trf=(TW.pas.trf||0)+poE[0]+twEqB('trf');")
rep("if(pon){twLS.s('tw_pocOn',null);TW.pocMsg='🧪 POÇÃO +'+pon.v+'% TRANSFORMAÇÃO'}","if(pon){p.tdm+=poE[1]/100;p.tcr=(p.tcr||0)+poE[2];twLS.s('tw_pocOn',null);TW.pocMsg='🧪 POÇÃO: +'+poE[0]+'% TRANSF. +'+poE[1]+'% DANO +'+poE[2]+'% CRÍT.'}")
rep("'🧪 POÇÃO +'+x.v+'% BEBIDA! Vale na próxima luta'","'🧪 POÇÃO '+twRarOf(x.r).n+' BEBIDA! Vale na próxima luta'")
open(P,'w').write(s);print('ok')
