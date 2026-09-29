'use client';
import {useSyncExternalStore} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {localized, portfolioUrl} from '@/lib/portfolio.mjs';
import ProjectTile from './ProjectTile';
const subscribe = notify => { window.addEventListener('category-change', notify); return () => window.removeEventListener('category-change', notify); };
export default function WorkProjects({projects, categories}) {
  const locale = useLocale();
  const t = useTranslations('Design');
  const available = categories.filter(category => projects.some(project => project.category?.slug === category.slug));
  const requested = useSyncExternalStore(subscribe, () => new URLSearchParams(window.location.search).get('category'), () => null);
  const category = available.some(item => item.slug === requested) ? requested : 'all';
  const filtered = projects.filter(project => category === 'all' || project.category?.slug === category);
  const select = slug => { window.history.replaceState(null, '', portfolioUrl(window.location.href, {category: slug})); window.dispatchEvent(new Event('category-change')); };
  return <>
    <div className="filter-bar"><h1>{t('work')}</h1><button className="design-button" aria-pressed={category === 'all'} onClick={() => select(null)}>{t('all')} · {projects.length}</button>{available.map(item => <button className="design-button" aria-pressed={category === item.slug} key={item.slug} onClick={() => select(item.slug)} {...localized(item, 'name', locale)} />)}</div>
    {!projects.length && <p className="collection-status">{t('empty')}</p>}
    {!!projects.length && !filtered.length && <p className="collection-status">{t('emptyFilter')}</p>}
    <div className="work-tiles ruled-grid" data-count={filtered.length}>{filtered.map(project => <ProjectTile key={project.id} project={project} sizes={filtered.length === 1 ? '100vw' : filtered.length === 2 ? '(max-width: 600px) 100vw, 50vw' : undefined} />)}</div>
  </>;
}
