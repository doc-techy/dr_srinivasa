import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const url = process.argv[2] || 'http://localhost:3000/';
const out = process.argv[3] || 'mob.png';
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=9334',
  '--user-data-dir=/tmp/chm-cdp2', 'about:blank',
]);
const sleep = ms => new Promise(r => setTimeout(r, ms));
await sleep(1500);
const targets = await (await fetch('http://127.0.0.1:9334/json')).json();
const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = e => { const m = JSON.parse(e.data); pending.get(m.id)?.(m.result); };
const send = (method, params = {}) => new Promise(r => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });

await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.enable');
await send('Page.navigate', { url });
await sleep(4000);
const { result } = await send('Runtime.evaluate', { expression: 'document.documentElement.scrollHeight', returnByValue: true });
const h = result.value;
for (let y = 0; y < h; y += 400) { await send('Runtime.evaluate', { expression: `scrollTo(0,${y})` }); await sleep(120); }
await send('Runtime.evaluate', { expression: 'scrollTo(0,0)' });
await sleep(1500);
const shot = await send('Page.captureScreenshot', { captureBeyondViewport: true, clip: { x: 0, y: 0, width: 1440, height: h, scale: 1 } });
writeFileSync(out, Buffer.from(shot.data, 'base64'));
console.log('height', h);
ws.close();
chrome.kill();
process.exit(0);
