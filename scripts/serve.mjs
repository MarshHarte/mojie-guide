import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8'};
http.createServer(async(req,res)=>{
  try {
    const requested=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
    const relative=requested==='/'?'index.html':requested.slice(1);
    if (!(relative==='index.html'||relative==='robots.txt'||relative==='sitemap.xml'||relative.startsWith('assets/'))) {res.writeHead(404).end('Not found');return;}
    const file=path.resolve(root,relative);
    if (!file.startsWith(root+path.sep)) {res.writeHead(403).end('Forbidden');return;}
    const bytes=await fs.readFile(file);
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(bytes);
  } catch {res.writeHead(404).end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('Preview http://127.0.0.1:4173/ (local only)'));
