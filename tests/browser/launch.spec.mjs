import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';

const messages = Object.fromEntries(['en', 'ar'].map(locale => [locale, JSON.parse(fs.readFileSync(`messages/${locale}.json`, 'utf8')).Design]));
const clients = [{id: 'c1', name: 'Actual client', name_ar: 'عميل فعلي', logo: '/images/logo.png'}, {id: 'c2', name: 'Second client', logo: '/images/img1.jpg'}];
const slug = fs.readdirSync('out/en/projects').filter(name => name.endsWith('.html')).map(name => name.slice(0, -5))[0];
const pages = ['', '/projects', `/projects/${slug}`, '/contact'];
const overflow = () => document.documentElement.scrollWidth <= innerWidth;
const clipped = () => [...document.querySelectorAll('*')].filter(el => el !== document.documentElement && el !== document.body && !el.matches('.project-tile, .home-hero, .ticker-window, .thumbnails button, .detail-stage') && /hidden|clip/.test(getComputedStyle(el).overflow) && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1)).map(el => `${el.tagName}.${el.className}`);
const smallTargets = () => [...document.querySelectorAll('main button, main input, main select, main textarea, main a.design-button, header a, footer a, .filter-bar button')].filter(el => el.offsetParent !== null).map(el => [el.outerHTML.slice(0, 60), el.getBoundingClientRect().height]).filter(([, height]) => height < 44);

async function mock(page, {post = () => ({status: 201, json: {id: 'x'}})} = {}) {
  const sent = [];
  await page.route('**/api/**', async route => {
    const request = route.request();
    if (request.method() === 'POST') { sent.push({url: request.url(), type: request.headers()['content-type'] || '', body: request.postData() || ''}); return route.fulfill(post()); }
    return route.fulfill({json: clients});
  });
  return sent;
}
async function tabTo(page, locator, max = 60) {
  for (let i = 0; i < max; i++) { if (await locator.evaluate(el => el === document.activeElement).catch(() => false)) return; await page.keyboard.press('Tab'); }
  throw new Error('focus never reached ' + locator);
}

