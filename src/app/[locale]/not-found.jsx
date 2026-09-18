import {getLocale, getTranslations} from 'next-intl/server';
export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations('NotFound');
  return <main id="main-content" className="design-page"><section className="design-section"><div><p className="eyebrow">{t('errorCode')}</p><h1>{t('title')}</h1><p>{t('description')}</p></div><div><a className="design-button orange" href={`/${locale}`}>{t('backHome')}</a> <a className="design-button" href={`/${locale}/projects`}>{t('exploreProjects')}</a></div></section></main>;
}
