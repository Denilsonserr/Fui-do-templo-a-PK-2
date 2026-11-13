import sys,json,os
# v394: SHAKA — FORMA DIVINA (sid skv). Sprites: ferramentas/personagens/shaka/divina/build/skv.json (build_skv.py). Lógica no rk.js ("v394").
# Aqui só o que é const/dentro de funções grandes: escolha do sprite (ssid), quais sprites carregar (sidsOf), velocidade, vídeos da transformação e da ultimate.
P=sys.argv[1];s=open(P,encoding='utf8').read()
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','personagens','shaka','divina','build')
J=json.load(open(os.path.join(D,'skv.json')))
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:90],c);s=s.replace(a,b)
rep('const SKV={"f":','SPRH.skv=%s;\n(function(){const S=SPRH.skv;Object.assign(S,{jump:S.jumpv,combo:S.jab,sp:S.ki1,trans:S.pw,fly:S.jumpd,up:S.upper,dash:S.dashf,low:S.sweep,throw:S.palm,kunai:S.palm,fire:S.ki1})})();\nconst SKV={"f":'%json.dumps(J['skv'],separators=(',',':')))
rep("HAIR.sk=1.25;HAIR.skd=1.25;HAND.sk={};HAND.skd={};","HAIR.sk=1.25;HAIR.skd=1.25;HAIR.skv=1.25;HAND.sk={};HAND.skd={};HAND.skv={};FR.skv=FR.sk;")
rep("RUSHK.skd=RUSHK.sk;","RUSHK.skd=RUSHK.sk;RUSHK.skv=RUSHK.sk;")
rep("const ssid=f=>f.def.sid==='sk'?(f.form?'skd':'sk')","const ssid=f=>f.def.sid==='sk'?(f.skDiv?'skv':f.form?'skd':'sk')")
rep("s==='sk'?['sk','skd']:","s==='sk'?(skDivLd()?['sk','skd','skv']:['sk','skd']):")
rep("isSk(f)?1.82:","isSk(f)?(f.skDiv?3.3:1.82):")
rep("if(isSk(f))return updSKT(T,f,t);","if(isSk(f))return T.skv?updSKDV(T,f,t):updSKT(T,f,t);")
rep("  if(G.trans&&isSk(G.trans.f)&&G.trans.t<SKVE){","  if(G.trans&&G.trans.skv&&G.trans.t<SKDVE){gkFull(SKDVF,SKDV.length,Math.floor(G.trans.t/SKDVD),Math.min(1,G.trans.t/6,(SKDVE-G.trans.t)/6+.25));if(G.mode==='fight')drawHUD();return}\n  if(G.trans&&isSk(G.trans.f)&&!G.trans.skv&&G.trans.t<SKVE){")
rep("{gkFull(SKUF,SKU.f.length,Math.floor((G.ws.vt||0)*12),1);","{if(G.ws.skv)gkFull(SKDUF,SKDU.length,Math.floor((G.ws.vt||0)*12),1);else gkFull(SKUF,SKU.f.length,Math.floor((G.ws.vt||0)*12),1);")
rep("function updSKU(){const R=G.ws,a=R.a,d=R.d,FL=SKU.f.length;","function updSKU(){const R=G.ws,a=R.a,d=R.d,FL=R.skv?SKDU.length:SKU.f.length;")
rep("[...Object.keys(STG).filter(k=>!STG[k].hid),'auto'].forEach((k,n)=>{","[...Object.keys(STG).filter(k=>!STG[k].hid||STG[k].sel),'auto'].forEach((k,n)=>{")   # v397: Templo de Virgem na escolha
rep('<img src="${STH[k]}" alt="" decoding="async" loading="lazy">','<img src="${STH[k]||STG[k].thumb}" alt="" decoding="async" loading="lazy">')
open(P,'w',encoding='utf8').write(s);print('v394 forma divina ok')
