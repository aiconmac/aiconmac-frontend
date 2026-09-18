export class MalformedResponse extends Error {}
const text = value => typeof value === 'string' ? value.trim() : '';
export function normalizeProjects(data) {
  if (!Array.isArray(data) || data.some(p => !p || typeof p !== 'object' || typeof p.isPublished !== 'boolean')) throw new MalformedResponse('Expected a project collection');
  const seen = new Set();
  return data.filter(p => p?.isPublished === true).map(p => {
    if (!text(p.id) || !text(p.title) || seen.has(p.id)) throw new MalformedResponse('Invalid project identity');
    seen.add(p.id);
    const images = (Array.isArray(p.images) ? p.images : []).filter(image =>
      (!image?.projectId || image.projectId === p.id) && typeof image?.url === 'string' && /^(https?:\/\/|\/(?!\/))\S+$/.test(image.url.trim())
    ).map(image => ({...image, url: image.url.trim()}));
    return {...p, category: text(p.category), images, numeral: String(seen.size).padStart(2, '0')};
  });
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
const pending = new Map();
export function loadCollection(path, fetchData) {
  if (!pending.has(path)) pending.set(path, Promise.resolve().then(() => fetchData(path)).then(path.startsWith('/projects') ? normalizeProjects : normalizeClients).finally(() => pending.delete(path)));
  return pending.get(path);
}