test.describe('viewports', () => {
  for (const locale of ['en', 'ar']) for (const width of [1440, 768, 390, 320]) test(`${locale} at ${width}: no overflow, no clipping, targets, fonts`, async ({page}) => {
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({width, height: 1000}); await mock(page);
    for (const path of pages) {
      await page.goto(`/${locale}${path}`);
      await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
      await expect(page.locator('#main-content')).toBeVisible();
      expect(await page.evaluate(overflow), `${path} overflows`).toBeTruthy();
      expect(await page.evaluate(clipped), `${path} clips`).toEqual([]);
      if (width <= 390) expect(await page.evaluate(smallTargets), `${path} targets`).toEqual([]);
      await page.screenshot({path: `test-results/${locale}-${width}${path.replaceAll('/', '-') || '-home'}.png`, fullPage: true});
    }
    expect(await page.evaluate(() => performance.getEntriesByType('resource').filter(r => r.name.endsWith('.woff2')).map(r => r.name.split('/').at(-1)).sort())).toEqual(locale === 'ar' ? ['noto-kufi-arabic.woff2', 'schibsted-grotesk.woff2'] : ['schibsted-grotesk.woff2']);
    if (width < 900) { await page.goto(`/${locale}`); await page.locator('summary').click(); await expect(page.locator('.mobile-menu nav')).toBeVisible(); await page.keyboard.press('Escape'); await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open', ''); }
    expect(errors).toEqual([]);
  });
});

test('tiles carry a numbered meta caption and a loaded image, visible on desktop', async ({page}) => {
  await mock(page); await page.goto('/en/projects', {waitUntil: 'networkidle'});
  const caption = page.locator('.work-tiles .tile-caption').first();
  await expect(caption).toBeVisible();
  await expect(caption).toHaveCSS('transform', 'none');
  const meta = page.locator('.work-tiles .tile-meta').first();
  await expect(meta).toHaveText(/^01\b/);
  await expect(meta).not.toContainText('Lead time');
  expect(await page.locator('.work-tiles img').first().evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
});

test('Enquire on a detail page prefills the contact form with the project title', async ({page}) => {
  await mock(page); await page.goto(`/en/projects/${slug}`);
  const title = await page.locator('#detail-heading').textContent();
  await page.locator('.detail-copy a.design-button').click();
  await expect(page).toHaveURL(new RegExp(`/en/contact\\?project=${slug}#enquire-form$`));
  await expect(page.locator('[name=message]')).toHaveValue(new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('language links keep path and query; filters never push history', async ({page}) => {
  await mock(page); await page.goto('/en/projects');
  const filters = page.locator('.filter-bar button');
  const length = await page.evaluate(() => history.length);
  if (await filters.count() > 1) {
    await filters.nth(1).click();
    await expect(page).toHaveURL(/category=/);
    expect(await page.evaluate(() => history.length)).toBe(length);
    await expect(filters.nth(1)).toHaveAttribute('aria-pressed', 'true');
  }
  const arabic = page.locator('.language-links a[hreflang=ar]');
  const query = new URL(page.url()).search;
  await expect(arabic).toHaveAttribute('href', `/ar/projects${query}`);
  await arabic.click();
  await expect(page).toHaveURL(new RegExp(`/ar/projects${query.replace('?', '\\?')}$`));
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('.language-links a[hreflang=en]')).toHaveAttribute('href', `/en/projects${query}`);
  await expect(page.locator('.language-links select')).toHaveCount(0);
});

test('keyboard walk: nav → language links → filter → detail → gallery → Escape → form', async ({page}) => {
  await mock(page); await page.goto('/en/projects');
  await tabTo(page, page.locator('.desktop-nav a').first());
  await tabTo(page, page.locator('.language-links a[hreflang=ar]'));
  await tabTo(page, page.locator('.filter-bar button').first());
  await page.keyboard.press('Space');
  await expect(page.locator('.filter-bar button').first()).toHaveAttribute('aria-pressed', 'true');
  await tabTo(page, page.locator('.work-tiles .project-tile').first());
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/en\/projects\/[^/?]+$/);
  await expect(page.locator('#detail-heading')).toBeVisible();
  if (await page.locator('.photo-controls').count()) { await tabTo(page, page.getByRole('button', {name: 'Next photo', exact: true})); await page.keyboard.press('Enter'); await expect(page.locator('.photo-controls')).toContainText('Photo 2 /'); }
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/\/en\/projects$/);
  await page.goto('/en/contact');
  await tabTo(page, page.locator('[name=fullName]'));
  for (const name of ['fullName', 'email', 'phone', 'projectType', 'message', 'drawings']) {
    await page.locator(`[name=${name}]`).focus();
    const outline = await page.locator(`[name=${name}]`).evaluate(el => getComputedStyle(el).outlineStyle);
    expect(outline, `${name} focus ring`).not.toBe('none');
  }
});

test('header underlines Clients, not Work, on the clients anchor', async ({page}) => {
  await mock(page); await page.goto('/en/projects');
  const nav = page.locator('.desktop-nav');
  await expect(nav.getByRole('link', {name: 'Work', exact: true})).toHaveAttribute('aria-current', 'page');
  await nav.getByRole('link', {name: 'Clients', exact: true}).click();
  await expect(nav.getByRole('link', {name: 'Clients', exact: true})).toHaveAttribute('aria-current', 'location');
  await expect(nav.getByRole('link', {name: 'Work', exact: true})).not.toHaveAttribute('aria-current', /.+/);
  await page.goto('/en/projects#clients'); await page.reload();
  await expect(nav.getByRole('link', {name: 'Clients', exact: true})).toHaveAttribute('aria-current', 'location');
});

test('home shows each featured project once and the logo in header and footer', async ({page}) => {
  await mock(page); await page.goto('/en');
  const slugs = await page.locator('.home-tiles .project-tile').evaluateAll(tiles => tiles.map(tile => tile.dataset.project));
  expect(slugs.length).toBeGreaterThan(1);
  expect(new Set(slugs).size).toBe(slugs.length);
  for (const area of ['.design-header', '.design-footer']) await expect(page.locator(`${area} img[alt="Aiconmac"]:visible`)).toHaveCount(1);
});

test('home hero: nav is transparent over the hero and solid after scrolling past it', async ({page}) => {
  await mock(page); await page.goto('/en');
  const header = page.locator('header.design-header');
  await expect(header).toHaveAttribute('data-over-hero', '');
  expect(await page.locator('.home-hero>img').evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
  const logo = header.locator('img[alt="Aiconmac"]:visible');
  await expect(logo).toHaveAttribute('src', '/images/logo-dark.png');
  await page.mouse.move(700, 500); await page.mouse.wheel(0, 2000);
  await expect(header).not.toHaveAttribute('data-over-hero');
  await expect(header).toHaveCSS('background-color', 'rgb(244, 242, 237)');
  await expect(header.locator('.brand-logo-dark')).toBeHidden();
  await expect(logo).toHaveAttribute('src', '/images/logo.png');
});

test('reduced motion leaves the hero fully visible on load; full motion settles visible', async ({browser}) => {
  for (const reducedMotion of ['reduce', 'no-preference']) {
    const context = await browser.newContext({reducedMotion}); const page = await context.newPage(); await mock(page); await page.goto('/en');
    for (const selector of ['.hero-copy h1', '.hero-copy .design-button', '.home-hero>img']) await expect(page.locator(selector).first(), `${reducedMotion} ${selector}`).toHaveCSS('opacity', '1');
    const tile = page.locator('.project-tile').first();
    if (reducedMotion === 'reduce') {
      await expect(tile).toHaveCSS('opacity', '1');
      expect(await page.locator('.hero-copy h1').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
    } else {
      // Tiles reveal on scroll; once fully in view they must settle opaque and untranslated.
      await tile.evaluate(el => el.scrollIntoView({block: 'center'}));
      await expect(tile).toHaveCSS('opacity', '1');
      await expect(tile).toHaveCSS('transform', /none|matrix\(1, 0, 0, 1, 0, 0\)/);
    }
    await context.close();
  }
});

test('gallery settles on the chosen photo with a single image on stage', async ({page}) => {
  await mock(page); await page.goto(`/en/projects/${slug}`);
  test.skip(await page.locator('.thumbnails button').count() < 2, 'project has one photo');
  await page.locator('.thumbnails button').nth(1).click();
  await expect(page.locator('.detail-stage img')).toHaveCount(1);
  await expect(page.locator('.detail-stage img')).toHaveAttribute('src', await page.locator('.thumbnails button').nth(1).locator('img').getAttribute('src'));
  await expect(page.locator('.detail-stage img')).toHaveCSS('opacity', '1');
});

test('detail page metadata is per project and Escape works from the thumbnails', async ({page}) => {
  await mock(page); await page.goto(`/en/projects/${slug}`);
  const title = await page.title();
  expect(title).not.toMatch(/^Aiconmac —/);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', `https://aiconmac.com/en/projects/${slug}`);
  await expect(page.locator('link[hreflang=ar]')).toHaveAttribute('href', `https://aiconmac.com/ar/projects/${slug}`);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  await expect(page.locator('.detail-facts, .image-placeholder, .detail-stage img').first()).toBeVisible();
  await page.locator('body').press('Escape');
  await expect(page).toHaveURL(/\/en\/projects$/);
});

test.describe('interception', () => {
  for (const locale of ['en', 'ar']) {
    test(`${locale}: stalled GET shows loading with retry, then recovers`, async ({page}) => {
      let stall = true; const held = [];
      await page.route('**/api/clients', route => stall ? held.push(route) : route.fulfill({json: clients}));
      await page.goto(`/${locale}/projects`);
      const status = page.locator('.client-directory .collection-status');
      await expect(status).toContainText(messages[locale].loading);
      await expect(status.getByRole('button', {name: messages[locale].retry})).toBeVisible();
      stall = false;
      await status.getByRole('button', {name: messages[locale].retry}).click();
      await expect(page.locator('.client-row')).toHaveCount(2);
      for (const route of held) await route.fulfill({json: clients}).catch(() => {});
    });
    for (const [name, post, kind] of [
      ['500 HTML', () => ({status: 500, contentType: 'text/html', body: '<h1>Error</h1>'}), 'http'],
      ['network failure', null, 'network'],
      ['malformed JSON', () => ({status: 200, contentType: 'application/json', body: '{not json'}), 'malformed'],
    ]) test(`${locale}: ${name} on POST shows a localized message and keeps the form usable`, async ({page}) => {
      if (post) await mock(page, {post}); else await page.route('**/api/contact', route => route.abort());
      await page.goto(`/${locale}/contact`);
      await page.locator('[name=fullName]').fill('Local Test'); await page.locator('[name=email]').fill('local@example.com'); await page.locator('[name=projectType]').selectOption({index: 1}); await page.locator('[name=message]').fill('Intercepted local verification only.');
      await page.locator('button[type=submit], .enquire-form button').first().click();
      const status = page.locator('.form-status');
      await expect(status).toHaveText(messages[locale].errors[kind]);
      await expect(status).toBeFocused();
      await expect(page.locator('.enquire-form button')).toBeEnabled();
      await expect(page.locator('[name=fullName]')).toHaveValue('Local Test');
    });
  }
  test('stalled POST times out with the localized message', async ({page}) => {
    await page.route('**/api/contact', () => new Promise(() => {}));
    await page.goto('/en/contact');
    await page.locator('[name=fullName]').fill('Local Test'); await page.locator('[name=email]').fill('local@example.com'); await page.locator('[name=projectType]').selectOption({index: 1}); await page.locator('[name=message]').fill('Intercepted local verification only.');
    await page.locator('.enquire-form button').click();
    await expect(page.locator('.form-status')).toHaveText(messages.en.form.sending); await expect(page.locator('.enquire-form button')).toHaveText(messages.en.form.sending);
    await expect(page.locator('.form-status')).toHaveText(messages.en.errors.timeout, {timeout: 15000});
    await expect(page.locator('.enquire-form button')).toBeEnabled();
  });
});

test('contact: empty form sends nothing and focuses the first invalid field; files travel as multipart; empty input sends no drawings part', async ({page}) => {
  const sent = await mock(page); await page.goto('/en/contact');
  await page.locator('.enquire-form button').click();
  expect(sent).toHaveLength(0);
  expect(await page.evaluate(() => document.activeElement.name)).toBe('fullName');
  await page.locator('[name=fullName]').fill('Local Test'); await page.locator('[name=email]').fill('local@example.com'); await page.locator('[name=projectType]').selectOption({index: 1}); await page.locator('[name=message]').fill('Intercepted local verification only.');
  await page.locator('.enquire-form button').click();
  await expect(page.locator('.form-status')).toHaveText(messages.en.form.sent); await expect(page.locator('.enquire-form button')).toHaveText(messages.en.form.sentButton);
  expect(sent[0].type).toContain('multipart/form-data');
  expect(sent[0].body).toContain('name="projectType"');
  expect(sent[0].body).not.toContain('name="drawings"');
  await page.locator('[name=fullName]').fill('Local Test'); await page.locator('[name=email]').fill('local@example.com'); await page.locator('[name=projectType]').selectOption({index: 1}); await page.locator('[name=message]').fill('Intercepted local verification only.');
  await page.locator('[name=drawings]').setInputFiles({name: 'plan.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 local mock')});
  await page.locator('.enquire-form button').click();
  await expect(page.locator('.form-status')).toHaveText(messages.en.form.sent);
  expect(sent[1].body).toContain('name="drawings"; filename="plan.pdf"');
  await expect(page.locator('.form-status')).toBeFocused();
});

test('contact page shows WhatsApp, hours and careers line at 320px without clipping', async ({page}) => {
  await page.setViewportSize({width: 320, height: 800}); await mock(page); await page.goto('/ar/contact');
  await expect(page.locator('a[href="https://wa.me/971542446300"]').first()).toBeVisible();
  await expect(page.getByText(messages.ar.hoursValue)).toBeVisible();
  await expect(page.getByText(messages.ar.careersLine)).toBeVisible();
  expect(await page.evaluate(overflow)).toBeTruthy();
  expect(await page.evaluate(clipped)).toEqual([]);
});

test('catalogue dialog closes with Escape while the request is pending', async ({page}) => {
  await page.route('**/api/brochure-request', () => new Promise(() => {})); await page.route('**/api/clients', route => route.fulfill({json: clients}));
  await page.goto('/en');
  const action = page.locator('.design-footer nav>button'); await action.click();
  await page.locator('#catalogue-email').fill('local@example.com'); await page.locator('dialog form button').click();
  await expect(page.locator('dialog form button')).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog')).toBeHidden();
  await expect(action).toBeFocused();
});

test('production CSP holds on every page and the catalogue dialog', async ({page}) => {
  await page.addInitScript(() => { window.__csp = []; addEventListener('securitypolicyviolation', event => window.__csp.push(`${event.violatedDirective} ${event.blockedURI}`)); });
  await mock(page);
  for (const locale of ['en', 'ar']) for (const path of [...pages, '/missing-page']) {
    const response = await page.goto(`/${locale}${path}`);
    expect(response.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
    await page.waitForLoadState('networkidle');
    expect(await page.evaluate(() => window.__csp), `${locale}${path}`).toEqual([]);
  }
  await page.goto('/en'); await page.locator('.design-footer nav>button').click();
  await page.locator('#catalogue-email').fill('local@example.com'); await page.locator('dialog form button').click();
  await page.waitForLoadState('networkidle');
  expect(await page.evaluate(() => window.__csp)).toEqual([]);
});

test('CLS stays under 0.1 with a 2 s API delay', async ({page, browserName}) => {
  test.skip(browserName !== 'chromium', 'layout-shift entries are Chromium only');
  await page.route('**/api/**', async route => { await new Promise(resolve => setTimeout(resolve, 2000)); await route.fulfill({json: clients}); });
  await page.addInitScript(() => { window.__cls = 0; new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__cls += entry.value; }).observe({type: 'layout-shift', buffered: true}); });
  for (const path of ['/en', '/en/projects']) {
    await page.setViewportSize({width: 1440, height: 1000}); await page.goto(path); await page.waitForTimeout(3500);
    expect(await page.evaluate(() => window.__cls), path).toBeLessThan(0.1);
  }
});

test('touch captions and reduced motion', async ({browser}) => {
  const context = await browser.newContext({viewport: {width: 390, height: 844}, hasTouch: true, isMobile: true, reducedMotion: 'reduce'}); const page = await context.newPage(); await mock(page); await page.goto('/en');
  await expect(page.locator('.tile-caption').first()).toBeVisible(); await expect(page.locator('.ticker-track')).toHaveCSS('animation-name', 'none');
  await page.getByRole('button', {name: 'Pause', exact: true}).click(); await expect(page.getByRole('button', {name: 'Play', exact: true})).toHaveAttribute('aria-pressed', 'true');
  await context.close();
});

test.describe('axe', () => {
  for (const locale of ['en', 'ar']) for (const path of pages) test(`${locale}${path || '/'} has no violations`, async ({page}) => {
    await mock(page); await page.goto(`/${locale}${path}`); await page.waitForSelector('.client-row, .ticker-run, .detail-copy, .enquire-form');
    const results = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(results.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).join(', ')}`)).toEqual([]);
  });
});
