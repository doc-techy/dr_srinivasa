import { spawn } from 'node:child_process';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--disable-gpu', '--remote-debugging-port=9340',
  '--user-data-dir=/tmp/chm-offered', 'about:blank',
]);
await sleep(1500);
const targets = await (await fetch('http://127.0.0.1:9340/json')).json();
const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = e => { const m = JSON.parse(e.data); pending.get(m.id)?.(m.result); };
const send = (method, params = {}) => new Promise(r => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Page.enable');
await send('Page.navigate', { url: 'http://localhost:3000/' });
await sleep(5000);
await send('Runtime.evaluate', { expression: `document.querySelector('button[aria-label*="Physiotherapy"]')?.scrollIntoView({block:'center'})` });
await sleep(500);
const before = await send('Runtime.evaluate', { expression: `!!document.querySelector('[aria-labelledby="services-offered-modal-title"]')`, returnByValue: true });
await send('Runtime.evaluate', { expression: `document.querySelector('button[aria-label*="Physiotherapy"]')?.click()` });
await sleep(800);
const after = await send('Runtime.evaluate', { expression: `({
  modal: !!document.querySelector('[aria-labelledby="services-offered-modal-title"]'),
  title: document.querySelector('#services-offered-modal-title')?.textContent,
  z: document.querySelector('[aria-labelledby="services-offered-modal-title"]')?.parentElement?.className
})`, returnByValue: true });
console.log('before', before.result.value, 'after', JSON.stringify(after.result.value));
ws.close(); chrome.kill(); process.exit(0);
