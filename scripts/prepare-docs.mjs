import { cp, mkdir, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const output = new URL('_site/', root);
await mkdir(output, { recursive: true });
await cp(new URL('docs/', root), output, { recursive: true });
await cp(new URL('workshop/', root), new URL('workshop/', output), { recursive: true });
await writeFile(new URL('.nojekyll', output), '');
console.log('Workshop portal prepared in _site/');
