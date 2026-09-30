import {getLocale, getTranslations} from 'next-intl/server';
import CatalogueAction from '@/components/redesign/CatalogueAction';
import Logo from '@/components/redesign/Logo';
export default async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations('Design');
  return <footer className="design-footer"><div><a className="brand" href={`/${locale}`}><Logo dark /></a>{/* OWNER_CONTENT: legal wording pending from the owner. */}<p className="legal">{t('legal')}</p></div><div><span>{t('addressFull')}</span><a dir="ltr" href="tel:+97165357585">+971 6 535 7585</a><a dir="ltr" href="mailto:marketing@aiconmac.com">marketing@aiconmac.com</a></div><nav aria-label={t('menu')}><a href={`/${locale}/projects`}>{t('work')}</a><a href={`/${locale}/projects#clients`}>{t('clients')}</a><a href={`/${locale}/contact`}>{t('contact')}</a><CatalogueAction /></nav></footer>;
}
