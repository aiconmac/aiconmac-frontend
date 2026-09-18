import {getTranslations, setRequestLocale} from 'next-intl/server';
import HomeProjects from '@/components/redesign/HomeProjects';
import Clients from '@/components/redesign/Clients';
import Enquire from '@/components/redesign/Enquire';
export default async function HomePage({params}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'Design'});
  return <main id="main-content" className="design-page"><section className="home-hero"><h1>{t('hero')}</h1><div><p>{t('intro')}</p><a className="design-button orange" href="#enquire">{t('send')} →</a></div></section><Clients ticker /><HomeProjects /><section id="studio" className="studio-grid" aria-label={t('studio')}>{[1,2,3,4].map(n => <div key={n}><h2 className="eyebrow">0{n} · {t(`studio${n}`)}</h2><p>{t(`studio${n}Text`)}</p></div>)}</section><Enquire locale={locale} /></main>;
}
