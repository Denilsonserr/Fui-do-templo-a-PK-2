// Servidor do jogo na Cloudflare (Workers + D1). Imita o pedaço da API REST do Firestore que o jogo usa:
//   POST /fs/v1/projects/<p>/databases/(default)/documents/torre[?documentId=ID]   → cria documento (409 se o ID já existe)
//   POST /fs/v1/projects/<p>/databases/(default)/documents:runQuery               → consulta (fieldFilter + orderBy + limit)
//   POST /fs-admin/import  (só até a data IMPATE)                                       → importar documentos do Firebase
// Só cria e consulta (nunca apaga nem muda) — igual às regras do Firebase do jogo.
// Tabelas: docs(id, ct, f=JSON dos campos) e kv(id, k, s, n) = índice dos campos simples para as consultas.
const CORS={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type,x-tok','Access-Control-Max-Age':'86400'};
const J=(o,st=200)=>new Response(JSON.stringify(o),{status:st,headers:{'Content-Type':'application/json',...CORS}});
const ERR=(code,st,msg)=>J({error:{code,status:st,message:msg}},code);
const IMPATE=Date.UTC(2026,10,11,18,0); // importação do Firebase só até 11/11/2026 15:00 de Brasília (cria só IDs que não existem — mesma coisa que o jogo já pode fazer)
let READY=false;
async function init(db){if(READY)return;await db.batch([
  db.prepare('CREATE TABLE IF NOT EXISTS docs(id TEXT PRIMARY KEY, ct INTEGER NOT NULL, f TEXT NOT NULL)'),
  db.prepare('CREATE TABLE IF NOT EXISTS kv(id TEXT NOT NULL, k TEXT NOT NULL, s TEXT, n REAL)'),
  db.prepare('CREATE INDEX IF NOT EXISTS kv_s ON kv(k,s,id)'),
  db.prepare('CREATE INDEX IF NOT EXISTS kv_n ON kv(k,n)'),
  db.prepare('CREATE INDEX IF NOT EXISTS kv_id ON kv(id)'),
  db.prepare('CREATE INDEX IF NOT EXISTS kv_idk ON kv(id,k)'),
  db.prepare('CREATE TABLE IF NOT EXISTS uso(dia TEXT PRIMARY KEY, req INTEGER NOT NULL DEFAULT 0, rows INTEGER NOT NULL DEFAULT 0)'),
  db.prepare('CREATE TABLE IF NOT EXISTS adm(k TEXT PRIMARY KEY, v TEXT)'),
  db.prepare('CREATE TABLE IF NOT EXISTS bans(k TEXT PRIMARY KEY, g TEXT NOT NULL, ate INTEGER NOT NULL, mot TEXT, nome TEXT, ct INTEGER NOT NULL)')]);READY=true}
/* v455: MODERAÇÃO do dono — banir jogador por um tempo e FECHAR o jogo (manutenção).
   GET  /fs-admin/estado?u=<uid do aparelho>&a=<id da conta>  → {f:{msg}|null, b:{ate,mot}|null}  (o jogo pergunta ao abrir e a cada 3 min)
   POST /fs-admin/mod {s:senha, op, ...}  op: senha (1ª vez cria; depois troca com a atual) · ver · fechar {msg} · abrir · ban {id|u, nome, ate(ms, 0 = para sempre), mot} · desban {g}
   Ban = chaves u:<uid> e a:<conta> do mesmo grupo g. Se o banido abrir com outra conta no aparelho (ou a conta em outro aparelho), a chave nova entra no grupo. */
const twHashW=s=>{let h=0x811c9dc5;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,0x01000193)>>>0}return h.toString(36)};
const p3IdW=u=>{const h=parseInt(String(twHashW(String(u||'?'))).slice(0,7),36)||7;return String(10000002+h%89999990)};
const MODF={t:0,v:null},MODE={n:0,t:0};
async function modCfg(db,k){const r=await db.prepare('SELECT v FROM adm WHERE k=?').bind(k).first();return r?r.v:null}
async function modSet(db,k,v){await db.prepare('INSERT INTO adm(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v').bind(k,v).run()}
async function modFech(db){if(Date.now()-MODF.t<20000)return MODF.v;const v=await modCfg(db,'fechado');MODF.t=Date.now();MODF.v=v?JSON.parse(v):null;return MODF.v}
/* v624: MANUTENÇÃO FORÇADA pelo dono (22/11 22h) — jogo fechado para todos até ele mandar abrir (o ADM continua entrando: o jogo não barra o ADM).
   Para abrir: MANUT_FORCE=null. */
