#!/usr/bin/env python3
"""v189 — ninguém voa sozinho: só voa quem APERTA o botão de voar (e pode voar). Uso: python3 patch_v189.py <index> (depois do patch_v188)"""
import sys
P=sys.argv[1];s=open(P).read()
def rep(a,b):
    global s
    c=s.count(a);assert c==1,(c,a[:80]);s=s.replace(a,b)
# perseguição depois de lançar (Super Dash): no chão vira SALTO para todo mundo; só persegue voando quem JÁ está voando
rep("  if(noFly(f)||(isLf(f)&&!f.form)){f.state='jump';f.st=0;f.move=null;f.flying=false;","  if(!f.flying||noFly(f)||(isLf(f)&&!f.form)){f.state='jump';f.st=0;f.move=null;f.flying=false;")
# segurar para cima no ar NÃO faz voar mais (só o botão de voar)
rep("        if(I.up){f.upT++;if(f.upT>=11)startFly(f)}else f.upT=0}","        f.upT=0}")
# teletransporte não deixa voando quem estava no chão
rep("if(o.flying&&!noFly(f)&&!(isLf(f)&&!f.form)){f.flying=true;","if(o.flying&&f.flying&&!noFly(f)&&!(isLf(f)&&!f.form)){f.flying=true;")
# CPU não voa (fica no chão e pula)
rep("function startFly(f){if(noFly(f)){","function startFly(f){if(noFly(f)||f.cpu){")
open(P,'w').write(s);print('ok')
