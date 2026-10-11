import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('.'), port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.webmanifest':'application/manifest+json','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain'};
http.createServer(async (req,res) => {
  try {
    let path = resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if (path !== root && !path.startsWith(root+sep)) { res.writeHead(403).end(); return; }
    if ((await stat(path)).isDirectory()) {
      if (!req.url.split('?')[0].endsWith('/')) {res.writeHead(301,{Location:req.url.split('?')[0]+'/'}).end();return;}
      path = resolve(path,'index.html');
    }
    if (path.includes(`${sep}.git${sep}`) || /\.(mjs|md|py)$/.test(path)) {res.writeHead(403).end();return;}
    res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream'});res.end(await readFile(path));
  } catch {res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile('404.html'));}
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
