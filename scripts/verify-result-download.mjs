/**
 * Builds the app, serves preview, completes the quiz in headless Chrome,
 * clicks Download Image, and asserts a PNG lands in .verify-downloads/
 *
 * Usage: npm run verify:download
 */
import { spawn } from 'node:child_process';
import { mkdir, readdir } from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DL_DIR = path.join(ROOT, '.verify-downloads');
const REPO_BASE = '/beyblade-x-resonance-quiz/';

function getFreePort() {
  return new Promise((resolve, reject) => {
    const s = net.createServer();
    s.listen(0, 'localhost', () => {
      const addr = s.address();
      const port = typeof addr === 'object' && addr ? addr.port : null;
      s.close(() => (port ? resolve(port) : reject(new Error('no port'))));
    });
    s.on('error', reject);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { cwd: ROOT, shell: true, ...opts });
    let err = '';
    p.stderr?.on('data', (d) => {
      err += String(d);
    });
    p.on('error', reject);
    p.on('exit', (code) => {
      if (code === 0) resolve(undefined);
      else reject(new Error(`${cmd} ${args.join(' ')} exit ${code}\n${err}`));
    });
  });
}

async function waitForHttpOk(url, maxMs = 90000) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (res.ok) return;
    } catch {
      /* not ready */
    }
    await sleep(400);
  }
  throw new Error(`HTTP not ready: ${url}`);
}

async function main() {
  await mkdir(DL_DIR, { recursive: true });
  const before = new Set(await readdir(DL_DIR));

  console.log('Building…');
  await run('npm', ['run', 'build']);

  console.log('Starting vite preview…');
  const port = await getFreePort();
  const origin = `http://localhost:${port}`;
  let previewLog = '';
  const preview = spawn('npx', ['vite', 'preview', '--port', String(port), '--strictPort'], {
    cwd: ROOT,
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  preview.stdout?.on('data', (d) => {
    previewLog += String(d);
  });
  preview.stderr?.on('data', (d) => {
    previewLog += String(d);
  });

  const entryUrl = `${origin}${REPO_BASE}`;

  try {
    try {
      await waitForHttpOk(entryUrl);
    } catch (e) {
      console.error('Preview log (HTTP wait failed):\n', previewLog.slice(-6000));
      throw e;
    }
    await sleep(500);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const client = await page.createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: DL_DIR,
    });

    console.log('Opening', entryUrl);
    await page.goto(entryUrl, { waitUntil: 'networkidle2', timeout: 90000 });

    await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find((x) =>
        (x.textContent || '').includes('開始測驗')
      );
      if (!b) throw new Error('Start button (開始測驗) not found');
      b.click();
    });

    await page.waitForFunction(() => document.body.innerText.includes('基本資料'), {
      timeout: 30000,
    });

    await page.evaluate(() => {
      const male = [...document.querySelectorAll('button')].find((x) => (x.textContent || '').trim() === '男性');
      const age = [...document.querySelectorAll('button')].find((x) => (x.textContent || '').includes('18-24'));
      if (!male || !age) throw new Error('Demographics options not found');
      male.click();
      age.click();
    });

    await sleep(500);

    await page.evaluate(() => {
      const candidates = [...document.querySelectorAll('div.flex.justify-center > button')];
      const btn =
        candidates.find((b) => (b.textContent || '').includes('下一題')) ||
        [...document.querySelectorAll('button')].find((b) => (b.textContent || '').trim() === '下一題' && !b.disabled);
      if (!btn || btn.disabled) throw new Error('Demographics Next not found');
      btn.click();
    });

    for (let i = 0; i < 12; i++) {
      await page.waitForFunction(
        () => document.body.innerText.includes('第') && document.body.innerText.includes('題'),
        { timeout: 30000 }
      );
      await page.evaluate(() => {
        const opt = document.querySelector('div.w-full.max-w-2xl.mx-auto.p-4 div.grid.gap-4 button');
        if (!opt) throw new Error('Question option not found');
        opt.click();
      });
      await sleep(120);
      await page.evaluate(() => {
        const row = document.querySelector(
          '.max-w-2xl.mx-auto.mt-6.px-4.flex.justify-between.items-center'
        );
        if (!row) throw new Error('Quiz nav row not found');
        const next = row.querySelector('button:last-of-type');
        if (!next || next.disabled) throw new Error('Quiz Next disabled or missing');
        next.click();
      });
      await sleep(200);
    }

    await page.waitForSelector('[data-share-card]', { timeout: 30000 });
    console.log('Result page ready.');

    await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find((x) =>
        (x.textContent || '').includes('下載圖片')
      );
      if (!b) throw new Error('Download button not found');
      b.click();
    });

    const deadline = Date.now() + 30000;
    let png;
    while (Date.now() < deadline) {
      const now = await readdir(DL_DIR);
      png = now.find((f) => f.endsWith('.png') && !before.has(f));
      if (png) break;
      const toastOk = await page.evaluate(() =>
        document.body.innerText.includes('下載成功')
      );
      if (toastOk) {
        png = '(ui-success-toast)';
        break;
      }
      await sleep(400);
    }

    await browser.close();

    if (!png) {
      console.error('Preview server log:\n', previewLog.slice(-4000));
      throw new Error('No new PNG in download folder — image download may have failed.');
    }

    console.log('OK — downloaded file:', png);
  } finally {
    preview.kill('SIGTERM');
    await sleep(400);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
