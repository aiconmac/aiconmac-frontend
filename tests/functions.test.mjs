import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {pickLocale, onRequest} from '../functions/index.js';
import {onRequestGet} from '../functions/[locale]/projects.js';
test('browser language picks the locale, English otherwise', () => {
  assert.equal(pickLocale('ar-AE,ar;q=0.9,en;q=0.8'), 'ar');
  assert.equal(pickLocale('en-GB,en;q=0.9,ar;q=0.8'), 'en');
  assert.equal(pickLocale('ru-RU,fr;q=0.8'), 'en');
  assert.equal(pickLocale(''), 'en');
  assert.equal(pickLocale(null), 'en');
});
test('/ redirects with Vary', async () => {
  const response = await onRequest({request: new Request('https://aiconmac.com/', {headers: {'accept-language': 'ar'}})});
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('location'), 'https://aiconmac.com/ar');
  assert.equal(response.headers.get('vary'), 'Accept-Language');
});
test('legacy ?project=<id> resolves to the slug page; unknown id falls back to Work', async () => {
  const fetchSlug = async url => new Response(url.endsWith('/known') ? JSON.stringify({slug: 'tower-one'}) : 'not found', {status: url.endsWith('/known') ? 200 : 404});
  const context = (url, locale) => ({request: new Request(url), params: {locale}, next: () => new Response('asset'), fetchSlug});
  let response = await onRequestGet(context('https://x/en/projects?project=known', 'en'));
  assert.equal(response.status, 301); assert.equal(response.headers.get('location'), 'https://x/en/projects/tower-one');
  response = await onRequestGet(context('https://x/ar/projects?project=missing', 'ar'));
  assert.equal(response.status, 302); assert.equal(response.headers.get('location'), 'https://x/ar/projects');
  response = await onRequestGet(context('https://x/ru/projects?category=x', 'ru'));
  assert.equal(response.status, 301); assert.equal(response.headers.get('location'), 'https://x/en/projects?category=x');
  response = await onRequestGet(context('https://x/en/projects', 'en'));
  assert.equal(await response.text(), 'asset');
});
test('every legacy URL has a 301 in _redirects', () => {
  const rules = fs.readFileSync('public/_redirects', 'utf8').trim().split('\n').map(line => line.trim().split(/\s+/));
  const table = Object.fromEntries(rules.map(([from, to, status]) => [from, [to, status]]));
  for (const [from, to] of [
    ['/ru', '/en'], ['/ru/*', '/en/:splat'],
    ['/clients', '/en/projects#clients'], ['/en/clients', '/en/projects#clients'], ['/ar/clients', '/ar/projects#clients'],
    ['/careers', '/en/contact'], ['/en/careers', '/en/contact'], ['/ar/careers', '/ar/contact'],
    ['/loading-demo', '/en'], ['/en/loading-demo', '/en'], ['/ar/loading-demo', '/ar'],
  ]) assert.deepEqual(table[from], [to, '301'], from);
  assert.ok(!('/' in table), 'root is handled by functions/index.js');
});
test('API failure on legacy ?project=<id> answers 302 to Work, never a cached 301', async () => {
  const context = fetchSlug => ({request: new Request('https://x/en/projects?project=abc'), params: {locale: 'en'}, next: () => new Response('asset'), fetchSlug});
  for (const fetchSlug of [async () => { throw new TypeError('down'); }, async () => new Response('<h1>502</h1>', {status: 502}), async () => new Response('{bad', {status: 200}), async () => Response.json({})]) {
    const response = await onRequestGet(context(fetchSlug));
    assert.equal(response.status, 302);
    assert.equal(response.headers.get('location'), 'https://x/en/projects');
  }
});
