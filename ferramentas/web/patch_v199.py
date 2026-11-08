import sys
# v199: buff do Garou — mais rápido, mais dano, mais alcance, golpes encaixam melhor, combo mais fácil de acertar,
#       passiva: a cada 3 golpes recebidos (nas duas formas) ele contra-ataca. Aplica no index e nas fontes (gr.js / patch_gr.py).
F=sys.argv[1:]  # index.html gr.js patch_gr.py
T={f:open(f).read() for f in F}
def rep(a,b):
    n=0
    for f in F:
        c=T[f].count(a)
        if c:assert c==1,(f,a[:60]);T[f]=T[f].replace(a,b);n+=1
    assert n,('nada',a[:70])
# alcance maior + encaixe (mais atordoamento, empurra menos na corrente, passo à frente maior)
rep("const B=(reach,top,bot)=>[-10,-(top||280),reach+10,(top||280)+(bot||0)];","const B=(reach,top,bot)=>[-10,-(top||280),reach+55,(top||280)+(bot||0)];")
for k,a,b in [('qjab',"nrPush:5,su:3,ac:3,rc:6,dmg:40,hb:B(185),kb:2,hs:15,","nrPush:7,su:2,ac:4,rc:5,dmg:46,hb:B(185),kb:1.3,hs:19,"),
              ('qjab2',"nrPush:6,su:3,ac:3,rc:6,dmg:44,hb:B(190),kb:2.2,hs:16,","nrPush:8,su:2,ac:4,rc:5,dmg:50,hb:B(190),kb:1.4,hs:20,"),
              ('qknee',"nrPush:7,su:3,ac:4,rc:7,dmg:48,hb:B(195,280,20),kb:2.4,hs:17,","nrPush:8,su:3,ac:4,rc:6,dmg:55,hb:B(195,280,20),kb:1.5,hs:20,"),
              ('qjab3',"nrPush:6,su:2,ac:3,rc:6,dmg:44,hb:B(195),kb:2.2,hs:16,","nrPush:8,su:2,ac:4,rc:5,dmg:50,hb:B(195),kb:1.4,hs:20,"),
              ('qstr',"nrPush:8,su:4,ac:5,rc:12,dmg:84,hb:B(205,300),kb:9,hs:22,","nrPush:10,su:3,ac:5,rc:11,dmg:96,hb:B(205,300),kb:9,hs:24,"),
              ('qkick',"nrPush:5,su:3,ac:4,rc:8,dmg:52,hb:B(205,260,20),kb:3.5,hs:17,","nrPush:7,su:3,ac:4,rc:7,dmg:58,hb:B(205,260,20),kb:2,hs:20,"),
              ('qhkick',"nrPush:4,su:5,ac:5,rc:11,dmg:76,hb:B(210,320),","nrPush:6,su:4,ac:5,rc:10,dmg:86,hb:B(210,320),"),
              ('qsweep',"su:4,ac:5,rc:12,dmg:58,hb:[-10,-90,240,90]","su:3,ac:5,rc:11,dmg:64,hb:[-10,-90,290,90]")]:
    rep(k+":{"+a,k+":{"+b)
rep("m.hb[2]+=20;","m.hb[2]+=30;")
# velocidade: normal 1.12 -> 1.3, monstro 2.4 -> 2.7; golpes ainda mais acelerados
rep("isGr(f)?2.4:","isGr(f)?2.7:");rep("isGr(f)?1.12:1))","isGr(f)?1.3:1))")
rep("f.gacc=(f.gacc||0)+(f.form?.75:.25);","f.gacc=(f.gacc||0)+(f.form?.9:.4);")
# dano
rep("walk:5.6,power:1.0,frame:'#ff3030',","walk:5.9,power:1.12,frame:'#ff3030',")
# combo: pega de mais longe, por mais tempo, e avança até o rival
rep("if(k===2||k===10)f.x=clamp(f.x+fw*(M?12:8),40,WW-40);",
    "if(k===2||k===10)f.x=clamp(f.x+fw*(M?12:8),40,WW-40);\n    if(!f.grHeld&&k<=6&&o&&!o.ko){const dx=o.x-f.x;if(Math.sign(dx)===fw&&Math.abs(dx)>110)f.x=clamp(f.x+fw*Math.min(Math.abs(dx)-110,M?30:22),40,WW-40)}")
rep("if(!f.grHeld&&k>=1&&k<=4&&o&&!o.ko&&Math.abs(o.x-f.x)<240&&Math.abs(o.y-f.y)<160&&o.inv<=0)",
    "if(!f.grHeld&&k>=1&&k<=7&&o&&!o.ko&&Math.abs(o.x-f.x)<300&&Math.abs(o.y-f.y)<230&&(o.inv<=0||o.state==='blockstun'))")
# Ki (2 socos) com alcance maior
rep("Math.abs(o.x-f.x)<(M?240:215)&&Math.abs(o.y-f.y)<180","Math.abs(o.x-f.x)<(M?290:265)&&Math.abs(o.y-f.y)<200")
# passiva: a cada 3 golpes recebidos contra-ataca (normal e Monstro)
rep("if(isGr(d)&&d.form&&!h.lock&&!d.ko&&!GRK[d.state]&&!['transform','whtS'].includes(d.state)){d.grN=(d.grN||0)+1;if(d.grN>=4){",
    "if(isGr(d)&&!h.lock&&!d.ko&&!GRK[d.state]&&!['transform','whtS'].includes(d.state)){d.grN=(d.grN||0)+1;if(d.grN>=3){")
for f in F:open(f,'w').write(T[f])
print('ok')
