import json
P='/home/claude/fui-do-templo-a-pk-2/www/index.html';s=open(P).read()
R=json.load(open('/home/claude/hud/hud.json'))
def rep(a,b,n=1):
    global s;c=s.count(a);assert c==n,(a[:70],c);s=s.replace(a,b)
blk=open('/home/claude/hud/hud.js').read().replace('__HUDA__',json.dumps(R,separators=(',',':')))
rep("\nfunction drawHUD(){","\n"+blk+"\nfunction drawHUD(){")
rep("    // frame\n    Q([[xa-10,","    if(!hudArtDraw(f,side,sf)){\n    // frame\n    Q([[xa-10,")
rep("    // combo\n    if(f.combo>=2&&f.comboT>0){","    }\n    // combo\n    if(f.combo>=2&&f.comboT>0){")
rep("  // timer\n  const ty=50,","  // timer\n  if(!hudArtTimer(cx)){const ty=50,")
rep("ctx.fillText('ROUND '+G.round,cx,ty+th+12);\n}","ctx.fillText('ROUND '+G.round,cx,ty+th+12);}\n}")
rep("render();drawBtnFx();requestAnimationFrame(loop)}","render();btnSkin();drawBtnFx();requestAnimationFrame(loop)}")
rep("function fxTheme(f){if(isNr(f))return{c:'#ffb020',c2:'#fff2b0',k:'firebolt'};","function fxTheme(f){if(HUTH[f.def.id]&&HUDA[f.def.id])return Object.assign({k:'firebolt'},HUTH[f.def.id]);if(isNr(f))return{c:'#ffb020',c2:'#fff2b0',k:'firebolt'};")
rep("BFX.list=[...document.querySelectorAll('#controls .b'),$('joyBase')].filter(b=>b&&!b.hidden&&b.id!=='bSw').map(b=>{const r=b.getBoundingClientRect();return{x:",
    "BFX.list=[...document.querySelectorAll('#controls .b'),$('joyBase')].filter(b=>b&&!b.hidden&&b.id!=='bSw').map(b=>{const r=b.getBoundingClientRect();return{id:b.id,x:")
rep("if(t%4===0||!BFX.bolts.length){BFX.bolts=[];for(const b of BFX.list){if(Math.random()<.7)BFX.bolts.push(boltArc(b.x,b.y,b.r*1.05,Math.random()*TAU,.7+Math.random()*1.1,8,.28))}}for(const P of BFX.bolts)jag(g,P,'#3fa8ff','#e8f6ff',1.5)}",
    "if(t%4===0||!BFX.bolts.length){BFX.bolts=[];for(const b of BFX.list){if(T.sr&&b.id!=='bSr')continue;const nb=T.sr?3+(Math.random()*2|0):(Math.random()<.7?1:0);for(let q=0;q<nb;q++){BFX.bolts.push(boltArc(b.x,b.y,b.r*(1.02+Math.random()*.12),Math.random()*TAU,.7+Math.random()*1.3,9,.32));if(T.sr&&Math.random()<.6){const a=Math.random()*TAU,x0=b.x+Math.cos(a)*b.r,y0=b.y+Math.sin(a)*b.r,L=b.r*(.5+Math.random()*.8);BFX.bolts.push(boltLine(x0,y0,x0+Math.cos(a)*L,y0+Math.sin(a)*L,6,b.r*.3))}}}}for(const P of BFX.bolts)jag(g,P,T.bc||'#3fa8ff',T.bc2||'#e8f6ff',T.sr?2:1.5)}")
css="""
#controls.cus .b,#controls.cus #joyBase{background:var(--img) center/100% no-repeat!important;filter:none!important}
#controls.cus .b::before,#controls.cus .b::after{display:none!important}
#controls.cus #joyKnob{background:var(--kimg) center/100% no-repeat!important;border:0!important;box-shadow:0 0 10px rgba(0,0,0,.4)!important}
#controls.cusfl .b,#controls.cusfl #joyBase{animation:cusfl .4s ease-out}
@keyframes cusfl{0%{filter:brightness(3) saturate(0)}100%{filter:none}}
</style>"""
i=s.find('</style>');s=s[:i]+css+s[i+len('</style>'):]
open(P,'w').write(s);print('ok')
