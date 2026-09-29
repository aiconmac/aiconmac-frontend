import {getTranslations} from 'next-intl/server';
export default async function Enquire({locale}) {
  const t = await getTranslations({locale, namespace: 'Design'});
  return <section id="enquire" className="enquire-section design-section"><h2>{t('enquire')}</h2><div className="enquire-rows"><a className="orange" href={`/${locale}/contact#enquire-form`}><span>{t('enquireAction')}</span><span>{t('enquiryNote')}</span></a><a href="https://wa.me/971542446300" rel="noopener"><span>{t('whatsapp')}</span><span><span dir="ltr" lang="en">+971 54 244 6300</span> · <span>{t('whatsappNote')}</span></span></a></div></section>;
}
