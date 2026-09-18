import {test, expect} from '@playwright/test';
const projects = [
 {id:'11111111-1111-4111-8111-111111111111',title:'First tower',title_ar:'البرج الأول',title_ru:'Первая башня',description:'A detailed physical model.',category:'architectural',badge:'Featured',isPublished:true,images:[{url:'/images/img1.jpg'},{url:'/images/img2.jpg'}]},
 {id:'22222222-2222-4222-8222-222222222222',title:'Industrial plant',description:'Industrial description',category:'industrial',isPublished:true,images:[{url:'/images/img3.jpg'}]},
 {id:'33333333-3333-4333-8333-333333333333',title:'Without images',category:'industrial',isPublished:true,images:[]},
 {id:'44444444-4444-4444-8444-444444444444',title:'Private draft',category:'industrial',isPublished:false,images:[{url:'/images/img1.jpg'}]},
];
const clients = [{id:'client1',name:'Actual client',name_ar:'عميل فعلي',name_ru:'Наш клиент'}];
async function mock(page, data=projects) {
 const requests=[];
 await page.route('**/api/**',async route=>{
  requests.push(route.request().url());
  if(route.request().method() !== 'GET') throw Error('Unexpected submission');
  await route.fulfill({json:route.request().url().includes('/projects') ? data : clients});
 });
 return requests;
}
for(const locale of ['en','ar','ru']) for(const width of [1440,1024,768,390]) {
 test(`${locale} responsive ${width}`,async({page})=>{
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width,height:1000}); await mock(page);
  await page.goto(`/${locale}`); await expect(page.locator('.home-tiles .project-tile')).toHaveCount(3);
  await expect(page.locator('html')).toHaveAttribute('dir',locale==='ar'?'rtl':'ltr');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await expect(page.locator('.home-hero h1')).toBeVisible();
  expect(await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>r.name.endsWith('.woff2')).map(r=>r.name.split('/').at(-1)))).toEqual([locale==='ar'?'noto-arabic.woff2':locale==='ru'?'noto-sans.woff2':'archivo.woff2']);
  if(width<900){await page.locator('summary').click();await expect(page.locator('.mobile-menu nav')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open','');}
  await page.goto(`/${locale}/projects`);await expect(page.locator('.work-tiles .project-tile')).toHaveCount(3);
  await page.locator('.work-tiles .project-tile').first().click();await expect(page.locator('#detail-heading')).toBeFocused();
  await expect(page.locator('.detail-description')).toHaveAttribute('lang','en');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.screenshot({path:`test-results/${locale}-${width}.png`,fullPage:true});
  expect(errors).toEqual([]);
 });
}
test('filter, detail, gallery, focus and Back/Forward remain local',async({page})=>{
 const requests=await mock(page);await page.goto('/en/projects');
 await page.getByRole('button',{name:'Industrial Models',exact:true}).click();
 await expect(page.locator('.work-tiles .project-tile')).toHaveCount(2);
 const tile=page.locator('.work-tiles .project-tile').first();await tile.click();
 await expect(page).toHaveURL(/category=industrial&project=/);await expect(page.locator('#detail-heading')).toBeFocused();
 await page.getByRole('button',{name:'Close',exact:true}).click();await expect(tile).toBeFocused();
 await page.goBack();await expect(page.locator('#detail-heading')).toContainText('Industrial plant');
 await page.goForward();await expect(page.locator('#detail-heading')).toHaveCount(0);
 await page.getByRole('button',{name:/All projects/}).click();await page.locator('.work-tiles .project-tile').first().click();
 await page.getByRole('button',{name:'Next photo',exact:true}).click();await expect(page.locator('.photo-controls')).toContainText('Photo 2 / 2');
 await page.getByRole('button',{name:'Industrial Models',exact:true}).click();await expect(page.locator('#detail-heading')).toHaveCount(0);
 expect(requests.filter(url=>url.includes('/projects'))).toHaveLength(1);
});
test('direct detail ignores active category and locale switching preserves query and anchor',async({page})=>{
 await mock(page);await page.goto(`/en/projects?category=industrial&project=${projects[0].id}#clients`);
 await expect(page.locator('#detail-heading')).toHaveText('First tower');await expect(page.locator('.work-tiles .project-tile')).toHaveCount(2);
 await page.locator('.language-select select').selectOption('ar');
 await expect(page).toHaveURL(new RegExp(`/ar/projects\\?category=industrial&project=${projects[0].id}#clients`));await expect(page.locator('#detail-heading')).toHaveText('البرج الأول');
 await page.getByRole('button',{name:'إغلاق',exact:true}).click();await expect(page).toHaveURL(/category=industrial#clients$/);
});
test('failure preserves URL for retry; invalid category normalized only after success; draft unavailable',async({page})=>{
 let fail=true;await page.route('**/api/**',route=>route.fulfill(fail?{status:503,json:{message:'offline'}}:{json:route.request().url().includes('/projects')?projects:clients}));
 await page.goto(`/en/projects?category=invalid&project=${projects[3].id}`);
 await expect(page.getByText('Unable to load this collection.').first()).toBeVisible();await expect(page).toHaveURL(/category=invalid/);
 fail=false;await page.getByRole('button',{name:'Retry'}).first().click();await expect(page).not.toHaveURL(/category=/);
 await expect(page.getByText('This project is unavailable or no longer published.')).toBeVisible();await expect(page.locator('.work-tiles')).not.toContainText('Private draft');
});
test('loading, empty, malformed and image failures are distinct',async({page})=>{
 let release;const wait=new Promise(resolve=>release=resolve);await page.route('**/api/**',async route=>{await wait;await route.fulfill({json:[]});});
 await page.goto('/en/projects');await expect(page.getByText('Loading…').first()).toBeVisible();release();await expect(page.getByText('No published projects yet.')).toBeVisible();
 await page.unroute('**/api/**');await page.route('**/api/**',route=>route.fulfill({json:{bad:true}}));await page.reload();await expect(page.getByText('The collection response could not be read.').first()).toBeVisible();
 await page.unroute('**/api/**');await mock(page);await page.route('**/images/**',route=>route.abort());await page.reload();await expect(page.locator('.work-tiles .image-placeholder')).toHaveCount(3);
});
test('touch captions, reduced motion, ticker control and keyboard navigation',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});const page=await context.newPage();await mock(page);await page.goto('/en');
 await expect(page.locator('.tile-caption').first()).toHaveCSS('transform','none');await expect(page.locator('.ticker-track')).toHaveCSS('animation-name','none');
 await page.getByRole('button',{name:'Pause',exact:true}).click();await expect(page.getByRole('button',{name:'Play',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.locator('.home-tiles .project-tile').first().focus();await page.keyboard.press('Enter');await expect(page.locator('#detail-heading')).toBeFocused();
 await context.close();
});
test('visibility revalidates only after 30 seconds',async({page})=>{
 const requests=await mock(page);await page.goto('/en/projects');await expect(page.locator('.work-tiles .project-tile')).toHaveCount(3);
 await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,value:'visible'});document.dispatchEvent(new Event('visibilitychange'));});
 expect(requests.filter(u=>u.includes('/projects'))).toHaveLength(1);
 await page.evaluate(()=>{const original=Date.now;Date.now=()=>original()+31000;document.dispatchEvent(new Event('visibilitychange'));});
 await expect.poll(()=>requests.filter(u=>u.includes('/projects')).length).toBe(2);
});
for(const locale of ['en','ar','ru']) test(`${locale} legacy contracts and catalogue`,async({page})=>{
 const sent=[];await page.route('**/api/**',async route=>{const req=route.request();if(req.method()==='POST')sent.push({url:req.url(),type:req.headers()['content-type'],body:req.postData()});await route.fulfill({json:req.method()==='POST'?{success:true}:clients});});
 await page.goto(`/${locale}/contact`);await page.locator('[name=fullName]').fill('Local Test');await page.locator('[name=email]').fill('local@example.com');await page.locator('[name=projectCategory]').selectOption('Masterplan');await page.locator('[name=projectVision]').fill('Intercepted local verification only.');await page.locator('button[type=submit]').click();await expect.poll(()=>sent.length).toBe(1);expect(JSON.parse(sent[0].body)).toEqual({fullName:'Local Test',email:'local@example.com',projectType:'Masterplan',message:'Intercepted local verification only.'});expect(sent[0].type).toContain('application/json');
 await page.goto(`/${locale}/careers`);await page.locator('[name=fullName]').fill('Local Test');await page.locator('[name=email]').fill('local@example.com');await page.locator('[name=resume]').setInputFiles({name:'resume.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4 local mock')});await page.locator('button[type=submit]').click();await expect.poll(()=>sent.length).toBe(2);expect(sent[1].type).toContain('multipart/form-data; boundary=');expect(sent[1].body).toContain('name="resume"; filename="resume.pdf"');
 await page.goto(`/${locale}/clients`);await expect(page.locator('.design-header')).toBeVisible();await expect(page.locator('.design-footer')).toBeVisible();
 const action=page.locator('.design-footer nav>button');await action.click();await expect(page.locator('dialog')).toBeVisible();await page.locator('#catalogue-email').fill('local@example.com');const download=page.waitForEvent('download');await page.locator('dialog form button').click();await download;await expect.poll(()=>sent.length).toBe(3);expect(JSON.parse(sent[2].body)).toEqual({email:'local@example.com'});expect(sent[2].url).toContain('/brochure-request');await page.keyboard.press('Escape');await expect(action).toBeFocused();
});
test('small grids resize; heading precedes controls; gallery stays valid after revalidation',async({page})=>{
 let data=projects;
 await page.route('**/api/**',route=>route.fulfill({json:route.request().url().includes('/projects')?data:clients}));
 await page.goto('/en/projects?category=architectural');
 await expect(page.locator('.work-tiles .project-tile')).toHaveCount(1);
 await expect(page.locator('.work-tiles img')).toHaveAttribute('sizes','100vw');
 const grid=await page.locator('.work-tiles').boundingBox();const tile=await page.locator('.work-tiles .project-tile').boundingBox();expect(tile.width).toBe(grid.width);
 await page.locator('.work-tiles .project-tile').click();await expect(page.locator('#detail-heading')).toBeFocused();await page.keyboard.press('Tab');await expect(page.getByRole('button',{name:'Close',exact:true})).toBeFocused();await page.keyboard.press('Tab');await expect(page.getByRole('button',{name:'Previous photo',exact:true})).toBeFocused();
 await page.getByRole('button',{name:'Next photo',exact:true}).click();
 data=projects.map((project,index)=>index===0?{...project,images:[project.images[0]]}:project);
 await page.evaluate(()=>{const original=Date.now;Date.now=()=>original()+31000;Object.defineProperty(document,'visibilityState',{configurable:true,value:'visible'});document.dispatchEvent(new Event('visibilitychange'));});
 await expect(page.locator('.photo-controls')).toHaveCount(0);await expect(page.locator('.detail-stage img')).toHaveAttribute('src','/images/img1.jpg');
});
test('RTL ticker remains within its visible band',async({page})=>{
 await mock(page);await page.goto('/ar');await expect(page.locator('.ticker-run').first()).toContainText('عميل فعلي');
 await expect(page.locator('.ticker-window')).toHaveCSS('direction','ltr');
});