const MANUT_FORCE=null; /* v625: dono liberou de novo às 22:04 de 22/11 */
async function modEstado(db,url){const u=String(url.searchParams.get('u')||'').slice(0,80),a=String(url.searchParams.get('a')||'').slice(0,80),now=Date.now();
  const ks=[u&&'u:'+u,a&&'a:'+a].filter(Boolean);let b=null;
  if(ks.length){const rs=(await db.prepare(`SELECT k,g,ate,mot,nome FROM bans WHERE k IN (${ks.map(()=>'?').join(',')})`).bind(...ks).all()).results||[];
    const at=rs.find(r=>r.ate===0||r.ate>now);if(at){b={ate:at.ate,mot:at.mot||''};for(const k of ks)if(!rs.some(r=>r.k===k))await db.prepare('INSERT OR IGNORE INTO bans(k,g,ate,mot,nome,ct) VALUES(?,?,?,?,?,?)').bind(k,at.g,at.ate,at.mot,at.nome,now).run()}}
  return J({f:MANUT_FORCE||await modFech(db),b})}
async function modPost(db,req){const B=await req.json().catch(()=>({}));const op=String(B.op||'');
  if(MODE.n>=8&&Date.now()-MODE.t<600000)return J({ok:0,e:'Muitas senhas erradas. Espere 10 minutos.'},429);
  const h=await modCfg(db,'senha'),hs=async x=>sha('furia|adm|'+String(x||''));
  if(op==='senha'&&!h){const n=String(B.nova||'');if(n.length<6)return J({ok:0,e:'A senha precisa ter pelo menos 6 letras/números.'});await modSet(db,'senha',await hs(n));return J({ok:1,criada:1})}
  if(!h)return J({ok:0,e:'sem_senha'});
  if(await hs(B.s)!==h){if(Date.now()-MODE.t>600000)MODE.n=0;MODE.n++;MODE.t=Date.now();return J({ok:0,e:'Senha errada.'},403)}
  MODE.n=0;const now=Date.now();
  if(op==='senha'){const n=String(B.nova||'');if(n.length<6)return J({ok:0,e:'A senha nova precisa ter pelo menos 6 letras/números.'});await modSet(db,'senha',await hs(n));return J({ok:1})}
  if(op==='fechar'){const v={msg:String(B.msg||'').slice(0,160),t:now};await modSet(db,'fechado',JSON.stringify(v));MODF.t=0;return J({ok:1})}
  if(op==='abrir'){await db.prepare("DELETE FROM adm WHERE k='fechado'").run();MODF.t=0;return J({ok:1})}
  if(op==='ban'){let u=String(B.u||'').slice(0,80);const id=String(B.id||'').replace(/\D/g,'');
    if(!u&&id){const rs=(await db.prepare("SELECT DISTINCT s FROM kv WHERE k='uid'").all()).results||[];const m=rs.filter(r=>p3IdW(r.s)===id);if(!m.length)return J({ok:0,e:'Nenhum jogador com o ID '+id+'.'});u=m[0].s}
    if(!u)return J({ok:0,e:'Falta o ID do jogador.'});let nome=String(B.nome||'').slice(0,24);
    if(!nome){const r=await db.prepare("SELECT d.f FROM kv u JOIN docs d ON d.id=u.id WHERE u.k='uid' AND u.s=? ORDER BY d.ct DESC LIMIT 1").bind(u).first();try{const f=JSON.parse(r.f);nome=(f.nome&&f.nome.stringValue)||''}catch(e){}}
    const ate=+B.ate>0?now+Math.min(+B.ate,3650*864e5):0,g='g'+now.toString(36);
    await db.prepare('DELETE FROM bans WHERE g IN (SELECT g FROM bans WHERE k=?)').bind('u:'+u).run();
    await db.prepare('INSERT INTO bans(k,g,ate,mot,nome,ct) VALUES(?,?,?,?,?,?)').bind('u:'+u,g,ate,String(B.mot||'').slice(0,120),nome,now).run();return J({ok:1,id:p3IdW(u),nome,ate})}
  if(op==='desban'){await db.prepare('DELETE FROM bans WHERE g=?').bind(String(B.g||'')).run();return J({ok:1})}
  if(op==='ver'||op==='senha'){const rs=(await db.prepare('SELECT k,g,ate,mot,nome,ct FROM bans ORDER BY ct DESC LIMIT 400').all()).results||[];const G={};
    for(const r of rs){if(r.ate&&r.ate<=now)continue;const x=G[r.g]||(G[r.g]={g:r.g,ate:r.ate,mot:r.mot,nome:r.nome,ct:r.ct,id:'',n:0});x.n++;if(r.k.startsWith('u:')&&(!x.id||r.ct<=x.idt)){x.id=p3IdW(r.k.slice(2));x.idt=r.ct}x.ct=Math.min(x.ct,r.ct)}
    return J({ok:1,fechado:await modFech(db),bans:Object.values(G).sort((a,b)=>b.ct-a.ct)})}
  return J({ok:0,e:'op'})}
