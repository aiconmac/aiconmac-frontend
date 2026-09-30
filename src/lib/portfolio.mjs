export class MalformedResponse extends Error {}
const SLUG = /^[a-z0-9-]+$/;
const text = value => typeof value === 'string' ? value.trim() : '';
function normalizeCategory(value) {
  return value && typeof value === 'object' && text(value.slug) && text(value.name) ? {slug: value.slug.trim(), name: value.name.trim(), name_ar: text(value.name_ar) || null} : null;
}
export function normalizeProjects(data) {
  if (!Array.isArray(data) || data.some(p => !p || typeof p !== 'object' || typeof p.isPublished !== 'boolean')) throw new MalformedResponse('Expected a project collection');
  const seen = new Set();
  return data.filter(p => p.isPublished === true).filter(p => {
    if (typeof p.slug !== 'string' || !p.slug.trim() || SLUG.test(p.slug.trim())) return true;
    console.warn(`Skipping project ${p.id}: slug ${JSON.stringify(p.slug)} is not lowercase letters, digits and hyphens`);
    return false;
  }).map(p => {
    if (!text(p.id) || !text(p.slug) || !text(p.title) || seen.has(p.id)) throw new MalformedResponse('Invalid project identity');
    seen.add(p.id);
    const images = (Array.isArray(p.images) ? p.images : []).filter(image =>
      (!image?.projectId || image.projectId === p.id) && typeof image?.url === 'string' && /^(https?:\/\/|\/(?!\/))\S+$/.test(image.url.trim())
    ).map(image => ({...image, url: image.url.trim()}));
    return {...p, slug: p.slug.trim(), category: normalizeCategory(p.category), scale: text(p.scale) || null, leadTimeDays: Number.isInteger(p.leadTimeDays) && p.leadTimeDays > 0 ? p.leadTimeDays : null, clientName: text(p.clientName) || null, images};
  });
}
export function normalizeCategories(data) {
  if (!Array.isArray(data)) throw new MalformedResponse('Expected a category collection');
  const categories = data.map(normalizeCategory);
  if (categories.some(category => !category)) throw new MalformedResponse('Invalid category');
  return categories;
}
export function normalizeClients(data) {
  if (!Array.isArray(data) || data.some(c => !text(c?.id) || !text(c?.name))) throw new MalformedResponse('Invalid client collection');
  return data;
}
export function localized(item, field, locale) {
  const translated = locale !== 'en' && text(item?.[`${field}_${locale}`]);
  return {children: translated || text(item?.[field]), lang: translated ? locale : 'en', dir: translated && locale === 'ar' ? 'rtl' : 'ltr'};
}
export function portfolioUrl(href, changes) {
  const url = new URL(href, 'http://local');
  for (const [key, value] of Object.entries(changes)) {
    if (value && value !== 'all') url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  return url.pathname + url.search + url.hash;
}
export function imageVariant(url, width) {
  const prefix = 'https://res.cloudinary.com/dgr0y1scl/image/upload/';
  return url?.startsWith(prefix) ? `${prefix}f_auto,q_auto,c_limit,w_${width}/${url.slice(prefix.length)}` : url;
}
export function imageSrcSet(url) {
  return imageVariant(url, 960) === url ? undefined : [480, 800, 1200, 1800, 2400].map(w => `${imageVariant(url, w)} ${w}w`).join(', ');
}
export function localePath(pathname, search, locale) {
  const rest = pathname.replace(/^\/(en|ar)(?=\/|$)/, '').replace(/^\/$/, '');
  return `/${locale}${rest}${search || ''}`;
}
const pending = new Map();
export function dropPending(path) { pending.delete(path); }
export function loadCollection(path, fetchData) {
  if (!pending.has(path)) {
    const promise = Promise.resolve().then(() => fetchData(path)).then(path.startsWith('/projects') ? normalizeProjects : normalizeClients).finally(() => { if (pending.get(path) === promise) pending.delete(path); });
    pending.set(path, promise);
  }
  return pending.get(path);
}
