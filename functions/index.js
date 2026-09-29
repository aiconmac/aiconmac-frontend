const LOCALES = ['en', 'ar'];
export function pickLocale(acceptLanguage) {
  for (const part of (acceptLanguage || '').toLowerCase().split(',')) {
    const tag = part.trim().split(';')[0].slice(0, 2);
    if (LOCALES.includes(tag)) return tag;
  }
  return 'en';
}
export function onRequest({request}) {
  const location = new URL(`/${pickLocale(request.headers.get('accept-language'))}`, request.url);
  return new Response(null, {status: 302, headers: {Location: location.toString(), Vary: 'Accept-Language'}});
}
