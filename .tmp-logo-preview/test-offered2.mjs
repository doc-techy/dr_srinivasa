import { spawn } from 'node:child_process';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--disable-gpu', '--remote-debugging-port=9341',
  '--user-data-dir=/tmp/chm-offered2', 'about:blank',
]);
await sleep(1500);
const targets = await (await fetch('http://127.0.0.1:9341/json')).json();
const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = e => { const m = JSON.parse(e.data); pending.get(m.id)?.(m.result); };
const send = (method, params = {}) => new Promise(r => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Page.navigate', { url: 'http://localhost:3000/' });
await sleep(5000);
await send('Runtime.evaluate', { expression: `document.querySelector('button[aria-label*="Physiotherapy"]')?.click()` });
await sleep(500);
const { result } = await send('Runtime.evaluate', {
  expression: `(() => {
    const d = document.querySelector('[role="dialog"][aria-labelledby="services-offered-modal-title"]');
    if (!d) return { err: 'no dialog' };
    const r = d.getBoundingClientRect();
    const cs = getComputedStyle(d);
    let p = d.parentElement, chain = [];
    while (p && chain.length < 8) {
      const pcs = getComputedStyle(p);
      chain.push({ tag: p.tagName, cls: p.className?.slice?.(0,80), overflow: pcs.overflow, transform: pcs.transform, z: pcs.zIndex, filter: pcs.filter });
      p = p.parentElement;
    }
    return { rect: { w: r.width, h: r.height, top: r.top, left: r.left }, z: cs.zIndex, pos: cs.position, opacity: cs.opacity, chain };
  })()`,
  returnByValue: true,
});
console.log(JSON.stringify(result.value, null, 2));
ws.close(); chrome.kill();
