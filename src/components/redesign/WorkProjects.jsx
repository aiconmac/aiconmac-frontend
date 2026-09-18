'use client';
import {useEffect, useRef, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {useLocale, useTranslations} from 'next-intl';
import useCollection from '@/hooks/useCollection';
import {localized, portfolioUrl} from '@/lib/portfolio.mjs';
import ProjectTile from './ProjectTile';
import CollectionStatus from './CollectionStatus';
import Media from './Media';

function Detail({project, close}) {
  const t = useTranslations('Design');
  const categories = useTranslations('Categories');
  const locale = useLocale();
  const [requestedShot, setShot] = useState(0);
  const shot = Math.min(requestedShot, Math.max(0, project.images.length - 1));
  const heading = useRef(null);
  useEffect(() => { heading.current?.focus({preventScroll: true}); heading.current?.closest('section').scrollIntoView({block: 'start'}); }, []);
  const categoryKey = project.category.replaceAll('-', '_');
  return <section className="project-detail" aria-labelledby="detail-heading" onKeyDown={event => { if (event.key === 'Escape') close(); }}>
    <div className="detail-head"><h2 id="detail-heading" tabIndex={-1} ref={heading} {...localized(project, 'title', locale)} /><button className="design-button" onClick={close}>{t('close')}</button></div>
    <div className="detail-gallery"><div className="detail-stage"><Media key={project.images[shot]?.url} src={project.images[shot]?.url} alt={localized(project, 'title', locale).children} priority sizes="(max-width: 899px) 100vw, 67vw" /><span className="plate-number" aria-hidden="true">{project.numeral}</span></div>
      {project.images.length > 1 && <><div className="photo-controls"><button onClick={() => setShot((shot + project.images.length - 1) % project.images.length)}>{t('previous')}</button><span aria-live="polite">{t('photo')} {shot + 1} / {project.images.length}</span><button onClick={() => setShot((shot + 1) % project.images.length)}>{t('next')}</button></div><div className="thumbnails">{project.images.map((image, index) => <button key={image.id || image.url} aria-label={`${t('photo')} ${index + 1}`} aria-pressed={index === shot} onClick={() => setShot(index)}><Media src={image.url} sizes="72px" /></button>)}</div></>}
    </div>
    <div className="detail-copy">
      {project.category && <div className="detail-fact"><span className="eyebrow">{t('category')}</span><span>{categories.has(categoryKey) ? categories(categoryKey) : <span {...localized(project, 'category', locale)} />}</span></div>}
      {localized(project, 'badge', locale).children && <div className="detail-fact"><span {...localized(project, 'badge', locale)} /></div>}
      <p className="detail-description" {...localized(project, 'description', locale)} />
      <a className="design-button orange" href={`/${locale}/contact`}>{t('send')} →</a>
    </div>
  </section>;
}

export default function WorkProjects() {
  const collection = useCollection('/projects?isPublished=true');
  const params = useSearchParams();
  const locale = useLocale();
  const t = useTranslations('Design');
  const categories = useTranslations('Categories');
  const origin = useRef(null);
  const gridHeading = useRef(null);
  const previousId = useRef(null);
  const category = params.get('category') || 'all';
  const projectId = params.get('project');
  const ids = [...new Set(collection.data.map(project => project.category).filter(Boolean))];
  const selected = collection.data.find(project => project.id === projectId);
  const filtered = collection.data.filter(project => category === 'all' || category === project.category);
  function update(changes, replace = false) {
    window.history[replace ? 'replaceState' : 'pushState'](null, '', portfolioUrl(window.location.href, changes));
  }
  useEffect(() => {
    if (collection.status === 'success' && category !== 'all' && !collection.data.some(project => project.category === category)) {
      window.history.replaceState(null, '', portfolioUrl(window.location.href, {category: null}));
    }
  }, [collection.status, collection.data, category]);
  useEffect(() => {
    if (previousId.current && !projectId) {
      (origin.current?.isConnected ? origin.current : gridHeading.current)?.focus();
    }
    previousId.current = projectId;
  }, [projectId]);
  return <>
    <div className="filter-bar"><h1 tabIndex={-1} ref={gridHeading}>{t('work')}</h1><button className="design-button" aria-pressed={category === 'all'} onClick={() => update({category: null, project: null})}>{t('all')} · {collection.data.length}</button>{ids.map(id => <button className="design-button" aria-pressed={category === id} key={id} onClick={() => update({category: id, project: null})}>{categories.has(id.replaceAll('-', '_')) ? categories(id.replaceAll('-', '_')) : <span {...localized(collection.data.find(project => project.category === id), 'category', locale)} />}</button>)}</div>
    <CollectionStatus {...collection} empty={!collection.data.length} />
    {selected && <Detail key={selected.id} project={selected} close={() => update({project: null})} />}
    {projectId && !selected && collection.status === 'success' && <div className="collection-status" role="status"><p>{t('unavailable')}</p><button className="design-button" onClick={() => update({project: null})}>{t('close')}</button></div>}
    {collection.status === 'success' && !!collection.data.length && !filtered.length && <p className="collection-status">{t('emptyFilter')}</p>}
    <div className="work-tiles ruled-grid" data-count={filtered.length}>{filtered.map(project => <ProjectTile key={project.id} project={project} sizes={filtered.length === 1 ? "100vw" : filtered.length === 2 ? "(max-width: 600px) 100vw, 50vw" : undefined} href={portfolioUrl(`/${locale}/projects?${params.toString()}`, {project: project.id})} onClick={event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault(); origin.current = event.currentTarget; update({project: project.id});
    }} />)}</div>
  </>;
}
