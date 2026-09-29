import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeProjects, normalizeClients, normalizeCategories, localized, portfolioUrl, imageVariant, loadCollection, dropPending, localePath, MalformedResponse} from '../src/lib/portfolio.mjs';
const category = {slug: 'architectural', name: 'Architectural', name_ar: 'معماري'};
const project = (id, images = [], extra = {}) => ({id, slug: `slug-${id}`, title: id, category, scale: '1:75', leadTimeDays: 28, clientName: 'Emaar', isPublished: true, images, ...extra});
test('published identity/order and image ownership survive normalization; image-less records remain', () => {
  const records = [project('b', [{url:'/b2.jpg',order:2,projectId:'b'}, {url:'/b1.jpg',order:1,projectId:'b'}, {url:'/other.jpg',projectId:'other'}, {url:'javascript:bad'}, null]), {...project('hidden'),isPublished:false}, project('a',null)];
  const result = normalizeProjects(records);
  assert.deepEqual(result.map(p => [p.id,p.slug,p.numeral]), [['b','slug-b','01'],['a','slug-a','02']]);
  assert.deepEqual(result[0].images.map(i=>i.url), ['/b2.jpg','/b1.jpg']);
  assert.deepEqual(result[1].images, []);
  assert.deepEqual(normalizeProjects([]), []);
  for (const invalid of [null, {}, 'bad', [null], [project('')], [project('same'),project('same')], [{id:'draft'}], [project('noslug', [], {slug: ''})]]) assert.throws(()=>normalizeProjects(invalid),MalformedResponse);
});
test('category object, scale, lead time and client are kept; null category survives; junk becomes null', () => {
  const [full] = normalizeProjects([project('p')]);
  assert.deepEqual(full.category, category);
  assert.equal(full.scale, '1:75'); assert.equal(full.leadTimeDays, 28); assert.equal(full.clientName, 'Emaar');
  const [bare] = normalizeProjects([project('q', [], {category: null, scale: '  ', leadTimeDays: 'soon', clientName: 42})]);
  assert.equal(bare.category, null); assert.equal(bare.scale, null); assert.equal(bare.leadTimeDays, null); assert.equal(bare.clientName, null);
  assert.equal(normalizeProjects([project('r', [], {category: 'architectural'})])[0].category, null);
  assert.equal(normalizeProjects([project('s', [], {leadTimeDays: 0})])[0].leadTimeDays, null);
});
test('categories come back trimmed and ordered as given; malformed throws', () => {
  assert.deepEqual(normalizeCategories([{id: 1, slug: ' masterplan ', name: ' Masterplan ', name_ar: 'مخطط', sortOrder: 2}, {slug: 'villa', name: 'Villa'}]), [{slug: 'masterplan', name: 'Masterplan', name_ar: 'مخطط'}, {slug: 'villa', name: 'Villa', name_ar: null}]);
  for (const invalid of [null, {}, [{slug: 'x'}], [{name: 'x'}], [null]]) assert.throws(() => normalizeCategories(invalid), MalformedResponse);
});
test('localized works on the category object for Arabic and falls back to English', () => {
  assert.deepEqual(localized(category, 'name', 'ar'), {children: 'معماري', lang: 'ar', dir: 'rtl'});
  assert.deepEqual(localized({slug: 'v', name: 'Villa', name_ar: null}, 'name', 'ar'), {children: 'Villa', lang: 'en', dir: 'ltr'});
});
test('malformed image shapes are neutral, never borrowed', () => {
  for (const images of [null,undefined,{},42,'url',[{},null,{url:42},{url:'//evil'}, {url:' '}]]) assert.deepEqual(normalizeProjects([project('p',images)])[0].images,[]);
});
test('client directory distinguishes empty and malformed', () => {
  assert.deepEqual(normalizeClients([]), []);
  assert.equal(normalizeClients([{id:'1',name:'Client'}])[0].name,'Client');
  for(const value of [{},null,[{}]]) assert.throws(()=>normalizeClients(value),MalformedResponse);
});
test('localized content carries English fallback direction and bounded text values', () => {
  const item = {title:'Title',title_ar:'عنوان',title_ru:'Заголовок'};
  assert.deepEqual(localized(item,'title','ar'),{children:'عنوان',lang:'ar',dir:'rtl'});
  assert.deepEqual(localized({title:'Title',title_ar:42},'title','ar'),{children:'Title',lang:'en',dir:'ltr'});
  assert.deepEqual(localized({title: 'T', title_ar: ''}, 'title', 'ar'), {children: 'T', lang: 'en', dir: 'ltr'});
  assert.equal(localized(item,'title','ru').lang,'ru');
});
test('URL changes preserve filter, unrelated query, and anchors', () => {
  assert.equal(portfolioUrl('/ar/projects?category=industrial&x=1#clients',{project:'uuid'}),'/ar/projects?category=industrial&x=1&project=uuid#clients');
  assert.equal(portfolioUrl('/en/projects?category=industrial&project=uuid',{project:null}),'/en/projects?category=industrial');
  assert.equal(portfolioUrl('/en/projects?project=uuid',{category:'all',project:null}),'/en/projects');
});
test('only verified Cloudinary account gets responsive transformations', () => {
  assert.equal(imageVariant('https://res.cloudinary.com/dgr0y1scl/image/upload/v1/a.jpg',480),'https://res.cloudinary.com/dgr0y1scl/image/upload/f_auto,q_auto,c_limit,w_480/v1/a.jpg');
  for(const url of ['/local.jpg','https://example.com/a.jpg','https://res.cloudinary.com/other/image/upload/a.jpg']) assert.equal(imageVariant(url,480),url);
});
test('in-flight deduplication releases both successful and failed requests for revalidation/retry', async () => {
  let calls=0;const fetchData=async()=>{calls++;return [project('p')];};
  const first=loadCollection('/projects?isPublished=true',fetchData);
  assert.equal(loadCollection('/projects?isPublished=true',fetchData),first);
  await first;assert.equal(calls,1);
  await loadCollection('/projects?isPublished=true',fetchData);assert.equal(calls,2);
  await assert.rejects(loadCollection('/projects?isPublished=true',async()=>{throw Error('offline');}));
  assert.equal((await loadCollection('/projects?isPublished=true',fetchData))[0].id,'p');
});
test('dropPending lets a retry bypass a stalled request', async () => {
  let resolveFirst; const stalled = () => new Promise(resolve => { resolveFirst = resolve; });
  const first = loadCollection('/clients', stalled);
  assert.equal(loadCollection('/clients', stalled), first);
  dropPending('/clients');
  const second = loadCollection('/clients', async () => [{id: '1', name: 'Fresh'}]);
  assert.notEqual(second, first);
  assert.equal((await second)[0].name, 'Fresh');
  resolveFirst([]);
});
test('a stale request settling does not evict the newer pending entry', async () => {
  let resolveFirst; const stalled = () => new Promise(resolve => { resolveFirst = resolve; });
  const first = loadCollection('/clients', stalled);
  await Promise.resolve();
  dropPending('/clients');
  const second = loadCollection('/clients', () => new Promise(() => {}));
  resolveFirst([]);
  await first;
  await Promise.resolve();
  assert.equal(loadCollection('/clients', stalled), second);
  dropPending('/clients');
});
test('language links keep path and query and swap only the locale segment', () => {
  assert.equal(localePath('/en/projects', '?category=industrial', 'ar'), '/ar/projects?category=industrial');
  assert.equal(localePath('/ar', '', 'en'), '/en');
  assert.equal(localePath('/en/projects/tower-one', '', 'ar'), '/ar/projects/tower-one');
  assert.equal(localePath('/', '', 'ar'), '/ar');
});
