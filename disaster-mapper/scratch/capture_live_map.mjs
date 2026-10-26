import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9448;
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
    console.log(`Saved screenshot: ${path.basename(outputPath)} (${buffer.length} bytes)`);
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
  const userDir = path.join(ARTIFACT_DIR, 'scratch', 'chrome_temp_profile5');
  if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu=false',
    '--window-size=1680,1050',
    `--user-data-dir=${userDir}`,
    'about:blank'
  ]);

  chromeProc.on('error', (err) => console.error('Chrome spawn error:', err));

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

  const targetsRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const targets = await targetsRes.json();
  let pageTarget = targets.find(t => t.type === 'page');
  if (!pageTarget) {
    const newTargetRes = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' });
    pageTarget = await newTargetRes.json();
  }

  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1680,
    height: 1050,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Navigating to http://127.0.0.1:5173/map ...');
  await client.send('Page.navigate', { url: 'http://127.0.0.1:5173/map' });

  // Wait for map load
  console.log('Waiting for Live GIS Map and vector layers to initialize...');
  for (let i = 0; i < 25; i++) {
    await sleep(800);
    const ready = await client.evaluate(`
      !!(window.__maplibreInstance && window.__maplibreInstance.isStyleLoaded())
    `);
    if (ready) {
      console.log('MapLibre instance is ready and style is loaded!');
      break;
    }
  }
  await sleep(4000);

  // 1. SATELLITE 3D WITH ORGANIC PRIORITY POLYGONS & VISIBLE STREETS
  console.log('Test 1: Assam Satellite 3D with Organic Polygons & Visible Road Network...');
  await client.evaluate(`
    (function() {
      const buttons = Array.from(document.querySelectorAll('button'));
      const satBtn = buttons.find(b => b.textContent && b.textContent.includes('Satellite 3D'));
      if (satBtn) satBtn.click();
    })()
  `);
  await sleep(4000);

  const shot1 = path.join(ARTIFACT_DIR, 'screenshot_satellite_3d_organic_zones.png');
  await client.captureScreenshot(shot1);

  // 2. STREETS 3D MODE WITH DENSE CARTOGRAPHY & HIGHWAYS/BRIDGES
  console.log('Test 2: Assam Streets 3D mode with dense cartography, bridges, and organic polygons...');
  await client.evaluate(`
    (function() {
      const buttons = Array.from(document.querySelectorAll('button'));
      const streetsBtn = buttons.find(b => b.textContent && b.textContent.includes('Streets 3D'));
      if (streetsBtn) streetsBtn.click();
    })()
  `);
  await sleep(4000);

  const shot2 = path.join(ARTIFACT_DIR, 'screenshot_streets_3d_road_detail.png');
  await client.captureScreenshot(shot2);

  // 3. SELECT RED PRIORITY ZONE TO OPEN GIS PRIORITY ZONE INSPECTOR PANEL
  console.log('Test 3: Selecting RED Priority Zone polygon to open GIS Inspector...');
  const zoneResult = await client.evaluate(`
    (function() {
      // Find RED priority zone feature in rendered features or geoJsonData
      const map = window.__maplibreInstance;
      let targetProps = null;
      if (map) {
        const features = map.queryRenderedFeatures({ layers: ['rescue-zones-fill'] });
        if (features && features.length > 0) {
          const redF = features.find(f => f.properties && (f.properties.priorityLevel === 'RED' || f.properties.priority === 'RED'));
          if (redF) targetProps = redF.properties;
        }
      }
      if (!targetProps && window.__geoJsonData && window.__geoJsonData.features) {
        const redF = window.__geoJsonData.features.find(f => f.properties && f.properties.entity === 'RESCUE_ZONE' && (f.properties.priority === 'RED' || f.properties.priorityLevel === 'RED'));
        if (redF) targetProps = redF.properties;
      }
      if (targetProps && window.__selectRescueZone) {
        window.__selectRescueZone(targetProps);
        return targetProps.name;
      }
      return false;
    })()
  `);
  console.log('Zone selection result:', zoneResult);
  await sleep(2500);

  const shot3 = path.join(ARTIFACT_DIR, 'screenshot_clicked_zone_inspector.png');
  await client.captureScreenshot(shot3);

  // Close inspector before switching disasters so clean view is visible
  await client.evaluate(`
    (function() {
      const closeBtn = document.querySelector('button[title="Close Inspector"]');
      if (closeBtn) closeBtn.click();
    })()
  `);
  await sleep(1000);

  // 4. J&K MOUNTAIN DISASTER — NH-44 SWITCHBACKS & ORGANIC SLOPE FAILURE CORRIDORS
  console.log('Test 4: Switching to J&K Mountain Landslide (NH-44 Corridor & Slope Corridors)...');
  await client.evaluate(`
    (function() {
      const select = document.querySelector('select');
      if (select) {
        select.value = 'jk-landslide-flood-recent';
        select.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
      return false;
    })()
  `);
  await sleep(5500);

  await client.evaluate(`
    (function() {
      const buttons = Array.from(document.querySelectorAll('button'));
      const satBtn = buttons.find(b => b.textContent && b.textContent.includes('Satellite 3D'));
      if (satBtn) satBtn.click();
    })()
  `);
  await sleep(4000);

  const shot4 = path.join(ARTIFACT_DIR, 'screenshot_jk_mountain_corridor.png');
  await client.captureScreenshot(shot4);

  // 5. SHIMLA MOUNTAIN LANDSLIDE — SUMMER HILL CHUTE & UNESCO RAIL
  console.log('Test 5: Switching to Shimla Valley Landslide...');
  await client.evaluate(`
    (function() {
      const select = document.querySelector('select');
      if (select) {
        select.value = 'shimla-landslide-recent';
        select.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
      return false;
    })()
  `);
  await sleep(5500);

  const shot5 = path.join(ARTIFACT_DIR, 'screenshot_shimla_mountain_organic_zones.png');
  await client.captureScreenshot(shot5);

  console.log('All 5 live GIS map tests completed and captured successfully!');
  chromeProc.kill();
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error in capture script:', err);
  process.exit(1);
});
