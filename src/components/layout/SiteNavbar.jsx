'use client';
import {useEffect, useRef, useState, useSyncExternalStore} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {usePathname} from 'next/navigation';
import LanguageLinks from '@/components/redesign/LanguageLinks';
import Logo from '@/components/redesign/Logo';
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
  const home = pathname === `/${locale}`;
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const hero = home && document.querySelector('.home-hero');
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), {rootMargin: '-60px 0px 0px 0px'});
    observer.observe(hero);
    return () => observer.disconnect();
  }, [home]);
  const onWork = pathname.endsWith('/projects');
  const onClients = onWork && hash === '#clients';
  const links = <><a tabIndex={0} href={`/${locale}/projects`} aria-current={onWork && !onClients ? 'page' : undefined}>{t('work')}</a><a tabIndex={0} href={`/${locale}#studio`}>{t('studio')}</a><a tabIndex={0} href={`/${locale}/projects#clients`} aria-current={onClients ? 'location' : undefined}>{t('clients')}</a><a tabIndex={0} href={`/${locale}/contact`} aria-current={pathname.endsWith('/contact') ? 'page' : undefined}>{t('contact')}</a></>;
  return <header className="design-header" data-over-hero={home && !pastHero ? '' : undefined}><a className="skip-link" href="#main-content">{t('skip')}</a><a className="brand" href={`/${locale}`}><Logo /></a><nav className="desktop-nav" aria-label={t('menu')}>{links}</nav><div className="header-actions"><LanguageLinks /><a className="design-button orange header-send" href={`/${locale}/contact#enquire-form`}>{t('enquireAction')} <span className="arrow" aria-hidden="true">→</span></a></div><details ref={menu} className="mobile-menu" onKeyDown={event => { if (event.key === 'Escape') {menu.current.open = false; menu.current.querySelector('summary').focus();} }}><summary>{t('menu')}</summary><nav aria-label={t('menu')} onClick={() => {menu.current.open = false;}}><a className="design-button orange" href={`/${locale}/contact#enquire-form`}>{t('enquireAction')} <span className="arrow" aria-hidden="true">→</span></a>{links}</nav></details></header>;
}
