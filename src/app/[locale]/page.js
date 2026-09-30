import {preload} from 'react-dom';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {getProjects} from '@/lib/build-data.mjs';
import {imageSrcSet, imageVariant, localized} from '@/lib/portfolio.mjs';
import Media from '@/components/redesign/Media';
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
  // Dusit Thani's second photo is the strongest full-model frame at 16:9; the rule after it covers the project being unpublished.
  const hero = projects.find(project => project.slug === 'dusit-thani-aqaar' && project.images.length) ?? projects.find(project => project.images.length);
  const heroUrl = hero ? (hero.images[1] ?? hero.images[0]).url : '/images/img1.jpg';
  preload(imageVariant(heroUrl, 960), {as: 'image', fetchPriority: 'high', imageSrcSet: imageSrcSet(heroUrl), imageSizes: '100vw'});
  return <main id="main-content" className="design-page"><section className="home-hero"><Media src={heroUrl} priority sizes="100vw" /><div className="hero-copy"><h1>{t('hero')}</h1><p>{t('intro')}</p><p className="hero-facts">{t('heroMeta')}</p><a className="design-button orange" href={`/${locale}/contact#enquire-form`}>{t('enquireAction')} <span className="arrow" aria-hidden="true">→</span></a></div>{hero && <a className="hero-slab" href={`/${locale}/projects/${hero.slug}`} {...localized(hero, 'title', locale)} />}</section><Clients ticker /><HomeProjects projects={projects} /><section id="studio" className="studio-grid" aria-label={t('studio')}>{[1,2,3,4].map(n => <div key={n}><h2 className="eyebrow">0{n} · {t(`studio${n}`)}</h2><p>{t(`studio${n}Text`)}</p></div>)}<p className="studio-story">{t('studioStory')}</p></section><Quotes /><Enquire locale={locale} image={projects.find(project => project.images.length)?.images[0].url} /></main>;
}
