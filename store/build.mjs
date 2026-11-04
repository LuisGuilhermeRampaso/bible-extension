// Generates the Chrome Web Store images from the current build.
//   npm run build && node store/build.mjs
//
// Output (store/out/):
//   icons/        extension icons (PNG with transparency) -> copy into public/icons/
//   screenshots/  1280x800, 24-bit PNG (the store takes up to 5)
//   promo/        small tile 440x280 and marquee 1400x560
//   work/         intermediate popup captures and the HTML layouts (open them in Chrome to tweak)
//
// To change copy, colours or which popup appears where, edit the CONFIG block below.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchChrome, sleep, startServer } from './lib/chrome.mjs';

const here = resolve(fileURLToPath(import.meta.url), '..');
const project = resolve(here, '..');
const out = resolve(here, 'out');
const dirs = Object.fromEntries(['icons', 'screenshots', 'promo', 'work'].map((d) => [d, resolve(out, d)]));
Object.values(dirs).forEach((d) => mkdirSync(d, { recursive: true }));

/* ───────────────────────────── CONFIG ───────────────────────────── */

const BRAND = { name: 'Bíblia Online', gold: '#c9a84c', bg: '#0d0d0f', text: '#f0ede8', muted: '#a8a49d' };

const ICON_SIZES = [16, 32, 48, 128, 512];

// Popup situations captured at 420x600 (2x). `seed` fills chrome.storage; `steps` run after load.
const DARK = { 'state.prefs': { darkMode: true, fontSizeLevel: 2 } };
const LIGHT = { 'state.prefs': { darkMode: false, fontSizeLevel: 2 } };
const reader = (theme, book, name, chapter, extra = {}) => ({
  ...theme,
  'state.route': { view: 'reader', version: 'livre', bookAbbrev: book, bookName: name, chapter },
  ...extra,
});

