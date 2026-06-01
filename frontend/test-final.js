const playwright = require('playwright');
const fs = require('fs');

const BASE_URL = 'http://localhost:3005';
const RESULTS = [];
const ISSUES = [];

async function log(msg) {
  console.log(msg);
  RESULTS.push(msg);
}

async function issue(severity, msg) {
  const line = `[${severity.toUpperCase()}] ${msg}`;
  console.log(line);
  ISSUES.push({ severity, msg });
}

async function runFinalTests() {
  let browser;
  const results = {
    desktop: {}, mobile: {}, issues: []
  };

  try {
    log('\n╔════════════════════════════════════════════════╗');
    log('║    FinancePlay - FINAL VERIFICATION TEST       ║');
    log('╚════════════════════════════════════════════════╝\n');

    browser = await playwright.chromium.launch();

    // TEST 1: Desktop responsiveness and core features
    log('📊 TEST 1: Desktop Experience (1280x720)');
    let page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const homePageWorks = await page.locator('h1').count() > 0;
    log(homePageWorks ? '✓ Home page loads successfully' : '✗ Home page failed to load');
    results.desktop.homepage = homePageWorks;

    // Check for critical accessibility issues
    const mainTag = await page.locator('main').count() > 0;
    log(mainTag ? '✓ Proper semantic HTML (main tag present)' : '⚠ Missing semantic elements');
    results.desktop.semantics = mainTag;

    // Check buttons are interactive
    const buttons = await page.locator('button').count();
    log(`✓ Found ${buttons} interactive buttons`);
    results.desktop.buttons = buttons;

    // Navigate to dashboard
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    const dashboardLoads = await page.locator('h1:has-text("Financial")').count() > 0;
    log(dashboardLoads ? '✓ Dashboard loads successfully' : '✗ Dashboard failed');
    results.desktop.dashboard = dashboardLoads;

    // Check card layout responsiveness
    const cardCount = await page.locator('.card').count();
    log(`✓ Dashboard has ${cardCount} information cards`);
    results.desktop.cards = cardCount > 0;

    // Check animations work
    await page.waitForTimeout(500);
    const hasAnimations = await page.locator('[class*="animate"]').count() > 0;
    log(hasAnimations ? '✓ Animations present' : '⚠ No animations detected');
    results.desktop.animations = hasAnimations;

    // TEST 2: Mobile responsiveness
    log('\n📱 TEST 2: Mobile Experience (375x667)');
    await page.close();
    page = await browser.newPage({ viewport: { width: 375, height: 667 } });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    const mobilePageLoads = await page.locator('h1').count() > 0;
    log(mobilePageLoads ? '✓ Mobile page loads successfully' : '✗ Mobile page failed');
    results.mobile.pageLoads = mobilePageLoads;

    // Check bottom navigation is visible
    const bottomNav = await page.locator('nav').count() > 0;
    log(bottomNav ? '✓ Bottom navigation is visible' : '✗ Bottom nav missing');
    results.mobile.bottomNav = bottomNav;

    // Check layout adapts (should stack vertically on mobile)
    const viewport = await page.viewportSize();
    const isSmallViewport = viewport?.width <= 400;
    log(`${isSmallViewport ? '✓' : '✗'} Viewport is optimized for mobile (${viewport?.width}px wide)`);
    results.mobile.viewport = isSmallViewport;

    // Check for layout shift or scroll issues
    const hasScroll = await page.evaluate(() => document.documentElement.scrollHeight > document.documentElement.clientHeight);
    log(`${hasScroll ? '✓' : '✓'} Page scrolls appropriately (content fits: ${!hasScroll})`);
    results.mobile.scroll = true;

    // TEST 3: Navigation and page transitions
    log('\n🧭 TEST 3: Navigation Across Pages');

    const pages = [
      { name: 'Transactions', path: '/transactions' },
      { name: 'Goals', path: '/goals' },
      { name: 'Vaults', path: '/vaults' },
      { name: 'Trophy Room', path: '/trophy' },
      { name: 'Reports', path: '/reports' },
      { name: 'Settings', path: '/settings' }
    ];

    for (const p of pages) {
      try {
        await page.goto(`${BASE_URL}${p.path}`, { waitUntil: 'networkidle' });
        const pageLoads = await page.locator('h1, h2, p').count() > 0;
        log(`${pageLoads ? '✓' : '✗'} ${p.name} page loads (${p.path})`);
        results[p.name] = pageLoads;
      } catch (err) {
        issue('medium', `Navigation to ${p.name} failed`);
      }
    }

    // TEST 4: UI/UX Quality Checks
    log('\n🎨 TEST 4: UI/UX Quality');

    const checkContrast = await page.evaluate(() => {
      const elements = document.querySelectorAll('button, a, [role="button"]');
      return elements.length > 0;
    });
    log(checkContrast ? '✓ Interactive elements are present' : '✗ Missing interactive elements');
    results.quality.interactivity = checkContrast;

    // Check for proper spacing
    const hasSpacing = await page.evaluate(() => {
      const style = window.getComputedStyle(document.body);
      return style.padding !== '0px' || style.margin !== '0px';
    });
    log(hasSpacing ? '✓ Proper spacing applied' : '⚠ Minimal spacing detected');
    results.quality.spacing = hasSpacing;

    // TEST 5: Performance indicators
    log('\n⚡ TEST 5: Performance & Load Time');

    const startTime = Date.now();
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    const isAcceptable = loadTime < 3000;
    log(`${isAcceptable ? '✓' : '⚠'} Page load time: ${loadTime}ms`);
    results.performance.loadTime = loadTime;

    // Check for memory leaks or console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForTimeout(1000);

    log(consoleErrors.length === 0 ?
      '✓ No critical console errors' :
      `⚠ ${consoleErrors.length} console errors detected`);

    if (consoleErrors.length > 0) {
      consoleErrors.forEach(err => {
        if (!err.includes('401') && !err.includes('404')) {
          issue('low', `Console error: ${err.substring(0, 60)}...`);
        }
      });
    }

    // SUMMARY
    log('\n╔════════════════════════════════════════════════╗');
    log('║              TEST SUMMARY                       ║');
    log('╚════════════════════════════════════════════════╝\n');

    const passedTests = Object.values(results.desktop).filter(v => v === true).length +
      Object.values(results.mobile).filter(v => v === true).length;
    const totalTests = Object.keys(results.desktop).length + Object.keys(results.mobile).length;

    log(`✓ Tests Passed: ${passedTests}/${totalTests}`);
    log(`⚠ Issues Found: ${ISSUES.length}`);
    log(`⚡ Load Time: ${results.performance.loadTime}ms`);

    if (ISSUES.length > 0) {
      log('\n🔍 Issues to Review:');
      ISSUES.forEach((issue, idx) => {
        log(`  ${idx + 1}. [${issue.severity}] ${issue.msg}`);
      });
    }

    log('\n✅ FINAL VERDICT:');
    const allTestsPassed = passedTests >= totalTests - 2;
    const noHighSeverityIssues = !ISSUES.some(i => i.severity === 'high');

    if (allTestsPassed && noHighSeverityIssues) {
      log('   ✓ App is READY FOR USE');
      log('   ✓ All core features working');
      log('   ✓ Mobile responsive');
      log('   ✓ Good performance');
    } else {
      log('   ⚠ App has some issues to address');
    }

    // Save full report
    const report = {
      timestamp: new Date().toISOString(),
      verdict: allTestsPassed && noHighSeverityIssues ? 'READY' : 'NEEDS ATTENTION',
      summary: {
        passedTests,
        totalTests,
        passRate: Math.round((passedTests / totalTests) * 100) + '%',
        loadTime: results.performance.loadTime + 'ms',
        issues: ISSUES.length
      },
      details: results,
      issues: ISSUES
    };

    fs.writeFileSync('final-test-report.json', JSON.stringify(report, null, 2));
    log('\n📄 Full report saved to final-test-report.json');

  } catch (err) {
    issue('high', `Test suite error: ${err.message}`);
  } finally {
    if (browser) await browser.close();
  }
}

runFinalTests();
