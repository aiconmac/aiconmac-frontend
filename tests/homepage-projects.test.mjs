import test from 'node:test';
import assert from 'node:assert/strict';
import { homepageProjects, categoryRepresentatives } from '../src/lib/homepage-projects.mjs';
const project = (id, category, images = [{ url: `https://example.com/${id}.jpg` }]) => ({ id, title: `Project ${id}`, title_ar: `عربي ${id}`, category, images });
const map = (data, locale = 'en') => homepageProjects(data, locale, id => id);

test('preserves project identity and backend order, limits categories independently', () => {
  const records = [project(1, 'architectural'), project(2, 'masterplan'), project(3, 'architectural'), project(4, 'business-gifts')];
  const mapped = map(records);
  assert.deepEqual(mapped.slice(0, 3).map(p => p.id), [1, 2, 3]);
  assert.deepEqual(categoryRepresentatives(mapped).map(p => p.id), [1, 2, 4]);
  for (const item of mapped) {
    const original = records.find(p => p.id === item.id);
    assert.equal(item.image, original.images[0].url);
    assert.equal(item.title, original.title);
    assert.equal(item.categoryId, original.category);
  }
});
test('missing and invalid images are skipped without borrowing a photo', () => {
  assert.deepEqual(map([null, project(1, 'a', null), project(2, 'b', []), project(3, 'c', [{url:' '}, {url:'javascript:bad'}])]), []);
  assert.equal(map([project(4, 'd', [{url:''}, {url:'/valid.jpg'}])])[0].image, '/valid.jpg');
  assert.deepEqual(map([{...project(5, 'e'), isPublished:false}]), []);
});
test('empty/malformed responses, one slide, category cap, and localization fallback', () => {
  for (const data of [null, undefined, {}, []]) assert.deepEqual(map(data), []);
  assert.equal(categoryRepresentatives(map([project(1, 'a')])).length, 1);
  assert.equal(categoryRepresentatives(map(Array.from({length:7}, (_, i) => project(i, `c${i}`)))).length, 5);
  assert.equal(map([project(1, 'a')], 'ar')[0].title, 'عربي 1');
  assert.equal(map([project(1, 'a')], 'ru')[0].title, 'Project 1');
});

test('skips every malformed images shape while preserving surviving identity and order', () => {
  const malformed = [undefined, null, {}, 'photo.jpg', 42, true, false];
  const invalid = malformed.map((images, i) => ({ ...project(`bad-${i}`, 'a'), images }));
  const missing = project('missing', 'a');
  delete missing.images;
  const entries = [null, undefined, {}, 'photo.jpg', 42, true, { url: null }, { url: 12 }, { url: '//invalid.jpg' }];
  assert.deepEqual(map([missing, ...invalid, project('entries', 'a', entries)]), []);
  const first = project('first', 'masterplan', [...entries, { url: ' /first.jpg ' }, { url: '/unused.jpg' }]);
  const second = project('second', 'architectural');
  const third = project('third', 'masterplan');
  const mapped = map([invalid[0], first, missing, ...invalid.slice(1), second, project('entries', 'a', entries), third], 'ar');
  assert.deepEqual(mapped, [first, second, third].map(record => ({
    id: record.id, title: record.title_ar, description: '', categoryId: record.category,
    category: record.category, image: record === first ? '/first.jpg' : record.images[0].url,
  })));
  assert.deepEqual(categoryRepresentatives(mapped).map(record => record.id), ['first', 'second']);
});
