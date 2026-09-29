import '../redesign.css';
import Footer from '@/components/layout/Footer.jsx';
import SiteNavbar from '@/components/layout/SiteNavbar';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { localBusinessJsonLd, pageMetadata, SITE } from '@/lib/seo.mjs';

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport = {
  themeColor: '#F3F1EC',
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Design' });
  return { metadataBase: new URL(SITE), ...pageMetadata({ locale, path: '', title: t('meta.home.title'), description: t('meta.home.description') }) };
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const beacon = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <link rel="preload" href={`/fonts/${locale === 'ar' ? 'noto-arabic' : 'archivo'}.woff2`} as="font" type="font/woff2" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
        {beacon && <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon={JSON.stringify({ token: beacon })} />}
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <SiteNavbar />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
