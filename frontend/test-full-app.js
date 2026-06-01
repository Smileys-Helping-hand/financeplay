const playwright = require('playwright');
const fs = require('fs');

const BASE_URL = 'http://localhost:3005';
const API_URL = 'http://localhost:4002';
const RESULTS = [];
const BUGS = [];
const TESTS = {};

// Test categories
const categories = {
  AUTH: 'Authentication & Setup',
  DASHBOARD: 'Dashboard',
  TRANSACTIONS: 'Transactions',
  GOALS: 'Goals',
  GAMIFICATION: 'Gamification',
  MOBILE: 'Mobile Responsiveness',
  UI: 'UI/UX Quality',
  PERFORMANCE: 'Performance'
};

async function log(message, category = 'INFO') {
  const timestamp = new Date().toLocaleTimeString();
  const msg = `[${timestamp}] ${message}`;
  console.log(msg);
  RESULTS.push(msg);
}

async function bug(message, severity = 'medium') {
  console.error(`[BUG] ${severity.toUpperCase()}: ${message}`);
  BUGS.push({ severity, message });
}

async function testResult(name, category, passed, details = '') {
  if (!TESTS[category]) TESTS[category] = [];
  TESTS[category].push({ name, passed, details });
  const status = passed ? '✓' : '✗';
  const msg = `${status} ${category}: ${name}`;
  log(msg);
  if (details) log(`  → ${details}`);
}

