import {NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import Footer from '@/components/layout/Footer.jsx';
import SiteNavbar from '@/components/layout/SiteNavbar';
import en from '../../messages/en.json';
import ar from '../../messages/ar.json';
import './redesign.css';

const Notice = ({t, lang, dir}) => <section className="design-section" lang={lang} dir={dir}>
  <div><p className="eyebrow">{t.errorCode}</p><h1>{t.title}</h1><p>{t.description}</p></div>
  <div className="design-actions"><a className="design-button orange" href={`/${lang}`}>{t.backHome}</a><a className="design-button" href={`/${lang}/projects`}>{t.exploreProjects}</a></div>
</section>;

export const metadata = {title: en.NotFound.title};

export default function RootNotFound() {
  setRequestLocale('en');
  return <html lang="en"><head>
    <link rel="preload" href="/fonts/schibsted-grotesk.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    <link rel="preload" href="/fonts/noto-kufi-arabic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
  </head><body><NextIntlClientProvider locale="en" messages={en}>
    <SiteNavbar />
    <main id="main-content" className="design-page">
      <Notice t={en.NotFound} lang="en" dir="ltr" />
      <Notice t={ar.NotFound} lang="ar" dir="rtl" />
    </main>
    <Footer />
  </NextIntlClientProvider></body></html>;
}
