// Roda o worker/index.js no computador (para testes): D1 de mentira com node:sqlite. Uso: node ferramentas/servidor/local.mjs 8790
import http from 'node:http';import {DatabaseSync} from 'node:sqlite';import fs from 'node:fs';import path from 'node:path';
const W=(await import(path.resolve(import.meta.dirname,'../../worker/index.js'))).default;
const sq=new DatabaseSync(process.env.DBF||':memory:');let reads=0;
class St{constructor(sql){this.sql=sql;this.a=[]}bind(...a){const s=new St(this.sql);s.a=a;return s}
  _p(){return sq.prepare(this.sql)}async all(){const r=this._p().all(...this.a);reads+=r.length;return {results:r}}async first(){const r=this._p().get(...this.a);return r||null}async run(){return this._p().run(...this.a)}}
const DB={prepare:s=>new St(s),batch:async L=>{sq.exec('BEGIN');try{const o=[];for(const s of L)o.push(s._p().run(...s.a));sq.exec('COMMIT');return o}catch(e){sq.exec('ROLLBACK');throw e}}};
const WWW=path.resolve(import.meta.dirname,'../../www');
const ASSETS={fetch:async req=>{const u=new URL(req.url);let f=path.join(WWW,decodeURIComponent(u.pathname));if(u.pathname.endsWith('/'))f+='index.html';try{return new Response(fs.readFileSync(f),{status:200})}catch(e){return new Response('nf',{status:404})}}};
http.createServer(async(q,s)=>{const ch=[];for await(const c of q)ch.push(c);const body=Buffer.concat(ch);
  const req=new Request('http://localhost'+q.url,{method:q.method,headers:q.headers,body:['GET','HEAD'].includes(q.method)?undefined:body});
  if(q.url==='/__reads'){s.end(String(reads));return}
  const r=await W.fetch(req,{DB,ASSETS});s.writeHead(r.status,Object.fromEntries(r.headers));s.end(Buffer.from(await r.arrayBuffer()))}).listen(+process.argv[2]||8790,()=>console.log('servidor local ok'));
