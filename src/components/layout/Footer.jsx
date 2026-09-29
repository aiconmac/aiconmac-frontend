import {getLocale, getTranslations} from 'next-intl/server';
import CatalogueAction from '@/components/redesign/CatalogueAction';
export default async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations('Design');
  return <footer className="design-footer"><a href={`/${locale}`}>Aiconmac 3D</a><span>{t('address')}</span><nav aria-label={t('menu')}><a href={`/${locale}/projects`}>{t('work')}</a><a href={`/${locale}/projects#clients`}>{t('clients')}</a><a href={`/${locale}/contact`}>{t('contact')}</a><CatalogueAction /></nav></footer>;
}
