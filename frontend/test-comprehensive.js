const playwright = require('playwright');
const fs = require('fs');

const BASE_URL = 'http://localhost:3005';
const RESULTS = [];
const ERRORS = [];

async function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
  RESULTS.push(message);
}

async function error(message) {
  console.error(`[ERROR] ${message}`);
  ERRORS.push(message);
}

async function testApp() {
  let browser, page;

  try {
    // Launch browser
    browser = await playwright.chromium.launch();

    // Test 1: Desktop viewport
    log('\n=== TEST 1: DESKTOP VIEWPORT NAVIGATION ===');
    page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

    // Listen for console messages and errors
    page.on('console', msg => {
      if (msg.type() === 'error') error(`Console Error: ${msg.text()}`);
      if (msg.type() === 'warning') log(`Console Warning: ${msg.text()}`);
    });

    page.on('pageerror', err => {
      error(`Page Error: ${err.message}`);
    });

    // Navigate to home
    log('Navigating to home...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    log('✓ Home loaded');

    // Navigate to dashboard
    log('Navigating to dashboard...');
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    const dashboardTitle = await page.locator('h1:has-text("Financial Overview")').isVisible();
    if (dashboardTitle) log('✓ Dashboard loaded with proper title');
    else error('Dashboard title not found');

    // Test dashboard buttons
    log('\nTesting dashboard buttons...');
    const addTransBtn = await page.locator('button:has-text("Add Transaction")');
    if (await addTransBtn.isVisible()) {
      log('✓ Add Transaction button visible');
      await addTransBtn.click();
      await page.waitForNavigation();
      log('✓ Add Transaction button clickable');
    } else {
      error('Add Transaction button not visible');
    }

    // Navigate to transactions page
    log('\nNavigating to transactions page...');
    await page.goto(`${BASE_URL}/transactions`, { waitUntil: 'networkidle' });
    const transTitle = await page.locator('text=/Transactions|Loot/i').first().isVisible();
    if (transTitle) log('✓ Transactions page loaded');
    else error('Transactions page title not found');

    // Test transaction form (look for category buttons)
    log('\nTesting transaction form...');
    const categoryButtons = await page.locator('[role="button"]:has-text("Food")').count();
    log(`Found ${categoryButtons} category button(s)`);

    // Try creating a transaction
    log('\nAttempting to create test transaction...');
    const amountInput = await page.locator('input[type="number"]').first();
    if (await amountInput.isVisible()) {
      await amountInput.fill('100');
      log('✓ Amount field filled');
    }

    const descInput = await page.locator('input[type="text"]').first();
    if (await descInput.isVisible()) {
      await descInput.fill('Test Transaction');
      log('✓ Description field filled');
    }

    // Navigate to Goals
    log('\n=== TEST 2: GOALS PAGE ===');
    await page.goto(`${BASE_URL}/goals`, { waitUntil: 'networkidle' });
    const goalsTitle = await page.locator('text=/Goals|Savings/i').first().isVisible();
    if (goalsTitle) log('✓ Goals page loaded');
    else error('Goals page not found');

    // Navigate to Vaults
    log('\n=== TEST 3: VAULTS PAGE ===');
    await page.goto(`${BASE_URL}/vaults`, { waitUntil: 'networkidle' });
    const vaultsLoaded = await page.locator('text=/Vaults|Dream/i').first().isVisible();
    if (vaultsLoaded) log('✓ Vaults page loaded');
    else error('Vaults page not found');

    // Navigate to Trophy Room
    log('\n=== TEST 4: TROPHY ROOM ===');
    await page.goto(`${BASE_URL}/trophy`, { waitUntil: 'networkidle' });
    const trophyLoaded = await page.locator('text=/Trophy|Achievement/i').first().isVisible();
    if (trophyLoaded) log('✓ Trophy room loaded');
    else error('Trophy room not found');

    // Navigate to Log (Loot)
    log('\n=== TEST 5: LOG/LOOT PAGE ===');
    await page.goto(`${BASE_URL}/log`, { waitUntil: 'networkidle' });
    const logLoaded = await page.locator('text=/Log|Loot/i').first().isVisible();
    if (logLoaded) log('✓ Log/Loot page loaded');
    else error('Log page not found');

    // Navigate to Reports
    log('\n=== TEST 6: REPORTS PAGE ===');
    await page.goto(`${BASE_URL}/reports`, { waitUntil: 'networkidle' });
    const reportsLoaded = await page.locator('text=/Reports|Chart/i').first().isVisible();
    if (reportsLoaded) log('✓ Reports page loaded');
    else error('Reports page not found');

    // Navigate to Loans
    log('\n=== TEST 7: LOANS PAGE ===');
    await page.goto(`${BASE_URL}/loans`, { waitUntil: 'networkidle' });
    const loansLoaded = await page.locator('text=/Loans|Borrow/i').first().isVisible();
    if (loansLoaded) log('✓ Loans page loaded');
    else error('Loans page not found');

    // Test mobile responsiveness
    log('\n=== TEST 8: MOBILE VIEWPORT (Portrait) ===');
    await page.close();
    page = await browser.newPage({ viewport: { width: 375, height: 667 } });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    log('✓ Dashboard loaded on mobile');

    // Check bottom nav exists on mobile
    const bottomNav = await page.locator('nav').first();
    if (await bottomNav.isVisible()) {
      log('✓ Bottom navigation visible on mobile');
    } else {
      error('Bottom navigation not visible on mobile');
    }

    // Test mobile landscape
    log('\n=== TEST 9: MOBILE VIEWPORT (Landscape) ===');
    await page.close();
    page = await browser.newPage({ viewport: { width: 667, height: 375 } });

    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    log('✓ Dashboard loaded on mobile landscape');

    // Test Settings
    log('\n=== TEST 10: SETTINGS PAGE ===');
    await page.goto(`${BASE_URL}/settings`, { waitUntil: 'networkidle' });
    const settingsLoaded = await page.locator('text=/Settings|Preferences/i').first().isVisible();
    if (settingsLoaded) log('✓ Settings page loaded');
    else error('Settings page not found');

    // Summary
    log('\n\n=== TEST SUMMARY ===');
    log(`Total tests passed: ${RESULTS.length}`);
    log(`Total errors: ${ERRORS.length}`);

    if (ERRORS.length > 0) {
      log('\nErrors found:');
      ERRORS.forEach(e => log(`  - ${e}`));
    }

    // Save results
    fs.writeFileSync('test-results.txt', RESULTS.join('\n') + '\n\n=== ERRORS ===\n' + ERRORS.join('\n'));
    log('\nResults saved to test-results.txt');

  } catch (err) {
    error(`Test failed: ${err.message}`);
    error(err.stack);
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
}

testApp();
