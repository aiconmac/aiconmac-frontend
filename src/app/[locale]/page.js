import {getTranslations, setRequestLocale} from 'next-intl/server';
import {getProjects} from '@/lib/build-data.mjs';
import HomeProjects from '@/components/redesign/HomeProjects';
import Clients from '@/components/redesign/Clients';
import Enquire from '@/components/redesign/Enquire';
import Quotes from '@/components/redesign/Quotes';
import {pageMetadata} from '@/lib/seo.mjs';
export async function generateMetadata({params}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Design'});
  return pageMetadata({locale, path: '', title: t('meta.home.title'), description: t('meta.home.description')});
}
export default async function HomePage({params}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'Design'});
  const projects = await getProjects();
  return <main id="main-content" className="design-page"><section className="home-hero"><h1>{t('hero')}</h1><div><p>{t('intro')}</p><p className="hero-facts">{t('heroMeta')}</p><a className="design-button orange" href={`/${locale}/contact#enquire-form`}>{t('enquireAction')} →</a></div></section><Clients ticker /><HomeProjects projects={projects} /><section id="studio" className="studio-grid" aria-label={t('studio')}>{[1,2,3,4].map(n => <div key={n}><h2 className="eyebrow">0{n} · {t(`studio${n}`)}</h2><p>{t(`studio${n}Text`)}</p></div>)}<p className="studio-story">{t('studioStory')}</p></section><Quotes /><Enquire locale={locale} /></main>;
}