/* 11/11: TRAVA DE GASTO (plano pago US$5/mês inclui 10 milhões de pedidos e 25 bilhões de linhas lidas por mês).
   O servidor conta pedidos e linhas lidas por dia (tabela uso) e, se chegar perto do incluído, PARA de responder (429)
   até o dia/mês virar — assim a conta nunca passa dos US$5. Limites com folga: */
const TRAVA={reqDia:300000,rowsDia:700e6,reqMes:9e6,rowsMes:22e9};
const US={req:0,rows:0,t:Date.now(),chk:0,bloq:false,dia:'',mes:{req:0,rows:0}};
const hoje=()=>new Date().toISOString().slice(0,10);
async function usoFlush(db,force){if(!force&&US.req<200&&Date.now()-US.t<60000)return;const d=hoje(),r=US.req,w=US.rows;US.req=0;US.rows=0;US.t=Date.now();
  try{await db.prepare('INSERT INTO uso(dia,req,rows) VALUES(?,?,?) ON CONFLICT(dia) DO UPDATE SET req=req+excluded.req,rows=rows+excluded.rows').bind(d,r,w).run();
    const day=await db.prepare('SELECT req,rows FROM uso WHERE dia=?').bind(d).first()||{req:0,rows:0};
    const mes=await db.prepare('SELECT SUM(req) req,SUM(rows) rows FROM uso WHERE dia>=?').bind(d.slice(0,8)+'01').first()||{req:0,rows:0};
    US.dia=d;US.mes={req:mes.req|0,rows:Number(mes.rows)||0,dReq:day.req|0,dRows:Number(day.rows)||0};
    US.bloq=US.mes.dReq>TRAVA.reqDia||US.mes.dRows>TRAVA.rowsDia||US.mes.req>TRAVA.reqMes||US.mes.rows>TRAVA.rowsMes}catch(e){}}
/* 11/11: o D1 grátis tem 5 milhões de LINHAS LIDAS por dia e acabou. Cache curto das consultas (igual para todos os jogadores)
   + contador de linhas lidas por tipo de consulta (/fs-admin/reads) para achar o que gasta mais. */
const QC=new Map(),RD={t0:Date.now(),tot:0,by:{}};
const qKey=q=>{const ff=q&&q.where&&q.where.fieldFilter;return ff?ff.field.fieldPath:'ob:'+(((q&&q.orderBy)||[])[0]||{field:{}}).field.fieldPath}
const qTTL=k=>/^(sv|nome|nomeL|uid|cupom|rec)$/.test(k)?0:k==='ch'?8000:k==='lei'||k==='lot'?2000:20000; /* v577: leilão quase ao vivo (2 s) — o maior lance aparece logo para todos */
const scal=v=>{if(!v||typeof v!=='object')return null;if('stringValue' in v){const s=String(v.stringValue);return s.length<=200?{s}:null}
  if('integerValue' in v)return {n:Number(v.integerValue)};if('doubleValue' in v)return {n:Number(v.doubleValue)};if('booleanValue' in v)return {n:v.booleanValue?1:0};return null};
const rid=()=>{const a='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',b=crypto.getRandomValues(new Uint8Array(20));let s='';for(const x of b)s+=a[x%62];return s};
function insStmts(db,id,ct,fields,ignore){const st=[db.prepare(`INSERT ${ignore?'OR IGNORE ':''}INTO docs(id,ct,f) VALUES(?,?,?)`).bind(id,ct,JSON.stringify(fields))];
  for(const k in fields){const v=scal(fields[k]);if(v)st.push(db.prepare('INSERT INTO kv(id,k,s,n) VALUES(?,?,?,?)').bind(id,k,v.s??null,v.n??null))}return st}
