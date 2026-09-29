'use client';
import {useRef, useSyncExternalStore} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {usePathname} from 'next/navigation';
import LanguageLinks from '@/components/redesign/LanguageLinks';
function onHashChange(callback) {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}
export default function SiteNavbar() {
  const t = useTranslations('Design');
  const locale = useLocale();
  const pathname = usePathname();
  const menu = useRef(null);
  const hash = useSyncExternalStore(onHashChange, () => window.location.hash, () => '');
  const onWork = pathname.endsWith('/projects');
  const onClients = onWork && hash === '#clients';
  const links = <><a tabIndex={0} href={`/${locale}/projects`} aria-current={onWork && !onClients ? 'page' : undefined}>{t('work')}</a><a tabIndex={0} href={`/${locale}#studio`}>{t('studio')}</a><a tabIndex={0} href={`/${locale}/projects#clients`} aria-current={onClients ? 'location' : undefined}>{t('clients')}</a><a tabIndex={0} href={`/${locale}/contact`} aria-current={pathname.endsWith('/contact') ? 'page' : undefined}>{t('contact')}</a></>;
  return <header className="design-header"><a className="skip-link" href="#main-content">{t('skip')}</a><a className="brand" href={`/${locale}`}>Aiconmac</a><nav className="desktop-nav" aria-label={t('menu')}>{links}</nav><div className="header-actions"><LanguageLinks /><a className="design-button orange header-send" href={`/${locale}/contact#enquire-form`}>{t('enquireAction')} →</a></div><details ref={menu} className="mobile-menu" onKeyDown={event => { if (event.key === 'Escape') {menu.current.open = false; menu.current.querySelector('summary').focus();} }}><summary>{t('menu')}</summary><nav aria-label={t('menu')} onClick={() => {menu.current.open = false;}}><a className="design-button orange" href={`/${locale}/contact#enquire-form`}>{t('enquireAction')} →</a>{links}</nav></details></header>;
}