const POPUPS = {
  'leitura-escuro': { seed: reader(DARK, 'JHN', 'João', 3) },
  'leitura-claro': { seed: reader(LIGHT, 'JHN', 'João', 3) },
  'busca': {
    seed: { ...DARK, 'state.route': { view: 'books', version: 'livre' } },
    steps: async (page) => {
      await page.evaluate(`document.querySelector('button[aria-label^="Buscar na Bíblia"]').click()`);
      await sleep(300);
      await page.evaluate(`(() => { const i = document.querySelector('#global-search'); i.value = 'Porque Deus amou o mun'; i.dispatchEvent(new Event('input', { bubbles: true })); })()`);
      await sleep(900);
    },
  },
  'livros-offline': {
    seed: { ...DARK, 'state.route': { view: 'books', version: 'almeida' } },
    steps: async (page) => {
      await page.send('Network.enable');
      await page.send('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 });
      await sleep(500);
    },
  },
  'marcacoes': {
    seed: reader(DARK, 'JHN', 'João', 3, { 'marks:livre:JHN:3': { 16: 'yellow', 17: 'green', 19: 'blue' } }),
    steps: async (page) => {
      await page.evaluate(`document.querySelector('#v-16').scrollIntoView({ block: 'center', behavior: 'instant' })`);
      await sleep(200);
      await page.evaluate(`document.querySelector('#v-17').click()`);
      await sleep(600);
    },
  },
};

// Store images. layout: 'split' (text left, popup right), 'duo' (two popups), 'tile', 'marquee'.
const SHOTS = [
  { file: '01-leitura', layout: 'split', pop: ['leitura-escuro'],
    title: 'Leia a Palavra <em>com calma</em>',
    text: 'Texto limpo em fonte serifada, pensado para longas leituras.',
    chips: ['Almeida', 'Bíblia Livre', 'King James'] },
  { file: '02-busca', layout: 'split', pop: ['busca'],
    title: 'Encontre <em>qualquer versículo</em>',
    text: 'Digite “Jo 3:16” para ir direto, ou uma palavra para buscar na Bíblia inteira.',
    chips: ['Referência', 'Palavra', 'Sem acento'] },
  { file: '03-offline', layout: 'split', pop: ['livros-offline'],
    title: 'Funciona <em>sem internet</em>',
    text: 'Os textos vêm dentro da extensão: abre rápido e não depende de conexão.',
    chips: ['66 livros', '3 versões', 'Offline'] },
  { file: '04-marcacoes', layout: 'split', pop: ['marcacoes'],
    title: 'Marque e <em>copie</em> versículos',
    text: 'Quatro cores de marcação e cópia já com a referência: “João 3:16 (Bíblia Livre)”.',
    chips: ['4 cores', 'Copiar', 'Salvo no navegador'] },
  { file: '05-temas', layout: 'duo', pop: ['leitura-escuro', 'leitura-claro'],
    title: 'Claro ou escuro, <em>do seu jeito</em>',
    text: 'Escolha o tema e o tamanho da letra. A leitura continua de onde você parou.',
    chips: ['Tema claro', 'Tema escuro', 'Fonte ajustável'] },
];

const PROMO_SMALL = { file: 'small-440x280', tagline: 'Leia offline, busque e marque versículos.' };
const PROMO_MARQUEE = { file: 'marquee-1400x560',
  title: 'A Bíblia no seu navegador, <em>sempre à mão</em>',
  text: 'Três versões, busca instantânea e leitura offline.',
  pop: ['leitura-escuro', 'busca'] };

/* ───────────────────────────── helpers ───────────────────────────── */

const shim = (seed) => `(() => {
  const store = ${JSON.stringify(seed)};
  window.chrome = { runtime: {}, storage: { local: {
    get(keys, cb) { const r = {}; for (const k of [].concat(keys ?? Object.keys(store))) if (k in store) r[k] = store[k]; cb(r); },
    set(obj, cb) { Object.assign(store, obj); cb && cb(); },
    remove(k, cb) { delete store[k]; cb && cb(); },
  } } };
})();`;

const iconSvg = readFileSync(resolve(here, 'icon.svg'), 'utf8');

function css(width, height) {
  return `
@font-face { font-family: 'Lora'; font-weight: 400 700; font-style: normal; src: url('/fonts/lora-latin-wght-normal.woff2') format('woff2'); }
@font-face { font-family: 'Lora'; font-weight: 400 700; font-style: italic; src: url('/fonts/lora-latin-wght-italic.woff2') format('woff2'); }
* { box-sizing: border-box; }
html, body { margin: 0; }
body {
  width: ${width}px; height: ${height}px; overflow: hidden; position: relative;
  font-family: 'Segoe UI', system-ui, sans-serif; color: ${BRAND.text};
  background:
    radial-gradient(${width * 0.7}px ${height * 0.9}px at 80% 45%, rgba(201,168,76,0.20), transparent 62%),
    radial-gradient(${width * 0.5}px ${height * 0.7}px at 0% 100%, rgba(201,168,76,0.08), transparent 60%),
    ${BRAND.bg};
}
.copy { position: relative; }
.eyebrow { display: flex; align-items: center; gap: 14px; margin: 0 0 26px; color: ${BRAND.gold}; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; font-size: 15px; }
.eyebrow img { width: 44px; height: 44px; }
h1 { margin: 0 0 22px; font-family: 'Lora', Georgia, serif; font-weight: 600; line-height: 1.12; letter-spacing: -0.01em; }
h1 em { font-style: italic; color: ${BRAND.gold}; }
p.lead { margin: 0; color: ${BRAND.muted}; line-height: 1.5; }
.chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 34px; }
.chips span { padding: 8px 16px; border: 1px solid rgba(201,168,76,0.45); border-radius: 999px; color: ${BRAND.gold}; font-size: 16px; font-weight: 500; background: rgba(201,168,76,0.07); }
.frame { border-radius: 18px; overflow: hidden; box-shadow: 0 34px 90px rgba(0,0,0,0.65), 0 0 0 1px rgba(201,168,76,0.38); background: #000; }
.frame img { display: block; width: 100%; height: 100%; }
`;
}

function splitHtml(shot) {
  const [W, H] = [1280, 800];
  const popH = 690;
  const popW = Math.round(popH * 0.7);
  return `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><style>${css(W, H)}
.wrap { position: absolute; inset: 0; display: flex; align-items: center; justify-content: space-between; padding: 0 100px 0 96px; }
.copy { width: 600px; }
h1 { font-size: 68px; }
p.lead { font-size: 26px; max-width: 520px; }
.frame { width: ${popW}px; height: ${popH}px; }
</style><body><div class="wrap">
  <div class="copy">
    <div class="eyebrow"><img src="/store/icon.svg" alt="">${BRAND.name}</div>
    <h1>${shot.title}</h1>
    <p class="lead">${shot.text}</p>
    <div class="chips">${shot.chips.map((c) => `<span>${c}</span>`).join('')}</div>
  </div>
  <div class="frame"><img src="/store/out/work/pop-${shot.pop[0]}.png" alt=""></div>
</div></body></html>`;
}

function duoHtml(shot) {
  const [W, H] = [1280, 800];
  const popH = 580;
  const popW = Math.round(popH * 0.7);
  return `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><style>${css(W, H)}
.wrap { position: absolute; inset: 0; display: flex; align-items: center; justify-content: space-between; padding: 0 64px 0 90px; }
.copy { width: 400px; }
h1 { font-size: 54px; }
p.lead { font-size: 23px; max-width: 390px; }
.duo { position: relative; width: ${popW * 2 - 60}px; height: ${popH + 80}px; flex: none; }
.duo .frame { position: absolute; width: ${popW}px; height: ${popH}px; }
.duo .back { right: 0; top: 80px; }
.duo .front { left: 0; top: 0; }
</style><body><div class="wrap">
  <div class="copy">
    <div class="eyebrow"><img src="/store/icon.svg" alt="">${BRAND.name}</div>
    <h1>${shot.title}</h1>
    <p class="lead">${shot.text}</p>
    <div class="chips">${shot.chips.map((c) => `<span>${c}</span>`).join('')}</div>
  </div>
  <div class="duo">
    <div class="frame back"><img src="/store/out/work/pop-${shot.pop[1]}.png" alt=""></div>
    <div class="frame front"><img src="/store/out/work/pop-${shot.pop[0]}.png" alt=""></div>
  </div>
</div></body></html>`;
}

function tileHtml() {
  const [W, H] = [440, 280];
  return `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><style>${css(W, H)}
.wrap { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; padding: 0 34px; gap: 14px; }
.top { display: flex; align-items: center; gap: 18px; }
.top img { width: 92px; height: 92px; flex: none; filter: drop-shadow(0 8px 18px rgba(0,0,0,0.5)); }
.name { font-family: 'Lora', Georgia, serif; font-weight: 600; font-size: 38px; line-height: 1.05; }
.name em { display: block; font-style: italic; color: ${BRAND.gold}; font-size: 34px; }
p.lead { font-size: 18px; margin: 0; }
.chips { margin-top: 4px; gap: 8px; }
.chips span { padding: 5px 12px; font-size: 13px; }
</style><body><div class="wrap">
  <div class="top"><img src="/store/icon.svg" alt=""><div class="name">Bíblia<em>Online</em></div></div>
  <p class="lead">${PROMO_SMALL.tagline}</p>
  <div class="chips"><span>Offline</span><span>Busca</span><span>Marcações</span></div>
</div></body></html>`;
}

function marqueeHtml() {
  const [W, H] = [1400, 560];
  const popW = 320;
  const popH = Math.round(popW / 0.7);
  const frame = (name, left, top) =>
    `<div class="frame" style="position:absolute;left:${left}px;top:${top}px;width:${popW}px;height:${popH}px"><img src="/store/out/work/pop-${name}.png" alt=""></div>`;
  return `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><style>${css(W, H)}
.copy { position: absolute; left: 90px; top: 0; bottom: 0; width: 560px; display: flex; flex-direction: column; justify-content: center; }
h1 { font-size: 54px; }
p.lead { font-size: 24px; max-width: 470px; }
.shots { position: absolute; left: 700px; top: 0; width: 700px; height: 560px; }
</style><body>
  <div class="copy">
    <div class="eyebrow"><img src="/store/icon.svg" alt="">${BRAND.name}</div>
    <h1>${PROMO_MARQUEE.title}</h1>
    <p class="lead">${PROMO_MARQUEE.text}</p>
  </div>
  <div class="shots">
    ${frame(PROMO_MARQUEE.pop[0], 20, 80)}
    ${frame(PROMO_MARQUEE.pop[1], 350, 30)}
  </div>
</body></html>`;
}

/* ───────────────────────────── run ───────────────────────────── */

const server = await startServer({
  '/store': here,
  '/fonts': resolve(project, 'src/popup/fonts'),
  '/': resolve(project, 'dist'),
});
const chrome = await launchChrome();
const page = chrome;

// 1. Popup captures at 2x.
await page.viewport(420, 600, 2);
await page.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
let shimId;
for (const [name, scenario] of Object.entries(POPUPS)) {
  if (shimId) await page.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: shimId });
  await page.send('Network.enable');
  await page.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
  shimId = (await page.send('Page.addScriptToEvaluateOnNewDocument', { source: shim(scenario.seed) })).result.identifier;
  await page.goto(`${server.origin}/src/popup/index.html`, 1400);
  if (scenario.steps) await scenario.steps(page);
  await page.screenshot(resolve(dirs.work, `pop-${name}.png`));
  console.log('popup', name);
}
await page.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
await page.send('Emulation.setEmulatedMedia', { features: [] });
await page.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: shimId });

