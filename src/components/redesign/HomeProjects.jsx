'use client';
import {useLocale, useTranslations} from 'next-intl';
import useCollection from '@/hooks/useCollection';
import {localized} from '@/lib/portfolio.mjs';
import ProjectTile from './ProjectTile';
import CollectionStatus from './CollectionStatus';
export default function HomeProjects() {
  const collection = useCollection('/projects?isPublished=true');
  const locale = useLocale();
  const t = useTranslations('Design');
  const projects = collection.data.filter(project => project.images.length).slice(0, 5);
  const lead = projects[0];
  const description = lead && localized(lead, 'description', locale);
  return <section aria-label={t('selected')}>
    <CollectionStatus {...collection} empty={!projects.length} />
    {lead && <div className="home-tiles ruled-grid">
      <ProjectTile project={lead} className="lead-tile" priority />
      <div className="text-tile"><span className="eyebrow" {...localized(lead, 'title', locale)} /><p {...description}>{description.children.length > 220 ? description.children.slice(0, 217) + '…' : description.children}</p></div>
      {lead.images[1] && <ProjectTile project={lead} shot={1} />}
      {projects.slice(1, 3).map(project => <ProjectTile key={project.id} project={project} />)}
      <a className="text-tile orange" href={`/${locale}/projects`}><span className="eyebrow">{t('work')}</span><p>{t('explore')} →</p></a>
      {projects.slice(3).map(project => <ProjectTile className="wide-tile" key={project.id} project={project} />)}
    </div>}
  </section>;
}
