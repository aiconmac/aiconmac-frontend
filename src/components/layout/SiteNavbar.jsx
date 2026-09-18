'use client';
import {useRef} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {usePathname} from 'next/navigation';
export default function SiteNavbar() {
  const t = useTranslations('Design');
  const locale = useLocale();
  const pathname = usePathname();
  const menu = useRef(null);
  const links = <><a href={`/${locale}/projects`} aria-current={pathname.endsWith('/projects') ? 'page' : undefined}>{t('work')}</a><a href={`/${locale}#studio`}>{t('studio')}</a><a href={`/${locale}/projects#clients`}>{t('clients')}</a></>;
  return <header className="design-header"><a className="skip-link" href="#main-content">{t('skip')}</a><a className="brand" href={`/${locale}`}>Aiconmac 3D</a><nav className="desktop-nav" aria-label={t('menu')}>{links}</nav><div className="header-actions"><a className="header-phone" dir="ltr" href="tel:+97165357585">+971 6 535 7585</a><label className="language-select"><span className="sr-only">{t('language')}</span><select value={locale} onChange={event => { window.location.assign(window.location.pathname.replace(/^\/(en|ar|ru)(?=\/|$)/, `/${event.target.value}`) + window.location.search + window.location.hash); }}><option value="en">EN</option><option value="ar">العربية</option><option value="ru">RU</option></select></label><a className="design-button orange header-send" href={`/${locale}#enquire`}>{t('send')} →</a></div><details ref={menu} className="mobile-menu" onKeyDown={event => { if (event.key === 'Escape') {menu.current.open = false; menu.current.querySelector('summary').focus();} }}><summary>{t('menu')}</summary><nav aria-label={t('menu')} onClick={() => {menu.current.open = false;}}>{links}<a href={`/${locale}/contact`}>{t('contact')}</a><a href={`/${locale}/careers`}>{t('careers')}</a></nav></details></header>;
}
