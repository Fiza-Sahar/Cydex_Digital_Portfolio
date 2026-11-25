import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function shot() {
  const userDir = path.join(process.cwd(), 'Server', 'scripts', '.temp-measure-' + Date.now());
  fs.mkdirSync(userDir, { recursive: true });

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9223',
    `--user-data-dir=${userDir}`,
    '--no-first-run',
    '--disable-gpu',
    'about:blank'
  ]);

  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const res = await fetch('http://127.0.0.1:9223/json/version');
      if (res.ok) break;
    } catch(e) {}
  }

  const listRes = await fetch('http://127.0.0.1:9223/json/list');
  const targets = await listRes.json();
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  await new Promise(res => ws.onopen = res);
  let id = 1;
  const send = (method, params = {}) => new Promise(resolve => {
    const curId = id++;
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === curId) {
        ws.removeEventListener('message', handler);
        resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await send('Page.enable');

  const loadedPromise = new Promise(resolve => {
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Page.loadEventFired') {
        ws.removeEventListener('message', handler);
        resolve();
      }
    };
    ws.addEventListener('message', handler);
  });

  await send('Page.navigate', { url: 'http://localhost:5173/' });
  await loadedPromise;
  await new Promise(r => setTimeout(r, 1000));

  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
  await send('Emulation.setVisibleSize', { width: 375, height: 812 });
  await new Promise(r => setTimeout(r, 1000));

  const shotData = await send('Page.captureScreenshot', { format: 'png' });
  const outDir = 'C:\\Users\\Ahmed Raza\\.gemini\\antigravity\\brain\\cf700545-2d65-4a1e-8e66-da7967e80a85';
  fs.writeFileSync(path.join(outDir, 'after_mobile_hero_375.png'), Buffer.from(shotData.data, 'base64'));

  // Also query computed spacing on the badge and section
  const spacingEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const header = document.querySelector('header');
      const main = document.querySelector('main');
      const section = document.querySelector('section');
      const badge = document.querySelector('section .inline-flex');
      const h1 = document.querySelector('h1');
      const headerRect = header ? header.getBoundingClientRect() : null;
      const sectionRect = section ? section.getBoundingClientRect() : null;
      const badgeRect = badge ? badge.getBoundingClientRect() : null;
      const h1Rect = h1 ? h1.getBoundingClientRect() : null;
      const overlay = document.querySelector('vite-error-overlay');
      const errText = overlay ? (overlay.shadowRoot ? overlay.shadowRoot.textContent : overlay.textContent) : null;
      return {
        url: window.location.href,
        errText,
        headerHeight: headerRect ? headerRect.height : null,
        mainPaddingTop: main ? window.getComputedStyle(main).paddingTop : null,
        sectionPaddingTop: section ? window.getComputedStyle(section).paddingTop : null,
        gapBetweenHeaderBottomAndBadge: badgeRect && headerRect ? (badgeRect.top - headerRect.bottom) : null,
        badgeTop: badgeRect ? badgeRect.top : null,
        h1Top: h1Rect ? h1Rect.top : null
      };
    })()`,
    returnByValue: true
  });
  console.log('SPACING MEASUREMENT:', JSON.stringify(spacingEval.result.value, null, 2));

  ws.close();
  chrome.kill();
  await new Promise(r => setTimeout(r, 500));
  try {
    if (fs.existsSync(userDir)) fs.rmSync(userDir, { recursive: true, force: true });
  } catch(e) {}
}

shot().catch(e => console.error(e));