const docOut=(base,r)=>({document:{name:base+'/torre/'+r.id,fields:JSON.parse(r.f),createTime:new Date(r.ct).toISOString(),updateTime:new Date(r.ct).toISOString()},readTime:new Date().toISOString()});
/* 27/11: o D1 às vezes responde "overloaded" por alguns segundos → tenta de novo (até 3x, com espera crescente) antes de dar erro ao celular */
const CDF=()=>typeof caches!=='undefined'&&caches.default||null;
const dbBusy=e=>/overload|too many|D1_ERROR|network connection lost|reset|timed? ?out|temporar/i.test(String(e&&e.message||e));
async function dbTry(fn){let e0;for(let i=0;i<3;i++){try{return await fn()}catch(e){e0=e;if(!dbBusy(e)||/UNIQUE|constraint/i.test(String(e&&e.message)))throw e;await new Promise(r=>setTimeout(r,150+i*350+Math.random()*150))}}throw e0}
const OPS={EQUAL:'=',GREATER_THAN:'>',GREATER_THAN_OR_EQUAL:'>=',LESS_THAN:'<',LESS_THAN_OR_EQUAL:'<='};
async function runQuery(db,base,q,ctx){q=q||{};const lim=Math.max(1,Math.min(3000,(q.limit|0)||1000));const ff=q.where&&q.where.fieldFilter;const ob=(q.orderBy||[])[0];
  const dir=ob&&ob.direction==='DESCENDING'?'DESC':'ASC';const obf=ob&&ob.field&&ob.field.fieldPath;let sql,args=[];
  if(ff){const op=OPS[ff.op];if(!op)return ERR(400,'INVALID_ARGUMENT','op');const v=scal(ff.value)||{s:''},col=v.s!=null?'s':'n';
    sql=`SELECT d.id,d.ct,d.f FROM kv w JOIN docs d ON d.id=w.id`;args.push(ff.field.fieldPath,v[col]);
    if(obf&&obf!=='__name__'){sql+=` JOIN kv o ON o.id=d.id AND o.k=?`;args.splice(0,0,obf)}
    sql+=` WHERE w.k=? AND w.${col} ${op} ?`;if(obf&&obf!=='__name__'){/* args: [obf, k, v] */}
    sql+=obf?(obf==='__name__'?` ORDER BY d.id ${dir}`:` ORDER BY o.n ${dir}`):'';}
  else if(obf&&obf!=='__name__'){sql=`SELECT d.id,d.ct,d.f FROM kv o JOIN docs d ON d.id=o.id WHERE o.k=? AND o.n IS NOT NULL ORDER BY o.n ${dir}`;args.push(obf)}
  else sql=`SELECT id,ct,f FROM docs ORDER BY id ${dir}`;
  /* v557: latestBy = só o doc MAIS NOVO de cada valor desse campo (ex.: ranking PVP: 1 doc por conta; antes 2 contas enchiam o limite) */
  if(ff&&q.latestBy&&typeof q.latestBy==='string'&&obf&&obf!=='__name__'&&OPS[ff.op]==='='){const v=scal(ff.value)||{s:''},col=v.s!=null?'s':'n';
    sql=`WITH x AS (SELECT d.id,d.ct,d.f,o.n AS ob,ROW_NUMBER() OVER (PARTITION BY g.s ORDER BY d.ct DESC) rn FROM kv w JOIN docs d ON d.id=w.id JOIN kv g ON g.id=d.id AND g.k=? JOIN kv o ON o.id=d.id AND o.k=? AND o.n IS NOT NULL WHERE w.k=? AND w.${col}=?) SELECT id,ct,f FROM x WHERE rn=1 ORDER BY ob ${dir}`;args=[q.latestBy,obf,ff.field.fieldPath,v[col]]}
  sql+=' LIMIT ?';args.push(lim);
  const kk=qKey(q),ttl=qTTL(kk),ck=JSON.stringify(q);if(ttl){const c=QC.get(ck);if(c&&Date.now()-c.t<ttl)return J(c.v)}
  /* 27/11: cache COMPARTILHADO entre todos os servidores do mesmo lugar (Cache API) — antes cada cópia do servidor perguntava ao banco de novo */
  const shared=ttl>=8000&&!/^(ch|mk|mkp|mks|mkv|mkx|avs|claim|gh|cev|lei|lot)$/.test(kk),cKey=shared||ttl?new Request('https://cache.furia/q/'+(await sha(ck))):null;
  if(shared&&CDF()){try{const r=await CDF().match(cKey);if(r){const t=+r.headers.get('x-t')||0;if(Date.now()-t<ttl){const v=await r.json();QC.set(ck,{t,v});return J(v)}}}catch(e){}}
  let res;try{res=await dbTry(()=>db.prepare(sql).bind(...args).all())}catch(e){/* banco sobrecarregado: devolve a última resposta guardada (até 15 min) em vez de erro */
    const c=QC.get(ck);if(c&&Date.now()-c.t<900e3)return J(c.v);if(cKey&&CDF()){try{const r=await CDF().match(cKey);if(r)return J(await r.json())}catch(_){}}throw e}
  const R=res.results||[];const rr=(res.meta&&res.meta.rows_read)|0;RD.tot+=rr;US.rows+=rr;const b=RD.by[kk]||(RD.by[kk]={n:0,rows:0});b.n++;b.rows+=rr;
  const out=R.length?R.map(r=>docOut(base,r)):[{readTime:new Date().toISOString()}];if(ttl){if(QC.size>300)QC.clear();QC.set(ck,{t:Date.now(),v:out})}if(cKey&&CDF()){const put=CDF().put(cKey,new Response(JSON.stringify(out),{headers:{'Content-Type':'application/json','Cache-Control':'max-age=900','x-t':String(Date.now())}})).catch(()=>{});if(ctx&&ctx.waitUntil)ctx.waitUntil(put)}
  return J(out)}
