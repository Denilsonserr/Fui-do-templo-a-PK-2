# Troca o motor do cenário (v159) pelo genérico (dn2.js) e adiciona o Planeta Namekusei. Rodar sobre o index da v161.
import json
P='/home/claude/fui-do-templo-a-pk-2/www/index.html';s=open(P).read()
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:70],c);s=s.replace(a,b)
cup=json.load(open('/home/claude/cup/cup.json'));nam=json.load(open('/home/claude/namek/nam.json'));lc=json.load(open('/home/claude/cup/life_c.json'));ln=json.load(open('/home/claude/namek/life_n.json'));mar=json.load(open('/home/claude/mar/mar.json'))
DNS={'cupula':{'top':cup['top'],'L':cup['L'],'feet':552,'thr':[0,9,24],'ug':[0,0,2],'life':lc,'day':360,'moon':[1720,110],'lamps':[[442,370],[1794,370]],
   'smk':[[],[[500,330],[820,330],[1880,280]],[[450,300],[1700,150],[1250,380],[640,420],[1520,360]]],'names':['','O CENÁRIO ESTÁ SE DESTRUINDO!','CIDADE EM RUÍNAS!']},
 'namek':{'top':nam['top'],'L':nam['L'],'feet':560,'thr':[0,6,15,26,40],'ug':[0,0,0,1,2],'life':ln,'day':360,'moon':[435,95],'lamps':[],
   'smk':[[],[],[[1990,300],[1400,400]],[[370,290],[880,320],[1400,340],[1650,300],[1990,220]],[[350,230],[700,300],[870,330],[1400,290],[1700,280],[1950,200],[260,360]]],
   'names':['','O PLANETA ESTÁ TREMENDO!','CRATERAS POR TODO LADO!','O PLANETA ESTÁ DESMORONANDO!','NAMEKUSEI EM RUÍNAS!']},
 'gelo':{'top':mar['top'],'L':mar['L'],'feet':600,'thr':[0,6,15,26,40],'ug':[0,0,0,1,2],'day':360,'moon':[1700,90],'lamps':[],'snow':1,'life':[{'trees':None,'tr':[],'wp':[]} for _ in mar['L']],
   'smk':[[],[[1300,520],[650,520]],[[1320,150],[1680,200],[1880,380],[700,280]],[[840,150],[1250,90],[1680,180],[2000,250],[560,380]],[[620,80],[1150,80],[1700,90],[900,250],[1400,200],[300,350]]],
   'names':['','A FORTALEZA ESTÁ RACHANDO!','AS MURALHAS CAÍRAM!','A FORTALEZA ESTÁ EM CHAMAS!','FORTALEZA EM RUÍNAS!']}}
a=s.find('/* ================= v159: CIDADE DAS CÚPULAS');b=s.find('\nfunction drawStageLayers(){const S=STAGE;if(S.dn)return drawDN(S);')
assert a>0 and b>a
s=s[:a]+open('/home/claude/namek/dn2.js').read().strip().replace('__DNS__',json.dumps(DNS,separators=(',',':')))+s[b:]
K=2606/2172
rep("nw:1,dn:1,camMax:1.15,camMin:.9}","nw:1,dn:1,camMax:1.15,camMin:.9},\n  namek:{lit:.9,bloom:.35,dust:'#d8b46a',peb:'#8a6a3a',name:'PLANETA NAMEKUSEI',src:'%s',ww:2400,dw:2606,dh:%d,dy:%d,refl:.04,w:['clear','clear','clear','gale'],nw:1,dn:1,camMax:1.15,camMin:.9},\n  gelo:{lit:.9,bloom:.4,dust:'#dceeff',peb:'#8aa8d0',name:'FORTALEZA DE GELO',src:'%s',ww:2400,dw:2606,dh:%d,dy:%d,refl:.3,w:['snow','snow','clear'],nw:1,dn:1,camMax:1.15,camMin:.9}"%(nam['L'][0]['far'],round(724*K),round(486-612*K),mar['L'][0]['far'],round(724*K),round(486-610*K)))
rep("  cupula:{rim:'#fff4dc',","  gelo:{rim:'#e6f4ff',lx:-.3,ly:-.9,amb:'#4a7ac8',aa:.16,bnc:'#bfe0ff',ba:.18,pt:'glint',mote:'#e6f4ff'},\n  namek:{rim:'#f6ffd8',lx:-.6,ly:-.8,amb:'#4a9a52',aa:.09,bnc:'#d8b46a',ba:.15,pt:'dust',mote:'#efffd0'},\n  cupula:{rim:'#fff4dc',")
rep('{"cupula": "','{"namek": "%s", "gelo": "%s", "cupula": "'%(nam['thumb'],mar['thumb']))
rep("if(S.dn){S.img=new Image();S.img.src=S.src0;return S._ld=cupLoad()}","if(S.dn){S.img=new Image();S.img.src=S.src0;return S._ld=cupLoad(k)}")
rep("if(S.dn)cupFree();","if(S.dn)cupFree(k);")
rep("if(STAGE.dn){DN.lv=0;DN.from=0;DN.k=1;DN.pts=0;DN.pend=0;DN.smk=[];DN.deb=[];DN.ult=0;DN.tr=0}",
    "if(STAGE.dn&&(G.round===1||DN.key!==STAGE.key)){dnSet(STAGE.key);DN.key=STAGE.key;DN.ph=.955;DN.lv=0;DN.from=0;DN.k=1;DN.pts=0;DN.pend=0;DN.smk=[];DN.deb=[];DN.ult=0;DN.tr=0;DN.ults=0}")
# golpe pesado recebido = +1 de destruição
rep("  if(isRg(a)&&a.form&&d.hp>0)rgBurn(a,d);","  if(isRg(a)&&a.form&&d.hp>0)rgBurn(a,d);\n  if(STAGE.dn&&!h.lock&&(h.heavy||h.launch||h.launcher||h.smash))dnAdd(.5);")
open(P,'w').write(s);print('ok')
