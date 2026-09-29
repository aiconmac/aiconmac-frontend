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
import {localBusinessJsonLd} from '../src/lib/seo.mjs';
test('LocalBusiness names the legal entity, brand, address and phone', () => {
  assert.equal(localBusinessJsonLd['@type'], 'LocalBusiness');
  assert.equal(localBusinessJsonLd.name, 'Aiconmac');
  assert.equal(localBusinessJsonLd.legalName, 'Alpha Micro Models');
  assert.equal(localBusinessJsonLd.brand.name, 'Aiconmac');
  assert.equal(localBusinessJsonLd.telephone, '+97165357585');
  assert.equal(localBusinessJsonLd.foundingDate, '2009');
  assert.equal(localBusinessJsonLd.address.addressLocality, 'Sharjah');
  assert.deepEqual(localBusinessJsonLd.openingHoursSpecification[0].dayOfWeek, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
});
