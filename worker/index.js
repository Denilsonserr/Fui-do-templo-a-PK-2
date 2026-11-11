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
  db.prepare('CREATE INDEX IF NOT EXISTS kv_id ON kv(id)')]);READY=true}
const scal=v=>{if(!v||typeof v!=='object')return null;if('stringValue' in v){const s=String(v.stringValue);return s.length<=200?{s}:null}
  if('integerValue' in v)return {n:Number(v.integerValue)};if('doubleValue' in v)return {n:Number(v.doubleValue)};if('booleanValue' in v)return {n:v.booleanValue?1:0};return null};
const rid=()=>{const a='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',b=crypto.getRandomValues(new Uint8Array(20));let s='';for(const x of b)s+=a[x%62];return s};
function insStmts(db,id,ct,fields,ignore){const st=[db.prepare(`INSERT ${ignore?'OR IGNORE ':''}INTO docs(id,ct,f) VALUES(?,?,?)`).bind(id,ct,JSON.stringify(fields))];
  for(const k in fields){const v=scal(fields[k]);if(v)st.push(db.prepare('INSERT INTO kv(id,k,s,n) VALUES(?,?,?,?)').bind(id,k,v.s??null,v.n??null))}return st}
const docOut=(base,r)=>({document:{name:base+'/torre/'+r.id,fields:JSON.parse(r.f),createTime:new Date(r.ct).toISOString(),updateTime:new Date(r.ct).toISOString()},readTime:new Date().toISOString()});
const OPS={EQUAL:'=',GREATER_THAN:'>',GREATER_THAN_OR_EQUAL:'>=',LESS_THAN:'<',LESS_THAN_OR_EQUAL:'<='};
async function runQuery(db,base,q){q=q||{};const lim=Math.max(1,Math.min(3000,(q.limit|0)||1000));const ff=q.where&&q.where.fieldFilter;const ob=(q.orderBy||[])[0];
  const dir=ob&&ob.direction==='DESCENDING'?'DESC':'ASC';const obf=ob&&ob.field&&ob.field.fieldPath;let sql,args=[];
  if(ff){const op=OPS[ff.op];if(!op)return ERR(400,'INVALID_ARGUMENT','op');const v=scal(ff.value)||{s:''},col=v.s!=null?'s':'n';
    sql=`SELECT d.id,d.ct,d.f FROM kv w JOIN docs d ON d.id=w.id`;args.push(ff.field.fieldPath,v[col]);
    if(obf&&obf!=='__name__'){sql+=` JOIN kv o ON o.id=d.id AND o.k=?`;args.splice(0,0,obf)}
    sql+=` WHERE w.k=? AND w.${col} ${op} ?`;if(obf&&obf!=='__name__'){/* args: [obf, k, v] */}
    sql+=obf?(obf==='__name__'?` ORDER BY d.id ${dir}`:` ORDER BY o.n ${dir}`):'';}
  else if(obf&&obf!=='__name__'){sql=`SELECT d.id,d.ct,d.f FROM kv o JOIN docs d ON d.id=o.id WHERE o.k=? AND o.n IS NOT NULL ORDER BY o.n ${dir}`;args.push(obf)}
  else sql=`SELECT id,ct,f FROM docs ORDER BY id ${dir}`;
  sql+=' LIMIT ?';args.push(lim);
  const R=(await db.prepare(sql).bind(...args).all()).results||[];
  return J(R.length?R.map(r=>docOut(base,r)):[{readTime:new Date().toISOString()}])}
