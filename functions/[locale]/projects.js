const LOCALES = ['en', 'ar'];
const API = 'https://api.aiconmac.com/api';
export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const locale = context.params.locale;
  if (!LOCALES.includes(locale)) return Response.redirect(new URL(`/en/projects${url.search}`, url).toString(), 301);
  const id = url.searchParams.get('project');
  if (!id) return context.next();
  const target = new URL(`/${locale}/projects`, url);
  try {
    const response = await (context.fetchSlug || fetch)(`${API}/projects/${encodeURIComponent(id)}`);
    if (response.ok) {
      const {slug} = await response.json();
      if (typeof slug === 'string' && slug) {
        target.pathname = `/${locale}/projects/${slug}`;
        return Response.redirect(target.toString(), 301);
      }
    }
  } catch {}
  return Response.redirect(target.toString(), 302);
}
