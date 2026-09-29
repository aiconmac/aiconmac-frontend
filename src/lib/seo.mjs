export const SITE = 'https://aiconmac.com';
export const LOCALES = ['en', 'ar'];
export function pageMetadata({locale, path, title, description, image}) {
  const og = image || `${SITE}/og-image.jpg`;
  const url = `${SITE}/${locale}${path}`;
  const languages = Object.fromEntries(LOCALES.map(code => [code, `${SITE}/${code}${path}`]));
  languages['x-default'] = `${SITE}/en${path}`;
  return {
    title, description,
    alternates: {canonical: url, languages},
    openGraph: {title, description, url, siteName: 'Aiconmac', locale: locale === 'ar' ? 'ar_AE' : 'en_US', type: 'website', images: [{url: og, width: 1200, height: 630}]},
    twitter: {card: 'summary_large_image', title, description, images: [og]},
  };
}
