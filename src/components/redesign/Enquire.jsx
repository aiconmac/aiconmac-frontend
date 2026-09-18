import {getTranslations} from 'next-intl/server';
export default async function Enquire({locale}) {
  const t = await getTranslations({locale, namespace: 'Design'});
  return <section id="enquire" className="enquire-section design-section"><h2>{t('enquire')}</h2><div className="enquire-rows"><a className="orange" href="mailto:marketing@aiconmac.com"><span>{t('email')}</span><span dir="ltr">marketing@aiconmac.com</span></a><a href="tel:+97165357585"><span>{t('call')}</span><span dir="ltr">+971 6 535 7585</span></a><a href="tel:+971502792040"><span>{t('contact')}</span><span dir="ltr">+971 50 279 2040</span></a><p>{t('enquiryNote')} <a href={`/${locale}/contact`}>{t('contact')} →</a></p></div></section>;
}
