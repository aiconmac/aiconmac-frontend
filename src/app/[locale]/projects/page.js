import {getTranslations, setRequestLocale} from 'next-intl/server';
import {getCategories, getProjects} from '@/lib/build-data.mjs';
import WorkProjects from '@/components/redesign/WorkProjects';
import Clients from '@/components/redesign/Clients';
export default async function WorkPage({params}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'Design'});
  const [projects, categories] = await Promise.all([getProjects(), getCategories()]);
  return <main id="main-content" className="design-page"><WorkProjects projects={projects} categories={categories} /><section id="clients" className="clients-section design-section"><div><h2>{t('clients')}</h2><p>{t('clientsIntro')}</p></div><Clients /></section></main>;
}
