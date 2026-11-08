#!/usr/bin/env python3
"""v191 — Broly: socos novos (folha b1) e Combo do Lendário (folha b2) no botão de combo. Uso: python3 patch_br.py <index> <pasta_build> (depois do patch_v190)"""
import sys,os,shutil
P,D=sys.argv[1],sys.argv[2];s=open(P).read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(c,a[:80]);s=s.replace(a,b)
www=os.path.dirname(os.path.abspath(P))
for f in os.listdir(os.path.join(D,'out')):shutil.copy(os.path.join(D,'out',f),os.path.join(www,'a',f))
js=open(os.path.join(D,'br.js')).read().replace('__BRN__',open(os.path.join(D,'br_new.json')).read())
rep("function drawRg(){",js+"\nfunction drawRg(){")
rep("  if(isZr(f)&&!f.rushKey){const zk=zrKey(f);if(zk)return zk}","  if(isZr(f)&&!f.rushKey){const zk=zrKey(f);if(zk)return zk}\n  if(isBr(f)&&!f.rushKey){const bk=xvKey(f);if(bk)return bk}")
rep("if(f.state==='zrc'){zrcStep(f);return}","if(f.state==='zrc'){zrcStep(f);return}\n  if(f.state==='brc'){brcStep(f);return}")
# botão de combo do Broly: tira o Meteoro Verde e põe o Combo do Lendário (grátis, espera de 3 s depois)
rep("if(bufd(f,'sp')){use(f,'sp');if(brSuper(f,o,2))return true}}","if(bufd(f,'sp')){use(f,'sp');if(!air){brCombo(f,o);return true}}}")
rep("(isRg(f)||isNr(f)||isZr(f)||isMd(f)||isGj(f)||isLf(f))","(isRg(f)||isNr(f)||isZr(f)||isMd(f)||isGj(f)||isLf(f)||isBr(f))",2)
rep("const CMBS={rgc:1,","const CMBS={brc:1,rgc:1,")
open(P,'w').write(s);print('ok')
