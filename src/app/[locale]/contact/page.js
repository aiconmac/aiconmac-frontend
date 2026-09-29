import {getTranslations, setRequestLocale} from 'next-intl/server';
import {getCategories} from '@/lib/build-data.mjs';
import {pageMetadata} from '@/lib/seo.mjs';
import ContactForm from '@/components/redesign/ContactForm';
const ADDRESS = 'Warehouse 4, Near Dyna Trade, Street 15, Industrial Area 17, Sharjah, United Arab Emirates';
export async function generateMetadata({params}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Design'});
  return pageMetadata({locale, path: '/contact', title: t('meta.contact.title'), description: t('meta.contact.description')});
}
export default async function ContactPage({params}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'Design'});
  const categories = await getCategories();
  return <main id="main-content" className="design-page"><section className="contact-grid design-section">
    <div>
      <p className="eyebrow">{t('contact')}</p>
      <h1>{t('enquire')}</h1>
      <p className="body-copy">{t('enquiryNote')}</p>
      <div className="contact-details">
        <a className="whatsapp" href="https://wa.me/971542446300" rel="noopener"><span className="eyebrow">{t('whatsapp')}</span><span dir="ltr" lang="en">+971 54 244 6300</span><span className="hint">{t('whatsappNote')}</span></a>
        <a href="tel:+97165357585"><span className="eyebrow">{t('phone')}</span><span dir="ltr">+971 6 535 7585</span></a>
        <a href="mailto:marketing@aiconmac.com"><span className="eyebrow">{t('email')}</span><span dir="ltr">marketing@aiconmac.com</span></a>
        <div><span className="eyebrow">{t('hours')}</span><span>{t('hoursValue')}</span></div>
        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`} rel="noopener"><span className="eyebrow">{t('directions')}</span><span lang="en" dir="ltr">{ADDRESS}</span></a>
        <p className="hint">{t('careersLine')} <a dir="ltr" href="mailto:marketing@aiconmac.com?subject=Careers">marketing@aiconmac.com</a></p>
      </div>
    </div>
    <ContactForm categories={categories} />
  </section></main>;
}