async function create(db,base,url,body){const fields=body&&body.fields;if(!fields||typeof fields!=='object')return ERR(400,'INVALID_ARGUMENT','fields');
  if(Object.keys(fields).length>80)return ERR(400,'INVALID_ARGUMENT','muitos campos');
  let id=url.searchParams.get('documentId');if(id!=null&&!/^[\w.\-]{1,200}$/.test(id))return ERR(400,'INVALID_ARGUMENT','id');if(!id)id=rid();
  for(const k in fields){if(/^(ch|mk|mkp|mks|mkv|mkx|avs|claim|gh|cev)$/.test(k))for(const c of QC.keys())if(c.includes('"fieldPath":"'+k+'"'))QC.delete(c)}
  const ct=Date.now();let tent=0;try{await dbTry(()=>{tent++;return db.batch(insStmts(db,id,ct,fields,false))})}catch(e){if(/UNIQUE|constraint/i.test(String(e&&e.message))){if(tent>1)return J({name:base+'/torre/'+id,fields,createTime:new Date(ct).toISOString(),updateTime:new Date(ct).toISOString()});return ERR(409,'ALREADY_EXISTS','Document already exists: '+id)}throw e}
  return J({name:base+'/torre/'+id,fields,createTime:new Date(ct).toISOString(),updateTime:new Date(ct).toISOString()})}
async function sha(s){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(x=>x.toString(16).padStart(2,'0')).join('')}
async function imp(db,req){if(Date.now()>IMPATE)return ERR(403,'PERMISSION_DENIED','importação encerrada');const L=(await req.json()).slice(0,40);const st=[];
  for(const x of L){if(!x||!x.id||!x.fields||!/^[\w.\-]{1,200}$/.test(x.id))continue;const ct=Date.parse(x.ct||'')||Date.now();
    st.push(db.prepare('INSERT OR IGNORE INTO docs(id,ct,f) VALUES(?,?,?)').bind(x.id,ct,JSON.stringify(x.fields)));
    for(const k in x.fields){const v=scal(x.fields[k]);if(v)st.push(db.prepare('INSERT INTO kv(id,k,s,n) SELECT ?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM kv WHERE id=? AND k=?)').bind(x.id,k,v.s??null,v.n??null,x.id,k))}}
  if(st.length)await db.batch(st);return J({ok:1,n:L.length})}
