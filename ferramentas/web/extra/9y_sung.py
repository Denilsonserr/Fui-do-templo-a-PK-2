import json,sys,os
# v421: SUNG (sid sj, id sung) — ETAPA 1, só no MODO TESTE do ADM (não entra em nenhuma lista de escolha dos jogadores).
# Sprites: ferramentas/personagens/sung/ (seg_sj.py -> work/cut, build_sung.py ai -> build/sj_ai.json, imgs_sung.py -> build/imgs.json).
# Lógica: reaproveita a do espadachim YUTA (yt.js): isYt também vale para sj; sem Rika (só aparece na forma), sem transformação e sem ultimate por enquanto.
P=sys.argv[1];s=open(P,encoding='utf8').read()
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','personagens','sung','build')
_f=os.path.join(D,'sj_ai.json');J=json.load(open(_f if os.path.exists(_f) else os.path.join(D,'sj_fast.json')));IM=json.load(open(os.path.join(D,'imgs.json')))
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:90],c);s=s.replace(a,b)
cj=lambda o:json.dumps(o,separators=(',',':'))
rep("const isYt=f=>!!f&&f.def.sid==='yt';","const isYt=f=>!!f&&(f.def.sid==='yt'||f.def.sid==='sj');")
rep("const ssid=f=>f.def.sid==='sk'?","const ssid=f=>f.def.sid==='sj'?'sj':f.def.sid==='sk'?")
rep("s==='yt'?['yt','ytd']:","s==='yt'?['yt','ytd']:s==='sj'?['sj']:")
rep("loadImg('yuta','","loadImg('sung','%s');loadImg('yuta','"%IM['port'])
rep("  yuta:{sid:'yt',id:'yuta',","  sung:{sid:'sj',id:'sung',name:'SUNG',cn:'O MONARCA DAS SOMBRAS',energy:'#4a8cff',energy2:'#dbe9ff',fe:'#6a3cff',fe2:'#e4dcff',walk:6.0,power:1.16,frame:'#4a6cff',\n    hx:92,hy:180,bx:110,by:156,blade:'ki',beamName:'',beamNameF:'',rushName:'DANÇA DAS SOMBRAS',formName:'MONARCA',formSub:'EM BREVE'},\n  yuta:{sid:'yt',id:'yuta',")
rep('const PTH={','const PTH={"sung": "%s",'%IM['pth'])
rep("const FULLIMG={","const FULLIMG={sung:'%s',"%IM['full'])
rep("function ytSuper(f,o){","function ytSuper(f,o){if(f.def.sid==='sj'){if(!f.cpu)say(f,'ULTIMATE DO SUNG: EM BREVE');return false}")
rep("function startTransform(f){","function startTransform(f){if(f.def.sid==='sj'){if(!f.cpu)say(f,'TRANSFORMAÇÃO DO SUNG: EM BREVE');return false}")
rep("M?'Yuta & Rika!':'Dança da Espada!'","M?'Yuta & Rika!':f.def.sid==='sj'?'Dança das Sombras!':'Dança da Espada!'")
rep("SPRH.yt=","SPRH.sj=%s;SPRH.yt="%cj(J['sj']))
rep("(function(){for(const sid of ['yt','ytd']){","(function(){for(const sid of ['sj','yt','ytd']){")
rep("const ROS={","const ROS={sung:{c:'#4a6cff',d:'Espadachim das sombras (EM TESTE). Soco = cadeia de espadadas azuis, chute = chutes e rasteira; todo golpe que acerta pode ser cancelado no próximo. Ki = Corte Relâmpago. Combo = Dança das Sombras.'},")
rep("RUSHK.ytd=RUSHK.yt;","RUSHK.ytd=RUSHK.yt;HAIR.sj=1.2;HAND.sj={};RUSHK.sj=RUSHK.yt;")
rep("f.def.sid==='yt'||f.def.sid==='sk');","f.def.sid==='yt'||f.def.sid==='sj'||f.def.sid==='sk');")
rep("sid==='yt'||sid==='ytd'||sid==='sk'||","sid==='yt'||sid==='ytd'||sid==='sj'||sid==='sk'||")
# v424: parado do Sung troca de pose de vez em quando: ~7 s espada no ombro (idle) e ~4 s espada fincada no chão com o casaco ao vento (idle2)
rep("case 'idle':{if((f.form||isGg(f)","case 'idle':{if(f.def.sid==='sj'&&SPRH.sj.idle2&&G.phase==='fight'){const T=(G.frame+(f.cpu?300:0))%660;if(T>=420){const q=[0,1,2,3,4,3,2,1];return['idle2',q[Math.floor(G.frame/9)%8]]}}if((f.form||isGg(f)")
open(P,'w',encoding='utf8').write(s);print('sung ok',len(s))
