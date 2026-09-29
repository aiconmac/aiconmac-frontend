import {getTranslations, setRequestLocale} from 'next-intl/server';
export default async function ContactPage({params}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'Design'});
  return <main id="main-content" className="design-page"><section className="contact-grid design-section"><div><p className="eyebrow">{t('contact')}</p><h1>{t('enquire')}</h1><p>{t('enquiryNote')}</p><a className="design-button orange" dir="ltr" href="mailto:marketing@aiconmac.com">marketing@aiconmac.com</a></div></section></main>;
}
