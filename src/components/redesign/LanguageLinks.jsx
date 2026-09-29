'use client';
import {Suspense} from 'react';
import {usePathname, useSearchParams} from 'next/navigation';
import {useLocale, useTranslations} from 'next-intl';
import {localePath} from '@/lib/portfolio.mjs';
const LOCALES = [['en', 'EN'], ['ar', 'العربية']];
function LinksWithQuery() {
  const pathname = usePathname();
  const params = useSearchParams();
  const locale = useLocale();
  const search = params.toString() ? `?${params}` : '';
  return LOCALES.map(([code, label]) => <a key={code} href={localePath(pathname, search, code)} hreflang={code} lang={code} aria-current={code === locale ? 'true' : undefined}>{label}</a>);
}
function LinksWithoutQuery() {
  const pathname = usePathname();
  const locale = useLocale();
  return LOCALES.map(([code, label]) => <a key={code} href={localePath(pathname, '', code)} hreflang={code} lang={code} aria-current={code === locale ? 'true' : undefined}>{label}</a>);
}
export default function LanguageLinks() {
  const t = useTranslations('Design');
  return <nav className="language-links" aria-label={t('language')}><Suspense fallback={<LinksWithoutQuery />}><LinksWithQuery /></Suspense></nav>;
}
