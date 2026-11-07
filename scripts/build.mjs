import { cp, mkdir, access } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
for (const image of ['hero.png', 'interior.png']) await access(resolve(root, 'assets', image));
await mkdir(resolve(root, 'dist'), { recursive: true });
for (const file of ['index.html', 'css', 'js', 'assets']) await cp(resolve(root, file), resolve(root, 'dist', file), { recursive: true });
console.log('Built static website in dist/');