async function create(db,base,url,body){const fields=body&&body.fields;if(!fields||typeof fields!=='object')return ERR(400,'INVALID_ARGUMENT','fields');
  if(Object.keys(fields).length>80)return ERR(400,'INVALID_ARGUMENT','muitos campos');
  let id=url.searchParams.get('documentId');if(id!=null&&!/^[\w.\-]{1,200}$/.test(id))return ERR(400,'INVALID_ARGUMENT','id');if(!id)id=rid();
  const ct=Date.now();try{await db.batch(insStmts(db,id,ct,fields,false))}catch(e){if(/UNIQUE|constraint/i.test(String(e&&e.message)))return ERR(409,'ALREADY_EXISTS','Document already exists: '+id);throw e}
  return J({name:base+'/torre/'+id,fields,createTime:new Date(ct).toISOString(),updateTime:new Date(ct).toISOString()})}
async function sha(s){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(x=>x.toString(16).padStart(2,'0')).join('')}
async function imp(db,req){if(Date.now()>IMPATE)return ERR(403,'PERMISSION_DENIED','importação encerrada');const L=(await req.json()).slice(0,40);const st=[];
  for(const x of L){if(!x||!x.id||!x.fields||!/^[\w.\-]{1,200}$/.test(x.id))continue;const ct=Date.parse(x.ct||'')||Date.now();
    st.push(db.prepare('INSERT OR IGNORE INTO docs(id,ct,f) VALUES(?,?,?)').bind(x.id,ct,JSON.stringify(x.fields)));
    for(const k in x.fields){const v=scal(x.fields[k]);if(v)st.push(db.prepare('INSERT INTO kv(id,k,s,n) SELECT ?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM kv WHERE id=? AND k=?)').bind(x.id,k,v.s??null,v.n??null,x.id,k))}}
  if(st.length)await db.batch(st);return J({ok:1,n:L.length})}
export default {async fetch(req,env){const url=new URL(req.url),p=url.pathname;
  if(!p.startsWith('/fs'))return env.ASSETS.fetch(req);
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:CORS});
  try{const db=env.DB;await init(db);
    if(p==='/fs-admin/import'&&req.method==='POST')return await imp(db,req);
    if(p==='/fs-admin/stats'){const b=Math.floor(Date.now()/300000);const q=async(sql,...a)=>((await db.prepare(sql).bind(...a).first())||{}).n|0;
      return J({jogadores:await q("SELECT COUNT(DISTINCT s) n FROM kv WHERE k='uid'"),contas:await q("SELECT COUNT(DISTINCT s) n FROM kv WHERE k='sv'"),
        online:await q("SELECT COUNT(DISTINCT u.s) n FROM kv o JOIN kv u ON u.id=o.id AND u.k='uid' WHERE o.k='on' AND o.s IN (?,?)",'p'+b,'p'+(b-1)),
        hoje:await q("SELECT COUNT(DISTINCT u.s) n FROM kv u JOIN docs d ON d.id=u.id WHERE u.k='uid' AND d.ct>?",Date.now()-864e5),docs:await q('SELECT COUNT(*) n FROM docs')})}
    if(p==='/fs-admin/count'){const c=await db.prepare('SELECT COUNT(*) n FROM docs').first();return J(c)}
    const m=p.match(/^\/fs\/v1\/(projects\/[^/]+\/databases\/\(default\)\/documents)(.*)$/)||p.match(/^\/fs\/v1\/(projects\/[^/]+\/databases\/%28default%29\/documents)(.*)$/);if(!m)return ERR(404,'NOT_FOUND','rota');
    const base=decodeURIComponent(m[1]),rest=m[2];
    if(req.method==='POST'&&rest===':runQuery'){const b=await req.json();return await runQuery(db,base,b.structuredQuery)}
    if(req.method==='POST'&&rest==='/torre'){const t=await req.text();if(t.length>1000000)return ERR(400,'INVALID_ARGUMENT','grande demais');return await create(db,base,url,JSON.parse(t))}
    return ERR(404,'NOT_FOUND','rota')}
  catch(e){const m=String(e&&e.message||e);if(/limit|exceeded|too many/i.test(m))return ERR(429,'RESOURCE_EXHAUSTED','Quota exceeded. '+m.slice(0,160));return ERR(500,'INTERNAL',m.slice(0,200))}}};
