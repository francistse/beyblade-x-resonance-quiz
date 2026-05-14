import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ 
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();

// Listen to console messages
page.on('console', msg => {
  const type = msg.type();
  if (type === 'error' || type === 'warning') {
    console.log(`[BROWSER ${type.toUpperCase()}] ${msg.text()}`);
  }
});

console.log('Navigating to quiz app...');
await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 30000 });

await page.waitForSelector('button', { timeout: 10000 });
console.log('✓ Home page loaded');

// Click start button
await page.evaluate(() => {
  const buttons = Array.from(document.querySelectorAll('button'));
  const btn = buttons.find(b => 
    b.textContent.includes('Start') || 
    b.textContent.includes('開始') || 
    b.textContent.includes('开始') ||
    b.textContent.includes('Quiz')
  );
  if (btn) btn.click();
});
console.log('✓ Started quiz');

await new Promise(resolve => setTimeout(resolve, 2000));

// Auto-answer 5 questions
for (let i = 0; i < 5; i++) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const answered = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    // Find option buttons (exclude navigation buttons)
    const optionBtn = buttons.find(b => {
      const text = b.textContent.trim();
      return text.length > 2 && 
             !text.includes('Start') &&
             !text.includes('Share') &&
             !text.includes('繁體') &&
             !text.includes('簡體') &&
             !text.includes('English') &&
             !text.includes('下一題') &&
             !text.includes('Submit') &&
             !text.includes('Submit & See') &&
             !text.includes('提交') &&
             !text.includes('查看結果') &&
             !text.includes('Male') &&
             !text.includes('Female') &&
             !text.includes('Other') &&
             !text.includes('Prefer') &&
             !text.includes('以下') &&
             !text.includes('歲') &&
             !text.includes('以上');
    });
    if (optionBtn) {
      optionBtn.click();
      return true;
    }
    return false;
  });
  
  if (answered) {
    console.log(`✓ Answered question ${i + 1}`);
  }
}

// Wait for demographic form
console.log('Waiting for demographic form...');
await new Promise(resolve => setTimeout(resolve, 2000));

// Fill demographic form
console.log('Filling demographic form...');

// Select gender (first option)
await page.evaluate(() => {
  const buttons = Array.from(document.querySelectorAll('button'));
  const genderBtn = buttons.find(b => 
    b.textContent.includes('Male') || b.textContent.includes('男性')
  );
  if (genderBtn) genderBtn.click();
});
console.log('✓ Selected gender');
await new Promise(resolve => setTimeout(resolve, 500));

// Select age range
await page.evaluate(() => {
  const buttons = Array.from(document.querySelectorAll('button'));
  const ageBtn = buttons.find(b => 
    b.textContent.includes('18-24')
  );
  if (ageBtn) ageBtn.click();
});
console.log('✓ Selected age range');
await new Promise(resolve => setTimeout(resolve, 500));

// Click next/submit
await page.evaluate(() => {
  const buttons = Array.from(document.querySelectorAll('button'));
  const nextBtn = buttons.find(b => {
    const text = b.textContent.trim();
    return text.includes('下一題') || 
           text.includes('Submit') || 
           text.includes('查看結果') ||
           text.includes('Submit & See');
  });
  if (nextBtn) {
    nextBtn.click();
    return true;
  }
  return false;
});
console.log('✓ Submitted demographic form');

// Wait for result page
console.log('Waiting for result page...');
await new Promise(resolve => setTimeout(resolve, 4000));

await page.screenshot({ path: '/tmp/result-page.png', fullPage: true });
console.log('✓ Result page screenshot saved');

// Look for download button
const hasDownload = await page.evaluate(() => {
  const buttons = Array.from(document.querySelectorAll('button'));
  const downloadBtn = buttons.find(b => 
    b.textContent.includes('Download') || 
    b.textContent.includes('下載') ||
    b.textContent.includes('生成')
  );
  return downloadBtn ? downloadBtn.textContent.trim() : null;
});

if (hasDownload) {
  console.log(`✓ Found download button: "${hasDownload}"`);
  
  // Click download
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const downloadBtn = buttons.find(b => 
      b.textContent.includes('Download') || 
      b.textContent.includes('下載') ||
      b.textContent.includes('生成')
    );
    if (downloadBtn) downloadBtn.click();
  });
  
  console.log('✓ Clicked download button');
  console.log('Waiting for image generation...');
  
  // Wait for generation to complete
  await new Promise(resolve => setTimeout(resolve, 8000));
  
  await page.screenshot({ path: '/tmp/after-download.png', fullPage: true });
  console.log('✓ After download screenshot saved');
} else {
  console.log('✗ Download button not found');
  console.log('Buttons found:');
  const allBtns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim().substring(0, 30));
  });
  console.log(allBtns);
}

await browser.close();
console.log('\n✓ Test completed!');
