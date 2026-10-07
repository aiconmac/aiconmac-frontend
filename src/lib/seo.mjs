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
export const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Aiconmac',
  legalName: 'Alpha Micro Models',
  brand: {'@type': 'Brand', name: 'Aiconmac'},
  url: SITE,
  logo: `${SITE}/images/logo-full.png`,
  image: `${SITE}/og-image.jpg`,
  telephone: '+97165357585',
  email: 'marketing@aiconmac.com',
  foundingDate: '2009',
  address: {'@type': 'PostalAddress', streetAddress: 'Warehouse 4, Near Dyna Trade, Street 15, Industrial Area 17', addressLocality: 'Sharjah', addressRegion: 'Sharjah', addressCountry: 'AE'},
  openingHoursSpecification: [{'@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '18:00'}],
  sameAs: ['https://www.linkedin.com/company/aiconmac-models/', 'https://www.instagram.com/aiconmac_models/', 'https://www.tiktok.com/@aiconmac3dmodels'],
};
