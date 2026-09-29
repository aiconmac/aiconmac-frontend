import {getLocale, getTranslations} from 'next-intl/server';
import {localized} from '@/lib/portfolio.mjs';
import ProjectTile from './ProjectTile';
export default async function HomeProjects({projects}) {
  const locale = await getLocale();
  const t = await getTranslations('Design');
  const shown = projects.filter(project => project.images.length).slice(0, 6);
  const lead = shown[0];
  if (!lead) return <p className="collection-status">{t('empty')}</p>;
  const description = localized(lead, 'description', locale);
  return <section aria-label={t('selected')} className="home-tiles ruled-grid">
    <ProjectTile project={lead} className="lead-tile" priority />
    <div className="text-tile"><span className="eyebrow">{lead.category ? <span {...localized(lead.category, 'name', locale)} /> : t('selected')}</span><h2 className="tile-headline" {...localized(lead, 'title', locale)} /><p className="body-copy" lang={description.lang} dir={description.dir}>{description.children.length > 220 ? description.children.slice(0, 217) + '…' : description.children}</p></div>
    {shown.slice(1, 4).map(project => <ProjectTile key={project.id} project={project} />)}
    <a className="text-tile orange" href={`/${locale}/projects`}><span className="eyebrow">{t('work')}</span><p className="tile-headline">{t('explore')} →</p></a>
    {shown.slice(4).map(project => <ProjectTile className="wide-tile" key={project.id} project={project} />)}
  </section>;
}
