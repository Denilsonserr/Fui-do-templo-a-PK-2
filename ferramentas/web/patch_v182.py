#!/usr/bin/env python3
"""v182 — botão de COMBO com espera de 3 s depois de usar (todos os combos prontos). Uso: python3 patch_v182.py <index> (depois do patch_zr)"""
import sys
P=sys.argv[1];s=open(P).read()
def rep(a,b):
    global s
    c=s.count(a);assert c==1,(c,a[:80]);s=s.replace(a,b)
rep("function tryCommon(f,o,hf,hb,air){\n","function tryCommon(f,o,hf,hb,air){\n  if(bufd(f,'sp')&&(f.spCD||0)>G.frame&&(isRg(f)||isNr(f)||isZr(f)||isMd(f)||isGj(f)||isLf(f))&&!(isZr(f)&&!f.form&&f.inp.down)){use(f,'sp');if(!f.cpu)say(f,'COMBO EM '+Math.ceil((f.spCD-G.frame)/60)+'s');return false}\n")
rep("function updFighter(f,o){\n","""const CMBS={rgc:1,nrc:1,zrc:1,mdc:1,mdc2:1,gjc:1,gjc2:1,lfc:1};
function cmbCD(f){if(CMBS[f.state])f.inCmb=1;else if(f.inCmb){f.inCmb=0;f.spCD=G.frame+180}
  if(!f.cpu&&G.p&&f===G.p[0]){const b=$('bSp');if(b){const r=Math.max(0,(f.spCD||0)-G.frame),on=r>0&&(isRg(f)||isNr(f)||isZr(f)||isMd(f)||isGj(f)||isLf(f));b.classList.toggle('cd',on);const v=on?String(Math.ceil(r/60)):'';if(b.dataset.cd!==v){b.dataset.cd=v;let q=b.querySelector('.cdn');if(!q){q=document.createElement('i');q.className='cdn';b.appendChild(q)}q.textContent=v}}}}
function updFighter(f,o){cmbCD(f);
""")
rep("</style>\n\n<svg","#controls #bSp.cd{filter:grayscale(.9) brightness(.5)!important}#bSp .cdn{position:absolute;inset:0;display:grid;place-items:center;font:900 28px var(--f-display,sans-serif);font-style:normal;color:#fff;text-shadow:0 0 6px #000,0 0 10px #000;pointer-events:none;z-index:5}#bSp:not(.cd) .cdn{display:none}\n</style>\n\n<svg")
open(P,'w').write(s);print('ok')
