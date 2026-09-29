'use client';
import {useLocale, useTranslations} from 'next-intl';
import {localized} from '@/lib/portfolio.mjs';
import Media from './Media';
export default function ProjectTile({project, shot = 0, className = '', sizes, href, onClick, priority = false}) {
  const locale = useLocale();
  const categories = useTranslations('Design.categories');
  const key = project.category.replaceAll('-', '_');
  const category = categories.has(key) ? categories(key) : project.category;
  return <a href={href || `/${locale}/projects?project=${encodeURIComponent(project.id)}`} className={`project-tile ${className}`} onClick={onClick} data-project={project.id}>
    <Media key={project.images[shot]?.url} src={project.images[shot]?.url} alt="" priority={priority} sizes={sizes || (className === 'lead-tile' ? '(max-width: 899px) 100vw, 67vw' : className === 'wide-tile' ? '(max-width: 600px) 100vw, 50vw' : undefined)} />
    <span className="plate-number" aria-hidden="true">{project.numeral}</span>
    <span className="tile-caption"><span {...localized(project, 'title', locale)} />{categories.has(key) ? <span>{category}</span> : <span {...localized(project, 'category', locale)} />}</span>
  </a>;
}