export default {async fetch(req,env,ctx){const url=new URL(req.url),p=url.pathname;
  if(!p.startsWith('/fs'))return env.ASSETS.fetch(req);
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:CORS});
  try{const db=env.DB;await dbTry(()=>init(db));US.req++;if(US.dia&&US.dia!==hoje())US.bloq=false;
    if(p==='/fs-admin/uso'){await usoFlush(db,true);return J({hoje:US.dia,dia:{pedidos:US.mes.dReq,linhas:US.mes.dRows},mes:{pedidos:US.mes.req,linhas:US.mes.rows},trava:TRAVA,travado:US.bloq})}
    await usoFlush(db,false);if(US.bloq)return ERR(429,'RESOURCE_EXHAUSTED','Quota exceeded. trava de gasto: limite do plano quase no fim');
    if(p==='/fs-admin/import'&&req.method==='POST')return await imp(db,req);
    if(p==='/fs-admin/stats'){const b=Math.floor(Date.now()/300000);const q=async(sql,...a)=>((await db.prepare(sql).bind(...a).first())||{}).n|0;
      return J({jogadores:await q("SELECT COUNT(DISTINCT s) n FROM kv WHERE k='uid'"),contas:await q("SELECT COUNT(DISTINCT s) n FROM kv WHERE k='sv'"),
        online:await q("SELECT COUNT(DISTINCT u.s) n FROM kv o JOIN kv u ON u.id=o.id AND u.k='uid' WHERE o.k='on' AND o.s IN (?,?)",'p'+b,'p'+(b-1)),
        hoje:await q("SELECT COUNT(DISTINCT u.s) n FROM kv u JOIN docs d ON d.id=u.id WHERE u.k='uid' AND d.ct>?",Date.now()-864e5),docs:await q('SELECT COUNT(*) n FROM docs'),...await (async()=>{/* v645: ?d=N → jogadores diferentes nos últimos N dias (total e por dia, dia = horário de Brasília) */
        const N=Math.min(30,Math.max(0,parseInt(url.searchParams.get('d')||'0')||0));if(!N)return {};const now=Date.now(),SQ="SELECT COUNT(DISTINCT u.s) n FROM kv u JOIN docs d ON d.id=u.id WHERE u.k='uid' AND d.ct>? AND d.ct<=?";
        const br=now-3*36e5,d0=br-br%864e5+3*36e5,por={};for(let i=0;i<N;i++){const a=d0-i*864e5,b=i?a+864e5:now;por[new Date(a-3*36e5).toISOString().slice(0,10)]=await q(SQ,a,b)}
        return {['ultimos_'+N+'_dias']:await q(SQ,now-N*864e5,now),por_dia:por}})()})}
    if(p==='/fs-admin/erros'){/* v450: erros que os celulares dos jogadores mandaram (errRep), agrupados — sem nome nem aparelho do jogador */
      const h=Math.min(720,Math.max(1,+url.searchParams.get('h')||48));const rs=(await db.prepare("SELECT ct,f FROM docs WHERE id LIKE 'er\\_%' ESCAPE '\\' AND ct>? ORDER BY ct DESC LIMIT 2000").bind(Date.now()-h*36e5).all()).results||[];
      const G={};for(const r of rs){let f={};try{f=JSON.parse(r.f)}catch(e){}const v=k=>f[k]&&(f[k].stringValue??f[k].integerValue)||'';const m=String(v('m')).slice(0,200);const g=G[m]||(G[m]={m,n:0,ult:0,modos:{},onde:v('w'),st:String(v('st')).slice(0,600)});g.n++;g.ult=Math.max(g.ult,r.ct);const mo=v('modo');g.modos[mo]=(g.modos[mo]||0)+1}
      const L=Object.values(G).sort((a,b)=>b.n-a.n),e=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
      const html=`<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width"><title>Erros</title><body style="font:14px sans-serif;background:#111;color:#eee;padding:8px"><h3>Erros das últimas ${h} horas: ${rs.length} (${L.length} tipos)</h3>`+
        L.map(g=>`<div style="border:1px solid #444;margin:6px 0;padding:6px"><b>${g.n}×</b> ${e(g.m)}<br><small>último: ${new Date(g.ult-3*36e5).toISOString().slice(5,16).replace('T',' ')} · onde: ${e(g.onde)} · modos: ${e(Object.entries(g.modos).map(x=>x[0]+' '+x[1]).join(', '))}</small><pre style="white-space:pre-wrap;font-size:11px;color:#aaa">${e(g.st)}</pre></div>`).join('')+'</body>';
      return new Response(html,{headers:{'Content-Type':'text/html; charset=utf-8',...CORS}})}
    if(p==='/fs-admin/estado')return await modEstado(db,url);
    if(p==='/fs-admin/mod'&&req.method==='POST')return await modPost(db,req);
    /* v463: último save da conta ANTES de um horário (para devolver tickets/diamantes como estavam antes do Sung). O jogo confere a assinatura. */
    if(p==='/fs/sv-antes'){const acc=String(url.searchParams.get('acc')||'');const t=+url.searchParams.get('t')||0;if(!/^[\w-]{4,80}$/.test(acc)||!t)return ERR(400,'INVALID_ARGUMENT','acc/t');
      const lo='sv_'+acc+'_',hi=lo+t.toString(36).padStart(9,'0');const r=await db.prepare('SELECT id,ct,f FROM docs WHERE id>=? AND id<? ORDER BY id DESC LIMIT 1').bind(lo,hi).first();
      if(!r)return J({nada:1});let f={};try{f=JSON.parse(r.f)}catch(e){}const v=k=>f[k]&&(f[k].stringValue??f[k].integerValue);return J({ts:+v('ts')||0,d:v('d')||'',sg:v('sg')||''})}
    /* v663: passagem do progresso do endereço antigo (workers.dev) para furiadotemplo.com.br: código aleatório de 1 uso, vale 30 min, apagado ao pegar */
    if(p==='/fs/mig-poe'&&req.method==='POST'){const t=await req.text();if(t.length>1900000)return ERR(400,'INVALID_ARGUMENT','grande demais');const d=JSON.parse(t).d;if(typeof d!=='string'||d.length<3)return ERR(400,'INVALID_ARGUMENT','d');
      await db.prepare('CREATE TABLE IF NOT EXISTS mig(c TEXT PRIMARY KEY, d TEXT NOT NULL, t INTEGER NOT NULL)').run();const now=Date.now();await db.prepare('DELETE FROM mig WHERE t<?').bind(now-18e5).run();
      const c=[...crypto.getRandomValues(new Uint8Array(16))].map(x=>x.toString(16).padStart(2,'0')).join('');await db.prepare('INSERT INTO mig(c,d,t) VALUES(?,?,?)').bind(c,d,now).run();return J({c})}
    if(p==='/fs/mig-pega'&&req.method==='POST'){const c=String((await req.json()).c||'');if(!/^[a-f0-9]{32}$/.test(c))return ERR(400,'INVALID_ARGUMENT','c');
      await db.prepare('CREATE TABLE IF NOT EXISTS mig(c TEXT PRIMARY KEY, d TEXT NOT NULL, t INTEGER NOT NULL)').run();
      const r=await db.prepare('DELETE FROM mig WHERE c=? RETURNING d,t').bind(c).first();if(!r||r.t<Date.now()-18e5)return ERR(404,'NOT_FOUND','código vencido');return J({d:r.d})}
    if(p==='/fs-admin/reads')return J(RD);
    if(p==='/fs-admin/count'){const c=await db.prepare('SELECT COUNT(*) n FROM docs').first();return J(c)}
    const m=p.match(/^\/fs\/v1\/(projects\/[^/]+\/databases\/\(default\)\/documents)(.*)$/)||p.match(/^\/fs\/v1\/(projects\/[^/]+\/databases\/%28default%29\/documents)(.*)$/);if(!m)return ERR(404,'NOT_FOUND','rota');
    const base=decodeURIComponent(m[1]),rest=m[2];
    if(req.method==='POST'&&rest===':runQuery'){const b=await req.json();return await runQuery(db,base,b.structuredQuery,ctx)}
    if(req.method==='POST'&&rest==='/torre'){const t=await req.text();if(t.length>1000000)return ERR(400,'INVALID_ARGUMENT','grande demais');return await create(db,base,url,JSON.parse(t))}
    return ERR(404,'NOT_FOUND','rota')}
  catch(e){const m=String(e&&e.message||e);if(dbBusy(e))return ERR(503,'UNAVAILABLE','ocupado, tente de novo: '+m.slice(0,140));if(/limit|exceeded|too many/i.test(m))return ERR(429,'RESOURCE_EXHAUSTED','Quota exceeded. '+m.slice(0,160));return ERR(500,'INTERNAL',m.slice(0,200))}}};
