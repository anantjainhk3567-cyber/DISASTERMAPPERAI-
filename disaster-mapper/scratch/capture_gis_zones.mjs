import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9444;
const ARTIFACT_DIR = 'C:\\Users\\anant\\.gemini\\antigravity-ide\\brain\\e5e8dfd6-dd17-47bc-8f37-b9c98f2bb6d4';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.pending = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve, reject } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) {
            reject(new Error(msg.error.message));
          } else {
            resolve(msg.result);
          }
        }
      };
    });
  }

  async send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async captureScreenshot(outputPath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    fs.writeFileSync(outputPath, buffer);
    console.log(`Saved screenshot: ${outputPath} (${buffer.length} bytes)`);
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      console.error('Eval error:', res.exceptionDetails);
    }
    return res.result?.value;
  }
}

async function main() {
  console.log('Launching headless Chrome on port', PORT);
  const userDir = path.join(ARTIFACT_DIR, 'scratch', 'chrome_temp_profile');
  if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu=false',
    '--window-size=1600,1000',
    `--user-data-dir=${userDir}`,
    'about:blank'
  ]);

  chromeProc.on('error', (err) => console.error('Chrome spawn error:', err));

  // Wait for Chrome debugging endpoint
  let versionData = null;
  for (let i = 0; i < 30; i++) {
    await sleep(400);
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      versionData = await res.json();
      if (versionData.webSocketDebuggerUrl) break;
    } catch (e) {}
  }

  if (!versionData) {
    console.error('Failed to get Chrome debugger url');
    chromeProc.kill();
    return;
  }

  console.log('Browser debugger URL:', versionData.webSocketDebuggerUrl);

  // Get or create page target
  const targetsRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const targets = await targetsRes.json();
  let pageTarget = targets.find(t => t.type === 'page');
  if (!pageTarget) {
    const newTargetRes = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' });
    pageTarget = await newTargetRes.json();
  }

  console.log('Page target WS:', pageTarget.webSocketDebuggerUrl);
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1600,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Navigating to http://localhost:5173/ ...');
  await client.send('Page.navigate', { url: 'http://localhost:5173/#/' });

  // Wait for app load
  console.log('Waiting for map and tiles to initialize...');
  await sleep(6000);

  // Check if map rendered
  const mapReady = await client.evaluate(`
    !!(document.querySelector('.maplibregl-canvas') || document.querySelector('.map-3d-frame'))
  `);
  console.log('Map element found:', mapReady);

  // 1. Capture Satellite 3D view with Organic Priority Polygons & Visible Streets
  console.log('Configuring Scenario 1: Assam Satellite 3D with Organic GIS Polygons...');
  await client.evaluate(`
    (function() {
      // Find and click Satellite button if not already active
      const buttons = Array.from(document.querySelectorAll('button'));
      const satBtn = buttons.find(b => b.textContent && b.textContent.includes('Satellite 3D'));
      if (satBtn) satBtn.click();
    })()
  `);
  await sleep(3500);

  const satShot = path.join(ARTIFACT_DIR, 'screenshot_satellite_3d_organic_zones.png');
  await client.captureScreenshot(satShot);

  // 2. Switch to Streets 3D mode
  console.log('Configuring Scenario 2: Streets 3D (Liberty Cartography) with Dense Road Hierarchy...');
  await client.evaluate(`
    (function() {
      const buttons = Array.from(document.querySelectorAll('button'));
      const streetsBtn = buttons.find(b => b.textContent && b.textContent.includes('Streets 3D'));
      if (streetsBtn) streetsBtn.click();
    })()
  `);
  await sleep(3500);

  const streetsShot = path.join(ARTIFACT_DIR, 'screenshot_streets_3d_road_detail.png');
  await client.captureScreenshot(streetsShot);

  // 3. Switch to J&K Mountain Disaster scenario to test landslide corridor & mountain roads
  console.log('Configuring Scenario 3: J&K Mountain Disaster (NH-44 Corridor & Slope Corridors)...');
  await client.evaluate(`
    (function() {
      // Look for disaster select or locality button or switch disaster in selector
      const selects = Array.from(document.querySelectorAll('select'));
      for (const sel of selects) {
        for (let i = 0; i < sel.options.length; i++) {
          if (sel.options[i].text.includes('Jammu') || sel.options[i].text.includes('J&K') || sel.options[i].value.includes('jk')) {
            sel.selectedIndex = i;
            sel.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
          }
        }
      }
      // Alternative: click J&K preset button if available
      const buttons = Array.from(document.querySelectorAll('button'));
      const jkBtn = buttons.find(b => b.textContent && (b.textContent.includes('J&K') || b.textContent.includes('Jammu') || b.textContent.includes('Panthyal')));
      if (jkBtn) { jkBtn.click(); return true; }
      return false;
    })()
  `);
  await sleep(4000);

  const jkShot = path.join(ARTIFACT_DIR, 'screenshot_jk_mountain_corridor.png');
  await client.captureScreenshot(jkShot);

  // 4. Click Priority Zone to open Interactive GIS Zone Inspector Panel (Requirement 7)
  console.log('Configuring Scenario 4: Clicking Priority Zone to open GIS Inspector...');
  const clicked = await client.evaluate(`
    (function() {
      // Programmatically trigger selection of a RED priority zone on MapLibre instance if possible
      // or click center of canvas where the zone is
      const canvas = document.querySelector('.maplibregl-canvas');
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        // Click near center-right or center where priority zones exist
        const clickEvent = new MouseEvent('click', {
          clientX: rect.left + rect.width * 0.5,
          clientY: rect.top + rect.height * 0.52,
          bubbles: true,
          cancelable: true
        });
        canvas.dispatchEvent(clickEvent);
      }
      return true;
    })()
  `);
  await sleep(2000);

  // If programmatic canvas click did not hit the polygon directly, trigger selectedZone state or click target
  await client.evaluate(`
    (function() {
      // If inspector panel is not yet open, inspect if we can click any priority badge or trigger it
      const inspector = document.querySelector('.font-mono');
      // Look for rescue zones in DOM or trigger through window
      // Or simulate click on priority list / locality
      const locBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('Locality') || b.textContent.includes('Street') || b.textContent.includes('Inspection')));
      if (locBtn) locBtn.click();
    })()
  `);
  await sleep(2000);

  const inspectorShot = path.join(ARTIFACT_DIR, 'screenshot_clicked_zone_inspector.png');
  await client.captureScreenshot(inspectorShot);

  // 5. Verification of Shimla / Hill Station scenario
  console.log('Configuring Scenario 5: Shimla Summer Hill Mountain Landslide...');
  await client.evaluate(`
    (function() {
      const selects = Array.from(document.querySelectorAll('select'));
      for (const sel of selects) {
        for (let i = 0; i < sel.options.length; i++) {
          if (sel.options[i].text.includes('Shimla') || sel.options[i].value.includes('shimla')) {
            sel.selectedIndex = i;
            sel.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
          }
        }
      }
      return false;
    })()
  `);
  await sleep(4000);

  const shimlaShot = path.join(ARTIFACT_DIR, 'screenshot_shimla_mountain_organic_zones.png');
  await client.captureScreenshot(shimlaShot);

  console.log('All screenshots captured successfully!');
  chromeProc.kill();
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
