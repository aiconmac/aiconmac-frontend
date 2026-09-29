import test from 'node:test';
import assert from 'node:assert/strict';
import {cleanDrawings, DRAWING_LIMITS} from '../src/lib/contact.mjs';
const file = (name, size) => new File([new Uint8Array(size)], name, {type: 'application/pdf'});
test('the empty File a browser adds for an untouched input is dropped', () => {
  assert.deepEqual(cleanDrawings([new File([], '')]), []);
  assert.deepEqual(cleanDrawings([]), []);
});
test('extensions are checked case-insensitively', () => {
  assert.equal(cleanDrawings([file('photo.heic', 10)]), null);
  const upper = [file('PLAN.PDF', 10)];
  assert.deepEqual(cleanDrawings(upper), upper);
});
test('real files pass; too many or too large returns null', () => {
  const ok = [file('a.pdf', 10), file('b.dwg', 20)];
  assert.deepEqual(cleanDrawings(ok), ok);
  assert.equal(cleanDrawings(Array.from({length: DRAWING_LIMITS.files + 1}, (_, i) => file(`${i}.pdf`, 1))), null);
  assert.equal(cleanDrawings([file('big.pdf', DRAWING_LIMITS.bytes + 1)]), null);
});
