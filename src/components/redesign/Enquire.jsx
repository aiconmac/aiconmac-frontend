import {getTranslations} from 'next-intl/server';
import Media from './Media';
export default async function Enquire({locale, image}) {
  const t = await getTranslations({locale, namespace: 'Design'});
  return <section id="enquire" className="enquire-section design-section">{image && <Media src={image} sizes="34vw" />}<h2>{t('enquire')}</h2><div className="enquire-rows"><div><p>{t('enquiryNote')}</p><a className="design-button orange" href={`/${locale}/contact#enquire-form`}>{t('enquireAction')} <span className="arrow" aria-hidden="true">→</span></a></div><a href="https://wa.me/971542446300" rel="noopener"><span>{t('whatsapp')}</span><span><span dir="ltr" lang="en">+971 54 244 6300</span> · <span>{t('whatsappNote')}</span></span></a></div></section>;
}
