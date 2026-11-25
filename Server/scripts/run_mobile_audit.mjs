import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = path.join(process.cwd(), 'Server', 'scripts', '.chrome-mobile-profile-' + Date.now());
const ARTIFACT_DIR = 'C:\\Users\\Ahmed Raza\\.gemini\\antigravity\\brain\\cf700545-2d65-4a1e-8e66-da7967e80a85';
const BASE_URL = 'http://localhost:5173';

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.pending = new Map();
    this.consoleErrors = [];
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.method === 'Console.messageAdded' && msg.params.message.level === 'error') {
          this.consoleErrors.push({ type: 'console.error', text: msg.params.message.text, url: msg.params.message.url });
        } else if (msg.method === 'Runtime.exceptionThrown') {
          this.consoleErrors.push({
            type: 'uncaughtException',
            text: msg.params.exceptionDetails.text,
            exception: msg.params.exceptionDetails.exception?.description
          });
        }

        if (msg.id && this.pending.has(msg.id)) {
          const { resolve, reject } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async close() {
    if (this.ws) this.ws.close();
  }
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('=== STARTING CYDEX DIGITAL MOBILE RESPONSIVENESS AUDIT ===');
  fs.mkdirSync(USER_DATA_DIR, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9224',
    `--user-data-dir=${USER_DATA_DIR}`,
    '--no-first-run',
    '--disable-gpu',
    'about:blank'
  ]);

  let wsUrl = null;
  for (let i = 0; i < 20; i++) {
    await sleep(400);
    try {
      const res = await fetch('http://127.0.0.1:9224/json/version');
      if (res.ok) {
        const data = await res.json();
        wsUrl = data.webSocketDebuggerUrl;
        break;
      }
    } catch(e) {}
  }

  if (!wsUrl) throw new Error('Could not connect to Chrome debugging port 9224');

  const listRes = await fetch('http://127.0.0.1:9224/json/list');
  const targets = await listRes.json();
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Console.enable');

  async function setViewport(width, height = 812) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 2,
      mobile: width < 1024,
    });
    await client.send('Emulation.setVisibleSize', { width, height });
  }

  async function navigate(urlPath) {
    await client.send('Page.navigate', { url: `${BASE_URL}${urlPath}` });
    await sleep(1000);
  }

  async function captureScreenshot(filename) {
    const shot = await client.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(shot.data, 'base64');
    const outPath = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(outPath, buffer);
    console.log(`   📸 Saved screenshot: ${filename}`);
  }

  const breakpoints = [320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440];
  const results = {
    heroSpacingMeasurements: [],
    overflowAudit: [],
    consoleErrors: [],
    screenshots: []
  };

  // 1. TEST HERO SPACING & OVERFLOW ACROSS ALL 10 BREAKPOINTS
  console.log('\n--- 1. Testing Homepage Across All 10 Breakpoints ---');
  await navigate('/');

  for (const bp of breakpoints) {
    await setViewport(bp, bp < 768 ? 812 : 900);
    await sleep(300);

    const metricsEval = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const header = document.querySelector('header');
        const main = document.querySelector('main');
        const section = document.querySelector('section');
        const badge = document.querySelector('section .inline-flex');
        const h1 = document.querySelector('h1');
        const headerRect = header ? header.getBoundingClientRect() : null;
        const badgeRect = badge ? badge.getBoundingClientRect() : null;
        const h1Rect = h1 ? h1.getBoundingClientRect() : null;
        return {
          innerWidth: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          headerHeight: headerRect ? headerRect.height : null,
          mainPaddingTop: main ? window.getComputedStyle(main).paddingTop : null,
          sectionPaddingTop: section ? window.getComputedStyle(section).paddingTop : null,
          gapBetweenHeaderBottomAndBadge: (badgeRect && headerRect) ? (badgeRect.top - headerRect.bottom) : null,
          badgeTop: badgeRect ? badgeRect.top : null,
          h1Top: h1Rect ? h1Rect.top : null,
          hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
        };
      })()`,
      returnByValue: true
    });

    const m = metricsEval.result.value;
    console.log(`Breakpoint ${bp}px:`);
    console.log(`   - Header: ${m.headerHeight}px | Main pt: ${m.mainPaddingTop} | Section pt: ${m.sectionPaddingTop}`);
    console.log(`   - Gap Below Navbar to Badge: ${m.gapBetweenHeaderBottomAndBadge?.toFixed(1)}px (Badge Top: ${m.badgeTop?.toFixed(1)}px, H1 Top: ${m.h1Top?.toFixed(1)}px)`);
    console.log(`   - Width: ${m.innerWidth}px | Scroll: ${m.scrollWidth}px -> ${m.hasOverflow ? '❌ OVERFLOW' : '✅ 0px Overflow'}`);

    results.heroSpacingMeasurements.push({ breakpoint: bp, ...m });
    if (m.hasOverflow) {
      results.overflowAudit.push({ page: '/', breakpoint: bp, inner: m.innerWidth, scroll: m.scrollWidth });
    }
  }

  // 2. CAPTURE VISUAL EVIDENCE SCREENSHOTS
  console.log('\n--- 2. Capturing Mobile Screenshots for Proof ---');
  // Hero 375 (After)
  await setViewport(375, 812);
  await navigate('/');
  await captureScreenshot('after_mobile_hero_375.png');

  // Hero 320 (Legacy Small Mobile)
  await setViewport(320, 568);
  await navigate('/');
  await captureScreenshot('after_mobile_hero_320.png');

  // Hero 390 (iPhone 14/15)
  await setViewport(390, 844);
  await navigate('/');
  await captureScreenshot('after_mobile_hero_390.png');

  // Hero 414 (iPhone Plus/XR)
  await setViewport(414, 896);
  await navigate('/');
  await captureScreenshot('after_mobile_hero_414.png');

  // Hero 1440 (Desktop preservation check)
  await setViewport(1440, 900);
  await navigate('/');
  await captureScreenshot('after_desktop_hero_1440.png');

  // 3. TEST ALL OTHER KEY PAGES ON MOBILE (375px)
  const pages = [
    { name: 'About', path: '/about', shot: 'after_about_mobile_375.png' },
    { name: 'Services', path: '/services', shot: 'after_services_mobile_375.png' },
    { name: 'Portfolio', path: '/portfolio', shot: 'after_portfolio_mobile_375.png' },
    { name: 'Contact', path: '/contact', shot: 'after_contact_mobile_375.png' },
    { name: 'Register', path: '/register', shot: 'after_register_mobile_375.png' },
    { name: 'Login', path: '/login', shot: 'after_login_mobile_375.png' },
  ];

  console.log('\n--- 3. Testing Interior Pages on Mobile (375px) ---');
  await setViewport(375, 812);

  for (const page of pages) {
    await navigate(page.path);
    await captureScreenshot(page.shot);

    const pEval = await client.send('Runtime.evaluate', {
      expression: `(() => {
        const header = document.querySelector('header');
        const h1 = document.querySelector('h1');
        const headerRect = header ? header.getBoundingClientRect() : null;
        const h1Rect = h1 ? h1.getBoundingClientRect() : null;
        return {
          title: document.title,
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          gapToH1: (h1Rect && headerRect) ? (h1Rect.top - headerRect.bottom) : null,
          hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
        };
      })()`,
      returnByValue: true
    });

    const pv = pEval.result.value;
    console.log(`✅ Page "${page.name}" (${page.path}):`);
    console.log(`   - Title: "${pv.title}"`);
    console.log(`   - Gap Below Navbar to H1: ${pv.gapToH1 ? pv.gapToH1.toFixed(1) + 'px' : 'N/A'}`);
    console.log(`   - Overflow: ${pv.hasOverflow ? '❌ OVERFLOW' : '✅ 0px Overflow'}`);

    if (pv.hasOverflow) {
      results.overflowAudit.push({ page: page.path, breakpoint: 375, inner: pv.innerWidth, scroll: pv.scrollWidth });
    }
  }

  // 4. TEST MOBILE NAVIGATION MENU DRAWER INTERACTION
  console.log('\n--- 4. Testing Mobile Navigation Menu Drawer ---');
  await setViewport(375, 812);
  await navigate('/');

  const clickMenuEval = await client.send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('button[aria-label="Toggle Navigation"]');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    })()`,
    returnByValue: true
  });
  console.log('   - Menu button clicked:', clickMenuEval.result.value);
  await sleep(400);

  // Capture screenshot with mobile menu opened
  await captureScreenshot('after_mobile_menu_open_375.png');

  const menuStateEval = await client.send('Runtime.evaluate', {
    expression: `(() => {
      const navLinks = Array.from(document.querySelectorAll('header div div nav a, header .fixed nav a')).map(a => a.innerText.trim());
      const ctaBtn = document.querySelector('header .fixed a button, header div a button');
      return {
        linksCount: navLinks.length,
        links: navLinks,
        hasCta: Boolean(ctaBtn),
        bodyOverflow: document.body.style.overflow
      };
    })()`,
    returnByValue: true
  });
  console.log('   - Mobile drawer links:', menuStateEval.result.value.links);
  console.log('   - Body overflow locked:', menuStateEval.result.value.bodyOverflow);

  // 5. CONSOLE ERROR CHECK
  console.log('\n--- 5. Console Error Verification ---');
  results.consoleErrors = client.consoleErrors;
  if (client.consoleErrors.length === 0) {
    console.log('✅ ZERO console errors detected during entire mobile responsive audit!');
  } else {
    console.error('❌ Detected console errors:', client.consoleErrors);
  }

  await client.close();
  chromeProc.kill();
  await sleep(500);

  try {
    if (fs.existsSync(USER_DATA_DIR)) fs.rmSync(USER_DATA_DIR, { recursive: true, force: true });
  } catch(e) {}

  console.log('\n======================================================');
  console.log('  MOBILE RESPONSIVE AUDIT COMPLETED SUCCESSFULLY!     ');
  console.log('======================================================');
  console.log(`Breakpoints verified: ${breakpoints.length}`);
  console.log(`Total overflow violations: ${results.overflowAudit.length}`);
  console.log(`Total console errors: ${results.consoleErrors.length}`);
}

main().catch(err => {
  console.error('Audit fatal error:', err);
  process.exit(1);
});
