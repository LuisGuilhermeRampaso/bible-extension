// Minimal headless-Chrome driver (CDP over WebSocket) used to render store assets.
// Serves a few directories over http://127.0.0.1:<port> so pages can load fonts and images.
import { createServer } from 'node:http';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { extname, join, normalize, resolve } from 'node:path';

const CHROME_PATHS = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
].filter(Boolean);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** mounts: { '/prefix': 'dir' } — the first matching prefix wins. */
export async function startServer(mounts, port = 8765) {
  const roots = Object.entries(mounts).map(([prefix, dir]) => [prefix, resolve(dir)]);
  const server = createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    for (const [prefix, root] of roots) {
      if (path !== prefix && !path.startsWith(prefix === '/' ? '/' : prefix + '/')) continue;
      const rel = normalize(path.slice(prefix.length)).replace(/^([/\\])+/, '');
      const file = join(root, rel);
      if (file.startsWith(root) && existsSync(file) && !file.endsWith('\\') && require_file(file)) {
        res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
        res.end(readFileSync(file));
        return;
      }
    }
    res.writeHead(404);
    res.end();
  });
  await new Promise((r) => server.listen(port, '127.0.0.1', r));
  return { origin: `http://127.0.0.1:${port}`, close: () => server.close() };
}

function require_file(file) {
  try {
    readFileSync(file);
    return true;
  } catch {
    return false;
  }
}

export async function launchChrome(debugPort = 9333) {
  const exe = CHROME_PATHS.find((p) => existsSync(p));
  if (!exe) throw new Error('Chrome not found; set CHROME_PATH');

  const profile = mkdtempSync(join(tmpdir(), 'bib-store-'));
  const proc = spawn(
    exe,
    [
      '--headless=new', `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`,
      '--no-first-run', '--no-default-browser-check', '--disable-gpu', '--hide-scrollbars',
      '--force-color-profile=srgb', '--disable-lcd-text', 'about:blank',
    ],
    { stdio: 'ignore' },
  );

  let targets = [];
  for (let i = 0; i < 60 && !targets.length; i++) {
    try {
      targets = await (await fetch(`http://127.0.0.1:${debugPort}/json`)).json();
    } catch {
      /* not up yet */
    }
    if (!targets.length) await sleep(200);
  }
  const target = targets.find((t) => t.type === 'page');
  if (!target) throw new Error('Chrome did not start');

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let id = 0;
  const pending = new Map();
  const problems = [];
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
    if (msg.method === 'Runtime.exceptionThrown') problems.push(msg.params.exceptionDetails.exception?.description ?? 'exception');
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      problems.push(msg.params.args.map((a) => a.value ?? a.description).join(' '));
    }
  };

  const send = (method, params = {}) =>
    new Promise((resolveSend) => {
      const i = ++id;
      pending.set(i, resolveSend);
      ws.send(JSON.stringify({ id: i, method, params }));
    });

  await send('Page.enable');
  await send('Runtime.enable');

  const api = {
    problems,
    send,
    async evaluate(expression) {
      const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
      if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails));
      return r.result?.result?.value;
    },
    async viewport(width, height, deviceScaleFactor = 1) {
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor, mobile: false });
    },
    async goto(url, settleMs = 600) {
      await send('Page.navigate', { url });
      await sleep(settleMs);
      await api.evaluate('document.fonts.ready.then(() => true)');
    },
    async screenshot(file, { transparent = false } = {}) {
      await send('Emulation.setDefaultBackgroundColorOverride', {
        color: transparent ? { r: 0, g: 0, b: 0, a: 0 } : { r: 255, g: 255, b: 255, a: 1 },
      });
      const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      writeFileSync(file, Buffer.from(r.result.data, 'base64'));
    },
    close() {
      ws.close();
      proc.kill();
    },
  };
  return api;
}
