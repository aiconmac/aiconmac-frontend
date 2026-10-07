import {getTranslations} from 'next-intl/server';
import Media from './Media';
import CatalogueAction from './CatalogueAction';
export default async function Enquire({locale, image}) {
  const t = await getTranslations({locale, namespace: 'Design'});
  return <section id="enquire" className="enquire-section"><div className="enquire-box"><div className="enquire-photo">{image && <Media src={image} sizes="(min-width: 1148px) 660px, 60vw" />}</div><h2>{t.rich('enquireLines', {br: () => <br />})}</h2><div className="enquire-rows"><div><p>{t('enquiryNote')}</p><div className="design-actions"><a className="design-button orange" href={`/${locale}/contact#enquire-form`}>{t('enquireAction')} <span className="arrow" aria-hidden="true">→</span></a><CatalogueAction className="design-button" download /></div></div><a href="https://wa.me/971542446300" rel="noopener"><span>{t('whatsapp')}</span><span><span dir="ltr" lang="en">+971 54 244 6300</span> · <span>{t('whatsappNote')}</span></span></a></div></div></section>;
}
