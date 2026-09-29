import test from 'node:test';
import assert from 'node:assert/strict';
import {request, ApiError} from '../src/lib/api.js';
const hang = (url, {signal}) => new Promise((_, reject) => signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), {name: 'AbortError'}))));
test('timeout aborts and reports timeout', async () => {
  await assert.rejects(request('/clients', {timeout: 20, fetch: hang}), error => error instanceof ApiError && error.kind === 'timeout');
});
test('network, http and malformed are distinguished', async () => {
  await assert.rejects(request('/x', {fetch: async () => { throw new TypeError('Failed to fetch'); }}), e => e.kind === 'network');
  await assert.rejects(request('/x', {fetch: async () => new Response('<h1>500</h1>', {status: 500})}), e => e.kind === 'http' && e.status === 500);
  await assert.rejects(request('/x', {fetch: async () => new Response('{bad', {status: 200})}), e => e.kind === 'malformed');
  assert.deepEqual(await request('/x', {fetch: async () => Response.json([1])}), [1]);
});
test('POST sends JSON with a content type and FormData untouched', async () => {
  const seen = [];
  const fetch = async (url, init) => { seen.push(init); return Response.json({ok: true}); };
  await request('/contact', {method: 'POST', body: {a: 1}, fetch});
  assert.equal(seen[0].headers['Content-Type'], 'application/json'); assert.equal(seen[0].body, '{"a":1}');
  const form = new FormData(); form.append('a', '1');
  await request('/contact', {method: 'POST', body: form, fetch});
  assert.equal(seen[1].headers, undefined); assert.equal(seen[1].body, form);
});