// 2. Icons (transparent corners).
for (const size of ICON_SIZES) {
  await page.viewport(size, size, 1);
  writeFileSync(resolve(dirs.work, `icon-${size}.html`),
    `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:transparent}img{display:block;width:${size}px;height:${size}px}</style><img src="/store/icon.svg">`);
  await page.goto(`${server.origin}/store/out/work/icon-${size}.html`, 300);
  await page.screenshot(resolve(dirs.icons, `icon${size}.png`), { transparent: true });
  console.log('icon', size);
}

// 3. Store images.
async function render(htmlName, html, width, height, file) {
  writeFileSync(resolve(dirs.work, htmlName), html);
  await page.viewport(width, height, 1);
  await page.goto(`${server.origin}/store/out/work/${htmlName}`, 700);
  await page.screenshot(file);
  console.log('image', file.replace(out, '').replaceAll('\\', '/'));
}
for (const shot of SHOTS) {
  await render(`${shot.file}.html`, shot.layout === 'duo' ? duoHtml(shot) : splitHtml(shot), 1280, 800,
    resolve(dirs.screenshots, `${shot.file}.png`));
}
await render('promo-small.html', tileHtml(), 440, 280, resolve(dirs.promo, `${PROMO_SMALL.file}.png`));
await render('promo-marquee.html', marqueeHtml(), 1400, 560, resolve(dirs.promo, `${PROMO_MARQUEE.file}.png`));

if (page.problems.length) console.log('page problems:', page.problems);
page.close();
server.close();

// 4. The store wants 24-bit PNGs without an alpha channel (icons keep theirs).
for (const dir of [dirs.screenshots, dirs.promo]) {
  execFileSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', resolve(here, 'lib/flatten.ps1'), dir], { stdio: 'inherit' });
}
console.log('done');
process.exit(0);
