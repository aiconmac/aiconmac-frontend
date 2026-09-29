import {useLocale} from 'next-intl';
import {localized} from '@/lib/portfolio.mjs';
import Media from './Media';
import ProjectFacts from './ProjectFacts';
export default function ProjectTile({project, shot = 0, className = '', sizes, priority = false}) {
  const locale = useLocale();
  return <a href={`/${locale}/projects/${project.slug}`} className={`project-tile ${className}`} data-project={project.slug}>
    <Media key={project.images[shot]?.url} src={project.images[shot]?.url} alt="" priority={priority} sizes={sizes || (className === 'lead-tile' ? '(max-width: 899px) 100vw, 67vw' : className === 'wide-tile' ? '(max-width: 600px) 100vw, 50vw' : undefined)} />
    <span className="plate-number" aria-hidden="true">{project.numeral}</span>
    <span className="tile-caption"><span className="tile-title" {...localized(project, 'title', locale)} />{project.category && <span {...localized(project.category, 'name', locale)} />}<ProjectFacts project={project} className="tile-facts" /></span>
  </a>;
}
