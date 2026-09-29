import test from 'node:test';
import assert from 'node:assert/strict';
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
  assert.equal(response.status, 301); assert.equal(response.headers.get('location'), 'https://x/ar/projects');
  response = await onRequestGet(context('https://x/ru/projects?category=x', 'ru'));
  assert.equal(response.status, 301); assert.equal(response.headers.get('location'), 'https://x/en/projects?category=x');
  response = await onRequestGet(context('https://x/en/projects', 'en'));
  assert.equal(await response.text(), 'asset');
});
