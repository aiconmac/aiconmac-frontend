import {Suspense} from 'react';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import WorkProjects from '@/components/redesign/WorkProjects';
import Clients from '@/components/redesign/Clients';
export default async function WorkPage({params}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'Design'});
  return <main id="main-content" className="design-page"><Suspense fallback={<div className="collection-status"><h1>{t('work')}</h1><p>{t('loading')}</p></div>}><WorkProjects /></Suspense><section id="clients" className="clients-section design-section"><div><h2>{t('clients')}</h2><p>{t('clientsIntro')}</p></div><Clients /></section></main>;
}
