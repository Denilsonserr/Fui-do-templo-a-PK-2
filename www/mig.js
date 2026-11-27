/* v663: ENDEREÇO NOVO furiadotemplo.com.br — leva o progresso do endereço antigo (workers.dev) para o novo.
   Roda no <head>, ANTES do jogo, em todas as aberturas.
   - www.furiadotemplo.com.br → furiadotemplo.com.br (o progresso fica num endereço só)
   - endereço novo com #mig=CÓDIGO → pega o progresso no servidor (código de 1 uso, vale 30 min) e grava aqui
   - endereço novo vazio (1ª vez) → vai em OLD/ir.html, que manda o progresso e volta (só se o antigo abrir)
   - endereço antigo no navegador → aviso "o jogo mudou de endereço" com botão (só se o novo abrir)
   - APK antigo → aviso para baixar o APK novo (quando APKNOVO=true) */
(function(){
var NEW='furiadotemplo.com.br',OLD='fui-do-templo-a-pk-2.denilsinend.workers.dev',APKNOVO=true,
  APKURL='https://github.com/Denilsonserr/Fui-do-templo-a-PK-2/releases/download/ultima-versao/FuriaDoTemplo.apk';
var h=location.hostname,LS;try{LS=window.localStorage;LS.getItem('x')}catch(e){return}
var cap=!!window.Capacitor;
if(h==='www.'+NEW){location.replace('https://'+NEW+location.pathname+location.search+location.hash);return}
function abre(host,ms,cb){var done=0,t=setTimeout(function(){if(!done){done=1;cb(false)}},ms);
  try{fetch('https://'+host+'/versao.txt?t='+Date.now(),{mode:'no-cors',cache:'no-store'}).then(function(){if(!done){done=1;clearTimeout(t);cb(true)}},function(){if(!done){done=1;clearTimeout(t);cb(false)}})}catch(e){done=1;clearTimeout(t);cb(false)}}
function tela(html){var d=document.createElement('div');d.id='migM';d.setAttribute('style','position:fixed;inset:0;z-index:2147483000;background:rgba(6,5,13,.93);display:flex;align-items:center;justify-content:center;font:800 17px system-ui,sans-serif;color:#fff;text-align:center;padding:16px');
  d.innerHTML='<div style="max-width:440px">'+html+'</div>';(document.body||document.documentElement).appendChild(d);return d}
var BT='margin:8px;padding:12px 22px;border:0;border-radius:12px;font:900 16px system-ui,sans-serif;';

/* ---------- ENDEREÇO NOVO ---------- */
if(h===NEW){
  var m=/^#mig=([a-f0-9]{32}|0)$/.exec(location.hash);
  if(m){var esp=LS.getItem('ft_migwait');LS.setItem('ft_migchk','1');LS.removeItem('ft_migwait');
    if(m[1]!=='0'){try{var x=new XMLHttpRequest();x.open('POST','/fs/mig-pega',false);x.setRequestHeader('Content-Type','application/json');x.send(JSON.stringify({c:m[1]}));
      if(x.status===200){var r=JSON.parse(x.responseText),D=r&&r.d?JSON.parse(r.d):null;
        if(D&&(esp||!LS.getItem('tw_nome')||(D.ac_n&&D.ac_n===LS.getItem('ac_n')&&+(D.ac_t||0)>+(LS.getItem('ac_t')||0)))){
          LS.clear();for(var k in D)if(typeof D[k]==='string')LS.setItem(k,D[k]);LS.setItem('ft_migchk','1');LS.setItem('ft_migok',String(Date.now()))}}}catch(e){}}
    try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}
    return}
  /* 1ª vez aqui e nada salvo: procura o progresso no endereço antigo */
  if(!LS.getItem('ft_migchk')&&!LS.getItem('tw_nome')&&!LS.getItem('ac_k')){
    var w=null;document.addEventListener('DOMContentLoaded',function(){if(!LS.getItem('ft_migchk'))w=tela('🔄 Procurando seu progresso...')});
    abre(OLD,3500,function(ok){if(ok){LS.setItem('ft_migwait','1');location.replace('https://'+OLD+'/ir.html')}else{LS.setItem('ft_migchk','1');var e=document.getElementById('migM');if(e)e.remove()}});
  }
  return}

/* ---------- ENDEREÇO ANTIGO ---------- */
if(h===OLD){
  if(cap&&!APKNOVO)return;
  var hj=new Date().toISOString().slice(0,10);
  if(cap&&LS.getItem('ft_migapk')===hj)return;
  window.addEventListener('load',function(){setTimeout(function(){abre(NEW,4000,function(ok){if(!ok)return;
    var d;if(cap){LS.setItem('ft_migapk',hj);
      d=tela('🎮 <b style="color:#ffb43a">O JOGO MUDOU DE ENDEREÇO!</b><p>Baixe o <b>APK NOVO</b> e instale por cima deste. Seu progresso vai junto.</p><button id="migS" style="'+BT+'background:#ff8a1f;color:#000">⬇ BAIXAR APK NOVO</button><button id="migN" style="'+BT+'background:#333;color:#fff">DEPOIS</button>');
      d.querySelector('#migS').onclick=function(){location.href=APKURL}}
    else{d=tela('🎮 <b style="color:#ffb43a">O JOGO MUDOU DE ENDEREÇO!</b><p>Agora é <b style="color:#7fd0ff">furiadotemplo.com.br</b><br>Mais rápido e sem erro de servidor. <b>Seu progresso e sua conta vão junto</b>, não precisa entrar de novo.</p><button id="migS" style="'+BT+'background:#ff8a1f;color:#000">▶ IR PARA O SITE NOVO</button><button id="migN" style="'+BT+'background:#333;color:#fff">AGORA NÃO</button>');
      d.querySelector('#migS').onclick=function(){location.href='/ir.html'}}
    d.querySelector('#migN').onclick=function(){d.remove()}})},2500)});
}
})();
