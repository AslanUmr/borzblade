import { cp, mkdir, rm, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
const root = resolve('.'), output = resolve(root,'dist');
if(dirname(output)!==root || output===root) throw new Error('Unsafe output path');
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
for (const file of ['index.html','abrek','ru','tr','404.html','styles.css','script.js','assets','site.webmanifest','sitemap.xml','robots.txt','CNAME','.nojekyll']) {
  await stat(resolve(root,file));await cp(resolve(root,file),resolve(output,file),{recursive:true});
}
console.log('Prepared dist/ for static hosting. No deployment performed.');
