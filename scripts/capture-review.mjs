// Capture the running local preview with public content; never submit forms.
import {chromium} from '@playwright/test';
import fs from 'node:fs';
import zlib from 'node:zlib';
const browser = await chromium.launch();
const observations = {};
for (const [locale, width, route] of [['en',1440,''], ['en',1440,'/projects'], ['ar',390,''], ['ru',768,'/projects']]) {
  const page = await browser.newPage({viewport:{width,height:1000}});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`http://127.0.0.1:4173/${locale}${route}`);
  await page.locator('.project-tile').first().waitFor({timeout:30000});
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.project-tile img').first().evaluate(image => image.decode());
  const name = `${locale}-${width}-${route ? 'work' : 'home'}`;
  await page.screenshot({path:`docs/redesign/${name}.jpg`,type:'jpeg',quality:80,fullPage:true});
  const scripts = await page.evaluate(() => performance.getEntriesByType('resource').filter(r => r.name.includes('/_next/') && r.name.endsWith('.js')).map(r => new URL(r.name).pathname));
  observations[name] = {
    tiles: await page.locator('.project-tile').count(),
    scripts: scripts.length,
    jsBytes: scripts.reduce((sum,path) => sum + fs.statSync('out'+path).size, 0),
    jsGzipBytes: scripts.reduce((sum,path) => sum + zlib.gzipSync(fs.readFileSync('out'+path)).length, 0),
    pageErrors: errors,
    fonts: await page.evaluate(() => performance.getEntriesByType('resource').filter(r=>r.name.endsWith('.woff2')).map(r=>r.name.split('/').at(-1))),
  };
  await page.close();
}
fs.writeFileSync('docs/redesign/bundle-observations.json', JSON.stringify(observations,null,2)+'\n');
console.log(observations);
await browser.close();
