import test from 'node:test';
import assert from 'node:assert/strict';
import {pageMetadata, SITE} from '../src/lib/seo.mjs';
test('page metadata carries canonical, hreflang for en/ar/x-default and OG per locale', () => {
  const meta = pageMetadata({locale: 'ar', path: '/projects/tower-one', title: 'Tower — Aiconmac', description: 'Desc', image: 'https://res.cloudinary.com/x/tower.jpg'});
  assert.equal(meta.alternates.canonical, `${SITE}/ar/projects/tower-one`);
  assert.deepEqual(meta.alternates.languages, {en: `${SITE}/en/projects/tower-one`, ar: `${SITE}/ar/projects/tower-one`, 'x-default': `${SITE}/en/projects/tower-one`});
  assert.equal(meta.openGraph.locale, 'ar_AE');
  assert.equal(meta.openGraph.url, `${SITE}/ar/projects/tower-one`);
  assert.equal(meta.openGraph.images[0].url, 'https://res.cloudinary.com/x/tower.jpg');
  assert.equal(meta.twitter.images[0], 'https://res.cloudinary.com/x/tower.jpg');
});
test('image-less pages fall back to the site OG image', () => {
  const meta = pageMetadata({locale: 'en', path: '', title: 'T', description: 'D'});
  assert.equal(meta.openGraph.images[0].url, `${SITE}/og-image.jpg`);
  assert.equal(meta.openGraph.locale, 'en_US');
});
