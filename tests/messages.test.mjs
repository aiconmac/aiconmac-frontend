import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {mergeMessages} from '../src/i18n/messages.mjs';
test('missing nested Arabic keys fall back to English', () => {
  const merged = mergeMessages({Design: {a: 'A', form: {x: 'X', y: 'Y'}}, NotFound: {t: 'T'}}, {Design: {a: 'أ', form: {x: 'س'}}});
  assert.deepEqual(merged, {Design: {a: 'أ', form: {x: 'س', y: 'Y'}}, NotFound: {t: 'T'}});
});
test('arrays override whole, never merge by index', () => {
  assert.deepEqual(mergeMessages({q: [{a: 1}, {a: 2}]}, {q: [{a: 3}]}).q, [{a: 3}]);
});
test('every Arabic key exists in English (no orphan translations)', () => {
  const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8')), ar = JSON.parse(fs.readFileSync('messages/ar.json', 'utf8'));
  const keys = (o, p = '') => Object.entries(o).flatMap(([k, v]) => v && typeof v === 'object' && !Array.isArray(v) ? keys(v, `${p}${k}.`) : [`${p}${k}`]);
  const enKeys = new Set(keys(en));
  assert.deepEqual(keys(ar).filter(k => !enKeys.has(k)), []);
});