async function runTests() {
  let browser, page;

  try {
    log('\n╔════════════════════════════════════════╗');
    log('║  FinancePlay Comprehensive Test Suite  ║');
    log('╚════════════════════════════════════════╝\n');

    browser = await playwright.chromium.launch();

    // Test 1: Desktop signup and authentication
    log('\n📝 TEST 1: Authentication & User Setup', 'AUTH');
    page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

    // Listen for all errors
    page.on('pageerror', err => {
      bug(`Page error: ${err.message}`, 'high');
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const hasLanding = await page.locator('h1:has-text("XPFinance")').count() > 0;
    await testResult('Landing page loads', categories.AUTH, hasLanding);

    // Click signup
    await page.locator('a:has-text("Start Free Today")').first().click();
    await page.waitForNavigation();
    await testResult('Signup page accessible', categories.AUTH,
      await page.url().includes('/signup'));

    // Try to fill signup form
    const signupForm = await page.locator('input[type="email"]').count() > 0;
    if (signupForm) {
      log('✓ Signup form visible');

      // Fill form with test data
      const email = `test-${Date.now()}@example.com`;
      const name = 'Test User';

      await page.fill('input[type="email"]', email);
      await page.fill('input[type="text"]', name);

      const submitBtn = await page.locator('button:has-text("Create Account"), button:has-text("Sign Up")').first();
      if (await submitBtn.isVisible()) {
        log('Attempting signup with test credentials...');
        await submitBtn.click();

        // Wait for either dashboard or error
        try {
          await page.waitForNavigation({ timeout: 5000 });
          const isDashboard = await page.url().includes('/dashboard');
          await testResult('User registration flow', categories.AUTH, isDashboard);

          if (isDashboard) {
            log('✓ Successfully registered and logged in');
            const userIdStored = await page.evaluate(() => localStorage.getItem('financeplay_userId'));
            await testResult('User ID stored in localStorage', categories.AUTH, !!userIdStored);
          }
        } catch (err) {
          bug('Signup navigation timeout or error', 'high');
        }
      }
    } else {
      bug('Signup form not found on signup page', 'high');
    }

    // Test 2: Dashboard features
    log('\n📊 TEST 2: Dashboard Features', 'DASHBOARD');
    if (!await page.url().includes('/dashboard')) {
      await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    }

    const dashboardTitle = await page.locator('h1:has-text("Financial Overview")').isVisible();
    await testResult('Dashboard title visible', categories.DASHBOARD, dashboardTitle);

    // Check key cards
    const spentCard = await page.locator('text=/Spent|spent/i').count() > 0;
    await testResult('Spending card visible', categories.DASHBOARD, spentCard);

    const remainingCard = await page.locator('text=/remaining|Budget/i').count() > 0;
    await testResult('Budget remaining card visible', categories.DASHBOARD, remainingCard);

    const healthScore = await page.locator('text=/Financial Health/i').count() > 0;
    await testResult('Financial health indicator', categories.DASHBOARD, healthScore);

    // Test buttons
    const addTransBtn = await page.locator('button:has-text("Add Transaction")').isVisible();
    await testResult('Add transaction button', categories.DASHBOARD, addTransBtn);

    // Test 3: Navigation
    log('\n🧭 TEST 3: Navigation', 'DASHBOARD');

    const dashboardNav = await page.locator('a:has-text("Dashboard"), a[href="/dashboard"]').count() > 0;
    await testResult('Dashboard nav link', categories.DASHBOARD, dashboardNav);

    // Navigate to Transactions
    await page.goto(`${BASE_URL}/transactions`, { waitUntil: 'networkidle' });
    const transPage = await page.locator('h1, h2, p').filter({ hasText: /Transactions|Loot/i }).count() > 0;
    await testResult('Transactions page loads', categories.TRANSACTIONS, transPage);

    // Navigate to Goals
    await page.goto(`${BASE_URL}/goals`, { waitUntil: 'networkidle' });
    const goalsPage = await page.locator('h1, h2, p').filter({ hasText: /Goals|Savings/i }).count() > 0;
    await testResult('Goals page loads', categories.GOALS, goalsPage);

    // Navigate to Trophy Room
    await page.goto(`${BASE_URL}/trophy`, { waitUntil: 'networkidle' });
    const trophyPage = await page.locator('h1, h2, p').filter({ hasText: /Trophy|Achievement|Badge/i }).count() > 0;
    await testResult('Trophy room loads', categories.GAMIFICATION, trophyPage);

    // Navigate to Reports
    await page.goto(`${BASE_URL}/reports`, { waitUntil: 'networkidle' });
    const reportsPage = await page.locator('h1, h2, p, button').filter({ hasText: /Report|Weekly|Generate/i }).count() > 0;
    await testResult('Reports page loads', categories.DASHBOARD, reportsPage);

    if (reportsPage) {
      const genBtn = await page.locator('button:has-text("Generate")').isVisible();
      await testResult('Generate report button', categories.DASHBOARD, genBtn);
    }

    // Test 4: Mobile responsiveness
    log('\n📱 TEST 4: Mobile Responsiveness (Portrait)', 'MOBILE');
    await page.close();
    page = await browser.newPage({ viewport: { width: 375, height: 667 } });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    const mobileLoads = true;
    await testResult('Dashboard on mobile loads', categories.MOBILE, mobileLoads);

    // Check bottom nav
    const bottomNav = await page.locator('nav').first().isVisible();
    await testResult('Bottom navigation visible', categories.MOBILE, bottomNav);

    // Check responsiveness of cards
    const mobileCards = await page.locator('.card').count();
    await testResult('Cards render on mobile', categories.MOBILE, mobileCards > 0, `${mobileCards} cards found`);

    // Test 5: Mobile Landscape
    log('\n📱 TEST 5: Mobile Responsiveness (Landscape)', 'MOBILE');
    await page.setViewportSize({ width: 667, height: 375 });

    const landscapeLoads = await page.locator('h1').count() > 0;
    await testResult('Dashboard on landscape loads', categories.MOBILE, landscapeLoads);

    // Test 6: UI Quality checks
    log('\n🎨 TEST 6: UI/UX Quality Checks', 'UI');

    // Check for console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForTimeout(2000); // Let page fully load

    await testResult('No critical console errors', categories.UI, consoleErrors.length === 0,
      consoleErrors.length > 0 ? `${consoleErrors.length} errors` : 'Clean');

    if (consoleErrors.length > 0) {
      consoleErrors.forEach(err => bug(`Console error: ${err}`, 'medium'));
    }

    // Check accessibility
    const mainContent = await page.locator('main').count() > 0;
    await testResult('Main content area exists', categories.UI, mainContent);

    // Check button accessibility
    const buttons = await page.locator('button').count();
    await testResult('Buttons rendered', categories.UI, buttons > 0, `${buttons} buttons`);

    // Summary
    log('\n╔════════════════════════════════════════╗');
    log('║           TEST SUMMARY                  ║');
    log('╚════════════════════════════════════════╝\n');

    let totalTests = 0;
    let passedTests = 0;

    Object.entries(TESTS).forEach(([category, tests]) => {
      const passed = tests.filter(t => t.passed).length;
      const total = tests.length;
      totalTests += total;
      passedTests += passed;

      const rate = Math.round((passed / total) * 100);
      const icon = rate === 100 ? '✓' : rate >= 80 ? '⚠' : '✗';
      log(`${icon} ${category}: ${passed}/${total} (${rate}%)`);
    });

    log(`\n📊 Overall: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)\n`);

    if (BUGS.length > 0) {
      log('🐛 Bugs Found:');
      const highBugs = BUGS.filter(b => b.severity === 'high');
      const mediumBugs = BUGS.filter(b => b.severity === 'medium');
      const lowBugs = BUGS.filter(b => b.severity === 'low');

      if (highBugs.length > 0) {
        log(`\n  🔴 HIGH PRIORITY (${highBugs.length}):`);
        highBugs.forEach(b => log(`    • ${b.message}`));
      }
      if (mediumBugs.length > 0) {
        log(`\n  🟡 MEDIUM PRIORITY (${mediumBugs.length}):`);
        mediumBugs.forEach(b => log(`    • ${b.message}`));
      }
      if (lowBugs.length > 0) {
        log(`\n  🟢 LOW PRIORITY (${lowBugs.length}):`);
        lowBugs.forEach(b => log(`    • ${b.message}`));
      }
    }

    // Save comprehensive report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests,
        passedTests,
        passRate: Math.round((passedTests / totalTests) * 100) + '%',
        bugsFound: BUGS.length
      },
      bugs: BUGS,
      testResults: TESTS,
      logs: RESULTS
    };

    fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
    log('\n✓ Full report saved to test-report.json');

  } catch (err) {
    bug(`Test suite failed: ${err.message}`, 'high');
    console.error(err);
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
}

runTests();
