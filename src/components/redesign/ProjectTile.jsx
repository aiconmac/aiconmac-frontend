import {useLocale} from 'next-intl';
import {localized} from '@/lib/portfolio.mjs';
import Media from './Media';
export default function ProjectTile({project, className = '', sizes, priority = false}) {
  const locale = useLocale();
  const meta = [project.category && <span key="c" {...localized(project.category, 'name', locale)} />, project.scale && <span key="s" lang="en" dir="ltr">{project.scale}</span>].filter(Boolean);
  return <a tabIndex={0} href={`/${locale}/projects/${project.slug}`} className={`project-tile ${className}`} data-project={project.slug}>
    <Media key={project.images[0]?.url} src={project.images[0]?.url} alt="" priority={priority} sizes={sizes || (className === 'lead-tile' ? '(max-width: 899px) 100vw, 67vw' : className === 'wide-tile' ? '(max-width: 600px) 100vw, 50vw' : undefined)} />
    <span className="tile-caption"><span className="tile-title" {...localized(project, 'title', locale)} />{meta.length > 0 && <span className="tile-meta">{meta.flatMap((part, i) => i ? [' · ', part] : [part])}</span>}</span>
  </a>;
}
