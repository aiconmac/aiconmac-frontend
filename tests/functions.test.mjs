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
    ['/images/aicon-removebg-preview.png', '/images/logo.png'],
  ]) assert.deepEqual(table[from], [to, '301'], from);
  assert.ok(!('/' in table), 'root is handled by functions/index.js');
});
test('bare /contact and /projects redirect to English, keeping the query', async () => {
  const {onRequestGet: bareContact} = await import('../functions/contact.js');
  const {onRequestGet: bareProjects} = await import('../functions/projects.js');
  let response = await bareContact({request: new Request('https://x/contact')});
  assert.equal(response.status, 301); assert.equal(response.headers.get('location'), 'https://x/en/contact');
  response = await bareProjects({request: new Request('https://x/projects')});
  assert.equal(response.status, 301); assert.equal(response.headers.get('location'), 'https://x/en/projects');
});
test('/projects?project=<id> chains through the locale function to the slug page', async () => {
  const {onRequestGet: bareProjects} = await import('../functions/projects.js');
  const fetchSlug = async url => new Response(url.endsWith('/known') ? JSON.stringify({slug: 'tower-one'}) : 'not found', {status: url.endsWith('/known') ? 200 : 404});
  const first = await bareProjects({request: new Request('https://x/projects?project=known')});
  assert.equal(first.status, 301); assert.equal(first.headers.get('location'), 'https://x/en/projects?project=known');
  const second = await onRequestGet({request: new Request(first.headers.get('location')), params: {locale: 'en'}, next: () => new Response('asset'), fetchSlug});
  assert.equal(second.status, 301); assert.equal(second.headers.get('location'), 'https://x/en/projects/tower-one');
});
test('API failure on legacy ?project=<id> answers 302 to Work, never a cached 301', async () => {
  const context = fetchSlug => ({request: new Request('https://x/en/projects?project=abc'), params: {locale: 'en'}, next: () => new Response('asset'), fetchSlug});
  for (const fetchSlug of [async () => { throw new TypeError('down'); }, async () => new Response('<h1>502</h1>', {status: 502}), async () => new Response('{bad', {status: 200}), async () => Response.json({})]) {
    const response = await onRequestGet(context(fetchSlug));
    assert.equal(response.status, 302);
    assert.equal(response.headers.get('location'), 'https://x/en/projects');
  }
});
test('every Function response carries the _headers security set', async () => {
  const {SECURITY_HEADERS} = await import('../functions/_security.js');
  const block = fs.readFileSync('public/_headers', 'utf8').split('\n').slice(1).filter(line => line.trim()).map(line => line.trim().split(/:\s(.*)/s));
  assert.deepEqual(Object.fromEntries(block), SECURITY_HEADERS);
  const {onRequestGet: bareContact} = await import('../functions/contact.js');
  const {onRequestGet: bareProjects} = await import('../functions/projects.js');
  const context = url => ({request: new Request(url), params: {locale: new URL(url).pathname.split('/')[1]}, next: () => new Response('asset', {headers: {'content-type': 'text/html'}}), fetchSlug: async () => Response.json({slug: 'tower-one'})});
  const responses = [
    await onRequest({request: new Request('https://x/')}),
    await bareContact({request: new Request('https://x/contact')}),
    await bareProjects({request: new Request('https://x/projects')}),
    await onRequestGet(context('https://x/en/projects')),
    await onRequestGet(context('https://x/ar/projects?project=1')),
    await onRequestGet(context('https://x/ru/projects')),
  ];
  for (const response of responses) for (const [name, value] of Object.entries(SECURITY_HEADERS)) assert.equal(response.headers.get(name), value, name);
  assert.equal(responses[3].headers.get('content-type'), 'text/html');
  assert.equal(await responses[3].text(), 'asset');
});
test('a hostile API slug never reaches the redirect path', async () => {
  for (const slug of ['../clients', '//evil.com', 'a/b', 'x?y', 'X']) {
    const response = await onRequestGet({request: new Request('https://x/en/projects?project=1'), params: {locale: 'en'}, next: () => new Response('asset'), fetchSlug: async () => Response.json({slug})});
    assert.equal(response.status, 302, slug);
    assert.equal(response.headers.get('location'), 'https://x/en/projects', slug);
  }
});
