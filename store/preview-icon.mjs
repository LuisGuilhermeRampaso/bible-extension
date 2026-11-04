// Quick look at the icon at every size: node store/preview-icon.mjs
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchChrome, startServer } from './lib/chrome.mjs';

const root = resolve(fileURLToPath(import.meta.url), '..');
const out = resolve(root, 'out');
mkdirSync(out, { recursive: true });

const svg = readFileSync(resolve(root, 'icon.svg'), 'utf8');
const server = await startServer({ '/': root });
const chrome = await launchChrome();
await chrome.viewport(760, 300, 1);
const sizes = [16, 32, 48, 128, 256];
await chrome.send('Page.navigate', { url: 'about:blank' });
await chrome.evaluate(`document.body.style.cssText = 'margin:0;background:#2b2b2f;display:flex;gap:24px;align-items:flex-end;padding:24px;font:12px sans-serif;color:#aaa';
document.body.innerHTML = ${JSON.stringify(
  sizes.map((s) => `<div style="text-align:center"><img src="${'data:image/svg+xml;utf8,' + encodeURIComponent(svg)}" width="${s}" height="${s}"><br>${s}</div>`).join(''),
)}`);
await new Promise((r) => setTimeout(r, 500));
await chrome.screenshot(resolve(out, 'icon-preview.png'));
chrome.close();
server.close();
console.log('ok');
process.exit(0);
