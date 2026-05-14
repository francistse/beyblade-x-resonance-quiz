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

  // Close any modal/overlay by pressing Escape
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  // Click the "開始測驗" (Start Quiz) button specifically
  console.log('Clicking Start Quiz button...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const startBtn = buttons.find(b => {
      const text = b.textContent?.trim();
      return text && (
        text.includes('開始測驗') ||
        text.includes('Start') ||
        text.includes('start')
      );
    });
    if (startBtn) startBtn.click();
    else console.log('Start button not found');
  });
  await new Promise(r => setTimeout(r, 2000));

  // Check we're on the quiz page
  let pageState = await page.evaluate(() => {
    const progressText = Array.from(document.querySelectorAll('p'))
      .find(p => p.textContent?.includes('問') || p.textContent?.includes('問'))
      ?.textContent?.trim();
    const optionButtons = Array.from(document.querySelectorAll('.gap-4 button'));
    const navButtons = Array.from(document.querySelectorAll('nav button, .flex button, button'));
    return {
      url: location.href,
      progressText,
      optionCount: optionButtons.length,
      navButtons: navButtons.map(b => b.textContent?.trim().substring(0, 30)),
    };
  });

  console.log('Quiz page state:', JSON.stringify(pageState, null, 2));

  if (pageState.optionCount === 0) {
    // Not on quiz page - try clicking again more carefully
    console.log('Not on quiz page, retrying...');
    await page.evaluate(() => {
      // The start button is usually the primary green button
      const allBtns = Array.from(document.querySelectorAll('button'));
      for (const btn of allBtns) {
        const text = btn.textContent?.trim();
        if (text && text.length > 5 && text.length < 10) {
          btn.click();
          return;
        }
      }
    });
    await new Promise(r => setTimeout(r, 2000));

    pageState = await page.evaluate(() => {
      const optionButtons = Array.from(document.querySelectorAll('.gap-4 button'));
      const allButtons = Array.from(document.querySelectorAll('button'));
      return {
        url: location.href,
        optionCount: optionButtons.length,
        allButtons: allButtons.map(b => b.textContent?.trim().substring(0, 30)),
      };
    });
    console.log('Retry quiz page state:', JSON.stringify(pageState, null, 2));
  }

  // Answer all 12 questions
  for (let i = 0; i < 12; i++) {
    console.log(`\n=== Question ${i + 1}/12 ===`);
    await new Promise(r => setTimeout(r, 800));

    // Get current question state
    const qState = await page.evaluate(() => {
      const optionButtons = Array.from(document.querySelectorAll('.gap-4 button'));
      const allButtons = Array.from(document.querySelectorAll('button'));
      const nextBtn = allButtons.find(b => {
        const text = b.textContent?.trim();
        return text && (
          text.includes('下一') ||
          text.includes('結果') ||
          text.includes('Next') ||
          text.includes('Result') ||
          text === '提交'
        );
      });
      return {
        optionCount: optionButtons.length,
        firstOption: optionButtons[0]?.textContent?.trim().substring(0, 60),
        nextBtnText: nextBtn?.textContent?.trim(),
      };
    });
    console.log(`  Options: ${qState.optionCount}, First: "${qState.firstOption}", Next: "${qState.nextBtnText}"`);

    if (qState.optionCount > 0) {
      // Click first option
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('.gap-4 button'));
        if (btns.length > 0) btns[0].click();
      });
      await new Promise(r => setTimeout(r, 300));

      // Click next/result
      await page.evaluate(() => {
        const allBtns = Array.from(document.querySelectorAll('button'));
        // Find the right-side button (next/result) in the nav
        // It's usually the last button or one with "Next/Result" text
        const navBtn = allBtns.find(b => {
          const text = b.textContent?.trim();
          return text && (
            text.includes('下一') ||
            text.includes('結果') ||
            text.includes('Next') ||
            text.includes('Result') ||
            text.includes('submit')
          );
        });
        if (navBtn) navBtn.click();
        else {
          // Fallback: click the last button (usually Next)
          const visibleBtns = allBtns.filter(b => b.offsetParent !== null);
          if (visibleBtns.length >= 2) visibleBtns[visibleBtns.length - 1].click();
        }
      });
    }
  }

  // Wait for results
  console.log('\nWaiting for results page...');
  await new Promise(r => setTimeout(r, 5000));

  // Results screenshot
  await page.screenshot({ path: '/tmp/quiz_result.png', fullPage: true });
  console.log('Result screenshot saved');

  // Check radar chart
  console.log('Checking radar chart...');
  const radarCheck = await page.evaluate(() => {
    const svgs = Array.from(document.querySelectorAll('svg'));
    const radarSvg = svgs.find(svg => {
      return svg.classList.contains('recharts-surface') ||
             svg.querySelector('.recharts-radar-grid');
    });

    const bodyText = document.body.innerText;
    return {
      url: location.href,
      hasRadarSurface: !!svgs.find(s => s.classList.contains('recharts-surface')),
      hasRadarSvg: !!radarSvg,
      radarSvgWidth: radarSvg ? radarSvg.clientWidth : 0,
      radarSvgHeight: radarSvg ? radarSvg.clientHeight : 0,
      totalSvgs: svgs.length,
      hasAttack: /attack|攻擊|アタック/i.test(bodyText),
      hasDefense: /defense|防禦|ディフェンス/i.test(bodyText),
      hasStamina: /stamina|耐力|スタミナ/i.test(bodyText),
      bodyTextPreview: bodyText.substring(0, 500),
    };
  });

  console.log('Radar diagnostics:', JSON.stringify(radarCheck, null, 2));

  if (radarCheck.hasRadarSurface && radarCheck.radarSvgWidth > 50 && radarCheck.radarSvgHeight > 50) {
    console.log('✅ STATUS: Radar chart is DISPLAYING CORRECTLY');
  } else if (radarCheck.hasRadarSvg) {
    console.log('⚠️ STATUS: Radar chart SVG exists but may have rendering issues');
  } else {
    console.log('❌ STATUS: Radar chart is NOT displaying');
  }

  // Final screenshot
  await page.screenshot({ path: '/tmp/quiz_final.png', fullPage: true });
  console.log('Final screenshot saved');

  await browser.close();
})().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
