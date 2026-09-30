import {getTranslations, setRequestLocale} from 'next-intl/server';
import {getCategories, getProjects} from '@/lib/build-data.mjs';
import WorkProjects from '@/components/redesign/WorkProjects';
import Clients from '@/components/redesign/Clients';
import {pageMetadata} from '@/lib/seo.mjs';
export async function generateMetadata({params}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Design'});
  return pageMetadata({locale, path: '/projects', title: t('meta.work.title'), description: t('meta.work.description')});
}
export default async function WorkPage({params}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'Design'});
  const [projects, categories] = await Promise.all([getProjects(), getCategories()]);
  return <main id="main-content" className="design-page"><WorkProjects projects={projects} categories={categories} /><section id="clients" className="clients-section design-section"><Clients title={t('clients')} intro={t('clientsIntro')} /></section></main>;
}
