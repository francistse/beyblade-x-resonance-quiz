import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Navigating to http://localhost:5173 ...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  // Dump the initial page structure
  console.log('=== Initial Page DOM ===');
  const initialDom = await page.evaluate(() => {
    const allButtons = Array.from(document.querySelectorAll('button'));
    const allGrids = Array.from(document.querySelectorAll('[class*="grid"]'));
    const allDivs = Array.from(document.querySelectorAll('div'));
    return {
      buttonCount: allButtons.length,
      buttonTexts: allButtons.map(b => b.textContent?.trim().substring(0, 50)),
      gridCount: allGrids.length,
      gridClasses: allGrids.map(g => g.className.substring(0, 80)),
      bodyClasses: document.body.className.substring(0, 120),
      title: document.title,
      url: location.href,
    };
  });
  console.log(JSON.stringify(initialDom, null, 2));

  // Take screenshot
  await page.screenshot({ path: '/tmp/debug1_intro.png' });

  // Click the first button (should be Start)
  console.log('\nClicking first button...');
  await page.evaluate(() => {
    const btn = document.querySelector('button');
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 3000));

  // Dump post-click DOM
  console.log('=== Post-Click DOM ===');
  const postDom = await page.evaluate(() => {
    const allButtons = Array.from(document.querySelectorAll('button'));
    const allGrids = Array.from(document.querySelectorAll('[class*="grid"]'));
    return {
      buttonCount: allButtons.length,
      buttonTexts: allButtons.map(b => b.textContent?.trim().substring(0, 50)),
      gridCount: allGrids.length,
      gridClasses: allGrids.map(g => g.className.substring(0, 80)),
      url: location.href,
      // Look for question-related elements
      hasQuestion: !!document.querySelector('[class*="question"]') || !!document.querySelector('[class*="Question"]'),
      hasQuiz: !!document.querySelector('[class*="quiz"]') || !!document.querySelector('[class*="Quiz"]'),
    };
  });
  console.log(JSON.stringify(postDom, null, 2));

  await page.screenshot({ path: '/tmp/debug2_after_start.png' });

  // Try clicking all buttons to see what happens
  if (postDom.buttonCount > 0) {
    console.log('\nTrying to click button by text...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => {
        const t = b.textContent?.trim();
        return t && t.length > 0;
      });
      if (btn) {
        btn.click();
        console.log('Clicked button:', btn.textContent?.trim());
      }
    });

    await new Promise(r => setTimeout(r, 3000));

    // Check again
    const afterClickDom = await page.evaluate(() => {
      const allButtons = Array.from(document.querySelectorAll('button'));
      const allGrids = Array.from(document.querySelectorAll('[class*="grid"]'));
      const allDivsWithGap4 = Array.from(document.querySelectorAll('.gap-4'));
      return {
        buttonCount: allButtons.length,
        buttonTexts: allButtons.map(b => b.textContent?.trim().substring(0, 50)),
        gridCount: allGrids.length,
        gap4Count: allDivsWithGap4.length,
        url: location.href,
      };
    });
    console.log(JSON.stringify(afterClickDom, null, 2));

    await page.screenshot({ path: '/tmp/debug3_after_click.png' });
  }

  await browser.close();
})().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
