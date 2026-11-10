import sys
# v296: AVISO DE ATUALIZAÇÃO. O montar.sh troca __APPV__ pelo código desta versão e grava www/versao.txt.
# O jogo (site e APK leve) confere o versao.txt a cada 2 min e quando volta para a tela; se mudou, mostra
# "ATUALIZAÇÃO NOVA · toque para atualizar" (salva a conta e recarrega). Fora da luta; na luta espera acabar.
P=sys.argv[1];s=open(P,encoding='utf8').read()
def rep(a,b):
    global s;assert s.count(a)==1,a;s=s.replace(a,b)
rep("</body>","""<style>#updB{position:fixed;left:50%;top:max(8px,env(safe-area-inset-top));transform:translateX(-50%);z-index:99999;padding:10px 22px;border-radius:14px;border:2px solid #fff3c0;background:linear-gradient(#ffd84a,#e08a10);color:#3a1d00;font:900 15px system-ui,sans-serif;box-shadow:0 0 18px #ffb21f;cursor:pointer;animation:updP 1s ease-in-out infinite alternate}@keyframes updP{to{transform:translateX(-50%) scale(1.05)}}</style>
<script>(function(){const V='__APPV__';if(!/^https?:/.test(location.protocol))return;let nv=null;
function show(){if(document.getElementById('updB'))return;try{if(typeof G!=='undefined'&&G.mode==='fight')return}catch(e){}const b=document.createElement('button');b.id='updB';b.textContent='🔄 ATUALIZAÇÃO NOVA! Toque para atualizar';
  b.onclick=()=>{b.textContent='⏳ Atualizando...';try{acSave(1)}catch(e){}setTimeout(()=>location.reload(),900)};document.body.appendChild(b)}
async function chk(){if(document.hidden)return;if(nv){show();return}try{const r=await fetch('versao.txt?t='+Date.now(),{cache:'no-store'});if(!r.ok)return;const t=(await r.text()).trim();if(/^[0-9a-f]{8,40}$/.test(t)&&t!==V){nv=t;show()}}catch(e){}}
setTimeout(chk,20000);setInterval(chk,120000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(chk,1500)})})()</script>
</body>""")
open(P,'w',encoding='utf8').write(s);print('v296 ok')
